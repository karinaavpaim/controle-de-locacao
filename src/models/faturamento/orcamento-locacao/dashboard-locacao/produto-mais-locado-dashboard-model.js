'use strict';

export default class ProdutoMaisLocadoDashboardModel {
  constructor(obj) {
    obj = obj || {};
    this.quantidade = obj.quantidade;
    this.codigo = obj.codigo;
    this.nome = obj.nome;
    this.codigoNome = obj.codigoNome;
  }
}