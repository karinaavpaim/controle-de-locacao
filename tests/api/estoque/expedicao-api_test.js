import axiosConfig from '@/api/axios-config.js';
import apiExpedicao from '@/api/estoque/expedicao-api.js';
import ExpedicaoModel from '@/models/estoque/expedicao/expedicao-model';

/* TODO: Estes testes serão refeitos após a conclusão do desenvolvimento da rotina de Expedição. */

describe('expedicao-api.js', () => {
  it('Deve invocar a execução do GraphQL ao obter expedições pelo ID da locação.', async () => {
    var expedicao = new ExpedicaoModel({
      cliente: [{}],
      itens: [{
        produto: [{}],
        liberacoes: [{
          lote: [{}],
          serie: [{}]
        }],
      }]
    });

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([expedicao]));
    let itens = await apiExpedicao.obterExpedicoes();

    expect(itens[0].constructor.name).toEqual('ExpedicaoModel');

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('mensagem-erro'));
    apiExpedicao.obterExpedicoes().catch(
      erro => expect(erro).toBe('mensagem-erro')
    );
  });

  it('Deve invocar a execução do GraphQL quando buscar itens e a expedição informada não possuir nenhum.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let itens = await apiExpedicao.obterExpedicoes();

    expect(itens).toEqual(expect.arrayContaining([]));
  });

  it('Deve invocar a execução do GraphQL ao tentar enviar dados de expedição.', async () => {
    let expedicao = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(expedicao));
    let dadosExpedicao = await apiExpedicao.enviarDadosExpedicao(expedicao);

    expect(dadosExpedicao.constructor.name).toEqual('Object');
    expect(dadosExpedicao.identificador).toEqual(expedicao.identificador);
  });

  it('Deve invocar a execução do GraphQL ao tentar enviar dados de requisição.', async () => {
    let expedicao = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(expedicao));
    let dadosExpedicao = await apiExpedicao.enviarDadosExpedicao(expedicao);

    expect(dadosExpedicao.constructor.name).toEqual('Object');
    expect(dadosExpedicao.identificador).toEqual(expedicao.identificador);
  });
});