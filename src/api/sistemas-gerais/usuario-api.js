'use strict';

import SistemaAcesso from '@/models/geral/usuario/sistema-acesso-model';
import axiosConfig from '@/api/axios-config.js';

function obterAcessosDoUsuarioAutenticado() {
  let query = `{
    dados: acessosUsuarioAutenticadoParaOBimerUp{
      identificador,
      tipo
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, "dados", SistemaAcesso);
}

export default {
  obterAcessosDoUsuarioAutenticado
};