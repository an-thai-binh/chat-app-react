import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken } from "../utils/localStorageUtils";

type MainHubContextType = {
    connection: HubConnection | null;
}

export const MainHubContext = createContext<MainHubContextType>({ connection: null });

export const MainHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const newConnection = useMemo(() => {   // dùng useMemo không tạo lại mỗi lần re-render
        return new HubConnectionBuilder()
            .withUrl("http://localhost:5041/applicationHub", {
                accessTokenFactory: () => getAccessToken() || ""
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
    }, []);

    useEffect(() => {
        newConnection
            .start()
            .then(() => {
                console.log("Main hub connected");
                setConnection(newConnection);
            })
            .catch((err: any) => console.error("Main hub connection failed: ", err));

        return () => {
            if (connection) connection.stop();
        };
    }, [newConnection]);

    return (
        <MainHubContext.Provider value={{ connection }}>
            {children}
        </MainHubContext.Provider>
    );
}

export const useMainHub = () => useContext(MainHubContext);