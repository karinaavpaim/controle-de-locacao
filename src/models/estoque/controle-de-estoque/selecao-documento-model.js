import PessoaParticipanteControleDeEstoqueModel from "@/models/estoque/controle-de-estoque/pessoa-participante-controle-de-estoque-model";
import DocumentoControleEstoqueModel from "@/models/estoque/controle-de-estoque/documento-controle-estoque-model";

export default class SelecaoDeDocumentosModel {
  constructor(dados) {
    dados = dados || {};
    this.dataReferencia = dados.dataReferencia;
    this.documentos = (dados.documentos && dados.documentos.map(d => new DocumentoControleEstoqueModel(d))) || [];
    this.finalizada = dados.finalizada;
    this.identificador = dados.identificador;
    this.participantes = (dados.participantes && dados.participantes.map(p => new PessoaParticipanteControleDeEstoqueModel(p))) || [];
  }
}