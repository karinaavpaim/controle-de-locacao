

export default class SecaoExpedicaoModel {
  constructor(obj) {
    obj = obj || {}
    this.gerarPedidoLiberadoNaExpedicao = !!obj.gerarPedidoLiberadoNaExpedicao;
    this.tabelaPrecoExpedicao = obj.tabelaPrecoExpedicao;
  }

  modeloValido(){
    return !!(this.tabelaPrecoExpedicao)
  }

  obterErrosDeValidacao() {
    var erros = [];

    if (!this.modeloValido())
      erros.push(`A tabela de preço para expedição deve ser informada.`);

    return erros;
  }
}