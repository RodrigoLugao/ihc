import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { type Atividade } from './Atividade';
import { atividadesData } from '../data/atividadesData';

dayjs.extend(customParseFormat);

// Formato de entrada para as suas strings de data/hora
const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

// Função auxiliar para parsear data no formato DD/MM/YYYY HH:MM usando Day.js
const parseDateString = (dateString: string): Date => {
  return dayjs(dateString, DATETIME_FORMAT).toDate();
};

export interface Evento {
  id: number;
  name: string;
  slug: string;
  // date?: string; // <-- Removido: O campo 'date' não é mais necessário
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  activities: Atividade[];
}

export const eventData: Evento[] = [
  {
    id: 1,
    name: "Workshop de Extensão",
    slug: "workshop-de-extensao",
    // date: "15/07/2025", // <-- Removido: O valor 'date' não é mais necessário
    location: "Auditório Principal",
    startDate: parseDateString("15/07/2025 08:30"),
    endDate: parseDateString("15/07/2025 17:00"),
    description:
      "Aprenda sobre as oportunidades de extensão universitária e como elas contam para suas atividades complementares.",
    activities: [
      atividadesData.find(a => a.id === 101)!,
      atividadesData.find(a => a.id === 102)!,
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 2,
    name: "Ciclo de Palestras sobre IA",
    slug: "ciclo-de-palestras-sobre-ia",
    // date: "20/07/2025", // <-- Removido
    location: "Sala de Conferências 1",
    startDate: parseDateString("20/07/2025 13:30"),
    endDate: parseDateString("20/07/2025 18:00"),
    description:
      "Participe de um ciclo de palestras com especialistas em Inteligência Artificial e suas aplicações.",
    activities: [
      atividadesData.find(a => a.id === 103)!,
      atividadesData.find(a => a.id === 104)!,
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 3,
    name: "Maratona de Programação",
    slug: "maratona-de-programacao",
    // date: "01/08/2025", // <-- Removido
    location: "Laboratório de Informática",
    startDate: parseDateString("01/08/2025 08:00"),
    endDate: parseDateString("01/08/2025 18:00"),
    description:
      "Teste suas habilidades de programação em um desafio intenso e divertido.",
    activities: [
      atividadesData.find(a => a.id === 105)!,
      atividadesData.find(a => a.id === 106)!,
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 4,
    name: "Seminário de Pesquisa Científica",
    slug: "seminario-de-pesquisa-cientifica",
    // date: "10/08/2025", // <-- Removido
    location: "Biblioteca Central - Sala Multiuso",
    startDate: parseDateString("10/08/2025 08:30"),
    endDate: parseDateString("10/08/2025 17:30"),
    description:
      "Descubra como iniciar e desenvolver projetos de pesquisa na sua área.",
    activities: [
      atividadesData.find(a => a.id === 107)!,
      atividadesData.find(a => a.id === 108)!,
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 5,
    name: "Feira de Carreiras",
    slug: "feira-de-carreiras",
    // date: "25/08/2025", // <-- Removido
    location: "Ginásio Universitário",
    startDate: parseDateString("25/08/2025 08:30"),
    endDate: parseDateString("25/08/2025 17:30"),
    description:
      "Conheça empresas, oportunidades de estágio e vagas de emprego em diversas áreas do conhecimento.",
    activities: [
      atividadesData.find(a => a.id === 109)!,
      atividadesData.find(a => a.id === 110)!,
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 6,
    name: "Boas-Vindas aos Calouros de Computação",
    slug: "boas-vindas-calouros-computacao",
    location: "Auditório do Instituto de Computação",
    startDate: parseDateString("06/03/2023 08:00"), // Data da atividade 111
    endDate: parseDateString("10/03/2023 18:00"), // Data da atividade 111
    description:
      "Evento de integração para os novos alunos de Ciência da Computação, com apresentações e atividades de ambientação.",
    activities: [
      atividadesData.find(a => a.id === 111)!, // Semana de Recepção dos Calouros
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 7,
    name: "Dia do Conhecimento Tecnológico",
    slug: "dia-conhecimento-tecnologico",
    location: "Laboratórios de Redes e Sistemas",
    startDate: parseDateString("15/04/2023 08:30"), // Data da atividade 112
    endDate: parseDateString("15/04/2023 17:30"),
    description:
      "Um dia inteiro dedicado a workshops práticos e minicursos sobre tecnologias emergentes e sistemas operacionais.",
    activities: [
      atividadesData.find(a => a.id === 112)!, // Minicurso: Introdução ao Linux
      atividadesData.find(a => a.id === 114)!, // Workshop: Ferramentas de Produtividade para Estudantes
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 8,
    name: "Fórum de Carreira e Mercado",
    slug: "forum-carreira-mercado",
    location: "Auditório Bloco F",
    startDate: parseDateString("20/05/2023 13:00"), // Data da atividade 113
    endDate: parseDateString("20/05/2023 18:00"),
    description:
      "Palestras e debates com profissionais da área de TI sobre oportunidades de carreira, tendências de mercado e dicas para o sucesso profissional.",
    activities: [
      atividadesData.find(a => a.id === 113)!, // Palestra: Oportunidades de Estágio em TI
    ].filter(Boolean) as Evento['activities'],
  },
  {
    id: 9,
    name: "Café com Código & Networking",
    slug: "cafe-com-codigo-networking",
    location: "Área de Convivência do IC",
    startDate: parseDateString("05/07/2023 15:30"), // Data da atividade 115
    endDate: parseDateString("05/07/2023 19:00"),
    description:
      "Encontro informal para estudantes de computação compartilharem ideias, discutirem projetos e expandirem sua rede de contatos.",
    activities: [
      atividadesData.find(a => a.id === 115)!, // Participação no "Café com Código"
    ].filter(Boolean) as Evento['activities'],
  },
];