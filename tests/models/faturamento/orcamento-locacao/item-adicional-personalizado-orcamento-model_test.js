import ItemAdicionalPersonalizadoOrcamentoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-orcamento-model';

describe('item-adicional-personalizado-orcamento-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "identificadorOrcamento",
      "adicionalPersonalizadoItem",
      "revisao",
      "valorTotalAdicionalPersonalizado"
    ];

    const itemAdicionalPersonalizadoOrcamentoModel = new ItemAdicionalPersonalizadoOrcamentoModel();
    const itemAdicionalPersonalizadoOrcamentoModelKeys = Object.keys(itemAdicionalPersonalizadoOrcamentoModel);

    Object.keys(itemAdicionalPersonalizadoOrcamentoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(itemAdicionalPersonalizadoOrcamentoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let itemAdicionalPersonalizadoOrcamentoModel = new ItemAdicionalPersonalizadoOrcamentoModel();
    expect(itemAdicionalPersonalizadoOrcamentoModel.identificador).toBeUndefined();
    expect(itemAdicionalPersonalizadoOrcamentoModel.identificadorOrcamento).toBeUndefined();
    expect(itemAdicionalPersonalizadoOrcamentoModel.adicionalPersonalizadoItem).toBeUndefined();
    expect(itemAdicionalPersonalizadoOrcamentoModel.revisao).toBeUndefined();
    expect(itemAdicionalPersonalizadoOrcamentoModel.valorTotalAdicionalPersonalizado).toBe(0);

    itemAdicionalPersonalizadoOrcamentoModel = new ItemAdicionalPersonalizadoOrcamentoModel({
      identificador: "01",
      identificadorOrcamento: "01",
      adicionalPersonalizadoItem: {},
      revisao: "01",
      valorTotalAdicionalPersonalizado: 100
    })

    expect(typeof itemAdicionalPersonalizadoOrcamentoModel.identificador).toBe("string")
    expect(typeof itemAdicionalPersonalizadoOrcamentoModel.identificadorOrcamento).toBe("string")
    expect(typeof itemAdicionalPersonalizadoOrcamentoModel.adicionalPersonalizadoItem).toBe("object")
    expect(typeof itemAdicionalPersonalizadoOrcamentoModel.revisao).toBe("string")
    expect(typeof itemAdicionalPersonalizadoOrcamentoModel.valorTotalAdicionalPersonalizado).toBe("number")
  });
});