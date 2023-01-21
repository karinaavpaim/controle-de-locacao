import DashboardLocacaoModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/dashboard-locacao-model';
import ProdutosMaisLocadosPorCategoriaModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/produtos-mais-locados-por-categoria-model';
import LocacaoPorStatusDashboardModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/locacao-por-status-dashboard-model';

describe('dashboard-locacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "produtosMaisLocadosPorCategoria",
      "locacoesPorStatus"
    ];

    const dashboardLocacaoModel = new DashboardLocacaoModel()
    const dashboardLocacaoModelKeys = Object.keys(dashboardLocacaoModel);

    Object.keys(dashboardLocacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(dashboardLocacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let dashboardLocacaoModel = new DashboardLocacaoModel();
    expect(dashboardLocacaoModel.produtosMaisLocadosPorCategoria).toBeInstanceOf(ProdutosMaisLocadosPorCategoriaModel);
    expect(dashboardLocacaoModel.locacoesPorStatus).toBeInstanceOf(Array);
    expect(dashboardLocacaoModel.locacoesPorStatus.length).toBe(0);

    const modelo = {
      produtosMaisLocadosPorCategoria: {},
      locacoesPorStatus: [{}]
    };
    dashboardLocacaoModel = new DashboardLocacaoModel(modelo);

    expect(dashboardLocacaoModel.produtosMaisLocadosPorCategoria).toBeInstanceOf(ProdutosMaisLocadosPorCategoriaModel);
    expect(dashboardLocacaoModel.locacoesPorStatus).toBeInstanceOf(Array);
    expect(dashboardLocacaoModel.locacoesPorStatus[0]).toBeInstanceOf(LocacaoPorStatusDashboardModel);
  });
});