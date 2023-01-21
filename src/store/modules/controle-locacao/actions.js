import FiltrosPesquisaOrcamentoModel from "@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model";

export default {
    alterarFiltroPadraoPesquisaOrcamento ({ commit }, filtroPadrao) {
      commit('alterarFiltroPadraoPesquisaOrcamento',  new FiltrosPesquisaOrcamentoModel(filtroPadrao));
    },

    alterarFiltroPadraoPesquisaGestao ({ commit }, filtroPadrao) {
      commit('alterarFiltroPadraoPesquisaGestao',  new FiltrosPesquisaOrcamentoModel(filtroPadrao));
    },

    alterarFiltroPadraoPesquisaMovimentacao ({ commit }, filtroPadrao) {
      commit('alterarFiltroPadraoPesquisaMovimentacao',  new FiltrosPesquisaOrcamentoModel(filtroPadrao));
    },
  
}
  