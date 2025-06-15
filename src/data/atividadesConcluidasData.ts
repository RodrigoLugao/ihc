import type { AtividadeConcluida } from "../interfaces/AtivdadeConcluida";

export const atividadesConcluidasData: AtividadeConcluida[] = [
  // Atividades concluídas existentes (se houver)
  {
    idAtividade: 1, // Iniciação Científica (1 ano)
    idUsuario: 4, // Marcelo Villa
    comprovante: "certificado_ic_marcelo_2022_2023.pdf",
  },
  {
    idAtividade: 2, // Membro da Empresa Júnior
    idUsuario: 4,
    comprovante: "declaracao_empresa_junior_marcelo.pdf",
  },
  {
    idAtividade: 3, // Palestra: A Evolução da IA
    idUsuario: 4,
    comprovante: "certificado_palestra_ia_marcelo.pdf",
  },
  {
    idAtividade: 4, // Semana Acadêmica UFF (Edição 2023)
    idUsuario: 4,
    comprovante: "certificado_semana_academica_2023_marcelo.pdf",
  },

  // NOVAS ATIVIDADES CONCLUÍDAS PARA MARCELO:
  {
    idAtividade: 5, // Participação no Hackathon UFFTech
    idUsuario: 4,
    comprovante: "certificado_hackathon_ufftech_marcelo.pdf",
  },
  {
    idAtividade: 6, // Monitoria da disciplina de Introdução à Programação
    idUsuario: 4,
    comprovante: "declaracao_monitoria_programacao_marcelo.pdf",
  },
  {
    idAtividade: 7, // Curso online de "Automação com Python"
    idUsuario: 4,
    comprovante: "certificado_automacao_python_coursera_marcelo.pdf",
  },
  {
    idAtividade: 8, // Apresentação de trabalho no SBES
    idUsuario: 4,
    comprovante: "certificado_apresentacao_sbes_marcelo.pdf",
  },
  {
    idAtividade: 9, // Contribuição para Projeto Open Source X
    idUsuario: 4,
    comprovante: "print_commits_projeto_open_source_x.png", // Comprovante "perdido" ou em formato incomum
  },
  {
    idAtividade: 111, // Semana de Recepção dos Calouros
    idUsuario: 3, // Natália Fernandes
    comprovante: "declaracao_semana_recepcao_calouros_natalia.pdf",
  },
  {
    idAtividade: 112, // Minicurso: Introdução ao Linux
    idUsuario: 3,
    comprovante: "certificado_minicurso_linux_natalia.pdf",
  },
  {
    idAtividade: 113, // Palestra: Oportunidades de Estágio em TI
    idUsuario: 3,
    comprovante: "certificado_palestra_estagio_ti_natalia.pdf",
  },
  {
    idAtividade: 114, // Workshop: Ferramentas de Produtividade para Estudantes
    idUsuario: 3,
    comprovante: "certificado_workshop_produtividade_natalia.pdf",
  },
  {
    idAtividade: 115, // Participação no "Café com Código"
    idUsuario: 3,
    comprovante: "lista_presenca_cafe_com_codigo_natalia.pdf", // Exemplo de comprovante não usual
  },
];
