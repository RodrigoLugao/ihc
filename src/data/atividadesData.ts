// src/data/atividadesData.ts
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

export const atividadesData: Atividade[] = [
  // Atividades existentes do cenário do Marcelo (re-incluídas com tempo)
  {
    id: 1,
    nome: "Iniciação Científica (1 ano)",
    descricao: "Projeto de pesquisa em Algoritmos para Grafos.",
    inicio: new Date('2022-03-01T09:00:00'),
    fim: new Date('2023-03-01T17:00:00'),
    responsavel: "Prof. Ana Paula",
    duracao: 1, // 1 ano
    categoria: getCategoriaOuUndefined("Iniciação Científica e Tecnológica"), // Ajustado para o nome exato da tabela
  },
  {
    id: 2,
    nome: "Membro da Empresa Júnior",
    descricao: "Desenvolvimento de sistemas para clientes externos.",
    inicio: new Date('2023-01-10T09:00:00'),
    fim: new Date('2024-01-10T17:00:00'),
    responsavel: "Empresa Júnior UFF",
    duracao: 1, // 1 ano
    categoria: getCategoriaOuUndefined("Participação na Empresa Jr (Membro)"), // Ajustado para o nome exato da tabela
  },
  {
    id: 3,
    nome: "Palestra: A Evolução da IA",
    descricao: "Participação em palestra sobre Inteligência Artificial.",
    inicio: new Date('2024-04-05T14:00:00'),
    fim: new Date('2024-04-05T16:00:00'),
    responsavel: "Evento da Semana da Computação",
    duracao: 2, // 2 horas de duração da palestra
    // Esta atividade é uma "participação" em palestra (assistindo),
    // a categoria mais apropriada é "Participação em seminários, congressos e eventos"
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"),
  },
  {
    id: 4,
    nome: "Semana Acadêmica UFF (Edição 2023)",
    descricao: "Participação em palestras e workshops na Semana Acadêmica do Instituto de Computação.",
    inicio: new Date('2023-10-20T09:00:00'),
    fim: new Date('2023-10-25T18:00:00'),
    responsavel: "Instituto de Computação - UFF",
    duracao: 30, // Exemplo de carga horária total do evento (somando as participações)
    // Embora o nome seja "Semana Acadêmica UFF", a categoria da tabela é "Semana Acadêmica de Computação"
    categoria: getCategoriaOuUndefined("Semana Acadêmica de Computação"), 
  },
  {
    id: 5,
    nome: "Participação no Hackathon UFFTech",
    descricao: "Participação em um hackathon de 24 horas organizado pela UFF. Foco em soluções para cidades inteligentes.",
    inicio: new Date('2023-11-10T09:00:00'),
    fim: new Date('2023-11-11T09:00:00'),
    responsavel: "UFF - Coordenação de Eventos",
    duracao: 24, // Duração do hackathon
    categoria: getCategoriaOuUndefined("Hackaton"),
  },
  {
    id: 6,
    nome: "Monitoria da disciplina de Introdução à Programação",
    descricao: "Auxílio aos alunos de graduação da disciplina de Introdução à Programação (INF01234), tirando dúvidas e auxiliando em projetos práticos.",
    inicio: new Date('2024-03-01T08:00:00'),
    fim: new Date('2024-07-01T17:00:00'),
    responsavel: "Departamento de Ciência da Computação, UFF - Prof. João Silva",
    duracao: 1, // Ex: 4 meses (mar-jul)
    // "Iniciação a Docência" é a mais próxima para monitoria.
    categoria: getCategoriaOuUndefined("Iniciação a Docência"),
  },
  {
    id: 7,
    nome: "Curso online de \"Automação com Python\" (Coursera)",
    descricao: "Conclusão do curso online 'Automação com Python' pela plataforma Coursera, abordando automação de tarefas com scripts.",
    inicio: new Date('2024-05-15T00:00:00'),
    fim: new Date('2024-06-15T23:59:59'),
    responsavel: "Coursera / Google (fornecedor do curso)",
    duracao: 40, // Carga horária indicada no certificado do curso
    categoria: getCategoriaOuUndefined("Participação em cursos e treinamentos presenciais ou não, na área de Computação"),
  },
  {
    id: 8,
    nome: "Apresentação de trabalho no Simpósio Brasileiro de Engenharia de Software (SBES)",
    descricao: "Apresentação de artigo 'Análise de Escalabilidade em Microsserviços para Aplicações Financeiras'.",
    inicio: new Date('2024-09-23T10:30:00'),
    fim: new Date('2024-09-23T11:00:00'),
    responsavel: "SBES - Sociedade Brasileira de Computação",
    duracao: 0.5, // 30 minutos de apresentação
    categoria: getCategoriaOuUndefined("Apresentação de Trabalhos em eventos científicos ou tecnológicos"),
  },
  {
    id: 9,
    nome: "Contribuição para Projeto Open Source X (Não Oficial)",
    descricao: "Contribuições de código para o projeto de código aberto 'Projeto X' no GitHub.",
    inicio: new Date('2023-08-01T00:00:00'),
    fim: new Date('2024-02-28T23:59:59'),
    responsavel: "Comunidade Open Source",
    duracao: 10, // Estimativa de horas dedicadas
    categoria: getCategoriaOuUndefined("Outra"), // Ajustado para o nome exato da tabela "Outra"
  },

  // Suas novas atividades originais com tempo
  {
    id: 101,
    nome: "Palestra: Introdução à Extensão Universitária",
    descricao: "Palestra introdutória sobre os conceitos e a importância da extensão universitária para a comunidade acadêmica.",
    inicio: parseDateString("15/07/2025 09:00"),
    fim: parseDateString("15/07/2025 10:30"),
    responsavel: "Prof. Fictício Alfa",
    duracao: 1.5, // 1h30min
    // Categoria mais adequada para quem ASSISTE a palestras/seminários.
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
    // Uma oficina é um tipo de treinamento ou curso.
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
    // Como é uma "apresentação de projetos", a categoria "Apresentação de Trabalhos em eventos científicos ou tecnológicos" é mais adequada.
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
    categoria: getCategoriaOuUndefined("Outra"), // Categoria "Outra" genérica, pois não se encaixa diretamente nas específicas.
  },
  {
    id: 111,
    nome: "Semana de Recepção dos Calouros",
    descricao: "Participação nas atividades de boas-vindas para os novos alunos do curso de Ciência da Computação.",
    inicio: parseDateString("06/03/2023 09:00"),
    fim: parseDateString("10/03/2023 17:00"),
    responsavel: "Centro Acadêmico de Ciência da Computação (CACC)",
    duracao: 10,
    // "Participação em eventos estudantis, nacionais ou regionais, ligados à formação do aluno"
    // Esta é a categoria mais adequada para recepção de calouros.
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
    // Existem duas categorias de minicursos: 'realizados' e 'ministrados'.
    // Como é 'Introdução ao Linux' e o aluno 'participa', é 'realizado'.
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
    categoria: getCategoriaOuUndefined("Participação em seminários, congressos e eventos"), // Assistir a uma palestra
  },
  {
    id: 114,
    nome: "Workshop: Ferramentas de Produtividade para Estudantes",
    descricao: "Workshop sobre o uso de ferramentas digitais para organização e gestão de tempo, como Notion e Google Sheets.",
    inicio: parseDateString("10/06/2023 10:00"),
    fim: parseDateString("10/06/2023 13:00"),
    responsavel: "Biblioteca Central da UFF",
    duracao: 3,
    // Um workshop é similar a um curso/treinamento.
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