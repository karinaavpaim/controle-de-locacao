'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import ControleDeGestaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/ControleDeGestaoDeLocacao';
import { STATUS_GESTAO_LOCACAO_LISTA, COLUNAS_TABELA_GESTAO_LOCACAO } from '@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js';
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants';
import { OPCOES_STORE_ACESSOS } from "@/store/modules/acessos";
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';
import { STATUS_ORCAMENTO_LOCACAO } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants";
import { STATUS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";
import orcamentoDetalhes from '../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import FiltrosPesquisaOrcamentoModel from '@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model';
import apiOrcamentoLocacao from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';

store.dispatch(OPCOES_STORE_ACESSOS.ACTIONS.ALTERAR_ACESSOS, Promise.resolve([
  {
    identificador: ROTAS_FATURAMENTO_METADATA.analiseDeResultados.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  },
  {
    identificador: ROTAS_FATURAMENTO_METADATA.ajustarLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  }
]));

describe('ControleDeGestaoDeLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  let orcamento = {
    codigo: 'codigo-do-orcamento',
    dataEmissao: '2019-10-07',
    dataInicioContrato: '2019-10-07',
    dataTerminoContrato: '2019-10-10',
    dataReferencia: '2019-10-07',
    dataInicialReferencia: '2019-10-07',
    dataFinalReferencia: '2019-10-10',
    identificadorEmpresa: 1,
    identificador: 333,
    cliente: { identificador: '00A0000001'},
    status: 'APROVADO'
  };

  beforeEach(() => {
    wrapper = mount(ControleDeGestaoDeLocacao, {
      store,
      router,
      propsData: {},
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof ControleDeGestaoDeLocacao.data).toBe('function');
      expect(wrapper.vm.breadCrumbs.length).toBe(1);
      expect(wrapper.vm.exibirFiltrosAvancados).toBe(false);
      expect(wrapper.vm.exibirFiltros).toBe(false);
      expect(wrapper.vm.paginacao.sortBy).toBe('codigo');
      expect(wrapper.vm.paginacao.descending).toBe(true);
      expect(typeof wrapper.vm.filtrosPesquisaGestao).toBe('object');
      expect(wrapper.vm.filtrosPesquisaGestao.constructor.name).toBe('FiltrosPesquisaOrcamentoModel');
      expect(wrapper.vm.pesquisa).toEqual('');
      expect(wrapper.vm.orcamentosDeLocacao).toEqual([]);
      expect(wrapper.vm.colunasTabelaGestaoLocacao).toEqual(COLUNAS_TABELA_GESTAO_LOCACAO);
      expect(wrapper.vm.statusParaFiltro).toEqual(STATUS_GESTAO_LOCACAO_LISTA);
      expect(wrapper.vm.empresa).toBeUndefined();
    });
  });

  describe('Ações do componente.', () => {
    it('Deve encaminhar para a página de ajuste de locação informando o identificador do orçamento', () => {
      var orcamento = {
        identificador: 1
      };

      wrapper.vm.ajustarLocacao(orcamento);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.ajustarLocacao.name);
        expect(wrapper.vm.$route.params).toEqual({ idOrcamento: orcamento.identificador });
      });
    });

    it('Deve montar status do orçamento.', () => {
      var orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.status = 'APROVADO';
      orcamento.valorStatus= orcamento.status;
      expect(wrapper.vm.montarStatusOrcamento(orcamento).length).toEqual(2);
    });

    it('Deve alterar o status do orçamento manualmente', () => {
      jest.spyOn(wrapper.vm, "alterarStatusDoOrcamento").mockImplementation(() => Promise.resolve());

      let obj = {orcamento: { status: 'APROVADO' }}

      wrapper.vm.alterarStatusOrcamentoManualmente(obj);
      expect(obj.orcamento.status).toBe('APROVADO');

      obj.statusAnterior = 'PRONTO';

      wrapper.vm.alterarStatusOrcamentoManualmente(obj);
      expect(obj.orcamento.status).toBe('PRONTO');
      expect(wrapper.vm.alterarStatusDoOrcamento).toHaveBeenCalled();
    });

    it('Deve filtrar os orçamentos', async () => {
      wrapper.vm.empresa = {
        identificador: "000100",
      };

      wrapper.vm.filtrosPesquisaGestao = new FiltrosPesquisaOrcamentoModel({
        buscarOrcamentos: false,
        buscarLocacoes: true
      });

      wrapper.vm.carregando = false;

      jest.spyOn(apiOrcamentoLocacao, 'obterOrcamentos')
          .mockImplementation(() => Promise.resolve([ orcamento ]));

      wrapper.vm.filtrarOrcamentosSalvandoFiltro();
      expect(wrapper.vm.filtrosPesquisaGestao.idEmpresa).toBe("000100");
      expect(wrapper.vm.filtrosPesquisaGestao.buscarOrcamentos).toBe(false);
      expect(wrapper.vm.filtrosPesquisaGestao.buscarLocacoes).toBe(true);
      expect(apiOrcamentoLocacao.obterOrcamentos).toHaveBeenCalledWith(wrapper.vm.filtrosPesquisaGestao);
    });

    it('Deve encaminhar para a página de análise de resultados informando o identificador do orçamento', () => {
      wrapper.vm.gerarResultado(orcamento);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.analiseDeResultados.name);
      });
    });

    it('Deve informar ao usuário que o status dos itens mudará ao finalizar a locação.', () => {
      let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

      var wrapperTeste = mount(ControleDeGestaoDeLocacao, {
        mocks: {
          $mensagemFlutuante: {
            confirmacao: metodoMensagemFlutuante
          }
        },
        store,
        router
      });

      var statusAnterior = STATUS_ORCAMENTO_LOCACAO.EXECUCAO.valor;
      var statusSelecionado = STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor;
      wrapperTeste.vm.alterarStatus(statusSelecionado, orcamento, statusAnterior);

      wrapperTeste.vm.$nextTick(() => {
        expect(metodoMensagemFlutuante).toHaveBeenCalledWith(
          expect.objectContaining({
            mensagem: expect.stringContaining(STATUS_ITEM.ATENDIDO_COM_CORTE.descricao)
          })
        );
        expect(metodoMensagemFlutuante).toHaveBeenCalledWith(
          expect.objectContaining({
            mensagem: expect.stringContaining(STATUS_ITEM.CANCELADO.descricao)
          })
        );
      });
    });
    
    it('Deve confirmar o cancelamento de uma locação.', () => {
      let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

      var wrapperTeste = mount(ControleDeGestaoDeLocacao, {
        mocks: {
          $mensagemFlutuante: {
            confirmacao: metodoMensagemFlutuante
          }
        },
        store,
        router
      });

      wrapperTeste.vm.configurarCancelamentoOrcamento(orcamento);

      wrapperTeste.vm.$nextTick(() => {
        expect(metodoMensagemFlutuante).toHaveBeenCalledWith(
          expect.objectContaining({
            mensagem: expect.stringContaining(orcamento.codigo)
          })
        );
      });
    });

    it('Deve validar o método metodoDesabilitarBotaoAjustarLocacao', () => {
      let orcamento = {
        status: STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor
      };
      expect(wrapper.vm.metodoDesabilitarBotaoAjustarLocacao(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoAjustarLocacao(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoAjustarLocacao(orcamento)).toBeFalsy();
    });

    it('Deve validar o método metodoDesabilitarBotaoCancelar', () => {
      let orcamento = {
        possuiItemMovimentado: true,
        status: STATUS_ORCAMENTO_LOCACAO.APROVADO.valor
      };
      expect(wrapper.vm.metodoDesabilitarBotaoCancelar(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoCancelar(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoCancelar(orcamento)).toBeTruthy();

      orcamento = {
        possuiItemMovimentado: false,
        status: STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor
      };
      expect(wrapper.vm.metodoDesabilitarBotaoCancelar(orcamento)).toBeFalsy();
    });

    it('Deve validar o método metodoDesabilitarBotaoAnalisarResultados', () => {
      let orcamento = {
        possuiItemMovimentado: false,
        status: STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor
      };
      expect(wrapper.vm.metodoDesabilitarBotaoAnalisarResultados(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.APROVADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoAnalisarResultados(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoAnalisarResultados(orcamento)).toBeTruthy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.LIBERADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoAnalisarResultados(orcamento)).toBeFalsy();
    });

    it('Deve validar o método salvarFiltroEFiltrar', () => {
      wrapper.vm.salvarFiltroEFiltrar();
      expect(wrapper.vm.filtrosPesquisaGestao.gravadoPeloUsuario).toBeTruthy();
    });

    it('Deve validar o método limparFiltroEFiltrar', () => {
      wrapper.vm.limparFiltroEFiltrar();
      expect(wrapper.vm.filtrosPesquisaGestao.constructor.name).toBe('FiltrosPesquisaOrcamentoModel');
      expect(wrapper.vm.filtrosPesquisaGestao.gravadoPeloUsuario).toBeFalsy();
    });
  });
});