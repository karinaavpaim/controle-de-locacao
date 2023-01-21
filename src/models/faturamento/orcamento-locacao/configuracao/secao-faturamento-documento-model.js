export default class SecaoFaturamentoDocumentoModel {
  constructor(obj) {
    obj = obj || {}
    this.tiposDocumentoNotaFiscal = (Array.isArray(obj.tiposDocumentoNotaFiscal) && obj.tiposDocumentoNotaFiscal) || [];
    this.tiposDocumentoNotaFiscalServico = (Array.isArray(obj.tiposDocumentoNotaFiscalServico) && obj.tiposDocumentoNotaFiscalServico) || [];
    this.tiposDocumentoOrdemEntrega = (Array.isArray(obj.tiposDocumentoOrdemEntrega) && obj.tiposDocumentoOrdemEntrega) || [];
  }

  modeloValido(){
    return true; // Por enquanto nada é obrigatorio para o modelo ser válido.
  }
}

