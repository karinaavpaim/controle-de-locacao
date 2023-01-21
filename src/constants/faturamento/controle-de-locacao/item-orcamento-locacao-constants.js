const CATEGORIAS_ITEM = {
  EQUIPAMENTO: "EQUIPAMENTO",
  SERVICO: "SERVICO",
  MATERIAL: "MATERIAL"
};

const CATEGORIAS_PREENCHIMENTO_AUTOMATICO = {
  EQUIPAMENTO: {
    nome: "Equipamentos",
    valor: "EQUIPAMENTO",
  },
  MATERIAL: {
    nome: "Materiais",
    valor: "MATERIAL",
  },
  SERVICO: {
    nome: "Serviços",
    valor: "SERVICO",
  },
  DESPESA: {
    nome: "Despesas",
    valor: "DESPESA",
  }
};

const STATUS_ITEM = {
  ABERTO: {
    classe: 'tag-status-item-aberto',
    nome: 'ABERTO',
    descricao: 'Aberto'
  },
  CANCELADO: {
    classe: 'tag-status-item-cancelado',
    nome: 'CANCELADO',
    descricao: 'Cancelado'
  },
  ATENDIDO_PARCIALMENTE: {
    classe: 'tag-status-item-atendido-parcialmente',
    nome: 'ATENDIDO_PARCIALMENTE',
    descricao: 'Atendido parcialmente'
  },
  ATENDIDO_COM_CORTE: {
    classe: 'tag-status-item-atendido-com-corte',
    nome: 'ATENDIDO_COM_CORTE',
    descricao: 'Atendido com corte'
  },
  ATENDIDO_TOTALMENTE: {
    classe: 'tag-status-item-atendido-totalmente',
    nome: 'ATENDIDO_TOTALMENTE',
    descricao: 'Atendido totalmente'
  },
  MOVIMENTADO: {
    classe: 'tag-status-item-movimentado',
    nome: 'MOVIMENTADO',
    descricao: 'Movimentado'
  }
}

export { 
  CATEGORIAS_ITEM,
  CATEGORIAS_PREENCHIMENTO_AUTOMATICO,
  STATUS_ITEM
};