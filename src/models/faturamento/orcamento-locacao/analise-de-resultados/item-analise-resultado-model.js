'use strict';

import DespesaModel from "@/models/faturamento/orcamento-locacao/despesa-model";
import ItemOrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model";

export default class ItemAnaliseResultadoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador; 
    this.descricao = obj.descricao;
    this.orcado = obj.orcado ||0 ;
    this.ajustado =obj.ajustado || 0;
    this.realizado = obj.realizado || 0;
    this.pendente = obj.pendente || 0;
    this.variacao = obj.variacao || 0;
    this.diferenca = obj.diferenca || 0;
    this.totalizador = !!obj.totalizador;
    this.filhos = obj.filhos || [];
    this.status = obj.status;
    this.itemLocacao = obj.itemLocacao && new ItemOrcamentoLocacaoModel(obj.itemLocacao);
    this.despesaLocacao = obj.despesaLocacao && new DespesaModel(obj.despesaLocacao);
  }
}