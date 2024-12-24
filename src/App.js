// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import { GoogleOAuthProvider } from "@react-oauth/google";
import PasswordReset from './components/PasswordReset/PasswordReset';
import Profile from './components/Profile/Profile';
import FavoriteShops from './components/FavoriteShops/FavoriteShops';
import { AuthProvider } from './AuthContext';
import { LoginModalProvider } from './LoginModalContext';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LoginModalProvider> {/* Wrap with LoginModalProvider */}
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/password-reset/:token" element={<PasswordReset />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorite-shops" element={<FavoriteShops />} />
                <Route path="/dashboard" element={<Dashboard />}/>
              </Routes>
            </Layout>
          </Router>
        </LoginModalProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
