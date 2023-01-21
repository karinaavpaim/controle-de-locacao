'use strict';

export default class ModeloPropostaLocacaoModel {
  constructor(obj) {
    obj = obj || {};
    
    this.identificador = obj.identificador;
    this.nome = obj.nome;
    this.descricao = obj.descricao;
    this.conteudo = obj.conteudo;
    this.tipoModelo = obj.tipoModelo && this.transformarEmPascalCase(obj.tipoModelo);
  }
  modeloValido(){
    return !!(this.identificador && this.nome && this.tipoModelo && this.conteudo && this.descricao);
  }
  modeloValidoParaCadastro(){
    return !!(this.nome && this.tipoModelo && this.conteudo && this.descricao);
  }

  transformarEmPascalCase(valor){
    valor = valor.toLowerCase();
    return valor.charAt(0).toUpperCase() + valor.slice(1);
  }
}