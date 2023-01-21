'use strict'

import { CHAVE_STORAGE_CONFIGURACOES_PAGINA } from "@/constants/sistema/storage/configuracoes-pagina-constants"
import usuarioSistemaApi from "@/api/storage/usuario-sistema-storage-api"
import ConfiguracoesPaginaModel from "@/models/sistema/storage/configuracoes-pagina-model";

const USUARIO_SISTEMA = usuarioSistemaApi.obterDadosDoUsuarioLogado() || {};
//  A chave do array eh o identificador do usuario (para termos filtros por usuario)
const CHAVE_FILTRO_USUARIO = (USUARIO_SISTEMA.identificador||"")+(USUARIO_SISTEMA.identificadorFuncionario||"");

function armazenarFiltros(filtros){
  /*
  * Salvo o filtro fazendo merge no filtro existente.
  */
 let filtrosStorage = obterBinariosDaStorage();
  filtrosStorage[CHAVE_FILTRO_USUARIO] = new ConfiguracoesPaginaModel(Object.assign(filtrosStorage[CHAVE_FILTRO_USUARIO] || {}, filtros));
  return Promise.resolve(salvarBinariosNaStorage(filtrosStorage));
}

function obterFiltros(){
  let filtrosStorage = obterBinariosDaStorage();
  return Promise.resolve(new ConfiguracoesPaginaModel(filtrosStorage[CHAVE_FILTRO_USUARIO]));
}

function salvarBinariosNaStorage(filtrosStorage){
  return localStorage.setItem(CHAVE_STORAGE_CONFIGURACOES_PAGINA, btoa(JSON.stringify(filtrosStorage)));
}

function obterBinariosDaStorage(){
  let filtrosStorage = localStorage.getItem(CHAVE_STORAGE_CONFIGURACOES_PAGINA);
  return  (filtrosStorage && JSON.parse(atob(filtrosStorage))) || {};
}

export default { armazenarFiltros, obterFiltros }