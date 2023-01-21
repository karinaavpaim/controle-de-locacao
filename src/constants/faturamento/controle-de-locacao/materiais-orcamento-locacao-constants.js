const COLUNAS_MATERIAIS = [
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
    value: "produto.codigoNome",
    sortable: true
  },
  {
    text: "Quantidade",
    value: "quantidade",
    align: "right",
    sortable: false,
    width: "80px"
  },
  {
    text: "Unitário líquido",
    value: "valorTotalUnitario",
    align: "right",
    sortable: false,
    width: "120px"
  },
  {
    text: "Valor total",
    value: "valorTotalItem",
    align: "right",
    sortable: false,
    width: "100px"
  },
  {
    text: "",
    sortable: false,
    align: "right",
    width: "50px"
  }
];

export { 
  COLUNAS_MATERIAIS
};