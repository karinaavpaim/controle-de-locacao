'use strict';

import FormaPagamentoItemModel from "@/models/financeiro/forma-pagamento-item-model";

export default class FormaPagamentoModel {
  constructor(obj) {
    obj = obj || {};
    
    this.codigo = obj.codigo;
    this.codigoNome = obj.codigoNome;
    this.identificador = obj.identificador;
    this.nome = obj.nome;

    this.itens = (obj.itens && obj.itens.map((item) => new FormaPagamentoItemModel(item))) || []; 
  }
}