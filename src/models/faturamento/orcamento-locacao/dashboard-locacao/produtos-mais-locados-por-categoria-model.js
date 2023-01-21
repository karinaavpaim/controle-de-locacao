'use strict';

import ProdutoMaisLocadoDashboardModel from "@/models/faturamento/orcamento-locacao/dashboard-locacao/produto-mais-locado-dashboard-model";

export default class ProdutosMaisLocadosPorCategoriaModel {
  constructor(obj) {
    obj = obj || {};
    this.dezEquipamentosMaisLocados = (obj.dezEquipamentosMaisLocados
      && obj.dezEquipamentosMaisLocados.map(p => new ProdutoMaisLocadoDashboardModel(p))) || [];
    this.dezMateriaisMaisLocados = (obj.dezMateriaisMaisLocados
      && obj.dezMateriaisMaisLocados.map(p => new ProdutoMaisLocadoDashboardModel(p))) || [];
    this.dezServicosMaisLocados = (obj.dezServicosMaisLocados
      && obj.dezServicosMaisLocados.map(p => new ProdutoMaisLocadoDashboardModel(p))) || [];
  }
}