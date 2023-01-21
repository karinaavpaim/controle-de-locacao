import { CATEGORIAS_ITENS_ORCAMENTO_LOCACAO } from '../../../../constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants';
export default class AditivoModel {
  /**
   * Construtor do AditivoModel, recebe por padrão um obj do tipo AtitivoModel.
   * @param {AditivoModel} obj AditivoModel
  */
  constructor(obj){
    obj = obj || {};

    this.identificadorOrcamento = obj.identificadorOrcamento;
    this.identificadorHistoricoOrcamento = obj.identificadorHistoricoOrcamento; 
        
    this.equipamentosIncluidos = obj.equipamentosIncluidos || [];
    this.equipamentosExcluidos = obj.equipamentosExcluidos || [];
    this.equipamentosAlterados = obj.equipamentosAlterados || [];

    this.servicosIncluidos = obj.servicosIncluidos || [];
    this.servicosExcluidos = obj.servicosExcluidos || [];
    this.servicosAlterados = obj.servicosAlterados || [];

    this.materiaisIncluidos = obj.materiaisIncluidos || [];
    this.materiaisExcluidos = obj.materiaisExcluidos || [];
    this.materiaisAlterados = obj.materiaisAlterados || [];

    this.despesasIncluidas = obj.despesasIncluidas || [];
    this.despesasExcluidas = obj.despesasExcluidas || [];
    this.despesasAlteradas = obj.despesasAlteradas || [];
  }

  /**
   * Metodo que gera um novo AditivoModel com base em 2 orcamentos. 
   * @param {OrcamentoLocacaoModel} orcamentoAnterior Orcamento antes do ajuste.
   * @param {OrcamentoLocacaoModel} orcamentoPosterior Orcamento depois do ajuste.
   * @returns retorna um novo AditivoModel.
   */
  gerarAditivoPorHistorico(orcamentoAnterior, orcamentoPosterior){
    this.identificadorOrcamento = orcamentoPosterior.identificador;
    this._separarItens(orcamentoAnterior, orcamentoPosterior);
    this._separarDespesas(orcamentoAnterior, orcamentoPosterior);
    
    return new AditivoModel(this);
  }
 
  _separarItens(orcamentoAnterior, orcamentoPosterior){
    let itensIncluidos = this._obterItensIncluidos(orcamentoAnterior, orcamentoPosterior);
    let itensExcluidos = this._obterItensExcluidos(orcamentoAnterior, orcamentoPosterior);
    let itensAlterados = this._obterItensAlterados(orcamentoAnterior, orcamentoPosterior);  

    this._separarEquipamentos(itensIncluidos, itensExcluidos, itensAlterados);
    this._separarServicos(itensIncluidos, itensExcluidos, itensAlterados);
    this._separarMateriais(itensIncluidos, itensExcluidos, itensAlterados);

    this._separarDespesas(orcamentoAnterior, orcamentoPosterior);
  }

  _separarEquipamentos(itensIncluidos, itensExcluidos, itensAlterados){

    this.equipamentosIncluidos = itensIncluidos.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.EQUIPAMENTO.valor);
    
    this.equipamentosExcluidos = itensExcluidos.filter(item => 
        item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.EQUIPAMENTO.valor);

    this.equipamentosAlterados = itensAlterados.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.EQUIPAMENTO.valor);
  }

  _separarServicos(itensIncluidos, itensExcluidos, itensAlterados){

    this.servicosIncluidos = itensIncluidos.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.SERVICO.valor);
    
    this.servicosExcluidos = itensExcluidos.filter(item => 
        item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.SERVICO.valor);

    this.servicosAlterados = itensAlterados.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.SERVICO.valor);
  }

  _separarMateriais(itensIncluidos, itensExcluidos, itensAlterados){

    this.materiaisIncluidos = itensIncluidos.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.MATERIAL.valor);
    
    this.materiaisExcluidos = itensExcluidos.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.MATERIAL.valor);

    this.materiaisAlterados = itensAlterados.filter(item => 
      item.categoria == CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.MATERIAL.valor);
  }

  _separarDespesas(orcamentoAnterior, orcamentoPosterior){
    this.despesasIncluidas = this._obterDespesasIncluidas(orcamentoAnterior, orcamentoPosterior);
    this.despesasExcluidas = this._obterDespesasExcluidas(orcamentoAnterior, orcamentoPosterior);
    this.despesasAlteradas = this._obterDespesasAlteradas(orcamentoAnterior, orcamentoPosterior);
  }

  _obterItensIncluidos(orcamentoAnterior, orcamentoPosterior){
    return orcamentoPosterior.itens.filter(item => 
        !orcamentoAnterior.itens
        .some(i => i.identificador == item.identificador));
  }

  _obterItensExcluidos(orcamentoAnterior, orcamentoPosterior){
    return orcamentoAnterior.itens.filter(item => 
        !orcamentoPosterior.itens
        .some(i => i.identificador == item.identificador));
  }

  _obterItensAlterados(orcamentoAnterior, orcamentoPosterior){
    return orcamentoPosterior.itens.filter(item => 
        orcamentoAnterior.itens
        .some(i => this._compararAlteracoesNosItens(i, item)));
  }

  _compararAlteracoesNosItens(item1, item2){
    if(item1.identificador != item2.identificador) return false;

    let identificadorPrecoItem1 = item1.preco && item1.preco.identificador;
    let identificadorPrecoItem2 = item2.preco && item2.preco.identificador;
   
    if((identificadorPrecoItem1 != identificadorPrecoItem2) ||
      (item1.quantidade != item2.quantidade) ||
      (item1.quantidadeDiarias != item2.quantidadeDiarias) ||
      (item1.valorAcrescimo != item2.valorAcrescimo) ||
      (item1.valorDesconto != item2.valorDesconto) ||
      (item1.valorUnitario != item2.valorUnitario) ||
      (item1.valorAdicionalPersonalizado != item2.valorAdicionalPersonalizado)){
      return true;
    }
    return false;
  }

  _obterDespesasIncluidas(orcamentoAnterior, orcamentoPosterior){
    return orcamentoPosterior.despesas.filter(despesa => 
        !orcamentoAnterior.despesas
        .some(i => i.identificador == despesa.identificador));
  }

  _obterDespesasExcluidas(orcamentoAnterior, orcamentoPosterior){
    return orcamentoAnterior.despesas.filter(despesa => 
        !orcamentoPosterior.despesas
        .some(i => i.identificador == despesa.identificador));
  }

  _obterDespesasAlteradas(orcamentoAnterior, orcamentoPosterior){
    return orcamentoPosterior.despesas.filter(despesa => 
        orcamentoAnterior.despesas
        .some(d => this._compararAlteracoesNasDespesas(d, despesa)));
  }

  _compararAlteracoesNasDespesas(despesa1, despesa2){
    if(despesa1.identificador != despesa2.identificador) return false;

    let identificadorNaturezaDespesa1 = despesa1.naturezaLancamento && despesa1.naturezaLancamento.identificador;
    let identificadorNaturezaDespesa2 = despesa2.naturezaLancamento && despesa2.naturezaLancamento.identificador;
   
    if((identificadorNaturezaDespesa1 != identificadorNaturezaDespesa2) ||
      (despesa1.quantidade != despesa2.quantidade) ||
      (despesa1.valorItem != despesa2.valorItem) ||
      (despesa1.valorAdicionalPersonalizado != despesa2.valorAdicionalPersonalizado)){
      return true;
    }
    return false;
  }

}