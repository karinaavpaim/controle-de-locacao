'use strict';

export default class UFModel {
  constructor(obj) {
    obj = obj || {};
    
    this.codigoIBGE = obj.codigoIBGE;
    this.nome = obj.nome;
    this.sigla = obj.sigla;
  }

  modeloValido() {
    return this.nome && this.sigla;
  }
}