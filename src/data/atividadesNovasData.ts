// src/data/atividadesNovasData.ts
// Certifique-se de que as importações estão corretas
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// Ajuste o caminho da importação se necessário, mas parece correto:
import { type CategoriaAtividade, findCategoryByName } from '../interfaces/Categoria'; 
import type { Atividade } from '../interfaces/Atividade';

dayjs.extend(customParseFormat);

const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

const parseDateString = (dateString: string): Date => {
  return dayjs(dateString, DATETIME_FORMAT).toDate();
};

// Helper para obter uma categoria com segurança, caso o findCategoryByName retorne undefined
// Adiciona um trim para remover espaços em branco acidentais
const getCategoriaOuUndefined = (categoryName: string): CategoriaAtividade | undefined => {
  const trimmedCategoryName = categoryName.trim(); // Garante que não há espaços extras
  const category = findCategoryByName(trimmedCategoryName);
  if (!category) {
    console.warn(`Atenção: Categoria "${trimmedCategoryName}" não encontrada em categoriasData. Atividade pode não ter informações de AC corretas.`);
  }
  return category;
};

export const atividadesNovasData: Atividade[] = [
  {
    id: 101,
    nome: "Palestra: Introdução à Extensão Universitária",
    descricao: "Palestra introdutória sobre os conceitos e a importância da extensão universitária para a comunidade acadêmica.",
    inicio: parseDateString("15/07/2025 09:00"),
    fim: parseDateString("15/07/2025 10:30"),
    responsavel: "Prof. Fictício Alfa",
    duracao: 1.5, // 1h30min
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 102,
    nome: "Oficina: Como Elaborar Projetos de Extensão",
    descricao: "Oficina prática para auxiliar os alunos na formulação de propostas e projetos de extensão.",
    inicio: parseDateString("15/07/2025 10:45"),
    fim: parseDateString("15/07/2025 12:00"),
    responsavel: "Coordenação Genérica Beta",
    duracao: 1.25, // 1h15min
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 103,
    nome: "Palestra: IA e o Futuro do Mercado de Trabalho",
    descricao: "Discussão sobre o impacto da Inteligência Artificial nas profissões e no mercado de trabalho global.",
    inicio: parseDateString("20/07/2025 14:00"),
    fim: parseDateString("20/07/2025 15:30"),
    responsavel: "Dr. Virtual Gama",
    duracao: 1.5,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 104,
    nome: "Mesa Redonda: Desafios Éticos da IA",
    descricao: "Debate com especialistas sobre os dilemas éticos envolvidos no desenvolvimento e uso da Inteligência Artificial.",
    inicio: parseDateString("20/07/2025 15:45"),
    fim: parseDateString("20/07/2025 17:00"),
    responsavel: "Prof. Desenvolvedora Delta",
    duracao: 1.25,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 105,
    nome: "Cerimônia de Abertura da Maratona",
    descricao: "Abertura oficial da maratona de programação, com as regras e orientações iniciais.",
    inicio: parseDateString("01/08/2025 08:30"),
    fim: parseDateString("01/08/2025 09:00"),
    responsavel: "Comissão Organizadora do Evento",
    duracao: 0.5,
    categoria: getCategoriaOuUndefined("Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona"),
  },
  {
    id: 106,
    nome: "Competição de Programação",
    descricao: "Maratona de codificação em equipes para resolver problemas algorítmicos complexos.",
    inicio: parseDateString("01/08/2025 09:00"),
    fim: parseDateString("01/08/2025 17:00"),
    responsavel: "Equipe de Arbitragem Epsilon",
    duracao: 8, // 8 horas de competição
    categoria: getCategoriaOuUndefined("Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona"),
  },
  {
    id: 107,
    nome: "Workshop: Redação de Artigos Científicos",
    descricao: "Orientações práticas para a escrita e formatação de artigos científicos.",
    inicio: parseDateString("10/08/2025 09:00"),
    fim: parseDateString("10/08/2025 12:00"),
    responsavel: "Dra. Conhecimento Zeta",
    duracao: 3,
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 108,
    nome: "Apresentação de Projetos de Iniciação Científica",
    descricao: "Alunos apresentam seus projetos de pesquisa para a comunidade acadêmica.",
    inicio: parseDateString("10/08/2025 14:00"),
    fim: parseDateString("10/08/2025 17:00"),
    responsavel: "Comitê Avaliador Theta",
    duracao: 3, // Duração do evento, não da apresentação individual
    categoria: getCategoriaOuUndefined("Apresentação de Trabalhos em eventos científicos ou tecnológicos"), 
  },
  {
    id: 109,
    nome: "Palestras das Empresas Parceiras",
    descricao: "Empresas convidadas apresentam suas culturas, projetos e oportunidades de carreira.",
    inicio: parseDateString("25/08/2025 09:00"),
    fim: parseDateString("25/08/2025 12:00"),
    responsavel: "Conselho de Indústria Iota",
    duracao: 3,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 110,
    nome: "Sessões de Entrevistas e Recrutamento",
    descricao: "Oportunidade para os alunos realizarem entrevistas rápidas com recrutadores.",
    inicio: parseDateString("25/08/2025 14:00"),
    fim: parseDateString("25/08/2025 17:00"),
    responsavel: "Setor de Carreiras Kappa",
    duracao: 3,
    categoria: getCategoriaOuUndefined("Outra"),
  },
  {
    id: 111,
    nome: "Semana de Recepção dos Calouros",
    descricao: "Participação nas atividades de boas-vindas para os novos alunos do curso de Ciência da Computação.",
    inicio: parseDateString("06/03/2023 09:00"),
    fim: parseDateString("10/03/2023 17:00"),
    responsavel: "Centro Acadêmico de Ciência da Computação (CACC)",
    duracao: 10,
    categoria: getCategoriaOuUndefined("Participação em eventos estudantis, nacionais ou regionais, ligados à formação do aluno"), 
  },
  {
    id: 112,
    nome: "Minicurso: Introdução ao Linux",
    descricao: "Minicurso básico sobre o sistema operacional Linux, comum em cursos de computação.",
    inicio: parseDateString("15/04/2023 09:00"),
    fim: parseDateString("15/04/2023 13:00"),
    responsavel: "Grupo de Usuários Linux da UFF (GUL-UFF)",
    duracao: 4,
    categoria: getCategoriaOuUndefined("Minicursos ou Tutoriais realizados durante evento científico ou tecnológico"),
  },
  {
    id: 113,
    nome: "Palestra: Oportunidades de Estágio em TI",
    descricao: "Palestra sobre o mercado de trabalho para profissionais de TI e dicas para conseguir estágios.",
    inicio: parseDateString("20/05/2023 14:00"),
    fim: parseDateString("20/05/2023 16:00"),
    responsavel: "Empresa Júnior de Computação",
    duracao: 2,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 114,
    nome: "Workshop: Ferramentas de Produtividade para Estudantes",
    descricao: "Workshop sobre o uso de ferramentas digitais para organização e gestão de tempo, como Notion e Google Sheets.",
    inicio: parseDateString("10/06/2023 10:00"),
    fim: parseDateString("10/06/2023 13:00"),
    responsavel: "Biblioteca Central da UFF",
    duracao: 3,
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 115,
    nome: "Participação no \"Café com Código\"",
    descricao: "Evento informal de networking e troca de experiências entre alunos de computação.",
    inicio: parseDateString("05/07/2023 16:00"),
    fim: parseDateString("05/07/2023 18:00"),
    responsavel: "Centro Acadêmico de Ciência da Computação (CACC)",
    duracao: 2,
    categoria: getCategoriaOuUndefined("Participação em eventos estudantis, nacionais ou regionais, ligados à formação do aluno"),
  },
];