import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../store/userStore";
import  RegisterForm  from "./components/RegisterForm";
import  LoginForm  from "./components/LoginForm";
import Home from "../pages/Home";
import type { JSX } from "react";
import TripsPage from "../pages/TripsPage";
import TripDetailsPage from "../pages/TripDetailsPage";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthStore();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<LoginForm />} />
  <Route path="/register" element={<RegisterForm />} />
  <Route
    path="/trips"
    element={
      <PrivateRoute>
        <TripsPage />
      </PrivateRoute>
    }
  />
  <Route path="*" element={<Navigate to="/" />} />
   <Route path="/trips/:id" element={<TripDetailsPage />} />
  
</Routes>

  );
}
