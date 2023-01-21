import ModeloPropostaLocacaoModel from './modelo-proposta-model';

'use strict';

export default class PropostaLocacaoModel {

  constructor(obj) {
    obj = obj || {};

    this.identificador = obj.identificador;
    this.identificadorOrcamento = obj.identificadorOrcamento;
    this.identificadorHistoricoOrcamento = obj.identificadorHistoricoOrcamento;
    this.modelo = obj.modelo && new ModeloPropostaLocacaoModel(obj.modelo);
    this.identificadorUsuario = obj.identificadorUsuario;
    this.conteudo = obj.conteudo;
    this.conteudoPropostaModelo = obj.conteudoPropostaModelo;
  }
}