import { TIPOS_DE_DADO, ALINHAMENTOS } from "@/constants/comum/tabela-generica-constants";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";
import mascaraDinheiro from "@/utils/mascara-dinheiro";

const OPCOES_MENU = {
  GERAR_REQUISICAO: {
    nome: 'GERAR_REQUISICAO',
    titulo: 'Requisitar',
    metodo: () => {},
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.REQUISITAR
  },
  GERAR_EXPEDICAO: {
    nome: 'GERAR_EXPEDICAO',
    titulo: 'Expedir',
    metodo: () => {},
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.EXPEDIR
  },
  GERAR_MEDICAO: {
    nome: 'GERAR_MEDICAO',
    titulo: 'Medir',
    metodo: () => {},
    acesso: ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.MEDIR
  }
};

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO = [
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Cliente',
    align: 'left',
    sortable: true,
    value: 'nomeCliente',
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Status',
    align: 'center',
    sortable: true,
    value: 'descricaoStatus',
    width: "120px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Início do contrato',
    align: 'center',
    sortable: false,
    value: 'dataInicioContratoIso', // Exibida com máscara, utilizada para ordenação.
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Término do contrato',
    align: 'center',
    sortable: false,
    value: 'dataTerminoContratoIso', // Exibida com máscara, utilizada para ordenação.
    width: "142px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: 'botoes',
    width: '140px', //'220px'
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_EQUIPAMENTOS = [
  {
    text: '',
    align: '',
    sortable: false,
    value: 'produto.codigo',
    width: "1px",
    class: 'selo-tabela-generica',
    posicao_valor: '',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Equipamentos',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (nomeProduto, item) => (item.descricao || nomeProduto)
  },
  {
    text: 'Diárias',
    align: 'right',
    sortable: false,
    value: 'quantidadeDiarias',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Previsão de saída',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Previsão de retorno',
    align: 'center',
    sortable: false,
    value: 'dataFinalLocacao',
    width: "138px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Disponível',
    align: 'right',
    sortable: false,
    value: 'quantidadeDisponivel',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidadePedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Requisitado',
    align: 'right',
    sortable: false,
    value: 'quantidadeRequisitada',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'A requisitar',
    align: 'right',
    sortable: false,
    value: 'quantidadeRequisitada',
    width: "100px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (requisitado, item)=>(item.quantidadePedida - requisitado)
  },
  {
    text: 'Requisitar',
    align: 'right',
    sortable: false,
    value: 'quantidadeARequisitar',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_MATERIAIS = [
  {
    text: '',
    align: '',
    sortable: false,
    value: 'produto.codigo',
    width: "1px",
    class: 'selo-tabela-generica',
    posicao_valor: '',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Materiais',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (nomeProduto, item) => (item.descricao || nomeProduto)
  },
  {
    text: 'Previsão de saída',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Disponível',
    align: 'right',
    sortable: false,
    value: 'quantidadeDisponivel',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidadePedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Requisitado',
    align: 'right',
    sortable: false,
    value: 'quantidadeRequisitada',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'A requisitar',
    align: 'right',
    sortable: false,
    value: 'quantidadeRequisitada',
    width: "100px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (requisitado, item)=>(item.quantidadePedida - requisitado)
  },
  {
    text: 'Requisitar',
    align: 'right',
    sortable: false,
    value: 'quantidadeARequisitar',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_EQUIPAMENTOS = [
  {
    text: '',
    align: '',
    sortable: false,
    value: 'produto.codigo',
    width: "1px",
    class: 'selo-tabela-generica',
    posicao_valor: '',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Equipamentos',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (nomeProduto, item) => (item.descricao || nomeProduto)
  },
  {
    text: 'Unitário líquido',
    align: 'right',
    sortable: false,
    value: 'valorUnitario',
    width: "120px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINHEIRO
  },
  {
    text: 'Previsão de saída',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Previsão de retorno',
    align: 'center',
    sortable: false,
    value: 'dataFinalLocacao',
    width: "138px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidade',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Requisitado',
    align: 'right',
    sortable: false,
    value: 'quantidadeRequisitada',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Liberado',
    align: 'right',
    sortable: false,
    value: 'liberacoes',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (liberacoes)=>liberacoes.reduce((somatorio, item)=> somatorio + item.quantidadeLiberada, 0)
  },
  {
    text: 'Expedido',
    align: 'right',
    sortable: false,
    value: 'liberacoes',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (liberacoes)=>liberacoes.reduce((somatorio, item)=>somatorio + item.quantidadeExpedida, 0)
  },
  {
    text: 'A expedir',
    align: 'right',
    sortable: false,
    value: 'liberacoes',
    width: "85px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (liberacoes)=>
            liberacoes.reduce((somatorio, item)=> somatorio + item.quantidadeLiberada, 0)
            -
            liberacoes.reduce((somatorio, item)=>somatorio + item.quantidadeExpedida, 0)
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_MATERIAIS = [
  {
    text: '',
    align: '',
    sortable: false,
    value: 'produto.codigo',
    width: "1px",
    class: 'selo-tabela-generica',
    posicao_valor: '',
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'center',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Materiais',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (nomeProduto, item) => (item.descricao || nomeProduto)
  },
  {
    text: 'Unitário líquido',
    align: 'right',
    sortable: false,
    value: 'valorUnitario',
    width: "120px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINHEIRO
  },
  {
    text: 'Previsão de saída',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidade',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Requisitado',
    align: 'right',
    sortable: false,
    value: 'quantidadeRequisitada',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Liberado',
    align: 'right',
    sortable: false,
    value: 'liberacoes',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (liberacoes)=>liberacoes.reduce((somatorio, item)=> somatorio + item.quantidadeLiberada, 0)
  },
  {
    text: 'Expedido',
    align: 'right',
    sortable: false,
    value: 'liberacoes',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (liberacoes)=>liberacoes.reduce((somatorio, item)=>somatorio + item.quantidadeExpedida, 0)
  },
  {
    text: 'A expedir',
    align: 'right',
    sortable: false,
    value: 'liberacoes',
    width: "85px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (liberacoes)=>
            liberacoes.reduce((somatorio, item)=> somatorio + item.quantidadeLiberada, 0)
            -
            liberacoes.reduce((somatorio, item)=>somatorio + item.quantidadeExpedida, 0)
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_EQUIPAMENTOS = [
  {
    text: '',
    align: 'center',
    sortable: false,
    value: '',
    width: "16px",
    class: 'selo-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'left',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Equipamentos',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO,
  },
  {
    text: 'Progresso',
    align: 'center',
    sortable: false,
    value: '',
    width: '120px',
    class: 'barra-progresso-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Previsão de saída',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Previsão de retorno',
    align: 'center',
    sortable: false,
    value: 'dataFinalLocacao',
    width: "138px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Valor total',
    align: 'right',
    sortable: false,
    value: 'valorTotal',
    width: "100px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINHEIRO
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidadePedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Expedido',
    align: 'right',
    sortable: false,
    value: 'quantidadeExpedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Medido',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos)=>desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
    
  },
  {
    text: 'Restante',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos, item)=>item.quantidadeExpedida - desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: '',
    width: "16px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_MATERIAIS = [
  {
    text: '',
    align: 'center',
    sortable: false,
    value: '',
    width: "16px",
    class: 'selo-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'left',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Materiais',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO,
  },
  {
    text: 'Progresso',
    align: 'center',
    sortable: false,
    value: '',
    width: '120px',
    class: 'barra-progresso-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Previsão de saída',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Valor total',
    align: 'right',
    sortable: false,
    value: 'valorTotal',
    width: "100px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINHEIRO
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidadePedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Expedido',
    align: 'right',
    sortable: false,
    value: 'quantidadeExpedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Medido',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos)=>desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  },
  {
    text: 'Restante',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos, item)=>item.quantidadeExpedida - desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  },
  {
    text: '',
    align: 'center',
    sortable: false,
    value: '',
    width: "16px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  }
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_SERVICOS = [
  {
    text: '',
    align: 'center',
    sortable: false,
    value: '',
    width: "16px",
    class: 'selo-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'left',
    sortable: true,
    value: 'produto.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Serviços',
    align: 'left',
    sortable: true,
    value: 'produto.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Progresso',
    align: 'center',
    sortable: false,
    value: '',
    width: '120px',
    class: 'barra-progresso-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Previsão de início',
    align: 'center',
    sortable: false,
    value: 'dataInicialLocacao',
    width: "128px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Previsão de término',
    align: 'center',
    sortable: false,
    value: 'dataFinalLocacao',
    width: "141px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Valor total',
    align: 'right',
    sortable: false,
    value: 'valorTotal',
    width: "100px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINHEIRO
  },
  {
    text: 'Pedido',
    align: 'right',
    sortable: false,
    value: 'quantidadePedida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Medido',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos)=>desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  },
  {
    text: 'Restante',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos, item)=>item.quantidadePedida - desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  },
];

const COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_DESPESAS = [
  {
    text: '',
    align: 'center',
    sortable: false,
    value: '',
    width: "16px",
    class: 'selo-tabela-generica',
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.CUSTOMIZADO
  },
  {
    text: 'Código',
    align: 'left',
    sortable: true,
    value: 'naturezaLancamento.codigo',
    width: "100px",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Despesa',
    align: 'left',
    sortable: true,
    value: 'naturezaLancamento.nome',
    width: "",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Quantidade',
    align: 'right',
    sortable: false,
    value: 'quantidade',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'Valor total',
    align: 'right',
    sortable: false,
    value: 'valorItem',
    width: "100px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (valorItem, despesa)=>mascaraDinheiro.aplicarMascaraParaRealComPrefixo(despesa.valorTotalDaDespesa())
  },
  {
    text: 'Medido',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos)=>desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  },
  {
    text: 'Restante',
    align: 'right',
    sortable: false,
    value: 'desmembramentos',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.DINAMICO,
    metodo: (desmembramentos, despesa)=>despesa.quantidade - desmembramentos.reduce((t, d) => t + (d.totalmenteMedido ? d.quantidadeMedida : 0), 0)
  }
];

const COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_SAIDA = [
  {
    text: 'Lote/Série',
    align: 'left',
    sortable: false,
    value: 'loteSerie',
    width: "100px",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Data de saída',
    align: 'center',
    sortable: false,
    value: 'dataSaida',
    width: "100px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Quantidade',
    align: 'right',
    sortable: false,
    value: 'quantidadeSaida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'NF/OE',
    align: 'right',
    sortable: false,
    value: 'nfOeSaida',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
];

const COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_RETORNO = [
  {
    text: 'Lote/Série',
    align: 'left',
    sortable: false,
    value: 'loteSerie',
    width: "100px",
    posicao_valor: ALINHAMENTOS.ESQUERDA,
    tipo: TIPOS_DE_DADO.TEXTO
  },
  {
    text: 'Data de retorno',
    align: 'center',
    sortable: false,
    value: 'dataRetorno',
    width: "120px",
    posicao_valor: ALINHAMENTOS.CENTRO,
    tipo: TIPOS_DE_DADO.DATA
  },
  {
    text: 'Quantidade',
    align: 'right',
    sortable: false,
    value: 'quantidadeRetorno',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  },
  {
    text: 'NF/OE',
    align: 'right',
    sortable: false,
    value: 'nfOeRetorno',
    width: "80px",
    posicao_valor: ALINHAMENTOS.DIREITA,
    tipo: TIPOS_DE_DADO.NUMERO
  }
];

export {
  OPCOES_MENU,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_EQUIPAMENTOS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_MATERIAIS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_EQUIPAMENTOS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_MATERIAIS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_EQUIPAMENTOS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_MATERIAIS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_SERVICOS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_DESPESAS,
  COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_SAIDA,
  COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_RETORNO
};