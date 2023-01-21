'use strict';

import * as config from '../../../vue.enviroment.config';
import { ACESSOS_BIMER_UP } from '../geral/usuario/sistema-acesso-constants.js';

const caminhoBase = config.V3UrlBase + 'faturamento/';
const controleDeLocacao = caminhoBase + 'controle-de-locacao/';

const ROTAS_FATURAMENTO_METADATA =
{
  dashboardLocacao: {
    name: 'DashboardDeLocacao',
    title: 'Dashboard',
    icon: 'mdi-18px mdi-chart-donut',
    path: controleDeLocacao + 'dashboard',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.SELF,
    menuSecundario: true,
    agrupamento: 0
  },
  controleDeOrcamentoDeLocacao: {
    name: 'ControleDeOrcamentoDeLocacao',
    title: 'Orçamentos',
    icon: 'mdi-18px mdi-file-document-outline',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    path: controleDeLocacao + 'orcamentos',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.SELF,
    menuSecundario: true,
    agrupamento: 1
  },
  novoOrcamentoLocacao: {
    name: 'NovoOrcamentoDeLocacao',
    title: 'Novo orçamento',
    path: controleDeLocacao + 'orcamentos/cadastrar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.NOVO,
    agrupamento: 1
  },
  editarOrcamentoLocacao: {
    name: 'EditarOrcamentoDeLocacao',
    title: 'Editar orçamento',
    path: controleDeLocacao + 'orcamentos/:idOrcamento/editar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props:true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EDITAR,
    agrupamento: 1
  },
  duplicarOrcamentoLocacao: {
    name: 'DuplicarOrcamentoDeLocacao',
    title: 'Duplicar orçamento',
    path: controleDeLocacao + 'orcamentos/:idOrcamento/duplicar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props:true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.DUPLICAR,
    agrupamento: 1
  },
  geracaoDePropostaDeLocacao: {
    name: 'GeracaoDePropostaDeLocacao',
    title: 'Gerar proposta',
    path: controleDeLocacao + 'orcamentos/:idOrcamento/proposta',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.GERAR_PROPOSTA,
    agrupamento: 1
  },
  edicaoDePropostaDeLocacao: {
    name: 'EdicaoDePropostaDeLocacao',
    title: 'Editar proposta',
    path: controleDeLocacao + 'orcamentos/:idOrcamento/proposta',
    query: { editar: true },
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EDITAR_PROPOSTA,
    agrupamento: 1
  },
  controleDeGestaoDeLocacao: {
    name: 'ControleDeGestaoDeLocacao',
    title: 'Gestão',
    path: controleDeLocacao + 'gestao',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'mdi-18px mdi-finance',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.SELF,
    menuSecundario: true,
    agrupamento: 2
  },
  ajustarLocacao: {
    name: 'AjustarLocacao',
    title: 'Ajustar',
    path: controleDeLocacao + 'gestao/:idOrcamento/editar',
    query: { ajuste: true },
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props:true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.AJUSTAR,
    agrupamento: 2
  },
  geracaoDeAditivoDeProposta: {
    name: 'GeracaoDeAditivoDeProposta',
    title: 'Gerar aditivo',
    path: controleDeLocacao + 'gestao/:idOrcamento/aditivo',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.GERAR_ADITIVO,
    agrupamento: 2
  },
  analiseDeResultados: {
    name: 'AnaliseDeResultados',
    title: 'Análise de resultados',
    icon: 'assignment',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    path: controleDeLocacao + 'gestao/:idLocacao/analise-de-resultados',
    help: 'https://ajuda.alterdata.com.br/bw',
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.RESULTADO,
    agrupamento: 2
  },
  movimentacaoDeLocacao: {
    name: 'MovimentacaoDeLocacao',
    title: 'Movimentação',
    icon: 'mdi-18px mdi-dolly',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    path: controleDeLocacao + 'movimentacao',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.SELF,
    menuSecundario: true,
    agrupamento: 3
  },
  requisicaoDeLocacao: {
    name: 'RequisicaoDeLocacao',
    title: 'Requisição',
    icon: 'assignment',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    path: controleDeLocacao + 'movimentacao/:idLocacao/requisicao',
    help: config.help,
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.REQUISITAR,
    agrupamento: 3
  },
  expedicaoDeLocacao: {
    name: 'ExpedicaoDeLocacao',
    title: 'Expedição',
    icon: 'assignment',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    path: controleDeLocacao + 'movimentacao/:idLocacao/expedicao',
    help: 'https://ajuda.alterdata.com.br/bw',
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.EXPEDIR,
    agrupamento: 3
  },
  medicaoDeLocacao: {
    name: 'MedicaoDeLocacao',
    title: 'Medição',
    icon: 'assignment',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    path: controleDeLocacao + 'movimentacao/:idLocacao/medicao',
    help: 'https://ajuda.alterdata.com.br/bw',
    naoExibir: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.MEDIR,
    agrupamento: 3
  },
  controleDeModelosDeProposta: {
    name: 'ControleDeModelosDeProposta',
    title: 'Modelos',
    path: controleDeLocacao + 'controle-modelos-proposta',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'mdi-18px mdi-file-document-edit-outline',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.SELF,
    menuSecundario: true,
    agrupamento: 4
  },
  modeloPropostaLocacao: {
    name: 'ModeloPropostaLocacao',
    title: 'Modelos',
    path: controleDeLocacao + 'controle-modelos-proposta/modelo-proposta/cadastrar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props:true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.NOVO,
    agrupamento: 4
  },
  edicaoDeModeloPropostaLocacao: {
    name: 'EdicaoDeModeloPropostaLocacao',
    title: 'Modelos',
    path: controleDeLocacao + 'controle-modelos-proposta/:idModelo/editar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.EDITAR,
    agrupamento: 4
  },    
  controleDeAdicionaisPersonalizados: {
    name: 'ControleDeAdicionaisPersonalizados',
    title: 'Adicionais personalizados',
    path: controleDeLocacao + 'controle-adicionais-personalizados',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'mdi-18px mdi-file-percent',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.SELF,
    menuSecundario: true,
    agrupamento: 5
  },
  modeloAdicionaisPersonalizados: {
    name: 'ModeloAdicionaisPersonalizados',
    title: 'Novo adicional personalizado',
    path: controleDeLocacao + 'controle-adicionais-personalizados/cadastrar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props:true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.NOVO,
    agrupamento: 5
  },
  edicaoDeModeloAdicionaisPersonalizados: {
    name: 'EdicaoDeModeloAdicionaisPersonalizados',
    title: 'Adicionais personalizados',
    path: controleDeLocacao + 'controle-adicionais-personalizados/:idModelo/editar',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'assignment_turned_in',
    help: config.help,
    naoExibir: true,
    props: true,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.EDITAR,
    agrupamento: 5
  },
  configuracaoControleLocacao: {
    name: 'ConfiguracaoControleLocacao',
    title: 'Configurações',
    path: controleDeLocacao + 'configuracao',
    familia: 'Faturamento',
    grupo: 'Controle de locação',
    icon: 'mdi-18px mdi-settings',
    help: config.help,
    naoExibir: false,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.CONFIGURACAO.SELF,
    menuSecundario: true,
    agrupamento: 6
  }
};

export {
  ROTAS_FATURAMENTO_METADATA
};