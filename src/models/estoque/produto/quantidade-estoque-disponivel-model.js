'use strict';

export default class QuantidadeEstoqueDisponivelProdutoModel {

  constructor(obj) {
    obj = obj || {};
    this.identificadorProduto = obj.identificadorProduto;
    this.quantidadeDisponivel = obj.quantidadeDisponivel;
  }

}