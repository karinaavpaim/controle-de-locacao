import SecaoSetorModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-setor-model';

describe('secao-setor-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "setorEstoquePrincipal",
      "setorEstoqueExpedicao"
    ];

    const secaoSetorModel = new SecaoSetorModel();
    const secaoSetorModelKeys = Object.keys(secaoSetorModel);

    Object.keys(secaoSetorModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(secaoSetorModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let secaoSetorModel = new SecaoSetorModel();
    expect(secaoSetorModel.setorEstoquePrincipal).toBeUndefined();
    expect(secaoSetorModel.setorEstoqueExpedicao).toBeUndefined();

    secaoSetorModel = new SecaoSetorModel({
      setorEstoquePrincipal: "Principal",
      setorEstoqueExpedicao: "Expedição",
    })

    expect(typeof secaoSetorModel.setorEstoquePrincipal).toBe("string")
    expect(typeof secaoSetorModel.setorEstoqueExpedicao).toBe("string")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois o modelo está vazio', () => {
      let secaoSetorModel = new SecaoSetorModel();
      expect(secaoSetorModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo está completo', () => {
      let secaoSetorModel = new SecaoSetorModel({
        setorEstoquePrincipal: "Principal",
        setorEstoqueExpedicao: "Expedição",
      })
      expect(secaoSetorModel.modeloValido()).toBeTruthy();
    })
  });

  describe('todosOsSetoresEstaoPreenchidos', () => {
    it('Deve retornar true, pois são setores distindos', () => {
      let secaoSetorModel = new SecaoSetorModel({
        setorEstoquePrincipal: "Principal",
        setorEstoqueExpedicao: "Expedição",
      })
      expect(secaoSetorModel.todosOsSetoresEstaoPreenchidos()).toBeTruthy();
    })

    it('Deve retornar false, pois o setor de expedição não foi preenchido', () => {
      let secaoSetorModel = new SecaoSetorModel({
        setorEstoquePrincipal: "Principal",
        setorEstoqueExpedicao: "",
      })
      expect(secaoSetorModel.todosOsSetoresEstaoPreenchidos()).toBeFalsy();
    })
  });

  describe('estoquePrincipalEstaValido', () => {
    it('Deve retornar true, pois ambos os setores foram informados', () => {
      let secaoSetorModel = new SecaoSetorModel({
        setorEstoquePrincipal: "Principal",
        setorEstoqueExpedicao: "Expedição",
      })
      expect(secaoSetorModel.estoquePrincipalEstaValido()).toBeTruthy();
    })

    it('Deve retornar false, pois o mesmo setor foi informado como Principal e Expedição', () => {
      let secaoSetorModel = new SecaoSetorModel({
        setorEstoquePrincipal: "Principal",
        setorEstoqueExpedicao: "Principal",
      })
      expect(secaoSetorModel.estoquePrincipalEstaValido()).toBeFalsy();
    })
  });

  describe('obterErrosDeValidacao', () => {
    it('Deve retornar a mensagem de erro', () => {
      let resultado = new SecaoSetorModel().obterErrosDeValidacao();
      expect(resultado).toStrictEqual([
        "Todos os setores são obrigatórios.",
        "O setor do estoque principal deverá ser diferente do setor de estoque para expedição."
      ]);
    })

    it('Deve retornar um array vazio', () => {
      let resultado = new SecaoSetorModel({
        setorEstoquePrincipal: "Principal",
        setorEstoqueExpedicao: "Expedição",
      }).obterErrosDeValidacao();
      expect(resultado).toStrictEqual([]);
    })
  });
});