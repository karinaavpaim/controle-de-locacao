'use strict';

export default class VariaveisFilhasModel {
  constructor(obj) {
    obj = obj || {};
    
    this.identificador = obj.identificador;
    this.nome = obj.nome;
    this.inline = obj.inline;
    this.conteudo = obj.conteudo;
    this.tipo = obj.tipo;
  }
}