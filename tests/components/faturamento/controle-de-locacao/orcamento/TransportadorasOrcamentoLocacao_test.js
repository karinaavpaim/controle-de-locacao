import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import TransportadorasOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/transportadora/TransportadorasOrcamentoLocacao.vue';
import router from '@/router';
import store from '@/store';

describe('TransportadorasOrcamentoLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(TransportadorasOrcamentoLocacao, {
      store, router,
      propsData: {}
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const defaultData = TransportadorasOrcamentoLocacao.data();
    expect(typeof TransportadorasOrcamentoLocacao.data).toBe('function');
    expect(typeof defaultData.entrega).toBe('object');
  });

  it('Deve verificar se todos métodos definidos no objeto methods estão criados.', () => {
    expect(typeof TransportadorasOrcamentoLocacao.methods.alterarTipoEntrega).toBe('function');
    expect(typeof TransportadorasOrcamentoLocacao.methods.alterarPessoa).toBe('function');
    expect(typeof TransportadorasOrcamentoLocacao.methods.notificarDadosAlterados).toBe('function');
  });

  it('Deve emitir o date quando o método dataDatePicker é chamado.', () => {
    var tipoEntrega = 'Por conta do Emitente';
    wrapper.vm.alterarTipoEntrega(tipoEntrega);
    expect(wrapper.vm.entrega.tipoEntrega).toBe(tipoEntrega);
  });

  it('Deve emitir o date quando o método dataDatePicker é chamado.', () => {
    var pessoa = {};
    wrapper.vm.alterarPessoa(pessoa);
    expect(wrapper.vm.entrega.transportadora).toEqual(pessoa);
  });

  it('Deve emitir o evento onChange quando o método "notificarDadosAlterados" for chamado', () => {
    wrapper.vm.notificarDadosAlterados();
    expect(wrapper.emitted().onChange).toBeTruthy();

    wrapper.vm.entrega = { };
    wrapper.vm.notificarDadosAlterados();
    expect(wrapper.emitted('onChange')[1][0]).toEqual({});

    wrapper.vm.entrega = false;
    wrapper.vm.notificarDadosAlterados();
    expect(wrapper.emitted('onChange')[2][0]).toBeUndefined();
  });
});