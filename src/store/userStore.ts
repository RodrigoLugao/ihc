// src/stores/userStore.ts
import { create } from "zustand";
import type { Usuario } from "../interfaces/Usuario";

// Define a interface para o estado do seu store
interface UserState {
  user: Usuario | null; // O usuário logado, pode ser null se ninguém estiver logado
  isAuthenticated: boolean; // Um booleano para verificar rapidamente o status de autenticação
  login: (userData: Usuario) => void; // Função para fazer login (que também seta isAuthenticated)
  logout: () => void; // Função para fazer logout
  // NOVO: Função para setar usuário visitante e garantir que não está autenticado
  setVisitorUserAndKeepUnauthenticated: (userData: Usuario) => void;
  // NOVO: Função para alternar o currículo do usuário logado
  toggleCurriculo: () => void; // Não precisa de ID, pois opera no currentUser
}

// Cria o store
export const useUserStore = create<UserState>((set, _) => ({ // <-- Adicione 'get' aqui
  user: null, // Estado inicial: nenhum usuário logado
  isAuthenticated: false, // Estado inicial: não autenticado

  // Função para fazer login
  login: (userData: Usuario) => {
    set({ user: userData, isAuthenticated: true });
    // Opcional: Salvar no localStorage para persistir o login entre sessões
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  },

  // Função para fazer logout
  logout: () => {
    set({ user: null, isAuthenticated: false });
    // Opcional: Remover do localStorage
    localStorage.removeItem("loggedInUser");
  },

  // NOVO: Função para setar usuário visitante e garantir que isAuthenticated é false
  setVisitorUserAndKeepUnauthenticated: (userData: Usuario) => {
    set({ user: userData, isAuthenticated: false });
    // Não salve no localStorage aqui, pois você não quer que este "login de visitante" persista como um usuário logado.
  },

  // NOVO: Função para alternar o currículo do usuário logado
  toggleCurriculo: () => {
    set((state) => {
      if (state.user) {
        const updatedUser: Usuario = {
          ...state.user,
          curriculoNovo: !state.user.curriculoNovo, // Alterna o valor booleano
        };
        // Atualiza também no localStorage para persistência
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        return { user: updatedUser }; // Atualiza o estado do store
      }
      return state; // Retorna o estado atual se não houver usuário logado
    });
  },
}));

// Opcional: Adicionar uma função de inicialização para verificar o localStorage ao carregar a aplicação
// Isso garante que o estado de autenticação seja persistido ao recarregar a página
// Esta lógica precisa ser ajustada para usar 'useUserStore.setState' corretamente após a criação do store
// e para garantir que ela só é executada uma vez.
// Uma abordagem melhor para inicialização persistente é um Zustand middleware (ex: persist)
// ou chamar um método de inicialização no root do seu aplicativo React.
(() => {
  const storedUser = localStorage.getItem("loggedInUser");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Se o usuário já estiver logado (ao carregar a página), define o estado
      // Note que 'setState' é um método estático no store criado por 'create'.
      useUserStore.setState({ user, isAuthenticated: true });
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      // Limpa dados inválidos se houver erro no parsing
      localStorage.removeItem("loggedInUser");
    }
  }
})();