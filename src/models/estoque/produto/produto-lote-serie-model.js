export default class ProdutoLoteSerieModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.codigo = obj.codigo;
    this.dataValidade = obj.dataValidade;
    this.observacao = obj.observacao;
    this.quantidadeDisponivel = obj.quantidadeDisponivel;
    this.tipo = obj.tipo;
  }
}