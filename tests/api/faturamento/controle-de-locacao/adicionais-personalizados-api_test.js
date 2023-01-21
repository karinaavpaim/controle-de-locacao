import axiosConfig from '@/api/axios-config.js';
import AdicionalPersonalizadoApi from '@/api/faturamento/controle-de-locacao/adicionais-personalizados-api.js';

describe('adicionais-personalizados-api.js', () => {

  it('Deve invocar a execução do GraphQL ao tentar cadastrar um adicional personalizado.', async () => {
    let adicionalPersonalizado = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(adicionalPersonalizado));
    let adicionalPersonalizadoCadastrado = await AdicionalPersonalizadoApi.cadastrar(adicionalPersonalizado);

    expect(adicionalPersonalizadoCadastrado.constructor.name).toEqual('Object');
    expect(adicionalPersonalizadoCadastrado.identificador).toEqual(adicionalPersonalizado.identificador);
  });

  it('Deve invocar a execução do GraphQL ao tentar editar um adicional personalizado.', async () => {
    let adicionalPersonalizado = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(adicionalPersonalizado));
    let adicionalPersonalizadoCadastrado = await AdicionalPersonalizadoApi.editar(adicionalPersonalizado);

    expect(adicionalPersonalizadoCadastrado.constructor.name).toEqual('Object');
    expect(adicionalPersonalizadoCadastrado.identificador).toEqual(adicionalPersonalizado.identificador);
  });

  it('Deve invocar a execução do GraphQL ao obter um adicional personalizado.', async () => {
    let modelo = {
      nome: 'nome-do-modelo'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await AdicionalPersonalizadoApi.obter(modelo.nome);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].nome).toContain(modelo.nome);

    modelos = await AdicionalPersonalizadoApi.obter(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao obter um adicional personalizado por identificador.', async () => {
    let modelo = { identificador: '333' };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await AdicionalPersonalizadoApi.obterPorIdentificador(modelo.identificador);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].identificador).toContain(modelo.identificador);

    modelos = await AdicionalPersonalizadoApi.obterPorIdentificador(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao obter os itens de um adicional personalizado.', async () => {
    let modelo = { identificador: '333' };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await AdicionalPersonalizadoApi.obterItensDoAdicionalPersonalizado(modelo.identificador);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].identificador).toContain(modelo.identificador);

    modelos = await AdicionalPersonalizadoApi.obterItensDoAdicionalPersonalizado(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });
});