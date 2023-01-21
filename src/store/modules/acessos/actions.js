import { ACESSOS_MUTATIONS } from "./mutations";
/*
 * ATENCAO - SEMPRE PROTEGER A REFERENCIA DO STATE PASSANDO UM > NEW MODEL
 * ONDE OS DADOS NAO VIEREM DE API
 */

export default {
  alterarAcessos ({ commit }, acessosPromise) {
    if(acessosPromise.constructor.name !== "Promise")
      throw "Os acessos devem ser armazenadas como Promise";

    commit(ACESSOS_MUTATIONS.ALTERAR_ACESSOS, acessosPromise);
  }
}
