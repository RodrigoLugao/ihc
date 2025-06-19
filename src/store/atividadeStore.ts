// src/store/atividadeStore.ts
import { create } from "zustand";
import { atividadesData } from "../data/atividadesData";
import type { Atividade } from "../interfaces/Atividade";

// Chave para o localStorage para as atividades
const LOCAL_STORAGE_KEY = "atividadesStore";
// NOVA CHAVE para a flag de inicialização dos dados padrão
const INITIAL_DATA_LOADED_FLAG_KEY = "atividadesInitialDataLoaded";

// --- Funções Auxiliares de Serialização/Desserialização para localStorage ---

const reviveDates = (_: string, value: any): any => {
  if (typeof value === "string") {
    const dateMatch =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.exec(value);
    if (dateMatch) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return value;
};

const replacerForDates = (_: string, value: any): any => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

// --- Interface do Store ---

interface AtividadeStore {
  atividades: Atividade[];
  // Não precisamos mais de 'initialized' como parte do estado público para este padrão
  // mas podemos mantê-lo internamente se quisermos registrar o estado de inicialização
  getAtividades: () => Atividade[];
  getAtividadeById: (id: number) => Atividade | undefined;
  addAtividade: (newAtividade: Omit<Atividade, 'id'>) => Atividade;
  updateAtividade: (id: number, updatedFields: Partial<Atividade>) => void;
  removeAtividade: (id: number) => void;
  searchAtividadesByName: (searchTerm: string) => Atividade[];
}

// --- Lógica de inicialização fora da função create ---
// Esta lógica será executada UMA VEZ quando o módulo for carregado/interpretado pelo JS.
// Isso é considerado uma inicialização "eager" (ansiosa) em nível de módulo.

let initialAtividades: Atividade[] = [];
let isInitializedGlobally = false; // Flag de controle para inicialização do módulo

const loadInitialAtividades = () => {
    if (isInitializedGlobally) {
        return; // Já inicializado, não faça nada
    }

    const storedAtividades = localStorage.getItem(LOCAL_STORAGE_KEY);
    const initialDataLoadedFlag = localStorage.getItem(INITIAL_DATA_LOADED_FLAG_KEY);

    if (storedAtividades) {
        try {
            const parsedAtividades: Atividade[] = JSON.parse(
                storedAtividades,
                reviveDates
            );
            initialAtividades = Array.isArray(parsedAtividades) ? parsedAtividades : [];
            console.log(
                "Atividades carregadas do localStorage (inicialização global)."
            );
        } catch (e) {
            console.error(
                "Erro ao carregar atividades do localStorage. Tentando inicializar com dados padrão ou vazio...",
                e
            );
            if (!initialDataLoadedFlag) {
                initialAtividades = Array.isArray(atividadesData) ? atividadesData : [];
                localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    JSON.stringify(initialAtividades, replacerForDates)
                );
                localStorage.setItem(INITIAL_DATA_LOADED_FLAG_KEY, "true");
                console.log(
                    "LocalStorage de atividades corrompido ou vazio, inicializando com dados padrão e setando a flag."
                );
            } else {
                initialAtividades = []; // Mantenha vazio se corrompido mas a flag está lá
                console.warn(
                    "Dados de atividades no localStorage corrompidos, mas a flag de inicialização já está setada. Inicializando com array vazio."
                );
            }
        }
    } else {
        if (!initialDataLoadedFlag) {
            initialAtividades = Array.isArray(atividadesData) ? atividadesData : [];
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(initialAtividades, replacerForDates)
            );
            localStorage.setItem(INITIAL_DATA_LOADED_FLAG_KEY, "true");
            console.log(
                "Atividades inicializadas a partir de atividadesData.ts, salvas no localStorage e flag setada."
            );
        } else {
            initialAtividades = [];
            console.log(
                "LocalStorage de atividades vazio, mas a flag de inicialização já está setada. Inicializando com array vazio."
            );
        }
    }
    isInitializedGlobally = true;
};

// Chame a lógica de carregamento no momento em que o módulo é avaliado.
// Isso acontece UMA VEZ na vida da aplicação (por refresh de página).
loadInitialAtividades();


// --- Criação do Store ---

export const useAtividadeStore = create<AtividadeStore>((set, get) => ({
  atividades: initialAtividades, // Usa os dados carregados na inicialização do módulo

  // O método initializeStore não é mais necessário para a inicialização inicial,
  // mas se você o mantiver para alguma outra finalidade, ele não será chamado automaticamente aqui.
  // Vou removê-lo da interface e da implementação, já que a pergunta é para não chamá-lo de fora.
  // Se quiser manter uma flag 'initialized' no estado do store, você pode reintroduzir.

  getAtividades: () => {
    // Agora o `atividades` já estará populado com os dados iniciais
    const currentAtividades = get().atividades;
    return Array.isArray(currentAtividades) ? currentAtividades : [];
  },

  getAtividadeById: (id: number) => {
    const currentAtividades = get().atividades;
    return (Array.isArray(currentAtividades) ? currentAtividades : []).find((atividade) => atividade.id === id);
  },

  addAtividade: (newAtividade: Omit<Atividade, 'id'>): Atividade => {
    let atividadeGerada: Atividade;
    set((state) => {
      const currentAtividades = Array.isArray(state.atividades) ? state.atividades : [];
      const currentMaxId =
        currentAtividades.length > 0
          ? Math.max(...currentAtividades.map((a) => a.id))
          : 0;
      const nextId = currentMaxId + 1;

      atividadeGerada = { ...newAtividade, id: nextId };

      const updatedAtividades = [...currentAtividades, atividadeGerada];
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedAtividades, replacerForDates)
      );
      return { atividades: updatedAtividades };
    });

    console.log("Atividade adicionada ao store:", atividadeGerada!);
    return atividadeGerada!;
  },

  updateAtividade: (id: number, updatedFields: Partial<Atividade>) => {
    set((state) => {
      const currentAtividades = Array.isArray(state.atividades) ? state.atividades : [];
      const updatedAtividades = currentAtividades.map((atividade) =>
        atividade.id === id ? { ...atividade, ...updatedFields } : atividade
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedAtividades, replacerForDates)
      );
      return { atividades: updatedAtividades };
    });
  },

  removeAtividade: (id: number) => {
    set((state) => {
      const currentAtividades = Array.isArray(state.atividades) ? state.atividades : [];
      const updatedAtividades = currentAtividades.filter(
        (atividade) => atividade.id !== id
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedAtividades, replacerForDates)
      );
      return { atividades: updatedAtividades };
    });
  },

  searchAtividadesByName: (searchTerm: string) => {
    const allAtividades = get().atividades;
    if (!searchTerm) {
      return Array.isArray(allAtividades) ? allAtividades : [];
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return Array.isArray(allAtividades)
      ? allAtividades.filter((atividade) =>
          atividade.nome.toLowerCase().includes(lowerCaseSearchTerm)
        )
      : [];
  },
}));