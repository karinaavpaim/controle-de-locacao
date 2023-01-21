'use strict';

import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';

export default class AdicionalPersonalizadoModel {
  constructor(obj) {
    obj = obj || {};

    this.identificador = obj.identificador;
    this.codigo = obj.codigo;
    this.descricao = obj.descricao || '';
    this.itens = (obj.itens && obj.itens.map((item) => new ItemAdicionalPersonalizadoModel(item))) || [];
  }

  modeloValido() {
    return !!(this.descricao && this.itens.length > 0);
  }

  limpar() {
    let modelo = new AdicionalPersonalizadoModel();

    this.identificador = modelo.identificador;
    this.codigo = modelo.codigo;
    this.descricao = modelo.descricao;
    this.itens = modelo.itens;
  }

  descricaoValida() {
    return (this.descricao !== '');
  }

  adicionarItem(item) {
    this.itens.push(item);
  }

  atualizarItem(indice, item) {
    Object.assign(this.itens[indice], item);
  }

  removerEspacosDeDescricao() {
    this.descricao = this.descricao ? this.descricao.trimStart().trimEnd() : this.descricao;
  }

  converterPontoPorVirgulaDaAliquotaDosItens() {
    this.itens.forEach(item => {
      item.converterPontoPorVirgulaDaAliquota();
    });
  }

  obterTotaisDeAliquotasPorCategoria() {
    return this.itens.reduce((acumulador, itemDoAdicional) => {
      acumulador.valorTotalAliquotaDespesas += (itemDoAdicional.atualizaDespesas) ? parseFloat(itemDoAdicional.aliquota) : 0;
      acumulador.valorTotalAliquotaEquipamentos += (itemDoAdicional.atualizaEquipamentos) ? parseFloat(itemDoAdicional.aliquota) : 0;
      acumulador.valorTotalAliquotaMateriais += (itemDoAdicional.atualizaMateriais) ? parseFloat(itemDoAdicional.aliquota) : 0;
      acumulador.valorTotalAliquotaServicos += (itemDoAdicional.atualizaServicos) ? parseFloat(itemDoAdicional.aliquota) : 0;
      return acumulador;
    }, {
      valorTotalAliquotaDespesas: 0,
      valorTotalAliquotaEquipamentos: 0,
      valorTotalAliquotaMateriais: 0,
      valorTotalAliquotaServicos: 0
    });
  }
}