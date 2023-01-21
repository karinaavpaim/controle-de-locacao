import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';

export default class ItemLiberacaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificadorRequisicaoItemBaixa = obj.identificadorRequisicaoItemBaixa;
    this.lote = obj.lote && new ProdutoLoteSerieModel(obj.lote);
    this.serie = obj.serie && new ProdutoLoteSerieModel(obj.serie);
    this.quantidadeLiberada = (obj.quantidadeLiberada && parseInt(obj.quantidadeLiberada)) || 0;
    this.quantidadeExpedida = (obj.quantidadeExpedida && parseInt(obj.quantidadeExpedida)) || 0;
    this.quantidadeAExpedir = (obj.quantidadeAExpedir && parseInt(obj.quantidadeAExpedir)) || 0;
  }

  quantidadeAExpedirValida() {
    return this.quantidadeAExpedir <= (this.quantidadeLiberada - this.quantidadeExpedida);
  }
}