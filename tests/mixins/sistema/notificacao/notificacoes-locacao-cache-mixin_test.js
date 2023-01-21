'use strict';

import { mount } from '@vue/test-utils'
import notificacoesMixin from "@/mixins/sistema/notificacao/notificacoes-locacao-cache-mixin.js";
import apiLocacaoCache from "@/api/faturamento/controle-de-locacao/locacao-cache-api";
import { CATEGORIAS } from '@/constants/faturamento/controle-de-locacao/locacao-cache-constants';
import MedicaoLocacaoModel from "@/models/estoque/medicao/medicao-locacao-model";
import LocacaoCacheModel from '@/models/faturamento/orcamento-locacao/locacao-cache-model';


const locacoes = [
  new LocacaoCacheModel({
    identificador: 1,
    identificadorUsuario: 1,
    descricao: "Teste A",
    categoria: CATEGORIAS.MEDICAO.CATEGORIA,
    valor: JSON.stringify(new MedicaoLocacaoModel({
      identificador: 1,
      codigoLocacao: '00001',
      nomeCurto:' Teste Cliente A'
    }))
  }),
  new LocacaoCacheModel({
    identificador: 2,
    identificadorUsuario: 1,
    descricao: "Teste B",
    categoria: CATEGORIAS.MEDICAO.CATEGORIA,
    valor: JSON.stringify(new MedicaoLocacaoModel({
      identificador: 2,
      codigoLocacao: '00002',
      nomeCurto:' Teste Cliente B'
    }))
  }),
]
describe('notificacoes-locacao-cache-mixin.js', () => {
  let wrapper;
  let identificadorUsuario = 1;
  
  beforeEach(() => {
    wrapper = mount({
      render() {},
      mixins: [notificacoesMixin]
    });
  });

  it('Deve obter as notificações da locacao cache.', () => {
    var notificacoes = {
      lista: [],
      exibirIcone: false
    };

    jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.resolve(locacoes));

    wrapper.vm.obterNotificacoesLocacaoCache(notificacoes, identificadorUsuario);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.obterNotificacoesLocacaoCache).toHaveBeenCalledWith(notificacoes, identificadorUsuario);
      expect(apiLocacaoCache.obterLocacaoCache).toHaveBeenCalledWith(null, identificadorUsuario);
      expect(notificacoes.exibirIcone).toBeTruthy();
      expect(notificacoes.lista.length).toBe(2); 
    });
  });

  it('Não deve disparar mensagem quando não for possível obter as notificações da locacao cache.', async (done) => {
    var notificacoes = {
      lista: [],
      exibirIcone: false
    };

    jest.clearAllMocks();
    jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.reject('Deu ruim ...'));
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
    await wrapper.vm.obterNotificacoesLocacaoCache(notificacoes, identificadorUsuario);

    wrapper.vm.$nextTick(() => {
      try {
        expect(wrapper.vm.$mensagemFlutuante.erro).not.toHaveBeenCalled();
        expect(notificacoes.lista.length).toBe(0); 
        done();
      }
      catch (err) { done.fail(err) }
    });

  });

  it('Não deve disparar mensagem quando não for possível incluir as notificações da medição.', async (done) => {
    var notificacoes = {
      lista: [],
      exibirIcone: false
    };

    jest.clearAllMocks();
    jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.reject('Deu ruim ...'));
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
    await wrapper.vm.incluirNotificacoesMedicao(notificacoes, locacoes[0]);

    wrapper.vm.$nextTick(() => {
      try {
        expect(wrapper.vm.$mensagemFlutuante.erro).not.toHaveBeenCalled();
        expect(notificacoes.lista.length).toBe(0); 
        done();
      }
      catch (err) { done.fail(err) }
    });

  });

  


});