import ItemRequisicaoModel from '@/models/estoque/requisicao/item-requisicao-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import SetorModel from '@/models/geral/setor-model';

export default class RequisicaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.identificadorLocacao = obj.identificadorLocacao;
    this.codigoRequisicao = obj.codigoRequisicao;
    this.setorRequisitado = obj.setorRequisitado && new SetorModel(obj.setorRequisitado);
    this.setorRequisitante = obj.setorRequisitante && new SetorModel(obj.setorRequisitante);
    this.codigoLocacao = obj.codigoLocacao;
    this.dataReferencia = obj.dataReferencia;
    this.descricao = obj.descricao;
    this.possuiMaterialOuEquipamento = obj.possuiMaterialOuEquipamento;
    this.codigoEnderecoEntrega = obj.codigoEnderecoEntrega;
    this.cliente = obj.cliente && new PessoaModel(obj.cliente);
    this.itens = (obj.itens && obj.itens.map(i => new ItemRequisicaoModel(i))) || [];
    this.tipo = obj.tipo;
    this.nomePessoaDeContatoCliente = obj.nomePessoaDeContatoCliente;
    this.emailPessoaDeContatoCliente = obj.emailPessoaDeContatoCliente;
    this.telefonePessoaDeContatoCliente = obj.telefonePessoaDeContatoCliente;
  }
}