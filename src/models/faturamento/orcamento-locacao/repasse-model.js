'use strict';

import PessoaModel from '@/models/geral/pessoa/pessoa-model';

export default class RepasseModel {
  constructor(obj) {
    obj = obj || {};

    this.identificador = obj.identificador;
    this.pessoa = obj.pessoa && new PessoaModel(obj.pessoa);
    this.aliquotaFaturamento = (obj.aliquotaFaturamento && Number(obj.aliquotaFaturamento)) || 0;
    this.aliquotaDuplicata = (obj.aliquotaDuplicata && Number(obj.aliquotaDuplicata)) || 0;
  }

  modeloValido() {
    return this.pessoa.modeloValido();
  }
}