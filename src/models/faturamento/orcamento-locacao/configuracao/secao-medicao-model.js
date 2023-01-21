export default class SecaoMedicaoModel {
  constructor(obj) {
    obj = obj || {}
    this.gerarPedidoLiberadoNaMedicao = !!obj.gerarPedidoLiberadoNaMedicao;
    this.primeiraPrioridadeSomaDasDespesasNaMedicao = obj.primeiraPrioridadeSomaDasDespesasNaMedicao;
    this.segundaPrioridadeSomaDasDespesasNaMedicao = obj.segundaPrioridadeSomaDasDespesasNaMedicao;
    this.terceiraPrioridadeSomaDasDespesasNaMedicao = obj.terceiraPrioridadeSomaDasDespesasNaMedicao;
  }

  modeloValido(){
    return (this.gerarPedidoLiberadoNaMedicao != undefined &&
            !!this.primeiraPrioridadeSomaDasDespesasNaMedicao &&
            !!this.segundaPrioridadeSomaDasDespesasNaMedicao &&
            !!this.terceiraPrioridadeSomaDasDespesasNaMedicao && 
            this._prioridadesNaoEstaoRepetidas())
  }

  obterErrosDeValidacao() {
    var erros = [];

    if (!this.modeloValido())
      erros.push(`As prioridades da soma das despesas são obrigatórias e não podem se repetir.`);

    return erros;
  }

  _prioridadesNaoEstaoRepetidas(){
    return !!((this.primeiraPrioridadeSomaDasDespesasNaMedicao != this.segundaPrioridadeSomaDasDespesasNaMedicao) &&
              (this.primeiraPrioridadeSomaDasDespesasNaMedicao != this.terceiraPrioridadeSomaDasDespesasNaMedicao) &&
              (this.segundaPrioridadeSomaDasDespesasNaMedicao != this.terceiraPrioridadeSomaDasDespesasNaMedicao))
  }
}