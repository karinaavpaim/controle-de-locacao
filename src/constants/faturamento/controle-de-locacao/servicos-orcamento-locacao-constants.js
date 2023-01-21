const COLUNAS_SERVICOS = [
  {
    text: "",
    align: "left",
    value: "",
    sortable: false,
    width: "48px"
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
    text: "Diárias",
    value: "quantidadeDiarias",
    align: "right",
    sortable: false,
    width: "40px"
  },
  {
    text: "Período inicial",
    value: "periodoInicial",
    align: "center",
    sortable: false,
    width: "120px"
  },
  {
    text: "Período final",
    value: "periodoFinal",
    align: "center",
    sortable: false,
    width: "120px"
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
    width: "72px"
  }
];

export { 
  COLUNAS_SERVICOS
};