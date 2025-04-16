// routes.jsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Venues = lazy(() => import("./pages/Venues"));
const VenueDetail = lazy(() => import("./pages/VenueDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreateVenue = lazy(() => import("./pages/CreateVenue"));
const BookingDashboard = lazy(() => import("./pages/BookingDashboard"));
const VenueManagerDashboard = lazy(() => import("./pages/VenueManagerDashboard"));

const routes = [
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "venues", element: <Venues /> },
      { path: "venues/:id", element: <VenueDetail /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "create-venue",
        element: (
          <ProtectedRoute requireManager={true}>
            <CreateVenue />
          </ProtectedRoute>
        ),
      },
      {
        path: "customer",
        element: (
          <ProtectedRoute requireManager={false}>
            <BookingDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "venue-manager",
        element: (
          <ProtectedRoute requireManager={true}>
            <VenueManagerDashboard />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

export default routes;
