import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const logoutTimerRef = useRef(null);

    const checkLoginStatus = () => {
        const storedUser = localStorage.getItem("userInfo");
        const storedToken = localStorage.getItem("userToken");
        if (storedUser && storedToken) {
            const decoded = jwtDecode(storedToken); // decode storedToken
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp > currentTime) {
                setIsLoggedIn(true);
                setToken(storedToken);
                scheduleAutoLogout(decoded.exp);
            } else {
                logout();
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const login = (userInfo, userToken) => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("userToken", userToken);
        setIsLoggedIn(true);
        setToken(userToken);

        // Use jwtDecode instead of jwt_decode
        const decoded = jwtDecode(userToken);
        scheduleAutoLogout(decoded.exp);
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
        setToken(null);

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const scheduleAutoLogout = (exp) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = (exp - currentTime) * 1000; // convert to ms

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }

        logoutTimerRef.current = setTimeout(() => {
            logout();
        }, timeUntilExpiry);
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};
