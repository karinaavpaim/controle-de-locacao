'use strict';
import axios from 'axios';
import AutenticacaoApi from '@/api/sistema/autenticacao-api';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import * as env from "../../vue.enviroment.config";
import { ROTAS_SISTEMA_METADATA } from '@/constants/router/sistema-router-constants';
const host = 'WIN-DSE-HMLCRT2';
const porta = '4000';
const base = process.env.NODE_ENV === 'production' ? '/graphql' : `http://${host}:${porta}`;

axios.defaults.headers.common['Accept'] = '*/*';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = base;
axios.defaults.headers.common['Modulo'] = 'OTk5OTk5OTk5OQ==';

axios.interceptors.request.use(config => {
  let usuario = env.obterUsuarioLogado();

   if (usuario) {
    config.headers.common['Autorizacao'] = `Basic ${_retornarToken(usuario)}`;
  }

  return config 
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    let mensagem = (error.response && error.response.status) ||
      (error.message == 'Network Error' && 'Servidor inacessível.') ||
      "-1" + ": Houve um erro interno na aplicação."
    return Promise.reject([{ message: mensagem }]);
  }
);

function _retornarToken(usuario){
  return btoa(usuario.valores[0].valor.NomeLogin + ":" + usuario.valores[0].valor.Senha)
}

function assinarNotificacoesGraphQL(query, callback) {
  let token = AutenticacaoApi.recuperarTokenDeAutenticacaoDaStorage();
  var parametrosDaConexao = (token && {
    Autorizacao: `Basic ${token}`,
    Modulo: axios.defaults.headers.common['Modulo']
  }) || {};

  var urlBase = (process.env.NODE_ENV === 'production')
    ? `${window.location.host}/graphql`
    : `${host}:${porta}`;
  var cliente = new SubscriptionClient(`ws://${urlBase}/notificacoes`, { connectionParams: parametrosDaConexao, reconnect: true });
  const inscricao = cliente.request({ query: query }).subscribe({ next: ({ data }) => callback(data) });

  return inscricao;
}

function executarQueryGraphQL(query, nomeAtributoDeResposta, modelo) {
  return new Promise((resolve, reject) => {
    axios.get(`/api?query=${query}`)
      .then(
        (response) => resolverRespostaComReject(response, reject, nomeAtributoDeResposta),
      ).then(
        //pelo bem da sanidade e stacktrace, chain promises \o/
        (response) => modelo ? resolve(response.map(obj => new modelo(obj))) : resolve(response)
      ).catch(
        (error) => reject(Array.isArray(error) ? error.map(e => e.message).join() : error.message)
      );
  });
}

function executarMutationGraphQL(mutation, variaveis, nomeAtributoDeResposta, modelo) {
  var dados = {
    query: mutation,
    variables: variaveis
  };

  return new Promise((resolve, reject) => {
    axios.post("/api", dados)
      .then(response => {
        let data = resolverRespostaComReject(response, reject, nomeAtributoDeResposta)
        return modelo ? resolve(data.map(obj => new modelo(obj))) : resolve(data)
      })
      .catch(
        (error) => reject(Array.isArray(error) ? error.map(e => e.message).join() : error.message)
      );
  });
}

function resolverRespostaComReject(response, reject, nomeAtributoDeResposta) {
  if (response.data.errors && response.data.errors.length > 0) {

    //TODO: AGUARDANDO O GRAPHQL
    if (response.data.errors[0].statusCode) {
      //Switch case pois vamos tratar mais status no futuro
      switch (response.data.errors[0].statusCode) {
        case 403:
          //TODO: Alterar para abrir uma nova janela ao inves de fazer redirect
          // Assim o cliente nao perde o que esta fazendo caso o token 
          AutenticacaoApi.excluirTokenDeAutenticacaoDaStorage();
          //TODO: Procurar utilizar o router do vue. A instancia dele aqui dentro esta gerando erros.
          window.location = ROTAS_SISTEMA_METADATA.login.path;
          break;
      }
    }

    return reject(response.data.errors);
  }

  return resolverResposta(response, nomeAtributoDeResposta);
}

function resolverResposta(response, nomeAtributoDeResposta) {
  var resposta = (nomeAtributoDeResposta)
    ? response.data && response.data.data && response.data.data[nomeAtributoDeResposta]
    : response.data;

  return resposta;
}

export default {
  assinarNotificacoesGraphQL,
  executarQueryGraphQL,
  executarMutationGraphQL
};