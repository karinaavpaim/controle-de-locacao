import DespesaMedicaoLocacaoModel from '@/models/estoque/medicao/despesa-medicao-locacao-model';

describe('despesa-medicao-locacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "valorItem",
      "quantidade",
      "valorTotal",
      "valorAdicionalPersonalizado",
      "naturezaLancamento",
      "desmembramentos",
      "identificadorEntidadeOrigem",
      "medirPeloOrcado",
      "incluidoNaGestao",
      "status"
    ];

    const despesaMedicaoLocacaoModel = new DespesaMedicaoLocacaoModel();
    const despesaMedicaoLocacaoModelKeys = Object.keys(despesaMedicaoLocacaoModel);

    Object.keys(despesaMedicaoLocacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(despesaMedicaoLocacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    //@TODO desenvolver
  });
});