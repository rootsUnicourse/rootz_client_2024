import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode"; // Correct import path for jwtDecode

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // Store decoded user information
    const logoutTimerRef = useRef(null);

    const logout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
        setToken(null);
        setUser(null);

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const login = (userInfo, userToken) => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("userToken", userToken);
        setIsLoggedIn(true);
        setToken(userToken);

        const decoded = jwtDecode(userToken);
        setUser(decoded); // Store decoded user information

        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000;

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }

        logoutTimerRef.current = setTimeout(() => {
            logout();
        }, timeUntilExpiry);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        const storedToken = localStorage.getItem("userToken");
        if (storedUser && storedToken) {
            const decoded = jwtDecode(storedToken);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp > currentTime) {
                setIsLoggedIn(true);
                setToken(storedToken);
                setUser(decoded); // Set decoded user details

                const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
                if (logoutTimerRef.current) {
                    clearTimeout(logoutTimerRef.current);
                }
                logoutTimerRef.current = setTimeout(() => {
                    logout();
                }, timeUntilExpiry);
            } else {
                logout();
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, token, user }}>
            {children}
        </AuthContext.Provider>
    );
};
