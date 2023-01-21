import EmpresaModel from '@/models/geral/empresa-model';
import EnderecoModel from '@/models/geral/endereco/endereco-model';

describe('empresa-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "identificador",
      "nome",
      "codigo",
      "codigoNome",
      "CNPJ",
      "nomeCurto",
      "telefone",
      "endereco"
    ];

    const empresaModel = new EmpresaModel();
    const empresaModelKeys = Object.keys(empresaModel);

    Object.keys(empresaModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(empresaModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let empresaModel = new EmpresaModel();
    expect(empresaModel.identificador).toBeUndefined();
    expect(empresaModel.nome).toBe("");
    expect(empresaModel.codigo).toBeUndefined();
    expect(empresaModel.codigoNome).toBeUndefined();
    expect(empresaModel.CNPJ).toBeUndefined();
    expect(empresaModel.nomeCurto).toBeUndefined();
    expect(empresaModel.telefone).toBeUndefined();
    expect(empresaModel.endereco).toBeUndefined();

    empresaModel = new EmpresaModel({
      identificador:"01",
      nome:"texto",
      codigo:"01",
      codigoNome:"01 - texto",
      CNPJ:"000000000",
      nomeCurto:"texto",
      telefone:"12312354353",
      endereco:{ativo:true}
    })

    expect(typeof empresaModel.identificador).toBe("string");
    expect(typeof empresaModel.nome).toBe("string");
    expect(typeof empresaModel.codigo).toBe("string");
    expect(typeof empresaModel.codigoNome).toBe("string");
    expect(typeof empresaModel.CNPJ).toBe("string");
    expect(typeof empresaModel.nomeCurto).toBe("string");
    expect(typeof empresaModel.telefone).toBe("string");
    expect(empresaModel.endereco).toBeInstanceOf(EnderecoModel)
  });

  describe('modeloValido', () => {
    it('deve retornar false (empresa não possui nome)', () => {
      let empresaModel = new EmpresaModel;
      expect(empresaModel.modeloValido()).toBeFalsy();
    })

    it('deve retornar true (empresa possui nome)', () => {
      let empresaModel = new EmpresaModel({nome:"texto"});
      expect(empresaModel.modeloValido()).toBeTruthy();
    })
  })

  describe('retornarInstanciaValidadaOuNulo', () => {
    it('deve retornar nulo caso a instancia seja invalida', () => {
      let empresaModel = new EmpresaModel;
      expect(empresaModel.retornarInstanciaValidadaOuNulo()).toBeNull();
    })

    it('deve retornar a instancia valida', () => {
      let empresaModel = new EmpresaModel({nome:"texto"});
      expect(empresaModel.retornarInstanciaValidadaOuNulo()).toBeInstanceOf(EmpresaModel);
    })
  })
});