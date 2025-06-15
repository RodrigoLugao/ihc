// src/utils/acUtils.ts
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import type { HorasCurriculoDetalhado } from '../interfaces/Categoria';
import type { Atividade } from '../interfaces/Atividade';

// Importe os dados. Certifique-se de que os caminhos estão corretos!
import { atividadesData } from '../data/atividadesData';
import { atividadesConcluidasData } from '../data/atividadesConcluidasData';
import type { AtividadeConcluida } from '../interfaces/AtivdadeConcluida';

dayjs.extend(duration);

export type CurriculoTipo = 'curriculoAntigo' | 'curriculoNovo';

// Fatores de conversão aproximados para transformar horas em outras unidades
// ATENÇÃO: Estes valores podem precisar ser ajustados com base no regulamento específico da UFF,
// se houver diretrizes mais precisas para converter horas para anos/meses de dedicação.
const HORAS_EM_UM_ANO_ATIVIDADE = 170; // Ex: ~4h/semana * 42 semanas de aula (para monitoria, IC, etc)
const HORAS_EM_UM_MES_ATIVIDADE = 40;  // Ex: ~10h/semana * 4 semanas (para cursos curtos, projeto)


/**
 * Calcula as horas de Atividades Complementares (AC) para uma dada atividade,
 * com base no tipo de currículo e na carga horária da atividade.
 * Prioriza o uso do campo `cargaHoraria` para cálculos proporcionais.
 * @param atividade O objeto Atividade, que já contém a categoria AC.
 * @param curriculo O tipo de currículo ('curriculoAntigo' ou 'curriculoNovo').
 * @returns O número de horas AC calculadas, ou 0 se não for possível calcular.
 */
export const calcularHorasAC = (atividade: Atividade, curriculo: CurriculoTipo): number => {
  const categoria = atividade.categoria;

  if (!categoria) {
    console.warn(`Atividade "${atividade.nome}" (ID: ${atividade.id}) não possui uma categoria AC associada. Retornando 0 horas.`);
    return 0;
  }

  const detalhesCurriculo: HorasCurriculoDetalhado = categoria[curriculo];

  if (!detalhesCurriculo) {
    console.warn(`Detalhes do currículo "${curriculo}" não encontrados para a categoria "${categoria.tipo}". Retornando 0 horas.`);
    return 0;
  }

  // O campo cargaHoraria da atividade representa a duração real em horas.
  const cargaHorariaAtividade = atividade.cargaHoraria;

  let horasACCalculadas = 0;

  switch (detalhesCurriculo.tipoCalculo) {
    case 'fixo':
      // Se o cálculo é fixo, simplesmente retorna as horas AC definidas na categoria.
      horasACCalculadas = detalhesCurriculo.horasAC || 0;
      break;

    case 'proporcional':
      if (detalhesCurriculo.baseValor && detalhesCurriculo.horasAC) {
        let quantidadeNaBaseUnidade: number = 0;

        // Determina a "quantidade" da atividade na unidade base de cálculo
        if (detalhesCurriculo.baseUnidade === 'hora' || detalhesCurriculo.baseUnidade === 'horas' || detalhesCurriculo.baseUnidade === 'horas cursadas') {
          // Se a unidade base já é em horas, usamos a cargaHoraria da atividade diretamente.
          quantidadeNaBaseUnidade = cargaHorariaAtividade;
        } else if (detalhesCurriculo.baseUnidade === 'ano') {
          // Converte a carga horária da atividade para "anos" para o cálculo proporcional.
          quantidadeNaBaseUnidade = cargaHorariaAtividade / HORAS_EM_UM_ANO_ATIVIDADE;
        } else if (detalhesCurriculo.baseUnidade === 'meses') {
          // Converte a carga horária da atividade para "meses" para o cálculo proporcional.
          quantidadeNaBaseUnidade = cargaHorariaAtividade / HORAS_EM_UM_MES_ATIVIDADE;
        } else if (
          detalhesCurriculo.baseUnidade === 'apresentação' ||
          detalhesCurriculo.baseUnidade === 'evento organizado' ||
          detalhesCurriculo.baseUnidade === 'minicurso' ||
          detalhesCurriculo.baseUnidade === 'palestra'
        ) {
          // Para unidades de base que representam eventos discretos, assume-se 1 instância da atividade.
          quantidadeNaBaseUnidade = 1;
          console.warn(`Atenção: A unidade de base "${detalhesCurriculo.baseUnidade}" da categoria "${categoria.tipo}" é discreta. A 'cargaHoraria' da atividade não é usada para o cálculo proporcional; considera-se 1 instância da atividade.`);
        } else {
          console.warn(`Unidade de base "${detalhesCurriculo.baseUnidade}" da categoria "${categoria.tipo}" não tratada para cálculo proporcional. Retornando 0 horas.`);
          horasACCalculadas = 0;
          break;
        }

        // Realiza o cálculo proporcional usando a quantidade determinada na unidade base
        horasACCalculadas = (quantidadeNaBaseUnidade / detalhesCurriculo.baseValor) * detalhesCurriculo.horasAC;
      }
      break;

    case 'criterio_comissao':
      horasACCalculadas = 0; // Para 'A critério da Comissão de AC', o cálculo automático é 0.
      break;

    default:
      console.warn(`Tipo de cálculo "${detalhesCurriculo.tipoCalculo}" da categoria "${categoria.tipo}" não reconhecido. Retornando 0 horas.`);
      horasACCalculadas = 0;
  }

  // Aplicar o limite máximo de horas AC definido na categoria
  return Math.min(horasACCalculadas, detalhesCurriculo.maximoHorasAC);
};

/**
 * Retorna todas as atividades concluídas por um usuário específico.
 * @param idUsuario O ID do usuário.
 * @returns Um array de objetos AtividadeConcluida.
 */
export const getAtividadesConcluidasByUsuario = (idUsuario: number): AtividadeConcluida[] => {
  return atividadesConcluidasData.filter(ac => ac.idUsuario === idUsuario);
};

/**
 * Calcula o total de horas de Atividades Complementares para um usuário específico,
 * com base nas atividades que ele concluiu e no tipo de currículo.
 * @param idUsuario O ID do usuário.
 * @param curriculo O tipo de currículo ('curriculoAntigo' ou 'curriculoNovo').
 * @returns O total de horas AC para o usuário.
 */
export const calcularTotalHorasACByUsuario = (idUsuario: number, curriculo: CurriculoTipo): number => {
    console.log("Id usuário:", idUsuario);
  const atividadesConcluidasDoUsuario = getAtividadesConcluidasByUsuario(idUsuario);
  console.log(JSON.stringify(atividadesConcluidasDoUsuario));
  let totalHorasAC = 0;

  for (const acConcluida of atividadesConcluidasDoUsuario) {
    const atividadeDetalhe = atividadesData.find(atv => atv.id === acConcluida.idAtividade);

    if (atividadeDetalhe) {
      totalHorasAC += calcularHorasAC(atividadeDetalhe, curriculo);
    } else {
      console.warn(`Atividade com ID ${acConcluida.idAtividade} não encontrada em 'atividadesData'. Não foi possível calcular as horas AC.`);
    }
  }

  return totalHorasAC;
};