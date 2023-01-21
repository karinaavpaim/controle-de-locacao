import axiosConfig from '@/api/axios-config.js';
import DashboardLocacaoModel from "@/models/faturamento/orcamento-locacao/dashboard-locacao/dashboard-locacao-model";

function obterDadosDashboardLocacao(identificadorEmpresa, periodo) {
  identificadorEmpresa = identificadorEmpresa || 1;
  let query = `{
    dados: dashboardLocacao(identificadorEmpresa: "${identificadorEmpresa}", dataInicialReferencia: "${periodo.dataInicial}", dataFinalReferencia: "${periodo.dataAtual}") {
      produtosMaisLocadosPorCategoria {
        dezEquipamentosMaisLocados {
          quantidade,
          codigo,
          nome,
          codigoNome
        },
        dezMateriaisMaisLocados {
          quantidade,
          codigo,
          nome,
          codigoNome
        },
        dezServicosMaisLocados {
          quantidade,
          codigo,
          nome,
          codigoNome
        }
      },
      locacoesPorStatus {
        quantidade,
        status
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');
  return axiosConfig.executarQueryGraphQL(query, 'dados', DashboardLocacaoModel);
}

export default {
  obterDadosDashboardLocacao
};