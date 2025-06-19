import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ErrorLayout from "./ErrorLayout";
import AtividadesPage from "../pages/AtividadesPage";
import FAQPage from "../pages/FAQPage";
import EventosPage from "../pages/EventosPage";
import EventoSoloPage from "../pages/EventoPage";
import DashboardPage from "../pages/DashboardPage";
import SecretPage from "../pages/SecretPage";
import EsqueciSenhaPage from "../pages/EsqueciSenhaPage";
import RegistrarAtividadePage from "../pages/RegistrarAtividadePage";
import VisaoGeralPage from "../pages/VisaoGeralPage";
import PreRegistrarPage from "../pages/PreRegistrarPage";
import ListaAtividadesPessoalPage from "../pages/ListaAtividadesPessoalPage";
import PreFormularioPage from "../pages/PreFormularioPage";
import EditarAtividadePage from "../pages/EdiitarAtividadePage";

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
          path: "atividades",
          element: <AtividadesPage />,
        },
        {
          path: "eventos",
          element: <EventosPage />,
        },
        {
          path: "eventos/:slug",
          element: <EventoSoloPage />,
        },
        {
          path: "perguntas",
          element: <FAQPage />,
        },
        {
          path: "dashboard",
          element: <DashboardPage />,
          children: [
            { index: true, element: <VisaoGeralPage /> },
            { path: "registrar", element: <PreRegistrarPage /> },
            { path: "atividades", element: <ListaAtividadesPessoalPage /> },
            { path: "pre-formulario", element: <PreFormularioPage /> },
          ],
        },
        {
          path: "secret",
          element: <SecretPage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "registrar-atividade",
          element: <RegistrarAtividadePage/>
        },
        {
          path: "editar-atividade",
          element: <EditarAtividadePage/>
        },
        {
          path: "esqueci-a-senha",
          element: <EsqueciSenhaPage />,
        },
      ],
    },
  ],

  {
    basename: import.meta.env.BASE_URL,
  }
);

export default router;