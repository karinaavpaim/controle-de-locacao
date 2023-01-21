const CABECALHOS_PRODUTOS_AGRUPADOS = [
  {
    text: "Código",
    align: "center",
    sortable: true,
    value: "produto.codigo",
    width: "80px"
  },
  {
    text: "Descrição",
    align: "center",
    sortable: true,
    value: "produto.nome"
  },
  {
    text: "Status",
    align: "center",
    sortable: true,
    value: "itens"
  },
  {
    // Deve ser a última coluna - utilizada para filtrar o grid.
    value: "descricao"
  }
];

const CABECALHOS_ITENS_DOCUMENTOS = {
  DESCRICAO: {
    text: "Documento",
    align: "center",
    sortable: true,
    value: "descricao",
    width: "90px"
  },
  QUANTIDADE: {
    text: "Pedido",
    align: "center",
    sortable: true,
    value: "item.quantidade",
    width: "64px"
  },
  QUANTIDADE_INFORMADA: {
    text: "Informado",
    align: "center",
    sortable: true,
    value: "quantidadeInformada",
    width: "88px"
  },
  STATUS: {
    text: "Status",
    align: "center",
    sortable: true,
    value: "itemStatus"
  },
  IDENTIFICADOR_PRODUTO: {
    // Deve ser a última coluna - utilizada para filtrar o grid.
    value: "item.produto.identificador"
  }
};

const CABECALHOS_MOVIMENTOS = [
  {
    text: "Lote/Série",
    align: "left",
    value: "loteSerie"
  },
  {
    text: "Quantidade",
    align: "center",
    value: "quantidade"
  },
  {
    text: "Responsável",
    align: "center",
    value: "responsavel"
  }
];

export {
  CABECALHOS_PRODUTOS_AGRUPADOS,
  CABECALHOS_ITENS_DOCUMENTOS,
  CABECALHOS_MOVIMENTOS
}