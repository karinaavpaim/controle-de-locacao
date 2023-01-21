import ProdutoModel from '@/models/estoque/produto/produto-model';
import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';
import BaixaItemRequisicaoModel from '@/models/estoque/requisicao/baixa-item-requisicao-model';

export default class ItemRequisicaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.identificadorItemLocacao = obj.identificadorItemLocacao;
    this.categoria = obj.categoria;
    this.dataFinalLocacao = obj.dataFinalLocacao;
    this.dataInicialLocacao = obj.dataInicialLocacao;
    this.quantidadeDiarias = (obj.quantidadeDiarias && parseInt(obj.quantidadeDiarias)) || 0;
    this.descricao = obj.descricao;
    this.produto = obj.produto && new ProdutoModel(obj.produto);
    this.quantidadeDisponivel = (obj.quantidadeDisponivel && parseInt(obj.quantidadeDisponivel)) || 0;
    this.quantidadePedida = (obj.quantidadePedida && parseInt(obj.quantidadePedida)) || 0;
    this.quantidadeRequisitada = (obj.quantidadeRequisitada && parseInt(obj.quantidadeRequisitada)) || 0;
    this.quantidadeARequisitar = (obj.quantidadeARequisitar && parseInt(obj.quantidadeARequisitar)) || 0;
    this.atendidoComCorte = obj.atendidoComCorte;
    this.lote = obj.lote && new ProdutoLoteSerieModel(obj.lote);
    this.serie = obj.serie && new ProdutoLoteSerieModel(obj.serie);
    this.codigoRequisicaoOrigem = obj.codigoRequisicaoOrigem;
    this.baixas = (Array.isArray(obj.baixas) && obj.baixas.map(b => new BaixaItemRequisicaoModel(b))) || [];
  }

  quantidadeARequisitarValida(){
    return !this.quantidadeARequisitar || ((this.quantidadeRequisitada + this.quantidadeARequisitar) <= this.quantidadePedida);
  }

  podeRequisitar() {
    return this.quantidadeRequisitada < this.quantidadePedida;
  }
}