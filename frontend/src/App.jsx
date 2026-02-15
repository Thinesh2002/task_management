import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./compnents/Layout";
import ProtectedRoute from "./config/ProtectedRoute";

import Login from "./Pages/login";
import Register from "./Pages/team_member/Register";
import Team_leadDashboard from "./Pages/team_lead/index";
import AdminDashboard from "./Pages/admin_dashboard";

import CreateTask from "./Pages/task/create_task/index";
import ManageTask from "./Pages/task/manage_task/index";
import MyTask from "./Pages/task/my_task/index";
import TaskDetails from "./Pages/task/task_detail_view/index";

import CreateEmp from "./Pages/employee/create_emp/index";
import ViewEmp from "./Pages/employee/index";
import EditEmployee from "./Pages/employee/edit_emp/edit_emp";

import CreateDepartment from "./Pages/deparment/create_department/index";
import ViewDepartment from "./Pages/deparment/index";

import { getStoredUser } from "./config/auth";

import "./index.css";

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncAuth = () => setUser(getStoredUser());

    window.addEventListener("auth_change", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth_change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const isLoggedIn = !!user;

  const getDefaultRoute = () => {
    if (!isLoggedIn) return "/login";

    switch (user?.role) {
      case "admin":
        return "/admin-dashboard";

      case "team_lead":
        return "/lead-Dashboard";

      case "team_member":
        return "/tasks/my";

      default:
        return "/login";
    }
  };

  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-emp"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <CreateEmp />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-emp/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <EditEmployee />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-department"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <CreateDepartment />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN + TEAM LEAD ================= */}
      <Route
        path="/tasks/manage"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead"]}>
            <Layout>
              <ManageTask />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-task"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead"]}>
            <Layout>
              <CreateTask />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/task/:id"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead"]}>
            <Layout>
              <TaskDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-emp"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead"]}>
            <Layout>
              <ViewEmp />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-department"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead"]}>
            <Layout>
              <ViewDepartment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/register"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead"]}>
            <Layout>
              <Register />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ================= TEAM MEMBER ================= */}
      <Route
        path="/tasks/my"
        element={
          <ProtectedRoute allowedRoles={["admin", "team_lead","team_member"]}>
            <Layout>
              <MyTask />
            </Layout>
          </ProtectedRoute>
        }
      />



      

      {/* ================= TEAM LEAD DASHBOARD ================= */}
      <Route
        path="/lead-dashboard"
        element={
          <ProtectedRoute allowedRoles={["team_lead"]}>
            <Layout>
              <Team_leadDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT REDIRECT ================= */}
      <Route
        path="*"
        element={<Navigate to={getDefaultRoute()} replace />}
      />

    </Routes>
  );
}
