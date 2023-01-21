'use strict';

import axiosConfig from '@/api/axios-config.js';
import CredenciaisModel from '@/models/sistema/credenciais-model';

const camposCredenciais = `login, token`;
const CHAVE_STORAGE = 'usuario';

function autenticar(credenciais) {
  var mutation = `mutation($credenciais:CredenciaisInput){
      dados:autenticar(credenciais:$credenciais){${camposCredenciais}}
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { credenciais: credenciais };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados', CredenciaisModel);
}

function estaAutenticado() {
  let token = recuperarTokenDeAutenticacaoDaStorage();
  return !!token;
}

function gravarTokenAutenticacaoNaStorage(credenciais) {
  return localStorage.setItem(CHAVE_STORAGE, credenciais.token);
}

function recuperarTokenDeAutenticacaoDaStorage() {
  return localStorage.getItem(CHAVE_STORAGE);
}

function excluirTokenDeAutenticacaoDaStorage() {
  return localStorage.removeItem(CHAVE_STORAGE);
}

export default {
  autenticar,
  gravarTokenAutenticacaoNaStorage,
  estaAutenticado,
  recuperarTokenDeAutenticacaoDaStorage,
  excluirTokenDeAutenticacaoDaStorage
};