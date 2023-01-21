import { mount } from '@vue/test-utils';
import OutrasInformacoesOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/outras-informacoes/OutrasInformacoesOrcamentoLocacao.vue';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";

describe('OutrasInformacoesOrcamentoLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(OutrasInformacoesOrcamentoLocacao, {
      store, router,
      propsData: {
        orcamentoLocacao : new OrcamentoLocacaoModel({ observacao : '' })
      }
    });
  });

  it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
    expect(typeof OutrasInformacoesOrcamentoLocacao.methods.onFocus).toBe('function');
  });

  it('Deve permitir alterar a observacao do orcamento.', function() {
    expect(wrapper.vm.orcamentoLocacao.observacao).toBe('');
    wrapper.vm.orcamentoLocacao.observacao = 'Teste';
    expect(wrapper.vm.orcamentoLocacao.observacao).toBe('Teste');
  });

  it('Deve emitir o onFocus', () => {
    wrapper.vm.onFocus();
    expect(wrapper.emitted().onFocus).toBeTruthy();
  });

  it('Deve permitir alterar o autoFocus do componente', () => {
    wrapper.setProps({ autoFocus: true })
    expect(wrapper.vm.autoFocus).toBeTruthy();
    
    wrapper.setProps({ autoFocus: false })
    expect(wrapper.vm.autoFocus).toBeFalsy();
  });
});