// src/App.jsx
import { useNavigate, useRoutes } from "react-router-dom";
import { useEffect } from "react";
import routes from "./routes";
import Layout from "./components/Layout";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    if (redirect) {
      navigate(redirect);
    }
  }, [navigate]);

  const routeElements = useRoutes([
    {
      element: <Layout />,
      children: routes,
    },
  ]);

  return routeElements;
}

export default App;

