'use strict';

import axiosConfig from '@/api/axios-config.js';
import adicionalPersonalizadoApi from '@/api/faturamento/controle-de-locacao/adicionais-personalizados-api';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import RemessaRetornoLocacaoModel from '@/models/geral/remessa-retorno-locacao-model';

import { DETALHES_ORCAMENTO_GRAPHQL } from '@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants';
//TODO: Refatorar a regra de filtros, passando somente oque for obrigatório.
// Essa alteração implica em alterar a constante PESQUISA_FILTRO para seus valores ficarem undefined onde não forem obrigatórios.
// Fazer isso assim que possível.
function obterOrcamentos(filtros) {
  let filtrosGraphQL = {};
  filtrosGraphQL.codigo = (filtros.codigo && `codigo:"${filtros.codigo}",`) || "";
  filtrosGraphQL.dataEmissaoFinal = (filtros.dataEmissaoFinal && `dataFinalEmissao:"${filtros.dataEmissaoFinal}",`) || "";
  filtrosGraphQL.dataEmissaoInicial = (filtros.dataEmissaoInicial && `dataInicialEmissao:"${filtros.dataEmissaoInicial}",`) || "";
  filtrosGraphQL.dataInicioContrato = (filtros.dataInicioContrato && `dataInicioContrato:"${filtros.dataInicioContrato}",`) || "";
  filtrosGraphQL.dataTerminoContrato = (filtros.dataTerminoContrato && `dataTerminoContrato:"${filtros.dataTerminoContrato}",`) || "";
  filtrosGraphQL.dataInicialReferencia = (filtros.dataInicialReferencia && `dataInicialReferencia:"${filtros.dataInicialReferencia}",`) || "";
  filtrosGraphQL.dataFinalReferencia = (filtros.dataFinalReferencia && `dataFinalReferencia:"${filtros.dataFinalReferencia}",`) || "";
  filtrosGraphQL.idEmpresa = !isNaN(parseInt(filtros.idEmpresa)) ? `empresa:${Number(filtros.idEmpresa)},` : "";
  filtrosGraphQL.identificadorOrcamento = !isNaN(parseInt(filtros.identificadorOrcamento)) ? `identificador:${Number(filtros.identificadorOrcamento)},` : "";
  filtrosGraphQL.idCliente = (filtros.idCliente && `identificadorCliente:"${filtros.idCliente}",`) || "";
  filtrosGraphQL.listaDeStatus = filtros.listaDeStatus || [];

  let campos = ` ${filtrosGraphQL.codigo}
  ${filtrosGraphQL.dataEmissaoFinal}
  ${filtrosGraphQL.dataEmissaoInicial}
  ${filtrosGraphQL.dataInicioContrato}
  ${filtrosGraphQL.dataTerminoContrato}
  ${filtrosGraphQL.dataInicialReferencia}
  ${filtrosGraphQL.dataFinalReferencia}
  ${filtrosGraphQL.idEmpresa}
  ${filtrosGraphQL.identificadorOrcamento}
  ${filtrosGraphQL.idCliente}
  listaStatus:[${filtrosGraphQL.listaDeStatus}]) {
    identificador,
    idEntidadeOrigem,
    codigo,
    cliente {
      identificador,
      nome,
      nomeCurto,
      CPFouCNPJ
    },
    status,
    dataEmissao,
    dataReferencia,
    dataInicioContrato,
    dataTerminoContrato,
    possuiItemComProdutoPadrao,
    possuiMaterialOuEquipamento,
    possuiItemMovimentado,
    codigoEnderecoEntrega,
    totalOrcamento,
    descricao,
    nomePessoaDeContatoCliente,
    emailPessoaDeContatoCliente,
    telefonePessoaDeContatoCliente
  }`;

  let metodoParaConsulta = (filtros.buscarLocacoes && 'obterCapaDasLocacoes') ||
    (filtros.buscarOrcamentos && 'obterCapaDosOrcamentos') ||
    (filtros.buscarLocacoesMovimentadas && 'obterCapaDeLocacoesMovimentadas')

  let query = `{
    dados:${metodoParaConsulta}(
    ${campos}
    }`.replace(/[\n]*[ ]*/gm, '');
  return axiosConfig.executarQueryGraphQL(query, 'dados', OrcamentoLocacaoModel);
}

function obterDetalhesDoOrcamento(identificadorOrcamento) {
 

  var query = `{
  dados:orcamentoLocacao(identificador:${identificadorOrcamento}) {
      ${DETALHES_ORCAMENTO_GRAPHQL}
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', OrcamentoLocacaoModel);
}

function consultarDetalhesOrcamentoPorIdentificador(identificador) {
  let identificadorDoOrcamento = !isNaN(parseInt(identificador)) ? Number(identificador) : -1;

  return obterDetalhesDoOrcamento(identificadorDoOrcamento);
}

async function cadastrar(dados) {
  var mutation = `mutation($orcamento:OrcamentoLocacaoInput){
                    dados:cadastrarOrcamentoLocacao(orcamentoLocacao:$orcamento){${camposOrcamento}}
                  }`;
  var variaveis = { orcamento: dados };

  return await axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

async function editar(dados, recalcularAdicionalPersonalizado) {
  var mutation = `mutation($orcamento:OrcamentoLocacaoInput){
                      dados:editarOrcamentoLocacao(
                        orcamentoLocacao:$orcamento,
                        recalcularAdicionalPersonalizado:${!!recalcularAdicionalPersonalizado}){
                        ${camposOrcamento}}
                    }`;
  var variaveis = { orcamento: dados };

  return await axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

function alterarStatusDoOrcamento(identificadorDoOrcamento, status) {
  var mutation = `mutation($eStatusOrcamento: EStatusOrcamento){
    alterarStatusDoOrcamento(
      identificador: ${identificadorDoOrcamento},
      statusDoOrcamento:$eStatusOrcamento
    ){
        identificador,
        idEntidadeOrigem,
        codigo,
        descricao,
        nomePessoaDeContatoCliente,
        emailPessoaDeContatoCliente,
        telefonePessoaDeContatoCliente,
        cliente {
          identificador,
          nome,
          nomeCurto,
          CPFouCNPJ
        },
        status,
        dataEmissao,
        dataReferencia,
        dataInicioContrato,
        dataTerminoContrato,
        possuiItemComProdutoPadrao,
        possuiMaterialOuEquipamento,
        possuiItemMovimentado,
        totalOrcamento
    }
  }`;
  var variaveis = { eStatusOrcamento: status };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'alterarStatusDoOrcamento');
}

function deletarPropostaDoOrcamento(identificadorDoOrcamento) {
  var mutation = `mutation ($identificador: TextoNumericoOuNumero) {
    deletarPropostaDoOrcamento(identificadorOrcamento: $identificador) {
      ${camposOrcamento}
    }
  }`;
  var variaveis = { identificador: identificadorDoOrcamento };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'deletarPropostaDoOrcamento', OrcamentoLocacaoModel);
}

function obterAdicionaisPersonalizados(consulta) {
  return adicionalPersonalizadoApi.obterAdicionaisPersonalizadosSimplificado(consulta);
}

function obterItensDosAdicionaisPersonalizados(identificador) {
  return adicionalPersonalizadoApi.obterItensDoAdicionalPersonalizado(identificador);
}

const camposOrcamento = `
  codigo,
  dataReferencia,
  dataEmissao,
  dataInicioContrato,
  dataTerminoContrato,
  descricao,
  identificador,
  idEntidadeOrigem,
  cliente{
    nome,
    nomeCurto,
    codigo,
    CPFouCNPJ
  },
  empresa {
    identificador
  },
  totalOrcamento,
  possuiItemComProdutoPadrao,
  possuiItemMovimentado,
  status`;

function obterDadosRemessaRetornoDosItens(identificadorLocacao) {
  var query = `{
    dados:obterDadosRemessaRetornoDosItens(identificadorLocacao:${identificadorLocacao}) {
      identificador,
      identificadorItemOrcamento,
      dataRemessa,
      numeroDocumentoRemessa,
      quantidadeRemessa,
      loteSerieRemessa {
        identificador,
        codigo,
        tipo
      },
      dataRetorno,
      numeroDocumentoRetorno,
      quantidadeRetorno,
      loteSerieRetorno {
        identificador,
        codigo,
        tipo
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', RemessaRetornoLocacaoModel);
}

export default {
  obterOrcamentos,
  obterAdicionaisPersonalizados,
  obterItensDosAdicionaisPersonalizados,
  cadastrar,
  editar,
  alterarStatusDoOrcamento,
  consultarDetalhesOrcamentoPorIdentificador,
  obterDadosRemessaRetornoDosItens,
  deletarPropostaDoOrcamento
};