import ItemMedicaoLocacaoModel from '@/models/estoque/medicao/item-medicao-locacao-model';
import ProdutoModel from '@/models/estoque/produto/produto-model';

describe('item-medicao-locacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificadorEntidadeOrigem",
      "identificadorItemLocacao",
      "medirPeloOrcado",
      "incluidoNaGestao",
      "categoria",
      "dataInicialLocacao",
      "dataFinalLocacao",
      "quantidadeExpedida",
      "valorUnitario",
      "valorTotal",
      "quantidadeDiarias",
      "quantidadePedida",
      "produto",
      "desmembramentos",
      "descricao",
      "status"
    ];

    const itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel();
    const itemMedicaoLocacaoModelKeys = Object.keys(itemMedicaoLocacaoModel);

    Object.keys(itemMedicaoLocacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(itemMedicaoLocacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel();
    expect(itemMedicaoLocacaoModel.identificadorItemLocacao).toBeUndefined();
    expect(itemMedicaoLocacaoModel.categoria).toBeUndefined();
    expect(itemMedicaoLocacaoModel.dataInicialLocacao).toBeUndefined();
    expect(itemMedicaoLocacaoModel.dataFinalLocacao).toBeUndefined();
    expect(itemMedicaoLocacaoModel.quantidadeExpedida).toBe(0);
    expect(itemMedicaoLocacaoModel.valorUnitario).toBe(0);
    expect(itemMedicaoLocacaoModel.valorTotal).toBe(0);
    expect(itemMedicaoLocacaoModel.quantidadeDiarias).toBe(0);
    expect(itemMedicaoLocacaoModel.quantidadePedida).toBe(0);
    expect(itemMedicaoLocacaoModel.produto).toBeUndefined();
    expect(itemMedicaoLocacaoModel.desmembramentos).toBeInstanceOf(Array);

    itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel({
      identificadorItemLocacao: "01",
      categoria: "EQUIPAMENTO",
      dataInicialLocacao: "2012-01-07",
      dataFinalLocacao: "2012-01-14",
      quantidadeExpedida: 1,
      valorUnitario: 12.5,
      valorTotal: 13.57,
      quantidadeDiarias: 6,
      quantidadePedida: 6,
      produto: {codigo: 12},
      desmembramentos: [{identificadorDocumentoItem:2}]
    })

    expect(typeof itemMedicaoLocacaoModel.identificadorItemLocacao).toBe("string");
    expect(typeof itemMedicaoLocacaoModel.categoria).toBe("string");
    expect(typeof itemMedicaoLocacaoModel.dataInicialLocacao).toBe("string");
    expect(typeof itemMedicaoLocacaoModel.dataFinalLocacao).toBe("string");
    expect(typeof itemMedicaoLocacaoModel.quantidadeExpedida).toBe("number");
    expect(typeof itemMedicaoLocacaoModel.valorUnitario).toBe("number");
    expect(typeof itemMedicaoLocacaoModel.valorTotal).toBe("number");
    expect(typeof itemMedicaoLocacaoModel.quantidadeDiarias).toBe("number");
    expect(typeof itemMedicaoLocacaoModel.quantidadePedida).toBe("number");
    expect(itemMedicaoLocacaoModel.produto).toBeInstanceOf(ProdutoModel)
    expect(itemMedicaoLocacaoModel.desmembramentos).toBeInstanceOf(Array);

  });

  describe('retornarPorcentagemProgressao', () => {
    it('deve retornar (pelo algoritmo de cela) a porcentagem da medicao do desmembramenbto de acordo com as diarias medidas', () => {
      let itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel({
        quantidadeDiarias: 6,
        quantidadePedida: 1,
        desmembramentos: [
          {
            identificadorDocumentoItem: 2,
            datasMedidas: [1,2,3,4,5],
            quantidadeMedida: 1,
            quantidadeMaxima: 1
          },
          {
            identificadorDocumentoItem: 5,
            datasAMedir: [1, 2, 3, 4, 5],
            quantidadeAMedir: 3,
            _hierarquia: [0]
          }
        ]
      });
      expect(itemMedicaoLocacaoModel.retornarPorcentagemProgressaoDoItem()).toBe(83);
    });
  });

  describe('valorTotalParaMedicao', () => {
    it('deve retornar o valor total da medição do desmembramento, baseado na quantidade e datas a medir, e o valor unitario', () => {
      let itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel({
        valorUnitario: 12.5,
        desmembramentos: [
          {
            identificadorDocumentoItem: 2,
            datasAMedir: [1,2,3,4,5],
            quantidadeAMedir: 3
          },
          {
            identificadorDocumentoItem: 5,
            datasAMedir: [1,2,3,4,5],
            quantidadeAMedir: 3,
            _hierarquia: [0]
          }
        ]
      });
      expect(itemMedicaoLocacaoModel.valorTotalParaMedicao(itemMedicaoLocacaoModel.desmembramentos[0])).toBe(187.5)
    });

    it('deve retornar o valor total da medição do desmembramento, baseado na quantidade e datas a medir, e o valor unitario, mesmo sem ter quantidade ou datas a medir', () => {
      let itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel({
        valorUnitario: 12.5,
        desmembramentos: [{identificadorDocumentoItem:2}]
      });
      itemMedicaoLocacaoModel.desmembramentos[0].datasAMedir = itemMedicaoLocacaoModel.desmembramentos[0].quantidadeAMedir = undefined;
      expect(itemMedicaoLocacaoModel.valorTotalParaMedicao(itemMedicaoLocacaoModel.desmembramentos[0])).toBe(0)
    });
  });

  describe('atualizarIdentificadorDosDesmembramentosPreenchidos', () => {
    //@TODO desenvolver
    
    // it('deve preencher o identificador dos desmembramentos de acordo com o preenchimento e _hierarquia dos desmembramentos', () => {
    //   let itemMedicaoLocacaoModel = new ItemMedicaoLocacaoModel({
    //     valorUnitario: 12.5,
    //     desmembramentos: [{identificadorDocumentoItem:2, datasAMedir: [1,2,3,4,5], quantidadeAMedir: 3}]
    //   });
    //   expect(itemMedicaoLocacaoModel.valorTotalParaMedicao(itemMedicaoLocacaoModel.desmembramentos[0])).toBe(187.5)
    // });
  });

});