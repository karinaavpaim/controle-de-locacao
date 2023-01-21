'use strict';

import { mount } from '@vue/test-utils';
import DashboardLocacao from '@/components/faturamento/controle-de-locacao/dashboard-locacao/DashboardLocacao.vue';
import DashboardLocacaoModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/dashboard-locacao-model';
import { STATUS_LOCACAO, CATEGORIA_ITEM, PERIODO_VISUALIZACAO, PERIODO_VISUALIZACAO_LISTA } from '@/constants/faturamento/controle-de-locacao/dashboard-constants';
import apiDashboardLocacao from '@/api/faturamento/controle-de-locacao/dashboard-locacao-api';
import dataUtils from '@/utils/data';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';

describe('DashboardLocacao.vue', () => {
  sync(store, router);

  let wrapper;
  beforeEach(() => {
    wrapper = mount(DashboardLocacao, {
      store,
      router,
      propsData: {},
      mocks: {
        $router: {
          push: () => {}
        }
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.opcaoRadio).toBe(CATEGORIA_ITEM.EQUIPAMENTO.valor);
    expect(typeof wrapper.vm.graficoLocacaoPorStatus).toBe('object');
    expect(typeof wrapper.vm.graficoProdutosMaisLocados).toBe('object');
    expect(wrapper.vm.statusLocacao).toBe(STATUS_LOCACAO);
    expect(typeof wrapper.vm.dadosDashboard).toBe('object');
    expect(wrapper.vm.categoriaItem).toBe(CATEGORIA_ITEM);
    expect(wrapper.vm.empresa).toBeUndefined();
    expect(wrapper.vm.dadosDashboard).toBeInstanceOf(DashboardLocacaoModel);
    expect(wrapper.vm.periodoDeVisualizacaoLista).toBe(PERIODO_VISUALIZACAO_LISTA);
    expect(wrapper.vm.periodoDeVisualizacaoOpcoes).toBe(PERIODO_VISUALIZACAO);
    expect(wrapper.vm.periodoDeVisualizacaoSelecionado).toBeUndefined();
  });

  it('Deve verificar se todos métodos definidos nos objetos watch e methods estão criados.', () => {
    expect(typeof DashboardLocacao.watch.empresa).toBe('function');
    expect(typeof DashboardLocacao.watch.opcaoRadio).toBe('function');
    expect(typeof DashboardLocacao.methods.alterarPeriodoVisualizacaoDashboard).toBe('function');
    expect(typeof DashboardLocacao.methods.aplicarRotaEFiltroDePeriodoAoCard).toBe('function');
    expect(typeof DashboardLocacao.methods.carregarDadosDoDashboard).toBe('function');
    expect(typeof DashboardLocacao.methods.inicializarGraficos).toBe('function');
    expect(typeof DashboardLocacao.methods.montarGraficoLocacaoPorStatus).toBe('function');
    expect(typeof DashboardLocacao.methods.obterPercentuaisDasLocacoesPorStatus).toBe('function');
    expect(typeof DashboardLocacao.methods.montarGraficoProdutosMaisLocados).toBe('function');
    expect(typeof DashboardLocacao.methods.obterProdutosPelaCategoriaSelecionada).toBe('function');
    expect(typeof DashboardLocacao.methods.obterTotalOrcamentosPorStatus).toBe('function');
  });

  it('Deve preencher o objeto graficoLocacaoPorStatus', () => {
    wrapper.vm.graficoLocacaoPorStatus = undefined;
    wrapper.vm.montarGraficoLocacaoPorStatus();
    expect(wrapper.vm.graficoLocacaoPorStatus).toBeDefined();
  });

  it('Deve preencher o objeto graficoProdutosMaisLocados', () => {
    wrapper.vm.graficoProdutosMaisLocados = undefined;
    wrapper.vm.montarGraficoProdutosMaisLocados();
    expect(wrapper.vm.graficoProdutosMaisLocados).toBeDefined();
  });

  it('Deve validar o método obterProdutosPelaCategoriaSelecionada', () => {
    wrapper.vm.opcaoRadio = CATEGORIA_ITEM.EQUIPAMENTO.valor;
    expect(wrapper.vm.obterProdutosPelaCategoriaSelecionada()).toBe(wrapper.vm.dadosDashboard.produtosMaisLocadosPorCategoria.dezEquipamentosMaisLocados);

    wrapper.vm.opcaoRadio = CATEGORIA_ITEM.MATERIAL.valor;
    expect(wrapper.vm.obterProdutosPelaCategoriaSelecionada()).toBe(wrapper.vm.dadosDashboard.produtosMaisLocadosPorCategoria.dezMateriaisMaisLocados);

    wrapper.vm.opcaoRadio = CATEGORIA_ITEM.SERVICO.valor;
    expect(wrapper.vm.obterProdutosPelaCategoriaSelecionada()).toBe(wrapper.vm.dadosDashboard.produtosMaisLocadosPorCategoria.dezServicosMaisLocados);
  });

  it('Deve carregar os dados do dashboard ao alterar a empresa.', async (done) => {
    jest.spyOn(wrapper.vm, 'carregarDadosDoDashboard').mockImplementation(() => {});
    wrapper.vm.$options.watch.empresa.call(wrapper.vm, {});
    wrapper.vm.$nextTick(()=>{
      wrapper.vm.$nextTick(()=>{
        try{
          expect(wrapper.vm.carregarDadosDoDashboard).toHaveBeenCalled();
          done();
        }
        catch(e){
          done.fail(e);
        } 
      })
    })
  });

  it('Deve atualizar o gráfico de produtos mais locados ao alterar a seleção do radio button.', () => {
    jest.spyOn(wrapper.vm, 'montarGraficoProdutosMaisLocados').mockImplementation(() => {});
    wrapper.vm.$options.watch.opcaoRadio.call(wrapper.vm, 'TESTE');
    expect(wrapper.vm.montarGraficoProdutosMaisLocados).toHaveBeenCalled();
  });

  it('Deve inicializar os gráficos e armazenar os dados do dashboard ao carregar os dados do mesmo.', async (done) => {
    jest.spyOn(apiDashboardLocacao, 'obterDadosDashboardLocacao').mockImplementation(() => Promise.resolve([]));
    
    wrapper.vm.empresa = { identificador: 1 };
    wrapper.vm.dadosDashboard = undefined;
    wrapper.vm.graficoLocacaoPorStatus = undefined;
    wrapper.vm.graficoProdutosMaisLocados = undefined;
    
    wrapper.vm.$nextTick(() => {
      wrapper.vm.carregarDadosDoDashboard();
      wrapper.vm.$nextTick(() => {
        try {
          expect(apiDashboardLocacao.obterDadosDashboardLocacao).toHaveBeenCalled();
          expect(wrapper.vm.dadosDashboard).toBeInstanceOf(DashboardLocacaoModel);
          expect(wrapper.vm.graficoLocacaoPorStatus).toBeInstanceOf(Object);
          expect(wrapper.vm.graficoProdutosMaisLocados).toBeInstanceOf(Object);
          done();
        }
        catch(e){
          done.fail(e)
        }
      });
    });
  });

  it('Deve notificar quando não conseguir carregar os dados do dashboard.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
    var wrapperTeste = mount(DashboardLocacao, {
      mocks: {
        $mensagemFlutuante: {
          erro: metodoMensagemFlutuante
        }
      }
    });

    jest.spyOn(apiDashboardLocacao, 'obterDadosDashboardLocacao').mockImplementation(() => Promise.reject([{statusText:'erro'}]));

    wrapperTeste.vm.carregarDadosDoDashboard();

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
    });
  });

  describe("alterarPeriodoVisualizacaoDashboard", ()=>{
    it('Deve alterar o filtro de periodo utilizado na exibicao do dashboard, no storage.', async (done) => {
      jest.spyOn(wrapper.vm.$store, 'dispatch').mockImplementation(() => {});
      wrapper.vm.alterarPeriodoVisualizacaoDashboard(PERIODO_VISUALIZACAO.ULTIMOS_90_DIAS);
      wrapper.vm.$nextTick(()=>{
        try{
          expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();
          done();
        }catch(e){
          done.fail(e);
        }
      })
    });

    it('Deve aplicar o filtro disponivel na storage pois nenhum periodo foi passado', async () => {
      wrapper.vm.alterarPeriodoVisualizacaoDashboard();

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.periodoDeVisualizacaoSelecionado.valorEmDias).toBe(PERIODO_VISUALIZACAO.ULTIMOS_7_DIAS.valorEmDias);
      expect(wrapper.vm.breadCrumbs[0].text).toBe('Dashboard dos '+PERIODO_VISUALIZACAO.ULTIMOS_7_DIAS.descricao.toLowerCase());
    });
  });

  describe("aplicarRotaEFiltroDePeriodoAoCard", () => {
    it('Deve aplicar a rota e o filtro do período de acordo com o status do card escolhido', () => {
      let routerMock = jest.spyOn(wrapper.vm.$router, 'push').mockImplementation(() => {});
      let status = 'EM_DIGITACAO';

      wrapper.vm.periodoDeVisualizacaoSelecionado = PERIODO_VISUALIZACAO.ULTIMOS_7_DIAS;
      wrapper.vm.aplicarRotaEFiltroDePeriodoAoCard(status);

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: STATUS_LOCACAO[status].rota,
        params: {
          dashboard: {
            status: status,
            periodoReferencia: dataUtils.retornarDataInicialAteAtualISODosXDias(PERIODO_VISUALIZACAO.ULTIMOS_7_DIAS.valorEmDias)
          }
        }
      });

      routerMock.mockClear();
    });
  });
});