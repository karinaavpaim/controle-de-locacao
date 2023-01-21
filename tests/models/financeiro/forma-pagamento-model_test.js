import FormaPagamentoModel from '@/models/financeiro/forma-pagamento-model';
import FormaPagamentoItemModel from "@/models/financeiro/forma-pagamento-item-model";

describe('forma-pagamento-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "codigo",
      "codigoNome",
      "identificador",
      "nome",
      "itens"
    ];

    const formaPagamentoModel = new FormaPagamentoModel()
    const formaPagamentoModelKeys = Object.keys(formaPagamentoModel);

    Object.keys(formaPagamentoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(formaPagamentoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let formaPagamentoModel = new FormaPagamentoModel();
    expect(formaPagamentoModel.codigo).toBeUndefined();
    expect(formaPagamentoModel.codigoNome).toBeUndefined();
    expect(formaPagamentoModel.identificador).toBeUndefined();
    expect(formaPagamentoModel.nome).toBeUndefined();
    expect(formaPagamentoModel.itens).toBeInstanceOf(Array);

    formaPagamentoModel = new FormaPagamentoModel({
      codigo: "01",
      codigoNome: "01 - texto",
      identificador: "01",
      nome: "texto",
      itens: [{}]
    });

    expect(typeof formaPagamentoModel.codigo).toBe("string");
    expect(typeof formaPagamentoModel.codigoNome).toBe("string");
    expect(typeof formaPagamentoModel.identificador).toBe("string");
    expect(typeof formaPagamentoModel.nome).toBe("string");
    expect(typeof formaPagamentoModel.itens).toBe("object");
    expect(formaPagamentoModel.itens.length).toBe(1)
    expect(formaPagamentoModel.itens[0]).toBeInstanceOf(FormaPagamentoItemModel);
  });
});