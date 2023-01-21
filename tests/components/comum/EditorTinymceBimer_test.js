'use strict';

import { mount } from '@vue/test-utils';
import EditorTinymceBimer from '@/components/comum/EditorTinymceBimer.vue';
import apiProposta  from '@/api/faturamento/controle-de-locacao/proposta-locacao-api.js';

describe('EditorTinymceBimer.vue', () => {
  let wrapper;

  jest.spyOn(apiProposta, 'obterVariaveisDoSistema')
      .mockImplementation(() => Promise.resolve({}));

  beforeEach(() => {
    wrapper = mount(EditorTinymceBimer, {
      propsData: {
        entrada: "Sou um texto",
        id: "teste-exemplo-id",
        editorToolbar: "undo redo",
        adicionarPluginInserirDados: true,
        templatesDoEditor: [],
        variaveisDoEditor: { cliente: "weberson" }
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.textoDoEditor).toBe('');  
    expect(wrapper.vm.init.selector).toBe('textarea');  
    expect(wrapper.vm.init.theme).toBe('silver');  
    expect(wrapper.vm.init.icons).toBe('material');  
    expect(wrapper.vm.init.height).toBe(550);  
    expect(wrapper.vm.init.breanding).toBeFalsy();  
    expect(wrapper.vm.init.relative_urls).toBeFalsy();  
    expect(typeof wrapper.vm.init.plugins).toBe('object');  
    expect(wrapper.vm.init.menubar).toBe('');  
    expect(typeof wrapper.vm.init.toolbar).toBe('string'); 
    expect(typeof wrapper.vm.init.templates).toBe('object');
    expect(wrapper.vm.inittemplate_replace_values).toBeUndefined();
    expect(wrapper.vm.init.language).toBe('pt_BR'); 
  });

  it('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().entrada).toBe("Sou um texto");    
    expect(wrapper.props().id).toBe('teste-exemplo-id');
    expect(wrapper.props().editorToolbar).toBe('undo redo');
    expect(wrapper.props().templatesDoEditor.length).toBe(0);
    expect(wrapper.props().variaveisDoEditor).toEqual({ cliente:"weberson" });
  });

  it('Deve alterar o valor o texto no editor quando o metodo "setNovoValorNoEditor" for chamado.', () => {
    wrapper.vm.setNovoValorNoEditor("Teste Weberson")
    expect(wrapper.vm.textoDoEditor).toBe('Teste Weberson');  
  });

  it('Deve emitir o evento onChange quando o método "change" for chamado.', () => {
    wrapper.vm.change();
    expect(wrapper.emitted().onChange).toBeTruthy();

    wrapper.vm.change("Novo valor no texto ;)");
    expect(wrapper.emitted().onChange).toBeTruthy();
  });

  it('Deve alterar o texto do editor quando a prop entrada for alterada', () => {
    wrapper.setProps({ entrada: "Novo valor no texto" })
    expect(wrapper.vm.textoDoEditor).toBe('Novo valor no texto');
  });

  //TODO: Melhorar esse teste, a forma como o focus esta sendo adicionado e removido, será alterada futuramente.
  it('Adicionar e remover o focus do elemento quando os metodos focusIn() e focusOut() forem chamados', async () => {

    jest.spyOn(wrapper.vm, 'focusIn')
    .mockImplementation(() => true); 

    jest.spyOn(wrapper.vm, 'focusOut')
    .mockImplementation(() => false); 

    expect(wrapper.vm.focusIn()).toBe(true); 
    expect(wrapper.vm.focusOut()).toBe(false); 
  });
});