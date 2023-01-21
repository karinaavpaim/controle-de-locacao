import SetorModel from "@/models/geral/setor-model";
import ItemDocumentoControleEstoqueModel from "@/models/estoque/controle-de-estoque/item-documento-controle-estoque-model";

export default class DocumentoControleEstoqueModel {
  constructor(dados) {
    dados = dados || {};
    this.dataReferencia = dados.dataReferencia;
    this.descricao = dados.descricao;
    this.identificador = dados.identificador;
    this.identificadorDocumento = dados.identificadorDocumento;
    this.setorOrigem = dados.setorOrigem && new SetorModel(dados.setorOrigem);
    this.status = dados.status;
    this.tipo = dados.tipo;
    this.itens = (dados.itens && dados.itens.map(i => new ItemDocumentoControleEstoqueModel(i))) || [];
  }
}