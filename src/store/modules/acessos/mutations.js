export const ACESSOS_MUTATIONS = {
  ALTERAR_ACESSOS: "alterarAcessos",
}

export default {
  alterarAcessos (state, acessosPromise) {
    state.acessos = acessosPromise
  }
}
