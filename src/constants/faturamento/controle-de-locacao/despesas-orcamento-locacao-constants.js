const COLUNAS_DESPESAS = [
  {
    text: "",
    align: "left",
    value: "",
    sortable: false,
    width: "40px"
  },
  {
    text: "Descrição",
    align: "left",
    value: "naturezaLancamento.codigo",
    sortable: true
  },
  {
    text: "Quantidade",
    align: "right",
    value: "quantidade",
    sortable: false,
    width: "80px"
  },
  {
    text: "Unitário líquido",
    align: "right",
    value: "valorTotalUnitario",
    sortable: false,
    width: "120px"
  },
  {
    text: "Valor total",
    align: "right",
    value: "valorTotal",
    sortable: false,
    width: "100px"
  },
  {
    text: "",
    value: "acoes",
    sortable: false,
    align: "right",
    width: "50px"
  }
];

export { 
  COLUNAS_DESPESAS
};