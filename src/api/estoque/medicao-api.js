'use strict';

import axiosConfig from '@/api/axios-config.js';
import MedicaoLocacaoModel from '@/models/estoque/medicao/medicao-locacao-model.js';

function obterMedicoes(identificadorDaLocacao) {
  let query = `{
    dados:medicao(identificadorDaLocacao:${identificadorDaLocacao}) {
      codigoLocacao,
      identificadorLocacao,
      dataReferencia,
      dataInicioContrato,
      dataTerminoContrato,
      descricao,
      nomePessoaDeContatoCliente,
      emailPessoaDeContatoCliente,
      telefonePessoaDeContatoCliente,
      possuiMaterialOuEquipamento,
      codigoEnderecoEntrega,
      cliente {
        codigo,
        identificador,
        CPFouCNPJ,
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
      despesas {
        identificador,
        identificadorEntidadeOrigem,
        medirPeloOrcado,
        incluidoNaGestao,
        valorItem,
        valorAdicionalPersonalizado,
        quantidade,
        valorTotal,
        status,
        naturezaLancamento {
          ativo,
          classificacao,
          codigo,
          identificador,
          identificadorNaturezaLancamentoPai,
          nome,
          tipo
        }
        desmembramentos {
          identificadorDocumentoItem,
          identificadorDesmembramento,
          identificadorDesmembramentoOrigem,
          observacao,
          datasMedidas,
          datasAMedir,
          quantidadeMedida,
          quantidadeMaxima,
          quantidadeAMedir,
          totalmenteMedido
        }
      }
      itens {
        identificadorItemLocacao,
        identificadorEntidadeOrigem,
        medirPeloOrcado,
        incluidoNaGestao,
        categoria,
        quantidadeDiarias,
        quantidadePedida,
        dataInicialLocacao,
        dataFinalLocacao,
        quantidadeExpedida,
        valorTotal,
        valorUnitario,
        descricao,
        status,
        produto {
          ativoVenda,
          nome,
          codigo,
          identificador,
          codigoNome
        }
        desmembramentos {
          identificadorDocumentoItem,
          identificadorDesmembramento,
          identificadorDesmembramentoOrigem,
          quantidadeMedida,
          quantidadeAMedir,
          quantidadeMaxima,
          lote {
            identificador,
            codigo
          }
          serie {
            identificador,
            codigo
          }
          funcionario {
            identificador
          },
          datasMedidas,
          datasAMedir,
          totalmenteMedido
        }
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', MedicaoLocacaoModel);
}

function enviarDadosMedicao(medicao) {
  var mutation = `mutation ($medicao: MedicaoInput) {
      dados: gerarMedicao(medicao: $medicao) {
        identificadorLocacao
      }
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { medicao };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

export default {
  obterMedicoes,
  enviarDadosMedicao
};