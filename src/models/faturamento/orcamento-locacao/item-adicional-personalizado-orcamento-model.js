'use strict';

import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';

export default class ItemAdicionalPersonalizadoOrcamentoModel {
  constructor(obj) {
    obj = obj || {};
    
    this.identificador = obj.identificador;
    this.identificadorOrcamento = obj.identificadorOrcamento;
    this.adicionalPersonalizadoItem = obj.adicionalPersonalizadoItem && new ItemAdicionalPersonalizadoModel(obj.adicionalPersonalizadoItem);
    this.revisao = obj.revisao;
    this.valorTotalAdicionalPersonalizado = obj.valorTotalAdicionalPersonalizado || 0;
  }
}