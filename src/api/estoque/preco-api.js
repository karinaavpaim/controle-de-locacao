'use strict';

import axiosConfig from '@/api/axios-config.js';
import PrecoTabelaModel from '@/models/estoque/produto/tabela-precos/preco-tabela-model';

function obterTodasAsTabelasDePreco() {
  let query = `{
    dados: preco {
      identificador,
      codigo,
      codigoNome,
      nome
    }
  }`.replace(/[\n]*[ ]*/gm, '');
  return axiosConfig.executarQueryGraphQL(query, 'dados', PrecoTabelaModel);
}


export default {
  obterTodasAsTabelasDePreco
};