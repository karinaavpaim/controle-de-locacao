import Vue from "vue";
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants';
import { OPCOES_STORE_ACESSOS } from '@/store/modules/acessos';

async function metodoAplicarAcesso(el, binding, vnode) {
  if (!binding.value)
    return;

  let acesso;
  try {
    acesso = (await vnode.context.$store.getters[OPCOES_STORE_ACESSOS.GETTERS.ACESSOS]).find(
      a => a.identificador == binding.value);
  } catch {
    acesso = undefined;
  }

  if (!acesso || (acesso.tipo == TIPOS_ACESSO_SISTEMA.DESABILITADO)) {
    /*
      O 'silent' é necessário pois estamos manipulando a prop do componente do vuetify.
      ATENÇÃO: Caso o componente possua bind para a prop 'disabled' e seu valor
      seja manipulado externamente, o valor atribuído aqui será SOBRESCRITO.
      Atualmente não temos esta situação no projeto, mas se atentar à esses casos futuramente.
      Não manipulamos apenas o DOM aqui pois o vuetify não é notificado que o elemento foi
      desabilitado e não aplica as classes necessárias visualmente.
    */
    if (el.__vue__) {
      let silent = Vue.config.silent; // em produção, o 'silent' fica 'true' por padrao.
      Vue.config.silent = true;
      vnode.context.$set(el.__vue__._props, 'disabled', true);
      Vue.config.silent = silent;
    }
    return;
  }

  if (acesso.tipo == TIPOS_ACESSO_SISTEMA.ESCONDIDO) {
    if (elementoEstaEmUmMenu(el)) {
      el.style.display = 'none'; // remove o espaço alocado ao elemento
    } else {
      el.style.visibility = 'hidden'; // mantém o espaço alocado ao elemento
    }
  }
}

function elementoEstaEmUmMenu(el) {
  return ((el.__vue__ && el.__vue__.isInMenu)
    || (el.__vue__&& el.__vue__.$el && (el.__vue__.$el.className || '').includes('v-list-item'))
    || (el.__vue__&& el.__vue__.$el && (el.__vue__.$el.className || '').includes('v-tab'))
    || (el.__vue__ && el.__vue__.$parent && el.__vue__.$parent.$el
      && (el.__vue__.$parent.$el.className || '').includes('v-menu')));
}

export default {
  bind: metodoAplicarAcesso,
  update: metodoAplicarAcesso
}