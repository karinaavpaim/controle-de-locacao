'use strict';
import ItemAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/item-analise-resultado-model';
import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import MedicaoLocacaoModel from '@/models/estoque/medicao/medicao-locacao-model';
import { CATEGORIAS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import { STATUS_ORCAMENTO_LOCACAO } from '@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants';
import { CATEGORIAS_ANALISE } from '@/constants/faturamento/controle-de-locacao/analise-resultados-constants';
import floatUtils from '@/utils/float-util';
export default class AnaliseResultadoModel {
  constructor(obj) {
    obj = obj || {};
    this.orcado = new OrcamentoLocacaoModel(obj.orcado);
    this.locacao = new OrcamentoLocacaoModel(obj.locacao);
    this.medicao = new MedicaoLocacaoModel(obj.medicao);
  }

  obterMetaDados(){
    let itens = this._obterItens();
    let despesas = this._obterDespesas();
    
    let detalhamento = itens.concat(despesas) || [];
    let totalGeral = this._obterListaAgrupadaComTotalizador(detalhamento, CATEGORIAS_ANALISE.TOTAL);
    totalGeral.filhos = undefined;
    detalhamento.push(totalGeral);

    let adicionaisPersonalizados = this._obterAdicionaisPersonalizados(totalGeral);

    return new MetaDadosAnaliseResultadoModel({
      detalhamento,
      totalGeral,
      adicionaisPersonalizados,
    });
  }

  _obterDespesas(){
    let incuidasNaGestao = this._obterDespesasIncluidasNaGestao();
    let excluidasNaGestao = this._obterDespesasExcluidasNaGestao();
    let iguaisNoOrcamentoENaGestao = this._obterDespesasIguaisNoOrcamentoENaGestao();  

    let despesas = this._agruparDespesas(incuidasNaGestao, excluidasNaGestao, iguaisNoOrcamentoENaGestao);

    return [despesas];
  }

  _agruparDespesas(incluidosNaGestao, excluidosNaGestao, iguaisNoOrcamentoENaGestao){
    let lista = [];
    incluidosNaGestao.forEach(despesa => this._incluirDespesaNaLista(despesa, lista, true, false));
    excluidosNaGestao.forEach(despesa => this._incluirDespesaNaLista(despesa, lista, false, true));
    iguaisNoOrcamentoENaGestao.forEach(despesa => this._incluirDespesaNaLista(despesa, lista, false, false));

    return this._obterListaAgrupadaComTotalizador(lista, CATEGORIAS_ANALISE.DESPESA);
  }

  _incluirDespesaNaLista(despesa, lista, incluidoNaGestao, excluidoNaGestao) {
    var orcado = this.orcado.despesas.find(d => d.identificador == despesa.identificadorEntidadeOrigem);
    var medido = this.medicao.despesas.find(d => d.identificador == despesa.identificador);
    var descricaoEntidade = `${despesa.naturezaLancamento.codigo} - ${despesa.naturezaLancamento.nome}`;
    lista.push(this._obterEntidade(despesa, descricaoEntidade, incluidoNaGestao, excluidoNaGestao, medido, orcado));
  }

  _obterItens(){
    let incluidosNaGestao = this._obterItensIncluidosNaGestao();
    let excluidosNaGestao = this._obterItensExcluidosNaGestao();
    let iguaisNoOrcamentoENaGestao = this._obterItensIguaisNoOrcamentoENaGestao();

    let equipamentos = this._agruparItens(incluidosNaGestao, excluidosNaGestao, iguaisNoOrcamentoENaGestao, CATEGORIAS_ITEM.EQUIPAMENTO);
    let materiais = this._agruparItens(incluidosNaGestao, excluidosNaGestao, iguaisNoOrcamentoENaGestao, CATEGORIAS_ITEM.MATERIAL);
    let servicos = this._agruparItens(incluidosNaGestao, excluidosNaGestao, iguaisNoOrcamentoENaGestao, CATEGORIAS_ITEM.SERVICO);

    return [equipamentos, materiais, servicos];
  }

  _agruparItens(incluidosNaGestao, excluidosNaGestao, iguaisNoOrcamentoENaGestao, categoriaItem){
    let lista = [];
    incluidosNaGestao.forEach(item => this._incluirItemNaLista(item, lista, categoriaItem, true, false));
    excluidosNaGestao.forEach(item => this._incluirItemNaLista(item, lista, categoriaItem, false, true));
    iguaisNoOrcamentoENaGestao.forEach(item => this._incluirItemNaLista(item, lista, categoriaItem, false, false));

    return this._obterListaAgrupadaComTotalizador(lista, CATEGORIAS_ANALISE[categoriaItem]);
  }

  _incluirItemNaLista(item, lista, categoriaItem, incluidoNaGestao, excluidoNaGestao) {
    if(item.categoria == categoriaItem){
      var orcado = this.orcado.itens.find(itemOrcado => itemOrcado.identificador == item.identificadorEntidadeOrigem);
      var medido = this.medicao.itens.find(i => i.identificadorItemLocacao == item.identificador);
      var descricaoEntidade = item.descricao ? `${item.produto.codigo} - ${item.descricao}` : item.produto.codigoNome;
      lista.push(this._obterEntidade(item, descricaoEntidade, incluidoNaGestao, excluidoNaGestao, medido, orcado));
    }
  }

  _obterEntidade(entidade, descricaoEntidade, incluidoNaGestao, excluidoNaGestao, medido, orcado) {
    return new ItemAnaliseResultadoModel({
      identificador: entidade.identificador,
      descricao: descricaoEntidade,
      orcado: this._calcularValorOrcado(entidade, incluidoNaGestao, excluidoNaGestao, orcado),
      ajustado: this._calcularValorAjustado(entidade, excluidoNaGestao),
      realizado: this._calcularValorRealizado(excluidoNaGestao, medido),
      pendente: this._calcularValorPendente(entidade, incluidoNaGestao, excluidoNaGestao, medido, orcado),
      variacao: this._calcularValorDeVariacao(entidade, incluidoNaGestao, excluidoNaGestao, medido, orcado),
      diferenca: this._calcularValorDaDiferenca(entidade, incluidoNaGestao, excluidoNaGestao, orcado),
      totalizador: false,
      status: entidade.status,
      itemLocacao: entidade.produto && entidade,
      despesaLocacao: !entidade.produto && entidade
    });
  }

  _obterListaAgrupadaComTotalizador(lista, categoriaAnalise) {
    return new ItemAnaliseResultadoModel({
      identificador: categoriaAnalise.ID,
      descricao: categoriaAnalise.DESCRICAO, 
      orcado: floatUtils.duasCasasDecimais(lista.reduce((total, item) => total + item.orcado, 0)),
      ajustado: floatUtils.duasCasasDecimais(lista.reduce((total, item) => total + item.ajustado, 0)),
      realizado: floatUtils.duasCasasDecimais(lista.reduce((total, item) => total + item.realizado, 0)),
      pendente: [STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor, STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor].includes(this.orcado.status)
        ? 0
        : floatUtils.duasCasasDecimais(lista.reduce((total, item) => total + item.pendente, 0)),
      variacao: floatUtils.duasCasasDecimais(lista.reduce((total, item) => total + item.variacao, 0)),
      diferenca: floatUtils.duasCasasDecimais(lista.reduce((total, item) => total + item.diferenca, 0)),
      totalizador: true,
      filhos: lista
    });
  }

  /* Inicio dos metodos de Calculos */
  _calcularValorOrcado(entidade, incluidoNaGestao, excluidoNaGestao, orcado) {
    if (incluidoNaGestao) return 0;
    if (excluidoNaGestao) return entidade.calcularValorTotal();
    return orcado.calcularValorTotal();
  }

  _calcularValorAjustado(entidade, excluidoNaGestao) {
    return excluidoNaGestao ? 0 : entidade.calcularValorTotal();
  }

  _calcularValorRealizado(excluidoNaGestao, medido) {
    if(excluidoNaGestao || !medido || !medido.desmembramentos.length) return 0;
    return medido.obterValorTotalMedido();
  }

  _calcularValorPendente(entidade, incluidoNaGestao, excluidoNaGestao, medido, orcado) {
    if (excluidoNaGestao
      || [STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor, STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor].includes(this.orcado.status))
      return 0;

    // Se não foi medido, o valor pendente será o valor do proprio item.
    if (!medido || !medido.desmembramentos.length) {
      return (entidade.medirPeloOrcado)
        ? this._calcularValorOrcado(entidade, incluidoNaGestao, excluidoNaGestao, orcado)
        : this._calcularValorAjustado(entidade, excluidoNaGestao);
    }

    var valorPendenteOrcado = this._calcularValorOrcado(entidade, incluidoNaGestao, excluidoNaGestao, orcado) - this._calcularValorRealizado(excluidoNaGestao, medido);

    let valor = (entidade.medirPeloOrcado)
      ? ((valorPendenteOrcado < 0) ? 0 : valorPendenteOrcado)
      : this._calcularValorRealizado(excluidoNaGestao, medido) - this._calcularValorAjustado(entidade, excluidoNaGestao);

    return (valor < 0) ? valor * -1 : valor; // Valor pendente não deve ser negativo.
  }

  _calcularValorDeVariacao(entidade, incluidoNaGestao, excluidoNaGestao, medido, orcado) {
    /**
     * O calculo da variação não deve considerar o orçado, sempre será (Realizado - Ajustado) + Pendente
     * Situação discutida entre Weberson.dsn.erp, Mariana.dsn.erp e o PO Emerson.dsn.erp na data de 11/08/2021 as 11:30hs
    */
    return this._calcularValorRealizado(excluidoNaGestao, medido)
      - this._calcularValorAjustado(entidade, excluidoNaGestao)
      + this._calcularValorPendente(entidade, incluidoNaGestao, excluidoNaGestao, medido, orcado);
  }

  _calcularValorDaDiferenca(entidade, incluidoNaGestao, excluidoNaGestao, orcado) {
    if (incluidoNaGestao) return this._calcularValorAjustado(entidade);
    return (this._calcularValorAjustado(entidade, excluidoNaGestao)
      - this._calcularValorOrcado(entidade, incluidoNaGestao, excluidoNaGestao, orcado))
      * (entidade.medirPeloOrcado ? -1 : 1);
  }
  /* Fim dos metodos de Calculos */

  _obterItensIguaisNoOrcamentoENaGestao(){
    return this.locacao.itens.filter(item =>
      !item.incluidoNaGestao && this.orcado.itens
      .some(i => i.identificador == item.identificadorEntidadeOrigem));
  }

  _obterItensIncluidosNaGestao(){
    return this.locacao.itens.filter(item => item.incluidoNaGestao && !item.identificadorEntidadeOrigem);
  }

  _obterItensExcluidosNaGestao(){
    return this.orcado.itens.filter(item => 
      !item.incluidoNaGestao && !this.locacao.itens
      .some(i => i.identificadorEntidadeOrigem == item.identificador));
  }

  _obterDespesasIguaisNoOrcamentoENaGestao(){
    return this.locacao.despesas.filter(despesa => 
      !despesa.incluidoNaGestao && this.orcado.despesas
      .some(d => d.identificador == despesa.identificadorEntidadeOrigem));
  }

  _obterDespesasIncluidasNaGestao(){
    return this.locacao.despesas.filter(despesa => despesa.incluidoNaGestao && !despesa.identificadorEntidadeOrigem);
  }

  _obterDespesasExcluidasNaGestao(){
    return this.orcado.despesas.filter(despesa => 
      !despesa.incluidoNaGestao && !this.locacao.despesas
      .some(d => d.identificadorEntidadeOrigem == despesa.identificador));
  }

  _obterAdicionaisPersonalizados() {
    return [];
  }

  // _obterAdicionaisPersonalizados(totalizadoresAnalise) {
  //   let excluidosNaGestao = this._obterAdicionaisExcluidosNaGestao();
  //   let incluidosNaGestao = this._obterAdicionaisIncluidosNaGestao();
  //   let iguaisNoOrcadoERealizado = this._obterAdicionaisIguaisNoOrcamentoENaGestao();

  //   let adicionais = [];
  //   excluidosNaGestao.forEach(adicional => this._incluirAdicionalNaLista(adicional, adicionais, this.orcado.totalOrcamento, totalizadoresAnalise));
  //   incluidosNaGestao.forEach(adicional => this._incluirAdicionalNaLista(adicional, adicionais, this.locacao.totalOrcamento, totalizadoresAnalise));
  //   iguaisNoOrcadoERealizado.forEach(adicional => this._incluirAdicionalNaLista(adicional, adicionais, this.orcado.totalOrcamento, totalizadoresAnalise));

  //   let agrupamento = this._obterListaAgrupadaComTotalizador(adicionais, CATEGORIAS_ANALISE.TOTAL);
  //   agrupamento.filhos = undefined;
  //   adicionais.push(agrupamento);

  //   return adicionais;
  // }

  _incluirAdicionalNaLista(adicional, lista, totalLocacao, totalizadoresAnalise) {
    lista.push(this._obterAdicionalPersonalizadoItem(adicional, totalLocacao, totalizadoresAnalise));
  }

  _obterAdicionalPersonalizadoItem(adicional, totalLocacao, totalizadoresAnalise) {
    var totalItem = adicional.valorTotalAdicionalPersonalizado;
    return new ItemAnaliseResultadoModel({
      identificador: adicional.identificador,
      descricao: adicional.adicionalPersonalizadoItem.descricao,
      orcado: this._calcularValorProporcional(totalItem, totalLocacao, totalizadoresAnalise.orcado),
      ajustado: this._calcularValorProporcional(totalItem, totalLocacao, totalizadoresAnalise.ajustado),
      realizado: this._calcularValorProporcional(totalItem, totalLocacao, totalizadoresAnalise.realizado),
      pendente: this._calcularValorProporcional(totalItem, totalLocacao, totalizadoresAnalise.pendente),
      variacao: this._calcularValorProporcional(totalItem, totalLocacao, totalizadoresAnalise.variacao),
      diferenca: this._calcularValorProporcional(totalItem, totalLocacao, totalizadoresAnalise.diferenca),
      totalizador: false,
      status: undefined
    });
  }

  _calcularValorProporcional(totalAdicional, totalLocacao, totalColuna) {
    return floatUtils.duasCasasDecimais((totalAdicional * totalColuna) / totalLocacao);
  }

  _obterAdicionaisIguaisNoOrcamentoENaGestao() {
    return this.orcado.adicionalPersonalizadoItens.filter(adicional =>
      this.locacao.adicionalPersonalizadoItens
      .some(a => a.adicionalPersonalizadoItem.identificador == adicional.adicionalPersonalizadoItem.identificador ));
  }

  _obterAdicionaisExcluidosNaGestao() {
    return this.orcado.adicionalPersonalizadoItens.filter(adicional =>
      !this.locacao.adicionalPersonalizadoItens
      .some(a => a.adicionalPersonalizadoItem.identificador == adicional.adicionalPersonalizadoItem.identificador ));
  }

  _obterAdicionaisIncluidosNaGestao() {
    return this.locacao.adicionalPersonalizadoItens.filter(adicional =>
      !this.orcado.adicionalPersonalizadoItens
      .some(a => a.adicionalPersonalizadoItem.identificador == adicional.adicionalPersonalizadoItem.identificador ));
  }
}