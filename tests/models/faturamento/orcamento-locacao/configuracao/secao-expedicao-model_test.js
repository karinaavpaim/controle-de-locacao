import SecaoExpedicaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-expedicao-model';

describe('secao-expedicao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "gerarPedidoLiberadoNaExpedicao",
      "tabelaPrecoExpedicao"
    ];

    const secaoExpedicaoModel = new SecaoExpedicaoModel();
    const secaoExpedicaoModelKeys = Object.keys(secaoExpedicaoModel);

    Object.keys(secaoExpedicaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(secaoExpedicaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let secaoExpedicaoModel = new SecaoExpedicaoModel();
    expect(secaoExpedicaoModel.gerarPedidoLiberadoNaExpedicao).toBeFalsy();
    expect(secaoExpedicaoModel.tabelaPrecoExpedicao).toBeUndefined();

    secaoExpedicaoModel = new SecaoExpedicaoModel({
      gerarPedidoLiberadoNaExpedicao: true,
      tabelaPrecoExpedicao: "texto"
    })

    expect(typeof secaoExpedicaoModel.gerarPedidoLiberadoNaExpedicao).toBe("boolean")
    expect(typeof secaoExpedicaoModel.tabelaPrecoExpedicao).toBe("string")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois o modelo está vazio', () => {
      let secaoExpedicaoModel = new SecaoExpedicaoModel();
      expect(secaoExpedicaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo está completo', () => {
      let secaoExpedicaoModel = new SecaoExpedicaoModel({
        tabelaPrecoExpedicao: "texto"
      })
      expect(secaoExpedicaoModel.modeloValido()).toBeTruthy();
    })
  });

  describe('obterErrosDeValidacao', () => {
    it('Deve retornar a mensagem de erro', () => {
      let resultado = new SecaoExpedicaoModel().obterErrosDeValidacao();
      expect(resultado).toStrictEqual(["A tabela de preço para expedição deve ser informada."]);
    })

    it('Deve retornar um array vazio', () => {
      let resultado = new SecaoExpedicaoModel({tabelaPrecoExpedicao: "texto"}).obterErrosDeValidacao();
      expect(resultado).toStrictEqual([]);
    })
  });
});