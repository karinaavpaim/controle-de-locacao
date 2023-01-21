'use strict';
import floatUtils from '@/utils/float-util.js';
import NaturezaLancamentoModel from '@/models/financeiro/natureza-lancamento-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

export default class DespesaModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.naturezaLancamento = new NaturezaLancamentoModel(obj.naturezaLancamento);
    this.valorItem = obj.valorItem || 0;
    this.quantidade = obj.quantidade || 1;
    this.valorAdicionalPersonalizado = obj.valorAdicionalPersonalizado || 0;
    this.medirPeloOrcado = obj.medirPeloOrcado || false;
    this.incluidoNaGestao = obj.incluidoNaGestao || false;
    this.movimentado = obj.movimentado || false;
    this.identificadorEntidadeOrigem = obj.identificadorEntidadeOrigem;
    this.status = obj.status || STATUS_ITEM.ABERTO.nome;
  }

  modeloValido() {
    return !!(this.naturezaLancamento.modeloValido() && this.quantidade > 0 && this.valorItem >= 0);
  }

  calcularValorTotalComoDespesa() {
    return (this.quantidade * (this.valorItem + this.valorAdicionalPersonalizado));
    // TODO: Porquê o cálculo aqui está diferente dos itens? Deveria calcular por fora (abaixo), não por dentro (acima).
    // let valorItemTotal = (this.quantidade * this.valorItem);
    // let valorAdicionalTotal = (this.quantidade * this.valorAdicionalPersonalizado);
    // return floatUtils.duasCasasDecimais(valorItemTotal + valorAdicionalTotal);
  }

  calcularValorTotalUnitario(){
    return this.calcularValorTotal() / this.quantidade;
  }
  
  calcularValorTotal() {
    return this.calcularValorTotalComoDespesa();
  }

  _calcularAdicionalDespesa(aliquota) {
    return floatUtils.duasCasasDecimais((this.valorItem / (1 - (aliquota / 100))) - this.valorItem);
  }

  calcularValorAdicionalPersonalizado(aliquotas) {
    this.valorAdicionalPersonalizado = !aliquotas
      ? 0
      : this._calcularAdicionalDespesa(aliquotas.valorTotalAliquotaDespesas);
  }
}