'use strict';

import PrecoTabelaModel from '@/models/estoque/produto/tabela-precos/preco-tabela-model';

export default class PrecoTabelaProdutoModel {
  constructor(dados) {
    dados = dados || {};
    
    this.preco = new PrecoTabelaModel(dados.preco);
    this.valor = dados.valor;
  }
}