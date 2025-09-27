import { useMemo } from "react";
import { getAccessToken } from "../../../utils/localStorageUtils";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub?: string,
    name?: string
}

export default function useAuth() {
    return useMemo(() => {
        const accessToken = getAccessToken();
        try {
            const decoded = jwtDecode<JwtPayload>(accessToken || "");
            return {
                sub: decoded.sub || null,
                name: decoded.name || null
            }
        } catch (e) {
            return {
                sub: null,
                name: null
            }
        }
    }, [])
}