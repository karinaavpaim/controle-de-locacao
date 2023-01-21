import axiosConfig from '@/api/axios-config.js';
import HistoricoLocacaoModel from '@//models/faturamento/orcamento-locacao/historico-locacao/historico-locacao-model';
import { DETALHES_ORCAMENTO_GRAPHQL } from '@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants';

const CAMPOS_MODELO = `
    identificador,
    identificadorUsuario,
    identificadorOrcamento,
    dataRegistro,
    valorHistorico {
      ${DETALHES_ORCAMENTO_GRAPHQL}
    }
`;

function obterHistoricosPeloIdendificadorDaLocacao(identificador) {
  let query = `{
    dados: obterHistoricoOrcamento(identificadorOrcamento:${identificador}) {
      ${CAMPOS_MODELO}
    }
  }`

  return axiosConfig.executarQueryGraphQL(query, 'dados', HistoricoLocacaoModel);
}

export default {
  obterHistoricosPeloIdendificadorDaLocacao
};