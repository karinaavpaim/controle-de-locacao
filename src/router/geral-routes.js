import { ROTAS_GERAL_METADATA } from '@/constants/router/geral-router-constants.js';

import agenda from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import cenarios from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import estatisticasDoSistema from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import autorizador from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import expert from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';

let rotas = ROTAS_GERAL_METADATA;

export default [
  Object.assign(rotas.agenda, { component: agenda}),
  Object.assign(rotas.cenarios, { component: cenarios}),
  Object.assign(rotas.estatisticasDoSistema, { component: estatisticasDoSistema}),
  Object.assign(rotas.autorizadorGerencial, { component: autorizador}),
  Object.assign(rotas.expert, { component: expert })
];