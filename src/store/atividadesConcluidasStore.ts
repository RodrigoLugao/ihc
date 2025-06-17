// src/store/atividadesConcluidasStore.ts
import { create } from 'zustand';
import { atividadesConcluidasData } from '../data/atividadesConcluidasData';
import type { AtividadeConcluida } from '../interfaces/AtivdadeConcluida';

// Chave para o localStorage
const LOCAL_STORAGE_KEY = 'atividadesConcluidasStore';

interface AtividadesConcluidasStore {
  atividadesConcluidas: AtividadeConcluida[];
  initialized: boolean;
  initializeStore: () => void;
  getAtividadesConcluidas: () => AtividadeConcluida[];
  getAtividadeConcluida: (idAtividade: number, idUsuario: number) => AtividadeConcluida | undefined;
  addAtividadeConcluida: (newAtividade: AtividadeConcluida) => void;
  updateAtividadeConcluida: (idAtividade: number, idUsuario: number, updatedFields: Partial<AtividadeConcluida>) => void;
  removeAtividadeConcluida: (idAtividade: number, idUsuario: number) => void;
  // Nova função para buscar atividades concluídas por ID de usuário
  getAtividadesConcluidasByUsuario: (idUsuario: number) => AtividadeConcluida[];
  // Nova função para buscar atividades concluídas por ID de atividade
  getAtividadesConcluidasByAtividade: (idAtividade: number) => AtividadeConcluida[];
}

export const useAtividadesConcluidasStore = create<AtividadesConcluidasStore>((set, get) => ({
  atividadesConcluidas: [],
  initialized: false,

  initializeStore: () => {
    if (!get().initialized) {
      const storedAtividades = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAtividades) {
        try {
          const parsedAtividades: AtividadeConcluida[] = JSON.parse(storedAtividades);
          set({ atividadesConcluidas: parsedAtividades, initialized: true });
          console.log('Atividades Concluídas carregadas do localStorage.');
        } catch (e) {
          console.error("Erro ao carregar atividades concluídas do localStorage, inicializando com dados padrão:", e);
          // Em caso de erro, inicializa com os dados padrão
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividadesConcluidasData));
          set({ atividadesConcluidas: atividadesConcluidasData, initialized: true });
        }
      } else {
        // Se não houver, use os dados iniciais e salve no localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividadesConcluidasData));
        set({ atividadesConcluidas: atividadesConcluidasData, initialized: true });
        console.log('Atividades Concluídas inicializadas a partir de atividadesConcluidasData.ts e salvas no localStorage.');
      }
    }
  },

  getAtividadesConcluidas: () => {
    get().initializeStore();
    return get().atividadesConcluidas;
  },

  // Busca uma atividade concluída por uma combinação de ID de Atividade e ID de Usuário
  getAtividadeConcluida: (idAtividade: number, idUsuario: number) => {
    get().initializeStore();
    return get().atividadesConcluidas.find(
      (ac) => ac.idAtividade === idAtividade && ac.idUsuario === idUsuario
    );
  },

  addAtividadeConcluida: (newAtividade: AtividadeConcluida) => {
    get().initializeStore();
    set((state) => {
      // Verifica se já existe uma entrada para esta combinação atividade/usuário
      const exists = state.atividadesConcluidas.some(
        (ac) => ac.idAtividade === newAtividade.idAtividade && ac.idUsuario === newAtividade.idUsuario
      );
      if (exists) {
        console.warn(`Atividade Concluída (Atividade ID: ${newAtividade.idAtividade}, Usuário ID: ${newAtividade.idUsuario}) já existe. Não será adicionada.`);
        return state; // Retorna o estado atual sem modificação
      }

      const updatedAtividades = [...state.atividadesConcluidas, newAtividade];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades));
      return { atividadesConcluidas: updatedAtividades };
    });
  },

  updateAtividadeConcluida: (idAtividade: number, idUsuario: number, updatedFields: Partial<AtividadeConcluida>) => {
    get().initializeStore();
    set((state) => {
      const updatedAtividades = state.atividadesConcluidas.map((ac) =>
        ac.idAtividade === idAtividade && ac.idUsuario === idUsuario
          ? { ...ac, ...updatedFields }
          : ac
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades));
      return { atividadesConcluidas: updatedAtividades };
    });
  },

  removeAtividadeConcluida: (idAtividade: number, idUsuario: number) => {
    get().initializeStore();
    set((state) => {
      const updatedAtividades = state.atividadesConcluidas.filter(
        (ac) => !(ac.idAtividade === idAtividade && ac.idUsuario === idUsuario)
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades));
      return { atividadesConcluidas: updatedAtividades };
    });
  },

  getAtividadesConcluidasByUsuario: (idUsuario: number) => {
    get().initializeStore();
    return get().atividadesConcluidas.filter(ac => ac.idUsuario === idUsuario);
  },

  getAtividadesConcluidasByAtividade: (idAtividade: number) => {
    get().initializeStore();
    return get().atividadesConcluidas.filter(ac => ac.idAtividade === idAtividade);
  },
}));