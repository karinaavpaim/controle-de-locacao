'use strict';

import { mount } from '@vue/test-utils';
import SplitButton from '@/components/comum/SplitButton.vue';

describe('SplitButton.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SplitButton, {
      propsData: {}
    });
  });

  it('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().botoes).toEqual(expect.arrayContaining([]));
  });

  it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
    expect(typeof SplitButton.computed.botaoPrimario).toBe('function');
    expect(typeof SplitButton.computed.botoesSecundarios).toBe('function');
  });
});