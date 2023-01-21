import { ROTAS_SISTEMA_METADATA } from '@/constants/router/sistema-router-constants.js';

import login from '@/components/autenticacao/Login.vue';

let rotas = ROTAS_SISTEMA_METADATA;

export default [
  Object.assign(rotas.login, { component: login})
];