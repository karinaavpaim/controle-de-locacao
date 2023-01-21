'use strict';

import ProdutosMaisLocadosPorCategoriaModel from "@/models/faturamento/orcamento-locacao/dashboard-locacao/produtos-mais-locados-por-categoria-model";
import LocacaoPorStatusDashboardModel from "@/models/faturamento/orcamento-locacao/dashboard-locacao/locacao-por-status-dashboard-model";

export default class DashboardLocacaoModel {
  constructor(obj) {
    obj = obj || {};
    this.produtosMaisLocadosPorCategoria = new ProdutosMaisLocadosPorCategoriaModel(obj.produtosMaisLocadosPorCategoria);
    this.locacoesPorStatus = (obj.locacoesPorStatus
      && obj.locacoesPorStatus.map(l => new LocacaoPorStatusDashboardModel(l))) || [];
  }
}