// src/pages/VisaoGeralPage.tsx
import React from "react";
import { useDashboardData } from "../context/DashboardContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link, useLocation } from "react-router-dom"; // Importar useLocation para o link de login

// Registrar os componentes do Chart.js novamente aqui, se você for usar Pie diretamente.
ChartJS.register(ArcElement, Tooltip, Legend);

const VisaoGeralPage: React.FC = () => {
  const {
    usuario,
    horasACCalculadas,
    horasFaltando,
    pieChartData,
    loading,
    error,
  } = useDashboardData();

  const location = useLocation(); // Hook para obter a localização atual

  if (loading) {
    return (
      <div className="text-white text-center py-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3">Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        Erro ao carregar dados: {error}
      </div>
    );
  }

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "start" as const,
        labels: {
          font: {
            size: 14,
            weight: "bold" as const,
          },
          color: "#ecf0f1", // Cor do texto da legenda para contraste no fundo escuro
          padding: 20,
          boxWidth: 20,
          boxHeight: 20,
        },
      },
      title: {
        display: true,
        text: "Distribuição de Horas AC por Categoria",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        color: "#ecf0f1", // Cor do texto do título para contraste
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyFont: {
          size: 14,
        },
        padding: 10,
      },
    },
  };

  return (
    <>
      <div className="background-div-1 text-white pb-5">
        {usuario ? (
          <>
            <h1>Olá, {usuario.nome}</h1>
            <p>
              Você completou <b>{horasACCalculadas.toFixed(0)} horas</b> de
              Atividades Complementares.
            </p>
            <p>
              Faltam <b>{horasFaltando.toFixed(0)} horas</b> para completar o
              requisito.
            </p>

            <h2 className="mt-5">Visão Geral das Horas de AC</h2>
            <hr className="my-4" />
            <div
              className="d-flex justify-content-center"
              style={{ height: "700px" }}
            >
              {pieChartData.labels.length > 0 &&
              pieChartData.datasets[0].data.some((val: number) => val > 0) ? (
                <Pie data={pieChartData} options={chartOptions} />
              ) : (
                <p className="text-center">
                  Nenhuma atividade complementar registrada ou calculada para
                  exibir no gráfico.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h1>Olá, visitante!</h1>
            <p>
              Você ainda não está logado. Faça login para ver seu dashboard de
              Atividades Complementares.
            </p>
            <p>
              Já registrou alguma atividade?{" "}
              <Link
                className="comece-agora-link text-decoration-none"
                to="/login"
                state={{ from: location.pathname }}
              >
                Faça login para recuperar as informações
              </Link>
            </p>
            {/* Esta mensagem sobre currículo faltante só faz sentido se o usuário estiver logado e a informação estiver faltando */}
            {/* <p>
                Desculpe, faltou a informação de qual currículo seguir, por favor,
                entre em contato com o suporte ou preencha essa informação em seu
                perfil.
              </p> */}
            <p>
              Deseja{" "}
              <Link
                to="/registrar-atividade"
                className="comece-agora-link text-decoration-none"
              >
                Registrar uma atividade complementar que tenha participado
              </Link>{" "}
              ou{" "}
              <Link
                to="/eventos"
                className="comece-agora-link text-decoration-none"
              >
                Descobrir novas atividades complementares
              </Link>{" "}
              ?
            </p>
            <p>
              Ou, se preferir, pode{" "}
              <Link
                to="/atividades-complementares"
                className="comece-agora-link text-decoration-none"
              >
                Ver as regras de atividades complementares
              </Link>{" "}
              e{" "}
              <Link
                to="/formulario-solicitacao"
                className="comece-agora-link text-decoration-none"
              >
                Preencher o formulário de atividades complementares com a nossa
                ajuda
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default VisaoGeralPage;
