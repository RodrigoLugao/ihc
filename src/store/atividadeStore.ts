// src/store/atividadeStore.ts
import { create } from 'zustand';
// Importa o atividadesData diretamente, pois já está no formato correto de Date objects
import { atividadesData } from '../data/atividadesData';
import type { Atividade } from '../interfaces/Atividade';

// Chave para o localStorage
const LOCAL_STORAGE_KEY = 'atividadesStore';

// --- Funções Auxiliares de Serialização/Desserialização para localStorage ---

// Função para converter strings de data para objetos Date ao carregar do localStorage
const reviveDates = (key: string, value: any): any => {
  if (typeof value === 'string') {
    // Regex para ISO 8601 string (ex: "2024-06-17T13:00:00.000Z")
    // Ou simplesmente tenta criar um Date se a string for um formato de data válido
    const dateMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.exec(value);
    if (dateMatch) {
      const date = new Date(value);
      // Verifica se a data é válida para evitar converter strings aleatórias em "Invalid Date"
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return value;
};

// Função para converter objetos Date para strings ISO ao salvar no localStorage
// JSON.stringify já faz isso por padrão para Date objects.
// No entanto, podemos ter certeza de que estamos lidando com um objeto Date.
const replacerForDates = (key: string, value: any): any => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

// --- Interface do Store ---

interface AtividadeStore {
  atividades: Atividade[];
  initialized: boolean;
  initializeStore: () => void;
  getAtividades: () => Atividade[];
  getAtividadeById: (id: number) => Atividade | undefined;
  addAtividade: (newAtividade: Atividade) => void;
  updateAtividade: (id: number, updatedFields: Partial<Atividade>) => void;
  removeAtividade: (id: number) => void;
  searchAtividadesByName: (searchTerm: string) => Atividade[];
}

// --- Criação do Store ---

export const useAtividadeStore = create<AtividadeStore>((set, get) => ({
  atividades: [],
  initialized: false,

  initializeStore: () => {
    if (!get().initialized) {
      const storedAtividades = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAtividades) {
        // Se houver dados no localStorage, parseie e converta as datas de volta
        // Usamos JSON.parse com um reviver para lidar com as datas
        try {
          const parsedAtividades: Atividade[] = JSON.parse(storedAtividades, reviveDates);
          set({ atividades: parsedAtividades, initialized: true });
          console.log('Atividades carregadas do localStorage e datas restauradas.');
        } catch (e) {
          console.error("Erro ao carregar atividades do localStorage, inicializando com dados padrão:", e);
          // Em caso de erro (dados corrompidos, por exemplo), inicializa com os dados padrão
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividadesData, replacerForDates));
          set({ atividades: atividadesData, initialized: true });
        }
      } else {
        // Se não houver, use os dados iniciais e salve no localStorage
        // JSON.stringify já converterá os Date objects em strings ISO aqui
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividadesData, replacerForDates));
        set({ atividades: atividadesData, initialized: true });
        console.log('Atividades inicializadas a partir de atividadesData.ts e salvas no localStorage.');
      }
    }
  },

  getAtividades: () => {
    get().initializeStore();
    return get().atividades;
  },

  getAtividadeById: (id: number) => {
    get().initializeStore();
    return get().atividades.find(atividade => atividade.id === id);
  },

  addAtividade: (newAtividade: Atividade) => {
    get().initializeStore();
    set((state) => {
      // Garante que a nova atividade tem um ID único
      // Considera IDs de todas as atividades, incluindo as do localStorage
      const currentMaxId = state.atividades.length > 0 ? Math.max(...state.atividades.map(a => a.id)) : 0;
      const nextId = currentMaxId + 1;
      const atividadeToAdd = { ...newAtividade, id: nextId };

      const updatedAtividades = [...state.atividades, atividadeToAdd];
      // Salva no localStorage. JSON.stringify automaticamente converte Date para string ISO.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades, replacerForDates));
      return { atividades: updatedAtividades };
    });
  },

  updateAtividade: (id: number, updatedFields: Partial<Atividade>) => {
    get().initializeStore();
    set((state) => {
      const updatedAtividades = state.atividades.map((atividade) =>
        atividade.id === id ? { ...atividade, ...updatedFields } : atividade
      );
      // Salva no localStorage. JSON.stringify automaticamente converte Date para string ISO.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades, replacerForDates));
      return { atividades: updatedAtividades };
    });
  },

  removeAtividade: (id: number) => {
    get().initializeStore();
    set((state) => {
      const updatedAtividades = state.atividades.filter(
        (atividade) => atividade.id !== id
      );
      // Salva no localStorage. JSON.stringify automaticamente converte Date para string ISO.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAtividades, replacerForDates));
      return { atividades: updatedAtividades };
    });
  },

  searchAtividadesByName: (searchTerm: string) => {
    get().initializeStore();
    const allAtividades = get().atividades;
    if (!searchTerm) {
      return allAtividades;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allAtividades.filter((atividade) =>
      atividade.nome.toLowerCase().includes(lowerCaseSearchTerm)
    );
  },
}));