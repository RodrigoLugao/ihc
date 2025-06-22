// src/pages/DashboardPage.tsx

import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardBottomNav from "../components/DashboardBottomNav";
import { DashboardProvider } from "../context/DashboardContext";
import { useUserStore } from "../store/userStore";
import type { Usuario } from '../interfaces/Usuario';

// Este componente será o "layout" pai do dashboard
const DashboardPage: React.FC = () => {
  // Apenas precisamos do setVisitorUserAndKeepUnauthenticated para esta lógica
  const setVisitorUserAndKeepUnauthenticated = useUserStore((state) => state.setVisitorUserAndKeepUnauthenticated);
  const user = useUserStore((state) => state.user); // Obtenha o usuário atual para verificar se já existe

  useEffect(() => {
    // Verifique se não há um usuário no localStorage.
    // O userStore já tem uma lógica de inicialização que lê do localStorage.
    // Se 'user' for null aqui E isAuthenticated for false, significa que nada foi restaurado ou logado.
    const storedUser = localStorage.getItem('loggedInUser');

    if (!storedUser && !user) { // Se não há nada no localStorage E não há usuário no store
      const visitorUser: Usuario = {
        id: 999,
        nome: "Visitante",
        email: "visitante@example.com",
        senha: "",
        curriculo: "31.02.003",
        matricula: "VISITANTE999",
        telefone: "",
      };
      // Use a nova função para setar o visitante sem autenticar
      setVisitorUserAndKeepUnauthenticated(visitorUser);
    }
  }, [setVisitorUserAndKeepUnauthenticated, user]); // user é uma dependência para garantir que a verificação de !user seja reativa.

  return (
    <DashboardProvider>
      <div className="background-div-no-image">
        <div className="container pt-5" style={{ minHeight: "900px", paddingBottom: "100px" }}>
          <Outlet />
        </div>
        <DashboardBottomNav />
      </div>
    </DashboardProvider>
  );
};

export default DashboardPage;