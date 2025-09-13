const baseUrl = "http://localhost:5041/api"
export const ApiEndpoints = {
    LOGIN: `${baseUrl}/Authentication/login`,
    REGISTER: `${baseUrl}/Authentication/register`,
    REFRESH: `${baseUrl}/Authentication/refresh`,
    LOGOUT: `${baseUrl}/Authentication/logout`
}