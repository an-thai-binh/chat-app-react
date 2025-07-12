import axios, { Axios, AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../utils/localStorageUtils';
import { ApiEndpoints } from '../constants/endpoints';



let isRefreshing = false;
let failedRequestQueue: {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
}[] = [];

const handleFailedRequestQueue = (error: AxiosError | null, token: string | null) => {
    failedRequestQueue.forEach(prom => {
        if(error) {
            prom.reject(error);
        } else if(token) {
            prom.resolve(token);
        }
    });
    failedRequestQueue = [];
}

const handleRefreshToken = async(): Promise<string> => {
    try {
        const refreshToken = getRefreshToken();
        if(!refreshToken) throw new Error("Refresh token not found");
        const response = await axios.post(ApiEndpoints.REFRESH, {
            token: refreshToken
        });
        if(response.data.success) {
            const {accessToken, refreshToken: newRefreshToken} = response.data.data;
            setAccessToken(accessToken);
            setRefreshToken(newRefreshToken);
            return accessToken;
        }
        throw new Error("Token not found");
    } catch(error: any) {
        setAccessToken("");
        setRefreshToken("");
        throw error;
    }
}

const api: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// đính kèm token cho mỗi request
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if(token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
 return config;   
});

// xử lý nếu gặp lỗi 401
api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<any> => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean};
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if(isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedRequestQueue.push({
                        resolve: (token: string) => {
                            if(originalRequest.headers) {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            }
                            resolve(api(originalRequest));
                        },
                        reject
                    })
                });
            } else {
                isRefreshing = true;
                try {
                    const newToken = await handleRefreshToken();
                    handleFailedRequestQueue(null, newToken);
                    if(originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    }
                    return api(originalRequest);
                } catch(error: any) {
                    handleFailedRequestQueue(error as AxiosError, null);
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;