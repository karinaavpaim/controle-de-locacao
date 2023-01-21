import ItemLiberacaoModel from '@/models/estoque/expedicao/item-liberacao-model';
import ProdutoModel from '@/models/estoque/produto/produto-model';

export default class ItemExpedicaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificadorItemLocacao = obj.identificadorItemLocacao;
    this.categoria = obj.categoria;
    this.dataFinalLocacao = obj.dataFinalLocacao;
    this.dataInicialLocacao = obj.dataInicialLocacao;
    this.quantidade = (obj.quantidade && parseInt(obj.quantidade)) || 0;
    this.quantidadeRequisitada = (obj.quantidadeRequisitada && parseInt(obj.quantidadeRequisitada)) || 0;
    this.atendidoComCorte = obj.atendidoComCorte;
    this.descricao = obj.descricao;
    this.produto = obj.produto && new ProdutoModel(obj.produto);
    this.liberacoes = (obj.liberacoes && obj.liberacoes.map(l => new ItemLiberacaoModel(l))) || [];
    this.valorUnitario = obj.valorUnitario;
    this.valorDesconto = obj.valorDesconto;
    this.valorAcrescimo = obj.valorAcrescimo;
  }
}