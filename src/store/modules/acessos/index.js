import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import apiUsuario from '@/api/sistemas-gerais/usuario-api';

export const OPCOES_STORE_ACESSOS = {
  ACTIONS: {
    ALTERAR_ACESSOS: 'acessos/alterarAcessos',
  },
  GETTERS: {
    ACESSOS: `acessos/acessosUsuarioAutenticado`,
  }
}

/*
*=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-= ATENCAO =-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=
* O tipo de entrada e armazenamento das configurações foi alterado para promise
* pois estas configuracoes precisam estar disponiveis para quem requisitar.
* sendo assim, ao preencher as configs será passada uma promise.
*/

export default {
  state: {
    acessos: apiUsuario.obterAcessosDoUsuarioAutenticado(), // readonly
  },
  actions,
  getters,
  mutations,
  namespaced: true
}
