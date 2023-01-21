'use strict';

import EmpresaProdutoModel from '@/models/estoque/produto/empresa-produto-model';
import UnidadeModel from '@/models/estoque/produto/unidade-model';

export default class ProdutoModel {
  constructor(obj) {
    obj = obj || {};

    this.ativoVenda = !!obj.ativoVenda;
    this.identificador = obj.identificador;
    this.nome = obj.nome;
    this.codigo = obj.codigo;
    this.bloqueiaCriacaoAtendimento = obj.bloqueiaCriacaoAtendimento;
    this.produtoComposto = obj.produtoComposto;
    this.controleLoteSerie = obj.controleLoteSerie;
    this.codigoNome = obj.codigoNome;
    this.unidade = obj.unidade && new UnidadeModel(obj.unidade);
    this.empresasProduto = obj.empresasProduto && obj.empresasProduto.map(e => new EmpresaProdutoModel(e)); 
    this.descricaoAplicacao = obj.descricaoAplicacao;
  }
}