import { OPCOES_STORE_CONTROLE_LOCACAO } from './index';

export default {
  alterarFiltroPadraoPesquisaOrcamento (state, filtrosPadrao) {
      state.filtroPadraoPesquisaOrcamento = filtrosPadrao;      
      localStorage.setItem(OPCOES_STORE_CONTROLE_LOCACAO.STORAGE.FILTRO_PADRAO_PESQUISA_ORCAMENTO, JSON.stringify(filtrosPadrao))
  },
  
  alterarFiltroPadraoPesquisaGestao (state, filtrosPadrao) {
      state.filtroPadraoPesquisaGestao = filtrosPadrao;
      localStorage.setItem(OPCOES_STORE_CONTROLE_LOCACAO.STORAGE.FILTRO_PADRAO_PESQUISA_GESTAO, JSON.stringify(filtrosPadrao))
  },

  alterarFiltroPadraoPesquisaMovimentacao (state, filtrosPadrao) {
    state.filtroPadraoPesquisaMovimentacao = filtrosPadrao;
    localStorage.setItem(OPCOES_STORE_CONTROLE_LOCACAO.STORAGE.FILTRO_PADRAO_PESQUISA_MOVIMENTACAO, JSON.stringify(filtrosPadrao))
  }
}