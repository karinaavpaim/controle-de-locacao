'use strict';

import EmpresaModel from '@/models/geral/empresa-model';
import PrecoTabelaProdutoModel from '@/models/estoque/produto/tabela-precos/preco-tabela-produto';

export default class EmpresaProdutoModel {
  constructor(obj) {
    obj = obj || {};

    this.empresa = new EmpresaModel(obj.empresa);
    this.precos = (obj.precos && obj.precos.map(p => new PrecoTabelaProdutoModel(p))) || [];
  }
}