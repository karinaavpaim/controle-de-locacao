import AditivoModel from '@/models/faturamento/orcamento-locacao/historico-locacao/aditivo-model';
import orcamentoDetalhes from '../../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'

describe('aditivo-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "identificadorOrcamento",
      "identificadorHistoricoOrcamento",
      "equipamentosIncluidos",
      "equipamentosExcluidos",
      "equipamentosAlterados",
      "servicosIncluidos",
      "servicosExcluidos",
      "servicosAlterados",
      "materiaisIncluidos",
      "materiaisExcluidos",
      "materiaisAlterados",
      "despesasIncluidas",
      "despesasExcluidas",
      "despesasAlteradas"
    ];

    const aditivoModel = new AditivoModel();
    const aditivoModelKeys = Object.keys(aditivoModel);

    Object.keys(aditivoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(aditivoModelKeys.find(p=>p===prop)).toBe(prop);
    });

  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let aditivoModel = new AditivoModel();
    expect(aditivoModel.identificadorOrcamento).toBeUndefined();
    expect(aditivoModel.identificadorHistoricoOrcamento).toBeUndefined();
    expect(aditivoModel.equipamentosIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.equipamentosExcluidos).toBeInstanceOf(Array);
    expect(aditivoModel.equipamentosAlterados).toBeInstanceOf(Array);
    expect(aditivoModel.servicosIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.servicosIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.servicosIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.materiaisIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.materiaisIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.materiaisIncluidos).toBeInstanceOf(Array);
    expect(aditivoModel.despesasIncluidas).toBeInstanceOf(Array);
    expect(aditivoModel.despesasExcluidas).toBeInstanceOf(Array);
    expect(aditivoModel.despesasAlteradas).toBeInstanceOf(Array);

    aditivoModel = new AditivoModel({
      identificadorOrcamento:"1",
      identificadorHistoricoOrcamento:"2",
      equipamentosIncluidos: [{}],
      equipamentosExcluidos: [{},{}],
      equipamentosAlterados: [],
      servicosIncluidos: [],
      servicosExcluidos: [],
      servicosAlterados: [],
      materiaisIncluidos: [{}],
      materiaisExcluidos: [],
      materiaisAlterados: [],
      despesasIncluidas: [],
      despesasExcluidas: [],
      despesasAlteradas: [{}]
    });

    expect(typeof aditivoModel.identificadorOrcamento).toBe("string");
    expect(typeof aditivoModel.identificadorHistoricoOrcamento).toBe("string");
    expect(aditivoModel.equipamentosIncluidos.length).toBe(1);
    expect(aditivoModel.equipamentosExcluidos.length).toBe(2);
    expect(aditivoModel.equipamentosAlterados.length).toBe(0);
    expect(aditivoModel.servicosIncluidos.length).toBe(0);
    expect(aditivoModel.servicosExcluidos.length).toBe(0);
    expect(aditivoModel.servicosAlterados.length).toBe(0);
    expect(aditivoModel.materiaisIncluidos.length).toBe(1);
    expect(aditivoModel.materiaisExcluidos.length).toBe(0);
    expect(aditivoModel.materiaisAlterados.length).toBe(0);
    expect(aditivoModel.despesasIncluidas.length).toBe(0);
    expect(aditivoModel.despesasExcluidas.length).toBe(0);
    expect(aditivoModel.despesasAlteradas.length).toBe(1);
  });

  it('Deve gerar aditivo por historico', () => {
    let aditivoModel = new AditivoModel();
    let orcamentoAtual = new OrcamentoLocacaoModel(orcamentoDetalhes);
    let orcamentoHistorico = new OrcamentoLocacaoModel(orcamentoDetalhes);

    // Alterando equipamento
    orcamentoAtual.itens[0].quantidade = 5;

    // Excluindo e adicionando outro item do tipo equipamento
    orcamentoAtual.itens[1].identificador = 10;

    // Alterando servico
    orcamentoAtual.itens[4].quantidade = 1;

    // Excluindo e adicionando outro item do tipo material
    orcamentoAtual.itens[5].identificador = 99;

    // Alterando despesa
    orcamentoAtual.despesas[0].valorItem = 550.0;

    // Veve excluir e adicionar outra despesa.
    orcamentoAtual.despesas[1].identificador = 99;

    aditivoModel = aditivoModel.gerarAditivoPorHistorico(orcamentoHistorico, orcamentoAtual);

    expect(aditivoModel.identificadorOrcamento).toBe(146);
    expect(aditivoModel.equipamentosIncluidos.length).toBe(1);
    expect(aditivoModel.equipamentosExcluidos.length).toBe(1);
    expect(aditivoModel.equipamentosAlterados.length).toBe(1);
    expect(aditivoModel.servicosIncluidos.length).toBe(0);
    expect(aditivoModel.servicosExcluidos.length).toBe(0);
    expect(aditivoModel.servicosAlterados.length).toBe(1);
    expect(aditivoModel.materiaisIncluidos.length).toBe(1);
    expect(aditivoModel.materiaisExcluidos.length).toBe(1);
    expect(aditivoModel.materiaisAlterados.length).toBe(0);
    expect(aditivoModel.despesasIncluidas.length).toBe(1);
    expect(aditivoModel.despesasExcluidas.length).toBe(1);
    expect(aditivoModel.despesasAlteradas.length).toBe(1);
  });

});