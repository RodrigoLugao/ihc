// src/pages/VisaoGeralPage.tsx
import React from 'react';
import { useDashboardData } from '../context/DashboardContext'; // Use o hook customizado
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';

// Registrar os componentes do Chart.js novamente aqui, se você for usar Pie diretamente.
// Se você já registrou globalmente em App.tsx ou em um arquivo de setup, não precisa repetir.
// Mas para garantir que funcione se DashboardPage não estiver fazendo isso mais, é bom manter.
ChartJS.register(ArcElement, Tooltip, Legend);


const VisaoGeralPage: React.FC = () => {
  const { usuario, horasACCalculadas, totalHorasNecessarias, horasFaltando, pieChartData, loading, error } = useDashboardData();

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
    return <div className="alert alert-danger text-center">Erro ao carregar dados: {error}</div>;
  }

  // Opções do gráfico (podem ser definidas aqui ou importadas de um arquivo de configuração)
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
            color: "white",
          },
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
          color: "#ecf0f1",
        },
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
      {usuario && horasACCalculadas > 0 ? (
        <>
          <h1>Olá, {usuario?.nome}</h1>
          <p>
            Você completou <b>{horasACCalculadas.toFixed(0)} horas</b> de
            Atividades Complementares.
          </p>
          <p>
            Faltam{" "}
            <b>
              {horasFaltando.toFixed(0)}{" "}
              horas
            </b>{" "}
            para completar o requisito.
          </p>

          <h2 className="mt-5">Visão Geral das Horas de AC</h2>
          <div
            className="d-flex justify-content-center"
            style={{ height: "700px" }}
          >
            {pieChartData.labels.length > 0 &&
            pieChartData.datasets[0].data.some((val: number) => val > 0) ? (
              <Pie data={pieChartData} options={chartOptions} />
            ) : (
              <p>
                Nenhuma atividade complementar registrada ou calculada para
                exibir no gráfico.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <h1>Olá, {usuario ? usuario.nome : "visitante"}</h1>
          <p>Você ainda não possui atividades complementares registradas.</p>
          <p>
            Desculpe, faltou a informação de qual currículo seguir, por favor, entre em contato com o suporte ou preencha essa informação em seu perfil.
          </p>
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
              to="/eventos" // Ajuste esta rota se 'eventos' não existir mais
              className="comece-agora-link text-decoration-none"
            >
              Descobrir novas atividades complementares
            </Link>{" "}
            ?
          </p>
          <p>
            Ou, se preferir, pode{" "}
            <Link
              to="/atividades-complementares" // Esta rota pode levar à página de regras gerais de ACs
              className="comece-agora-link text-decoration-none"
            >
              Ver as regras de atividades complementares
            </Link>{" "}
            e{" "}
            <Link
              to="/formulario-solicitacao" // Nova rota para o formulário oficial
              className="comece-agora-link text-decoration-none"
            >
              Preencher o formulário de atividades complementares com a nossa
              ajuda
            </Link>{" "}
            .
          </p>
        </>
      )}
    </>
  );
};

export default VisaoGeralPage;