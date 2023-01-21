import EnderecoApi from '@/api/sistemas-gerais/endereco-api.js';
import axiosConfig from '@/api/axios-config.js';

describe('endereco-api.js', () => {
  jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation((query) => { return query; });

  it('Deve invocar a execução do GraphQL passando o identificador da pessoa ao tentar buscar um endereço.', () => {
    let identificador = 'identificador-da-pessoa';
    expect(EnderecoApi.localizarEnderecos(identificador))
      .toContain(`endereco(identificadorDaPessoa:"${identificador}"`);
  });
  
  it('Deve invocar a execução do GraphQL passando o identificador da pessoa vazio ao tentar buscar um endereço.', () => {
    expect(EnderecoApi.localizarEnderecos(undefined))
      .toContain(`endereco(identificadorDaPessoa:""`);
  });

  it('Deve invocar a execução do GraphQL e retornar uma rejeição.', () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('erro-encontrado'));

    EnderecoApi.localizarEnderecos()
      .then(() => {
        expect(true).toEqual(false);
      })
      .catch(erro => {
        expect(erro).toEqual('erro-encontrado');
      });
  });
});