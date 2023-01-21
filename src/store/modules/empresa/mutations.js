export const EMPRESA_MUTATIONS = {
  ALTERAR_EMPRESA_ATUAL: "alterarEmpresaAtual",
  ALTERAR_LISTA_EMPRESAS: "alterarListaEmpresas",
  ALTERAR_SETORES_EMPRESA_ATUAL: "alterarSetoresEmpresaAtual"
}

export default {
  alterarEmpresaAtual (state, empresaPromise) {
    state.empresaAtual = empresaPromise
  },

  alterarListaEmpresas  (state, empresasPromise) {
    state.listaEmpresas = empresasPromise;
  },

  alterarSetoresEmpresaAtual (state, setoresPromise) {
    state.setoresEmpresaAtual = setoresPromise;
  },
}
