import propostaLocacaoAPI from '@/api/faturamento/controle-de-locacao/proposta-locacao-api.js';
import axiosConfig from '@/api/axios-config.js';

describe('proposta-locacao-api.js', () => {
  it('Deve invocar a execução do GraphQL ao consultar um modelo por nome ou descrição.', async () => {
    let modelo = {
      nome: 'nome-do-modelo'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await propostaLocacaoAPI.obterModelosDePropostas(modelo.nome);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].nome).toContain(modelo.nome);

    modelos = await propostaLocacaoAPI.obterModelosDePropostas(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao obter uma proposta por identificador.', async () => {
    let modelo = {
      identificador: '1'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await propostaLocacaoAPI.obterProposta(modelo.identificador);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].identificador).toContain(modelo.identificador);
  });

  it('Deve invocar a execução do GraphQL ao consultar um modelo por identificador.', async () => {
    let modelo = {
      identificador: '1'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await propostaLocacaoAPI.obterModeloDePropostaPorIdentificador(modelo.identificador);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].identificador).toContain(modelo.identificador);
  });

  it('Deve invocar a execução do GraphQL ao consultar um modelo sem trazer conteúdo.', async () => {
    let modelo = {
      nome: 'nome-do-modelo'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await propostaLocacaoAPI.obterModelosDePropostaSemTrazerConteudo(modelo.nome);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].nome).toContain(modelo.nome);

    modelos = await propostaLocacaoAPI.obterModelosDePropostaSemTrazerConteudo(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao consultar as variáveis do sistema disponíveis para modelos de proposta.', async () => {
    let variavel = {
      nome: 'nome-da-variavel'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ variavel ]));
    let variaveis = await propostaLocacaoAPI.obterVariaveisDoSistema(variavel.nome);

    expect(variaveis[0].constructor.name).toEqual('Object');

    variaveis = await propostaLocacaoAPI.obterVariaveisDoSistema(undefined);
    expect(variaveis[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao tentar cadastrar uma proposta.', async () => {
    let identificadorOrcamento = 333;
    let identificadorModelo = 1;
    let proposta = { conteudo: 'conteudo-proposta' };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(proposta));
    let propostaCadastrada =
      await propostaLocacaoAPI.cadastrarProposta(identificadorOrcamento, identificadorModelo, proposta.conteudo);

    expect(propostaCadastrada.constructor.name).toEqual('Object');
    expect(propostaCadastrada.conteudo).toEqual(proposta.conteudo);
  });

  it('Deve invocar a execução do GraphQL ao tentar editar uma proposta.', async () => {
    let identificadorOrcamento = 333;
    let identificadorModelo = 1;
    let proposta = { conteudo: 'conteudo-proposta' };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(proposta));
    let propostaCadastrada = await propostaLocacaoAPI.editarProposta(identificadorOrcamento, identificadorModelo, proposta.conteudo);

    expect(propostaCadastrada.constructor.name).toEqual('Object');
    expect(propostaCadastrada.conteudo).toEqual(proposta.conteudo);
  });

  it('Deve invocar a execução do GraphQL ao tentar cadastrar um modelo de uma proposta.', async () => {
    let proposta = { conteudo: 'conteudo-modelo' };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(proposta));
    let propostaCadastrada = await propostaLocacaoAPI.cadastrarModeloProposta(proposta);

    expect(propostaCadastrada.constructor.name).toEqual('Object');
    expect(propostaCadastrada.conteudo).toEqual(proposta.conteudo);
  });

  it('Deve invocar a execução do GraphQL ao tentar alterar um modelo de uma proposta.', async () => {
    let proposta = { identificador: 'identificador-modelo' };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(proposta));
    let propostaCadastrada = await propostaLocacaoAPI.editarModeloProposta(proposta);

    expect(propostaCadastrada.constructor.name).toEqual('Object');
    expect(propostaCadastrada.identificador).toEqual(proposta.identificador);
  });
});