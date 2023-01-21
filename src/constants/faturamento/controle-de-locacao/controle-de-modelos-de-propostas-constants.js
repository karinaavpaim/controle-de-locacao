import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";

const COLUNAS_TABELA_CONTROLE_MODELOS_PROPOSTAS = [
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'identificador',
    width: "100px"
  },
  {
    text: 'Nome',
    align: 'left',
    sortable: true,
    value: 'nome'
  },
  {
    text: 'Tipo de modelo',
    align: 'left',
    sortable: true,
    value: 'tipoModelo',
    width: "150px"
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: 'botoes',
    width: "150px"
  }
];

const ITENS_DO_MENU_OPCOES = [
  {
    titulo: 'Duplicar',
    identificador: 1,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.DUPLICAR
  },
  {
    titulo: 'Excluir',
    identificador: 2,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.EXCLUIR
  }
];

export {
  COLUNAS_TABELA_CONTROLE_MODELOS_PROPOSTAS,
  ITENS_DO_MENU_OPCOES
};