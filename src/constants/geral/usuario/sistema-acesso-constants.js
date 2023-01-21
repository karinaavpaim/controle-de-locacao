'use strict';

const TIPOS_ACESSO_SISTEMA = {
  HABILITADO: 'HABILITADO',
  DESABILITADO: 'DESABILITADO',
  ESCONDIDO: 'ESCONDIDO'
};

const ACESSOS_BIMER_UP = {
  ESTOQUE: {
    SELF: '2060000018'
  },
  FATURAMENTO: {
    SELF: '2140000023',
    CONTROLE_LOCACAO: {
      SELF: '2140000024',
      ORCAMENTOS: {
        SELF: '2140000025',
        NOVO: '2140000026',
        EDITAR: '2140000027',
        DUPLICAR: '2140000028',
        EXCLUIR: '2140000029',
        CANCELAR: '2140000030',
        GERAR_PROPOSTA: '2140000031',
        EDITAR_PROPOSTA: '2140000032',
        IMPRIMIR_PROPOSTA: '2140000033',
        EXCLUIR_PROPOSTA: '2140000034',
        ALTERAR_STATUS: '2140000058',
        STATUS_PRONTO: '2140000035',
        STATUS_APROVADO: '2140000036',
        STATUS_REPROVADO: '2140000037',
        STATUS_REVISAO: '2140000038'
      },
      MODELO_PROPOSTA: {
        SELF: '2140000039',
        NOVO: '2140000040',
        EDITAR: '2140000041',
        DUPLICAR: '2140000042',
        EXCLUIR: '2140000057'
      },
      ADICIONAIS_PERSONALIZADOS: {
        SELF: '2140000043',
        NOVO: '2140000044',
        EDITAR: '2140000045',
        DUPLICAR: '2140000046',
        EXCLUIR: '2140000061'
      },
      GESTAO_LOCACAO: {
        SELF: '2140000047',
        ALTERAR_STATUS: '2140000059',
        STATUS_LIBERADO: '2140000048',
        STATUS_FINALIZADO: '2140000060',
        AJUSTAR: '2140000049',
        GERAR_ADITIVO: '2140000049', // Criar isso no desktop, Delphi
        CANCELAR: '2140000050',
        RESULTADO: '2140000051'
      },
      MOVIMENTO_LOCACAO: {
        SELF: '2140000052',
        REQUISITAR: '2140000053',
        EXPEDIR: '2140000054',
        MEDIR: '2140000055'
      },
      CONFIGURACAO: {
        SELF: '2140000056'
      }
    }
  }
}

export {
  TIPOS_ACESSO_SISTEMA,
  ACESSOS_BIMER_UP
};