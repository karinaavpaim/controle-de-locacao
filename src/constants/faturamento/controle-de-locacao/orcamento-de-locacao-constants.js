import { TIPOS_DE_DADO, ALINHAMENTOS } from "@/constants/comum/tabela-generica-constants";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";

// Somente os status que podem ser alterados manualmente possuem acesso.
const STATUS_ORCAMENTO_LOCACAO = {
  EM_DIGITACAO: {
    valor: 'EM_DIGITACAO',
    descricao: 'Em digitação',
    classeExibicao: 'chip-exibicao-status-orcamento-em-digitacao',
    classeSelecao: 'chip-color-em-digitacao',
    codigoBackend: 0
  },
  AGUARDANDO: {
    valor: 'AGUARDANDO',
    descricao: 'Aguardando',
    classeExibicao: 'chip-exibicao-status-orcamento-aguardando',
    classeSelecao: 'chip-color-aguardando',
    codigoBackend: 1
  },
  APROVADO: {
    valor: 'APROVADO',
    descricao: 'Aprovado',
    classeExibicao: 'chip-exibicao-status-orcamento-aprovado',
    classeSelecao: 'chip-color-aprovado',
    codigoBackend: 2,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.STATUS_APROVADO
  },
  REPROVADO: {
    valor: 'REPROVADO',
    descricao: 'Reprovado',
    classeExibicao: 'chip-exibicao-status-orcamento-reprovado',
    classeSelecao: 'chip-color-reprovado',
    codigoBackend: 2,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.STATUS_REPROVADO
  },
  CANCELADO: {
    valor: 'CANCELADO',
    descricao: 'Cancelado',
    classeExibicao: 'chip-exibicao-status-orcamento-cancelado',
    classeSelecao: 'chip-color-cancelado',
    codigoBackend: 3
  },
  PRONTO: {
    valor: 'PRONTO',
    descricao: 'Pronto',
    classeExibicao: 'chip-exibicao-status-orcamento-pronto',
    classeSelecao: 'chip-color-pronto',
    codigoBackend: 4,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.STATUS_PRONTO
  },
  REVISAO: {
    valor: 'REVISAO',
    descricao: 'Revisão',
    classeExibicao: 'chip-exibicao-status-orcamento-revisao',
    classeSelecao: 'chip-color-revisao',
    codigoBackend: 5,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.STATUS_REVISAO
  },
  EXCLUIDO: {
    valor: 'EXCLUIDO',
    descricao: 'Excluído',
    classeExibicao: 'chip-exibicao-status-orcamento-excluido',
    classeSelecao: 'chip-color-excluido',
    codigoBackend: 6
  },
  LIBERADO: {
    valor: 'LIBERADO',
    descricao: 'Liberado',
    classeExibicao: 'chip-exibicao-status-orcamento-liberado',
    classeSelecao: 'chip-color-liberado',
    codigoBackend: 7,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.STATUS_LIBERADO
  },
  EXECUCAO: {
    valor: 'EXECUCAO',
    descricao: 'Execução',
    classeExibicao: 'chip-exibicao-status-orcamento-execucao',
    classeSelecao: 'chip-color-execucao',
    codigoBackend: 8
  },
  FINALIZADO: {
    valor: 'FINALIZADO',
    descricao: 'Finalizado',
    classeExibicao: 'chip-exibicao-status-orcamento-finalizado',
    classeSelecao: 'chip-color-finalizado',
    codigoBackend: 9,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.STATUS_FINALIZADO
  }
};

const OPCOES_MENU = {
  EDITAR_ORCAMENTO: {
    nome: 'EDITAR_ORCAMENTO',
    titulo: 'Editar',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EDITAR
  },
  DUPLICAR_ORCAMENTO: {
    nome: 'DUPLICAR_ORCAMENTO',
    titulo: 'Duplicar',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.DUPLICAR
  },
  CANCELAR: {
    nome: 'CANCELAR',
    titulo: 'Cancelar',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.CANCELAR
  },
  EXCLUIR: {
    nome: 'EXCLUIR',
    titulo: 'Excluir',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EXCLUIR
  },  
  GERAR_PROPOSTA: {
    nome: 'GERAR_PROPOSTA',
    titulo: 'Gerar proposta',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.GERAR_PROPOSTA
  },
  EDITAR_PROPOSTA: {
    nome: 'EDITAR_PROPOSTA',
    titulo: 'Editar proposta',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EDITAR_PROPOSTA
  },
  IMPRIMIR_PROPOSTA: {
    nome: 'IMPRIMIR_PROPOSTA',
    titulo: 'Imprimir proposta',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.IMPRIMIR_PROPOSTA
  },
  EXCLUIR_PROPOSTA: {
    nome: 'EXCLUIR_PROPOSTA',
    titulo: 'Excluir proposta',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EXCLUIR_PROPOSTA
  },
  AJUSTAR_LOCACAO: {
    nome: 'AJUSTAR_LOCACAO',
    titulo: 'Ajustar',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.AJUSTAR
  },
  GERAR_RESULTADO: {
    nome: 'GERAR_RESULTADO',
    titulo: 'Analisar resultados',
    metodo: () => {},
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.RESULTADO
  },
  CANCELAR_LOCACAO: {
    nome: 'CANCELAR_LOCACAO',
    titulo: 'Cancelar',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.CANCELAR
  },
  //Ver a questão de acesso no Bimer em relação a isso
  GERAR_ADITIVO: {
    nome: 'GERAR_ADITIVO',
    titulo: 'Gerar aditivo',
    metodo: () => { },
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.GERAR_ADITIVO
  },
};

const STATUS_ORCAMENTO_LOCACAO_LISTA = [
  STATUS_ORCAMENTO_LOCACAO.AGUARDANDO,
  STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO,
  STATUS_ORCAMENTO_LOCACAO.APROVADO,
  STATUS_ORCAMENTO_LOCACAO.REPROVADO,
  STATUS_ORCAMENTO_LOCACAO.REVISAO,
  STATUS_ORCAMENTO_LOCACAO.CANCELADO,
  STATUS_ORCAMENTO_LOCACAO.PRONTO,
  STATUS_ORCAMENTO_LOCACAO.EXCLUIDO,
  STATUS_ORCAMENTO_LOCACAO.LIBERADO,
  STATUS_ORCAMENTO_LOCACAO.EXECUCAO,
  STATUS_ORCAMENTO_LOCACAO.FINALIZADO
];

const STATUS_GESTAO_LOCACAO_LISTA = [
  STATUS_ORCAMENTO_LOCACAO.APROVADO,
  STATUS_ORCAMENTO_LOCACAO.CANCELADO,
  STATUS_ORCAMENTO_LOCACAO.LIBERADO,
  STATUS_ORCAMENTO_LOCACAO.EXECUCAO,
  STATUS_ORCAMENTO_LOCACAO.FINALIZADO
];

const COLUNAS_TABELA_ORCAMENTO_LOCACAO = [
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'codigo',
    width: "100px",
    class: 'selo-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Cliente',
    align: 'left',
    sortable: true,
    value: 'nomeCliente',
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Status',
    align: 'center',
    sortable: true,
    value: 'descricaoStatus',
    width: "120px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Emissão',
    align: 'center',
    sortable: true,
    value: 'dataEmissaoIso', // Exibida com máscara, utilizada para ordenação.
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    value: 'dataEmissaoFormatada',
    class: 'tabela-coluna-oculta',
    posicao_valor: ALINHAMENTOS.OCULTO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Referência',
    align: 'center',
    sortable: true,
    value: 'dataReferenciaIso', // Exibida com máscara, utilizada para ordenação.
    width: "110px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    value: 'dataReferenciaFormatada',
    class: 'tabela-coluna-oculta',
    posicao_valor: ALINHAMENTOS.OCULTO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Total',
    align: 'right',
    sortable: true,
    value: 'totalValor', // Exibido com máscara, utilizado para ordenação.
    width: "120px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    value: 'totalFormatado',
    class: 'tabela-coluna-oculta',
    posicao_valor: ALINHAMENTOS.OCULTO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: 'botoes',
    width: '140px',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const PERIODO_EMISSAO = {
  ULTIMOS_3_DIAS: {
    descricao: 'Últimos 3 dias',
    valor: 'ULTIMOS_3_DIAS'
  },
  ESSA_SEMANA: {
    descricao: 'Essa semana',
    valor: 'ESSA_SEMANA'
  },
  SEMANA_PASSADA: {
    descricao: 'Semana passada',
    valor: 'SEMANA_PASSADA'
  },
  ESSE_MES: {
    descricao: 'Esse mês',
    valor: 'ESSE_MES'
  },
  SELECIONAR_DATA: {
    descricao: 'Selecionar data',
    valor: 'SELECIONAR_DATA'
  }
};

const PERIODO_EMISSAO_LISTA = [
  PERIODO_EMISSAO.ULTIMOS_3_DIAS,
  PERIODO_EMISSAO.ESSA_SEMANA,
  PERIODO_EMISSAO.SEMANA_PASSADA,
  PERIODO_EMISSAO.ESSE_MES,
  PERIODO_EMISSAO.SELECIONAR_DATA
];

const TIPOS_DE_CONTRATO = {
  LOCACAO: {
    descricao: 'Locação',
    valor: 'LOCACAO'
  },
  SERVICO: {
    descricao: 'Serviço',
    valor: 'SERVICO'
  },
  MANUTENCAO: {
    descricao: 'Manutenção',
    valor: 'MANUTENCAO'
  },
  FABRICACAO: {
    descricao: 'Fabricação',
    valor: 'FABRICACAO'
  }
};

const CATEGORIAS_ITENS_ORCAMENTO_LOCACAO = {
  EQUIPAMENTO: { descricao: 'Equipamento', valor: 'EQUIPAMENTO', identificador: 0 },
  SERVICO: { descricao: 'Serviço', valor: 'SERVICO', identificador: 1 },
  MATERIAL: { descricao: 'Material', valor: 'MATERIAL', identificador: 2 }
};

const COLUNAS_TABELA_GESTAO_LOCACAO = [
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Cliente',
    align: 'left',
    sortable: true,
    value: 'nomeCliente',
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Status',
    align: 'center',
    sortable: true,
    value: 'descricaoStatus',
    width: "120px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Início do contrato',
    align: 'center',
    sortable: false,
    value: 'dataInicioContratoIso', // Exibida com máscara, utilizada para ordenação.
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    value: 'dataInicioContratoFormatada', // Utilizada para pesquisa no grid.
    class: 'tabela-coluna-oculta',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Término do contrato',
    align: 'center',
    sortable: false,
    value: 'dataTerminoContratoIso', // Exibida com máscara, utilizada para ordenação.
    width: "142px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    value: 'dataTerminoContratoFormatada', // Utilizada para pesquisa no grid.
    class: 'tabela-coluna-oculta',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  /* {
    text: 'Evolução',
    align: 'center',
    sortable: true,
    value: 'totalValor', // Exibido com máscara, utilizado para ordenação.
    width: "150px"
  }, */
  {
    value: 'totalFormatado', // Utilizada para pesquisa no grid.
    class: 'tabela-coluna-oculta',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: 'botoes',
    width: '140px', //'220px'
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const TIPOS_DE_CONTRATO_LISTA = [
  TIPOS_DE_CONTRATO.LOCACAO,
  TIPOS_DE_CONTRATO.SERVICO,
  TIPOS_DE_CONTRATO.MANUTENCAO,
  TIPOS_DE_CONTRATO.FABRICACAO
];

const FILTROS_PESQUISA = {
  CODIGO: {
    descricao: "Código",
    valor: "codigo"
  },
  DATA_EMISSAO: {
    descricao: "Data de emissão",
    valor: {
      INICIAL: "dataInicialEmissao",
      FINAL: "dataFinalEmissao"
    }
  },
  DATA_CONTRATO: {
    descricao: "Período do contrato",
    valor: {
      INICIO: "dataInicioContrato",
      TERMINO: "dataTerminoContrato"
    }
  },
  DATA_DE_REFERENCIA: {
    descricao: "Data de referência",
    valor: {
      INICIAL: "dataInicialReferencia",
      FINAL: "dataFinalReferencia"
    }
  },
  EMPRESA: {
    descricao: "Empresa",
    valor: "empresa"
  },
  IDENTIFICADOR_ORCAMENTO: {
    descricao: "Orçamento",
    valor: "identificador"
  },
  IDENTIFICADOR_CLIENTE: {
    descricao: "Cliente",
    valor: "identificadorCliente"
  },
  STATUS: {
    descricao: "Status",
    valor: "listaStatus"
  }
}

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO = [
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'codigo',
    width: "100px"
  },
  {
    text: 'Cliente',
    align: 'left',
    sortable: true,
    value: 'nomeCliente'
  },
  {
    text: 'Status',
    align: 'center',
    sortable: true,
    value: 'descricaoStatus',
    width: "120px"
  },
  {
    text: 'Início do contrato',
    align: 'center',
    sortable: false,
    value: 'dataEmissaoIso', // Exibida com máscara, utilizada para ordenação.
    width: "150px"
  },
  {
    text: 'Término do contrato',
    align: 'center',
    sortable: false,
    value: 'dataReferenciaIso', // Exibida com máscara, utilizada para ordenação.
    width: "150px"
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: 'botoes',
    width: '140px'//'220px'
  }
];

const DETALHES_ORCAMENTO_GRAPHQL = `
codigo,
identificador,
idEntidadeOrigem,
dataReferencia,
dataEmissao,
dataInicioContrato,
dataTerminoContrato,
codigoEnderecoEntrega,
codigoEnderecoCobranca,
codigoEnderecoDestinatario,
descricao,
nomePessoaDeContatoCliente,
emailPessoaDeContatoCliente,
telefonePessoaDeContatoCliente,
observacao,
possuiItemComProdutoPadrao,
possuiItemMovimentado,
status,
revisao,  
totalEquipamentos,
totalServicos,
totalMateriais,
totalDespesas,
totalOrcamento,
adicionalPersonalizado{
  identificador,
  codigo,
  descricao,
  itens {
    aliquota,
    atualizaDespesas,
    atualizaEquipamentos,
    atualizaMateriais,
    atualizaServicos,
    descricao,
    identificador,
    revisao
  }
},
adicionalPersonalizadoItens {
  adicionalPersonalizadoItem {
    identificador,
    descricao,
    revisao,
  },
  identificador,
  identificadorOrcamento,
  revisao,
  valorTotalAdicionalPersonalizado
},
despesas{
  naturezaLancamento{
    codigo,
    identificador,
    nome,
    codigoNome,
    ativo,
    tipo,
    classificacao,
    identificadorNaturezaLancamentoPai
  },
  valorItem,
  valorAdicionalPersonalizado,
  quantidade,
  identificador,
  medirPeloOrcado,
  incluidoNaGestao,
  movimentado,
  status,
  identificadorEntidadeOrigem
},
cliente{
  codigo,
  codigoNome,
  codigoNomeCPFouCNPJ,
  CPFouCNPJ,
  categorias {
    identificador,
    nome
  },
  identificador,
  nome,
  nomeCurto,
  tipoPessoa,
  enderecos{
    ativo,
    bairro{
      codigo,
      identificador,
      nome
    },
    cep,
    cidade{
      codigo,
      identificador,
      nome,
      UF{
        nome,
        sigla
      }
    },
    codigo,
    complemento,
    inscricaoEstadual,
    inscricaoMunicipal,
    nomeLogradouro,
    numeroLogradouro,
    observacao,
    pessoasDeContato {
      contatoPrincipal,
      contatos {
        descricao,
        tipo,
      },
      identificador,
      nome,
      telefoneFixo,
      telefoneCelular,
      email
    },
    tiposEndereco
  }
},
empresa{
  identificador,
  codigo,
  nome,
  codigoNome,
  CNPJ,
  nomeCurto,
  endereco {
    ativo,
    bairro {
      codigo,
      identificador,
      nome,
    },
    bairroCidadeUnidadeFederativaCep,
    cep,
    cidade {
      codigo,
      codigoDDD,
      codigoIBGE,
      identificador,
      nome,
      UF {
        codigoIBGE,
        nome,
        sigla,
      }
    },
    codigo,
    codigoSuframa,
    complemento,
    inscricaoEstadual,
    inscricaoMunicipal,
    latitude,
    longitude,
    nomeLogradouro,
    numeroLogradouro,
    observacao,
    pessoasDeContato {
      contatoPrincipal,
      contatos {
        descricao,
        tipo,
      },
      identificador,
      nome,
      telefoneFixo,
      telefoneCelular,
      email
    },
    tipoNomeNumeroComplementoLogradouro,
    tiposEndereco
  },
},
itens {
  identificador,
  identificadorEntidadeOrigem,
  preco {
    identificador,
    nome,
    codigo,
  },
  produto{
    ativoVenda,
    identificador,
    nome, 
    codigo,
    codigoNome
  },
  descricao,
  categoria,
  quantidade,
  quantidadeDiarias,
  diariasJaMedidas,
  valorUnitario,
  valorAcrescimo,
  valorDesconto,
  valorAdicionalPersonalizado,
  dataInicialLocacao,
  dataFinalLocacao,
  medirPeloOrcado,
  incluidoNaGestao,
  movimentado,
  status,
  repasses{
    identificador,
    aliquotaDuplicata,
    aliquotaFaturamento,
    pessoa{
      identificador,
      codigo,
      nome,
      codigoNome,
      nomeCurto,
      CPFouCNPJ,
      categorias{
        identificador,
        nome
      }
    }
  }
},
formaPagamentoEntrada{
  codigo,
  codigoNome,
  identificador,
  nome
},
formaPagamentoParcelas{
  codigo,
  codigoNome,
  identificador,
  nome
},
prazo{
  ativo,
  codigoClassificacao,
  codigo,
  codigoNome,
  identificador,
  identificadoresEmpresa,
  nome,
  tipo,
  tipoClassificacao,
  formasPagamentosEntrada{
    codigo,
    codigoNome,
    identificador,
    nome,
    itens{
      identificadorEmpresa,
      identificador,
      numeroParcelasCliente,
      numeroParcelasRecebimento,
      numeroDiasRecebimento,
      numeroDiasIntervalo
    }
  }
  formasPagamentosParcelas{
    codigo,
    codigoNome,
    identificador,
    nome,
    itens{
      identificadorEmpresa,
      identificador,
      numeroParcelasCliente,
      numeroParcelasRecebimento,
      numeroDiasRecebimento,
      numeroDiasIntervalo
    }
  }
}
`;

export {
  STATUS_ORCAMENTO_LOCACAO,
  OPCOES_MENU,
  STATUS_ORCAMENTO_LOCACAO_LISTA,
  STATUS_GESTAO_LOCACAO_LISTA,
  COLUNAS_TABELA_ORCAMENTO_LOCACAO,
  COLUNAS_TABELA_GESTAO_LOCACAO,
  TIPOS_DE_CONTRATO,
  TIPOS_DE_CONTRATO_LISTA,
  PERIODO_EMISSAO,
  PERIODO_EMISSAO_LISTA,
  CATEGORIAS_ITENS_ORCAMENTO_LOCACAO,
  FILTROS_PESQUISA,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO,
  DETALHES_ORCAMENTO_GRAPHQL
};