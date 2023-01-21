'use strict';

export default class Bairro {
  constructor(obj){
    obj = obj || {};
    
    this.codigo = obj.codigo;
    this.identificador = obj.identificador;
    this.nome = obj.nome;
  }

  modeloValido() {
    return this.nome && this.identificador;
  }
}