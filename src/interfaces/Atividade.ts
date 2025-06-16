// src/interfaces/Atividade.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { type CategoriaAtividade } from './Categoria'; // Certifique-se de que o caminho para Categoria está correto

dayjs.extend(customParseFormat);
/* 
const DATETIME_FORMAT = "DD/MM/YYYY HH:mm"; */

/* const parseDateString = (dateString: string): Date => {
  return dayjs(dateString, DATETIME_FORMAT).toDate();
}; */

export interface Atividade {
  id: number;
  nome: string;
  descricao: string;
  inicio: Date;
  fim?: Date;
  responsavel: string;
  // NOVO CAMPO ADICIONADO:
  duracao: number; // Periodo que o aluno passou realizando a atividade
  categoria?: CategoriaAtividade; // O objeto completo da categoria
}

// Helper para obter uma categoria com segurança, caso o findCategoryByName retorne undefined
/* const getCategoriaOuUndefined = (categoryName: string): CategoriaAtividade | undefined => {
  const category = findCategoryByName(categoryName);
  if (!category) {
    console.warn(`Atenção: Categoria "${categoryName}" não encontrada em categoriasData. Atividade pode não ter informações de AC corretas.`);
  }
  return category;
}; */

// ... suas atividadesData virão aqui