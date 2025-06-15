// src/stores/userStore.ts
import { create } from 'zustand';
import type { Usuario } from '../interfaces/Usuario';

// Define a interface para o estado do seu store
interface UserState {
  user: Usuario | null; // O usuário logado, pode ser null se ninguém estiver logado
  isAuthenticated: boolean; // Um booleano para verificar rapidamente o status de autenticação
  login: (userData: Usuario) => void; // Função para fazer login
  logout: () => void; // Função para fazer logout
}

// Cria o store
export const useUserStore = create<UserState>((set) => ({
  user: null, // Estado inicial: nenhum usuário logado
  isAuthenticated: false, // Estado inicial: não autenticado

  // Função para fazer login
  login: (userData: Usuario) => {
    set({ user: userData, isAuthenticated: true });
    // Opcional: Salvar no localStorage para persistir o login entre sessões
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
  },

  // Função para fazer logout
  logout: () => {
    set({ user: null, isAuthenticated: false });
    // Opcional: Remover do localStorage
    localStorage.removeItem('loggedInUser');
  },
}));

// Opcional: Adicionar uma função de inicialização para verificar o localStorage ao carregar a aplicação
// Isso garante que o estado de autenticação seja persistido ao recarregar a página
(() => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Se o usuário já estiver logado (ao carregar a página), define o estado
      useUserStore.setState({ user, isAuthenticated: true });
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      // Limpa dados inválidos se houver erro no parsing
      localStorage.removeItem('loggedInUser');
    }
  }
})();