export const getAccessToken = (): string | null => {
    return localStorage.getItem("access-token");
}

export const getRefreshToken = (): string | null => {
    return localStorage.getItem("refresh-token");
}

export const setAccessToken = (token: string) => {
    localStorage.setItem("access-token", token);
}

export const setRefreshToken = (token: string) => {
    localStorage.setItem("refresh-token", token);
}