'use strict';

import { mount } from '@vue/test-utils';
import TabelaGenerica from '@/components/comum/TabelaGenerica';
import store from '@/store';

describe('TabelaGenerica.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TabelaGenerica, {
      store,
      propsData: {},
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof TabelaGenerica.data).toBe('function');
      expect(wrapper.vm.indiceItemSendoEditado).toBe(0);
      expect(wrapper.vm.pesquisa).toBe("");
      expect(wrapper.vm.movimentacaoDeLocacao).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.test).toEqual(expect.arrayContaining([]));
    });

    it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
      expect(typeof TabelaGenerica.computed.temItensParaExibir).toBe('function');
      expect(typeof TabelaGenerica.computed.temColunaPersonalizada).toBe('function');
      expect(typeof TabelaGenerica.computed.temAreaExpandida).toBe('function');
      expect(typeof TabelaGenerica.computed.exibirColunaComIconeParaExpandir).toBe('function');
      expect(typeof TabelaGenerica.computed.areaExpandeAutomaticamente).toBe('function');
      expect(typeof TabelaGenerica.computed.listaDeColunasCompleta).toBe('function');
      expect(typeof TabelaGenerica.watch.itensParaExpandir).toBe('object');
      expect(typeof TabelaGenerica.watch.paginaAtualTabela).toBe('function');
      expect(typeof TabelaGenerica.watch.itensTabela).toBe('function');
      expect(typeof TabelaGenerica.watch.pesquisaExterna).toBe('function');
    });

    it('Valida o valor computed temColunaPersonalizada.', () => {
      let componente = mount(TabelaGenerica, {
        store,
        propsData: {}
      });

      expect(componente.vm.temColunaPersonalizada).toBeFalsy();
    });

    it('Valida o valor computed temAreaExpandida.', () => {
      let componente = mount(TabelaGenerica, {
        store,
        propsData: {}
      });

      expect(componente.vm.temAreaExpandida).toBeFalsy();
    });

    it('Valida o watch paginaAtualTabela', () => {
      let valor = undefined;
      wrapper.vm.$options.watch.paginaAtualTabela(valor);
      expect(wrapper.vm.paginaAtual).toBe(1);
    });
  });

  describe("Método", ()=> {
    describe("_obterDadoPorCaminhoDoObjeto", ()=>{
      let objeto = {
        nivel1: {
          nivel2: {
            nivel3: [
              {
                dadoNoArray: true
              }
            ]
          }
        }
      }

      it("deve encontrar os dados em um objeto, de acordo com o caminho passado por parâmetro (string com separador padrao '.')", ()=> {
        let caminho = 'nivel1.nivel2.nivel3.0.dadoNoArray';
        let valorEsperado = wrapper.vm._obterDadoPorCaminhoDoObjeto(caminho, objeto);
        expect(valorEsperado).toBeTruthy();
      });

      it("deve encontrar os dados em um objeto, de acordo com o caminho passado por parâmetro (string com separador customizado ', ')", ()=> {
        let caminho = 'nivel1, nivel2, nivel3, 0, dadoNoArray';
        let separador = ', ';
        let valorEsperado = wrapper.vm._obterDadoPorCaminhoDoObjeto(caminho, objeto, separador);
        expect(valorEsperado).toBeTruthy();
      });

      it("deve encontrar os dados em um objeto, de acordo com o caminho passado por parâmetro (array com separador padrao '.')", ()=> {
        let caminho = ['nivel1','nivel2','nivel3','0','dadoNoArray'];
        let valorEsperado = wrapper.vm._obterDadoPorCaminhoDoObjeto(caminho, objeto);
        expect(valorEsperado).toBeTruthy();
      });
    });

    describe("paginacaoAlterada", ()=>{
      it("deve salvar as informacoes no vuex quando elas forem diferentes da atual", ()=>{
        let mockDispatch = jest.spyOn(wrapper.vm.$store, 'dispatch').mockImplementation(() => {});
        wrapper.vm.chaveModeloConfiguracoesPagina = "chave";
        wrapper.vm.itensPorPagina = 5;
        wrapper.vm.paginacaoAlterada({itemsPerPage: 5});
        expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled();
        wrapper.vm.paginacaoAlterada({itemsPerPage: 10});
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();
        mockDispatch.mockClear();
      })
    });

  });
});