// src/pages/DashboardPage.tsx

import { Outlet } from "react-router-dom"; // Importe Outlet
import DashboardBottomNav from "../components/DashboardBottomNav";
import { DashboardProvider } from "../context/DashboardContext"; // Importe o Provider e o Hook

// Este componente será o "layout" pai do dashboard
const DashboardPage: React.FC = () => {
  return (
    <DashboardProvider> {/* Envolve todo o conteúdo do Dashboard com o Provedor */}
      <div className="background-div-no-image">
        <div className="container pt-2" style={{ minHeight: "900px", paddingBottom: "100px" }}>
          {/* O Outlet renderizará o componente filho correspondente à rota aninhada */}
          <Outlet />
        </div>
        <DashboardBottomNav />
      </div>
    </DashboardProvider>
  );
};

export default DashboardPage;