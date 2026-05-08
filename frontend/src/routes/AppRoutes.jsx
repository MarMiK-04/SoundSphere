/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";
import { useEffect } from "react";
import useAuthStore from "../store/authStore.js";

function AppRoutes() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    async function fetchUserData() {
      try {
        await fetchUser();
      }
      catch (error) {
        console.log(error.message)
      }
    }

      fetchUserData();
    
  },[]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/adminDashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRoutes;
