'use strict';

import { mount } from '@vue/test-utils';
import Alerta from '@/components/comum/Alerta.vue';

describe('Alerta.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Alerta, {
      propsData: {
        tipo: 'warning',
        mensagem: 'Teste de alerta do tipo warning.',
        exibir: false,
        identificador: 'teste'
      }
    });
  });

  it ('Deve definir os dados padrão(data()) do componente.', () => {
    const defaultData = Alerta.data();   
    expect(typeof Alerta.data).toBe('function');   
    expect(typeof defaultData.snackbar).toBe('object');
    expect(defaultData.classeTipo).toBeUndefined();
  });

  it ('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().tipo).toBe('warning');    
    expect(wrapper.props().mensagem).toBe('Teste de alerta do tipo warning.');
    expect(wrapper.props().exibir).toBe(false);
    expect(wrapper.props().identificador).toBe('teste');
  });


});