'use strict';

import { mount } from '@vue/test-utils'
import notificacoesMixin from "@/mixins/sistema/notificacao/notificacoes-controle-de-estoque-mixin.js";
import { ROTAS_ESTOQUE_METADATA } from "@/constants/router/estoque-router-constants.js";
import apiSelecaoDocumento from "@/api/estoque/controle-de-estoque/selecao-documento-api";

describe('notificacoes-controle-de-estoque-mixin.js', () => {
  let wrapper;
  let identificadorFuncionario = 1;
  let selecao1 = {
    identificador: 1,
    finalizada: false,
    participantes: [
      {
        funcionario: {
          identificador: identificadorFuncionario
        }
      }
    ]
  };
  let selecao2 =  {
    identificador: 2,
    finalizada: false,
    participantes: [
      {
        funcionario: {
          identificador: identificadorFuncionario
        }
      }
    ]
  };
  let selecao3 = {
    identificador: 3,
    finalizada: true,
    participantes: [
      {
        funcionario: {
          identificador: identificadorFuncionario
        }
      }
    ]
  };

  beforeEach(() => {
    wrapper = mount({
      render() {},
      mixins: [notificacoesMixin]
    });
  });

  it('Deve obter as notificações das separações diferentes da aberta atualmente, não finalizadas e não repetidas.', () => {
    var notificacoes = {
      lista: [],
      exibirIcone: false
    };

    let rota = {
      name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueSeparacao.name,
      params: {
        identificador: 2
      }
    };

    let selecoes = [selecao1, selecao1, selecao2, selecao3];

    jest.spyOn(apiSelecaoDocumento, 'obterSelecoesDeDocumentos').mockImplementation(() => Promise.resolve(selecoes));
    jest.spyOn(wrapper.vm, 'assinarNotificacoesDoControleDeEstoque').mockImplementation(() => {});

    wrapper.vm.obterNotificacoesDoControleDeEstoque(rota, notificacoes, identificadorFuncionario);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.assinarNotificacoesDoControleDeEstoque).toHaveBeenCalledWith(notificacoes, identificadorFuncionario);
      expect(apiSelecaoDocumento.obterSelecoesDeDocumentos).toHaveBeenCalledWith(null, identificadorFuncionario);
      expect(notificacoes.exibirIcone).toBeTruthy();
      expect(notificacoes.lista.length).toBe(1); //somente a separação 1, pois a dois está aberta e a 3 está finalizada.
    });
  });

  it('Deve incluir as notificações das separações recebidas via assinatura.', () => {
    var notificacoes = {
      lista: [],
      exibirIcone: false
    };

    let rota = {
      name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueSeparacao.name,
      params: {
        identificador: 2
      }
    };

    let notificacao = { selecaoDeDocumentosAtualizada: selecao1 };

    jest.spyOn(apiSelecaoDocumento, 'assinarNotificacoesSeparacao').mockImplementation((manipulador) => {
      manipulador(notificacao);
    });
    jest.spyOn(window, 'addEventListener').mockImplementation(() => {});

    wrapper.vm.$route = rota;
    wrapper.vm.assinarNotificacoesDoControleDeEstoque(notificacoes, identificadorFuncionario);
    wrapper.vm.$nextTick(() => {
      expect(apiSelecaoDocumento.assinarNotificacoesSeparacao).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(notificacoes.exibirIcone).toBeTruthy();
      expect(notificacoes.lista.length).toBe(1);
    });
  });

  it('Deve remover uma notificação já finalizada recebida por assinatura.', () => {

    let rotaDaSelecao1 = {
      name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueSeparacao.name,
      params: {
        identificador: 1
      }
    };

    var notificacoes = {
      lista: [
        {
          descricao: 'Notificação que precisa ser removida.',
          rota: rotaDaSelecao1
        }
      ],
      exibirIcone: false
    };

    let selecao = Object.assign({}, selecao1);
    selecao.finalizada = true;
    let notificacao = { selecaoDeDocumentosAtualizada: selecao };

    jest.spyOn(apiSelecaoDocumento, 'assinarNotificacoesSeparacao').mockImplementation((manipulador) => {
      manipulador(notificacao);
    });
    jest.spyOn(window, 'addEventListener').mockImplementation(() => {});

    wrapper.vm.$route = rotaDaSelecao1;
    wrapper.vm.assinarNotificacoesDoControleDeEstoque(notificacoes, identificadorFuncionario);
    wrapper.vm.$nextTick(() => {
      expect(apiSelecaoDocumento.assinarNotificacoesSeparacao).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(notificacoes.lista.length).toBe(0);
    });
  });

  it('Não deve tentar remover nada caso não seja informada nenhuma notificação por parâmetro.', () => {
    var notificacoes = { lista: [1,2,3] };
    wrapper.vm.removerSeparacaoDasNotificacoes(notificacoes, undefined);
    expect(notificacoes.lista.length).toBe(3);
  });

  it('Não deve tentar remover nada caso não encontre a notificação informada.', () => {
    var notificacoes = {
      lista: [
        {
          rota: {
            name: 'teste',
            params: {
              identificador: 999
            }
          }
        }
      ]
    };

    wrapper.vm.removerSeparacaoDasNotificacoes(notificacoes, { identificador: 1 });
    expect(notificacoes.lista.length).toBe(1);
  });

  it('Deve desinscrever da assinatura quando o evento "window.beforeunload" ocorrer', () => {
    var assinatura = {
      inscrito: true,
      unsubscribe(){
        this.inscrito = false;
      }
    };

    jest.spyOn(apiSelecaoDocumento, 'assinarNotificacoesSeparacao').mockImplementation(() => assinatura);
    jest.spyOn(window, 'addEventListener').mockImplementation((nomeEvento, evento) => {
      if (nomeEvento === 'beforeunload')
        evento.call({ assinaturaNotificacoes: wrapper.vm.assinaturaNotificacoes });
    });

    wrapper.vm.assinarNotificacoesDoControleDeEstoque();
    wrapper.vm.$nextTick(() => {
      expect(window.addEventListener).toHaveBeenCalled();
      expect(assinatura.inscrito).toBeFalsy();
    });
  });

  it('Não deve alertar caso não consiga obter notificações.', () => {
    wrapper.vm.assinaturaNotificacoes = {};
    jest.spyOn(apiSelecaoDocumento, 'obterSelecoesDeDocumentos').mockImplementation(() => Promise.reject());
    let notificacoes = { exibirIcone: false, lista: [] };
    wrapper.vm.incluirNotificacoesDoControleDeEstoque(undefined, notificacoes, identificadorFuncionario);
    wrapper.vm.$nextTick(() => {
      expect(apiSelecaoDocumento.obterSelecoesDeDocumentos).toHaveBeenCalledWith(null, identificadorFuncionario);
      expect(notificacoes.exibirIcone).toBeTruthy();
      expect(notificacoes.lista).toEqual(expect.arrayContaining([]));
    });
  });
});