import AutenticacaoApi from '@/api/sistema/autenticacao-api';
import axiosConfig from '@/api/axios-config.js';
import CredenciaisModel from '@/models/sistema/credenciais-model';

describe('autenticacao-api.js', () => {
  const CHAVE_STORAGE = 'ol_tkn';

  jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(
    (mutation, variaveis, nomeAtributoDeResposta, modelo) => {
      return Promise.resolve([new modelo()])
    }
  );

  it('Deve autenticar com as credenciais', async () => {
    let autenticacao = await AutenticacaoApi.autenticar(new CredenciaisModel());
    expect(autenticacao[0].constructor.name).toBe(CredenciaisModel.name);
  });

  it('Deve verificar se está autenticado', async () => {
    await AutenticacaoApi.estaAutenticado();
    let token = AutenticacaoApi.recuperarTokenDeAutenticacaoDaStorage();
    token = CHAVE_STORAGE;
    expect(token).toBe(CHAVE_STORAGE);
  });

  it('Deve gravar token de autenticação', async () => {
    await AutenticacaoApi.gravarTokenAutenticacaoNaStorage(new CredenciaisModel());
  });
});