import axiosConfig from '@/api/axios-config.js';
import OperacaoApi from '@/api/sistemas-gerais/operacao-api.js';
import OperacaoModel from '@/models/geral/operacao-model';

describe('operacao-api.js', () => {
  it('Deve invocar a execução do GraphQL passando a consulta ao tentar solicitar uma pessoa.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation((query, atributo, modelo) => Promise.resolve([new modelo({})]));
    
    let operacao = await OperacaoApi.localizarOperacoes();
    expect(operacao[0].constructor.name).toEqual(OperacaoModel.name);
  });

  it('Deve invocar a execução do GraphQL passando a consulta ao tentar solicitar uma pessoa.', async () => {
    let identificador = 'identificador';
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation((query, atributo, modelo) => Promise.resolve([new modelo({ nome: identificador })]));
    
    let operacao = await OperacaoApi.localizarOperacoesPorIdentificador(identificador);
    expect(operacao[0].constructor.name).toEqual(OperacaoModel.name);
  });
});