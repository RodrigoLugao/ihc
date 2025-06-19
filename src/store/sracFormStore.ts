// src/store/sracFormStore.ts
import { create } from 'zustand';
import type { SRACFormInputs } from '../components/SRACForm'; // Importe a interface do seu formulário

// Definir o tipo do estado do store
interface SRACFormState {
  formData: SRACFormInputs | null; // Armazena os dados do formulário, pode ser nulo se não houver dados
  setFormData: (data: SRACFormInputs) => void; // Função para atualizar os dados
  clearFormData: () => void; // Função para limpar os dados
}

export const useSRACFormStore = create<SRACFormState>((set) => ({
  formData: null, // Estado inicial
  setFormData: (data) => set({ formData: data }),
  clearFormData: () => set({ formData: null }),
}));