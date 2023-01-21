const COLUNAS_FORMAS_PAGAMENTO = [
  {
    text: 'Código',
    align: 'left',
    sortable: true,
    value: 'codigo',
    width: "100px"
  },
  {
    text: 'Descrição',
    align: 'left',
    sortable: true,
    value: 'nome'
  },
];

const TIPOS_PRAZO = {
  ANALITICO: "ANALITICO",
  SINTETICO: "SINTETICO"
}

const AGRUPAMENTOS_PRAZO = {
  PAGAR: "PAGAR",
  RECEBER: "RECEBER"
}

const ESTAGIOS_SELECAO = {
  SELECAO_PRAZO: 1,
  FORMA_PAGAMENTO_ENTRADA: 2,
  FORMA_PAGAMENTO_PARCELA: 3
}

export {
  COLUNAS_FORMAS_PAGAMENTO,
  TIPOS_PRAZO,
  ESTAGIOS_SELECAO,
  AGRUPAMENTOS_PRAZO
};