'use strict';

import axiosConfig from '@/api/axios-config.js';
import ExpedicaoModel from '@/models/estoque/expedicao/expedicao-model.js';

function obterExpedicoes(identificadorDaLocacao) {
  let query = `{
    dados:expedicao(identificadorDaLocacao:${identificadorDaLocacao}) {
      codigoLocacao,
      identificadorLocacao,
      dataReferencia,
      descricao,
      nomePessoaDeContatoCliente,
      emailPessoaDeContatoCliente,
      telefonePessoaDeContatoCliente,
      possuiMaterialOuEquipamento,
      codigoEnderecoEntrega,
      cliente {
        codigo,
        CPFouCNPJ,
        identificador,
        nome,
        nomeCurto,
        enderecoPrincipal {
          pessoasDeContato {
            contatoPrincipal,
            telefoneFixo,
            email
          }
        }
      },
      itens {
        identificadorItemLocacao,
        categoria,
        descricao,
        dataFinalLocacao,
        dataInicialLocacao,
        quantidade,
        quantidadeRequisitada,
        atendidoComCorte,
        valorUnitario,
        valorDesconto,
        valorAcrescimo,
        produto {
          ativoVenda,
          identificador,
          nome,
          codigo,
          codigoNome
        },
        liberacoes {
          identificadorRequisicaoItemBaixa,
          lote {
            identificador,
            codigo,
            tipo,
            dataValidade,
            observacao
          },
          serie {
            identificador,
            codigo,
            tipo,
            dataValidade,
            observacao
          },
          quantidadeLiberada,
          quantidadeExpedida,
          quantidadeAExpedir
        }
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', ExpedicaoModel);
}

function enviarDadosExpedicao(expedicao) {
  var mutation = `mutation ($expedicao: ExpedicaoInput) {
      dados: gerarExpedicao(expedicao: $expedicao) {
        identificadorLocacao
      }
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { expedicao };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

export default {
  obterExpedicoes,
  enviarDadosExpedicao
};