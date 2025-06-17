import { type CategoriaAtividade } from "./Categoria";

export interface Atividade {
  id: number;
  nome: string;
  descricao: string;
  inicio: Date;
  fim?: Date;
  responsavel: string;
  duracao: number;
  categoria?: CategoriaAtividade;
}
