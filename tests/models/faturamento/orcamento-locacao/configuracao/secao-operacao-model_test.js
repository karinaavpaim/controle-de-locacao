import SecaoOperacaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-operacao-model';

describe('secao-operacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "operacaoExpedicaoDosEquipamentos",
      "operacaoExpedicaoDosMateriais",
      "operacaoFaturamentoDosEquipamentos",
      "operacaoFaturamentoDosServicos",
      "operacaoFaturamentoDosMateriais"
    ];

    const secaoOperacaoModel = new SecaoOperacaoModel();
    const secaoOperacaoModelKeys = Object.keys(secaoOperacaoModel);

    Object.keys(secaoOperacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(secaoOperacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let secaoOperacaoModel = new SecaoOperacaoModel();
    expect(secaoOperacaoModel.operacaoExpedicaoDosEquipamentos).toBeUndefined();
    expect(secaoOperacaoModel.operacaoExpedicaoDosMateriais).toBeUndefined();
    expect(secaoOperacaoModel.operacaoFaturamentoDosEquipamentos).toBeUndefined();
    expect(secaoOperacaoModel.operacaoFaturamentoDosServicos).toBeUndefined();
    expect(secaoOperacaoModel.operacaoFaturamentoDosMateriais).toBeUndefined();

    secaoOperacaoModel = new SecaoOperacaoModel({
      operacaoExpedicaoDosEquipamentos: "texto",
      operacaoExpedicaoDosMateriais: "texto",
      operacaoFaturamentoDosEquipamentos: "texto",
      operacaoFaturamentoDosServicos: "texto",
      operacaoFaturamentoDosMateriais: "texto"
    })

    expect(typeof secaoOperacaoModel.operacaoExpedicaoDosEquipamentos).toBe("string")
    expect(typeof secaoOperacaoModel.operacaoExpedicaoDosMateriais).toBe("string")
    expect(typeof secaoOperacaoModel.operacaoFaturamentoDosEquipamentos).toBe("string")
    expect(typeof secaoOperacaoModel.operacaoFaturamentoDosServicos).toBe("string")
    expect(typeof secaoOperacaoModel.operacaoFaturamentoDosMateriais).toBe("string")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois o modelo está vazio', () => {
      let secaoOperacaoModel = new SecaoOperacaoModel();
      expect(secaoOperacaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo está completo', () => {
      let secaoOperacaoModel = new SecaoOperacaoModel({
        operacaoExpedicaoDosEquipamentos: "texto",
        operacaoExpedicaoDosMateriais: "texto",
        operacaoFaturamentoDosEquipamentos: "texto",
        operacaoFaturamentoDosServicos: "texto",
        operacaoFaturamentoDosMateriais: "texto"
      })
      expect(secaoOperacaoModel.modeloValido()).toBeTruthy();
    })
  });

  describe('obterErrosDeValidacao', () => {
    it('Deve retornar a mensagem de erro', () => {
      let resultado = new SecaoOperacaoModel().obterErrosDeValidacao();
      expect(resultado).toStrictEqual(["Todas as operações são obrigatórias."]);
    })

    it('Deve retornar um array vazio', () => {
      let resultado = new SecaoOperacaoModel({
        operacaoExpedicaoDosEquipamentos: "texto",
        operacaoExpedicaoDosMateriais: "texto",
        operacaoFaturamentoDosEquipamentos: "texto",
        operacaoFaturamentoDosServicos: "texto",
        operacaoFaturamentoDosMateriais: "texto"
      }).obterErrosDeValidacao();
      expect(resultado).toStrictEqual([]);
    })
  });
});