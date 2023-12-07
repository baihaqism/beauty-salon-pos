import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Sidebar from "./components/Sidebar";
import MainDash from "./components/MainDash/MainDash";
import Transactions from "./pages/Transactions/Transactions";
import AddTransactions from "./pages/Transactions/Table/Add";
import DetailsTransactions from "./pages/Transactions/Table/Preview";
import EditTransactions from "./pages/Transactions/Table/Edit";
import Customers from "./pages/Customers/Customers";
import Users from "./pages/Users/Users";
import Products from "./pages/Products/Products";
import Services from "./pages/Services/Services";
import Expenses from "./pages/Expenses/Expenses";

function App() {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <div className="App">
                <div className="AppGlass">
                  <Sidebar />
                  <MainDash />
                </div>
              </div>
            }
          />
          <Route
            path="/transactions"
            element={
              <div className="App">
                <div className="AppGlass">
                  <Sidebar />
                  <Transactions />
                </div>
              </div>
            }
          />
          <Route
            path="/transactions/add"
            element={
              <div className="App">
                <div className="AppGlass">
                  <Sidebar />
                  <AddTransactions />
                </div>
              </div>
            }
          />
          <Route
            path="/transactions/details/:id_transactions"
            element={
              <div className="App">
                <div className="AppGlass">
                  <Sidebar />
                  <DetailsTransactions />
                </div>
              </div>
            }
          />
          <Route
            path="/transactions/edit/:id_transactions"
            element={
              userRole === "Admin" && token ? (
                <div className="App">
                  <div className="AppGlass">
                    <Sidebar />
                    <EditTransactions />
                  </div>
                </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/customers"
            element={
              <div className="App">
                <div className="AppGlass">
                  <Sidebar />
                  <Customers />
                </div>
              </div>
            }
          />
          <Route
            path="/products"
            element={
              <div className="App">
                <div className="AppGlass">
                  <Sidebar />
                  <Products />
                </div>
              </div>
            }
          />
          <Route
            path="/services"
            element={
              userRole === "Admin" && token ? (
                <div className="App">
                  <div className="AppGlass">
                    <Sidebar />
                    <Services />
                  </div>
                </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/expenses"
            element={
              userRole === "Admin" && token ? (
                <div className="App">
                  <div className="AppGlass">
                    <Sidebar />
                    <Expenses />
                  </div>
                </div>
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/users"
            element={
              userRole === "Admin" && token ? (
                <div className="App">
                  <div className="AppGlass">
                    <Sidebar />
                    <Users />
                  </div>
                </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
