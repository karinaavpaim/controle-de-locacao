'use strict';
import ContatoPessoaDeContatoModel from '@/models/geral/pessoa/contato-pessoa-de-contato-model';

export default class PessoaDeContatoModel {
  constructor(obj) {
    obj = obj || {};
    this.contatos = (obj.contatos && obj.contatos.map(c => new ContatoPessoaDeContatoModel(c))) || [];
    this.contatoPrincipal = obj.contatoPrincipal;
    this.identificador = obj.identificador;
    this.nome = obj.nome;
    this.telefoneFixo = obj.telefoneFixo;
    this.telefoneCelular = obj.telefoneCelular;
    this.email = obj.email;
    this.pessoaDeContato = obj.pessoaDeContato;
  }
}