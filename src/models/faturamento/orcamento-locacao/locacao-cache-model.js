'use strict';

export default class LocacaoCacheModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.identificadorUsuario = obj.identificadorUsuario;
    this.loginUsuario = obj.loginUsuario;
    this.descricao = obj.descricao;
    this.identificadorEntidade = obj.identificadorEntidade;
    this.nomeEntidade = obj.nomeEntidade;
    this.valor = obj.valor; 
  }

  modeloValido() {
    return !!(this.valor && this.identificadorEntidade && this.nomeEntidade && this.identificadorUsuario);
  }

}