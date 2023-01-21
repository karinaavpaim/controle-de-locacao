import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';

import DashboardLocacao from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import ControleDeOrcamentoDeLocacao from '@/components/faturamento/controle-de-locacao/orcamento/ControleDeOrcamentoDeLocacao.vue';
import OrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/OrcamentoLocacao.vue';
import ModeloPropostaLocacao from '@/components/faturamento/controle-de-locacao/proposta/ModeloPropostaLocacao.vue';
import GeracaoDePropostaDeLocacao from '@/components/faturamento/controle-de-locacao/proposta/GeracaoDePropostaDeLocacao.vue';
import ControleDeModelosDeProposta from '@/components/faturamento/controle-de-locacao/proposta/ControleDeModelosDeProposta.vue';
import ControleDeAdicionaisPersonalizados from '@/components/faturamento/controle-de-locacao/orcamento/ControleDeAdicionaisPersonalizados.vue';
import ControleDeGestaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/ControleDeGestaoDeLocacao.vue';
import MovimentacaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/MovimentacaoDeLocacao.vue';
import BaseOpcoesMovimentacaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/BaseOpcoesMovimentacaoDeLocacao.vue';
import ConfiguracaoControleLocacao from '@/components/geral/configuracao/ConfiguracaoControleLocacao.vue';
import AnaliseDeResultados from '@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/AnaliseDeResultados.vue';

let rotas = ROTAS_FATURAMENTO_METADATA;

export default [
  Object.assign(rotas.dashboardLocacao, { component: DashboardLocacao }),
  Object.assign(rotas.controleDeOrcamentoDeLocacao, { component: ControleDeOrcamentoDeLocacao }),
  Object.assign(rotas.novoOrcamentoLocacao, { component: OrcamentoLocacao }),
  Object.assign(rotas.editarOrcamentoLocacao, { component: OrcamentoLocacao }),
  Object.assign(rotas.duplicarOrcamentoLocacao, { component: OrcamentoLocacao }),
  Object.assign(rotas.controleDeGestaoDeLocacao, { component: ControleDeGestaoDeLocacao }),
  Object.assign(rotas.ajustarLocacao, { component: OrcamentoLocacao }),
  Object.assign(rotas.analiseDeResultados, { component: AnaliseDeResultados }),
  Object.assign(rotas.movimentacaoDeLocacao, { component: MovimentacaoDeLocacao }),
  Object.assign(rotas.requisicaoDeLocacao, { component: BaseOpcoesMovimentacaoDeLocacao }),
  Object.assign(rotas.expedicaoDeLocacao, { component: BaseOpcoesMovimentacaoDeLocacao }),
  Object.assign(rotas.medicaoDeLocacao, { component: BaseOpcoesMovimentacaoDeLocacao }),
  Object.assign(rotas.controleDeModelosDeProposta, { component: ControleDeModelosDeProposta }),
  Object.assign(rotas.modeloPropostaLocacao, { component: ModeloPropostaLocacao }),
  Object.assign(rotas.edicaoDeModeloPropostaLocacao, { component: ModeloPropostaLocacao }),
  Object.assign(rotas.geracaoDePropostaDeLocacao, { component: GeracaoDePropostaDeLocacao }),
  Object.assign(rotas.edicaoDePropostaDeLocacao, { component: GeracaoDePropostaDeLocacao }),  
  Object.assign(rotas.geracaoDeAditivoDeProposta, { component: GeracaoDePropostaDeLocacao }),
  Object.assign(rotas.controleDeAdicionaisPersonalizados, { component: ControleDeAdicionaisPersonalizados }),
  Object.assign(rotas.configuracaoControleLocacao, { component: ConfiguracaoControleLocacao })
];