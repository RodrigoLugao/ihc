// src/data/categoriasData.ts

export interface CategoriaAtividade {
  nome: string; // Nome da categoria da atividade (e.g., "Disciplina Eletiva")
  unidadeDeTempo: string; // Unidade de tempo do período que um aluno passa realizando as atividades da categoria. Ex.: horas, meses, anos, apresentações, eventos.
  descricaoAntiga: string; // Texto sobre o cálculo no currículo antigo
  descricaoNova: string; // Texto sobre o cálculo no currículo novo
  coeficienteAntigo: number; // Multiplicador para converter a 'unidadeDeTempo' em horas de AC para o currículo antigo
  coeficienteNovo: number; // Multiplicador para converter a 'unidadeDeTempo' em horas de AC para o currículo novo
  maximoAntigo: number; // Máximo de horas/AC permitidas para esta categoria no currículo antigo
  maximoNovo: number; // Máximo de horas/AC permitidas para esta categoria no currículo novo
}

export const categoriasData: CategoriaAtividade[] = [
  {
    nome: "Disciplina Eletiva presencial ou a distância - UFF",
    unidadeDeTempo: "horas cursadas",
    descricaoAntiga: "34 horas cursadas = 17 horas/AC", // 
    coeficienteAntigo: 17 / 34, // 
    maximoAntigo: 17, // 
    descricaoNova: "34 horas cursadas = 17 horas/AC", // 
    coeficienteNovo: 17 / 34, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Disciplina Isolada (outra IES)",
    unidadeDeTempo: "horas cursadas",
    descricaoAntiga: "34 horas cursadas = 17 horas/AC", // 
    coeficienteAntigo: 17 / 34, // 
    maximoAntigo: 17, // 
    descricaoNova: "34 horas cursadas = 17 horas/AC", // 
    coeficienteNovo: 17 / 34, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Iniciação a Docência",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 34 horas/AC", // 
    coeficienteAntigo: 34 / 1, // 
    maximoAntigo: 34, // 
    descricaoNova: "1 ano = 68 horas/AC", // 
    coeficienteNovo: 68 / 1, // 
    maximoNovo: 68, // 
  },
  {
    nome: "Desenvolvimento de material didático",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 17 horas/AC", // 
    coeficienteAntigo: 17 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 ano = 34 horas/AC", // 
    coeficienteNovo: 34 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Prática de Laboratório de Computação ou áreas afins",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 17 horas/AC", // 
    coeficienteAntigo: 17 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 ano = 34 horas/AC", // 
    coeficienteNovo: 34 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Participação em Projeto de Ensino",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 17 horas/AC", // 
    coeficienteAntigo: 17 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 ano = 34 horas/AC", // 
    coeficienteNovo: 34 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Estágio",
    unidadeDeTempo: "meses",
    descricaoAntiga: "6 meses = 17 horas/AC", // 
    coeficienteAntigo: 17 / 6, // 
    maximoAntigo: 34, // 
    descricaoNova: "6 meses = 34 horas/AC", // 
    coeficienteNovo: 34 / 6, // 
    maximoNovo: 68, // 
  },
  {
    nome: "Curso de Língua Estrangeira",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 17 horas/AC", // 
    coeficienteAntigo: 17 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 ano = 34 horas/AC", // 
    coeficienteNovo: 34 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Participação em Conselhos, Colegiados e Comissões",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 17 horas/AC", // 
    coeficienteAntigo: 17 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 ano = 34 horas/AC", // 
    coeficienteNovo: 34 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Iniciação Científica e Tecnológica",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 34 horas/AC", // 
    coeficienteAntigo: 34 / 1, // 
    maximoAntigo: 34, // 
    descricaoNova: "1 ano = 68 horas/AC", // 
    coeficienteNovo: 68 / 1, // 
    maximoNovo: 68, // 
  },
  {
    nome: "Participação em Projeto de Pesquisa",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 34 horas/AC", // 
    coeficienteAntigo: 34 / 1, // 
    maximoAntigo: 34, // 
    descricaoNova: "1 ano = 68 horas/AC", // 
    coeficienteNovo: 68 / 1, // 
    maximoNovo: 68, // 
  },
  {
    nome: "Participação em Projeto de Extensão",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 34 horas/AC", // 
    coeficienteAntigo: 34 / 1, // 
    maximoAntigo: 34, // 
    descricaoNova: "1 ano = 68 horas/AC", // 
    coeficienteNovo: 68 / 1, // 
    maximoNovo: 68, // 
  },
  {
    nome: "Participação na Empresa Jr (Diretor)",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 17 horas/AC", // 
    coeficienteAntigo: 17 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 ano = 34 horas/AC", // 
    coeficienteNovo: 34 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Participação na Empresa Jr (Membro)",
    unidadeDeTempo: "anos",
    descricaoAntiga: "1 ano = 9 horas/AC", // 
    coeficienteAntigo: 9 / 1, // 
    maximoAntigo: 9, // 
    descricaoNova: "1 ano = 18 horas/AC", // 
    coeficienteNovo: 18 / 1, // 
    maximoNovo: 18, // 
  },
  {
    nome: "Minicursos ou Tutoriais realizados durante evento científico ou tecnológico",
    unidadeDeTempo: "horas cursadas",
    descricaoAntiga: "4 horas cursadas = 1 hora/AC", // 
    coeficienteAntigo: 1 / 4, // 
    maximoAntigo: 6, // 
    descricaoNova: "4 horas cursadas = 2 horas/AC", // 
    coeficienteNovo: 2 / 4, // 
    maximoNovo: 12, // 
  },
  {
    nome: "Minicursos ou Tutoriais ministrados durante evento científico ou tecnológico",
    unidadeDeTempo: "horas ministradas",
    descricaoAntiga: "1 hora ministrada = 2 horas/AC", // 
    coeficienteAntigo: 2 / 1, // 
    maximoAntigo: 8, // 
    descricaoNova: "1 hora ministradas = 4 horas/AC", // 
    coeficienteNovo: 4 / 1, // 
    maximoNovo: 16, // 
  },
  {
    nome: "Proferir palestras na área de Computação",
    unidadeDeTempo: "apresentações",
    descricaoAntiga: "1 apresentação = 1 hora/AC", // 
    coeficienteAntigo: 1 / 1, // 
    maximoAntigo: 6, // 
    descricaoNova: "1 apresentação = 2 horas/AC", // 
    coeficienteNovo: 2 / 1, // 
    maximoNovo: 12, // 
  },
  {
    nome: "Apresentação de Trabalhos em eventos científicos ou tecnológicos",
    unidadeDeTempo: "apresentações",
    descricaoAntiga: "1 apresentação = 3 horas/AC", // 
    coeficienteAntigo: 3 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 apresentação = 4 horas/AC", // 
    coeficienteNovo: 4 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Apresentação de Trabalhos em eventos de Extensão",
    unidadeDeTempo: "apresentações",
    descricaoAntiga: "1 apresentação = 3 horas/AC", // 
    coeficienteAntigo: 3 / 1, // 
    maximoAntigo: 17, // 
    descricaoNova: "1 apresentação = 4 horas/AC", // 
    coeficienteNovo: 4 / 1, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Participação em eventos estudantis, nacionais ou regionais, ligados à formação do aluno",
    unidadeDeTempo: "horas cursadas",
    descricaoAntiga: "4 horas cursadas = 1 hora/AC", // 
    coeficienteAntigo: 1 / 4, // 
    maximoAntigo: 6, // 
    descricaoNova: "4 horas cursadas = 2 horas/AC", // 
    coeficienteNovo: 2 / 4, // 
    maximoNovo: 12, // 
  },
  {
    nome: "Participação em cursos e treinamentos presenciais ou não, na área de Computação",
    unidadeDeTempo: "horas cursadas",
    descricaoAntiga: "60 horas cursadas = 17 horas/AC", // 
    coeficienteAntigo: 17 / 60, // 
    maximoAntigo: 17, // 
    descricaoNova: "60 horas cursadas = 34 horas/AC", // 
    coeficienteNovo: 34 / 60, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Participação em seminários, congressos e eventos",
    unidadeDeTempo: "horas cursadas",
    descricaoAntiga: "3 horas cursadas = 1 hora/AC", // 
    coeficienteAntigo: 1 / 3, // 
    maximoAntigo: 17, // 
    descricaoNova: "3 horas cursadas = 2 horas/AC", // 
    coeficienteNovo: 2 / 3, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona",
    unidadeDeTempo: "horas",
    descricaoAntiga: "1 hora = 0,5 hora/AC", // 
    coeficienteAntigo: 0.5 / 1, // 
    maximoAntigo: 34, // 
    descricaoNova: "1 hora = 1 hora/AC", // 
    coeficienteNovo: 1 / 1, // 
    maximoNovo: 68, // 
  },
  {
    nome: "Hackaton",
    unidadeDeTempo: "horas",
    descricaoAntiga: "4 horas = 1 hora/AC", // 
    coeficienteAntigo: 1 / 4, // 
    maximoAntigo: 17, // 
    descricaoNova: "4 horas = 2 horas/AC", // 
    coeficienteNovo: 2 / 4, // 
    maximoNovo: 34, // 
  },
  {
    nome: "Organização de eventos na área de Computação ou em áreas afins",
    unidadeDeTempo: "eventos organizados",
    descricaoAntiga: "1 evento organizado = 3 horas/AC", // 
    coeficienteAntigo: 3 / 1, // 
    maximoAntigo: 6, // 
    descricaoNova: "1 evento organizado = 4 horas/AC", // 
    coeficienteNovo: 4 / 1, // 
    maximoNovo: 12, // 
  },
  {
    nome: "Semana Acadêmica de Computação",
    unidadeDeTempo: "horas",
    descricaoAntiga: "4 horas = 1 hora/AC", // 
    coeficienteAntigo: 1 / 4, // 
    maximoAntigo: 17, // 
    descricaoNova: "4 horas = 2 horas/AC", // 
    coeficienteNovo: 2 / 4, // 
    maximoNovo: 34, // 
  },
  {
    // A tabela menciona "Outra" com "A critério da Comissão de AC".
    // Para coeficientes, um valor de 1 é um bom padrão, pois o máximo limitará.
    nome: "Outra",
    unidadeDeTempo: "horas",
    descricaoAntiga: "A critério da Comissão de AC", // 
    coeficienteAntigo: 1,
    maximoAntigo: 34, // 
    descricaoNova: "A critério da Comissão de AC", // 
    coeficienteNovo: 1,
    maximoNovo: 68, // 
  },
  {
    // Aula Inaugural, com valor fixo.
    // Coeficiente é o próprio valor, e a unidade pode ser "horas"
    // ou "atividade" se for um evento único que já tem um valor de AC.
    nome: "1ª Semana de Computação (Aula Inaugural)",
    unidadeDeTempo: "atividade", // É um valor fixo de horas/AC por evento
    descricaoAntiga: "10 horas/AC", // 
    coeficienteAntigo: 10,
    maximoAntigo: 10, // Não há máximo explícito, assume-se que é o próprio valor para uma única ocorrência.
    descricaoNova: "10 horas/AC", // 
    coeficienteNovo: 10,
    maximoNovo: 10,
  },
  {
    nome: "1ª Semana de Computação (Palestra)",
    unidadeDeTempo: "palestras",
    descricaoAntiga: "1 palestra = 4 horas/AC", // 
    coeficienteAntigo: 4 / 1,
    maximoAntigo: 34, // 
    descricaoNova: "1 palestra = 4 horas/AC", // 
    coeficienteNovo: 4 / 1,
    maximoNovo: 68, // 
  },
  {
    nome: "1ª Semana de Computação (Minicurso)",
    unidadeDeTempo: "minicursos",
    descricaoAntiga: "1 minicurso = 8 horas/AC", // 
    coeficienteAntigo: 8 / 1,
    maximoAntigo: 8, // Não há máximo explícito, assume-se que é o próprio valor para uma única ocorrência.
    descricaoNova: "1 minicurso = 8 horas/AC", // 
    coeficienteNovo: 8 / 1,
    maximoNovo: 8,
  },
];

// Opcional: Para gerar uma lista de nomes de categorias para uso em selects
export const activityCategoriesNames = categoriasData.map(c => c.nome);

// Função auxiliar para encontrar uma categoria pelo nome
export const findCategoryByName = (name: string): CategoriaAtividade | undefined => {
  return categoriasData.find(cat => cat.nome === name);
};