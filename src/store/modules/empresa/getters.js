import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import EmpresaModel from "@/models/geral/empresa-model"
/*
* Sempre retorno uma nova promise para evitar problemas com referencia
*/
export default {
  empresaAtual (state) {
    return new Promise((resolve, reject)=>state
      .empresaAtual
      .then((empresa)=>{
        resolve(empresa && new EmpresaModel(empresa))
      })
      .catch(reject))
  },
  
  listaEmpresas (state) {
    return new Promise(
      (resolve, reject)=>state
        .listaEmpresas
        .then((lista)=>resolve(lista.map((empresa)=>new EmpresaModel(empresa))))
        .catch(reject)
    );
  },
  
  empresaPadrao (state, getters, rootState, rootGetters)  {
    return new Promise((resolve, reject)=>{
      rootGetters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_GERAIS]
      .then((configs)=>{
        state.listaEmpresas
        .then((empresas)=>{
          let empresaPadrao = configs.secaoGeral.codigoEmpresaPadraoBimer && 
          empresas.find(item=>item.codigo && parseInt(item.codigo) === configs.secaoGeral.codigoEmpresaPadraoBimer);
          resolve(empresaPadrao && new EmpresaModel(empresaPadrao));
        })
        .catch(reject)
      })
      .catch(reject)
    });
  },
  
  setoresEmpresaAtual (state) {
    return new Promise((resolve, reject)=>state
      .setoresEmpresaAtual
      .then(setores=>resolve(setores))
      .catch(reject))
  },
}
