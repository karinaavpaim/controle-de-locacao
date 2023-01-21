export const CONFIGURACOES_MUTATIONS = {
  ALTERAR_CONFIGURACOES_GERAIS: "alterarConfiguracoesGerais",
  ALTERAR_CONFIGURACOES_PAGINA: "alterarConfiguracoesPagina",
  ALTERAR_CONFIGURACOES_EMPRESA_ATUAL: "alterarConfiguracoesEmpresaAtual"
}

export default {
  alterarConfiguracoesGerais (state, configuracoesPromise) {
    state.configuracoesGerais = configuracoesPromise
  },

  alterarConfiguracoesPagina (state, configuracoesPaginaPromise) {
    state.configuracoesPagina = configuracoesPaginaPromise
  },

  alterarConfiguracoesEmpresaAtual (state, configuracoesPromise) {
    state.configuracoesEmpresaAtual = configuracoesPromise
  }
}
