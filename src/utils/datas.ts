import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Carrega o plugin para que o dayjs possa entender formatos customizados como "DD/MM/YYYY HH:mm"
dayjs.extend(customParseFormat);

// Formato de entrada para as suas strings de data/hora
const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

// Função auxiliar para parsear data no formato DD/MM/YYYY HH:MM usando Day.js
export const parseDateString = (dateString: string): Date => {
  return dayjs(dateString, DATETIME_FORMAT).toDate();
};