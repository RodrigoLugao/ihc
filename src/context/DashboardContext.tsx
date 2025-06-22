// src/context/DashboardContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import { useUserStore } from '../store/userStore';
import { useAtividadeStore } from '../store/atividadeStore';
import { useAtividadesConcluidasStore } from '../store/atividadesConcluidasStore';
import type { Usuario } from '../interfaces/Usuario';
import type { AtividadeConcluida } from '../interfaces/AtivdadeConcluida';

// Tipos
type CurriculoChave = "C_002" | "C_003";
const TOTAL_HORAS_AC_NECESSARIAS: Record<CurriculoChave, number> = {
  C_002: 162,
  C_003: 148,
};

interface DashboardContextType {
  usuario: Usuario | null;
  horasACCalculadas: number;
  totalHorasNecessarias: number;
  horasFaltando: number;
  categoriasDoUsuario: string[];
  pieChartData: any; // Ajuste o tipo se tiver um tipo mais específico para o gráfico
  loading: boolean; // Para indicar se os dados estão sendo carregados
  error: string | null; // Para lidar com erros
}

// Crie o Contexto
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Crie um Hook Customizado para usar o Contexto
export const useDashboardData = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardProvider');
  }
  return context;
};

// Crie o Provedor do Contexto
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const usuario = useUserStore((state) => state.user);
  
  // Obtenha as listas de dados diretamente como dependências reativas do Zustand
  const allAtividades = useAtividadeStore((state) => state.atividades); 
  const allAtividadesConcluidas = useAtividadesConcluidasStore((state) => state.atividadesConcluidas);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [horasACCalculadasState, setHorasACCalculadasState] = useState(0);
  const [totalHorasNecessariasState, setTotalHorasNecessariasState] = useState(0);
  const [horasFaltandoState, setHorasFaltandoState] = useState(0);
  const [categoriasDoUsuarioState, setCategoriasDoUsuarioState] = useState<string[]>([]);
  const [pieChartDataState, setPieChartDataState] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    // REMOVA ESTAS DUAS LINHAS:
    // useAtividadeStore.getState().initializeStore();
    // useAtividadesConcluidasStore.getState().initializeStore();

    if (!usuario) {
      setLoading(false);
      // Limpa os estados de dados caso o usuário deslogue
      setHorasACCalculadasState(0);
      setTotalHorasNecessariasState(0);
      setHorasFaltandoState(0);
      setCategoriasDoUsuarioState([]);
      setPieChartDataState({ labels: [], datasets: [] });
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        // Filtra as atividades concluídas SOMENTE para o usuário atual
        const atividadesConcluidasDoUsuario: AtividadeConcluida[] = allAtividadesConcluidas.filter(ac => ac.idUsuario === usuario.id);

        let calculatedHorasAC = 0;
        const horasPorCategoria: { [key: string]: number } = {};
        const uniqueCategories = new Set<string>();

        atividadesConcluidasDoUsuario.forEach((acConcluida) => {
          const atividade = allAtividades.find((atv) => atv.id === acConcluida.idAtividade);
          if (atividade && atividade.categoria) {
            const categoriaNome = atividade.categoria.nome;
            const horas = atividade.duracao * atividade.categoria.coeficienteNovo;

            calculatedHorasAC += horas;
            horasPorCategoria[categoriaNome] = (horasPorCategoria[categoriaNome] || 0) + horas;
            uniqueCategories.add(categoriaNome);
          }
        });

        setHorasACCalculadasState(calculatedHorasAC);

        const tipoCurriculoParaCalculo: CurriculoChave = usuario.curriculo == "31.02.003" ? "C_003" : "C_002";
        const calculatedTotalHorasNecessarias = TOTAL_HORAS_AC_NECESSARIAS[tipoCurriculoParaCalculo];
        setTotalHorasNecessariasState(calculatedTotalHorasNecessarias);

        const calculatedHorasFaltando = Math.max(0, calculatedTotalHorasNecessarias - calculatedHorasAC);
        setHorasFaltandoState(calculatedHorasFaltando);
        setCategoriasDoUsuarioState(Array.from(uniqueCategories));

        const finalLabels: string[] = [];
        const finalDataValues: number[] = [];
        const finalBackgroundColors: string[] = [];
        const finalBorderColors: string[] = [];

        let hueStart = 60;
        let hueEnd = 300;
        const hueRange = hueEnd - hueStart;
        const numberOfSlices = Object.keys(horasPorCategoria).length + (calculatedHorasFaltando > 0 ? 1 : 0);

        let currentCategoryIndex = 0;
        for (const categoryName of Object.keys(horasPorCategoria)) {
          finalLabels.push(categoryName);
          finalDataValues.push(horasPorCategoria[categoryName]);

          const hue = hueStart + currentCategoryIndex * (hueRange / (numberOfSlices - (calculatedHorasFaltando > 0 ? 1 : 0)));
          const color = `hsl(${hue}, 70%, 50%)`;
          finalBackgroundColors.push(color);
          finalBorderColors.push(color.replace("70%", "50%").replace("50%", "40%"));
          currentCategoryIndex++;
        }

        if (calculatedHorasFaltando > 0) {
          finalLabels.push("Horas Faltando");
          finalDataValues.push(calculatedHorasFaltando);
          finalBackgroundColors.push("rgba(0, 0, 0, 0)"); // Fundo transparente
          finalBorderColors.push("#A9A9A9");
        }
        setPieChartDataState({
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
        });

      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }, 500); // Pequeno atraso para visualização de loading, ajuste se necessário.

    return () => clearTimeout(timer);
  }, [usuario, allAtividades, allAtividadesConcluidas]); // Dependências do useEffect

  const contextValue = useMemo(() => ({
    usuario,
    horasACCalculadas: horasACCalculadasState,
    totalHorasNecessarias: totalHorasNecessariasState,
    horasFaltando: horasFaltandoState,
    categoriasDoUsuario: categoriasDoUsuarioState,
    pieChartData: pieChartDataState,
    loading,
    error,
  }), [
    usuario,
    horasACCalculadasState,
    totalHorasNecessariasState,
    horasFaltandoState,
    categoriasDoUsuarioState,
    pieChartDataState,
    loading,
    error,
  ]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};