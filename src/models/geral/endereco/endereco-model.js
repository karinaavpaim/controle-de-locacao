'use strict';

import BairroModel from '@/models/geral/endereco/bairro-model';
import CidadeModel from '@/models/geral/endereco/cidade-model';
import PessoaDeContatoModel from '@/models/geral/pessoa/pessoa-de-contato-model';

export default class EnderecoModel {
  constructor(obj) {
    obj = obj || {};

    this.ativo = obj.ativo || false;
    this.bairro = new BairroModel(obj.bairro);
    this.bairroCidadeUnidadeFederativaCep = obj.bairroCidadeUnidadeFederativaCep;
    this.cep = obj.cep;
    this.cidade = new CidadeModel(obj.cidade);
    this.codigo = obj.codigo;
    this.codigoSuframa = obj.codigoSuframa;
    this.complemento = obj.complemento;
    this.inscricaoEstadual = obj.inscricaoEstadual;
    this.inscricaoMunicipal = obj.inscricaoMunicipal;
    this.latitude = obj.latitude;
    this.longitude = obj.longitude;
    this.nomeLogradouro = obj.nomeLogradouro;
    this.numeroLogradouro = obj.numeroLogradouro;
    this.observacao = obj.observacao;
    this.pessoasDeContato = (obj.pessoasDeContato && obj.pessoasDeContato.map(p => new PessoaDeContatoModel(p))) || [];
    this.tipoNomeNumeroComplementoLogradouro = obj.tipoNomeNumeroComplementoLogradouro;
    this.tiposEndereco = obj.tiposEndereco || [];
    this.contatoPrincipal = obj.contatoPrincipal && new PessoaDeContatoModel(obj.contatoPrincipal);
  }

  modeloValido() {
    return this.bairro.modeloValido() &&
    this.cidade.modeloValido() &&
    this.nomeLogradouro
  }
}