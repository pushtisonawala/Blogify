import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import BlogDetailsPage from "./components/BlogDetailsPage";
import LoginRegisterPage from "./components/LoginRegisterPage";
import DashboardPage from "./components/DashboardPage";
import ErrorPage from "./components/ErrorPage";
import CreateBlogPage from './components/CreateBlogPage'; // Import the new component
import RecentPostsPage from './components/RecentPostsPage'; // Import the new component
import MembershipPage from './components/MembershipPage'; // Import the new component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
        window.removeEventListener('storage', checkAuth);
    };
}, []);

  return (
    <Router>
     <Routes>
    <Route path="/login" element={!isAuthenticated ? <LoginRegisterPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
    <Route path="/register" element={<LoginRegisterPage setIsAuthenticated={setIsAuthenticated} />} />
    <Route path="/dashboard" element={isAuthenticated ? <DashboardPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
    <Route path="/" element={isAuthenticated ? <HomePage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
    <Route path="/blog/:id" element={<BlogDetailsPage />} /> {/* Fixed blog route */}
    <Route path="/create" element={<CreateBlogPage />} /> {/* Add this line */}
    <Route path="/recent" element={isAuthenticated ? <RecentPostsPage /> : <Navigate to="/login" />} /> {/* Add this line */}
    <Route path="/membership" element={isAuthenticated ? <MembershipPage /> : <Navigate to="/login" />} /> {/* Add this line */}
    <Route path="*" element={<ErrorPage />} />
</Routes>

    </Router>
  );
};

export default App;
