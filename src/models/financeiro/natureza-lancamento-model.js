'use strict';

export default class NaturezaLancamentoModel {
  constructor(obj) {
    obj = obj || {};
    this.ativo = !!obj.ativo;
    this.classificacao = obj.classificacao;
    this.codigo = obj.codigo;
    this.codigoNome = obj.codigoNome;
    this.identificador = obj.identificador;
    this.identificadorNaturezaLancamentoPai = obj.identificadorNaturezaLancamentoPai;
    this.nome = obj.nome;
    this.tipo = obj.tipo;
  }

  modeloValido() {
    return !!(this.classificacao && this.codigo && this.tipo);
  }
}