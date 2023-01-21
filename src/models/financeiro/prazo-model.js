'use strict';

import FormaPagamentoModel from "@/models/financeiro/forma-pagamento-model";

export default class PrazoModel {
  constructor(obj) {
    obj = obj || {};

    this.ativo = obj.ativo;
    this.codigoClassificacao = obj.codigoClassificacao;
    this.codigo = obj.codigo;
    this.codigoNome = obj.codigoNome;
    this.identificador = obj.identificador;
    this.identificadoresEmpresa = obj.identificadoresEmpresa;
    this.nome = obj.nome;
    this.tipo = obj.tipo;
    this.tipoClassificacao = obj.tipoClassificacao;

    this.formasPagamentosEntrada = (obj.formasPagamentosEntrada && obj.formasPagamentosEntrada.map(
      (formaPagamentoEntrada) => new FormaPagamentoModel(formaPagamentoEntrada)
    )) || [];
    this.formasPagamentosParcelas = (obj.formasPagamentosParcelas && obj.formasPagamentosParcelas.map(
      (formaPagamentoParcela) => new FormaPagamentoModel(formaPagamentoParcela)
    )) || [];
  }
}