import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import configuracaoApi from "@/api/faturamento/controle-de-locacao/configuracao-locacao-api";
import configuracoesPaginaStoreApi from "@/api/storage/configuracoes-pagina-storage-api";

export const OPCOES_STORE_CONFIGURACOES = {
  ACTIONS: {
    ALTERAR_CONFIGURACOES_GERAIS: 'configuracoes/alterarConfiguracoesGerais',
    ALTERAR_CONFIGURACOES_PAGINA: 'configuracoes/alterarConfiguracoesPagina',
    ALTERAR_CONFIGURACOES_EMPRESA_ATUAL: `configuracoes/alterarConfiguracoesEmpresaAtual`
  },
  GETTERS: {
    CONFIGURACOES_GERAIS: `configuracoes/configuracoesGerais`,
    CONFIGURACOES_PAGINA: `configuracoes/configuracoesPagina`,
    CONFIGURACOES_EMPRESA_ATUAL: `configuracoes/configuracoesEmpresaAtual`
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
    configuracoesGerais: configuracaoApi.obterConfiguracaoLocacaoPeloIdentificadorEmpresa(0), // readonly
    configuracoesEmpresaAtual: new Promise((resolve)=>resolve()),
    configuracoesPagina: configuracoesPaginaStoreApi.obterFiltros()
  },
  actions,
  getters,
  mutations,
  namespaced: true
}
