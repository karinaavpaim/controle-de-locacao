'use strict';

import UFModel from '@/models/geral/endereco/uf-model';

export default class Cidade {
  constructor(obj) {
    obj = obj || {};

    this.codigo = obj.codigo;
    this.codigoDDD = obj.codigoDDD;
    this.codigoIBGE = obj.codigoIBGE;
    this.identificador = obj.identificador;
    this.nome = obj.nome;
    this.UF = new UFModel(obj.UF);
  }

  modeloValido() {
    return this.identificador && this.nome;
  }
}