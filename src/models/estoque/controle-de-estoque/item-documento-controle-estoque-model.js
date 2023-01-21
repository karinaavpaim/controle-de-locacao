import ProdutoModel from "@/models/estoque/produto/produto-model";
import MovimentoItemDocumentoControleEstoqueModel from "@/models/estoque/controle-de-estoque/movimento-item-documento-controle-estoque-model";

export default class ItemDocumentoControleEstoqueModel {
  constructor(dados) {
    dados = dados || {};
    this.identificador = dados.identificador;
    this.quantidade = dados.quantidade;
    this.status = dados.status;
    this.produto = dados.produto && new ProdutoModel(dados.produto);
    this.movimentos = (dados.movimentos && dados.movimentos.map(m => new MovimentoItemDocumentoControleEstoqueModel(m))) || [];
  }
}
