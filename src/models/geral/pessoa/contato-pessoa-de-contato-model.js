'use strict';

export default class ContatoPessoaDeContatoModel {
  constructor(obj) {
    obj = obj || {};
    this.descricao = obj.descricao;
    this.tipo = obj.tipo;
  }
}
