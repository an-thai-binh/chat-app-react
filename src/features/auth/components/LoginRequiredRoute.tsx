import { useEffect, useState, type JSX } from "react";
import api from "../../../services/apiConfig";
import { ApiEndpoints } from "../../../constants/endpoints";
import { getAccessToken } from "../../../utils/localStorageUtils";
import { Navigate } from "react-router-dom";

type LoginRequiredRouteProps = {
    children: JSX.Element;
}

export default function LoginRequiredRoute({ children }: LoginRequiredRouteProps) {
    const [login, setLogin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await api.post(ApiEndpoints.INTROSPECT, {
                    token: getAccessToken()
                });
                if (response.data.success) {
                    setLogin(true);
                }
            } catch (error: any) {
                const message = error.response?.data.message || error.message;
                console.error("Authentication Failed: ", message);
                setLogin(false);
            }
        }
        checkLogin();
    }, []);
    if (login === null) {
        return <div className="w-full h-full bg-gray-600"></div>
    }
    return login ? children : <Navigate to="/login" replace />;
}