// src/utils/acUtils.ts
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import type { HorasCurriculoDetalhado, activityCategoriesNames } from '../interfaces/Categoria';
import type { Atividade } from '../interfaces/Atividade';

dayjs.extend(duration);

export type CurriculoTipo = 'curriculoAntigo' | 'curriculoNovo';

/**
 * Calcula as horas de Atividades Complementares (AC) para uma dada atividade,
 * com base no tipo de currículo e na duração da atividade.
 * @param atividade O objeto Atividade, que já contém a categoria AC.
 * @param curriculo O tipo de currículo ('curriculoAntigo' ou 'curriculoNovo').
 * @returns O número de horas AC calculadas, ou 0 se não for possível calcular.
 */
export const calcularHorasAC = (atividade: Atividade, curriculo: CurriculoTipo): number => {
  const categoria = atividade.categoria; // Acessa o objeto categoria diretamente da atividade

  if (!categoria) {
    // Se a atividade não tem uma categoria AC definida, ou se foi definida como undefined
    console.warn(`Atividade "${atividade.nome}" não possui uma categoria AC associada.`);
    return 0;
  }

  const detalhesCurriculo: HorasCurriculoDetalhado = categoria[curriculo];

  if (!detalhesCurriculo) {
    console.warn(`Detalhes do currículo "${curriculo}" não encontrados para a categoria "${categoria.tipo}".`);
    return 0;
  }

  const duracaoAtividadeEmHoras = dayjs(atividade.fim).diff(dayjs(atividade.inicio), 'hour', true); // Diferença em horas como float

  let horasACCalculadas = 0;

  switch (detalhesCurriculo.tipoCalculo) {
    case 'fixo':
      horasACCalculadas = detalhesCurriculo.horasAC || 0;
      break;
    case 'proporcional':
      if (detalhesCurriculo.baseValor && detalhesCurriculo.horasAC) {
        if (detalhesCurriculo.baseUnidade?.includes('hora')) {
          horasACCalculadas = (duracaoAtividadeEmHoras / detalhesCurriculo.baseValor) * detalhesCurriculo.horasAC;
        } else if (
            detalhesCurriculo.baseUnidade === 'apresentação' ||
            detalhesCurriculo.baseUnidade === 'evento organizado' ||
            detalhesCurriculo.baseUnidade === 'minicurso' ||
            detalhesCurriculo.baseUnidade === 'palestra'
        ) {
          // Para atividades com base por "apresentação", "evento", "minicurso", "palestra"
          // Assumimos que cada instância da atividade conta como 1 unidade para o cálculo.
          // Por exemplo, 1 palestra é 1 unidade para o cálculo, independente da duração real.
          horasACCalculadas = (1 / detalhesCurriculo.baseValor) * (detalhesCurriculo.horasAC || 0);
        } else if (detalhesCurriculo.baseUnidade === 'ano') {
            // Se a unidade for 'ano', e a duração da atividade for por exemplo em dias, precisamos de uma regra de conversão.
            // Para simplificar, vou assumir que '1 ano' se refere à participação em um projeto/curso anual.
            // Aqui, por não termos uma "duração em anos" clara da atividade, podemos tratar como 1 unidade
            // se a atividade representar uma instância completa (e.g., um ano de IC).
            // ALTERNATIVA: Poderíamos calcular a duração em anos se a atividade fosse de longo prazo.
            // Ex: if (dayjs(atividade.fim).diff(dayjs(atividade.inicio), 'year', true) >= detalhesCurriculo.baseValor) { ... }
            // Por enquanto, vou manter a simplificação de "1 unidade" para o cálculo.
            horasACCalculadas = (1 / detalhesCurriculo.baseValor) * (detalhesCurriculo.horasAC || 0);
            console.warn(`Atenção: Unidade de base 'ano' para cálculo proporcional. Considera-se 1 unidade de evento para o cálculo. Revise se esta é a lógica desejada para "${categoria.tipo}".`);
        } else if (detalhesCurriculo.baseUnidade === 'meses') {
            // Similarmente para meses
            // Assumindo que a atividade é uma instância que conta como 1 "período" de meses para o cálculo.
            // ALTERNATIVA: Calcular a duração em meses da atividade e usar na proporção.
            // Ex: const duracaoEmMeses = dayjs(atividade.fim).diff(dayjs(atividade.inicio), 'month', true);
            // horasACCalculadas = (duracaoEmMeses / detalhesCurriculo.baseValor) * (detalhesCurriculo.horasAC || 0);
            horasACCalculadas = (1 / detalhesCurriculo.baseValor) * (detalhesCurriculo.horasAC || 0);
            console.warn(`Atenção: Unidade de base 'meses' para cálculo proporcional. Considera-se 1 unidade de evento para o cálculo. Revise se esta é a lógica desejada para "${categoria.tipo}".`);
        }
        else {
          console.warn(`Unidade de base "${detalhesCurriculo.baseUnidade}" da categoria "${categoria.tipo}" não tratada para cálculo proporcional.`);
          horasACCalculadas = 0;
        }
      }
      break;
    case 'criterio_comissao':
      horasACCalculadas = 0; // Para 'A critério da Comissão de AC'
      break;
    default:
      horasACCalculadas = 0;
  }

  // Aplicar o limite máximo de horas AC
  return Math.min(horasACCalculadas, detalhesCurriculo.maximoHorasAC);
};
