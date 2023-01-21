import PessoaApi from '@/api/sistemas-gerais/pessoa-api.js';
import axiosConfig from '@/api/axios-config.js';

describe('pessoa-api.js', () => {
  it('Deve invocar a execução do GraphQL passando a consulta ao tentar solicitar uma pessoa.', async () => {
    let nomeDaPessoa = 'nome-da-pessoa';
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation((query, atributo, modelo) => Promise.resolve([new modelo({ nome: nomeDaPessoa })]));
    
    let pessoas = await PessoaApi.localizarPessoa(nomeDaPessoa);
    expect(pessoas[0].constructor.name).toEqual('PessoaModel');
    expect(pessoas[0].nome).toEqual(nomeDaPessoa);
  });

  it('Deve invocar a execução do GraphQL passando as categorias ao tentar solicitar uma empresa.', async () => {
    let categoria =
      {
        nome: 'CLIENTE',
        identificador: '0000000005'
      };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation((query, atributo, model) => Promise.resolve(
      [
        new model({
          categorias: [categoria]
        })
      ]));

    let pessoas = await PessoaApi.localizarPessoa(undefined, [categoria]);
    expect(pessoas[0].constructor.name).toEqual('PessoaModel');
    expect(pessoas[0].categorias[0]).toEqual(categoria);
  });

  it('Deve invocar a execução do GraphQL e retornar uma rejeição.', () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('erro-encontrado'));

    PessoaApi.localizarPessoa()
      .then(() => {
        expect(true).toEqual(false);
      })
      .catch(erro => {
          expect(erro).toEqual('erro-encontrado');
      });
  });
});