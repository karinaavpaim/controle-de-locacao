import variaveisDespesasParaAditivo from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-despesas-aditivo';

describe('Variáveis de equipamentos para aditivo', () => {

  beforeEach(() => {});

  it('Será implementado na proxima tarefa.', () => {
    let variaveis = variaveisDespesasParaAditivo.obter();
    expect(variaveis).toEqual(expect.arrayContaining([]));
  });
});