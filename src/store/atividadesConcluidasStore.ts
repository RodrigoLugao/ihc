// src/store/atividadesConcluidasStore.ts
import { create } from 'zustand';
import { atividadesConcluidasData } from '../data/atividadesConcluidasData';
import type { AtividadeConcluida } from '../interfaces/AtivdadeConcluida';

// Chave para o localStorage
const LOCAL_STORAGE_KEY = 'atividadesConcluidasStore';

interface AtividadesConcluidasStore {
  atividadesConcluidas: AtividadeConcluida[];
  getAtividadesConcluidas: () => AtividadeConcluida[];
  getAtividadeConcluida: (idAtividade: number, idUsuario: number) => AtividadeConcluida | undefined;
  addAtividadeConcluida: (newAtividade: AtividadeConcluida) => void;
  updateAtividadeConcluida: (idAtividade: number, idUsuario: number, updatedFields: Partial<AtividadeConcluida>) => void;
  removeAtividadeConcluida: (idAtividade: number, idUsuario: number) => void;
  getAtividadesConcluidasByUsuario: (idUsuario: number) => AtividadeConcluida[];
  getAtividadesConcluidasByAtividade: (idAtividade: number) => AtividadeConcluida[];
}

// Lógica para carregar o estado inicial do localStorage
// Esta função é chamada APENAS UMA VEZ para definir o valor inicial.
const loadInitialState = (): AtividadeConcluida[] => {
  const storedAtividades = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedAtividades) {
    try {
      const parsedAtividades: AtividadeConcluida[] = JSON.parse(storedAtividades);
      console.log('Atividades Concluídas carregadas do localStorage na inicialização do store.');
      return parsedAtividades;
    } catch (e) {
      console.error("Erro ao carregar atividades concluídas do localStorage, inicializando com dados padrão:", e);
      // Em caso de erro, inicializa com os dados padrão e sobrescreve o localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividadesConcluidasData));
      return atividadesConcluidasData;
    }
  } else {
    // Se não houver nada no localStorage, usa os dados padrão e salva
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividadesConcluidasData));
    console.log('Atividades Concluídas inicializadas a partir de atividadesConcluidasData.ts e salvas no localStorage.');
    return atividadesConcluidasData;
  }
};

export const useAtividadesConcluidasStore = create<AtividadesConcluidasStore>((set, get) => ({ // <-- Adicione 'get' aqui novamente
  // Define o estado inicial chamando a função de carregamento
  atividadesConcluidas: loadInitialState(),

  // Agora, todas as funções que precisam acessar o estado atual devem usar 'get()'
  getAtividadesConcluidas: () => {
    return get().atividadesConcluidas; // Use get() para acessar o estado atual
  },

  getAtividadeConcluida: (idAtividade: number, idUsuario: number) => {
    return get().atividadesConcluidas.find( // Use get()
      (ac) => ac.idAtividade === idAtividade && ac.idUsuario === idUsuario
    );
  },

  addAtividadeConcluida: (newAtividade: AtividadeConcluida) => {
    set((state) => {
      // 'state' aqui já é o estado mais recente, então não precisa de get()
      const exists = state.atividadesConcluidas.some(
        (ac) => ac.idAtividade === newAtividade.idAtividade && ac.idUsuario === newAtividade.idUsuario
      );
      if (exists) {
        console.warn(`Atividade Concluída (Atividade ID: ${newAtividade.idAtividade}, Usuário ID: ${newAtividade.idUsuario}) já existe. Não será adicionada.`);
        return state;
      }

      const updatedAtividades = [...state.atividadesConcluidas, newAtividade];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades));
      return { atividadesConcluidas: updatedAtividades };
    });
  },

  updateAtividadeConcluida: (idAtividade: number, idUsuario: number, updatedFields: Partial<AtividadeConcluida>) => {
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
    set((state) => {
      const updatedAtividades = state.atividadesConcluidas.filter(
        (ac) => !(ac.idAtividade === idAtividade && ac.idUsuario === idUsuario)
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades));
      return { atividadesConcluidas: updatedAtividades };
    });
  },

  getAtividadesConcluidasByUsuario: (idUsuario: number) => {
    return get().atividadesConcluidas.filter(ac => ac.idUsuario === idUsuario); // Use get()
  },

  getAtividadesConcluidasByAtividade: (idAtividade: number) => {
    return get().atividadesConcluidas.filter(ac => ac.idAtividade === idAtividade); // Use get()
  },
}));