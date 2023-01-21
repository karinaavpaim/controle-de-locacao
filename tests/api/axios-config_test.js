import axiosConfig from '@/api/axios-config.js';
import axios from 'axios';
import CategoriaPessoaModel from "../../src/models/geral/pessoa/categoria-pessoa-model";

describe('axios-config.js', () => {
  it('Deve consultar o axios e retornar da query o objeto dado o nome do atributo de resposta.', async () => {
    let respostaEsperada = {
      data: {
        data: {
          atributoResposta: {
            chaveEsperada: 'valor-esperado'
          }
        }
      }
    };

    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(respostaEsperada));
    let respostaEncontrada = await axiosConfig.executarQueryGraphQL(undefined, 'atributoResposta');

    expect(typeof respostaEncontrada).toEqual('object');
    expect(respostaEncontrada.chaveEsperada).toEqual(respostaEsperada.data.data.atributoResposta.chaveEsperada);

    respostaEncontrada = await axiosConfig.executarQueryGraphQL(undefined, '');

    expect(typeof respostaEncontrada).toEqual('object');
    expect(respostaEncontrada.data.atributoResposta.chaveEsperada).toEqual(respostaEsperada.data.data.atributoResposta.chaveEsperada);
  });

  it('Deve consultar o axios e retornar uma lista mapeada pelo modelo informado.', async () => {
    let respostaEsperada = {
      data: {
        data: {
          atributoResposta: [
            {
              identificador: '1',
              nome: 'categoria-teste'
            }
          ]
        }
      }
    };

    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(respostaEsperada));
    let respostaEncontrada =
      await axiosConfig.executarQueryGraphQL(undefined, 'atributoResposta', CategoriaPessoaModel);

    expect(respostaEncontrada[0].constructor.name).toEqual('CategoriaPessoaModel');
    expect(respostaEncontrada[0].identificador).toEqual(respostaEsperada.data.data.atributoResposta[0].identificador);
    expect(respostaEncontrada[0].nome).toEqual(respostaEsperada.data.data.atributoResposta[0].nome);
  });

  it('Deve consultar o axios e rejeitar o resultado.', () => {
    let erro = {
      message: 'mensagem-de-erro'
    };

    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(erro));
    axiosConfig.executarQueryGraphQL(undefined, 'atributoResposta').then(() => {
      expect(true).toBe(false);
    }).catch((mensagem) => {
      expect(mensagem).toEqual(erro.message);
    });
  });

  it('Deve consultar o axios e retornar da mutation o objeto dado o nome do atributo de resposta.', async () => {
    let respostaEsperada = {
      data: {
        data: {
          atributoResposta: {
            chaveEsperada: 'valor-esperado'
          }
        }
      }
    };

    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(respostaEsperada));
    let respostaEncontrada = await axiosConfig.executarMutationGraphQL(undefined, undefined, 'atributoResposta');

    expect(typeof respostaEncontrada).toEqual('object');
    expect(respostaEncontrada.chaveEsperada).toEqual(respostaEsperada.data.data.atributoResposta.chaveEsperada);
  });

  it('Deve consultar o axios e retornar da mutation um erro.', () => {
    let respostaEsperada = {
      data: {
        errors: [
          {
              message: 'mensgem-erro'
          }
        ]
      }
    };

    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(respostaEsperada));

    axiosConfig.executarMutationGraphQL(undefined, undefined, 'atributoResposta').then(() => {
      expect(true).toBe(false);
    }).catch((resposta) => {
      expect(resposta).toEqual(respostaEsperada.data.errors);
    });
  });

  it('Deve consultar o axios e rejeitar o erro da mutation.', () => {
    let erro = {
      message: 'mensagem-de-erro'
    };

    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(erro));
    axiosConfig.executarMutationGraphQL(undefined, undefined, 'atributoResposta').then(() => {
      expect(true).toBe(false);
    }).catch((mensagem) => {
      expect(mensagem).toEqual(erro.message);
    });
  });
});