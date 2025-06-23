// src/utils/acUtils.ts
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// Importe os dados. Certifique-se de que os caminhos estão corretos!
import { atividadesData } from "../data/atividadesData";
import { atividadesConcluidasData } from "../data/atividadesConcluidasData";
import type { AtividadeConcluida } from "../interfaces/AtivdadeConcluida";

dayjs.extend(duration);

export type CurriculoTipo = "31.02.002" | "31.02.003";

/**
 * Retorna todas as atividades concluídas por um usuário específico.
 * @param idUsuario O ID do usuário.
 * @returns Um array de objetos AtividadeConcluida.
 */
export const getAtividadesConcluidasByUsuario = (
  idUsuario: number
): AtividadeConcluida[] => {
  return atividadesConcluidasData.filter((ac) => ac.idUsuario === idUsuario);
};

/**
 * Calcula o total de horas de Atividades Complementares para um usuário específico,
 * com base nas atividades que ele concluiu e no tipo de currículo.
 * @param idUsuario O ID do usuário.
 * @returns O total de horas AC para o usuário.
 */

// Como a contribuição de horas é a mesma entre currículos é a mesma
export const calcularTotalHorasACByUsuario = (
  idUsuario: number
): number => {
  const atividadesConcluidasDoUsuario =
    getAtividadesConcluidasByUsuario(idUsuario);
  let totalHorasAC = 0;

  for (const acConcluida of atividadesConcluidasDoUsuario) {
    const atividadeDetalhe = atividadesData.find(
      (atv) => atv.id === acConcluida.idAtividade
    );

    if (atividadeDetalhe) {
      const coeficiente = atividadeDetalhe.categoria ? 
                            atividadeDetalhe.categoria.coeficienteNovo
                            : 1;

      totalHorasAC += atividadeDetalhe.duracao * coeficiente;
    } else {
      console.warn(
        `Atividade com ID ${acConcluida.idAtividade} não encontrada em 'atividadesData'. Não foi possível calcular as horas AC.`
      );
    }
  }

  return totalHorasAC;
};
