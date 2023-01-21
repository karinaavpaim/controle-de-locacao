import ProdutoLoteSerieModel from "@/models/estoque/produto/produto-lote-serie-model";
import PessoaModel from "@/models/geral/pessoa/pessoa-model";

export default class MovimentoItemDocumentoControleEstoqueModel {
  constructor(dados) {
    dados = dados || {};
    this.identificador = dados.identificador;
    this.lote = dados.lote && new ProdutoLoteSerieModel(dados.lote);
    this.serie = dados.serie && new ProdutoLoteSerieModel(dados.serie);
    this.quantidade = dados.quantidade;
    this.responsavel = dados.responsavel && new PessoaModel(dados.responsavel);
  }
}