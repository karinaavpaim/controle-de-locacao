import PessoaModel from "@/models/geral/pessoa/pessoa-model";

export default class PessoaParticipanteControleDeEstoqueModel {
  constructor(dados) {
    dados = dados || {};
    this.permiteFinalizarAtividade = dados.permiteFinalizarAtividade;
    this.corAlternativaAvatar = dados.corAlternativaAvatar;
    this.funcionario = dados.funcionario && new PessoaModel(dados.funcionario);
  }
}