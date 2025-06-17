// src/store/categoriaStore.ts

import { create } from 'zustand';
import { categoriasData, type CategoriaAtividade } from '../interfaces/Categoria';

interface CategoriaStore {
  categorias: CategoriaAtividade[];
  initialized: boolean;
  initializeStore: () => void;
  getCategorias: () => CategoriaAtividade[];
  getCategoriaByName: (nome: string) => CategoriaAtividade | undefined;
  addCategoria: (newCategoria: CategoriaAtividade) => void;
  updateCategoria: (nome: string, updatedCategoria: CategoriaAtividade) => void;
  deleteCategoria: (nome: string) => void;
}

const LOCAL_STORAGE_KEY = 'categoriasStore';

export const useCategoriaStore = create<CategoriaStore>((set, get) => ({
  categorias: [],
  initialized: false,

  initializeStore: () => {
    if (!get().initialized) {
      const storedCategorias = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCategorias) {
        set({ categorias: JSON.parse(storedCategorias), initialized: true });
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categoriasData));
        set({ categorias: categoriasData, initialized: true });
      }
    }
  },

  getCategorias: () => {
    get().initializeStore(); // Garante a inicialização antes de qualquer operação de leitura
    return get().categorias;
  },

  getCategoriaByName: (nome: string) => {
    get().initializeStore(); // Garante a inicialização
    const lowerCaseNome = nome.toLowerCase();
    // Busca inteligente: tenta correspondência exata primeiro, depois parcial
    const categorias = get().categorias;

    // 1. Correspondência exata
    const exactMatch = categorias.find(cat => cat.nome.toLowerCase() === lowerCaseNome);
    if (exactMatch) {
      return exactMatch;
    }

    // 2. Correspondência parcial (contém a string)
    const partialMatches = categorias.filter(cat => cat.nome.toLowerCase().includes(lowerCaseNome));
    if (partialMatches.length > 0) {
      // Se houver múltiplas correspondências parciais, você pode adicionar uma lógica para
      // retornar a "melhor" ou a primeira. Por simplicidade, retornamos a primeira aqui.
      return partialMatches[0];
    }

    return undefined;
  },

  addCategoria: (newCategoria: CategoriaAtividade) => {
    get().initializeStore(); // Garante a inicialização
    set((state) => {
      const updatedCategorias = [...state.categorias, newCategoria];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCategorias));
      return { categorias: updatedCategorias };
    });
  },

  updateCategoria: (nome: string, updatedCategoria: CategoriaAtividade) => {
    get().initializeStore(); // Garante a inicialização
    set((state) => {
      const updatedCategorias = state.categorias.map((cat) =>
        cat.nome.toLowerCase() === nome.toLowerCase() ? updatedCategoria : cat
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCategorias));
      return { categorias: updatedCategorias };
    });
  },

  deleteCategoria: (nome: string) => {
    get().initializeStore(); // Garante a inicialização
    set((state) => {
      const updatedCategorias = state.categorias.filter(
        (cat) => cat.nome.toLowerCase() !== nome.toLowerCase()
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCategorias));
      return { categorias: updatedCategorias };
    });
  },
}));