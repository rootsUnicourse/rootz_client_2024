import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = () => {
        const storedUser = localStorage.getItem("userInfo");
        setIsLoggedIn(!!storedUser);
    };

    const login = (userInfo) => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
