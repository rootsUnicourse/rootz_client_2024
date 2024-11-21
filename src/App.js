// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import { GoogleOAuthProvider } from "@react-oauth/google";
import PasswordReset from './components/PasswordReset/PasswordReset';

function App() {
    return (
        <GoogleOAuthProvider clientId="134952626250-qkihmg8l7fi5diniog9j2qnkf6nrvbsh.apps.googleusercontent.com">
            <Router>
                {/* Layout wraps all routes */}
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/password-reset/:token" element={<PasswordReset/>} />
                        {/* Add more routes as needed */}
                    </Routes>
                </Layout>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
