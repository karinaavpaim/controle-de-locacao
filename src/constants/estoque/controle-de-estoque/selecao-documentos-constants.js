const TIPOS_DOCUMENTO_CONTROLE_ESTOQUE = {
  REQUISICAO_MATERIAL: {
    descricao: "Separação de requisições de materiais",
    sigla: "RM",
    cor: "orange"
  },
  PEDIDO_DE_VENDA: {
    descricao: "Separação de pedidos de venda",
    sigla: "PV",
    cor: "cyan"
  },
  NOTA_FISCAL: {
    descricao: "Conferência de notas fiscais",
    sigla: "NF",
    cor: "green"
  },
  INVENTARIO: {
    descricao: "Contagem de inventários",
    sigla: "IN",
    cor: "red accent-3"
  }
}

const STATUS_DOCUMENTO_CONTROLE_ESTOQUE = {
    PENDENTE: "Pendente",
    EM_SEPARACAO: "Em separação",
    AGUARDANDO_CONFERENCIA: "Aguardando conferência",
    EM_CONFERENCIA: "Em conferência",
    CONCLUIDO_PARCIAL: "Concluído parcial",
    CONCLUIDO_CORTE: "Concluído com corte",
    CONCLUIDO_TOTALMENTE: "Concluído totalmente"
}

const STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE = {
    PENDENTE: {
      descricao: "Pendente",
      valor: "PENDENTE"
    },
    ATENDIDO_PARCIALMENTE: {
      descricao: "Atendido parcialmente",
      valor: "ATENDIDO_PARCIALMENTE"
    },
    ATENDIDO_COM_CORTE: {
      descricao: "Atendido com corte",
      valor: "ATENDIDO_COM_CORTE"
    },
    ATENDIDO_TOTALMENTE: {
      descricao: "Atendido totalmente",
      valor: "ATENDIDO_TOTALMENTE"
    }
};

const CABECALHOS_SELECAO_DOCUMENTOS = {
  DATA_EMISSAO: {
    text: "Data",
    align: "center",
    sortable: true,
    value: "dataReferencia",
    class: "coluna-data-emissao"
  },
  DESCRICAO: {
    text: "Documento",
    align: "center",
    sortable: true,
    value: "descricao",
    class: "coluna-descricao"
  },
  DESCRICAO_ORIGEM: {
    text: "Origem",
    align: "center",
    sortable: true,
    value: "setorOrigem.descricao"
  },
  STATUS_DOCUMENTO: {
    text: "Status",
    align: "center",
    sortable: true,
    value: "status",
    class: "coluna-status"
  },
  TIPO_DOCUMENTO: {
    // Deve ser a última coluna - utilizada para filtrar o grid.
    value: "tipo"
  }
};

export {
  TIPOS_DOCUMENTO_CONTROLE_ESTOQUE,
  STATUS_DOCUMENTO_CONTROLE_ESTOQUE,
  STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE,
  CABECALHOS_SELECAO_DOCUMENTOS
}