import SetorModel from '@/models/geral/setor-model';

describe('setor-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "descricao",
      "codigoNome",
      "codigo",
      "codigoEmpresa",
      "controlaEstoque",
      "controlaLote",
      "observacao",
      "identificadorCentroDeCusto",
      "identificadorEmpresa",
      "permiteSolicitarQuantidadeNegativa"
    ];

    const setorModel = new SetorModel();
    const setorModelKeys = Object.keys(setorModel);

    Object.keys(setorModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(setorModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let setorModel = new SetorModel();

    expect(setorModel.identificador).toBeUndefined();
    expect(setorModel.descricao).toBeUndefined();
    expect(setorModel.codigoNome).toBeUndefined();
    expect(setorModel.codigo).toBeUndefined();
    expect(setorModel.codigoEmpresa).toBeUndefined();
    expect(setorModel.controlaEstoque).toBeUndefined();
    expect(setorModel.controlaLote).toBeUndefined();
    expect(setorModel.observacao).toBeUndefined();
    expect(setorModel.identificadorCentroDeCusto).toBeUndefined();
    expect(setorModel.identificadorEmpresa).toBeUndefined();
    expect(setorModel.permiteSolicitarQuantidadeNegativa).toBeUndefined();

    // @TODO o modelo foi criado sem a inicialização dos tipos.
    // Como estou fazendo estes bem depois da criação dos modelos, assim que possivel alterar este modelo
    // para inciar com os tipos corretos (por exemplo "controlaEstoque" que provavelmente é booleano, iniciar com false ou true caso nada seja passado)
    setorModel = new SetorModel({
      identificador: "01",
      descricao: "texto",
      codigoNome: "01 -texto",
      codigo: "01",
      codigoEmpresa: "01",
      controlaEstoque: "sim",
      controlaLote: "sim",
      observacao: "texto",
      identificadorCentroDeCusto: "01",
      identificadorEmpresa: "01",
      permiteSolicitarQuantidadeNegativa: "sim"
    })

    expect(typeof setorModel.identificador).toBe("string");
    expect(typeof setorModel.descricao).toBe("string");
    expect(typeof setorModel.codigoNome).toBe("string");
    expect(typeof setorModel.codigo).toBe("string");
    expect(typeof setorModel.codigoEmpresa).toBe("string");
    expect(typeof setorModel.controlaEstoque).toBe("string");
    expect(typeof setorModel.controlaLote).toBe("string");
    expect(typeof setorModel.observacao).toBe("string");
    expect(typeof setorModel.identificadorCentroDeCusto).toBe("string");
    expect(typeof setorModel.identificadorEmpresa).toBe("string");
    expect(typeof setorModel.permiteSolicitarQuantidadeNegativa).toBe("string");
  });

  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem nome e codigo', () => {
      let setorModel = new SetorModel({
        codigo: "01"
      })
      expect(setorModel.modeloValido()).toBeTruthy();
      setorModel.codigo = undefined;
      expect(setorModel.modeloValido()).toBe(false);
    })
  })
});