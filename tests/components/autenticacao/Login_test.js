'use strict';

import { mount } from '@vue/test-utils';
import LoginComponent from '@/components/autenticacao/Login.vue';
import CredenciaisModel from '@/models/sistema/credenciais-model';
import AutenticacaoApi from '@/api/sistema/autenticacao-api';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants';

describe('Login.vue', () => {
  let wrapper;

  const $route = {
    query: {
      redirect: ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.path
    }
  }
  const $router = {
    push(rt){return rt}
  }

  beforeEach(() => {
    wrapper = mount(LoginComponent, {
      propsData: {},
      mocks: {
        $route,
        $router
      }
    });
  });

  describe("Ao inicializar o componente", () => {
    it ('Deve inicializar as propriedades do data', () => {
      expect(wrapper.vm.credenciais).toBeDefined();
      expect(wrapper.vm.credenciais.constructor.name).toBe(CredenciaisModel.name);
      expect(wrapper.vm.carregando).toBe(false);
    });
  });

  describe("btnLoginClick", () => {
    it ('Deve emitir mensagem dizendo que usuário e senha não estão preenchidos', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      wrapper.vm.btnLoginClick();
      expect(window.alert).toHaveBeenCalled();
    });

    it ('Deve fazer a requisição e colocar o token na storage e dar redirect', async (done) => {
      jest.spyOn(AutenticacaoApi, "autenticar").mockImplementation((cred) => Promise.resolve(cred));
      jest.spyOn(AutenticacaoApi, "gravarTokenAutenticacaoNaStorage").mockImplementation(() => {});
      jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
      wrapper.vm.credenciais = new CredenciaisModel({login:"teste", senha:"123"});

      await wrapper.vm.btnLoginClick();
      wrapper.vm.$nextTick(() => {
        try{
          expect(AutenticacaoApi.autenticar).toHaveBeenCalled();
          expect(AutenticacaoApi.gravarTokenAutenticacaoNaStorage).toHaveBeenCalled();
          expect(wrapper.vm.$router.push).toHaveBeenCalled();
          done();
        }
        catch(err){done.fail(err)}
      });
    });

    it ('Deve fazer a requisição e colocar o token na storage e dar redirect PARA O DASHBOARD', async (done) => {
      jest.spyOn(AutenticacaoApi, "autenticar").mockImplementation((cred) => Promise.resolve(cred));
      jest.spyOn(AutenticacaoApi, "gravarTokenAutenticacaoNaStorage").mockImplementation(() => {});
      jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
      wrapper.vm.credenciais = new CredenciaisModel({login:"teste", senha:"123"});
      wrapper.vm.$route.query.redirect = undefined;

      await wrapper.vm.btnLoginClick();
      wrapper.vm.$nextTick(() => {
        try {
          expect(AutenticacaoApi.autenticar).toHaveBeenCalled();
          expect(AutenticacaoApi.gravarTokenAutenticacaoNaStorage).toHaveBeenCalled();
          done();
        }
        catch(err){done.fail(err)}
      });
    });

    it ('Deve alertar um erro na requisição e excluir o token da storage', async (done) => {
      jest.spyOn(AutenticacaoApi, "autenticar").mockImplementation((cred) => Promise.reject(cred));
      jest.spyOn(AutenticacaoApi, "gravarTokenAutenticacaoNaStorage").mockImplementation(() => {});
      jest.spyOn(AutenticacaoApi, "excluirTokenDeAutenticacaoDaStorage").mockImplementation(() => {});
      jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      wrapper.vm.credenciais = new CredenciaisModel({login:"teste", senha:"123"});

      await wrapper.vm.btnLoginClick();
      wrapper.vm.$nextTick(() => {
        try {
          expect(AutenticacaoApi.autenticar).toHaveBeenCalled();
          expect(AutenticacaoApi.excluirTokenDeAutenticacaoDaStorage).toHaveBeenCalled();
          expect(window.alert).toHaveBeenCalled();
          done();
        }
        catch(err){done.fail(err)}
      });
    });

    it ('Deve alertar um erro na requisição e excluir o token da storage (sem mensagem na exception)', async (done) => {
      jest.spyOn(AutenticacaoApi, "autenticar").mockImplementation(() => Promise.reject("Houve um erro ao efetuar o login."));
      jest.spyOn(AutenticacaoApi, "gravarTokenAutenticacaoNaStorage").mockImplementation(() => {});
      jest.spyOn(AutenticacaoApi, "excluirTokenDeAutenticacaoDaStorage").mockImplementation(() => {});
      jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      wrapper.vm.credenciais = new CredenciaisModel({login:"teste", senha:"123"});

      await wrapper.vm.btnLoginClick();
      wrapper.vm.$nextTick(() => {
        try {
          expect(AutenticacaoApi.autenticar).toHaveBeenCalled();
          expect(AutenticacaoApi.excluirTokenDeAutenticacaoDaStorage).toHaveBeenCalled();
          expect(window.alert).toHaveBeenCalledWith("Houve um erro ao efetuar o login.");
          done();
        }
        catch(err){done.fail(err)}
      });
    });
  });
});