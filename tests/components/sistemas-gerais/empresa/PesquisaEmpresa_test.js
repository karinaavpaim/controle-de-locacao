'use strict';

import apiEmpresa  from '@/api/sistemas-gerais/empresa-api.js';
import { mount } from '@vue/test-utils';
import PesquisaEmpresa from '@/components/sistemas-gerais/empresa/PesquisaEmpresa.vue';
import empresas from '../../../fakes/sistemas-gerais/empresa/empresas.json';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";
import EmpresaModel from '@/models/geral/empresa-model';

describe('PesquisaEmpresa.vue', () => {
  let wrapper;
  sync(store, router);

  jest.spyOn(apiEmpresa, 'localizarEmpresa').mockImplementation(() => Promise.resolve(empresas));

  beforeEach(() => {
    store.dispatch(OPCOES_STORE_EMPRESA.ACTIONS.ALTERAR_LISTA_EMPRESAS, new Promise((resolve)=>resolve(empresas.map((empresa)=>new EmpresaModel(empresa)))));
    wrapper = mount(PesquisaEmpresa, {
      store,
      router,
      propsData: {
        id: 'pesquisa-empresa',
        label: 'Empresa',
        placeholder: 'Escolha sua empresa',
        atributoExibicao: 'nome',
        atributoValor: 'identificador',
        desabilitar: false,
        focus: false
      }
    });
  });

  describe('Construção - ', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof PesquisaEmpresa.data).toBe('function');
      expect(wrapper.vm.carregando).toBeFalsy();
      expect(wrapper.vm.listaItens).toEqual(expect.arrayContaining([]));
      expect(wrapper.vm.localizar).toBe('');
      expect(wrapper.vm.model).toBeUndefined();
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().id).toBe('pesquisa-empresa');
      expect(wrapper.props().label).toBe('Empresa');
      expect(wrapper.props().placeholder).toBe('Escolha sua empresa');
      expect(wrapper.props().itemSelecionado).toBeUndefined();
      expect(wrapper.props().atributoExibicao).toBe('nome');
      expect(wrapper.props().atributoValor).toBe('identificador');
      expect(wrapper.props().desabilitar).toBeFalsy();
      expect(wrapper.props().focus).toBeFalsy();
    });
  });

  describe('Ações - ', () => {
    it('Deve emitir o evento onFocus quando o método "onFocus" for chamado.', () => {
      wrapper.vm.onFocus();
      expect(wrapper.emitted().onFocus).toBeTruthy();
    });

    it('Deve emitir o evento onFocus quando o atributo "focus" for alterado.', () => {
      wrapper.vm.focus = true;
      expect(wrapper.emitted().onFocus).toBeTruthy();
      wrapper.vm.focus = false;
      expect(wrapper.emitted().onFocus).toBeTruthy();
    });

    it('Deve limpar o modelo quando sair do campo e nenhum item tenha sido selecionado', () => {
      wrapper.vm.onBlur();
      expect(wrapper.vm.model).toBeUndefined();
    });

    it('Não deve limpar o modelo quando sair do campo e algum item tenha sido selecionado', () => {
      wrapper.vm.listaItens = empresas;
      wrapper.vm.model = empresas[0];
      wrapper.vm.$refs.inputEmpresa.selectedItem = empresas[0];
      wrapper.vm.onBlur();
      expect(wrapper.vm.model).toBe(empresas[0]);
    });

    it('Deve atualizar o modelo quando algum item for selecionado.', () => {
      wrapper.vm.model = empresas[0];
      expect(wrapper.vm.model).toEqual(empresas[0]);
    });

    it('A lista de itens deve conter apenas o item selecionado caso seja informado na declaração.', () => {
      var wrapper = mount(PesquisaEmpresa, {
        store,
        router,
        propsData: {
          id:'teste',
          label: 'Empresa',
          atributoExibicao: 'nome',
          atributoValor: 'identificador',
          itemSelecionado: empresas[0]
        }
      });

      expect(wrapper.vm.listaItens).toEqual([empresas[0]]);
    });

    it('A lista de itens deve conter o resultado da pesquisa ou uma lista vazia', () => {
      jest.spyOn(apiEmpresa, 'localizarEmpresa').mockClear();
      jest.spyOn(apiEmpresa, 'localizarEmpresa').mockImplementation(() => Promise.resolve(null));
      wrapper.vm.localizar = '1';
      expect(wrapper.vm.listaItens.length).toEqual(2);
    });

    it('A lista de itens deve vir da store', async (done) => {
      wrapper.vm.empresaDoSistema = true;
      await wrapper.vm.obterListaDeEmpresas();
      wrapper.vm.$nextTick(()=>{
        try{
          expect(wrapper.vm.listaItens.length).toBe(2);
          done();
        }
        catch(e){
          done.fail(e);
        }
      })
    });
  });
});