import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('Token') || '');

    useEffect(() => {
        // localStorage.setItem("url", "https://5c38-2401-4900-1c66-49b8-65db-34b0-bc9a-8785.ngrok-free.app"); // Dev
        localStorage.setItem("url", "http://srv515471.hstgr.cloud:5000"); // Dev
        // localStorage.setItem("url", "http://srv515471.hstgr.cloud:4000"); // Prod


        // localStorage.setItem("url", "http://srv515471.hstgr.cloud:8081");  // Prod

    }, [])
    return (

        <AppContext.Provider value={{ token, setToken }}>
            {children}
        </AppContext.Provider>
    );
};
