'use strict';

import { mount } from '@vue/test-utils';
import Graficos from '@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/Graficos.vue';
import ItemAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/item-analise-resultado-model';

describe('Graficos.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Graficos, {
      propsData: {},
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof Graficos.data).toBe('function');
      expect(typeof wrapper.vm.graficoDemonstrativoPorCategoria).toBe('object');
      expect(typeof wrapper.vm.graficoDemonstrativoOrcadoPorCategoria).toBe('object');
      expect(typeof wrapper.vm.graficoDemonstrativoAjustadoPorCategoria).toBe('object');
      expect(typeof wrapper.vm.graficoDemonstrativoAjustadoPorCategoria).toBe('object');
      expect(wrapper.vm.rankingOrcadoPorCategoria).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.rankingAjustadoPorCategoria).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.orcados).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.ajustados).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.realizados).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.graficoOrcado).toBeTruthy();
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().metaDados).toEqual({
        "adicionaisPersonalizados": [],
        "detalhamento": [],
        "totalGeral": new ItemAnaliseResultadoModel
      });
    });

    it('Deve preencher o objeto graficoDemonstrativoPorCategoria', () => {
      wrapper.vm.graficoDemonstrativoPorCategoria = undefined;
      wrapper.vm.montarGraficoDemonstrativoPorCategoria();
      expect(wrapper.vm.graficoDemonstrativoPorCategoria).toBeDefined();
    });

    it('Deve preencher o objeto graficoDemonstrativoOrcadoPorCategoria', () => {
      wrapper.vm.graficoDemonstrativoOrcadoPorCategoria = undefined;
      wrapper.vm.montarGraficoDemonstrativoOrcadoPorCategoria();
      expect(wrapper.vm.graficoDemonstrativoOrcadoPorCategoria).toBeDefined();
    });

    it('Deve preencher o objeto graficoDemonstrativoAjustadoPorCategoria', () => {
      wrapper.vm.graficoDemonstrativoAjustadoPorCategoria = undefined;
      wrapper.vm.montarGraficoDemonstrativoAjustadoPorCategoria();
      expect(wrapper.vm.graficoDemonstrativoAjustadoPorCategoria).toBeDefined();
    });
  });
});