'use strict';

export default class ItemAdicionalPersonalizadoModel {
  constructor(obj) {
    obj = obj || {};

    this.aliquota = obj.aliquota || 0;
    this.atualizaDespesas = !!obj.atualizaDespesas;
    this.atualizaEquipamentos = !!obj.atualizaEquipamentos;
    this.atualizaMateriais = !!obj.atualizaMateriais;
    this.atualizaServicos = !!obj.atualizaServicos;
    this.descricao = obj.descricao || '';
    this.identificador = obj.identificador;
    this.revisao = obj.revisao;
  }

  removerEspacosDeDescricao() {
    this.descricao = this.descricao.trimStart().trimEnd();
  }

  converterPontoPorVirgulaDaAliquota() {
    this.aliquota = this.aliquota.replace(',','.');
  }
}