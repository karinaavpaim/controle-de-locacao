import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";

const COLUNAS_TABELA_CONTROLE_ADICIONAIS_PERSONALIZADOS = [
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'codigo',
    width: "100px"
  },
  {
    text: 'Descrição',
    align: 'left',
    sortable: true,
    value: 'descricao'
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: 'botoes',
    width: '300px'
  }
];

const COLUNAS_TABELA_INDICES_PERSONALIZADOS = [
  { text: 'Nome', align: 'left', value: 'descricao' },
  { text: 'Alíquota', value: 'aliquota', width: '80px' , sortable: false},
  {
    text: 'Equipamentos',
    align: 'center',
    value: 'atualizaEquipamentos',
    width: '109px',
    sortable: false
  },
  { text: 'Serviços', align: 'center', value: 'atualizaServicos', width: '79px' , sortable: false},
  {
    text: 'Materiais',
    align: 'center',
    value: 'atualizaMateriais',
    width: '83px', 
    sortable: false
  },
  { text: 'Despesas', align: 'center', value: 'atualizaDespesas', width: '85px' , sortable: false},
  {
    text: '',
    align: 'center',
    value: 'action',
    sortable: false,
    width: '72px'
  }
];

const ITENS_DO_MENU_OPCOES = [
  {
    titulo: "Duplicar",
    identificador: 1,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.DUPLICAR
  },
  {
    titulo: "Excluir",
    identificador: 2,
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.EXCLUIR
  }
];

export {
  COLUNAS_TABELA_CONTROLE_ADICIONAIS_PERSONALIZADOS,
  COLUNAS_TABELA_INDICES_PERSONALIZADOS,
  ITENS_DO_MENU_OPCOES
};