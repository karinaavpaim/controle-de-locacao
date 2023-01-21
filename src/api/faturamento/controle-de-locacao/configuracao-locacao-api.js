import axiosConfig from '@/api/axios-config.js';
import ConfiguracaoLocacaoModel from "@/models/faturamento/orcamento-locacao/configuracao/configuracao-model";

const atributoConfiguracaoLocacao = `
    identificadorEmpresa,
    secaoGeral{
      utilizarAdicionaisPersonalizados,
      identificadorProdutoPadraoBimer,
      codigoEmpresaPadraoBimer
    },
    secaoSetor{
      setorEstoquePrincipal,
      setorEstoqueExpedicao,
      setorEstoqueEmLocacao,
      setorEstoqueEmManutencao,
      setorEstoquePerda
    },
    secaoOperacao{
      operacaoExpedicaoDosEquipamentos,
      operacaoExpedicaoDosMateriais,
      operacaoFaturamentoDosEquipamentos,
      operacaoFaturamentoDosMateriais,
      operacaoFaturamentoDosServicos
    },
    secaoMedicao{
      gerarPedidoLiberadoNaMedicao,
      primeiraPrioridadeSomaDasDespesasNaMedicao,
      segundaPrioridadeSomaDasDespesasNaMedicao,
      terceiraPrioridadeSomaDasDespesasNaMedicao
    },
    secaoExpedicao{
      gerarPedidoLiberadoNaExpedicao,
      tabelaPrecoExpedicao
    },
    secaoFaturamentoDocumento{
      tiposDocumentoNotaFiscal,
      tiposDocumentoNotaFiscalServico,
      tiposDocumentoOrdemEntrega
    }
`;

function obterConfiguracaoLocacaoPeloIdentificadorEmpresa(identificadorEmpresa) {
  identificadorEmpresa = identificadorEmpresa || '';

  let query = `{
    dados:configuracaoLocacao(identificadorEmpresa: "${identificadorEmpresa}") {
      ${atributoConfiguracaoLocacao}
    }
  }`.replace(/[\n]*[ ]*/gm, '');
  return axiosConfig.executarQueryGraphQL(query, 'dados', ConfiguracaoLocacaoModel);
}

function cadastrarOuEditarConfiguracaoLocacao(dados) {
  var mutation = `
    mutation ($configuracao: ConfiguracaoLocacaoInput) {
      dados: cadastrarOuEditarConfiguracaoLocacao(configuracaoLocacao: $configuracao) {
        ${atributoConfiguracaoLocacao}
      }
    }`.replace(/[\n]*[ ]*/gm, '');

  let variaveis = { configuracao: dados };
  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

export default {
  obterConfiguracaoLocacaoPeloIdentificadorEmpresa,
  cadastrarOuEditarConfiguracaoLocacao
};