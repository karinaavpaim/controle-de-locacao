import { CONFIGURACOES_MUTATIONS } from "./mutations";
import configuracoesPaginaStoreApi from "@/api/storage/configuracoes-pagina-storage-api";
/*
 * ATENCAO - SEMPRE PROTEGER A REFERENCIA DO STATE PASSANDO UM > NEW MODEL
 * ONDE OS DADOS NAO VIEREM DE API
 */

export default {
  alterarConfiguracoesGerais ({ commit }, configuracoesPromise) {
    if(configuracoesPromise.constructor.name !== "Promise")
      throw "As configurações devem ser armazenadas como Promise";

    commit(CONFIGURACOES_MUTATIONS.ALTERAR_CONFIGURACOES_GERAIS, configuracoesPromise);
  },

  alterarConfiguracoesPagina ({ commit }, configuracoesPaginaPromise) {
    if(configuracoesPaginaPromise.constructor.name !== "Promise")
      throw "As configurações devem ser armazenadas como Promise";

    configuracoesPaginaPromise.then(filtros=>{
      configuracoesPaginaStoreApi.armazenarFiltros(filtros)
      commit(CONFIGURACOES_MUTATIONS.ALTERAR_CONFIGURACOES_PAGINA, configuracoesPaginaStoreApi.obterFiltros());
    });
  },

  alterarConfiguracoesEmpresaAtual ({ commit }, configuracoesPromise) {
    if(configuracoesPromise.constructor.name !== "Promise")
      throw "As configurações devem ser armazenadas como Promise";

    commit(CONFIGURACOES_MUTATIONS.ALTERAR_CONFIGURACOES_EMPRESA_ATUAL, configuracoesPromise);
  },
}
