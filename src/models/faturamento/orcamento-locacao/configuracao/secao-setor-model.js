export default class SecaoSetorModel {
  constructor(obj) {
    obj = obj || {}
    this.setorEstoquePrincipal = obj.setorEstoquePrincipal;
    this.setorEstoqueExpedicao = obj.setorEstoqueExpedicao;
  }

  modeloValido(){
    return (this.estoquePrincipalEstaValido() &&
              !!this.setorEstoquePrincipal &&
              !!this.setorEstoqueExpedicao );
  }

  todosOsSetoresEstaoPreenchidos(){
    return (!!this.setorEstoquePrincipal &&
            !!this.setorEstoqueExpedicao );
  }

  estoquePrincipalEstaValido(){
    return !!(this.setorEstoquePrincipal != this.setorEstoqueExpedicao)
  }

  obterErrosDeValidacao() {
    var erros = [];

    if (!this.todosOsSetoresEstaoPreenchidos())
      erros.push(`Todos os setores são obrigatórios.`);

    if (!this.estoquePrincipalEstaValido())
      erros.push(`O setor do estoque principal deverá ser diferente do setor de estoque para expedição.`);

    return erros;
  }

}