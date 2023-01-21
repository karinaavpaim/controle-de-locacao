import ConfiguracoesPaginaModel from "@/models/sistema/storage/configuracoes-pagina-model";
import { PERIODO_VISUALIZACAO } from "@/constants/faturamento/controle-de-locacao/dashboard-constants";
import { OPCOES_LINHAS_TABELA_POR_PAGINA, VALOR_PADRAO_ITENS_POR_PAGINA } from "@/constants/sistema/storage/configuracoes-pagina-constants"

describe('configuracoes-pagina-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "periodoDashboard",
      "linhasTabelaPadrao"
    ];

    const configuracoesPaginaModel = new ConfiguracoesPaginaModel;
    const configuracoesPaginaModelKeys = Object.keys(configuracoesPaginaModel);

    Object.keys(configuracoesPaginaModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(configuracoesPaginaModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter sua propriedades inicializadas com os tipos corretos.', () => {
    let configuracoesPaginaModel = new ConfiguracoesPaginaModel;
    expect(configuracoesPaginaModel.periodoDashboard).toBe(PERIODO_VISUALIZACAO.ULTIMOS_7_DIAS);
    expect(configuracoesPaginaModel.linhasTabelaPadrao).toBe(VALOR_PADRAO_ITENS_POR_PAGINA);

    configuracoesPaginaModel = new ConfiguracoesPaginaModel({
      periodoDashboard: PERIODO_VISUALIZACAO.ULTIMOS_180_DIAS,
      linhasTabelaPadrao: OPCOES_LINHAS_TABELA_POR_PAGINA[3]
    })

    expect(configuracoesPaginaModel.periodoDashboard).toBe(PERIODO_VISUALIZACAO.ULTIMOS_180_DIAS);
    expect(configuracoesPaginaModel.linhasTabelaPadrao).toBe(OPCOES_LINHAS_TABELA_POR_PAGINA[3]);
  });
});