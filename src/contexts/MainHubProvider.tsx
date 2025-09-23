import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { createContext, useContext, useEffect, useState } from "react";

type MainHubContextType = {
    connection: HubConnection | null;
}

export const MainHubContext = createContext<MainHubContextType>({ connection: null });

export const MainHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5041/applicationHub")
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        newConnection
            .start()
            .then(() => {
                console.log("Main hub connected");
                setConnection(connection);
            })
            .catch((err: any) => console.error("Main hub connection failed: ", err));

        return () => {
            newConnection.stop();
        };
    }, []);

    return (
        <MainHubContext.Provider value={{ connection }}>
            {children}
        </MainHubContext.Provider>
    );
}

export const useMainHub = () => useContext(MainHubContext);