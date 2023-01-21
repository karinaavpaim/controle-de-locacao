'use strict';

export default class FormaPagamentoItemModel {
  constructor(obj) {
    obj = obj || {};
    
    this.identificadorEmpresa = obj.identificadorEmpresa;
    this.identificador = obj.identificador;
    this.numeroParcelasCliente = obj.numeroParcelasCliente;
    this.numeroParcelasRecebimento = obj.numeroParcelasRecebimento;
    this.numeroDiasRecebimento = obj.numeroDiasRecebimento;
    this.numeroDiasIntervalo = obj.numeroDiasIntervalo;
  }
}