import DespesaModel from '@/models/faturamento/orcamento-locacao/despesa-model';
import NaturezaLancamentoModel from '@/models/financeiro/natureza-lancamento-model';

describe('despesa-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "naturezaLancamento",
      "valorItem",
      "quantidade",
      "valorAdicionalPersonalizado",
      "medirPeloOrcado",
      "incluidoNaGestao",
      "movimentado",
      "identificadorEntidadeOrigem",
      "status"
    ];

    const despesaModel = new DespesaModel();
    const despesaModelKeys = Object.keys(despesaModel);

    Object.keys(despesaModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(despesaModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let despesaModel = new DespesaModel();
    expect(despesaModel.identificador).toBeUndefined();
    expect(despesaModel.naturezaLancamento).toBeInstanceOf(NaturezaLancamentoModel);
    expect(despesaModel.valorItem).toBe(0);
    expect(despesaModel.quantidade).toBe(1);
    expect(despesaModel.valorAdicionalPersonalizado).toBe(0);
    expect(despesaModel.medirPeloOrcado).toBeFalsy();
    expect(despesaModel.incluidoNaGestao).toBeFalsy();
    expect(despesaModel.movimentado).toBeFalsy();
    expect(despesaModel.identificadorEntidadeOrigem).toBeUndefined();
    expect(despesaModel.status).toBe("ABERTO");

    despesaModel = new DespesaModel({
      identificador: "01",
      naturezaLancamento: {},
      valorItem: 100,
      quantidade: 1,
      valorAdicionalPersonalizado: 15,
      medirPeloOrcado: false,
      incluidoNaGestao: false,
      movimentado: false,
      identificadorEntidadeOrigem: "01",
      status: 'ABERTO'
    })

    expect(typeof despesaModel.identificador).toBe("string")
    expect(typeof despesaModel.naturezaLancamento).toBe("object")
    expect(typeof despesaModel.valorItem).toBe("number")
    expect(typeof despesaModel.quantidade).toBe("number")
    expect(typeof despesaModel.valorAdicionalPersonalizado).toBe("number")
    expect(typeof despesaModel.medirPeloOrcado).toBe("boolean")
    expect(typeof despesaModel.incluidoNaGestao).toBe("boolean")
    expect(typeof despesaModel.movimentado).toBe("boolean")
    expect(typeof despesaModel.identificadorEntidadeOrigem).toBe("string")
    expect(typeof despesaModel.status).toBe("string")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois algum dos campos não está preenchido corretamente', () => {
      let despesaModel = new DespesaModel({
        naturezaLancamento: {
          ativo: true,
          classificacao: "01",
          codigo: "01",
          codigoNome: "01 - texto",
          identificador: "02",
          identificadorNaturezaLancamentoPai: "01",
          nome: "texto",
          tipo: "texto"
        }
      });
      despesaModel.quantidade = 0;
      expect(despesaModel.modeloValido()).toBeFalsy();

      despesaModel.quantidade = 10;
      despesaModel.valorItem = -1;
      expect(despesaModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo está completo', () => {
      let despesaModel = new DespesaModel({
        identificador: "01",
        naturezaLancamento: {
          ativo: true,
          classificacao: "01",
          codigo: "01",
          codigoNome: "01 - texto",
          identificador: "02",
          identificadorNaturezaLancamentoPai: "01",
          nome: "texto",
          tipo: "texto"
        },
        valorItem: 100,
        quantidade: 1,
        valorAdicionalPersonalizado: 20,
        medirPeloOrcado: false,
        incluidoNaGestao: false,
        movimentado: false,
        identificadorEntidadeOrigem: "01",
        status: "ABERTO"
      })
      expect(despesaModel.modeloValido()).toBeTruthy();
    })
  });
});