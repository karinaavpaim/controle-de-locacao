import FormaPagamentoItemModel from '@/models/financeiro/forma-pagamento-item-model';

describe('forma-pagamento-item-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificadorEmpresa",
      "identificador",
      "numeroParcelasCliente",
      "numeroParcelasRecebimento",
      "numeroDiasRecebimento",
      "numeroDiasIntervalo"
    ];

    const formaPagamentoItemModel = new FormaPagamentoItemModel()
    const formaPagamentoItemModelKeys = Object.keys(formaPagamentoItemModel);

    Object.keys(formaPagamentoItemModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(formaPagamentoItemModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let formaPagamentoItemModel = new FormaPagamentoItemModel();
    expect(formaPagamentoItemModel.identificadorEmpresa).toBeUndefined();
    expect(formaPagamentoItemModel.identificador).toBeUndefined();
    expect(formaPagamentoItemModel.numeroParcelasCliente).toBeUndefined();
    expect(formaPagamentoItemModel.numeroParcelasRecebimento).toBeUndefined();
    expect(formaPagamentoItemModel.numeroDiasRecebimento).toBeUndefined();
    expect(formaPagamentoItemModel.numeroDiasIntervalo).toBeUndefined();


    formaPagamentoItemModel = new FormaPagamentoItemModel({
      identificadorEmpresa: 1,
      identificador: 2,
      numeroParcelasCliente: 4,
      numeroParcelasRecebimento: 4,
      numeroDiasRecebimento: 30,
      numeroDiasIntervalo: 1
    });

    expect(typeof formaPagamentoItemModel.identificadorEmpresa).toBe("number");
    expect(typeof formaPagamentoItemModel.identificador).toBe("number");
    expect(typeof formaPagamentoItemModel.numeroParcelasCliente).toBe("number");
    expect(typeof formaPagamentoItemModel.numeroParcelasRecebimento).toBe("number");
    expect(typeof formaPagamentoItemModel.numeroDiasRecebimento).toBe("number");
    expect(typeof formaPagamentoItemModel.numeroDiasIntervalo).toBe("number");
  });
});