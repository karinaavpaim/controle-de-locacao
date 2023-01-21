'use strict';

export default class PrecoTabelaModel {
  constructor(dados) {
    dados = dados || {};

    this.identificador = dados.identificador;
    this.nome = dados.nome;
    this.codigo = dados.codigo;
    this.codigoNome = dados.codigoNome;
  }
}