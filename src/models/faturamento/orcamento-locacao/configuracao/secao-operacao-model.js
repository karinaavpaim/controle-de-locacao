export default class SecaoOperacaoModel {
  constructor(obj) {
    obj = obj || {}
    this.operacaoExpedicaoDosEquipamentos = obj.operacaoExpedicaoDosEquipamentos;
    this.operacaoExpedicaoDosMateriais = obj.operacaoExpedicaoDosMateriais;
    this.operacaoFaturamentoDosEquipamentos = obj.operacaoFaturamentoDosEquipamentos;
    this.operacaoFaturamentoDosServicos = obj.operacaoFaturamentoDosServicos;
    this.operacaoFaturamentoDosMateriais = obj.operacaoFaturamentoDosMateriais;
  }

  modeloValido(){
    return (!!this.operacaoExpedicaoDosEquipamentos &&
            !!this.operacaoExpedicaoDosMateriais &&
            !!this.operacaoFaturamentoDosEquipamentos &&
            !!this.operacaoFaturamentoDosServicos &&
            !!this.operacaoFaturamentoDosMateriais)
  }

  obterErrosDeValidacao() {
    var erros = [];

    if (!this.modeloValido())
      erros.push(`Todas as operações são obrigatórias.`);

    return erros;
  }
}