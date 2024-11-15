// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HomePage/HomePage';
import Layout from './components/Layout/Layout';

function App() {
    return (
        <Router>
            {/* Layout wraps all routes */}
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Add more routes as needed */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
