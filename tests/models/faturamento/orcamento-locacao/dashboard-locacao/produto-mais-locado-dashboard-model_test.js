import ProdutoMaisLocadoDashboardModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/produto-mais-locado-dashboard-model';

describe('produto-mais-locado-dashboard-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "quantidade",
      "codigo",
      "nome",
      "codigoNome"
    ];

    const produtoMaisLocadoDashboardModel = new ProdutoMaisLocadoDashboardModel()
    const produtoMaisLocadoDashboardModelKeys = Object.keys(produtoMaisLocadoDashboardModel);

    Object.keys(produtoMaisLocadoDashboardModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(produtoMaisLocadoDashboardModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let produtoMaisLocadoDashboardModel = new ProdutoMaisLocadoDashboardModel();
    expect(produtoMaisLocadoDashboardModel.quantidade).toBeUndefined();
    expect(produtoMaisLocadoDashboardModel.codigo).toBeUndefined();
    expect(produtoMaisLocadoDashboardModel.nome).toBeUndefined();
    expect(produtoMaisLocadoDashboardModel.codigoNome).toBeUndefined();

    const modelo = {
      quantidade: 5,
      codigo: '123',
      nome: 'produto teste',
      codigoNome: '123 - produto teste'
    };
    produtoMaisLocadoDashboardModel = new ProdutoMaisLocadoDashboardModel(modelo);

    expect(typeof produtoMaisLocadoDashboardModel.quantidade).toBe('number');
    expect(typeof produtoMaisLocadoDashboardModel.codigo).toBe('string');
    expect(typeof produtoMaisLocadoDashboardModel.nome).toBe('string');
    expect(typeof produtoMaisLocadoDashboardModel.codigoNome).toBe('string');
  });
});