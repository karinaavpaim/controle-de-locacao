import LocacaoPorStatusDashboardModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/locacao-por-status-dashboard-model';

describe('locacao-por-status-dashboard-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "quantidade",
      "status"
    ];

    const locacaoPorStatusDashboardModel = new LocacaoPorStatusDashboardModel()
    const locacaoPorStatusDashboardModelKeys = Object.keys(locacaoPorStatusDashboardModel);

    Object.keys(locacaoPorStatusDashboardModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(locacaoPorStatusDashboardModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let locacaoPorStatusDashboardModel = new LocacaoPorStatusDashboardModel();
    expect(locacaoPorStatusDashboardModel.quantidade).toBe(0);
    expect(locacaoPorStatusDashboardModel.status).toBeUndefined();

    const modelo = {
      quantidade: 10,
      status: 'EM_DIGITACAO'
    };
    locacaoPorStatusDashboardModel = new LocacaoPorStatusDashboardModel(modelo);

    expect(locacaoPorStatusDashboardModel.quantidade).toBe(modelo.quantidade);
    expect(locacaoPorStatusDashboardModel.status).toBe(modelo.status);
  });
});