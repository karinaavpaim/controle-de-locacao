import ProdutoApi from '@/api/estoque/produto-api.js';
import axiosConfig from '@/api/axios-config.js';
import PesquisaAvancadaProdutoModel from '@/models/estoque/produto/pesquisa-avancada-produtos-model'

describe('produto-api.js', () => {
  it('Deve invocar a execução do GraphQL ao consultar um produto por nome e/ou código.', async () => {
    let produto = {
      nome: 'nome-do-produto'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ produto ]));
    let produtos = await ProdutoApi.localizarProduto(produto.nome);

    expect(produtos[0].constructor.name).toEqual('Object');
    expect(produtos[0].nome).toContain(produto.nome);

    produtos = await ProdutoApi.localizarProduto(undefined);
    expect(produtos[0].constructor.name).toEqual('Object');

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('mensagem-erro'));
    ProdutoApi.localizarProduto(produto.nome).then(() => {
      expect(true).toBe(false);
    }).catch(
      erro => expect(erro).toBe('mensagem-erro')
    );
  });

  it('Deve invocar a execução do GraphQL ao consultar um produto por tipo.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([{}]));
    let produtos = await ProdutoApi.localizarProduto(undefined, ['SERVICO']);

    expect(produtos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao consultar preços informando um produto.', async () => {
    var produto = {
      empresasProduto: [{}]
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([produto]));
    let precos = await ProdutoApi.localizarPrecosProduto('identificador-produto');

    expect(precos[0].constructor.name).toEqual('EmpresaProdutoModel');

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.reject('mensagem-erro'));
    ProdutoApi.localizarPrecosProduto('identificador-produto').catch(
      erro => expect(erro).toBe('mensagem-erro')
    );
   });

  it('Deve invocar a execução do GraphQL retornando uma lista vazia ao buscar preços sem informar o produto.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let precos = await ProdutoApi.localizarPrecosProduto(undefined);

    expect(precos).toEqual(expect.arrayContaining([]));
  });

  it('Deve invocar a execução do GraphQL quando buscar preços e o produto informado não possuir nenhum.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let precos = await ProdutoApi.localizarPrecosProduto('identificador-do-produto');

    expect(precos).toEqual(expect.arrayContaining([]));
  });

  it('Deve chamar a pesquisa avançada', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let produtos = await ProdutoApi.localizarProdutoPesquisaAvancada(new PesquisaAvancadaProdutoModel, ["Tipo_1","Tipo_2"]);

    expect(produtos).toEqual(expect.arrayContaining([]));
  });
});