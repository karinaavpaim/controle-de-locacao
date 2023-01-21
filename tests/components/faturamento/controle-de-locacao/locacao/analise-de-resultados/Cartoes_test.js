'use strict';

import { mount } from '@vue/test-utils';
import Cartoes from '@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/Cartoes.vue';
import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';
import ItemAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/item-analise-resultado-model';

describe('Cartoes.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Cartoes, {
      propsData: {
        metaDados: new MetaDadosAnaliseResultadoModel({
          "adicionaisPersonalizados": [],
          "detalhamento": [],
          "totalGeral": undefined
        })
      },
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof Cartoes.data).toBe('function');
      expect(typeof wrapper.vm.model).toBe('object');
    });

    it('Deve verificar se todos métodos definidos no objeto watch estão criados.', () => {
      expect(typeof Cartoes.watch.metaDados).toBe('function');
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().metaDados).toEqual({
        "adicionaisPersonalizados": [],
        "detalhamento": [],
        "totalGeral": new ItemAnaliseResultadoModel
      });
    });

    it ('Validando o watch metaDados.', () => {
      wrapper.vm.$options.watch.metaDados();
      expect(wrapper.vm.model).toStrictEqual(new MetaDadosAnaliseResultadoModel());
    });

    it('Deve validar o filtro de dinheiro.', () => {
      expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
    });
  });
});