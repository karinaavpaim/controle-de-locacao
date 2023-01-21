'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import PesquisaDeModeloDeProposta from '@/components/faturamento/controle-de-locacao/proposta/PesquisaDeModeloDeProposta';
import apiProposta  from '@/api/faturamento/controle-de-locacao/proposta-locacao-api.js';
import modelosDePropostaFake from '../../../../fakes/faturamento/proposta/modelos-de-proposta-fake.json';
import ModeloPropostaLocacaoModel from '@/models/faturamento/proposta-locacao/modelo-proposta-model.js';

describe('PesquisaDeModeloDeProposta.vue', () => {
  let wrapper;
  sync(store, router);

  jest.spyOn(apiProposta, 'obterModelosDePropostaSemTrazerConteudo')
    .mockImplementation(() => Promise.resolve(modelosDePropostaFake));

  beforeEach(() => {
    wrapper = mount(PesquisaDeModeloDeProposta, {
      store,
      router,
      propsData: {
        itemSelecionado: new ModeloPropostaLocacaoModel({
          identificador:'1',
          nome:'Modelo Teste',
          descricao:'Descricao Teste',
          conteudo:'Conteudo Teste'
        })
      }
    });
  });

  it('Deve validar as propriedades do Data', () => {
    expect(wrapper.vm.apresentarLabelOriginal).toBe(true);
    expect(wrapper.vm.labelOriginal).toBe('Escolha o modelo');
    expect(wrapper.vm.labelComModeloSelecionado).toBe('Modelo');
    expect(wrapper.vm.item.constructor.name).toBe('ModeloPropostaLocacaoModel');
    expect(wrapper.vm.modelosDePropostas.length).toBe(1);
  });

  it('Deve validar o método itemAlterado.', () => {
    wrapper.vm.itemAlterado();
    expect(wrapper.emitted().onChange).toBeTruthy();

    wrapper.vm.item = undefined;
    wrapper.vm.itemAlterado();
    expect(wrapper.emitted().onChange).toBeTruthy();
  });

  it('Deve validar o método obterModelosCadastrados.', async  () =>{
    wrapper.vm.modelosDePropostas = [];

    await wrapper.vm.obterModelosCadastrados();

    expect(wrapper.vm.modelosDePropostas.length ).toBe(4);

    expect(wrapper.vm.modelosDePropostas[3].identificador).toBe('4');
    expect(wrapper.vm.modelosDePropostas[3].nome).toBe('Modelo de proposta do Específico');
    expect(wrapper.vm.modelosDePropostas[3].descricao).toBe('descrição do modelo 4 contendo o tamanho máximo de 100 caracteres para testar o comportamento do msm');
    expect(wrapper.vm.modelosDePropostas[3].conteudo).toBe('conteúdo do modelo 4');
  });

  it('Deve obter todos os modelos cadastrados no inicializar quando não for informado um modelo na prop.', async () => {
    wrapper.vm.itemSelecionado.identificador = undefined;
  
    await wrapper.vm.inicializar();
    expect(wrapper.vm.modelosDePropostas.length ).toBe(4);
  });

  it('Deve alterar o item quando o itemSelecionado for alterado.', () => {
    wrapper.vm.itemSelecionado =  new ModeloPropostaLocacaoModel({
      identificador:'2',
      nome:'Modelo Teste 2',
      descricao:'Descricao Teste 2',
      conteudo:'Conteudo Teste 2'
    })
    expect(wrapper.vm.apresentarLabelOriginal).toBe(false);
    expect(wrapper.vm.item).toEqual(wrapper.vm.itemSelecionado);
  });
});