import EmpresaApi from '@/api/sistemas-gerais/empresa-api.js';
import axiosConfig from '@/api/axios-config.js';
import EmpresaModel from '@/models/geral/empresa-model';
import SetorModel from '@/models/geral/setor-model';

describe('empresa-api.js', () => {
  let axiosMock = jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(
    (query, nomeAtributoDeResposta, modelo) => {
      return Promise.resolve([new modelo()])
    }
  );

  it('Deve retornar um array do modelo de empresa.', async () => {
    let consulta = 'nome-da-empresa';
    let empresas = await EmpresaApi.localizarEmpresa(consulta);
    expect(empresas[0].constructor.name).toBe(EmpresaModel.name);
  });

  it('Deve invocar a execução do GraphQL passando o login ao tentar solicitar uma empresa.', async () => {
    let login = 'login-do-usuario';
    let empresas = await EmpresaApi.localizarEmpresa(undefined, login);
    expect(empresas[0].constructor.name).toBe(EmpresaModel.name);
  });

  it('Deve retornar uma rejeicao pois a api deu erro', async () => {
    axiosMock.mockClear()
    axiosMock = jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(
      (query) => {
        return Promise.reject([{error: query}])
      }
    );

    let login = 'login-do-usuario';
    try {
      await EmpresaApi.localizarEmpresa(undefined, login);
      expect(true).toBe(false);
    }
    catch(e) {
      expect(e).toBeDefined()
    }
  });

  it('Deve invocar a execução do GraphQL passando a consulta ao tentar solicitar uma pessoa.', async () => {
    let identificadorEmpresa = 'identificador-da-empresa';
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation((query, atributo, modelo) => Promise.resolve([new modelo({ nome: identificadorEmpresa })]));
    
    let setores = await EmpresaApi.localizarSetoresPorIdentificadorEmpresa(identificadorEmpresa);
    expect(setores[0].constructor.name).toEqual(SetorModel.name);
  });
});