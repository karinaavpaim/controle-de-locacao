import compositorVariaveis from '../../../../src/plugins/editor-tinymce/composicao-variaveis/compositor-variaveis';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import AditivoModel from '@/models/faturamento/orcamento-locacao/historico-locacao/aditivo-model';

describe('Testes referente ao compositor de variáveis.', () => {
  
  beforeEach(() => {});
    
  it('Deve obter as variáveis para proposta "Implementar na tarefa de variáveis"', async () => {
    let variaveis = await compositorVariaveis.obterVariaveisParaProposta(new OrcamentoLocacaoModel());
    expect(variaveis.length).toBe(8);
  });

  it('Deve obter as variáveis para aditivo "Implementar na tarefa de variáveis"', async () => {
    let variaveis = await compositorVariaveis.obterVariaveisParaAditivo(new AditivoModel());
    expect(variaveis.length).toBe(5);
  });

});