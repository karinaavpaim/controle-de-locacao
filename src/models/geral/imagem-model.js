'use strict';

export default class ImagemModel {
  constructor(dados) {
    dados = dados || {};
    this.conteudo = dados.conteudo;
    this.conteudoMiniatura = dados.conteudoMiniatura;
    this.descricao = dados.descricao;
    this.tipo = dados.tipo;
  }
}