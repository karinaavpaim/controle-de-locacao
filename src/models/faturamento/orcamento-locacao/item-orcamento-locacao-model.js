'use strict';
import PrecoTabelaModel from '@/models/estoque/produto/tabela-precos/preco-tabela-model';
import ProdutoModel from '@/models/estoque/produto/produto-model';
import RepasseModel from '@/models/faturamento/orcamento-locacao/repasse-model';
import {
  CATEGORIAS_ITEM,
  STATUS_ITEM
} from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import floatUtils from '@/utils/float-util';
import moment from 'moment';

export default class ItemOrcamentoLocacaoModel {

  constructor(obj) {
    obj = obj || {};

    this.categoria = obj.categoria;
    this.dataFinalLocacao = obj.dataFinalLocacao;
    this.dataInicialLocacao = obj.dataInicialLocacao;
    this.identificador = obj.identificador;
    this.preco = obj.preco && new PrecoTabelaModel(obj.preco);
    this.produto = obj.produto && new ProdutoModel(obj.produto);
    this.quantidade = obj.quantidade || 1;
    this.quantidadeDiarias = obj.quantidadeDiarias || 1;
    this.diariasJaMedidas = obj.diariasJaMedidas || 0;
    this.repasses = (obj.repasses && obj.repasses.map(r => new RepasseModel(r))) || [];
    this.valorAcrescimo = obj.valorAcrescimo || 0;
    this.valorDesconto = obj.valorDesconto || 0;
    this.valorUnitario = obj.valorUnitario || 0;
    this.valorAdicionalPersonalizado = obj.valorAdicionalPersonalizado || 0;
    this.descricao = obj.descricao;
    this.medirPeloOrcado = obj.medirPeloOrcado || false;
    this.incluidoNaGestao = obj.incluidoNaGestao || false;
    this.movimentado = obj.movimentado || false;
    this.identificadorEntidadeOrigem = obj.identificadorEntidadeOrigem;
    this.status = obj.status || STATUS_ITEM.ABERTO.nome;
  }

  obterCodigoEDescricaoAtual() {
    return (this.descricao ?
         `${this.produto.codigo} - ${this.descricao}` :
            this.produto.codigoNome);
  }

  modeloValido() {
    return (!!this.categoria && !!this.produto)
  }

  itemValidoParaCadastro() {
    switch (this.categoria) {
      case CATEGORIAS_ITEM.EQUIPAMENTO:
        return this.equipamentoValidoParaCadastro();
      case CATEGORIAS_ITEM.MATERIAL:
        return this.materialValidoParaCadastro();
      case CATEGORIAS_ITEM.SERVICO:
        return this.servicoValidoParaCadastro();
    }
  }

  equipamentoValidoParaCadastro() {
    return !!(this.produto &&
      this.quantidade > 0 &&
      this.quantidadeDiarias > 0 &&
      this.quantidadeDiarias >= this.diariasJaMedidas &&
      this.dataInicialLocacao &&
      this.dataFinalLocacao &&
      this.valorUnitario &&
      this.calcularValorTotalComoEquipamento() >= 0 &&
      (moment(this.dataFinalLocacao).diff(moment(this.dataInicialLocacao), 'days') + 1) >= this.quantidadeDiarias)
  }

  servicoValidoParaCadastro() {
    return !!(this.produto &&
      this.quantidade > 0 &&
      this.quantidadeDiarias > 0 &&
      this.quantidadeDiarias >= this.diariasJaMedidas &&
      this.dataInicialLocacao &&
      this.valorUnitario &&
      this.dataFinalLocacao &&
      this.calcularValorTotalComoServico() >= 0 &&
      (moment(this.dataFinalLocacao).diff(moment(this.dataInicialLocacao), 'days') + 1) >= this.quantidadeDiarias)
  }

  materialValidoParaCadastro() {
    return !!(this.produto &&
      this.dataInicialLocacao &&
      this.produto &&
      this.quantidade > 0 &&
      this.valorUnitario &&
      this.calcularValorTotalComoMaterial() >= 0)
  }

  calcularValorTotalComoEquipamento() {
    let valorUnitarioTotal = (this.quantidade * this.quantidadeDiarias * floatUtils.duasCasasDecimais(this.valorUnitario));
    let valorAdicionalTotal = (this.quantidade * this.quantidadeDiarias * floatUtils.duasCasasDecimais(this.valorAdicionalPersonalizado));
    return floatUtils.duasCasasDecimais(valorUnitarioTotal + valorAdicionalTotal + this.valorAcrescimo) -
      floatUtils.duasCasasDecimais(this.valorDesconto);
  }

  calcularValorTotalComoServico() {
    let valorUnitarioTotal = (this.quantidade * this.quantidadeDiarias * floatUtils.duasCasasDecimais(this.valorUnitario));
    let valorAdicionalTotal = (this.quantidade * this.quantidadeDiarias * floatUtils.duasCasasDecimais(this.valorAdicionalPersonalizado));
    return floatUtils.duasCasasDecimais(valorUnitarioTotal + valorAdicionalTotal + this.valorAcrescimo) -
      floatUtils.duasCasasDecimais(this.valorDesconto);
  }

  calcularValorTotalComoMaterial() {
    let valorUnitarioTotal = (this.quantidade * floatUtils.duasCasasDecimais(this.valorUnitario));
    let valorAdicionalTotal = (this.quantidade * floatUtils.duasCasasDecimais(this.valorAdicionalPersonalizado));
    return floatUtils.duasCasasDecimais(valorUnitarioTotal + valorAdicionalTotal + this.valorAcrescimo) -
      floatUtils.duasCasasDecimais(this.valorDesconto);
  }

  calcularValorTotalUnitario() {
    return (this.calcularValorTotal() / this.quantidade) / this.quantidadeDiarias;
  }

  calcularValorTotal() {
    switch (this.categoria) {
      case CATEGORIAS_ITEM.EQUIPAMENTO:
        return this.calcularValorTotalComoEquipamento();
      case CATEGORIAS_ITEM.MATERIAL:
        return this.calcularValorTotalComoMaterial();
      case CATEGORIAS_ITEM.SERVICO:
        return this.calcularValorTotalComoServico();
    }

    return 0;
  }

  _calcularAdicionalItem(aliquota) {
    let valorUnitario = floatUtils.duasCasasDecimais(this.valorUnitario);
    return floatUtils.duasCasasDecimais((valorUnitario / (1 - (aliquota / 100))) - valorUnitario);
  }

  calcularValorAdicionalPersonalizado(aliquotas) {
    if (!aliquotas) {
      this.valorAdicionalPersonalizado = 0;
      return;
    }

    switch (this.categoria) {
      case CATEGORIAS_ITEM.EQUIPAMENTO:
        this.valorAdicionalPersonalizado = this._calcularAdicionalItem(aliquotas.valorTotalAliquotaEquipamentos);
        break;

      case CATEGORIAS_ITEM.MATERIAL:
        this.valorAdicionalPersonalizado = this._calcularAdicionalItem(aliquotas.valorTotalAliquotaMateriais);
        break;

      case CATEGORIAS_ITEM.SERVICO:
        this.valorAdicionalPersonalizado = this._calcularAdicionalItem(aliquotas.valorTotalAliquotaServicos);
        break;
    }
  }
}