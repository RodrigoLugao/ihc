// src/components/DashboardBottomNav.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faListCheck,
  faPlus,
  faFileLines, // NOVO: Ícone para 'Preencher Formulário de ACs'
  // Removido faCalendarDays e faCircleQuestion, pois não serão mais usados
} from "@fortawesome/free-solid-svg-icons"; // Certifique-se de que faFilePen está neste pacote

const DashboardBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: faChartPie, label: "Visão Geral" },
    // Lista de ACs concluídas
    { path: "/registrar-atividade", icon: faPlus, label: "Registrar Atividade Complementar" }, // Cadastrar nova AC
    {
      path: "/atividades-concluidas",
      icon: faListCheck,
      label: "Atividades Concluídas",
    },
    {
      path: "/formulario-solicitacao",
      icon: faFileLines,
      label: "Preencher Formulário de Solicitação",
    }, // Link para o formulário oficial
  ];

  return (
    <nav className="fixed-bottom bg-light shadow-lg py-2 container dashboard-bottom-nav-custom rounded-top">
      <div className="row d-flex justify-content-around align-items-center h-100">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`d-flex flex-column align-items-center text-decoration-none px-1 py-1 col-3
                          ${
                            isActive ? "text-info" : "text-dark"
                          } dashboard-nav-item-custom`}
              // col-4: Se você tem 3 itens, col-4 garante que cada um ocupe 1/3 da largura da linha (4*3 = 12 colunas)
              // Note: Você tinha col-3, mas com 3 itens, col-4 é mais adequado.
            >
              <FontAwesomeIcon icon={item.icon} className="fs-5" />
              <span className="d-none d-sm-inline-block small text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardBottomNav;
