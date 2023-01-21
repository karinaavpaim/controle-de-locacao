import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import UsuarioLogin from '@/models/sistema/usuario-login';

export const OPCOES_STORE_USUARIO = {
    ACTIONS: {
      ALTERAR_USUARIO_LOGADO: 'usuario/alterarUsuarioLogado',
    },
    GETTERS: {
      USUARIO_LOGADO: "usuario/usuarioLogado",
    }
}

export default {
    state: {
     usuario: new  UsuarioLogin()
    },
    actions,
    getters,
    mutations,
    namespaced: true
  }