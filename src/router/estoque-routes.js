import { ROTAS_ESTOQUE_METADATA } from '@/constants/router/estoque-router-constants.js';

// import SelecaoDocumentos from '@/components/estoque/controle-de-estoque/SelecaoDocumentos.vue';
// import Separacao from '@/components/estoque/controle-de-estoque/separacao/Separacao.vue';
// import Conferencia from '@/components/estoque/controle-de-estoque/conferencia/Conferencia.vue';
import DashboardRequisitante from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import NovaRequisicao from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import ConsultaRequisicao from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';

let rotas = ROTAS_ESTOQUE_METADATA;

export default [
  // Object.assign(rotas.controleDeEstoqueDocumentos, { component: SelecaoDocumentos }),
  // Object.assign(rotas.controleDeEstoqueSeparacao, { component: Separacao }),
  // Object.assign(rotas.controleDeEstoqueConferencia, { component: Conferencia }),
  Object.assign(rotas.dashboardEstoque, { component: DashboardRequisitante }),
  Object.assign(rotas.novaRequisição, { component: NovaRequisicao }),
  Object.assign(rotas.consultaDeMinhasRequisicoes, { component: ConsultaRequisicao }),
];