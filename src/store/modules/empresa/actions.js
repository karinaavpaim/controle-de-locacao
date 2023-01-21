import EmpresaModel from "@/models/geral/empresa-model";
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import apiEmpresa from "@/api/sistemas-gerais/empresa-api";
import apiConfiguracaoLocacao from "@/api/faturamento/controle-de-locacao/configuracao-locacao-api";
import { EMPRESA_MUTATIONS } from "./mutations";
/*
 * ATENCAO - SEMPRE PROTEGER A REFERENCIA DO STATE PASSANDO UM > NEW MODEL
 * ONDE OS DADOS NAO VIEREM DE API
 */

function checarTipoEntrada(entrada){
  if(entrada.constructor.name !== "Promise")
      throw "Os dados devem ser armazenadas como Promise";
}

export default {
  /*
  * @TODO Alterar a empresa atual faz com que precisamos pegar as configuracoes e setores novmente
  * Quando tivermos o controle por login ou algo que faca o localStorage ser limpo, armazenar estes dados em cache para evitar diversas requisicoes
  */
  alterarEmpresaAtual ({ commit }, empresaPromise) {
    checarTipoEntrada(empresaPromise);
      //altero a empresa atual
      commit(EMPRESA_MUTATIONS.ALTERAR_EMPRESA_ATUAL, new Promise(async (resolve, reject)=>{
        try{
          resolve(new EmpresaModel(await empresaPromise))
        }
        catch(e){reject(e)}
      }));

      // alterar configuracoes empresa atual
      commit(OPCOES_STORE_CONFIGURACOES.ACTIONS.ALTERAR_CONFIGURACOES_EMPRESA_ATUAL, new Promise(async (resolve, reject)=>{
        try{
          apiConfiguracaoLocacao.obterConfiguracaoLocacaoPeloIdentificadorEmpresa((await empresaPromise).identificador)
          .then(configuracoes => { resolve(configuracoes[0])})
          .catch(reject)
        }
        catch(e){reject(e)}
      }), {root:true})

      // e setores empresa atual
      commit(EMPRESA_MUTATIONS.ALTERAR_SETORES_EMPRESA_ATUAL, new Promise(async (resolve, reject)=>{
        try{
          apiEmpresa.localizarSetoresPorIdentificadorEmpresa((await empresaPromise).identificador)
          .then(setores => { resolve(setores)})
          .catch(reject)
        }
        catch(e){reject(e)}
      }))
  },

  alterarListaEmpresas ({ commit }, listaEmpresasPromise) {
    checarTipoEntrada(listaEmpresasPromise);
    commit(EMPRESA_MUTATIONS.ALTERAR_LISTA_EMPRESAS, listaEmpresasPromise);
  },

  alterarSetoresEmpresaAtual ({ commit }, setoresPromise) {
    checarTipoEntrada(setoresPromise);
    commit(EMPRESA_MUTATIONS.ALTERAR_SETORES_EMPRESA_ATUAL, setoresPromise);
  },
}
