'use strict';

import * as config from '../../../vue.enviroment.config';
import { ACESSOS_BIMER_UP } from '../geral/usuario/sistema-acesso-constants.js';

const caminhoBase = config.V3UrlBase + 'estoque/';
const caminhoBaseRequisitante = caminhoBase + 'requisitante/';
const caminhoBaseControleDeEstoque = caminhoBase + 'controle-de-estoque/';

const ROTAS_ESTOQUE_METADATA = 
{
  controleDeEstoqueDocumentos: {
    name: 'SelecaoDocumentos',
    title: 'Seleção de documentos',
    icon: 'mdi-dolly',
    path: caminhoBaseControleDeEstoque + 'documento',
    grupo: 'Controle de estoque',
    familia: 'Estoque',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.ESTOQUE.SELF // Temporário, até que possam ser criados os acessos
  },
  controleDeEstoqueSeparacao: {
    name: 'Separacao',
    title: 'Separação',
    icon: 'mdi-dolly',
    path: caminhoBaseControleDeEstoque + 'separacao/:identificador',
    grupo: 'Controle de estoque',
    familia: 'Estoque',
    help: config.help,
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.ESTOQUE.SELF // Temporário, até que possam ser criados os acessos
  },
  controleDeEstoqueConferencia: {
    name: 'Conferencia',
    title: 'Conferência',
    icon: 'mdi-dolly',
    path: caminhoBaseControleDeEstoque + 'conferencia/:identificador',
    grupo: 'Controle de estoque',
    familia: 'Estoque',
    help: config.help,
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.ESTOQUE.SELF // Temporário, até que possam ser criados os acessos
  },
  dashboardEstoque: {
    name: 'DashboardEstoque',
    title: 'Dashboard',
    icon: 'mdi-account',
    path: caminhoBaseRequisitante + 'dashboard',
    familia: 'Estoque',
    grupo: 'Requisitante',
    help: config.help,
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'requisicoes/dashboard');
    },
  },
  novaRequisição: {
    path: caminhoBaseRequisitante + 'nova-requisicao',
    name: 'NovaRequisicao',
    title: 'Nova requisição',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Requisitante',
    familia: 'Estoque',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'requisicoes/nova-requisicao');
    },
  },
  consultaDeMinhasRequisicoes: {
    path: caminhoBaseRequisitante + 'consulta-requisicao',
    name: 'ConsultaDeMinhasRequisicoes',
    title: 'Minhas requisições',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Requisitante',
    familia: 'Estoque',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'requisicoes/minhas-requisicoes');
    },
  }
};


export { 
  ROTAS_ESTOQUE_METADATA
};