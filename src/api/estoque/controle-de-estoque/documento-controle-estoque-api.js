'use strict';

import axiosConfig from '@/api/axios-config.js';
import DocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/documento-controle-estoque-model.js';
import MovimentoItemDocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/movimento-item-documento-controle-estoque-model.js';

const atributosMovimentoItemDocumentoControleEstoque = `
  identificador,
  quantidade,
  lote {
    identificador,
    codigo
  },
  serie {
    identificador,
    codigo
  },
  responsavel {
    identificador,
    nome
  }
`;

function obterCapasDosDocumentosControleEstoque(identificadorSetorRequisitado, dataInicial, dataFinal, incluirConcluidos) {
  identificadorSetorRequisitado = identificadorSetorRequisitado || "";
  dataInicial = dataInicial || "";
  dataFinal = dataFinal || "";
  incluirConcluidos = !!incluirConcluidos;

  let query = `{
    dados:obterCapasDosDocumentosControleEstoque(
      identificadorSetorRequisitado:"${identificadorSetorRequisitado}",
      dataInicial:"${dataInicial}",
      dataFinal:"${dataFinal}",
      incluirConcluidos:${incluirConcluidos}){
        identificador,
        identificadorDocumento,
        dataReferencia,
        descricao,
        status,
        tipo,
        setorOrigem{
          identificador,
          descricao
        }
      }
    }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', DocumentoControleEstoqueModel);
}

function incluirDocumentoControleEstoqueItemMovimento(parametros) {
  var mutation = `
    mutation ($parametros: MovimentoItemDocumentoControleEstoqueAtualizadoInput!) {
      dados: incluirMovimentoItemDocumentoControleEstoque(parametros: $parametros) {
        ${atributosMovimentoItemDocumentoControleEstoque}
      }
    }`;
  var variaveis = { parametros };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados', MovimentoItemDocumentoControleEstoqueModel);
}

function assinarNotificacoesMovimentos(metodoParaNotificacao) {
  let query = `
    subscription {
      movimentoItemDocumentoControleEstoqueAtualizado {
        identificadorDocumento,
        tipoDocumento,
        identificadorItem,
        movimento {
          ${atributosMovimentoItemDocumentoControleEstoque}
        }
      }
    }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.assinarNotificacoesGraphQL(query, metodoParaNotificacao);
}

export default {
  obterCapasDosDocumentosControleEstoque,
  incluirDocumentoControleEstoqueItemMovimento,
  assinarNotificacoesMovimentos
};