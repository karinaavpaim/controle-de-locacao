import VariaveisModeloPropostaLocacaoModel from '@/models/faturamento/proposta-locacao/variaveis-modelo-proposta-locacao-model';
import VariaveisFilhasModel from '@/models/faturamento/proposta-locacao/variaveis-filhas-model';

describe('variaveis-modelo-proposta-locacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificadorPai",
      "nomePai",
      "filhas"
    ];

    const variaveisModeloPropostaLocacaoModel = new VariaveisModeloPropostaLocacaoModel()
    const variaveisModeloPropostaLocacaoModelKeys = Object.keys(variaveisModeloPropostaLocacaoModel);

    Object.keys(variaveisModeloPropostaLocacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(variaveisModeloPropostaLocacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let variaveisModeloPropostaLocacaoModel = new VariaveisModeloPropostaLocacaoModel();
    expect(variaveisModeloPropostaLocacaoModel.identificadorPai).toBeUndefined();
    expect(variaveisModeloPropostaLocacaoModel.nomePai).toBeUndefined();
    expect(variaveisModeloPropostaLocacaoModel.filhas).toBeInstanceOf(Array);

    variaveisModeloPropostaLocacaoModel = new VariaveisModeloPropostaLocacaoModel({
      identificadorPai: "01",
      nomePai: "nomePai",
      filhas: [{}]
    });

    expect(typeof variaveisModeloPropostaLocacaoModel.identificadorPai).toBe("string");
    expect(typeof variaveisModeloPropostaLocacaoModel.nomePai).toBe("string");
    expect(typeof variaveisModeloPropostaLocacaoModel.filhas).toBe("object")
    expect(variaveisModeloPropostaLocacaoModel.filhas.length).toBe(1)
    expect(variaveisModeloPropostaLocacaoModel.filhas[0]).toBeInstanceOf(VariaveisFilhasModel);
  });
});