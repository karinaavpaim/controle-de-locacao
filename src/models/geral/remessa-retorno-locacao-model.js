'use strict';
import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';

export default class RemessaRetornoLocacaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.identificadorItemOrcamento = obj.identificadorItemOrcamento;
    this.dataRemessa = obj.dataRemessa;
    this.numeroDocumentoRemessa = obj.numeroDocumentoRemessa;
    this.quantidadeRemessa = obj.quantidadeRemessa;
    this.loteSerieRemessa = obj.loteSerieRemessa && new ProdutoLoteSerieModel(obj.loteSerieRemessa);
    this.dataRetorno = obj.dataRetorno;
    this.numeroDocumentoRetorno = obj.numeroDocumentoRetorno;
    this.quantidadeRetorno = obj.quantidadeRetorno;
    this.loteSerieRetorno = obj.loteSerieRetorno && new ProdutoLoteSerieModel(obj.loteSerieRetorno);
  }
}