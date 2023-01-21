import ProdutosMaisLocadosPorCategoriaModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/produtos-mais-locados-por-categoria-model';
import ProdutoMaisLocadoDashboardModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/produto-mais-locado-dashboard-model';

describe('produtos-mais-locados-por-categoria-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "dezEquipamentosMaisLocados",
      "dezMateriaisMaisLocados",
      "dezServicosMaisLocados"
    ];

    const produtosMaisLocadosPorCategoriaModel = new ProdutosMaisLocadosPorCategoriaModel()
    const produtosMaisLocadosPorCategoriaModelKeys = Object.keys(produtosMaisLocadosPorCategoriaModel);

    Object.keys(produtosMaisLocadosPorCategoriaModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(produtosMaisLocadosPorCategoriaModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let produtosMaisLocadosPorCategoriaModel = new ProdutosMaisLocadosPorCategoriaModel();
    expect(produtosMaisLocadosPorCategoriaModel.dezEquipamentosMaisLocados).toBeInstanceOf(Array);
    expect(produtosMaisLocadosPorCategoriaModel.dezMateriaisMaisLocados).toBeInstanceOf(Array);
    expect(produtosMaisLocadosPorCategoriaModel.dezServicosMaisLocados).toBeInstanceOf(Array);

    expect(produtosMaisLocadosPorCategoriaModel.dezEquipamentosMaisLocados.length).toBe(0);
    expect(produtosMaisLocadosPorCategoriaModel.dezMateriaisMaisLocados.length).toBe(0);
    expect(produtosMaisLocadosPorCategoriaModel.dezServicosMaisLocados.length).toBe(0);

    const modelo = {
      dezEquipamentosMaisLocados: [{}],
      dezMateriaisMaisLocados: [{}],
      dezServicosMaisLocados: [{}]
    };
    produtosMaisLocadosPorCategoriaModel = new ProdutosMaisLocadosPorCategoriaModel(modelo);

    expect(produtosMaisLocadosPorCategoriaModel.dezEquipamentosMaisLocados).toBeInstanceOf(Array);
    expect(produtosMaisLocadosPorCategoriaModel.dezMateriaisMaisLocados).toBeInstanceOf(Array);
    expect(produtosMaisLocadosPorCategoriaModel.dezServicosMaisLocados).toBeInstanceOf(Array);

    expect(produtosMaisLocadosPorCategoriaModel.dezEquipamentosMaisLocados[0]).toBeInstanceOf(ProdutoMaisLocadoDashboardModel);
    expect(produtosMaisLocadosPorCategoriaModel.dezMateriaisMaisLocados[0]).toBeInstanceOf(ProdutoMaisLocadoDashboardModel);
    expect(produtosMaisLocadosPorCategoriaModel.dezServicosMaisLocados[0]).toBeInstanceOf(ProdutoMaisLocadoDashboardModel);
  });
});