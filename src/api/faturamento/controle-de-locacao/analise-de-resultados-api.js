'use strict';

import axiosConfig from '@/api/axios-config.js';
import AnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/analise-resultado-model';

const itensMedicao = `
  identificadorItemLocacao,
  identificadorEntidadeOrigem,
  medirPeloOrcado,
  incluidoNaGestao,
  categoria,
  quantidadeDiarias,
  quantidadePedida,
  produto {
    identificador,
    codigoNome,
    codigo
  },
  status,
  valorUnitario
`;

const despesasMedicao = `
  identificador,
  identificadorEntidadeOrigem,
  medirPeloOrcado,
  incluidoNaGestao,
  valorItem,
  valorAdicionalPersonalizado,
  quantidade,
  valorTotal,
  naturezaLancamento {
    codigo,
    nome
  },
  status,
  valorItem
`;

const empresaOrcamentoOuLocacao = `
  identificador,
  codigo,
  codigoNome,
  CNPJ
`;

const clienteOrcamentoOuLocacao = `
  identificador,
  codigo,
  codigoNome,
  CPFouCNPJ,
  nomeCurto,
  nome,
  enderecoPrincipal {
    pessoasDeContato {
      contatoPrincipal,
      telefoneFixo,
      email
    }
  }
`;

const itensOrcamentoOuLocacao = `
  identificador,
  identificadorEntidadeOrigem,
  descricao,
  categoria,
  quantidade,
  quantidadeDiarias,
  valorDesconto,
  valorAcrescimo,
  valorUnitario,
  valorAdicionalPersonalizado,
  incluidoNaGestao,
  medirPeloOrcado,
  preco {
    identificador,
    codigo,
    codigoNome,
    nome
  },
  produto {
    identificador,
    codigo,
    codigoNome,
    controleLoteSerie,
    classificacao,
    produtoComposto,
    descricaoAplicacao
  },
  status
`;

const atributosDespesasOrcadoOuLocacao = `
  identificador,
  identificadorEntidadeOrigem,
  quantidade,
  medirPeloOrcado,
  incluidoNaGestao,
  valorAdicionalPersonalizado,
  valorItem,
  naturezaLancamento{
    identificador,
    codigo,
    tipo,
    nome,
    classificacao
  },
  status
`;

const atributosOrcamentoOuLocacao = `
  identificador,
  idEntidadeOrigem,
  codigo,
  descricao,
  dataEmissao,
  dataReferencia,
  dataInicioContrato,
  dataTerminoContrato,
  status,
  totalOrcamento,
  nomePessoaDeContatoCliente,
  emailPessoaDeContatoCliente,
  telefonePessoaDeContatoCliente,
  empresa{
    ${empresaOrcamentoOuLocacao}
  },
  cliente{
    ${clienteOrcamentoOuLocacao}
  },
  itens {
    ${itensOrcamentoOuLocacao}
  },
  despesas {
    ${atributosDespesasOrcadoOuLocacao}
  },
  adicionalPersonalizadoItens {
    identificador,
    adicionalPersonalizadoItem {
      identificador,
      descricao,
    },
    valorTotalAdicionalPersonalizado
  }
`;

const atributosMedicao = `
    codigoLocacao,
    identificadorLocacao,
    dataInicioContrato,
    dataTerminoContrato,
    itens {
      ${itensMedicao},
      desmembramentos {
        identificadorDocumentoItem,
        identificadorDesmembramento,
        identificadorDesmembramentoOrigem,
        quantidadeMedida,
        quantidadeMaxima,
        quantidadeAMedir,
        lote {
          identificador,
          codigo
        },
        serie {
          identificador,
          codigo
        },
        funcionario{
          codigoNome
        }
        datasMedidas,
        datasAMedir,
        totalmenteMedido
      }
    },
    despesas{
    ${despesasMedicao},
      desmembramentos{
        datasMedidas,
        datasAMedir,
        identificadorDesmembramento,
        identificadorDesmembramentoOrigem,
        observacao,
        quantidadeMedida,
        quantidadeMaxima,
        quantidadeAMedir,
        totalmenteMedido
      }
    }
`;

function obterResultadosPorIdLocacao(identificadorDaLocacao) {
  let query = `{
    dados:metadadosAnaliseDeResultados(identificadorLocacao:${identificadorDaLocacao}) {
      orcado {
        ${atributosOrcamentoOuLocacao}
      },
      locacao {
        ${atributosOrcamentoOuLocacao}
      },
      medicao {
        ${atributosMedicao}
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', AnaliseResultadoModel);
}

export default {
  obterResultadosPorIdLocacao
};