import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import empresaAPI from "@/api/sistemas-gerais/empresa-api.js";

export const OPCOES_STORE_EMPRESA = {
  ACTIONS: {
    ALTERAR_EMPRESA_ATUAL: 'empresa/alterarEmpresaAtual',
    ALTERAR_LISTA_EMPRESAS: 'empresa/alterarListaEmpresas',
    ALTERAR_SETORES_EMPRESA_ATUAL: 'empresa/alterarSetoresEmpresaAtual'
  },
  GETTERS: {
    EMPRESA_ATUAL: "empresa/empresaAtual",
    LISTA_EMPRESAS: "empresa/listaEmpresas",
    EMPRESA_PADRAO: "empresa/empresaPadrao",
    SETORES_EMPRESA_ATUAL: "empresa/setoresEmpresaAtual"
  }
}

export default {
  state: {
    empresaAtual: new Promise((resolve)=>resolve()),
    listaEmpresas: empresaAPI.localizarEmpresa(""),
    setoresEmpresaAtual: new Promise((resolve)=>resolve([]))
  },
  actions,
  getters,
  mutations,
  namespaced: true
}
