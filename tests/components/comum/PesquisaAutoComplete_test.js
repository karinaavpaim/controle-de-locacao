import { mount } from '@vue/test-utils';
import PesquisaAutoComplete from '@/components/comum/PesquisaAutoComplete.vue';
import apiEndereco from "@/api/sistemas-gerais/endereco-api.js";
import enderecos from '../../fakes/sistemas-gerais/endereco/enderecos.json'

describe('PesquisaAutoComplete.vue', () => {
  let wrapper;

  let mock = jest.spyOn(apiEndereco, 'localizarEnderecos')
  .mockImplementation(() => Promise.resolve(enderecos));

  beforeEach(() => {    
    wrapper = mount(PesquisaAutoComplete, {
      propsData: {
        label: 'Teste',
        itemSelecionado: { codigo: '01', descricao: '' },
        metodoLocalizacao: apiEndereco.localizarEnderecos,
        atributoExibicao: 'descricao',
        autoFocus: true
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const defaultData = PesquisaAutoComplete.data();        
    expect(typeof PesquisaAutoComplete.data).toBe('function');
    expect(defaultData.desabilitarMensagemNaoHaDados).toBe(true);
    expect(defaultData.isEditing).toBe(true);
    expect(defaultData.isLoading).toBe(false);
    expect(defaultData.search).toBe(null);    
    expect(defaultData.listaItens.length).toBe(0);
    expect(defaultData.model).toBeUndefined();
  });

  it('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().id).toBe('pesquisa-auto-complete');
    expect(wrapper.props().label).toBe('Teste');
    expect(wrapper.props().caracteresParaConsulta).toBe(2);
    expect(typeof wrapper.props().metodoLocalizacao).toBe('function'); 
    expect(wrapper.props().atributoExibicao).toBe('descricao');
    expect(typeof wrapper.props().formatadorItemDetalhe).toBe('function');
    expect(wrapper.props().desabilitar).toBeFalsy();
    expect(wrapper.props().autoFocus).toBeTruthy();
    expect(wrapper.props().limparModel).toBeUndefined();
    expect(wrapper.props().itemSelecionado).toEqual({ codigo: '01', descricao: '' });
  });

  it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
    expect(typeof PesquisaAutoComplete.computed.items).toBe('function');   
    expect(typeof PesquisaAutoComplete.watch.search).toBe('function'); 
    expect(typeof PesquisaAutoComplete.watch.limparModel).toBe('function');  
    expect(typeof PesquisaAutoComplete.watch.itemSelecionado).toBe('function');    
    expect(typeof PesquisaAutoComplete.methods.alterar).toBe('function');  
    expect(typeof PesquisaAutoComplete.methods.confirmarPesquisa).toBe('function');      
  });

  it('Deve emitir o alterarDados quando o método "alterar" for chamado.', () => {
    wrapper.vm.alterar();
    expect(wrapper.emitted().alterarDados).toBeTruthy();
  });
  
  it('Deve procurar um item quando o length da string recebida no parametro estiver igual a quantidade de caracteres passada.', () => {  
    wrapper.vm.$options.watch.search.call(wrapper.vm, '12345');      
  });

  it('Deve retornar quando o length da string recebida no parametro estiver diferente de 2 ou nulo', () => {  
    wrapper.vm.$options.watch.search.call(wrapper.vm, '1234');    
    wrapper.vm.$options.watch.search.call(wrapper.vm, null);    
  });

  it('O array listaItens deve estar preenchido.', () => {
    wrapper.vm.$options.watch.itemSelecionado();
    expect(wrapper.vm.listaItens).toBeTruthy();
  });

  it('O array listaItens deve estar vazio.', () => {
    wrapper.vm.itemSelecionado = null;
    wrapper.vm.$options.watch.itemSelecionado();
    expect(wrapper.vm.listaItens).toEqual([]);
  });

  it('Deve limpar o model quando a propriedade for alterada.', () => {
    wrapper.vm.limparModel = 0;
    expect(wrapper.vm.limparModel).toBe(0);
    expect(wrapper.vm.listaItens.length).toBe(0);
    expect(wrapper.vm.model).toBeUndefined();
    expect(wrapper.vm.itemSelecionado).toBeUndefined();
  });

  
  it('Não deve disparar o load quando o texto digitado não atender a quantidade de caracteres', () => {
    wrapper.vm.search = "a"
    expect(wrapper.vm.isLoading).toBe(false);
    wrapper.vm.search = ""
    expect(wrapper.vm.search).toBe("");
  });

  it('Deve disparar o load quando o texto digitado atender a quantidade de caracteres', async  () => {
    await wrapper.vm.confirmarPesquisa("abcde");
    expect(wrapper.vm.listaItens.length).toBe(4);
    expect(wrapper.vm.desabilitarMensagemNaoHaDados).toBe(true);
  });

  it('Não deve retornar valores quando ocorrer erro na api.', async () => {
    mock.mockClear();
    jest.spyOn(apiEndereco, 'localizarEnderecos')
    .mockImplementation(() =>  Promise.reject("Deu ruim ...")); 

    await wrapper.vm.confirmarPesquisa('00000000000000000')
    expect(typeof wrapper.vm.listaItens).toBe('object'); 
    expect(wrapper.vm.listaItens.length).toBe(1);
  });

  it('Deve emitir o evento onFocus quando o método "onFocus" for chamado.', () => {
    wrapper.vm.onFocus();
    expect(wrapper.emitted().onFocus).toBeTruthy();
  });
});