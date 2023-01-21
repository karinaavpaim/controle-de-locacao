'use strict';

import EnderecoModel from '@/models/geral/endereco/endereco-model';

export default class EmpresaModel {

  constructor(obj) {
    obj = obj || {};
    this.identificador = obj.identificador;
    this.nome = obj.nome || "";
    this.codigo = obj.codigo;
    this.codigoNome = obj.codigoNome;
    this.CNPJ = obj.CNPJ;
    this.nomeCurto = obj.nomeCurto;
    this.telefone = obj.telefone;
    this.endereco = obj.endereco && new EnderecoModel(obj.endereco);
  }

  modeloValido() {
    return !!this.nome;
  }

  retornarInstanciaValidadaOuNulo() {
    return this.modeloValido() ? this : null;
  }
}