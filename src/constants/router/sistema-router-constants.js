'use strict';

import * as config from '../../../vue.enviroment.config';

const caminhoBase = config.V3UrlBase;

const ROTAS_SISTEMA_METADATA = 
{
  login: {
    path: caminhoBase + 'login',
    name: 'Login',
    title: 'Login',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Sistema',
    naoExibir: true,
  },
  nao_encontrado: {
    path: caminhoBase + 'pagina-nao-encontrada',
    name: 'NaoEncontrado',
    title: 'Página não encontrada',
    icon: 'mdi-clock',
    help: config.help,
    familia: 'Sistema',
    naoExibir: true,
  },
};


export { 
  ROTAS_SISTEMA_METADATA
};