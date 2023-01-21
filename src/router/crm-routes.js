import { ROTAS_CRM_METADATA } from '@/constants/router/crm-router-constants.js';
import DashboardContatoDeVenda from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';

let rotas = ROTAS_CRM_METADATA;

export default [
  Object.assign(rotas.dashboardContatoDeVenda, {component: DashboardContatoDeVenda}),
  Object.assign(rotas.consultaDeContatosDeVenda, {component: DashboardContatoDeVenda}),
  Object.assign(rotas.consultaDeAtendimentos, {component: DashboardContatoDeVenda})
];