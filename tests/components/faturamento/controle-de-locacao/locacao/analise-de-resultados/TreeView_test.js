'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import TreeView from '@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/TreeView.vue';
import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';
import ItemAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/item-analise-resultado-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

describe('TreeView.vue', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(TreeView, {
      store,
      router,
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
      expect(typeof TreeView.data).toBe('function');
      expect(typeof wrapper.vm.pesquisar).toBe("string");
      expect(typeof wrapper.vm.abrir).toBe("object");
      expect(typeof wrapper.vm.abrirTodos).toBe("boolean");
      expect(typeof wrapper.vm.ultimosAbertos).toBe("object");
      expect(typeof wrapper.vm.model).toBe('object');
    });

    it('Deve verificar se todos métodos definidos no objeto watch estão criados.', () => {
      expect(typeof TreeView.watch.metaDados).toBe('function');
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

    it('Deve obter a classe do status.', () => {
      const status = 'ABERTO';
      expect(STATUS_ITEM[status]).not.toEqual(undefined);
      expect(wrapper.vm.obterClasseParaStatus(status)).toEqual(STATUS_ITEM.ABERTO.classe);
    });

    it('Não deve obter a classe para um status inexistente.', () => {
      const status = '123';
      expect(STATUS_ITEM[status]).toEqual(undefined);
      expect(wrapper.vm.obterClasseParaStatus(status)).toEqual('');
    });

    it('Deve obter a descrição do status.', () => {
      const status = 'ABERTO';
      expect(STATUS_ITEM[status]).not.toEqual(undefined);
      expect(wrapper.vm.obterDescricaoDoStatus(status)).toEqual(STATUS_ITEM.ABERTO.descricao);
    });

    it('Não deve obter a descrição de um status inexistente.', () => {
      const status = '123';
      expect(STATUS_ITEM[status]).toEqual(undefined);
      expect(wrapper.vm.obterDescricaoDoStatus(status)).toEqual('');
    });

    it('Deve validar o watch identificadorProdutoPadrao.', () => {
      wrapper.vm.$options.watch.identificadorProdutoPadrao();
      expect(wrapper.vm.identificadorProdutoPadraoBimer).toBe(wrapper.vm.identificadorProdutoPadrao);
    });
  });
});