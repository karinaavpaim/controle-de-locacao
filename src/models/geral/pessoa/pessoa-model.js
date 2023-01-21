'use strict';

import CategoriaPessoaModel from '@/models/geral/pessoa/categoria-pessoa-model';
import EnderecoModel from '@/models/geral/endereco/endereco-model';

export default class PessoaModel {
  constructor(obj) {
    
    obj = obj || {};
    this.identificador = obj.identificador;
    this.nome = obj.nome || "";
    this.categorias = (obj.categorias && obj.categorias.map(c => new CategoriaPessoaModel(c))) || [];
    this.enderecos = (obj.enderecos && obj.enderecos.map(e => new EnderecoModel(e))) || [];
    this.enderecoPrincipal = obj.enderecoPrincipal && new EnderecoModel(obj.enderecoPrincipal);
    this.CNAE = obj.CNAE;
    this.codigo = obj.codigo;
    this.codigoNome = obj.codigoNome;
    this.codigoNomeCPFouCNPJ = obj.codigoNomeCPFouCNPJ;
    this.CPFouCNPJ = obj.CPFouCNPJ;
    this.dataCadastro = obj.dataCadastro;
    this.descricaoCNAE = obj.descricaoCNAE;
    this.informacoesRestritas = obj.informacoesRestritas;
    this.nomeCurto = obj.nomeCurto;
    this.tipoPessoa = obj.tipoPessoa;
    this.foto = obj.foto;
  }

  modeloValido() {
    return !!this.nome;
  }
}