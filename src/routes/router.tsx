import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ErrorLayout from "./ErrorLayout";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorLayout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
      ],
    },
  ],

  {
    basename: import.meta.env.BASE_URL,
  }
);

export default router;