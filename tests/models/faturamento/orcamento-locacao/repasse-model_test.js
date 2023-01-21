import RepasseModel from '@/models/faturamento/orcamento-locacao/repasse-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';

describe('repasse-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "identificador",
      "pessoa",
      "aliquotaFaturamento",
      "aliquotaDuplicata"
    ];

    const repasseModel = new RepasseModel();
    const repasseModelKeys = Object.keys(repasseModel);

    Object.keys(repasseModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(repasseModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let repasseModel = new RepasseModel();
    expect(repasseModel.identificador).toBeUndefined();
    expect(repasseModel.pessoa).toBeUndefined();
    expect(repasseModel.aliquotaFaturamento).toBe(0);
    expect(repasseModel.aliquotaDuplicata).toBe(0);

    repasseModel = new RepasseModel({
      identificador:"01",
      pessoa:"pessoa",
      aliquotaFaturamento:2,
      aliquotaDuplicata:5
    })

    expect(typeof repasseModel.identificador).toBe("string");
    expect(typeof repasseModel.pessoa).toBe("object");
    expect(typeof repasseModel.aliquotaFaturamento).toBe("number");
    expect(typeof repasseModel.aliquotaDuplicata).toBe("number");
  });

  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem pessoa', () => {
      let repasseModel = new RepasseModel({
        pessoa: {
          nome: "nome"
        }
      })
      expect(repasseModel.modeloValido()).toBeTruthy();
    })
  });

  describe('modeloValido', () => {
    it('Deve retornar false', () => {
      let pessoaModel = new PessoaModel;
      expect(pessoaModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true', () => {
      let pessoaModel = new PessoaModel({nome:"texto"});
      expect(pessoaModel.modeloValido()).toBeTruthy();
    })
  });
});