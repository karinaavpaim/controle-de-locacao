import PrazoModel from '@/models/financeiro/prazo-model';
import FormaPagamentoModel from "@/models/financeiro/forma-pagamento-model";

describe('prazo-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "ativo",
      "codigoClassificacao",
      "codigo",
      "codigoNome",
      "identificador",
      "identificadoresEmpresa",
      "nome",
      "tipo",
      "tipoClassificacao",
      "formasPagamentosEntrada",
      "formasPagamentosParcelas"
    ];

    const prazoModel = new PrazoModel()
    const prazoModelKeys = Object.keys(prazoModel);

    Object.keys(prazoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(prazoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let prazoModel = new PrazoModel();
    expect(prazoModel.ativo).toBeUndefined();
    expect(prazoModel.codigoClassificacao).toBeUndefined();
    expect(prazoModel.codigo).toBeUndefined();
    expect(prazoModel.codigoNome).toBeUndefined();
    expect(prazoModel.identificador).toBeUndefined();
    expect(prazoModel.identificadoresEmpresa).toBeUndefined();
    expect(prazoModel.nome).toBeUndefined();
    expect(prazoModel.tipo).toBeUndefined();
    expect(prazoModel.tipoClassificacao).toBeUndefined();
    expect(prazoModel.formasPagamentosEntrada).toBeInstanceOf(Array);
    expect(prazoModel.formasPagamentosParcelas).toBeInstanceOf(Array);

    prazoModel = new PrazoModel({
      ativo: true,
      codigoClassificacao: "01",
      codigo: "00001",
      codigoNome: "01 - texto",
      identificador: "01",
      identificadoresEmpresa: "01",
      nome: "texto",
      tipo: "texto",
      tipoClassificacao: "texto",
      formasPagamentosEntrada: [{}],
      formasPagamentosParcelas: [{}]
    });

    expect(typeof prazoModel.ativo).toBe("boolean");
    expect(typeof prazoModel.codigoClassificacao).toBe("string");
    expect(typeof prazoModel.codigo).toBe("string");
    expect(typeof prazoModel.codigoNome).toBe("string");
    expect(typeof prazoModel.identificador).toBe("string");
    expect(typeof prazoModel.identificadoresEmpresa).toBe("string");
    expect(typeof prazoModel.nome).toBe("string");
    expect(typeof prazoModel.tipo).toBe("string");
    expect(typeof prazoModel.tipoClassificacao).toBe("string");
    expect(typeof prazoModel.formasPagamentosEntrada).toBe("object");
    expect(prazoModel.formasPagamentosEntrada.length).toBe(1)
    expect(prazoModel.formasPagamentosEntrada[0]).toBeInstanceOf(FormaPagamentoModel);
    expect(typeof prazoModel.formasPagamentosParcelas).toBe("object");
    expect(prazoModel.formasPagamentosParcelas.length).toBe(1)
    expect(prazoModel.formasPagamentosParcelas[0]).toBeInstanceOf(FormaPagamentoModel);    
  });
});