import variaveisServicosParaAditivo from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-servicos-aditivo';


describe('Variáveis de serviços para aditivo', () => {

  beforeEach(() => {});
  
  fit('Será implementado na proxima tarefa.', () => {
    let variaveis = variaveisServicosParaAditivo.obter();
    expect(variaveis).toEqual(expect.arrayContaining([]));
  });
});