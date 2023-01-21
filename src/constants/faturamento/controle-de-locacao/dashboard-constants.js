import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";

const STATUS_LOCACAO = {
  EM_DIGITACAO: {
    nome: 'Em digitação',
    cor_de_fundo: '#009faf',
    icone: 'mdi-circle-edit-outline',
    cor_do_icone: '#e0f7fa',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
  },
  PRONTO: {
    nome: 'Pronto',
    cor_de_fundo: '#af8eb5',
    icone: 'mdi-checkbox-marked-circle-outline',
    cor_do_icone: '#f3e5f5',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
  },
  AGUARDANDO: {
    nome: 'Aguardando',
    cor_de_fundo: '#8d8d8d',
    icone: 'mdi-alarm',
    cor_do_icone: '#f5f5f5',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
  },
  APROVADO: {
    nome: 'Aprovado',
    cor_de_fundo: '#66bb6a',
    icone: 'mdi-checkbox-marked-circle',
    cor_do_icone: '#e8f5e9',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name
  },
  REPROVADO: {
    nome: 'Reprovado',
    cor_de_fundo: '#ef9a9a',
    icone: 'mdi-close-circle',
    cor_do_icone: '#ffebee',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
  },
  REVISAO: {
    nome: 'Revisão',
    cor_de_fundo: '#ffb74d',
    icone: 'mdi-file-find',
    cor_do_icone: '#fff8e1',
    classe: 'tamanho-icone-arquivo-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
  },
  LIBERADO: {
    nome: 'Liberado',
    cor_de_fundo: '#4f9a94',
    icone: 'mdi-file-check-outline',
    cor_do_icone: '#e0f2f1',
    classe: 'tamanho-icone-arquivo-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.name
  },
  EXECUCAO: {
    nome: 'Execução',
    cor_de_fundo: '#65499c',
    icone: 'mdi-circle-slice-3',
    cor_do_icone: '#e8eaf6',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.name
  },
  FINALIZADO: {
    nome: 'Finalizado',
    cor_de_fundo: '#0077c2',
    icone: 'mdi-file-check',
    cor_do_icone: '#e3f2fd',
    classe: 'tamanho-icone-arquivo-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name
  },
  CANCELADO: {
    nome: 'Cancelado',
    cor_de_fundo: '#ef5350',
    icone: 'mdi-cancel',
    cor_do_icone: '#ffebee',
    classe: 'tamanho-icone-cartao',
    rota: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
  }
}

const CATEGORIA_ITEM = {
  EQUIPAMENTO: {
    valor: 'EQUIPAMENTO',
    titulo: 'Top 10 equipamentos mais contratados',
    nome: 'Equipamentos'
  },
  MATERIAL: {
    valor: 'MATERIAL',
    titulo: 'Top 10 materiais mais contratados',
    nome: 'Materiais'
  },
  SERVICO: {
    valor: 'SERVICO',
    titulo: 'Top 10 serviços mais contratados',
    nome: 'Serviços'
  }
};

const PERIODO_VISUALIZACAO = {
  ULTIMOS_7_DIAS: {
    descricao: 'Últimos 7 dias',
    valorEmDias: 7
  },
  ULTIMOS_30_DIAS: {
    descricao: 'Últimos 30 dias',
    valorEmDias: 30
  },
  ULTIMOS_90_DIAS: {
    descricao: 'Últimos 90 dias',
    valorEmDias: 90
  },
  ULTIMOS_180_DIAS: {
    descricao: 'Últimos 180 dias',
    valorEmDias: 180
  },
};

const PERIODO_VISUALIZACAO_LISTA = Object.values(PERIODO_VISUALIZACAO);

const CHAVE_STORAGE_FILTROS_DASHBOARD = "filtros-dashboard";

export {
  STATUS_LOCACAO,
  CATEGORIA_ITEM,
  PERIODO_VISUALIZACAO,
  PERIODO_VISUALIZACAO_LISTA,
  CHAVE_STORAGE_FILTROS_DASHBOARD
};