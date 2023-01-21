import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import AcessoDirective from '@/directives/acesso-directive'
import { OPCOES_STORE_ACESSOS } from "@/store/modules/acessos";
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants';

describe('acesso-directive.js', () => {
  sync(store, router);
  store.dispatch(OPCOES_STORE_ACESSOS.ACTIONS.ALTERAR_ACESSOS, Promise.resolve([
    {
      identificador: "1",
      tipo: TIPOS_ACESSO_SISTEMA.DESABILITADO
    },
    {
      identificador: "2",
      tipo: TIPOS_ACESSO_SISTEMA.ESCONDIDO
    },
    {
      identificador: "3",
      tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
    }
  ]));

  let fakeElement, fakeBinding, fakeVnode;
  beforeEach(()=>{
    fakeElement = {
      style: undefined,
      __vue__: {
        $el: {},
        _props: { 
          disabled: undefined
        },
        isInMenu: false,
        $parent: {
          $el: {
            className: undefined
          }
        }
      }
    };

    fakeBinding = {
      value: undefined
    };

    fakeVnode = {
      context: {
        $store: store,
        $set: (a,b,c) => a[b] = c
      }
    }
  })

  describe("Ao inicializar a diretiva", () => {
    it('Deve estar configurado para bind e update.', () => {
      expect(AcessoDirective.bind).toBeDefined;
      expect(AcessoDirective.update).toBeDefined;
    });
  });

  describe("A function de bind/update", () => {
    it('Não deve alterar o elemento (o valor do acesso passado é zero ou indefinido)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      try {
        await AcessoDirective.bind(localFakeElement, fakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeUndefined();
        expect(localFakeElement.style).toBeUndefined();
        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Deve desabilitar o elemento (o acesso não existe na lista de acessos)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeBinding.value = "5";
      try {
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeTruthy();
        expect(localFakeElement.style).toBeUndefined();
        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Deve desabilitar o elemento (o acesso está bloqueado)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeBinding.value = "1";
      try {
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeTruthy();
        expect(localFakeElement.style).toBeUndefined();
        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Deve esconder o elemento (o acesso é do tipo esconder e o componente não está em um menu)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeBinding.value = "2";
      localFakeElement.style = {};
      try {
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeFalsy();
        expect(localFakeElement.style.display).toBeUndefined();
        expect(localFakeElement.style.visibility).toBe("hidden");
        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Deve esconder o elemento (o acesso é do tipo esconder e o componente está em um menu)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeBinding.value = "2";
      
      try {
        localFakeElement.style = {};
        localFakeElement.__vue__.$parent.$el.className = 'v-menu';
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeFalsy();
        expect(localFakeElement.style.display).toBe("none");
        expect(localFakeElement.style.visibility).toBeUndefined();

        localFakeElement = JSON.parse(JSON.stringify(fakeElement));
        localFakeElement.style = {};
        localFakeElement.__vue__.$el.className = 'v-list-item';  
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeFalsy();
        expect(localFakeElement.style.display).toBe("none");
        expect(localFakeElement.style.visibility).toBeUndefined();

        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Não deve executar nada (o elemento ainda não está encapsulado no vue)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeBinding.value = "1";
      localFakeElement.style = {};
      localFakeElement.__vue__ = undefined;
      try {
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__).toBeUndefined();
        expect(localFakeElement.style.display).toBeUndefined();
        expect(localFakeElement.style.visibility).toBeUndefined();
        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Não deve executar nada (o acesso está permitido)', async (done) => {
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeElement.style = {};
      localFakeBinding.value = "3";

      try {
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeUndefined();
        expect(localFakeElement.style.display).toBeUndefined();
        expect(localFakeElement.style.visibility).toBeUndefined();
        done();
      } catch(e) {
        done.fail(e);
      }
    });

    it('Deve desabilitar o elemento (não foi possivel obter a lista de acessos)', async (done) => {
      store.dispatch(OPCOES_STORE_ACESSOS.ACTIONS.ALTERAR_ACESSOS, Promise.reject("Erro"));
      let localFakeElement = JSON.parse(JSON.stringify(fakeElement));
      let localFakeBinding = JSON.parse(JSON.stringify(fakeBinding));
      localFakeElement.style = {};
      localFakeBinding.value = "3";

      try {
        await AcessoDirective.bind(localFakeElement, localFakeBinding, fakeVnode);
        expect(localFakeElement.__vue__._props.disabled).toBeTruthy();
        expect(localFakeElement.style.display).toBeUndefined();
        expect(localFakeElement.style.visibility).toBeUndefined();
        done();
      } catch(e) {
        done.fail(e);
      }
    });
  });
});