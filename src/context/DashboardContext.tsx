// src/context/DashboardContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react'; // Adicionado useState e useEffect
import { useUserStore } from '../store/userStore';
import { calcularTotalHorasACByUsuario, getAtividadesConcluidasByUsuario } from '../utils/acutils';
import { atividadesData } from '../data/atividadesData';
import type { Usuario } from '../interfaces/Usuario';

// Tipos
type CurriculoChave = "curriculoAntigo" | "curriculoNovo";
const TOTAL_HORAS_AC_NECESSARIAS: Record<CurriculoChave, number> = {
  curriculoAntigo: 200,
  curriculoNovo: 148,
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
  const [loading, setLoading] = useState(true); // Começa como true
  const [error, setError] = useState<string | null>(null); // Estado para erros

  // Estados para armazenar os dados calculados após o atraso
  const [horasACCalculadasState, setHorasACCalculadasState] = useState(0);
  const [totalHorasNecessariasState, setTotalHorasNecessariasState] = useState(0);
  const [horasFaltandoState, setHorasFaltandoState] = useState(0);
  const [categoriasDoUsuarioState, setCategoriasDoUsuarioState] = useState<string[]>([]);
  const [pieChartDataState, setPieChartDataState] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    // Se não há usuário, não precisamos simular carregamento, ele simplesmente não está logado.
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

    setLoading(true); // Começa o loading se há usuário
    setError(null); // Limpa qualquer erro anterior

    const timer = setTimeout(() => {
      try {
        // Lógica de cálculo (a mesma que já estava)
        const calculatedHorasAC = calcularTotalHorasACByUsuario(usuario.id, usuario.curriculoNovo);
        setHorasACCalculadasState(calculatedHorasAC);

        const tipoCurriculoParaCalculo: CurriculoChave = usuario.curriculoNovo ? "curriculoNovo" : "curriculoAntigo";
        const calculatedTotalHorasNecessarias = TOTAL_HORAS_AC_NECESSARIAS[tipoCurriculoParaCalculo];
        setTotalHorasNecessariasState(calculatedTotalHorasNecessarias);

        const calculatedHorasFaltando = Math.max(0, calculatedTotalHorasNecessarias - calculatedHorasAC);
        setHorasFaltandoState(calculatedHorasFaltando);

        const atividadesConcluidasDoUsuario = getAtividadesConcluidasByUsuario(usuario.id);
        const uniqueCategories = new Set<string>();
        atividadesConcluidasDoUsuario.forEach((acConcluida) => {
          const atividade = atividadesData.find((atv) => atv.id === acConcluida.idAtividade);
          if (atividade && atividade.categoria) {
            uniqueCategories.add(atividade.categoria.nome);
          }
        });
        setCategoriasDoUsuarioState(Array.from(uniqueCategories));

        const horasPorCategoria: { [key: string]: number } = {};
        atividadesConcluidasDoUsuario.forEach((acConcluida) => {
          const atividade = atividadesData.find((atv) => atv.id === acConcluida.idAtividade);
          if (atividade && atividade.categoria) {
            const categoriaNome = atividade.categoria.nome;
            const horas = atividade.duracao *
              (usuario.curriculoNovo ? atividade.categoria.coeficienteNovo : atividade.categoria.coeficienteAntigo);
            horasPorCategoria[categoriaNome] = (horasPorCategoria[categoriaNome] || 0) + horas;
          }
        });

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
        setLoading(false); // Termina o loading
      }
    }, 500); // Simula 500ms de atraso

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado ou as dependências mudarem
  }, [usuario]); // O efeito é executado apenas quando o `usuario` muda

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