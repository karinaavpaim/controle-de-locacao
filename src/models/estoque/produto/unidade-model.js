'use strict';

export default class UnidadeModel {
  constructor(obj) {
    obj = obj || {};

    this.identificador = obj.identificador;
    this.descricao = obj.descricao;
    this.sigla = obj.sigla;
  }
}