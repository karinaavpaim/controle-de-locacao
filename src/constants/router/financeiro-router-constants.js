'use strict';

import * as config from '../../../vue.enviroment.config';

const caminhoBase = config.V3UrlBase + 'financeiro/';
const caminhoBaseDespesasDeViagem = caminhoBase + 'despesas-de-viagem/';
const caminhoBaseRegistroDeDespesas = caminhoBase + 'registro-de-despesas/';

const ROTAS_FINANCEIRO_METADATA = 
{
  despesasDeViagemAgrupadasPorPessoa: {
    path: caminhoBaseDespesasDeViagem + 'despesas-de-viagem-agrupadas-por-pessoa',
    name: 'DespesasDeViagemAgrupadasPorPessoa',
    title: 'Despesas de viagem agrupadas por pessoa',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Despesas de viagem',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'despesaViagem/porPessoa');
    },
  },
  despesasDeViagemIndividuais: {
    path: caminhoBaseDespesasDeViagem + 'despesas-de-viagem-individuais',
    name: 'DespesasDeViagemIndividuais',
    title: 'Despesas de viagem individuais',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Despesas de viagem',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'despesaViagem');
    },
  },
  novaSolicitaçãoDeAdiantamento: {
    path: caminhoBaseRegistroDeDespesas + 'nova-solicitacao-de-adiantamento',
    name: 'NovaSolicitacaoDeAdiantamento',
    title: 'Nova solicitação de adiantamento',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Registro de despesas',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'financeiro/nova-solicitacao-adiantamento');
    },
  },
  solicitaçõesDeAdiantamento: {
    path: caminhoBaseRegistroDeDespesas + 'solicitacoes-de-adiantamento',
    name: 'SolicitacoesDeAdiantamento',
    title: 'Solicitações de adiantamento',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Registro de despesas',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'financeiro/solicitacoes-adiantamento');
    },
  },
  prestarContas: {
    path: caminhoBaseRegistroDeDespesas + 'prestar-contas',
    name: 'PrestarContas',
    title: 'Prestar contas',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Registro de despesas',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'financeiro/prestar-contas');
    },
  },
  consultarPrestacaesDeContas: {
    path: caminhoBaseRegistroDeDespesas + 'consultar-prestacoes-de-contas',
    name: 'ConsultarPrestacoesDeContas',
    title: 'Consultar prestações de contas',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Registro de despesas',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'financeiro/consulta-prestacoes-contas');
    },
  },
  saldoDeFuncionarios: {
    path: caminhoBaseRegistroDeDespesas + 'saldo-de-funcionarios',
    name: 'SaldoDeFuncionarios',
    title: 'Saldo de funcionários',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Registro de despesas',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'financeiro/saldo-funcionarios');
    },
  },
  extrato: {
    path: caminhoBaseRegistroDeDespesas + 'extrato',
    name: 'Extrato',
    title: 'Extrato',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Registro de despesas',
    familia: 'Financeiro',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.V2UrlBase, 'financeiro/extrato');
    },
  }
};


export { 
  ROTAS_FINANCEIRO_METADATA
};