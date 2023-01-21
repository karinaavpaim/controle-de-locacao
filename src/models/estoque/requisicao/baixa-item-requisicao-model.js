import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';

export default class BaixaItemRequisicaoModel {
    constructor(dados) {
      dados = dados || {};
      this.codigoRequisicao = dados.codigoRequisicao;
      this.codigosRequisicoesEmDevolucao = dados.codigosRequisicoesEmDevolucao;
      this.dataDaBaixa = dados.dataDaBaixa;
      this.identificadorRequisicaoItemBaixa = dados.identificadorRequisicaoItemBaixa;
      this.quantidade = dados.quantidade;
      this.quantidadeEmDevolucao = dados.quantidadeEmDevolucao;
      this.quantidadeADevolver = dados.quantidadeADevolver;
      this.quantidadeExpedida = dados.quantidadeExpedida;
      this.lote = dados.lote && new ProdutoLoteSerieModel(dados.lote);
      this.serie = dados.serie && new ProdutoLoteSerieModel(dados.serie);
    }

    quantidadeADevolverValida() {
      return this.quantidadeADevolver <= (this.quantidade - this.quantidadeExpedida);
    }
  }