import ItemAnaliseResultadoModel from "@/models//faturamento/orcamento-locacao/analise-de-resultados/item-analise-resultado-model"
import DespesaModel from "@/models/faturamento/orcamento-locacao/despesa-model";
import ItemOrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model";

describe('item-analise-resultado-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
        "identificador",
        "descricao",
        "orcado",
        "ajustado",
        "realizado",
        "pendente",
        "variacao",
        "diferenca",
        "totalizador",
        "filhos",
        "status",
        "itemLocacao",
        "despesaLocacao"
    ];

    const itemAnaliseResultadoModel = new ItemAnaliseResultadoModel()
    const itemAnaliseResultadoModelKeys = Object.keys(itemAnaliseResultadoModel);

    Object.keys(itemAnaliseResultadoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(itemAnaliseResultadoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let itemAnaliseResultadoModel = new ItemAnaliseResultadoModel();
    
    expect(itemAnaliseResultadoModel.identificador).toBeUndefined();
    expect(itemAnaliseResultadoModel.descricao).toBeUndefined();
    expect(itemAnaliseResultadoModel.orcado).toBe(0);
    expect(itemAnaliseResultadoModel.ajustado).toBe(0);
    expect(itemAnaliseResultadoModel.realizado).toBe(0);
    expect(itemAnaliseResultadoModel.pendente).toBe(0);
    expect(itemAnaliseResultadoModel.variacao).toBe(0);
    expect(itemAnaliseResultadoModel.diferenca).toBe(0);
    expect(itemAnaliseResultadoModel.totalizador).toBe(false);
    expect(itemAnaliseResultadoModel.filhos).toBeInstanceOf(Array);
    expect(itemAnaliseResultadoModel.itemLocacao).toBeUndefined();
    expect(itemAnaliseResultadoModel.despesaLocacao).toBeUndefined();

    itemAnaliseResultadoModel = new ItemAnaliseResultadoModel({
        // @TODO Os itens desse modelo deveriam ter type check (this.orcado = parseInt(obj.orcado) || 0) em todos os casos diferentes de bool ou string
        identificador: "1",
        descricao: "descricao",
        orcado: 3,
        ajustado: 3,
        realizado: 3,
        pendente: 3,
        variacao: 3,
        diferenca: 3,
        totalizador: true,
        filhos: [1,2,3],
        itemLocacao: {},
        despesaLocacao: {},
    })

    expect(typeof itemAnaliseResultadoModel.identificador).toBe("string");
    expect(typeof itemAnaliseResultadoModel.descricao).toBe("string");
    expect(typeof itemAnaliseResultadoModel.orcado).toBe("number");
    expect(typeof itemAnaliseResultadoModel.ajustado).toBe("number");
    expect(typeof itemAnaliseResultadoModel.realizado).toBe("number");
    expect(typeof itemAnaliseResultadoModel.pendente).toBe("number");
    expect(typeof itemAnaliseResultadoModel.variacao).toBe("number");
    expect(typeof itemAnaliseResultadoModel.diferenca).toBe("number");
    expect(typeof itemAnaliseResultadoModel.totalizador).toBe("boolean");
    expect(itemAnaliseResultadoModel.filhos).toBeInstanceOf(Array);
    expect(itemAnaliseResultadoModel.itemLocacao).toBeInstanceOf(ItemOrcamentoLocacaoModel);
    expect(itemAnaliseResultadoModel.despesaLocacao).toBeInstanceOf(DespesaModel);
  });

  describe('metodo', () => {
    it('deve', () => {
      expect(false).toBeFalsy();
    })
  })
});