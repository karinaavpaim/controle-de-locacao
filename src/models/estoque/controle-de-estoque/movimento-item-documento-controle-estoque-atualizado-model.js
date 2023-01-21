import MovimentoItemDocumentoControleEstoqueModel from "@/models/estoque/controle-de-estoque/movimento-item-documento-controle-estoque-model";

export default class MovimentoItemDocumentoControleEstoqueAtualizado {
  constructor(dados) {
    dados = dados || {};
    this.identificadorDocumento = dados.identificadorDocumento;
    this.tipoDocumento = dados.tipoDocumento;
    this.identificadorItem = dados.identificadorItem;
    this.movimento = dados.movimento && new MovimentoItemDocumentoControleEstoqueModel(dados.movimento);
  }
}