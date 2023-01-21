'use strict';

import axiosConfig from '@/api/axios-config.js';
import SelecaoDeDocumentosModel from '@/models/estoque/controle-de-estoque/selecao-documento-model.js';

const atributosDocumentoControleEstoque = `
  identificador,
  identificadorDocumento,
  dataReferencia,
  descricao,
  status,
  tipo,
  setorOrigem{
    identificador,
    descricao
  },
  itens{
    identificador,
    quantidade,
    status,
    produto{
      identificador,
      codigoNome,
      codigo,
      nome,
      controleLoteSerie,
      unidade{
        sigla
      }
    },
    movimentos{
      identificador,
      lote{
        identificador,
        codigo
      },
      serie{
        identificador,
        codigo
      },
      quantidade,
      responsavel{
        identificador,
        nome
      }
    }
  }
`;

const atributosSelecaoDeDocumentos = `
  dataReferencia,
  documentos{
    ${atributosDocumentoControleEstoque}
  },
  finalizada,
  identificador,
  participantes{
    funcionario {
      identificador,
      nome
    },
    permiteFinalizarAtividade,
    corAlternativaAvatar
  }
`;

function obterSelecoesDeDocumentos(identificador, identificadorPessoaParticipante) {
  identificador = identificador || "";
  identificadorPessoaParticipante = identificadorPessoaParticipante || "";

  let query = `{
    dados:selecaoDeDocumentos(
      identificador:"${identificador}",
      identificadorPessoaParticipante:"${identificadorPessoaParticipante}"){
        ${atributosSelecaoDeDocumentos}
      }
    }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', SelecaoDeDocumentosModel);
}

function gravarSelecaoDeDocumentos(selecaoDeDocumentos) {
  var mutation = `
    mutation ($selecaoDeDocumentos: SelecaoDeDocumentosInput) {
      dados: gravarSelecaoDeDocumentos(selecaoDeDocumentos: $selecaoDeDocumentos) {
        ${atributosSelecaoDeDocumentos}
      }
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { selecaoDeDocumentos };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados', SelecaoDeDocumentosModel);
}

function incluirParticipanteNaSelecao(identificadorSelecao, identificadorParticipante) {
  identificadorSelecao = identificadorSelecao || "";
  identificadorParticipante = identificadorParticipante || "";
  var mutation = `
    mutation {
      dados: incluirParticipanteNaSelecao(
        identificadorSelecao:"${identificadorSelecao}",
        identificadorParticipante:"${identificadorParticipante}") {
        ${atributosSelecaoDeDocumentos}
      }
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = {};

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados', SelecaoDeDocumentosModel);
}

function finalizarSelecaoDeDocumentos(identificadorSelecaoDeDocumentos) {
  identificadorSelecaoDeDocumentos = identificadorSelecaoDeDocumentos || "";
  var mutation = `
    mutation {
      dados: finalizarSelecaoDeDocumentos(identificador: "${identificadorSelecaoDeDocumentos}") {
        ${atributosSelecaoDeDocumentos}
      }
    }
  `.replace(/[\n]*[ ]*/gm, '');
  var variaveis = {};

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados', SelecaoDeDocumentosModel);
}

function assinarNotificacoesSeparacao(metodoParaNotificacao) {
  let query = `
    subscription {
      selecaoDeDocumentosAtualizada {
        ${atributosSelecaoDeDocumentos}
      }
    }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.assinarNotificacoesGraphQL(query, metodoParaNotificacao);
}

export default {
  obterSelecoesDeDocumentos,
  gravarSelecaoDeDocumentos,
  incluirParticipanteNaSelecao,
  finalizarSelecaoDeDocumentos,
  assinarNotificacoesSeparacao
};