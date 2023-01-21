'use strict';

import Vue from 'vue';
import Router from 'vue-router';
import minhasRotas from './routes';
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants";
import { ROTAS_ESTOQUE_METADATA } from '@/constants/router/estoque-router-constants';
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants'
import store from "@/store";
import { OPCOES_STORE_ACESSOS } from "@/store/modules/acessos";

Vue.use(Router);

const routes = [...(minhasRotas.paths)];
const router = new Router({ routes: routes, mode: 'history' });

router.beforeEach((to, _, next) => {
  store.getters[OPCOES_STORE_ACESSOS.GETTERS.ACESSOS].then(acessos => {
    var rotasDisponiveis = Object.assign(ROTAS_ESTOQUE_METADATA, ROTAS_FATURAMENTO_METADATA);
    var rota = Object.values(rotasDisponiveis).find(rota => rota.name == to.name);
    var acesso = rota && Array.isArray(acessos)
      && acessos.find(a => a.identificador == rota.acesso);

    if (!acesso || (acesso.tipo != TIPOS_ACESSO_SISTEMA.HABILITADO)) {
      next(false);
      return;
    }

    next();
  }).catch(()=>next(false));
});

export default router;