
import FiltrosPesquisaOrcamentoModel from "@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model"

export default {
    filtroPadraoPesquisaOrcamento(state) {
        return new FiltrosPesquisaOrcamentoModel(state.filtroPadraoPesquisaOrcamento)
    },

    filtroPadraoPesquisaGestao(state) {
        return new FiltrosPesquisaOrcamentoModel(state.filtroPadraoPesquisaGestao)
    },

    filtroPadraoPesquisaMovimentacao(state) {
        return new FiltrosPesquisaOrcamentoModel(state.filtroPadraoPesquisaMovimentacao)
    },
  }
  