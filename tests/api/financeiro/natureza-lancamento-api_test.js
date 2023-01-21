import NaturezaLancamentoApi from '@/api/financeiro/natureza-lancamento-api.js';
import axiosConfig from '@/api/axios-config.js';

describe('natureza-lancamento-api.js', () => {
  it('Deve invocar a execução do GraphQL ao consultar uma natureza de lançamento analítica.', async () => {
   let natureza = {
      ativo: true,
      tipo: 'ANALITICA'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ natureza ]));
    let naturezas = await NaturezaLancamentoApi.localizarNaturezasAnaliticas('nome-natureza-lancamento');

    expect(naturezas[0].constructor.name).toEqual('Object');
    expect(naturezas[0].tipo).toContain(natureza.tipo);
  });

  it('Deve invocar a execução do GraphQL ao consultar uma natureza de lançamento por nome.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([{}]));
    let naturezas = await NaturezaLancamentoApi.localizarNaturezasDeLancamento('nome-natureza-lancamento');

    expect(naturezas[0].constructor.name).toEqual('Object');

    naturezas = await NaturezaLancamentoApi.localizarNaturezasDeLancamento(undefined);
    expect(naturezas[0].constructor.name).toEqual('Object');
  });
});