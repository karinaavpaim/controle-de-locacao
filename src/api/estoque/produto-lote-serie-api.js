'use strict';

import axiosConfig from '@/api/axios-config.js';
import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';

async function obterLotesSeriesDoProdutoParaSeparacao(identificadorProduto, identificadorSetor) {
  if ((!identificadorProduto) || (identificadorProduto == ''))
    return Promise.resolve([]);

  identificadorSetor = identificadorSetor || "";
  let query = `{
    dados: produtoLoteSerieParaSeparacao(
        identificadorProduto:"${identificadorProduto}",
        identificadorSetor:"${identificadorSetor}"){
        identificador,
        codigo,
        dataValidade,
        observacao,
        quantidadeDisponivel,
        tipo
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', ProdutoLoteSerieModel);
}

export default {
    obterLotesSeriesDoProdutoParaSeparacao
};