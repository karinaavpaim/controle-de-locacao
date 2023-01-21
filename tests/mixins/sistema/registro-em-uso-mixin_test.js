'use strict';

import { mount } from '@vue/test-utils'
import registroEmUsoMixin from "@/mixins/sistema/registro-em-uso-mixin.js";
import apiRegistroEmUso from "@/api/sistema/registro-em-uso-api";
import RegistroEmUsoModel from "@/models/geral/registro-em-uso";

describe('registro-em-uso-mixin.js', () => {
  let wrapper;
  let windowSpyOn;

  beforeEach(() => {
    wrapper = mount({
      render() {},
      mixins: [registroEmUsoMixin]
    });

    windowSpyOn = jest.spyOn(window, "window", "get");
  });

  afterEach(() => {
    windowSpyOn.mockRestore();
  });

  it('Deve verificar atributos de inicialização (data()).', () => {
    expect(registroEmUsoMixin.data().registroEmUso).toBeInstanceOf(RegistroEmUsoModel);
    expect(registroEmUsoMixin.data().registrandoUso).toBeFalsy();
    expect(registroEmUsoMixin.data().abertoEmOutroLocal).toBeFalsy();
    expect(registroEmUsoMixin.data().assinaturaNotificacoes).toBeUndefined;
    expect(registroEmUsoMixin.data().acaoRegistroJaEmUso).toBeInstanceOf(Function);
    expect(registroEmUsoMixin.data().acaoUsoRegistrado).toBeInstanceOf(Function);
    expect(registroEmUsoMixin.data().entidadesRegistroEmUso).toBeInstanceOf(Object);
  });

  it('Deve verificar se todos métodos definidos nos objetos methods estão criados.', () => {
    expect(typeof registroEmUsoMixin.methods._removerAssinaturaNotificacoes).toBe('function');
    expect(typeof registroEmUsoMixin.methods._assinarNotificacoes).toBe('function');
    expect(typeof registroEmUsoMixin.methods._notificacaoRecebida).toBe('function');
    expect(typeof registroEmUsoMixin.methods._registrosIguais).toBe('function');
    expect(typeof registroEmUsoMixin.methods.registrarUso).toBe('function');
    expect(typeof registroEmUsoMixin.methods._removerRegistroEmUso).toBe('function');
    expect(typeof registroEmUsoMixin.methods.notificarQueRegistroJaEstaEmUso).toBe('function');
  });

  it('Deve remover o registro em uso quando os parâmetros da rota mudarem.', () => {
    jest.spyOn(wrapper.vm, '_removerRegistroEmUso').mockImplementation(() => {});
    wrapper.vm.registroEmUso.identificador = 1;

    wrapper.vm.$options.watch['$route.params'].call(wrapper.vm);

    expect(wrapper.vm._removerRegistroEmUso).toHaveBeenCalled();
  });

  it('Deve remover o registro em uso quando a instância for destruída.', () => {
    let wrapperTeste = mount({
      render() {},
      mixins: [registroEmUsoMixin]
    });

    jest.spyOn(wrapperTeste.vm, '_removerRegistroEmUso').mockImplementation(() => {});
    wrapperTeste.vm.registroEmUso.identificador = 1;
    wrapperTeste.vm.registroEmUso.identificadorEntidade = 1;
    wrapperTeste.vm.registroEmUso.nomeEntidade = 'TESTE';
    wrapperTeste.vm.registroEmUso.nomeUsuario = 'TESTE';

    wrapperTeste.destroy();

    expect(wrapperTeste.vm._removerRegistroEmUso).toHaveBeenCalled();
  });

  it('Não deve remover o registro em uso quando a instância for destruída se o modelo for inválido.', () => {
    let wrapperTeste = mount({
      render() {},
      mixins: [registroEmUsoMixin]
    });

    jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.resolve());

    wrapperTeste.destroy();

    expect(apiRegistroEmUso.removerRegistroEmUso).not.toHaveBeenCalled();
  });

  it('Antes de sair da rota, deve cancelar a assinatura e remover o registro em uso.', () => {
    let wrapperTeste = mount({
      render() {},
      mixins: [registroEmUsoMixin]
    });

    let removeEventListener = jest.fn();
    windowSpyOn.mockImplementation(() => ({ removeEventListener }));
    jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.resolve());

    let assinatura = { unsubscribe: jest.fn() };
    wrapperTeste.vm.assinaturaNotificacoes = assinatura;
    wrapperTeste.vm.registroEmUso.identificador = 123;
    wrapperTeste.vm.registroEmUso.identificadorEntidade = 321;
    wrapperTeste.vm.registroEmUso.nomeEntidade = 'TESTE';
    wrapperTeste.vm.registroEmUso.nomeUsuario = 'TESTE';

    let metodoNext = jest.fn();
    registroEmUsoMixin.beforeRouteLeave.call(wrapperTeste.vm, 'destino', 'origem', metodoNext);

    wrapperTeste.vm.$nextTick(() => {
      expect(assinatura.unsubscribe).toHaveBeenCalled();
      expect(removeEventListener).toHaveBeenCalledWith('beforeunload', assinatura.unsubscribe, false);
      expect(wrapperTeste.vm.assinaturaNotificacoes).toBeUndefined();
      expect(wrapperTeste.vm._removerRegistroEmUso).toHaveBeenCalled();
      expect(apiRegistroEmUso.removerRegistroEmUso).toHaveBeenCalledWith(123);
      expect(metodoNext).toHaveBeenCalled();
    });
  });

  it('Antes de sair da rota, não deve fazer nada caso não exista assinatura e o modelo de registro em uso não for válido.', () => {
    jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.resolve());
    let wrapperTeste = mount({
      render() {},
      mixins: [registroEmUsoMixin]
    });

    let removeEventListener = jest.fn();
    windowSpyOn.mockImplementation(() => ({ removeEventListener }));
    wrapperTeste.vm.assinaturaNotificacoes = undefined;
    let metodoNext = jest.fn();

    registroEmUsoMixin.beforeRouteLeave.call(wrapperTeste.vm, 'destino', 'origem', metodoNext);

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.assinaturaNotificacoes).toBeUndefined();
      expect(removeEventListener).not.toHaveBeenCalled();
      expect(apiRegistroEmUso.removerRegistroEmUso).not.toHaveBeenCalled();
      expect(metodoNext).toHaveBeenCalled();
    });
  });

  it('Deve armazenar a assinatura ao assinar as notificações e registrar o método unsubscribe ao descarregar a janela.', () => {
    let assinatura = { unsubscribe: 'teste' };
    jest.spyOn(apiRegistroEmUso, 'assinarNotificacoesRegistroEmUso').mockImplementation(() => { return assinatura; });
    let addEventListener = jest.fn();
    windowSpyOn.mockImplementation(() => ({ addEventListener }));
    wrapper.vm.assinaturaNotificacoes = undefined;

    wrapper.vm._assinarNotificacoes();

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.assinaturaNotificacoes).toBe(assinatura);
      expect(apiRegistroEmUso.assinarNotificacoesRegistroEmUso).toHaveBeenCalledWith(wrapper.vm._notificacaoRecebida);
      expect(addEventListener).toHaveBeenCalledWith('beforeunload', assinatura.unsubscribe, false);
    });
  });

  it('Deve notificar quando receber notificação de atualização para o mesmo registro com o mesmo usuário', () => {
    jest.spyOn(wrapper.vm, 'notificarQueRegistroJaEstaEmUso').mockImplementation(() => {});

    let notificacao = {
      notificacaoRegistroEmUso: {
        registroEmUsoAtualizado: {
          nomeUsuario: 'USUARIO_TESTE',
          identificadorEntidade: '1',
          nomeEntidade: 'ENTIDADE_TESTE'
        }
      }
    };

    wrapper.vm.registroEmUso.nomeUsuario = notificacao.notificacaoRegistroEmUso.registroEmUsoAtualizado.nomeUsuario;
    wrapper.vm.registroEmUso.identificadorEntidade = notificacao.notificacaoRegistroEmUso.registroEmUsoAtualizado.identificadorEntidade;
    wrapper.vm.registroEmUso.nomeEntidade = notificacao.notificacaoRegistroEmUso.registroEmUsoAtualizado.nomeEntidade;
    wrapper.vm.registrandoUso = false;
    wrapper.vm._notificacaoRecebida(notificacao);

    expect(wrapper.vm.notificarQueRegistroJaEstaEmUso).toHaveBeenCalled();
  });

  it('Deve atualizar o registro em uso quando receber uma notificação solicitando sua atualização.', () => {
    jest.spyOn(wrapper.vm, 'registrarUso').mockImplementation(() => {});
    let notificacao = {
      notificacaoRegistroEmUso: {
        registroNecessitaAtualizacao: {
          nomeUsuario: 'USUARIO_TESTE',
          identificadorEntidade: '1',
          nomeEntidade: 'ENTIDADE_TESTE'
        }
      }
    };

    wrapper.vm.registroEmUso.nomeUsuario = notificacao.notificacaoRegistroEmUso.registroNecessitaAtualizacao.nomeUsuario;
    wrapper.vm.registroEmUso.identificadorEntidade = notificacao.notificacaoRegistroEmUso.registroNecessitaAtualizacao.identificadorEntidade;
    wrapper.vm.registroEmUso.nomeEntidade = notificacao.notificacaoRegistroEmUso.registroNecessitaAtualizacao.nomeEntidade;
    wrapper.vm.registrandoUso = false;
    wrapper.vm.abertoEmOutroLocal = false;
    wrapper.vm._notificacaoRecebida(notificacao);

    expect(wrapper.vm.registrarUso).toHaveBeenCalledWith(
      notificacao.notificacaoRegistroEmUso.registroNecessitaAtualizacao.identificadorEntidade,
      notificacao.notificacaoRegistroEmUso.registroNecessitaAtualizacao.nomeEntidade
    );
  });

  it('Não deve notificar quando receber notificação que não é de registroEmUso ou se a própria instância que estiver registrando o uso ou se for outro registro.', () => {
    jest.spyOn(wrapper.vm, 'notificarQueRegistroJaEstaEmUso').mockImplementation(() => {});

    wrapper.vm.registrandoUso = false;
    wrapper.vm._notificacaoRecebida({});
    expect(wrapper.vm.notificarQueRegistroJaEstaEmUso).not.toHaveBeenCalled();

    wrapper.vm.registrandoUso = true;
    wrapper.vm._notificacaoRecebida();
    expect(wrapper.vm.notificarQueRegistroJaEstaEmUso).not.toHaveBeenCalled();

    let notificacao = {
      registroEmUsoAtualizado: {
        nomeUsuario: 'USUARIO_TESTE',
        identificadorEntidade: '1',
        nomeEntidade: 'ENTIDADE_TESTE'
      }
    };

    wrapper.vm.registrandoUso = false;
    wrapper.vm.registroEmUso.nomeUsuario = notificacao.registroEmUsoAtualizado.nomeUsuario;
    wrapper.vm.registroEmUso.identificadorEntidade = '2';
    wrapper.vm.registroEmUso.nomeEntidade = notificacao.registroEmUsoAtualizado.nomeEntidade;
    wrapper.vm._notificacaoRecebida(notificacao);
    expect(wrapper.vm.notificarQueRegistroJaEstaEmUso).not.toHaveBeenCalled();
  });

  it('Deve registrar o uso e assinar as notificações quando for solicitado.', () => {
    let registroEmUso = {
      identificador: '1',
      nomeEntidade: 'TESTE'
    };

    jest.spyOn(wrapper.vm, '_assinarNotificacoes').mockImplementation(() => {});
    jest.spyOn(apiRegistroEmUso, 'registrarUso').mockImplementation(() => Promise.resolve([registroEmUso]));

    wrapper.vm.registrarUso(registroEmUso.identificador, registroEmUso.nomeEntidade);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm._assinarNotificacoes).toHaveBeenCalled();
      expect(apiRegistroEmUso.registrarUso).toHaveBeenLastCalledWith(registroEmUso.identificador, registroEmUso.nomeEntidade);
      expect(wrapper.vm.registroEmUso).toBeInstanceOf(RegistroEmUsoModel);
      expect(wrapper.vm.registroEmUso).toEqual(new RegistroEmUsoModel(registroEmUso));
    });
  });

  it('Ao registrar o uso, deve executar a ação passada.', () => {
    let registroEmUso = {
      identificador: '1',
      nomeEntidade: 'TESTE'
    };
    let acaoUsoRegistrado = jest.fn().mockImplementation(() => {});

    jest.spyOn(wrapper.vm, '_assinarNotificacoes').mockImplementation(() => {});
    jest.spyOn(apiRegistroEmUso, 'registrarUso').mockImplementation(() => Promise.resolve([registroEmUso]));

    wrapper.vm.acaoUsoRegistrado = acaoUsoRegistrado;
    wrapper.vm.registrarUso(registroEmUso.identificador, registroEmUso.nomeEntidade);

    wrapper.vm.$nextTick(() => {
      expect(acaoUsoRegistrado).toHaveBeenCalledWith(registroEmUso.identificador);
    });
  });

  it('Não deve registrar o uso se o identificador não for informado.', () => {
    jest.spyOn(wrapper.vm, '_assinarNotificacoes').mockImplementation(() => {});
    jest.spyOn(apiRegistroEmUso, 'registrarUso').mockImplementation(() => Promise.resolve([]));

    wrapper.vm.registrarUso();

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm._assinarNotificacoes).not.toHaveBeenCalled();
      expect(apiRegistroEmUso.registrarUso).not.toHaveBeenLastCalled();
    });
  });

  it('Deve notificar caso ocorra um erro ao registrar o uso.', () => {
    let registroEmUso = {
      identificador: '1',
      nomeEntidade: 'TESTE'
    };
    let acaoUsoRegistrado = jest.fn().mockImplementation(() => {});

    jest.spyOn(wrapper.vm, '_assinarNotificacoes').mockImplementation(() => {});
    jest.spyOn(wrapper.vm, 'notificarQueRegistroJaEstaEmUso').mockImplementation(() => {});
    jest.spyOn(apiRegistroEmUso, 'registrarUso').mockImplementation(() => Promise.reject([{ statusText: 'ERRO_TESTE' }]));

    wrapper.vm.acaoUsoRegistrado = acaoUsoRegistrado;
    wrapper.vm.registroEmUso = undefined;
    wrapper.vm.registrarUso(registroEmUso.identificador, registroEmUso.nomeEntidade);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm._assinarNotificacoes).toHaveBeenCalled();
      expect(apiRegistroEmUso.registrarUso).toHaveBeenLastCalledWith(registroEmUso.identificador, registroEmUso.nomeEntidade);
      expect(wrapper.vm.registroEmUso).toBeUndefined();
      expect(acaoUsoRegistrado).not.toHaveBeenCalled();
      expect(wrapper.vm.notificarQueRegistroJaEstaEmUso).toHaveBeenCalledWith('ERRO_TESTE');
    });
  });

  it('Deve remover o registro em uso quando solicitado.', () => {
    jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.resolve());

    wrapper.vm.registroEmUso.identificador = 1;
    wrapper.vm.registroEmUso.identificadorEntidade = 1;
    wrapper.vm.registroEmUso.nomeEntidade = 'TESTE';
    wrapper.vm.registroEmUso.nomeUsuario = 'TESTE';

    expect(wrapper.vm.registroEmUso.modeloValido()).toBeTruthy();
    wrapper.vm._removerRegistroEmUso();
    
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.registroEmUso).toBeInstanceOf(RegistroEmUsoModel);
      expect(wrapper.vm.registroEmUso.modeloValido()).toBeFalsy();
    });
  });

  it('Não deve remover o registro em uso se o identifificador não for informado.', () => {
    jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.resolve());  

    wrapper.vm.registroEmUso = new RegistroEmUsoModel();
    wrapper.vm._removerRegistroEmUso();

    wrapper.vm.$nextTick(() => {
      expect(apiRegistroEmUso.removerRegistroEmUso).not.toHaveBeenCalled();
    });
  });

  it('Deve notificar quando houver um erro ao tentar remover o registro em uso.', () => {
    jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.reject([{}]));
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

    var wrapperTeste = mount(
      {
        render() {},
        mixins: [registroEmUsoMixin]
      },
      {
        mocks: {
          $mensagemFlutuante: {
            erro: metodoMensagemFlutuante
          }
        }
      }
    );

    wrapperTeste.vm._removerRegistroEmUso();

    wrapperTeste.vm.$nextTick(() => {
    expect(metodoMensagemFlutuante).toHaveBeenCalled();
    });
  });

  it('Deve disparar mensagem para interação com o usuário, informando que não é posível utilizar a medição.', () => {
    let metodoEsconderMensagemFlutuante = jest.fn().mockImplementation(() => {});
    let metodoMensagemFlutuante = jest.fn().mockImplementation((cfgMsg) => {
      expect(cfgMsg.botaoPrimario.callback).toBeInstanceOf(Function);
      cfgMsg.botaoPrimario.callback();
    });

    var wrapperTeste = mount(
      {
        render() {},
        mixins: [registroEmUsoMixin]
      },
      {
        mocks: {
          $mensagemFlutuante: {
            interativo: metodoMensagemFlutuante,
            esconder: metodoEsconderMensagemFlutuante
          }
        }
      }
    );

    jest.spyOn(wrapperTeste.vm, '_removerRegistroEmUso').mockImplementation(() => {});

    wrapperTeste.vm.notificarQueRegistroJaEstaEmUso('MENSAGEM_TESTE');

    wrapperTeste.vm.$nextTick(() => {
      expect(metodoMensagemFlutuante).toHaveBeenCalled();
      expect(wrapperTeste.vm._removerRegistroEmUso).toHaveBeenCalled();
      expect(metodoEsconderMensagemFlutuante).toHaveBeenCalled();
    });
  });

  it('Ao notificar o usuário que o registro já está em uso, deve executar a ação passada.', () => {
    let metodoEsconderMensagemFlutuante = jest.fn().mockImplementation(() => {});
    let metodoMensagemFlutuante = jest.fn().mockImplementation((cfgMsg) => {
      expect(cfgMsg.botaoPrimario.callback).toBeInstanceOf(Function);
      cfgMsg.botaoPrimario.callback();
    });

    var wrapperTeste = mount(
      {
        render() {},
        mixins: [registroEmUsoMixin]
      },
      {
        mocks: {
          $mensagemFlutuante: {
            interativo: metodoMensagemFlutuante,
            esconder: metodoEsconderMensagemFlutuante
          }
        }
      }
    );

    jest.spyOn(wrapperTeste.vm, '_removerRegistroEmUso').mockImplementation(() => {});
    let acaoRegistroJaEmUso = jest.fn();
    wrapperTeste.vm.acaoRegistroJaEmUso = acaoRegistroJaEmUso;
    wrapperTeste.vm.notificarQueRegistroJaEstaEmUso('MENSAGEM_TESTE');

    wrapperTeste.vm.$nextTick(() => {
      expect(acaoRegistroJaEmUso).toHaveBeenCalled();
    });
  });

  it('Deve notificar se houver um erro ao tentar remover o registro em uso.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

    var wrapperTeste = mount(
      {
        render() {},
        mixins: [registroEmUsoMixin]
      },
      {
        mocks: {
          $mensagemFlutuante: {
            erro: metodoMensagemFlutuante
          }
        }
      }
    );

    let mensagem = 'MENSAGEM_TESTE';
    let mock = jest.spyOn(apiRegistroEmUso, 'removerRegistroEmUso').mockImplementation(() => Promise.reject([{statusText: mensagem}]));
    jest.spyOn(wrapperTeste.vm, '_removerAssinaturaNotificacoes').mockImplementation(() => {});

    wrapperTeste.vm.registroEmUso.abertoEmOutroLocal = false;
    wrapperTeste.vm.registroEmUso.identificador = 123;
    wrapperTeste.vm.registroEmUso.identificadorEntidade = 321;
    wrapperTeste.vm.registroEmUso.nomeEntidade = 'TESTE';
    wrapperTeste.vm.registroEmUso.nomeUsuario = 'TESTE';

    wrapperTeste.vm._removerRegistroEmUso();

    wrapperTeste.vm.$nextTick(() => {
      expect(apiRegistroEmUso.removerRegistroEmUso).toHaveBeenCalledWith(123);
      expect(metodoMensagemFlutuante).toHaveBeenCalledTimes(1);
      expect(metodoMensagemFlutuante).toHaveBeenCalledWith(expect.objectContaining({
        mensagem: expect.stringContaining(mensagem)
      }));
    });

    metodoMensagemFlutuante.mockClear();
    mock.mockClear();
    mock.mockImplementation(() => Promise.reject(mensagem));

    wrapperTeste.vm.registroEmUso.abertoEmOutroLocal = false;
    wrapperTeste.vm.registroEmUso.identificador = 123;
    wrapperTeste.vm.registroEmUso.identificadorEntidade = 321;
    wrapperTeste.vm.registroEmUso.nomeEntidade = 'TESTE';
    wrapperTeste.vm.registroEmUso.nomeUsuario = 'TESTE';

    wrapperTeste.vm._removerRegistroEmUso();

    wrapperTeste.vm.$nextTick(() => {
      expect(apiRegistroEmUso.removerRegistroEmUso).toHaveBeenCalledWith(123);
      expect(metodoMensagemFlutuante).toHaveBeenCalledTimes(1);
      expect(metodoMensagemFlutuante).toHaveBeenCalledWith(expect.objectContaining({
        mensagem: expect.stringContaining(mensagem)
      }));
    });
  });
});