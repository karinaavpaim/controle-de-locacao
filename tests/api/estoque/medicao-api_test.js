import apiMedicao from '@/api/estoque/medicao-api.js';
import axiosConfig from '@/api/axios-config.js';

/* TODO: Estes testes serão refeitos após a conclusão do desenvolvimento da rotina de Medição. */

describe('medicao-api.js', () => {
  it('Deve invocar a execução do GraphQL ao obter medições.', async () => {
    var medicao = {
      cliente: [{}],
      itens: [{
        produto: [{}],
        liberacoes: [{
          lote: [{}],
          serie: [{}]
        }],
      }]     
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([medicao]));

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('mensagem-erro'));
    apiMedicao.obterMedicoes('identificadorDaLocacao').catch(
      erro => expect(erro).toBe('mensagem-erro')
    );
  });

  it('Deve invocar a execução do GraphQL retornando uma lista vazia ao buscar itens sem informar a medição.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let itens = await apiMedicao.obterMedicoes(undefined);

    expect(itens).toEqual(expect.arrayContaining([]));
  });

  it('Deve invocar a execução do GraphQL quando buscar itens e a medição informada não possuir nenhum.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let itens = await apiMedicao.obterMedicoes('identificadorDaLocacao');

    expect(itens).toEqual(expect.arrayContaining([]));
  });

  it('Deve invocar a execução do GraphQL ao tentar enviar dados de requisição.', async () => {
    let medicao = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(medicao));
    let dadosMedicao = await apiMedicao.enviarDadosMedicao(medicao);

    expect(dadosMedicao.constructor.name).toEqual('Object');
    expect(dadosMedicao.identificador).toEqual(medicao.identificador);
  });
});