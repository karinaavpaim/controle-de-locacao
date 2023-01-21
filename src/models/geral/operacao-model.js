'use strict';

export default class OperacaoModel {

  constructor(dados) {
    dados = dados || {};
    this.identificador = dados.identificador;
    this.codigo = dados.codigo;
    this.codigoNome = dados.codigoNome;
    this.descricao = dados.descricao;
    this.tipo = dados.tipo; // Saber se é entrada/compra/saida/venda/troca ...
    this.atualizaEstoque = dados.atualizaEstoque;
    this.atualizaFinanceiro = dados.atualizaFinanceiro;
    this.identificadorTipoDocumento = dados.identificadorTipoDocumento;
    this.identificadoresDasEmpresasVinculadasAoTipoDocumento = dados.identificadoresDasEmpresasVinculadasAoTipoDocumento;
  }

  modeloValido() {
    return !!(this.tipo && this.codigo);
  }
}