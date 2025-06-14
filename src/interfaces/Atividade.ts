// src/interfaces/Atividade.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { type CategoriaAtividade, findCategoryByName } from './Categoria';

dayjs.extend(customParseFormat);

const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

const parseDateString = (dateString: string): Date => {
  return dayjs(dateString, DATETIME_FORMAT).toDate();
};

export interface Atividade {
  id: number;
  nome: string;
  descricao: string;
  inicio: Date;
  fim: Date;
  responsavel: string;
  // NOVO CAMPO: Objeto da categoria de Atividade Complementar
  categoria?: CategoriaAtividade; // O objeto completo da categoria
}

// Helper para obter uma categoria com segurança, caso o findCategoryByName retorne undefined
const getCategoriaOuUndefined = (categoryName: string): CategoriaAtividade | undefined => {
  const category = findCategoryByName(categoryName);
  if (!category) {
    console.warn(`Atenção: Categoria "${categoryName}" não encontrada em categoriasData. Atividade pode não ter informações de AC corretas.`);
  }
  return category;
};

export const atividadesData: Atividade[] = [
  {
    id: 101,
    nome: "Palestra: Introdução à Extensão Universitária",
    descricao: "Palestra introdutória sobre os conceitos e a importância da extensão universitária para a comunidade acadêmica.",
    inicio: parseDateString("15/07/2025 09:00"),
    fim: parseDateString("15/07/2025 10:30"),
    responsavel: "Prof. Fictício Alfa",
    categoria: getCategoriaOuUndefined("Proferir palestras na área de Computação"),
  },
  {
    id: 102,
    nome: "Oficina: Como Elaborar Projetos de Extensão",
    descricao: "Oficina prática para auxiliar os alunos na formulação de propostas e projetos de extensão.",
    inicio: parseDateString("15/07/2025 10:45"),
    fim: parseDateString("15/07/2025 12:00"),
    responsavel: "Coordenação Genérica Beta",
    categoria: getCategoriaOuUndefined("Participação em Projeto de Extensão"),
  },
  {
    id: 103,
    nome: "Palestra: IA e o Futuro do Mercado de Trabalho",
    descricao: "Discussão sobre o impacto da Inteligência Artificial nas profissões e no mercado de trabalho global.",
    inicio: parseDateString("20/07/2025 14:00"),
    fim: parseDateString("20/07/2025 15:30"),
    responsavel: "Dr. Virtual Gama",
    categoria: getCategoriaOuUndefined("Proferir palestras na área de Computação"),
  },
  {
    id: 104,
    nome: "Mesa Redonda: Desafios Éticos da IA",
    descricao: "Debate com especialistas sobre os dilemas éticos envolvidos no desenvolvimento e uso da Inteligência Artificial.",
    inicio: parseDateString("20/07/2025 15:45"),
    fim: parseDateString("20/07/2025 17:00"),
    responsavel: "Prof. Desenvolvedora Delta",
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 105,
    nome: "Cerimônia de Abertura da Maratona",
    descricao: "Abertura oficial da maratona de programação, com as regras e orientações iniciais.",
    inicio: parseDateString("01/08/2025 08:30"),
    fim: parseDateString("01/08/2025 09:00"),
    responsavel: "Comissão Organizadora do Evento",
    categoria: getCategoriaOuUndefined("Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona"),
  },
  {
    id: 106,
    nome: "Competição de Programação",
    descricao: "Maratona de codificação em equipes para resolver problemas algorítmicos complexos.",
    inicio: parseDateString("01/08/2025 09:00"),
    fim: parseDateString("01/08/2025 17:00"),
    responsavel: "Equipe de Arbitragem Epsilon",
    categoria: getCategoriaOuUndefined("Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona"),
  },
  {
    id: 107,
    nome: "Workshop: Redação de Artigos Científicos",
    descricao: "Orientações práticas para a escrita e formatação de artigos científicos.",
    inicio: parseDateString("10/08/2025 09:00"),
    fim: parseDateString("10/08/2025 12:00"),
    responsavel: "Dra. Conhecimento Zeta",
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 108,
    nome: "Apresentação de Projetos de Iniciação Científica",
    descricao: "Alunos apresentam seus projetos de pesquisa para a comunidade acadêmica.",
    inicio: parseDateString("10/08/2025 14:00"),
    fim: parseDateString("10/08/2025 17:00"),
    responsavel: "Comitê Avaliador Theta",
    categoria: getCategoriaOuUndefined("Apresentação de Trabalhos em eventos científicos ou tecnológicos"),
  },
  {
    id: 109,
    nome: "Palestras das Empresas Parceiras",
    descricao: "Empresas convidadas apresentam suas culturas, projetos e oportunidades de carreira.",
    inicio: parseDateString("25/08/2025 09:00"),
    fim: parseDateString("25/08/2025 12:00"),
    responsavel: "Conselho de Indústria Iota",
    categoria: getCategoriaOuUndefined("Proferir palestras na área de Computação"),
  },
  {
    id: 110,
    nome: "Sessões de Entrevistas e Recrutamento",
    descricao: "Oportunidade para os alunos realizarem entrevistas rápidas com recrutadores.",
    inicio: parseDateString("25/08/2025 14:00"),
    fim: parseDateString("25/08/2025 17:00"),
    responsavel: "Setor de Carreiras Kappa",
    categoria: getCategoriaOuUndefined("Outra"),
  },
];