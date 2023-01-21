import DesmembramentoMedicaoModel from '@/models/estoque/medicao/desmembramento-medicao-model';
import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';

describe('desmembramento-medicao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificadorDocumentoItem",
      "identificadorDesmembramento",
      "identificadorDesmembramentoOrigem",
      "quantidadeMaxima",
      "quantidadeMedida",
      "quantidadeAMedir",
      "observacao",
      "funcionario",
      "datasMedidas",
      "datasAMedir",
      "totalmenteMedido",
      "lote",
      "serie",
      "_hierarquia"
    ];
    const desmembramentoModel = new DesmembramentoMedicaoModel();
    const desmembramentoModelKeys = Object.keys(desmembramentoModel);

    Object.keys(desmembramentoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(desmembramentoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let desmembramentoModel = new DesmembramentoMedicaoModel();
    expect(desmembramentoModel.identificadorDocumentoItem).toBeUndefined();
    expect(desmembramentoModel.identificadorDesmembramento).toBe(0);
    expect(desmembramentoModel.identificadorDesmembramentoOrigem).toBeUndefined();
    expect(desmembramentoModel.quantidadeMaxima).toBe(0);
    expect(desmembramentoModel.quantidadeMedida).toBe(0);
    expect(desmembramentoModel.quantidadeAMedir).toBe(desmembramentoModel.quantidadeMaxima);
    expect(desmembramentoModel.observacao).toBeUndefined();
    expect(desmembramentoModel.funcionario).toBeUndefined();
    expect(desmembramentoModel.datasMedidas).toBeInstanceOf(Array);
    expect(desmembramentoModel.datasAMedir).toBeInstanceOf(Array);
    expect(desmembramentoModel.totalmenteMedido).toBe(false);
    expect(desmembramentoModel.lote).toBeUndefined();
    expect(desmembramentoModel.serie).toBeUndefined();
    expect(desmembramentoModel._hierarquia).toBeUndefined();

    desmembramentoModel = new DesmembramentoMedicaoModel({
      identificadorDocumentoItem: "10",
      identificadorDesmembramento: "10",
      identificadorDesmembramentoOrigem: 32,
      quantidadeMaxima: "23",
      quantidadeMedida: "4",
      quantidadeAMedir: "2",
      observacao: "testeunitario",
      funcionario: {nome: "testeunitario"},
      datasMedidas: [1,2,3],
      datasAMedir: [1,2,3],
      totalmenteMedido: true,
      lote: {a: 123},
      serie: {b: 123},
      _hierarquia: []
    })

    expect(typeof desmembramentoModel.identificadorDocumentoItem).toBe("string");
    expect(typeof desmembramentoModel.identificadorDesmembramento).toBe("number");
    expect(typeof desmembramentoModel.identificadorDesmembramentoOrigem).toBe("number");
    expect(typeof desmembramentoModel.quantidadeMaxima).toBe("number");
    expect(typeof desmembramentoModel.quantidadeMedida).toBe("number");
    expect(typeof desmembramentoModel.quantidadeAMedir).toBe("number");
    expect(typeof desmembramentoModel.observacao).toBe("string");
    expect(desmembramentoModel.funcionario).toBeInstanceOf(PessoaModel)
    expect(desmembramentoModel.datasMedidas).toBeInstanceOf(Array);
    expect(desmembramentoModel.datasAMedir).toBeInstanceOf(Array);
    expect(typeof desmembramentoModel.totalmenteMedido).toBe("boolean");
    expect(desmembramentoModel.lote).toBeInstanceOf(ProdutoLoteSerieModel)
    expect(desmembramentoModel.serie).toBeInstanceOf(ProdutoLoteSerieModel)
    expect(desmembramentoModel._hierarquia).toBeInstanceOf(Array)

  });
  describe("modeloValido", ()=>{
    it('ainda nao esta completo, deve retornar true', () => {
      expect(new DesmembramentoMedicaoModel().modeloValido()).toBe(true);
    });
  });

  describe("modeloAlterado", ()=>{
    it('deve identificar que NÃO houve alteração no modelo', () => {
      const desmembramentoModel = new DesmembramentoMedicaoModel();
      expect(desmembramentoModel.modeloAlterado()).toBe(false);
    });
    it('deve identificar alteração nas datas a medir', () => {
      const desmembramentoModel = new DesmembramentoMedicaoModel({datasAMedir: [1,2,3]});
      expect(desmembramentoModel.modeloAlterado()).toBe(true);
    });

    it('deve identificar alteração na quantidade a medir', () => {
      const desmembramentoModel = new DesmembramentoMedicaoModel({quantidadeAMedir: 10, quantidadeMaxima: 20});
      expect(desmembramentoModel.modeloAlterado()).toBe(true);
    });

    it('deve identificar alteração no funcionario', () => {
      const desmembramentoModel = new DesmembramentoMedicaoModel({funcionario: {}});
      expect(desmembramentoModel.modeloAlterado()).toBe(true);
    });

    it('deve identificar alteração na observação', () => {
      const desmembramentoModel = new DesmembramentoMedicaoModel({observacao: "testeunitario"});
      expect(desmembramentoModel.modeloAlterado()).toBe(true);
    });

    it('deve identificar que o desmembramento esta totalmente medido (não houve modificação)', () => {
      const desmembramentoModel = new DesmembramentoMedicaoModel({totalmenteMedido: true});
      expect(desmembramentoModel.modeloAlterado()).toBe(false);
    });
  });
});