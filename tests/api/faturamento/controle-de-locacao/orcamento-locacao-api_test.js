import OrcamentoLocacaoApi from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import axiosConfig from '@/api/axios-config.js';
import { FILTROS_PESQUISA } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants"

describe('orcamento-locacao-api.js', () => {

  let orcamento = {
    codigo: 'codigo-do-orcamento',
    dataEmissao: '2019-10-07',
    dataInicioContrato: '2019-10-07',
    dataTerminoContrato: '2019-10-10',
    dataReferencia: '2019-10-07',
    dataInicialReferencia: '2019-10-07',
    dataFinalReferencia: '2019-10-10',
    identificadorEmpresa: 1,
    identificador: 333,
    cliente: { identificador: '00A0000001'},
    status: 'APROVADO'
  };

  FILTROS_PESQUISA.idEmpresa = orcamento.identificadorEmpresa;
  FILTROS_PESQUISA.idCliente = orcamento.cliente.identificador;
  FILTROS_PESQUISA.listaDeStatus = [orcamento.status];
  FILTROS_PESQUISA.codigo = orcamento.codigo;
  FILTROS_PESQUISA.dataEmissaoInicial = orcamento.dataEmissaoInicial;
  FILTROS_PESQUISA.dataEmissaoFinal = orcamento.dataEmissaoFinal;
  FILTROS_PESQUISA.identificadorOrcamento = orcamento.identificador;
  FILTROS_PESQUISA.dataInicialReferencia = orcamento.dataInicialReferencia;
  FILTROS_PESQUISA.dataFinalReferencia = orcamento.dataFinalReferencia;
  FILTROS_PESQUISA.dataInicioContrato = orcamento.dataInicioContrato;
  FILTROS_PESQUISA.dataTerminoContrato = orcamento.dataTerminoContrato;
  FILTROS_PESQUISA.orcamentos = true;
  FILTROS_PESQUISA.locacoes = false;

  it('Deve invocar a execução do GraphQL ao buscar orçamentos por empresa.', async () => {

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ orcamento ]));
    let orcamentos = await OrcamentoLocacaoApi.obterOrcamentos(FILTROS_PESQUISA);

    expect(orcamentos[0].constructor.name).toEqual('Object');
    expect(orcamentos[0].identificadorEmpresa).toEqual(orcamento.identificadorEmpresa);
  });

  it('Deve invocar a execução do GraphQL buscando por todos os parâmetros.', async () => {

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ orcamento ]));
    
    FILTROS_PESQUISA.identificadorOrcamento = null
    
    let orcamentos = await OrcamentoLocacaoApi.obterOrcamentos(FILTROS_PESQUISA);

    expect(orcamentos[0].constructor.name).toEqual('Object');
    expect(orcamentos[0].identificadorEmpresa).toEqual(orcamento.identificadorEmpresa);
    expect(orcamentos[0].cliente.identificador).toEqual(orcamento.cliente.identificador);
    expect(orcamentos[0].status).toEqual(orcamento.status);
    expect(orcamentos[0].codigo).toEqual(orcamento.codigo);
    expect(orcamentos[0].dataEmissao).toEqual(orcamento.dataEmissao);
    expect(orcamentos[0].identificador).toEqual(orcamento.identificador);
    expect(orcamentos[0].dataReferencia).toEqual(orcamento.dataReferencia);
    expect(orcamentos[0].dataInicioContrato).toEqual(orcamento.dataInicioContrato);
    expect(orcamentos[0].dataTerminoContrato).toEqual(orcamento.dataTerminoContrato);
    expect(orcamentos[0].dataInicialReferencia).toEqual(orcamento.dataInicialReferencia);
    expect(orcamentos[0].dataFinalReferencia).toEqual(orcamento.dataFinalReferencia);
  });

  it('Deve invocar a execução do GraphQL buscando por data de emissão.', async () => {
    FILTROS_PESQUISA.dataEmissaoInicial = '2019-10-07';

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ orcamento ]));
    let orcamentos = await OrcamentoLocacaoApi.obterOrcamentos(FILTROS_PESQUISA);

    expect(orcamentos[0].constructor.name).toEqual('Object');
    expect(FILTROS_PESQUISA.dataEmissaoInicial).toMatch(FILTROS_PESQUISA.dataEmissaoInicial);
  });

  it('Deve invocar a execução do GraphQL buscando por data de emissão.', async () => {
    FILTROS_PESQUISA.dataEmissaoFinal = '2019-10-10';

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ orcamento ]));
    let orcamentos = await OrcamentoLocacaoApi.obterOrcamentos(FILTROS_PESQUISA);

    expect(orcamentos[0].constructor.name).toEqual('Object');
    expect(FILTROS_PESQUISA.dataEmissaoFinal).toMatch(FILTROS_PESQUISA.dataEmissaoFinal);
  });

  it('Deve invocar a execução do GraphQL ao tentar buscar um orçamento por identificador.', async () => {
    let orcamento = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ orcamento ]));
    let orcamentos = await OrcamentoLocacaoApi.consultarDetalhesOrcamentoPorIdentificador(orcamento.identificador);

    expect(orcamentos[0].constructor.name).toEqual('Object');
    expect(orcamentos[0].identificador).toEqual(orcamento.identificador);
  });

  it('Deve invocar a execução do GraphQL e retornar uma lista vazia ao tentar buscar um orçamento por um identificador não numérico.', async () => {
    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));
    let orcamentos = await OrcamentoLocacaoApi.consultarDetalhesOrcamentoPorIdentificador('identificador-invalido');

    expect(orcamentos.length).toEqual(0);
  });

  it('Deve invocar a execução do GraphQL ao tentar cadastrar um orçamento.', async () => {
    let orcamento = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(orcamento));
    let orcamentoCadastrado = await OrcamentoLocacaoApi.cadastrar(orcamento);

    expect(orcamentoCadastrado.constructor.name).toEqual('Object');
    expect(orcamentoCadastrado.identificador).toEqual(orcamento.identificador);
  });

  it('Deve invocar a execução do GraphQL ao consultar um adicional personalizado.', async () => {
    let modelo = {
      nome: 'nome-do-modelo'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await OrcamentoLocacaoApi.obterAdicionaisPersonalizados(modelo.nome);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].nome).toContain(modelo.nome);

    modelos = await OrcamentoLocacaoApi.obterAdicionaisPersonalizados(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL para obter itens dos adicionais personalizados.', async () => {
    let modelo = {
      nome: 'nome-do-modelo'
    };

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([ modelo ]));
    let modelos = await OrcamentoLocacaoApi.obterItensDosAdicionaisPersonalizados(modelo.nome);

    expect(modelos[0].constructor.name).toEqual('Object');
    expect(modelos[0].nome).toContain(modelo.nome);

    modelos = await OrcamentoLocacaoApi.obterItensDosAdicionaisPersonalizados(undefined);
    expect(modelos[0].constructor.name).toEqual('Object');
  });

  it('Deve invocar a execução do GraphQL ao tentar editar um orçamento.', async () => {
    let orcamento = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(orcamento));
    let orcamentoCadastrado = await OrcamentoLocacaoApi.editar(orcamento);

    expect(orcamentoCadastrado.constructor.name).toEqual('Object');
    expect(orcamentoCadastrado.identificador).toEqual(orcamento.identificador);
  });

  it('Deve invocar a execução do GraphQL ao tentar alterar status um orçamento.', async () => {
    let orcamento = { identificador: 333, status: 'Liberado' };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(orcamento));
    let orcamentoCadastrado = await OrcamentoLocacaoApi.alterarStatusDoOrcamento(orcamento);

    expect(orcamentoCadastrado.constructor.name).toEqual('Object');
    expect(orcamentoCadastrado.identificador).toEqual(orcamento.identificador);
    expect(orcamentoCadastrado.status).toEqual(orcamento.status);
  });

  it('Deve invocar a execução do GraphQL ao tentar alterar status um orçamento.', async () => {
    let orcamento = { identificador: 333 };

    jest.spyOn(axiosConfig, 'executarMutationGraphQL').mockImplementation(() => Promise.resolve(orcamento));
    let orcamentoCadastrado = await OrcamentoLocacaoApi.deletarPropostaDoOrcamento(orcamento);

    expect(orcamentoCadastrado.constructor.name).toEqual('Object');
    expect(orcamentoCadastrado.identificador).toEqual(orcamento.identificador);
    expect(orcamentoCadastrado.status).toEqual(orcamento.status);
  });
});