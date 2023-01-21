'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import AnaliseDeResultados from '@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/AnaliseDeResultados.vue';

describe('AnaliseDeResultados.vue', () => {
  let wrapper;
  sync(store, router);

 
  beforeEach(() => {
    wrapper = mount(AnaliseDeResultados, {
      store,
      router,
      propsData: {},
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof AnaliseDeResultados.data).toBe('function');
      expect(wrapper.vm.breadCrumbs.length).toBe(2);
      expect(typeof wrapper.vm.entidadeAtual).toBe('object');
      expect(typeof wrapper.vm.graficoPizzaCabecalho).toBe('object');
      expect(typeof wrapper.vm.carregando).toBe('boolean');
      expect(typeof wrapper.vm.identificadorProdutoPadraoBimer).toBe('undefined');
      expect(typeof wrapper.vm.exibirOpcoesMenuBreadcrumb).toBe('boolean');
      expect(typeof wrapper.vm.contatoPrincipalCliente).toBe('object');
    });

    it('Deve verificar se todos métodos definidos nos objetos computed estão criados.', () => {
      expect(typeof AnaliseDeResultados.computed.breadCrumbs).toBe('function');
      expect(typeof AnaliseDeResultados.computed.valorRealizadoGraficoCabecalho).toBe('function');
      expect(typeof AnaliseDeResultados.computed.valorPendenteGraficoCabecalho).toBe('function');
    });

    it('Deve verificar se todos métodos definidos nos objetos methods estão criados.', () => {
      expect(typeof AnaliseDeResultados.methods.obterContatoPrincipalCliente).toBe('function');
      expect(typeof AnaliseDeResultados.methods.montarGraficoPizzaCabecalho).toBe('function');
      expect(typeof AnaliseDeResultados.methods.obterMetaDadosLocacao).toBe('function');
      expect(typeof AnaliseDeResultados.methods.preencherIdentificadorProdutoPadrao).toBe('function');
    });

    it('Deve validar o filtro de data em formato iso.', () => {
      expect(wrapper.vm.$options.filters.data_br('2019-10-15')).toEqual('15/10/2019');
    });
  });
});