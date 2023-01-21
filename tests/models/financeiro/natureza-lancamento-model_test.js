import NaturezaLancamentoModel from '@/models/financeiro/natureza-lancamento-model';

describe('natureza-lancamento-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "ativo",
      "classificacao",
      "codigo",
      "codigoNome",
      "identificador",
      "identificadorNaturezaLancamentoPai",
      "nome",
      "tipo"
    ];

    const naturezaLancamentoModel = new NaturezaLancamentoModel()
    const naturezaLancamentoModelKeys = Object.keys(naturezaLancamentoModel);

    Object.keys(naturezaLancamentoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(naturezaLancamentoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let naturezaLancamentoModel = new NaturezaLancamentoModel();
    expect(naturezaLancamentoModel.ativo).toBeFalsy();
    expect(naturezaLancamentoModel.classificacao).toBeUndefined();
    expect(naturezaLancamentoModel.codigo).toBeUndefined();
    expect(naturezaLancamentoModel.codigoNome).toBeUndefined();
    expect(naturezaLancamentoModel.identificador).toBeUndefined();
    expect(naturezaLancamentoModel.identificadorNaturezaLancamentoPai).toBeUndefined();
    expect(naturezaLancamentoModel.nome).toBeUndefined();
    expect(naturezaLancamentoModel.tipo).toBeUndefined();

    naturezaLancamentoModel = new NaturezaLancamentoModel({
      ativo: true,
      classificacao: "01",
      codigo: "01",
      codigoNome: "01 - texto",
      identificador: "01",
      identificadorNaturezaLancamentoPai: "01",
      nome: "texto",
      tipo: "texto",
    });

    expect(typeof naturezaLancamentoModel.ativo).toBe("boolean");
    expect(typeof naturezaLancamentoModel.classificacao).toBe("string");
    expect(typeof naturezaLancamentoModel.codigo).toBe("string");
    expect(typeof naturezaLancamentoModel.codigoNome).toBe("string");
    expect(typeof naturezaLancamentoModel.identificador).toBe("string");
    expect(typeof naturezaLancamentoModel.identificadorNaturezaLancamentoPai).toBe("string");
    expect(typeof naturezaLancamentoModel.nome).toBe("string");
    expect(typeof naturezaLancamentoModel.tipo).toBe("string");
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois algum dos campos não está preenchido corretamente', () => {
      let naturezaLancamentoModel = new NaturezaLancamentoModel();
      expect(naturezaLancamentoModel.modeloValido()).toBeFalsy();

      naturezaLancamentoModel = new NaturezaLancamentoModel({
        classificacao: "01",
        codigo: "01",
        tipo: ""
      });
      expect(naturezaLancamentoModel.modeloValido()).toBeFalsy();

      naturezaLancamentoModel.classificacao = null;
      naturezaLancamentoModel.tipo = "texto";
      expect(naturezaLancamentoModel.modeloValido()).toBeFalsy();

      naturezaLancamentoModel.classificacao = "01",
      naturezaLancamentoModel.codigo = undefined;
      expect(naturezaLancamentoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modeloValido está completo', () => {
      let naturezaLancamentoModel = new NaturezaLancamentoModel({
        classificacao: "01",
        codigo: "01",
        tipo: "texto"
      })
      expect(naturezaLancamentoModel.modeloValido()).toBeTruthy();
    })
  });
});