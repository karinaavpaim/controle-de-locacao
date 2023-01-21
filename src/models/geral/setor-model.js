'use strict';

export default class SetorModel {

  constructor(dados) {
    dados = dados || {};
    this.identificador = dados.identificador;
    this.descricao = dados.descricao;
    this.codigoNome = dados.codigoNome;
    this.codigo = dados.codigo;
    this.codigoEmpresa = dados.codigoEmpresa;
    this.controlaEstoque = dados.controlaEstoque;
    this.controlaLote = dados.controlaLote;
    this.observacao = dados.observacao;
    this.identificadorCentroDeCusto = dados.identificadorCentroDeCusto;
    this.identificadorEmpresa = dados.identificadorEmpresa;
    this.permiteSolicitarQuantidadeNegativa = dados.permiteSolicitarQuantidadeNegativa;
  }

  modeloValido() {
    return !!(this.codigo);
  }
}