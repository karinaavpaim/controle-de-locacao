'use strict';

import { FILTROS_PESQUISA } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import PessoaModel from "@/models/geral/pessoa/pessoa-model";
import dataUtils from "@/utils/data"

class MetadadosFiltroModel {
  constructor(obj){
    obj = obj || {};
    this.cliente = obj.cliente && new PessoaModel(obj.cliente);
    this.periodoEmissao = obj.periodoEmissao;
 
  }
}
export default class FiltrosPesquisaOrcamentoModel {
  constructor(obj) {
    obj = obj || {};

    this.idEmpresa = obj.idEmpresa;
    this.idCliente = obj.idCliente;
    this.listaDeStatus = obj.listaDeStatus || [];
    this.codigo = obj.codigo;
    this.dataEmissaoInicial = obj.dataEmissaoInicial;
    this.dataEmissaoFinal = obj.dataEmissaoFinal;
    this.identificadorOrcamento = obj.identificadorOrcamento;
    this.dataInicialReferencia = obj.dataInicialReferencia;
    this.dataFinalReferencia = obj.dataFinalReferencia;
    this.dataInicioContrato = obj.dataInicioContrato;
    this.dataTerminoContrato = obj.dataTerminoContrato;
    this.buscarOrcamentos = obj.buscarOrcamentos;
    this.buscarLocacoes = obj.buscarLocacoes;
    this.buscarLocacoesMovimentadas = obj.buscarLocacoesMovimentadas;
    this.metadados =  new MetadadosFiltroModel(obj.metadados);
    this.gravadoPeloUsuario = obj.gravadoPeloUsuario || false;
  }

  preencherDataEmissaoPadrao() {
    // A data padrão sempre será a semana atual
    var dataInicial = new Date();
    var dataFinal = new Date();
     
    dataInicial.setDate(dataInicial.getDate() - dataInicial.getDay());

    this.dataEmissaoInicial = dataUtils.formatarDataEHoraIso(dataInicial);
    this.dataEmissaoFinal = dataUtils.formatarDataEHoraIso(dataFinal, '23:59:59');

  }

  gruposDeFiltrosAtivos() {
    let filtrosAtivos = [];

    this.codigo && filtrosAtivos.push(FILTROS_PESQUISA.CODIGO);
    (this.listaDeStatus.length > 0) && filtrosAtivos.push(FILTROS_PESQUISA.STATUS);
    this.idCliente && filtrosAtivos.push(FILTROS_PESQUISA.IDENTIFICADOR_CLIENTE);
    (this.dataEmissaoInicial || this.dataEmissaoFinal) && filtrosAtivos.push(FILTROS_PESQUISA.DATA_EMISSAO);
    (this.dataInicialReferencia || this.dataFinalReferencia) && filtrosAtivos.push(FILTROS_PESQUISA.DATA_DE_REFERENCIA);
    (this.dataInicioContrato || this.dataTerminoContrato) && filtrosAtivos.push(FILTROS_PESQUISA.DATA_CONTRATO);

    return filtrosAtivos;
  }

  removerFiltrosPorGrupo(grupo) {
    switch(grupo){
      case FILTROS_PESQUISA.CODIGO:
        this.codigo = undefined;
      break;
      case FILTROS_PESQUISA.STATUS:
        this.listaDeStatus = [];
      break;
      case FILTROS_PESQUISA.IDENTIFICADOR_CLIENTE:
        this.idCliente = undefined;
        this.metadados.cliente = undefined
      break;
      case FILTROS_PESQUISA.DATA_EMISSAO:
        this.dataEmissaoInicial = undefined;
        this.dataEmissaoFinal = undefined;
        this.metadados.periodoEmissao = undefined;
      break;
      case FILTROS_PESQUISA.DATA_DE_REFERENCIA:
        this.dataInicialReferencia = undefined;
        this.dataFinalReferencia = undefined;
      break;
      case FILTROS_PESQUISA.DATA_CONTRATO:
        this.dataInicioContrato = undefined;
        this.dataTerminoContrato = undefined;
      break;
    }
  }
}