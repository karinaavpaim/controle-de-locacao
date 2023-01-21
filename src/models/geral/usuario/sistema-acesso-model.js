'use strict';

export default class SistemaAcesso {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.tipo = obj.tipo;
  }
}