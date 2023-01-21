import axiosConfig from '@/api/axios-config.js';
import ConfiguracaoLocacaoApi from '@/api/faturamento/controle-de-locacao/configuracao-locacao-api';

describe('configuracao-locacao-api.js', () => {
  it('Deve invocar a execução do GraphQL ao obter uma configuração.', async () => {
    let modelo = { identificadorEmpresa: '333' };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await ConfiguracaoLocacaoApi.obterConfiguracaoLocacaoPeloIdentificadorEmpresa(modelo.identificadorEmpresa);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].identificadorEmpresa).toContain(modelo.identificadorEmpresa);

    modelos = await ConfiguracaoLocacaoApi.obterConfiguracaoLocacaoPeloIdentificadorEmpresa(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao tentar cadastrar ou editar uma configuração.', async () => {
    let modelo = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(modelo));
    let adicionalPersonalizadoCadastrado = await ConfiguracaoLocacaoApi.cadastrarOuEditarConfiguracaoLocacao(modelo);

    expect(adicionalPersonalizadoCadastrado.constructor.name).toEqual('Object');
    expect(adicionalPersonalizadoCadastrado.identificador).toEqual(modelo.identificador);
  });
});