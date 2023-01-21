import OperacaoModel from '@/models/geral/operacao-model';

describe('operacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "codigo",
      "codigoNome",
      "descricao",
      "tipo",
      "atualizaEstoque",
      "atualizaFinanceiro",
      "identificadorTipoDocumento",
      "identificadoresDasEmpresasVinculadasAoTipoDocumento"
    ];

    const operacaoModel = new OperacaoModel();
    const operacaoModelKeys = Object.keys(operacaoModel);

    Object.keys(operacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(operacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let operacaoModel = new OperacaoModel();
    expect(operacaoModel.identificador).toBeUndefined();
    expect(operacaoModel.codigo).toBeUndefined();
    expect(operacaoModel.codigoNome).toBeUndefined();
    expect(operacaoModel.descricao).toBeUndefined();
    expect(operacaoModel.tipo).toBeUndefined();
    expect(operacaoModel.atualizaEstoque).toBeUndefined();
    expect(operacaoModel.atualizaFinanceiro).toBeUndefined();
    expect(operacaoModel.identificadorTipoDocumento).toBeUndefined();
    expect(operacaoModel.identificadoresDasEmpresasVinculadasAoTipoDocumento).toBeUndefined();

    operacaoModel = new OperacaoModel({
      identificador: "texto",
      codigo: "texto",
      codigoNome: "texto",
      descricao: "texto",
      tipo: "texto",
      atualizaEstoque: "texto",
      atualizaFinanceiro: "texto",
      identificadorTipoDocumento: "texto",
      identificadoresDasEmpresasVinculadasAoTipoDocumento: "texto"
    })

    expect(typeof operacaoModel.identificador).toBe("string")
    expect(typeof operacaoModel.codigo).toBe("string")
    expect(typeof operacaoModel.codigoNome).toBe("string")
    expect(typeof operacaoModel.descricao).toBe("string")
    expect(typeof operacaoModel.tipo).toBe("string")
    expect(typeof operacaoModel.atualizaEstoque).toBe("string")
    expect(typeof operacaoModel.atualizaFinanceiro).toBe("string")
    expect(typeof operacaoModel.identificadorTipoDocumento).toBe("string")
    expect(typeof operacaoModel.identificadoresDasEmpresasVinculadasAoTipoDocumento).toBe("string")
  });
  
  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem tipo e codigo', () => {
      let operacaoModel = new OperacaoModel({
        tipo:"texto",
        codigo:"texto"
      })
      expect(operacaoModel.modeloValido()).toBeTruthy();
    })
  })
});