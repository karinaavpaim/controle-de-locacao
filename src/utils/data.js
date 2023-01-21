'use strict';

import moment from 'moment';

function aplicarMascaraEmDataIso(data, valorDataVazia) {
  if (data) {
    return moment(data).format('DD/MM/YYYY');
  }

  return (valorDataVazia) ? valorDataVazia : null;
}

function aplicarMascaraDataHoraEmDataIso(data, valorDataVazia) {
  if (data) {
    return moment(data).format('DD/MM/YYYY HH:mm:ss');
  }

  return (valorDataVazia) ? valorDataVazia : null;
}

function formatarDataEHoraIso(data, horario) {
  return `${moment(data).format('YYYY-MM-DD')}T${horario || '00:00:00'}`;
}

function formatarDataIso(data, valorDataVazia) {
  if (data) {
    return moment(data).format('YYYY-MM-DD');
  }

  return (valorDataVazia) ? valorDataVazia : null;
}

function dataFinalMaiorOuIgualDataInicial(dataInicial, dataFinal) {
  return !dataInicial || (dataInicial == '') ||
    !dataFinal || (dataFinal == '') ||
    (new Date(dataInicial) <= new Date(dataFinal));
}

function obterDatasDoPeriodo(dataInicial, dataFinal) {
  dataInicial = moment(dataInicial);
  dataFinal = moment(dataFinal);

  let totalDias = dataFinal.diff(dataInicial, 'days');
  let datas = [dataInicial.format("YYYY-MM-DD")];

  for (let i = 1; i <= totalDias; i++) {
    datas.push(dataInicial.add(1, 'days').format('YYYY-MM-DD'));
  }

  return datas;
}

function retornarDataInicialAteAtualISODosXDias(x){
  return {
    dataAtual: formatarDataIso(moment(), null),
    // x-1 pois por exemplo, do dia 10 ao 17 seriam 8 dias, pois contamos as horas cheias
    dataInicial: formatarDataIso(moment().subtract(x-1, 'd'), null)
  }
}

export default {
  dataFinalMaiorOuIgualDataInicial,
  aplicarMascaraDataHoraEmDataIso,
  aplicarMascaraEmDataIso,
  formatarDataEHoraIso,
  formatarDataIso,
  obterDatasDoPeriodo,
  retornarDataInicialAteAtualISODosXDias
};