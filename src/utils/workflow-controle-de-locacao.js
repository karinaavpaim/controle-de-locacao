'use strict';
import { STATUS_ORCAMENTO_LOCACAO, OPCOES_MENU } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";

function obterListaComProximosStatusParaControleDoOrcamento(orcamento) {
  var status = [];
  switch (orcamento.status) {

    case STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO)
      status.push(STATUS_ORCAMENTO_LOCACAO.PRONTO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.PRONTO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.PRONTO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.AGUARDANDO);
      status.push(STATUS_ORCAMENTO_LOCACAO.APROVADO);
      status.push(STATUS_ORCAMENTO_LOCACAO.REPROVADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.REPROVADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.REPROVADO);
      status.push(STATUS_ORCAMENTO_LOCACAO.REVISAO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.APROVADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.APROVADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.LIBERADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.EXECUCAO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.FINALIZADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.CANCELADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.EXCLUIDO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.EXCLUIDO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.REVISAO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.REVISAO);
      status.push(STATUS_ORCAMENTO_LOCACAO.PRONTO);
      break;
  }

  return status;
}

function obterListaComProximosStatusParaGestaoDeLocacao(orcamento) {
  var status = [];
  switch (orcamento.status) {
    case STATUS_ORCAMENTO_LOCACAO.APROVADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.APROVADO);
      status.push(STATUS_ORCAMENTO_LOCACAO.LIBERADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.LIBERADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.EXECUCAO);
      status.push(STATUS_ORCAMENTO_LOCACAO.FINALIZADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.FINALIZADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.CANCELADO);
      break;
  }

  return status;
}

function obterListaComProximosStatusParaMovimentacaoDeLocacao(orcamento) {
  var status = [];
  switch (orcamento.status) {
    case STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.LIBERADO);
      break;
    case STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor:
      status.push(STATUS_ORCAMENTO_LOCACAO.EXECUCAO);
      break;
  }

  return status;
}

function obterListaDeOpcoesParaControleDoOrcamento(orcamento, opcoesMenu) {
  let opcoes = [];

  _orcamentoPodeSerCancelado(orcamento) && opcoes.push(opcoesMenu.CANCELAR);
  _orcamentoPodeSerExcluido(orcamento) && opcoes.push(opcoesMenu.EXCLUIR);
  _orcamentoPodeGerarProposta(orcamento) && opcoes.push(opcoesMenu.GERAR_PROPOSTA);
  _orcamentoPodeEditarProposta(orcamento) && opcoes.push(opcoesMenu.EDITAR_PROPOSTA);
  _orcamentoPodeImprimirProposta(orcamento) && opcoes.push(opcoesMenu.IMPRIMIR_PROPOSTA);  
  _orcamentoPodeExcluirProposta(orcamento) && opcoes.push(opcoesMenu.EXCLUIR_PROPOSTA);
  return opcoes;
}
function obterListaDeOpcoesParaGestao(orcamento, opcoesMenu) {
  let opcoes = [];

  _orcamentoPodeSerCancelado(orcamento) && opcoes.push(opcoesMenu.CANCELAR);
  _orcamentoPodeGerarAditivo(orcamento) && opcoes.push(opcoesMenu.GERAR_ADITIVO);
  
  return opcoes;
}

function orcamentoPodeSerEditado(orcamento){
  return _orcamentoPodeSerEditado(orcamento);
}

function orcamentoPodeSerAjustado(orcamento){
  return _orcamentoPodeSerAjustado(orcamento);
}

function opcaoCancelarPodeSerDesabilitadaNoOrcamento(orcamento, opcao) {
  if (opcao.nome === OPCOES_MENU.CANCELAR.nome) {
    return !(orcamento.status === STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor ||
             orcamento.status === STATUS_ORCAMENTO_LOCACAO.PRONTO.valor ||
             orcamento.status === STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor ||
             orcamento.status === STATUS_ORCAMENTO_LOCACAO.APROVADO.valor ||
             orcamento.status === STATUS_ORCAMENTO_LOCACAO.REPROVADO.valor);
  }

  return false;
}

function _orcamentoPodeExcluirProposta(orcamento) {
  return orcamento.status === STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor;
}

function _orcamentoPodeSerCancelado(orcamento) {
  return !!(orcamento.status !== STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor && 
    orcamento.status !== STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor);
}

function _orcamentoPodeSerExcluido(orcamento) {
  return !!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.PRONTO.valor);
}

function _orcamentoPodeGerarAditivo(orcamento) {
  return !!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor);
}

function _orcamentoPodeSerEditado(orcamento) {
  return !!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.PRONTO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.REVISAO.valor);
}

function _orcamentoPodeSerAjustado(orcamento) {
  return !!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor);
}

function _orcamentoPodeGerarProposta(orcamento) {
  return !!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.PRONTO.valor);
}

function _orcamentoPodeImprimirProposta(orcamento) {
  return !!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.APROVADO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.REPROVADO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor ||
    orcamento.status === STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor);
}

function _orcamentoPodeEditarProposta(orcamento) {
  return orcamento.status === STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor;
}

export {
  obterListaDeOpcoesParaControleDoOrcamento,
  obterListaDeOpcoesParaGestao,
  obterListaComProximosStatusParaControleDoOrcamento,
  obterListaComProximosStatusParaGestaoDeLocacao,
  obterListaComProximosStatusParaMovimentacaoDeLocacao,
  orcamentoPodeSerEditado,
  orcamentoPodeSerAjustado,
  opcaoCancelarPodeSerDesabilitadaNoOrcamento
};