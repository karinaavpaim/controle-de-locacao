import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';

describe('item-adicional-personalizado-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "aliquota",
      "atualizaDespesas",
      "atualizaEquipamentos",
      "atualizaMateriais",
      "atualizaServicos",
      "descricao",
      "identificador",
      "revisao"
    ];

    const itemAdicionalPersonalizadoModel = new ItemAdicionalPersonalizadoModel();
    const itemAdicionalPersonalizadoModelKeys = Object.keys(itemAdicionalPersonalizadoModel);

    Object.keys(itemAdicionalPersonalizadoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(itemAdicionalPersonalizadoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let itemAdicionalPersonalizadoModel = new ItemAdicionalPersonalizadoModel();
    expect(itemAdicionalPersonalizadoModel.aliquota).toBe(0);
    expect(itemAdicionalPersonalizadoModel.atualizaDespesas).toBeFalsy();
    expect(itemAdicionalPersonalizadoModel.atualizaEquipamentos).toBeFalsy();
    expect(itemAdicionalPersonalizadoModel.atualizaMateriais).toBeFalsy();
    expect(itemAdicionalPersonalizadoModel.atualizaServicos).toBeFalsy();
    expect(itemAdicionalPersonalizadoModel.descricao).toBe('');
    expect(itemAdicionalPersonalizadoModel.identificador).toBeUndefined();
    expect(itemAdicionalPersonalizadoModel.revisao).toBeUndefined();

    itemAdicionalPersonalizadoModel = new ItemAdicionalPersonalizadoModel({
      aliquota: 10,
      atualizaDespesas: true,
      atualizaEquipamentos: true,
      atualizaMateriais: true,
      atualizaServicos: true,
      descricao: "texto",
      identificador: "01",
      revisao: "01"
    })

    expect(typeof itemAdicionalPersonalizadoModel.aliquota).toBe("number")
    expect(typeof itemAdicionalPersonalizadoModel.atualizaDespesas).toBe("boolean")
    expect(typeof itemAdicionalPersonalizadoModel.atualizaEquipamentos).toBe("boolean")
    expect(typeof itemAdicionalPersonalizadoModel.atualizaMateriais).toBe("boolean")
    expect(typeof itemAdicionalPersonalizadoModel.atualizaServicos).toBe("boolean")
    expect(typeof itemAdicionalPersonalizadoModel.descricao).toBe("string")
    expect(typeof itemAdicionalPersonalizadoModel.identificador).toBe("string")
    expect(typeof itemAdicionalPersonalizadoModel.revisao).toBe("string")
  });
});