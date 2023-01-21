import ItemExpedicaoModel from '@/models/estoque/expedicao/item-expedicao-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';

export default class ExpedicaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificadorLocacao = obj.identificadorLocacao;
    this.codigoLocacao = obj.codigoLocacao;
    this.dataReferencia = obj.dataReferencia;
    this.descricao = obj.descricao;
    this.possuiMaterialOuEquipamento = obj.possuiMaterialOuEquipamento;
    this.codigoEnderecoEntrega = obj.codigoEnderecoEntrega;
    this.cliente = obj.cliente && new PessoaModel(obj.cliente);
    this.itens = (obj.itens && obj.itens.map(i => new ItemExpedicaoModel(i))) || [];
    this.nomePessoaDeContatoCliente = obj.nomePessoaDeContatoCliente;
    this.emailPessoaDeContatoCliente = obj.emailPessoaDeContatoCliente;
    this.telefonePessoaDeContatoCliente = obj.telefonePessoaDeContatoCliente;
  }
}