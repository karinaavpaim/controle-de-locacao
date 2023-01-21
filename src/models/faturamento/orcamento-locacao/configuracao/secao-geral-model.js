export default class SecaoGeralModel {
  constructor(obj) {
    obj = obj || {}
    this.identificadorProdutoPadraoBimer = obj.identificadorProdutoPadraoBimer;
    this.utilizarAdicionaisPersonalizados = obj.utilizarAdicionaisPersonalizados || false;
    this.codigoEmpresaPadraoBimer = obj.codigoEmpresaPadraoBimer && parseInt(obj.codigoEmpresaPadraoBimer);
  }

  modeloValido(){
    return true; // Por enquanto nada é obrigatorio para o modelo ser válido.
  }
}

