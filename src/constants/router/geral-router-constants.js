'use strict';

import * as config from '../../../vue.enviroment.config';

const caminhoBase = config.V3UrlBase + 'geral/';

const ROTAS_GERAL_METADATA = 
{
  agenda: {
    path: caminhoBase + 'agenda',
    name: 'Agenda',
    title: 'Agenda',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Geral',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'agenda');
    }
  },
  cenarios: {
    path: caminhoBase + 'cenarios',
    name: 'Cenarios',
    title: 'Cenários',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Geral',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'cenarios');
    }
  },
  estatisticasDoSistema: {
    path: caminhoBase + 'estatisticas-do-sistema',
    name: 'EstatisticasDoSistema',
    title: 'Estatísticas do sistema',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Geral',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'estatisticaSistema');
    }
  },
  autorizadorGerencial: {
    path: caminhoBase + 'autorizador',
    name: 'AutorizadorGerencial',
    title: 'Autorizador gerencial',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Geral',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'autorizacao');
    }
  },
  expert: {
    path: caminhoBase + 'expert',
    name: 'Expert',
    title: 'Expert',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Geral',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'expert');
    }
  }
};

export { 
  ROTAS_GERAL_METADATA
};