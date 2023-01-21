import QuantidadeEstoqueDisponivelModel from '@/models/estoque/produto/quantidade-estoque-disponivel-model';

describe('quantidade-estoque-disponivel-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificadorProduto",
      "quantidadeDisponivel"
    ];

    const quantidadeEstoqueDisponivelModel = new QuantidadeEstoqueDisponivelModel()
    const quantidadeEstoqueDisponivelModelKeys = Object.keys(quantidadeEstoqueDisponivelModel);

    Object.keys(quantidadeEstoqueDisponivelModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(quantidadeEstoqueDisponivelModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let quantidadeEstoqueDisponivelModel = new QuantidadeEstoqueDisponivelModel();
    expect(quantidadeEstoqueDisponivelModel.identificadorProduto).toBeUndefined();
    expect(quantidadeEstoqueDisponivelModel.quantidadeDisponivel).toBeUndefined();

    const modelo = {
      identificadorProduto: 1,
      quantidadeDisponivel: 10
    };
    quantidadeEstoqueDisponivelModel = new QuantidadeEstoqueDisponivelModel(modelo);

    expect(quantidadeEstoqueDisponivelModel.identificadorProduto).toBe(modelo.identificadorProduto);
    expect(quantidadeEstoqueDisponivelModel.quantidadeDisponivel).toBe(modelo.quantidadeDisponivel);
  });
});