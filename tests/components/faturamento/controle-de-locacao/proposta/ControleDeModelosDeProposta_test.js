'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api.js";
import ControleDeModelosDeProposta from '@/components/faturamento/controle-de-locacao/proposta/ControleDeModelosDeProposta';
import { COLUNAS_TABELA_CONTROLE_MODELOS_PROPOSTAS } from "@/constants/faturamento/controle-de-locacao/controle-de-modelos-de-propostas-constants.js";
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants';
import { OPCOES_STORE_ACESSOS } from "@/store/modules/acessos";
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js'

store.dispatch(OPCOES_STORE_ACESSOS.ACTIONS.ALTERAR_ACESSOS, Promise.resolve([
  {
    identificador: ROTAS_FATURAMENTO_METADATA.edicaoDeModeloPropostaLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  },
  {
    identificador: ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  }
]));

describe('ControleDeModelosDeProposta.vue', () => {
  jest.spyOn(apiProposta, 'obterModelosDePropostaSemTrazerConteudo')
      .mockImplementation(() => Promise.resolve({}));

  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(ControleDeModelosDeProposta, {
      store,
      router,
      propsData: {}
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof ControleDeModelosDeProposta.data).toBe('function');
      expect(wrapper.vm.breadCrumbs.length).toBe(1);
      expect(wrapper.vm.paginacao.sortBy).toBe('identificador');
      expect(wrapper.vm.paginacao.descending).toBe(false);
      expect(wrapper.vm.pesquisa).toEqual('');
      expect(wrapper.vm.modelosDePropostas).toEqual({});
      expect(wrapper.vm.colunasTabelaControleModelosPropostas).toEqual(COLUNAS_TABELA_CONTROLE_MODELOS_PROPOSTAS);
    });
  });

  describe('Ações do componente.', () => {
    it('Deve validar o método criarModelo.', () => {
      wrapper.vm.criarModelo();
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.name);
      });
    });

    it('Deve filtrar os modelos quando o metodo "filtrarModelosDeProposta" for chamado', async () => {
      jest.spyOn(apiProposta, 'obterModelosDePropostaSemTrazerConteudo')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));

      await wrapper.vm.filtrarModelosDeProposta();
      expect(wrapper.vm.modelosDePropostas).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.carregando).toBe(false);
    });

    it('Deve validar o método editarModeloDeProposta.', () => {
      wrapper.vm.editarModeloProposta({ identificador: "1" });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.edicaoDeModeloPropostaLocacao.name);
        expect(wrapper.vm.$route.params.idModelo).toBe('1');
      });
    });

    it('Deve validar o método duplicarModeloDeProposta.', () => {
      wrapper.vm.duplicarModeloDeProposta({ identificador: "1" });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.name);
        expect(wrapper.vm.$route.params.idModelo).toBe('1');
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

  describe('Ações do menu de opções do grid.', () => {
    it('Deve validar o método duplicarModeloDeProposta.', () => {
      wrapper.vm.duplicarModeloDeProposta(null);
      wrapper.vm.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.name,
        params: { idModelo: "1" }
      });
    });

    it('Deve configurar a exclusão do modelo', async (done) => {
      let modelo = {
        identificador: "01",
        nome: "modelo",
        descricao: "texto"
      };

      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);

      await wrapper.vm.configurarExclusaoModeloDeProposta(modelo);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
  });
});