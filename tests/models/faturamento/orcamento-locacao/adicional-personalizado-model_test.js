import AdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/adicional-personalizado-model';
import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';

describe('adicional-personalizado-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "identificador",
      "codigo",
      "descricao",
      "itens"
    ];

    const adicionalPersonalizadoModel = new AdicionalPersonalizadoModel();
    const adicionalPersonalizadoModelKeys = Object.keys(adicionalPersonalizadoModel);

    Object.keys(adicionalPersonalizadoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(adicionalPersonalizadoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let adicionalPersonalizadoModel = new AdicionalPersonalizadoModel();
    expect(adicionalPersonalizadoModel.identificador).toBeUndefined();
    expect(adicionalPersonalizadoModel.codigo).toBeUndefined();
    expect(adicionalPersonalizadoModel.descricao).toBe("");
    expect(adicionalPersonalizadoModel.itens).toBeInstanceOf(Array);

    adicionalPersonalizadoModel = new AdicionalPersonalizadoModel({
      identificador:"01",
      codigo:"01",
      descricao:"descricao",
      itens: [{}]
    })

    expect(typeof adicionalPersonalizadoModel.identificador).toBe("string");
    expect(typeof adicionalPersonalizadoModel.codigo).toBe("string");
    expect(typeof adicionalPersonalizadoModel.descricao).toBe("string");
    expect(typeof adicionalPersonalizadoModel.itens).toBe("object");
    expect(adicionalPersonalizadoModel.itens.length).toBe(1)
    expect(adicionalPersonalizadoModel.itens[0]).toBeInstanceOf(ItemAdicionalPersonalizadoModel);
  });

  describe('modeloValido', () => {
    it('Deve retornar false', () => {
      let adicionalPersonalizadoModel = new AdicionalPersonalizadoModel;
      expect(adicionalPersonalizadoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true', () => {
      let adicionalPersonalizadoModel = new AdicionalPersonalizadoModel({
        descricao: "descricao",
        itens: [{
          aliquota: 2,
          atualizaDespesas: true,
          atualizaEquipamentos: true,
          atualizaMateriais: true,
          atualizaServicos: true,
          descricao: "descricao",
          identificador: "01",
          revisao: "01"
        }]
      });
      expect(adicionalPersonalizadoModel.modeloValido()).toBeTruthy();
    })
  });
});