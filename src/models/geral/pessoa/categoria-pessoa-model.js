'use strict';

export default class CategoriaPessoaModel {

  constructor(obj) {
    obj = obj || {};

    this.identificador = obj.identificador;
    this.nome = obj.nome;
  }

  modeloValido() {
    return !!this.identificador && !!this.nome;
  }
}