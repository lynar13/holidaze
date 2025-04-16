// src/App.jsx
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import Layout from "./components/Layout";

function App() {
  const routeElements = useRoutes([
    {
      element: <Layout />,
      children: routes,
    },
  ]);

  return routeElements;
}

export default App;

