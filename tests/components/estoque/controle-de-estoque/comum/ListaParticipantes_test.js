'use strict';

import { mount } from '@vue/test-utils';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import ListaParticipantes from '@/components/estoque/controle-de-estoque/comum/ListaParticipantes.vue';
import apiPessoa from "@/api/sistemas-gerais/pessoa-api";

describe('ListaParticipantes.vue', () => {
  let pessoa = {
    foto: 'data:image/jpg;base64',
    identificador: 1,
    nome: 'Joshua Bardwell',
    nomeCurto: 'Bardwell'
  };

  sync(store, router);

  it('Deve exibir os participantes carregando os seus dados.', () => {
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([pessoa]));
    var wrapperTeste = mount(ListaParticipantes, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        participantes: [
          {
            funcionario: {
              identificador: pessoa.identificador,
              foto: undefined,
              nome: undefined
            }
          }
        ]
      }
    });

    expect(wrapperTeste.vm.imagensCarregadas).toBeFalsy();
    expect(wrapperTeste.vm.participantes[0].funcionario.identificador).toEqual(pessoa.identificador);
    expect(wrapperTeste.vm.participantes[0].funcionario.foto).toEqual(undefined);
    expect(wrapperTeste.vm.participantes[0].funcionario.nome).toEqual(undefined);
    wrapperTeste.vm.exibirParticipantes();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.imagensCarregadas).toBeTruthy();
      expect(wrapperTeste.vm.participantes[0].funcionario.foto).toEqual(pessoa.foto);
      expect(wrapperTeste.vm.participantes[0].funcionario.nome).toEqual(pessoa.nome);
    });
  });

  it('Deve incluir o funcionario selecionado quando ele ainda não estiver na lista de participantes.', () => {
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([pessoa]));
    var wrapperTeste = mount(ListaParticipantes, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: { participantes: [] }
    });

    expect(wrapperTeste.vm.participantes.some(p => p.funcionario.identificador == pessoa.identificador)).toBeFalsy();
    wrapperTeste.vm.exibirJanela = true;
    wrapperTeste.vm.funcionario = pessoa;
    wrapperTeste.vm.incluirParticipante();
    expect(wrapperTeste.vm.exibirJanela).toBeFalsy();
    expect(wrapperTeste.vm.participantes.some(p => p.funcionario.identificador == pessoa.identificador)).toBeTruthy();
    expect(wrapperTeste.vm.funcionario).toBeUndefined();
  });

  it('Não deve incluir o funcionario selecionado quando ele já estiver na lista de participantes.', () => {
    var wrapperTeste = mount(ListaParticipantes, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: { participantes: [ { funcionario: pessoa } ] }
    });

    let metodo = jest.fn();
    wrapperTeste.vm.$mensagemFlutuante.erro = metodo;
    expect(wrapperTeste.vm.participantes.some(p => p.funcionario.identificador == pessoa.identificador)).toBeTruthy();
    wrapperTeste.vm.funcionario = pessoa;
    wrapperTeste.vm.incluirParticipante();
    expect(metodo).toHaveBeenCalled();
  });

  it('Não deve atualizar a foto do funcionário se ele não for encontrado.', () => {
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve());
    var wrapperTeste = mount(ListaParticipantes, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: { participantes: [ { funcionario: pessoa } ] }
    });

    var participante = { funcionario: { identificador: 1 } };
    wrapperTeste.vm.carregarImagemDoParticipante(participante);
    expect(participante.funcionario.foto).toBeUndefined();
    expect(participante.funcionario.nome).toBeUndefined();
  });

  it('Não deve apresentar erro caso não consiga resgatar a foto do participante.', () => {
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.reject('erro'));
    var wrapperTeste = mount(ListaParticipantes, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: { participantes: [ { funcionario: pessoa } ] }
    });

    var participante = { funcionario: { identificador: 1 } };
    var excecao = undefined;

    try {
      wrapperTeste.vm.carregarImagemDoParticipante(participante);
    } catch (erro) {
      excecao = erro;
    }
    expect(excecao).toBeUndefined();
  });

  it('Não deve carregar a foto dos participantes se elas já estiverem carregadas.', () => {
    var wrapperTeste = mount(ListaParticipantes, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: { participantes: [ { funcionario: pessoa } ] }
    });

    jest.spyOn(wrapperTeste.vm, 'carregarImagemDoParticipante').mockImplementation(() => {});
    
    expect(wrapperTeste.vm.participantes.length).toBeGreaterThan(0);
    wrapperTeste.vm.imagensCarregadas = true;
    wrapperTeste.vm.exibirParticipantes();
    expect(wrapperTeste.vm.carregarImagemDoParticipante).not.toHaveBeenCalled();
  });
});