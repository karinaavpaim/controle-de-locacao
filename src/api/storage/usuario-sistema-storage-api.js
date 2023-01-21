"use strict"
import UsuarioLogin from "@/models/sistema/usuario-login";

function obterUsuarioDoLocalStorage() {
  return localStorage.getItem('usuario');
}

function obterUsuarioLogado() {
  let encodedUser = obterUsuarioDoLocalStorage();
  if (!encodedUser || encodedUser === 'null') {
    return;
  }
  let usuario = JSON.parse(atob(encodedUser));
  if ( usuario.valores[0].valor.Senha === null || usuario.valores[0].valor.Senha === 'null') {
      return;
  }
  return usuario;
}

function obterDadosDoUsuarioLogado() {
  let usuario = this.obterUsuarioLogado();
  let dados = (usuario && Array.isArray(usuario.valores) && usuario.valores[0] && usuario.valores[0].valor) || {};
  return new UsuarioLogin(dados);
}

export default {
  obterUsuarioLogado,
  obterDadosDoUsuarioLogado
}