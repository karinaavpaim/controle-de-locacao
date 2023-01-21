'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import adicionalPersonalizadoApi from '@/api/faturamento/controle-de-locacao/adicionais-personalizados-api.js';
import ControleDeAdicionaisPersonalizados from '@/components/faturamento/controle-de-locacao/orcamento/ControleDeAdicionaisPersonalizados';
import { COLUNAS_TABELA_CONTROLE_ADICIONAIS_PERSONALIZADOS } from '@/constants/faturamento/controle-de-locacao/controle-de-adicionais-personalizados-constants.js';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';
import AdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/adicional-personalizado-model';

describe('ControleDeAdicionaisPersonalizados.vue', () => {
  jest.spyOn(apiOrcamento, 'obterAdicionaisPersonalizados')
      .mockImplementation(() => Promise.resolve({}));

  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(ControleDeAdicionaisPersonalizados, {
      store,
      router,
      propsData: {}
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof ControleDeAdicionaisPersonalizados.data).toBe('function');
      expect(wrapper.vm.breadCrumbs.length).toBe(1);
      expect(wrapper.vm.paginacao.sortBy).toBe('codigo');
      expect(wrapper.vm.paginacao.descending).toBe(false);
      expect(wrapper.vm.pesquisa).toEqual('');
      expect(wrapper.vm.adicionaisPersonalizados).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.colunasTabelaControleAdicionaisPersonalizados).toEqual(COLUNAS_TABELA_CONTROLE_ADICIONAIS_PERSONALIZADOS);
    });
  });

  describe('Ações do componente.', () => {
    it('Deve validar o método criarAdicional.', () => {
      wrapper.vm.criarAdicional();
      expect(wrapper.vm.modoEdicao).toBe(false);
      expect(wrapper.vm.adicionalPersonalizado).toEqual(new AdicionalPersonalizadoModel());
      expect(wrapper.vm.dialogAdicionalPersonalizado).toBe(true);
    });

    it('Deve validar o método criarAdicional.', () => {
      wrapper.vm.fecharModalAdicionalPersonalizado();
      expect(wrapper.vm.dialogAdicionalPersonalizado).toBe(false);
    });

    it('Deve filtrar os modelos quando o metodo "filtrarAdicionaisPersonalizados" for chamado', async () => {
      jest.spyOn(apiOrcamento, 'obterAdicionaisPersonalizados')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));

      await wrapper.vm.filtrarAdicionaisPersonalizados();
      expect(wrapper.vm.adicionaisPersonalizados).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.carregando).toBe(false);
    });

    it('Deve validar o método editarAdicionalPersonalizado.', () => {
      wrapper.vm.editarAdicionalPersonalizado({ identificador: "1" });
      wrapper.vm.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.edicaoDeModeloAdicionaisPersonalizados.name,
        params: { idModelo: '1' }
      });
    });

    it('Deve validar o método editarAdicionalPersonalizado.', async () => {
      let modelo = { identificador: 333 };

      jest.spyOn(adicionalPersonalizadoApi, 'obterPorIdentificador')
          .mockImplementation(() => Promise.resolve({}));

      await wrapper.vm.editarAdicionalPersonalizado(modelo.identificador);
      expect(wrapper.vm.modoCopia).toBe(false);
      expect(wrapper.vm.modoEdicao).toBe(true);
      expect(wrapper.vm.adicionalPersonalizado).toEqual(new AdicionalPersonalizadoModel());
      expect(wrapper.vm.dialogAdicionalPersonalizado).toBe(true);
  
      jest.spyOn(adicionalPersonalizadoApi, 'obterPorIdentificador')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));
  
      await wrapper.vm.editarAdicionalPersonalizado(modelo.identificador);
      expect(wrapper.vm.carregando).toBe(false);
    });

    it('Deve validar o método duplicarAdicionaisPersonalizados.', async () => {
      let modelo = { identificador: 333 };

      jest.spyOn(adicionalPersonalizadoApi, 'obterPorIdentificador')
          .mockImplementation(() => Promise.resolve({}));

      await wrapper.vm.duplicarAdicionaisPersonalizados(modelo.identificador);
      expect(wrapper.vm.modoEdicao).toBe(false);
      expect(wrapper.vm.modoCopia).toBe(true);
      expect(wrapper.vm.adicionalPersonalizado).toEqual(new AdicionalPersonalizadoModel());
      expect(wrapper.vm.dialogAdicionalPersonalizado).toBe(true);

      jest.spyOn(adicionalPersonalizadoApi, 'obterPorIdentificador')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));

      await wrapper.vm.duplicarAdicionaisPersonalizados(modelo.identificador);
      expect(wrapper.vm.carregando).toBe(false);
    });

    
    it('Deve validar o método excluirAdicionaisPersonalizados.', async (done) => {
      let modelo = { identificador: 334 };
      wrapper.vm.adicionaisPersonalizados = [modelo];

      var mock = jest.spyOn(adicionalPersonalizadoApi, 'excluir')
          .mockImplementation(() => Promise.resolve({}));

      expect(wrapper.vm.adicionaisPersonalizados.length).toEqual(1);
      await wrapper.vm.excluirAdicionaisPersonalizados(modelo);
      expect(wrapper.vm.adicionaisPersonalizados.length).toEqual(0);
  
      mock.mockClear()
      jest.spyOn(adicionalPersonalizadoApi, 'excluir')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));

      mock.mockClear();
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);

      await wrapper.vm.excluirAdicionaisPersonalizados(modelo);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
  });

  describe('Ações do menu de opções do grid.', () => {
    it('Deve validar o método duplicarAdicionaisPersonalizados.', () => {
      wrapper.vm.duplicarAdicionaisPersonalizados({ identificador: '1' });
      wrapper.vm.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.modeloAdicionaisPersonalizados.name,
        params: { idModelo: '1' }
      });
    });

    it('Deve configurar a exclusão do adicional personalizado', async (done) => {
      let modelo = {
        identificador: "01",
        nome: "modelo",
        descricao: "texto"
      };

      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);

      await wrapper.vm.configurarExclusaoAdicionalPersonalizado(modelo);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
  });

  describe("paginacaoAlterada", ()=>{
    it("deve salvar as informacoes no vuex quando elas forem diferentes da atual", ()=>{
      let mockDispatch = jest.spyOn(wrapper.vm.$store, 'dispatch').mockImplementation(() => {});
      wrapper.vm.itensPorPagina = 5;
      wrapper.vm.paginacaoAlterada({itemsPerPage: 5});
      expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled();
      wrapper.vm.paginacaoAlterada({itemsPerPage: 10});
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();
      mockDispatch.mockClear();
    })
  });

});