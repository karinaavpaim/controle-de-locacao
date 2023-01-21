'use strict';

import axiosConfig from '@/api/axios-config.js';
import RequisicaoModel from '@/models/estoque/requisicao/requisicao-model.js';

const atributosRequisicao = `
  identificador,
  identificadorLocacao,
  codigoLocacao,
  codigoRequisicao,
  dataReferencia,
  descricao,
  tipo,
  status,
  nomePessoaDeContatoCliente,
  emailPessoaDeContatoCliente,
  telefonePessoaDeContatoCliente,
  possuiMaterialOuEquipamento,
  codigoEnderecoEntrega,
  cliente {
    nome,
    identificador,
    CPFouCNPJ,
    nomeCurto,
    enderecoPrincipal {
      pessoasDeContato {
        contatoPrincipal,
        telefoneFixo,
        email
      }
    }
  },
  setorRequisitado{
    identificador,
    descricao,
  },
  setorRequisitante {
    identificador,
    descricao,
  },
  itens {
    identificador,
    identificadorItemLocacao,
    categoria,
    quantidadeDiarias,
    dataFinalLocacao,
    dataInicialLocacao,
    quantidadeDisponivel,
    quantidadePedida,
    quantidadeRequisitada,
    quantidadeARequisitar,
    atendidoComCorte,
    descricao,
    status,
    produto {
      ativoVenda,
      identificador,
      codigo,
      codigoNome,
      nome
    },
    lote{
      codigo,
      dataValidade,
      identificador,
      observacao,
      tipo
    },
    serie{
      codigo,
      dataValidade,
      identificador,
      observacao,
      tipo
    },
    codigoRequisicaoOrigem,
    baixas{
      dataDaBaixa,
      identificadorRequisicaoItemBaixa,
      codigoRequisicao,
      codigosRequisicoesEmDevolucao,
      lote{
        codigo,
        dataValidade,
        identificador,
        observacao
      },
      serie{
        codigo,
        dataValidade,
        identificador,
        observacao
      },
      quantidade,
      quantidadeEmDevolucao,
      quantidadeADevolver,
      quantidadeExpedida
    }
  }
`;

function obterRequisicoesPorIdLocacao(identificadorDaLocacao) {
  let query = `{
    dados:requisicaoMaterialLocacao(identificadorLocacao:${identificadorDaLocacao}) {
      ${atributosRequisicao}
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', RequisicaoModel);
}

async function enviarDadosRequisicao(requisicao){
    var mutation = `mutation ($requisicao: RequisicaoMaterialLocacaoInput) {
                      dados: cadastrarRequisicaoMaterialLocacao(requisicao: $requisicao) {
                        ${atributosRequisicao}
                      }
                    }`.replace(/[\n]*[ ]*/gm, '');
    var variaveis = { requisicao };

    return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados', RequisicaoModel);
}

export default {
  obterRequisicoesPorIdLocacao,
  enviarDadosRequisicao
};