import apiRequisicao from '@/api/estoque/requisicao-api.js';
import axiosConfig from '@/api/axios-config.js';
import RequisicaoModel from '@/models/estoque/requisicao/requisicao-model';

/* TODO: Estes testes serão refeitos após a conclusão do desenvolvimento da rotina de Requisição. */

describe('requisicao-api.js', () => {
  it('Deve invocar a execução do GraphQL ao obter requisições pelo ID da locação.', async () => {
    var requisicao = new RequisicaoModel({
      cliente: [{}],
      itens: [{
        produto: [{}],
        liberacoes: [{
          lote: [{}],
          serie: [{}]
        }],
      }]
    });

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([requisicao]));
    let itens = await apiRequisicao.obterRequisicoesPorIdLocacao();

    expect(itens[0].constructor.name).toEqual('RequisicaoModel');

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('mensagem-erro'));
    apiRequisicao.obterRequisicoesPorIdLocacao().catch(
      erro => expect(erro).toBe('mensagem-erro')
    );
  });

  it('Deve invocar a execução do GraphQL quando buscar itens e a requisição informada não possuir nenhum.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let itens = await apiRequisicao.obterRequisicoesPorIdLocacao();

    expect(itens).toEqual(expect.arrayContaining([])); 
  });

  it('Deve invocar a execução do GraphQL ao tentar enviar dados de requisição.', async () => {
    let requisicao = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(requisicao));
    let dadosRequisicao = await apiRequisicao.enviarDadosRequisicao(requisicao);

    expect(dadosRequisicao.constructor.name).toEqual('Object');
    expect(dadosRequisicao.identificador).toEqual(requisicao.identificador);
  });
});