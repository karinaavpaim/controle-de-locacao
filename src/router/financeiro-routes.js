import { ROTAS_FINANCEIRO_METADATA } from '@/constants/router/financeiro-router-constants.js';

import DespesasDeViagemAgrupadasPorPessoa from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import DespesasDeViagemIndividuais from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import NovaSolicitacaoDeAdiantamento from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import SolicitacoesDeAdiantamento from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import PrestarContas from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import ConsultarPrestacoesDeContas from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import SaldoDeFuncionarios from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import Extrato from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';

let rotas = ROTAS_FINANCEIRO_METADATA;

export default [
  Object.assign(rotas.despesasDeViagemAgrupadasPorPessoa, {component: DespesasDeViagemAgrupadasPorPessoa}),
  Object.assign(rotas.despesasDeViagemIndividuais, {component: DespesasDeViagemIndividuais}),
  Object.assign(rotas.novaSolicitaçãoDeAdiantamento, {component: NovaSolicitacaoDeAdiantamento}),
  Object.assign(rotas.solicitaçõesDeAdiantamento, {component: SolicitacoesDeAdiantamento}),
  Object.assign(rotas.prestarContas, {component: PrestarContas}),
  Object.assign(rotas.consultarPrestacaesDeContas, {component: ConsultarPrestacoesDeContas}),
  Object.assign(rotas.saldoDeFuncionarios, {component: SaldoDeFuncionarios}),
  Object.assign(rotas.extrato, {component: Extrato})
];