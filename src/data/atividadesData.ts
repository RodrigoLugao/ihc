// src/data/atividadesData.ts
// Certifique-se de que as importações estão corretas
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { type CategoriaAtividade, findCategoryByName } from '../interfaces/Categoria'; // Caminho para Categoria.ts
import type { Atividade } from '../interfaces/Atividade';

dayjs.extend(customParseFormat);

const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

const parseDateString = (dateString: string): Date => {
  return dayjs(dateString, DATETIME_FORMAT).toDate();
};

// Helper para obter uma categoria com segurança, caso o findCategoryByName retorne undefined
const getCategoriaOuUndefined = (categoryName: string): CategoriaAtividade | undefined => {
  const category = findCategoryByName(categoryName);
  if (!category) {
    console.warn(`Atenção: Categoria "${categoryName}" não encontrada em categoriasData. Atividade pode não ter informações de AC corretas.`);
  }
  return category;
};

export const atividadesData: Atividade[] = [
  // Atividades existentes do cenário do Marcelo (re-incluídas com cargaHoraria)
  {
    id: 1, // ID mantido do exemplo anterior
    nome: "Iniciação Científica (1 ano)",
    descricao: "Projeto de pesquisa em Algoritmos para Grafos.",
    inicio: new Date('2022-03-01T09:00:00'),
    fim: new Date('2023-03-01T17:00:00'),
    responsavel: "Prof. Ana Paula",
    cargaHoraria: 170, // Ex: 170 horas de dedicação ao projeto
    categoria: getCategoriaOuUndefined("Iniciação Científica"),
  },
  {
    id: 2, // ID mantido do exemplo anterior
    nome: "Membro da Empresa Júnior",
    descricao: "Desenvolvimento de sistemas para clientes externos.",
    inicio: new Date('2023-01-10T09:00:00'),
    fim: new Date('2024-01-10T17:00:00'),
    responsavel: "Empresa Júnior UFF",
    cargaHoraria: 200, // Ex: 200 horas de trabalho na EJ
    categoria: getCategoriaOuUndefined("Participação em Empresa Júnior"),
  },
  {
    id: 3, // ID mantido do exemplo anterior
    nome: "Palestra: A Evolução da IA",
    descricao: "Participação em palestra sobre Inteligência Artificial.",
    inicio: new Date('2024-04-05T14:00:00'),
    fim: new Date('2024-04-05T16:00:00'),
    responsavel: "Evento da Semana da Computação",
    cargaHoraria: 2, // 2 horas de duração da palestra
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 4, // ID mantido do exemplo anterior
    nome: "Semana Acadêmica UFF (Edição 2023)",
    descricao: "Participação em palestras e workshops na Semana Acadêmica do Instituto de Computação.",
    inicio: new Date('2023-10-20T09:00:00'),
    fim: new Date('2023-10-25T18:00:00'),
    responsavel: "Instituto de Computação - UFF",
    cargaHoraria: 30, // Exemplo de carga horária total do evento (somando as participações)
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 5, // ID mantido do exemplo anterior
    nome: "Participação no Hackathon UFFTech",
    descricao: "Participação em um hackathon de 24 horas organizado pela UFF. Foco em soluções para cidades inteligentes.",
    inicio: new Date('2023-11-10T09:00:00'),
    fim: new Date('2023-11-11T09:00:00'),
    responsavel: "UFF - Coordenação de Eventos",
    cargaHoraria: 24, // Duração do hackathon
    categoria: getCategoriaOuUndefined("Hackaton"),
  },
  {
    id: 6, // ID mantido do exemplo anterior
    nome: "Monitoria da disciplina de Introdução à Programação",
    descricao: "Auxílio aos alunos de graduação da disciplina de Introdução à Programação (INF01234), tirando dúvidas e auxiliando em projetos práticos.",
    inicio: new Date('2024-03-01T08:00:00'),
    fim: new Date('2024-07-01T17:00:00'),
    responsavel: "Departamento de Ciência da Computação, UFF - Prof. João Silva",
    cargaHoraria: 120, // Ex: 4 meses * 30h/mês = 120h
    categoria: getCategoriaOuUndefined("Iniciação a Docência"),
  },
  {
    id: 7, // ID mantido do exemplo anterior
    nome: "Curso online de \"Automação com Python\" (Coursera)",
    descricao: "Conclusão do curso online 'Automação com Python' pela plataforma Coursera, abordando automação de tarefas com scripts.",
    inicio: new Date('2024-05-15T00:00:00'),
    fim: new Date('2024-06-15T23:59:59'),
    responsavel: "Coursera / Google (fornecedor do curso)",
    cargaHoraria: 40, // Carga horária indicada no certificado do curso
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 8, // ID mantido do exemplo anterior
    nome: "Apresentação de trabalho no Simpósio Brasileiro de Engenharia de Software (SBES)",
    descricao: "Apresentação de artigo 'Análise de Escalabilidade em Microsserviços para Aplicações Financeiras'.",
    inicio: new Date('2024-09-23T10:30:00'),
    fim: new Date('2024-09-23T11:00:00'),
    responsavel: "SBES - Sociedade Brasileira de Computação",
    cargaHoraria: 0.5, // 30 minutos de apresentação
    categoria: getCategoriaOuUndefined("Apresentação de Trabalho em eventos científicos ou tecnológicos"), // Assumindo esta categoria
  },
  {
    id: 9, // ID mantido do exemplo anterior (Não Oficial)
    nome: "Contribuição para Projeto Open Source X (Não Oficial)",
    descricao: "Contribuições de código para o projeto de código aberto 'Projeto X' no GitHub.",
    inicio: new Date('2023-08-01T00:00:00'),
    fim: new Date('2024-02-28T23:59:59'),
    responsavel: "Comunidade Open Source",
    cargaHoraria: 80, // Estimativa de horas dedicadas
    categoria: getCategoriaOuUndefined("Outras Atividades Avaliadas pela Comissão"),
  },

  // Suas novas atividades originais com cargaHoraria
  {
    id: 101,
    nome: "Palestra: Introdução à Extensão Universitária",
    descricao: "Palestra introdutória sobre os conceitos e a importância da extensão universitária para a comunidade acadêmica.",
    inicio: parseDateString("15/07/2025 09:00"),
    fim: parseDateString("15/07/2025 10:30"),
    responsavel: "Prof. Fictício Alfa",
    cargaHoraria: 1.5, // 1h30min
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"), // Categoria ajustada
  },
  
  {
    id: 102,
    nome: "Oficina: Como Elaborar Projetos de Extensão",
    descricao: "Oficina prática para auxiliar os alunos na formulação de propostas e projetos de extensão.",
    inicio: parseDateString("15/07/2025 10:45"),
    fim: parseDateString("15/07/2025 12:00"),
    responsavel: "Coordenação Genérica Beta",
    cargaHoraria: 1.25, // 1h15min
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"), // Categoria ajustada
  },
  {
    id: 103,
    nome: "Palestra: IA e o Futuro do Mercado de Trabalho",
    descricao: "Discussão sobre o impacto da Inteligência Artificial nas profissões e no mercado de trabalho global.",
    inicio: parseDateString("20/07/2025 14:00"),
    fim: parseDateString("20/07/2025 15:30"),
    responsavel: "Dr. Virtual Gama",
    cargaHoraria: 1.5,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"), // Categoria ajustada
  },
  {
    id: 104,
    nome: "Mesa Redonda: Desafios Éticos da IA",
    descricao: "Debate com especialistas sobre os dilemas éticos envolvidos no desenvolvimento e uso da Inteligência Artificial.",
    inicio: parseDateString("20/07/2025 15:45"),
    fim: parseDateString("20/07/2025 17:00"),
    responsavel: "Prof. Desenvolvedora Delta",
    cargaHoraria: 1.25,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 105,
    nome: "Cerimônia de Abertura da Maratona",
    descricao: "Abertura oficial da maratona de programação, com as regras e orientações iniciais.",
    inicio: parseDateString("01/08/2025 08:30"),
    fim: parseDateString("01/08/2025 09:00"),
    responsavel: "Comissão Organizadora do Evento",
    cargaHoraria: 0.5,
    categoria: getCategoriaOuUndefined("Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona"),
  },
  {
    id: 106,
    nome: "Competição de Programação",
    descricao: "Maratona de codificação em equipes para resolver problemas algorítmicos complexos.",
    inicio: parseDateString("01/08/2025 09:00"),
    fim: parseDateString("01/08/2025 17:00"),
    responsavel: "Equipe de Arbitragem Epsilon",
    cargaHoraria: 8, // 8 horas de competição
    categoria: getCategoriaOuUndefined("Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona"),
  },
  {
    id: 107,
    nome: "Workshop: Redação de Artigos Científicos",
    descricao: "Orientações práticas para a escrita e formatação de artigos científicos.",
    inicio: parseDateString("10/08/2025 09:00"),
    fim: parseDateString("10/08/2025 12:00"),
    responsavel: "Dra. Conhecimento Zeta",
    cargaHoraria: 3,
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 108,
    nome: "Apresentação de Projetos de Iniciação Científica",
    descricao: "Alunos apresentam seus projetos de pesquisa para a comunidade acadêmica.",
    inicio: parseDateString("10/08/2025 14:00"),
    fim: parseDateString("10/08/2025 17:00"),
    responsavel: "Comitê Avaliador Theta",
    cargaHoraria: 3, // Duração do evento, não da apresentação individual
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"), // Categoria ajustada
  },
  {
    id: 109,
    nome: "Palestras das Empresas Parceiras",
    descricao: "Empresas convidadas apresentam suas culturas, projetos e oportunidades de carreira.",
    inicio: parseDateString("25/08/2025 09:00"),
    fim: parseDateString("25/08/2025 12:00"),
    responsavel: "Conselho de Indústria Iota",
    cargaHoraria: 3,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"), // Categoria ajustada
  },
  {
    id: 110,
    nome: "Sessões de Entrevistas e Recrutamento",
    descricao: "Oportunidade para os alunos realizarem entrevistas rápidas com recrutadores.",
    inicio: parseDateString("25/08/2025 14:00"),
    fim: parseDateString("25/08/2025 17:00"),
    responsavel: "Setor de Carreiras Kappa",
    cargaHoraria: 3,
    categoria: getCategoriaOuUndefined("Outras Atividades Avaliadas pela Comissão"), // Categoria "Outra" genérica
  },
  {
    id: 111,
    nome: "Semana de Recepção dos Calouros",
    descricao: "Participação nas atividades de boas-vindas para os novos alunos do curso de Ciência da Computação.",
    inicio: parseDateString("06/03/2023 09:00"),
    fim: parseDateString("10/03/2023 17:00"),
    responsavel: "Centro Acadêmico de Ciência da Computação (CACC)",
    cargaHoraria: 10,
    categoria: getCategoriaOuUndefined("Participação em eventos de recepção de calouros"), // Exemplo de categoria
  },
  {
    id: 112,
    nome: "Minicurso: Introdução ao Linux",
    descricao: "Minicurso básico sobre o sistema operacional Linux, comum em cursos de computação.",
    inicio: parseDateString("15/04/2023 09:00"),
    fim: parseDateString("15/04/2023 13:00"),
    responsavel: "Grupo de Usuários Linux da UFF (GUL-UFF)",
    cargaHoraria: 4,
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"), // Exemplo de categoria
  },
  {
    id: 113,
    nome: "Palestra: Oportunidades de Estágio em TI",
    descricao: "Palestra sobre o mercado de trabalho para profissionais de TI e dicas para conseguir estágios.",
    inicio: parseDateString("20/05/2023 14:00"),
    fim: parseDateString("20/05/2023 16:00"),
    responsavel: "Empresa Júnior de Computação",
    cargaHoraria: 2,
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"), // Exemplo de categoria
  },
  {
    id: 114,
    nome: "Workshop: Ferramentas de Produtividade para Estudantes",
    descricao: "Workshop sobre o uso de ferramentas digitais para organização e gestão de tempo, como Notion e Google Sheets.",
    inicio: parseDateString("10/06/2023 10:00"),
    fim: parseDateString("10/06/2023 13:00"),
    responsavel: "Biblioteca Central da UFF",
    cargaHoraria: 3,
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"), // Exemplo de categoria
  },
    {
    id: 115,
    nome: "Participação no \"Café com Código\"",
    descricao: "Evento informal de networking e troca de experiências entre alunos de computação.",
    inicio: parseDateString("05/07/2023 16:00"),
    fim: parseDateString("05/07/2023 18:00"),
    responsavel: "Centro Acadêmico de Ciência da Computação (CACC)",
    cargaHoraria: 2,
    categoria: getCategoriaOuUndefined("Participação em eventos de integração e networking"), // Exemplo de categoria
  },
];