// src/pages/DashboardPage.tsx

import { useMemo } from "react";
import { useUserStore } from "../store/userStore";
import { atividadesData } from "../data/atividadesData";

// Importações do Chart.js e react-chartjs-2
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  type CurriculoTipo,
  calcularTotalHorasACByUsuario,
  getAtividadesConcluidasByUsuario,
  calcularHorasAC,
} from "../utils/acutils";
import { Link } from "react-router-dom";

// Registre os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// >>>>>>>>>>> NOVO: Definição do total de horas AC necessárias por currículo <<<<<<<<<<<
// ESTES SÃO VALORES DE EXEMPLO. AJUSTE DE ACORDO COM O REGULAMENTO DA UFF.
const TOTAL_HORAS_AC_NECESSARIAS: Record<CurriculoTipo, number> = {
  curriculoAntigo: 200, // Exemplo: 200 horas para o currículo antigo
  curriculoNovo: 148, // Exemplo: 300 horas para o currículo novo
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const DashboardPage = () => {
  const usuario = useUserStore((state) => state.user);

  // Calcula o total de horas AC já obtidas pelo aluno
  const horasACCalculadas = useMemo(() => {
    if (!usuario) {
      return 0;
    }
    const tipoCurriculo: CurriculoTipo = usuario.curriculoNovo
      ? "curriculoNovo"
      : "curriculoAntigo";
    return calcularTotalHorasACByUsuario(usuario.id, tipoCurriculo);
  }, [usuario]);

  // >>>>>>>>>>> NOVO: useMemo separado para as categorias únicas <<<<<<<<<<<
  const categoriasDoUsuario = useMemo(() => {
    if (!usuario) {
      return [];
    }

    const atividadesConcluidasDoUsuario = getAtividadesConcluidasByUsuario(
      usuario.id
    );
    const uniqueCategories = new Set<string>(); // Usamos um Set para garantir unicidade

    atividadesConcluidasDoUsuario.forEach((acConcluida) => {
      const atividade = atividadesData.find(
        (atv) => atv.id === acConcluida.idAtividade
      );
      if (atividade && atividade.categoria) {
        uniqueCategories.add(atividade.categoria.tipo);
      }
    });

    return Array.from(uniqueCategories); // Converte o Set de volta para um Array
  }, [usuario]); // Depende apenas do objeto 'usuario'

  console.log(
    "Categorias do usuário com atividades (fora do useMemo do gráfico):",
    categoriasDoUsuario
  );
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // Prepara os dados para o gráfico de pizza, incluindo as horas restantes
  const pieChartData = useMemo(() => {
    if (!usuario) {
      return { labels: [], datasets: [] };
    }

    const atividadesConcluidasDoUsuario = getAtividadesConcluidasByUsuario(
      usuario.id
    );
    const tipoCurriculo: CurriculoTipo = usuario.curriculoNovo
      ? "curriculoNovo"
      : "curriculoAntigo";

    const horasPorCategoria: { [key: string]: number } = {};

    atividadesConcluidasDoUsuario.forEach((acConcluida) => {
      const atividade = atividadesData.find(
        (atv) => atv.id === acConcluida.idAtividade
      );
      if (atividade && atividade.categoria) {
        const categoriaNome = atividade.categoria.tipo;
        const horas = calcularHorasAC(atividade, tipoCurriculo);
        horasPorCategoria[categoriaNome] =
          (horasPorCategoria[categoriaNome] || 0) + horas;
      }
    });

    // >>>>>>>>>>> NOVO: Adiciona a fatia de "Horas Faltando" <<<<<<<<<<<
    const totalHorasNecessarias = TOTAL_HORAS_AC_NECESSARIAS[tipoCurriculo];
    // Calcula as horas que faltam, garantindo que não seja negativo
    const horasFaltando = Math.max(
      0,
      totalHorasNecessarias - horasACCalculadas
    );

    // Arrays finais para labels, data e cores
    const finalLabels: string[] = [];
    const finalDataValues: number[] = [];
    const finalBackgroundColors: string[] = [];
    const finalBorderColors: string[] = [];

    // Adiciona as categorias de atividades (com cores dinâmicas)
    let hueIndex = 0;
    const numberOfCategories = Object.keys(horasPorCategoria).length; // Número de categorias reais
    for (const categoryName of Object.keys(horasPorCategoria)) {
      finalLabels.push(categoryName);
      finalDataValues.push(horasPorCategoria[categoryName]);
      // Gera cores vibrantes para as categorias, distribuindo o matiz
      const color = `hsl(${
        hueIndex * (360 / (numberOfCategories + (horasFaltando > 0 ? 1 : 0)))
      }, 70%, 50%)`;
      finalBackgroundColors.push(color);
      finalBorderColors.push(color.replace("70%", "50%").replace("50%", "40%"));
      hueIndex++;
    }

    // Adiciona a fatia "Horas Faltando" se houver horas a serem completadas
    if (horasFaltando > 0) {
      finalLabels.push("Horas Faltando");
      finalDataValues.push(horasFaltando);
      finalBackgroundColors.push("#D3D3D3"); // Cor cinza claro para as horas faltando
      finalBorderColors.push("#A9A9A9"); // Cor cinza mais escura para a borda
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    return {
      labels: finalLabels,
      datasets: [
        {
          label: "Horas AC por Categoria",
          data: finalDataValues,
          backgroundColor: finalBackgroundColors,
          borderColor: finalBorderColors,
          borderWidth: 2,
        },
      ],
    };
  }, [usuario, horasACCalculadas]); // Adicione horasACCalculadas como dependência, pois pieChartData depende dela.

  // Opções para o gráfico (título, responsividade, etc.)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const, // Coloca a legenda à direita
        align: "start" as const, // Alinha os itens da legenda ao centro
        labels: {
          font: {
            size: 14,
            weight: "bold" as const, // Correção do erro de tipagem
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
          weight: "bold" as const, // Correção do erro de tipagem
          color: "#333",
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
    <div className="background-div">
      <div className="container pt-5" style={{ minHeight: "724px" }}>
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
                {(
                  TOTAL_HORAS_AC_NECESSARIAS[
                    usuario.curriculoNovo ? "curriculoNovo" : "curriculoAntigo"
                  ] - horasACCalculadas
                ).toFixed(0)}{" "}
                horas
              </b>{" "}
              para completar o requisito.
            </p>

            <h2 className="mt-5">Visão Geral das Horas AC</h2>
            <div
              className="d-flex justify-content-center"
              style={{ height: "700px" }}
            >
              {/* Verifica se há dados positivos para exibir no gráfico */}
              {pieChartData.labels.length > 0 &&
              pieChartData.datasets[0].data.some((val) => val > 0) ? (
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
                to="/registrar-atividade"
                className="comece-agora-link text-decoration-none"
              >
                Ver as regras de atividades complementares
              </Link>{" "}
              e{" "}
              <Link
                to="/eventos"
                className="comece-agora-link text-decoration-none"
              >
                Preencher o formulário de atividades complementares com a nossa
                ajuda
              </Link>{" "}
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
