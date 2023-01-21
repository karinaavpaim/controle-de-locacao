import mutations from './mutations';
import actions from './actions';
import getters from './getters';
/*
* @TODO Rever este arquivo.
* Descobrir por que tem um objeto orcamento que nao carrega o modelo
* Passar os acessos no storage para src/api/storage e remover estes metodos que acessam a storage
*/
export const OPCOES_STORE_CONTROLE_LOCACAO = {
    ACTIONS: {
      ALTERAR_FILTRO_PADRAO_PESQUISA_ORCAMENTO: 'controleDeLocacao/alterarFiltroPadraoPesquisaOrcamento',
      ALTERAR_FILTRO_PADRAO_PESQUISA_GESTAO: 'controleDeLocacao/alterarFiltroPadraoPesquisaGestao',
      ALTERAR_FILTRO_PADRAO_PESQUISA_MOVIMENTACAO: 'controleDeLocacao/alterarFiltroPadraoPesquisaMovimentacao',
    },
    GETTERS: {
      FILTRO_PADRAO_PESQUISA_ORCAMENTO: 'controleDeLocacao/filtroPadraoPesquisaOrcamento',
      FILTRO_PADRAO_PESQUISA_GESTAO: 'controleDeLocacao/filtroPadraoPesquisaGestao',
      FILTRO_PADRAO_PESQUISA_MOVIMENTACAO: 'controleDeLocacao/filtroPadraoPesquisaMovimentacao',
    },
    STORAGE:{
      FILTRO_PADRAO_PESQUISA_ORCAMENTO: 'filtroPadraoPesquisaOrcamento',
      FILTRO_PADRAO_PESQUISA_GESTAO: 'filtroPadraoPesquisaGestao',
      FILTRO_PADRAO_PESQUISA_MOVIMENTACAO: 'filtroPadraoPesquisaMovimentacao'
    }
}

function obterFiltroPadraoOrcamento(){
  var filtros = localStorage.getItem(OPCOES_STORE_CONTROLE_LOCACAO.STORAGE.FILTRO_PADRAO_PESQUISA_ORCAMENTO);
  return (filtros != null) ? JSON.parse(filtros) : undefined
}

function obterFiltroPadraoGestao(){
  var filtros = localStorage.getItem(OPCOES_STORE_CONTROLE_LOCACAO.STORAGE.FILTRO_PADRAO_PESQUISA_GESTAO);
  return (filtros != null) ? JSON.parse(filtros) : undefined
}

function obterFiltroPadraoMovimentacao(){
  var filtros = localStorage.getItem(OPCOES_STORE_CONTROLE_LOCACAO.STORAGE.FILTRO_PADRAO_PESQUISA_MOVIMENTACAO);
  return (filtros != null) ? JSON.parse(filtros) : undefined
}

export default {
    state: {
      filtroPadraoPesquisaOrcamento: obterFiltroPadraoOrcamento(), 
      filtroPadraoPesquisaGestao: obterFiltroPadraoGestao(),
      filtroPadraoPesquisaMovimentacao: obterFiltroPadraoMovimentacao(),
      orcamento: {
        informacoesIniciais: {
          cliente: {
            identificador: "",
            codigo: "",
            nome: "",
            codigoNome:""
          }
        },
      },
      empresaAtual:{
        identificador: '',
        codigo: '', 
        nome:''
      }
    },

    actions,
    getters,
    mutations,
    namespaced: true
}