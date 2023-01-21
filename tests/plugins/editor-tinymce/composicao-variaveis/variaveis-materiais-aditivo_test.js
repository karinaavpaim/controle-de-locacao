import variaveisMateriaisParaAditivo from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-materiais-aditivo';

describe('Variáveis de materiais para aditivo', () => {

  beforeEach(() => {});

  it('Será implementado na proxima tarefa.', () => {
    let variaveis = variaveisMateriaisParaAditivo .obter();
    expect(variaveis).toEqual(expect.arrayContaining([]));
  });
});