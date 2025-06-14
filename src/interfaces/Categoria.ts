// src/interfaces/Categorias.ts

/**
 * Interface para detalhes de horas de um currículo específico (Antigo ou Novo).
 * Representa uma linha da tabela de Atividades Complementares para um dado currículo.
 */
export interface HorasCurriculoDetalhado {
  textoOriginal: string; // O texto original como está no PDF (e.g., "34 horas cursadas = 17 horas/AC")
  tipoCalculo: 'fixo' | 'proporcional' | 'criterio_comissao'; // Tipo de cálculo para horas AC

  // Campos para tipoCalculo: 'proporcional'
  baseValor?: number;   // O valor numérico da base (e.g., 34 para "34 horas cursadas")
  baseUnidade?: string; // A unidade da base (e.g., "horas cursadas", "ano", "apresentação")

  // Campos para tipoCalculo: 'fixo' ou 'proporcional'
  horasAC?: number;     // O número de horas AC concedidas (e.g., 17, 34, 0.5)

  maximoHorasAC: number; // O valor numérico do máximo de horas equivalentes (e.g., 17 para "17 horas")
}

/**
 * Interface principal para cada categoria de atividade complementar.
 * Contém as regras de horas para o currículo antigo e novo.
 */
export interface CategoriaAtividade {
  tipo: string; // Nome da categoria da atividade (e.g., "Disciplina Eletiva")
  curriculoAntigo: HorasCurriculoDetalhado;
  curriculoNovo: HorasCurriculoDetalhado;
}

/**
 * Array com os dados de todas as categorias de atividades complementares,
 * conforme a Tabela de Pontuação para Atividades Complementares.
 */
export const categoriasData: CategoriaAtividade[] = [
  {
    tipo: "Disciplina Eletiva presencial ou a distância - UFF",
    curriculoAntigo: {
      textoOriginal: "34 horas cursadas = 17 horas/AC",
      baseValor: 34,
      baseUnidade: "horas cursadas",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "34 horas cursadas = 17 horas/AC",
      baseValor: 34,
      baseUnidade: "horas cursadas",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Disciplina Isolada (outra IES)",
    curriculoAntigo: {
      textoOriginal: "34 horas cursadas = 17 horas/AC",
      baseValor: 34,
      baseUnidade: "horas cursadas",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "34 horas cursadas = 17 horas/AC",
      baseValor: 34,
      baseUnidade: "horas cursadas",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Iniciação a Docência",
    curriculoAntigo: {
      textoOriginal: "1 ano = 34 horas/AC",
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 68 horas/AC",
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 68,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "Desenvolvimento de material didático",
    curriculoAntigo: {
      textoOriginal: "1 ano = 17 horas/AC",
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 34 horas/AC", // Removido o $, pois não é LaTeX aqui
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Prática de Laboratório de Computação ou áreas afins",
    curriculoAntigo: {
      textoOriginal: "1 ano = 17 horas/AC", // Removido o $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 34 horas/AC", // Removido o $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Participação em Projeto de Ensino",
    curriculoAntigo: {
      textoOriginal: "1 ano = 17 horas/AC", // Removido o $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 34 horas/AC", // Removido o $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Estágio",
    curriculoAntigo: {
      textoOriginal: "6 meses = 17 horas/AC",
      baseValor: 6,
      baseUnidade: "meses",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "6 meses = 34 horas/AC",
      baseValor: 6,
      baseUnidade: "meses",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "Curso de Língua Estrangeira",
    curriculoAntigo: {
      textoOriginal: "1 ano = 17 horas/AC", // Removido o $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 34 horas/AC", // Removido o $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Participação em Conselhos, Colegiados e Comissões",
    curriculoAntigo: {
      textoOriginal: "1 ano = 17 horas/AC", // Corrigido $l$ para $1$ e removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 34 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Iniciação Científica e Tecnológica",
    curriculoAntigo: {
      textoOriginal: "1 ano = 34 horas/AC", // Corrigido $l$ para $1$ e removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 68 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 68,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "Participação em Projeto de Pesquisa",
    curriculoAntigo: {
      textoOriginal: "1 ano = 34 horas/AC", // Corrigido $l$ para $1$ e removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 68 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 68,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "Participação em Projeto de Extensão",
    curriculoAntigo: {
      textoOriginal: "1 ano = 34 horas/AC", // Corrigido $l$ para $1$ e removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 68 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 68,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "Participação na Empresa Jr (Diretor)",
    curriculoAntigo: {
      textoOriginal: "1 ano = 17 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 34 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Participação na Empresa Jr (Membro)",
    curriculoAntigo: {
      textoOriginal: "1 ano = 9 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 9,
      tipoCalculo: "proporcional",
      maximoHorasAC: 9,
    },
    curriculoNovo: {
      textoOriginal: "1 ano = 18 horas/AC", // Removido $
      baseValor: 1,
      baseUnidade: "ano",
      horasAC: 18,
      tipoCalculo: "proporcional",
      maximoHorasAC: 18,
    },
  },
  {
    tipo: "Minicursos ou Tutoriais realizados durante evento científico ou tecnológico",
    curriculoAntigo: {
      textoOriginal: "4 horas cursadas = 1 hora/AC",
      baseValor: 4,
      baseUnidade: "horas cursadas",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 6,
    },
    curriculoNovo: {
      textoOriginal: "4 horas cursadas = 2 horas/AC",
      baseValor: 4,
      baseUnidade: "horas cursadas",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 12,
    },
  },
  {
    tipo: "Minicursos ou Tutoriais ministrados durante evento científico ou tecnológico",
    curriculoAntigo: {
      textoOriginal: "1 hora ministrada = 2 horas/AC",
      baseValor: 1,
      baseUnidade: "hora ministrada",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 8,
    },
    curriculoNovo: {
      textoOriginal: "1 hora ministradas = 4 horas/AC",
      baseValor: 1,
      baseUnidade: "hora ministrada",
      horasAC: 4,
      tipoCalculo: "proporcional",
      maximoHorasAC: 16,
    },
  },
  {
    tipo: "Proferir palestras na área de Computação",
    curriculoAntigo: {
      textoOriginal: "1 apresentação = 1 hora/AC",
      baseValor: 1,
      baseUnidade: "apresentação",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 6,
    },
    curriculoNovo: {
      textoOriginal: "1 apresentação = 2 horas/AC",
      baseValor: 1,
      baseUnidade: "apresentação",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 12,
    },
  },
  {
    tipo: "Apresentação de Trabalhos em eventos científicos ou tecnológicos",
    curriculoAntigo: {
      textoOriginal: "1 apresentação = 3 horas/AC",
      baseValor: 1,
      baseUnidade: "apresentação",
      horasAC: 3,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 apresentação = 4 horas/AC",
      baseValor: 1,
      baseUnidade: "apresentação",
      horasAC: 4,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Apresentação de Trabalhos em eventos de Extensão",
    curriculoAntigo: {
      textoOriginal: "1 apresentação = 3 horas/AC",
      baseValor: 1,
      baseUnidade: "apresentação",
      horasAC: 3,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "1 apresentação = 4 horas/AC",
      baseValor: 1,
      baseUnidade: "apresentação",
      horasAC: 4,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Participação em eventos estudantis, nacionais ou regionais, ligados à formação do aluno",
    curriculoAntigo: {
      textoOriginal: "4 horas cursadas = 1 hora/AC",
      baseValor: 4,
      baseUnidade: "horas cursadas",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 6,
    },
    curriculoNovo: {
      textoOriginal: "4 horas cursadas = 2 horas/AC",
      baseValor: 4,
      baseUnidade: "horas cursadas",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 12,
    },
  },
  {
    tipo: "Participação em cursos e treinamentos presenciais ou não, na área de Computação",
    curriculoAntigo: {
      textoOriginal: "60 horas cursadas = 17 horas/AC",
      baseValor: 60,
      baseUnidade: "horas cursadas",
      horasAC: 17,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "60 horas cursadas = 34 horas/AC",
      baseValor: 60,
      baseUnidade: "horas cursadas",
      horasAC: 34,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Participação em seminários, congressos e eventos",
    curriculoAntigo: {
      textoOriginal: "3 horas cursadas = 1 hora/AC",
      baseValor: 3,
      baseUnidade: "horas cursadas",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "3 horas cursadas = 2 horas/AC",
      baseValor: 3,
      baseUnidade: "horas cursadas",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona",
    curriculoAntigo: {
      textoOriginal: "1 hora = 0,5 hora/AC",
      baseValor: 1,
      baseUnidade: "hora",
      horasAC: 0.5,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "1 hora = 1 hora/AC",
      baseValor: 1,
      baseUnidade: "hora",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "Hackaton",
    curriculoAntigo: {
      textoOriginal: "4 horas = 1 hora/AC",
      baseValor: 4,
      baseUnidade: "horas",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "4 horas = 2 horas/AC",
      baseValor: 4,
      baseUnidade: "horas",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Organização de eventos na área de Computação ou em áreas afins",
    curriculoAntigo: {
      textoOriginal: "1 evento organizado = 3 horas/AC",
      baseValor: 1,
      baseUnidade: "evento organizado",
      horasAC: 3,
      tipoCalculo: "proporcional",
      maximoHorasAC: 6,
    },
    curriculoNovo: {
      textoOriginal: "1 evento organizado = 4 horas/AC",
      baseValor: 1,
      baseUnidade: "evento organizado",
      horasAC: 4,
      tipoCalculo: "proporcional",
      maximoHorasAC: 12,
    },
  },
  {
    tipo: "Semana Acadêmica de Computação",
    curriculoAntigo: {
      textoOriginal: "4 horas = 1 hora/AC",
      baseValor: 4,
      baseUnidade: "horas",
      horasAC: 1,
      tipoCalculo: "proporcional",
      maximoHorasAC: 17,
    },
    curriculoNovo: {
      textoOriginal: "4 horas = 2 horas/AC",
      baseValor: 4,
      baseUnidade: "horas",
      horasAC: 2,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
  },
  {
    tipo: "Outra",
    curriculoAntigo: {
      textoOriginal: "A critério da Comissão de AC",
      tipoCalculo: "criterio_comissao",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "A critério da Comissão de AC",
      tipoCalculo: "criterio_comissao",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "1ª Semana de Computação (Aula Inaugural)",
    curriculoAntigo: {
      textoOriginal: "10 horas/AC",
      horasAC: 10,
      tipoCalculo: "fixo",
      maximoHorasAC: 10, // Assumindo que o valor fixo também é o máximo para este caso
    },
    curriculoNovo: {
      textoOriginal: "10 horas/AC",
      horasAC: 10,
      tipoCalculo: "fixo",
      maximoHorasAC: 10, // Assumindo que o valor fixo também é o máximo para este caso
    },
  },
  {
    tipo: "1ª Semana de Computação (Palestra)",
    curriculoAntigo: {
      textoOriginal: "1 palestra = 4 horas/AC",
      baseValor: 1,
      baseUnidade: "palestra",
      horasAC: 4,
      tipoCalculo: "proporcional",
      maximoHorasAC: 34,
    },
    curriculoNovo: {
      textoOriginal: "1 palestra = 4 horas/AC",
      baseValor: 1,
      baseUnidade: "palestra",
      horasAC: 4,
      tipoCalculo: "proporcional",
      maximoHorasAC: 68,
    },
  },
  {
    tipo: "1ª Semana de Computação (Minicurso)",
    curriculoAntigo: {
      textoOriginal: "1 minicurso = 8 horas/AC",
      baseValor: 1,
      baseUnidade: "minicurso",
      horasAC: 8,
      tipoCalculo: "proporcional",
      maximoHorasAC: 8, // Assumindo que o valor é o máximo para este caso
    },
    curriculoNovo: {
      textoOriginal: "1 minicurso = 8 horas/AC",
      baseValor: 1,
      baseUnidade: "minicurso",
      horasAC: 8,
      tipoCalculo: "proporcional",
      maximoHorasAC: 8, // Assumindo que o valor é o máximo para este caso
    },
  },
];

// Opcional: Para gerar uma lista de nomes de categorias para uso em selects
export const activityCategoriesNames = categoriasData.map(c => c.tipo);

// Função auxiliar para encontrar uma categoria pelo nome
export const findCategoryByName = (name: string): CategoriaAtividade | undefined => {
  return categoriasData.find(cat => cat.tipo === name);
};