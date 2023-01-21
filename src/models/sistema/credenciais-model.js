'use strict';

export default class CredenciaisModel {

  constructor(obj) {
    obj = obj || {};

    this.login = obj.login;
    this.senha = obj.senha;
    this.token = obj.token;
  }

  modeloValido() {
    return (this.login && this.senha) || this.token;
  }
}