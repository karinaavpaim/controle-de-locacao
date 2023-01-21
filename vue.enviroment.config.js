'use strict';
const UsuarioLogin = require('./src/models/sistema/usuario-login').default;

/*
* ATENCAO: ESTAS CONFIGURACOES ESTAO UTILIZANDO PACOTES E METODOS DO NODEJS E NAO DO JAVASCRIPT DO NAVEGADOR (os | process)
*/
const os = require('os');
/*global window */
const AMBIENTE_PRODUCAO = process.env.NODE_ENV === 'production';
const URL_BASE_SEM_PORTA = `http://${os.hostname()}`; //

const V1_PUBLICADO_BASE = '/';
const V1_LOCAL_BASE = `${URL_BASE_SEM_PORTA}:9000/`;

const V1_AUTENTICADO = 'aplicacao.html#/';
const V1_LOGIN = '#/';

const V2_PUBLICADO = '/v2/';
const V2_LOCAL =  `${URL_BASE_SEM_PORTA}:4200/`;

const V3_PUBLICADO = '/v3/';
const V3_LOCAL = '/';

const CRM_PUBLICADO = '/crm';
const CRM_LOCAL =  `${URL_BASE_SEM_PORTA}:3000/crm`;


/*
* @DEPRECATED Utilizar o metodo em api/storage/sistema/usuario-api
*/
function obterUsuarioDoLocalStorage() {
  return localStorage.getItem('usuario');
}

function redirecionarComAutenticacao(urlBase, itemMenu) {
  itemMenu += !AMBIENTE_PRODUCAO ? `?user=${obterUsuarioDoLocalStorage()}` : '';
  redirecionar(urlBase, itemMenu);
}

function redirecionar(urlBase, itemMenu) {
  window.location.href = urlBase + itemMenu;
  return '/redirecting';
}

function redirecionarParaAutenticacao() {
  window.location.href = (AMBIENTE_PRODUCAO ? V1_PUBLICADO_BASE : V1_LOCAL_BASE) + V1_LOGIN;
  return '/redirecting';
}

/*
* @DEPRECATED Utilizar o metodo em api/storage/sistema/usuario-api
*/
function obterUsuarioLogado() {
  let encodedUser = obterUsuarioDoLocalStorage();
  if (!encodedUser || encodedUser === 'null') {
   // redirecionarParaAutenticacao();
    return;
  }
  let usuario = JSON.parse(atob(encodedUser));
  if (//usuario.opcoes.dataExpiracao < new Date() ||
    usuario.valores[0].valor.Senha === null ||
    usuario.valores[0].valor.Senha === 'null') {
     // redirecionarParaAutenticacao();
      return;
  }
  return usuario;
}

/*
* @DEPRECATED Utilizar o metodo em api/storage/sistema/usuario-api
*/
function obterDadosDoUsuarioLogado() {
  let usuario = this.obterUsuarioLogado();
  let dados = (usuario && Array.isArray(usuario.valores) && usuario.valores[0] && usuario.valores[0].valor) || {};
  return new UsuarioLogin(dados);
}

module.exports = {
  V1UrlAutenticacao: (AMBIENTE_PRODUCAO ? V1_PUBLICADO_BASE : V1_LOCAL_BASE) + V1_LOGIN,
  V1UrlBase: (AMBIENTE_PRODUCAO ? V1_PUBLICADO_BASE : V1_LOCAL_BASE) + V1_AUTENTICADO,
  V2UrlBase: AMBIENTE_PRODUCAO ? V2_PUBLICADO : V2_LOCAL,
  V3UrlBase: AMBIENTE_PRODUCAO ? V3_PUBLICADO : V3_LOCAL,
  CRMUrlBase: AMBIENTE_PRODUCAO ? CRM_PUBLICADO : CRM_LOCAL,

  help: 'https://ajuda.alterdata.com.br/bw',

  redirecionar,
  redirecionarComAutenticacao,
  redirecionarParaAutenticacao,
  obterUsuarioLogado,
  obterDadosDoUsuarioLogado,
};