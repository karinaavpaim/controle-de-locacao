const COLUNAS_REPASSES = [
  {
    text: "Código",
    align: "left",
    value: "pessoa.codigo",
    sortable: true,
    width: "100px"
  },
  {
    text: "Nome",
    align: "left",
    value: "pessoa.nome",
    sortable: true
  },
  {
    text: "Categoria",
    align: "left",
    value: "categoria",
    sortable: false,
    width: "120px"
  },
  {
    text: "Alíquota faturamento",
    align: "left",
    value: "aliquotaFaturamento",
    sortable: false,
    width: "150px"
  },
  {
    text: "Alíquota duplicata",
    align: "left",
    value: "aliquotaDuplicata",
    sortable: false,
    width: "135px"
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
  COLUNAS_REPASSES
};