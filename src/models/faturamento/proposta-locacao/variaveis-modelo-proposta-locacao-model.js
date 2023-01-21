'use strict';

import VariaveisFilhasModel from '@/models/faturamento/proposta-locacao/variaveis-filhas-model';

export default class VariaveisModeloPropostaLocacaoModel {

  constructor(obj) {
    obj = obj || {};

    this.identificadorPai = obj.identificadorPai;
    this.nomePai = obj.nomePai;
    this.filhas = (obj.filhas && obj.filhas.map(v => new VariaveisFilhasModel(v))) || [];
  }
}