import apiProduto  from '@/api/estoque/produto-api.js'
import { mount } from '@vue/test-utils';
import PesquisarProduto from '@/components/estoque/PesquisarProduto.vue';
import produtos from '../../fakes/estoque/produtos.json'
import ProdutoModel from '@/models/estoque/produto/produto-model.js';
import ProdutoPesquisaAvancadaModel from '@/models/estoque/produto/pesquisa-avancada-produtos-model';

describe('PesquisarProduto.vue', () => {
  let wrapper;

  var mock = jest.spyOn(apiProduto, 'localizarProduto')
  .mockImplementation(() => Promise.resolve(produtos.map((p)=>new ProdutoModel(p))));

  let produtoPesquisaAvancada = new ProdutoPesquisaAvancadaModel({
    codigo:"123456",
    nome: "",
    grupo: ""
  });
  
  beforeEach(() => {
    wrapper = mount(PesquisarProduto, {
      propsData: {
        label: 'Equipamentos',
        atributoExibicao: 'nome',
        autoFocus: true
      }
    });
  });

  describe('Construção - ', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof PesquisarProduto.data).toBe('function');
      expect(wrapper.vm.emEdicao).toBe(true);
      expect(wrapper.vm.isLoading).toBe(false);
      expect(typeof wrapper.vm.listaItens).toBe('object');
      expect(wrapper.vm.search).toBeUndefined();
      expect(wrapper.vm.model).toBeUndefined();
      expect(wrapper.vm.dialog).toBe(false);
      expect(wrapper.vm.dialogCarregamento).toBe(false);
      expect(wrapper.vm.modoFiltro).toBe(true);
      expect(wrapper.vm.produtoNaoEncontrado).toBe(false);
      expect(wrapper.vm.produtoPesquisaAvancada.constructor.name).toBe("ProdutoPesquisaAvancadaModel");
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().id).toBe('pesquisar-produto');
      expect(wrapper.props().label).toBe('Equipamentos');
      expect(wrapper.props().itemSelecionado).toBeUndefined();
      expect(wrapper.props().atributoExibicao).toBe('nome');
      expect(wrapper.props().tiposDeProduto.length).toBe(0);
      expect(wrapper.props().autoFocus).toBeTruthy();
    });

    it('Deve inicializar a lista com o item selecionado ou com uma lista vazia.', () => {
      expect(wrapper.vm.listaItens).toEqual(expect.arrayContaining([]));

      wrapper = mount(PesquisarProduto, {
        propsData: {
          label: 'Equipamentos',
          atributoExibicao: 'nome',
          autoFocus: true,
          itemSelecionado: produtos[0],
          id:'pesquisa-produto'
        }
      });

      expect(wrapper.vm.listaItens).toEqual(expect.arrayContaining([produtos[0]]));
    });
  });

  describe('Ações - ', () => {
    it('Deve emitir o evento onChange quando o método "alterar" for chamado e o modelo não estiver definido.', () => {
      wrapper.vm.alterar();
      expect(wrapper.emitted().onChange).toBeTruthy();
      expect(wrapper.emitted().onChange[0][0]).toEqual(undefined);
    });

    it('Deve emitir o evento onChange quando o método "alterar" for chamado e o modelo estiver definido.', () => {
      wrapper.vm.model = produtos[0];
      wrapper.vm.alterar();
      expect(wrapper.emitted().onChange).toBeTruthy();
      expect(wrapper.emitted().onChange[0][0]).toEqual(produtos[0]);
    });

    it('Deve validar o método voltarParaPesquisaAvancada', () => {
      wrapper.vm.voltarParaPesquisaAvancada();
      expect(wrapper.vm.modoFiltro).toBeFalsy();
      expect(wrapper.vm.model).toBe(wrapper.vm.itemSelecionado);
    });

    it('Deve limpar o modelo quando o evento "onBlur" for chamado e o item selecionado no compontente for nulo.', () => {
      wrapper.vm.model = produtos[0];
      expect(wrapper.vm.model).toEqual(produtos[0]);

      wrapper.vm.$refs = {
        pesquisarProduto: {
          selectedItem: undefined
        }
      };

      wrapper.vm.onBlur();
      expect(wrapper.vm.model).toEqual(undefined);
    });

    it('Deve manter o modelo quando o evento "onBlur" for chamado e o item selecionado no compontente estiver definido.', () => {
      wrapper.vm.model = produtos[0];
      expect(wrapper.vm.model).toEqual(produtos[0]);

      wrapper.vm.$refs = {
        pesquisarProduto: {
          selectedItem: produtos[0]
        }
      };

      wrapper.vm.onBlur();
      expect(wrapper.vm.model).toEqual(produtos[0]);
    });

    it('Deve emitir o evento onFocus quando o método "onFocus" for chamado.', () => {
      wrapper.vm.onFocus();
      expect(wrapper.emitted().onFocus).toBeTruthy();
    });

    it('Deve permitir alterar o focus do elemento dinamicamente', () => {
      wrapper.setProps({ autoFocus: false })
      expect(wrapper.vm.autoFocus).toBeFalsy();
      wrapper.setProps({ autoFocus: true })
      expect(wrapper.vm.autoFocus).toBeTruthy();
    });

    it('Não deve disparar o load quando o texto digitado não atender a quantidade de caracteres', () => {
      wrapper.vm.search = "a"
      expect(wrapper.vm.isLoading).toBe(false);
      wrapper.vm.search = ""
      expect(wrapper.vm.search).toBe("");
    });

    it('O método localizarProduto deve pesquisar por codigo ou nome na api e retornar os valores para a lista de itens.', async () => {
      await wrapper.vm.localizarProduto(0);
      expect(wrapper.vm.listaItens.length).toBe(2); 
    });

    it('Não deve retornar valores quando ocorrer erro na api.', async () => {
      mock.mockClear();
      jest.spyOn(apiProduto, 'localizarProduto')
      .mockImplementation(() => Promise.reject("Houve um erro na API")); 

      await wrapper.vm.localizarProduto(0);
      expect(typeof wrapper.vm.listaItens).toBe('object'); 
      expect(wrapper.vm.listaItens.length).toBe(0); 
    });

    it('Deve exibir o modal de pesquisa avançada.', () => {
      wrapper.vm.dialog = false;
      wrapper.vm.exibirModalPesquisaAvancada();
      expect(wrapper.vm.dialog).toEqual(true);
      expect(wrapper.vm.emEdicao).toBe(false);
    });

    it('Deve adicionar o produto na tabela.', () => {
      wrapper.vm.dialog = true;
      wrapper.vm.adicionarProdutoNaTabela();
      expect(wrapper.vm.dialog).toEqual(false);
      expect(wrapper.emitted('onChange')).toBeTruthy();
      expect(wrapper.vm.modoFiltro).toEqual(true);
    });

    it('Deve fechar o modal quando o metodo fecharModal fort chamado', () => {
      wrapper.vm.dialog = true;
      wrapper.vm.fecharModal();
      expect(wrapper.vm.dialog).toEqual(false); 
    });
    
    it('Deve selecionar o produto', () => {
      wrapper.vm.model = undefined;
      wrapper.vm.selecionarProduto(new ProdutoModel({identificador:"0001",nome:"produto A"}));
      expect(wrapper.vm.model.identificador).toEqual("0001"); 
      expect(wrapper.vm.model.nome).toEqual("produto A"); 
    });
    
    it('Deve emitir o evento onFocus quando o método "onFocus" for chamado.', () => {
      wrapper.vm.onFocus();
      expect(wrapper.emitted().onFocus).toBeTruthy();
    });

    it('O método localizarProdutoPesquisaAvancada deve pesquisar os produtos na api e retornar os valores para a lista de itens.', async () => {
      mock.mockClear();
      jest.spyOn(apiProduto, 'localizarProdutoPesquisaAvancada')
      .mockImplementation(() => Promise.resolve(produtos.map((p)=>new ProdutoModel(p))));

      wrapper.vm.listaItens = [];

      await wrapper.vm.localizarProdutoPesquisaAvancada(produtoPesquisaAvancada);
      expect(wrapper.vm.listaItens.length).toBe(2); 
    });

    it('Deve mostrar mensagem de produto não encontrado quando não encontra ro produto .', async () => {
      mock.mockClear();
      jest.spyOn(apiProduto, 'localizarProdutoPesquisaAvancada')
      .mockImplementation(() => Promise.resolve([]));

      wrapper.vm.listaItens = [];

      await wrapper.vm.localizarProdutoPesquisaAvancada(produtoPesquisaAvancada);
      expect(wrapper.vm.listaItens.length).toBe(0); 
      expect(wrapper.vm.produtoNaoEncontrado).toBe(true); 
    });



    it('Não deve retornar valores quando ocorrer erro na api na pesquisa avançada.', async () => {
      mock.mockClear();
      jest.spyOn(apiProduto, 'localizarProdutoPesquisaAvancada')
      .mockImplementation(() => Promise.reject("Houve um erro na API")); 

      wrapper.vm.listaItens = [];

      await wrapper.vm.localizarProdutoPesquisaAvancada(produtoPesquisaAvancada);
      expect(typeof wrapper.vm.listaItens).toBe('object'); 
      expect(wrapper.vm.listaItens.length).toBe(0); 
    });

    it('Não deve chamar o metodo de localizar o produto quando o modelo de pesquisa avancada for invalido.', () => {
      wrapper.vm.produtoPesquisaAvancada = new ProdutoPesquisaAvancadaModel();
      wrapper.vm.isLoading = true;
      wrapper.vm.pesquisarProduto();
      expect(wrapper.vm.isLoading).toBeFalsy();
      expect(wrapper.vm.listaItens.length).toBe(0);
    });

    it('Deve chamar o metodo de localizar o produto quando o modelo de pesquisa avancada for valido.', () => {
      wrapper.vm.produtoPesquisaAvancada = produtoPesquisaAvancada;
      wrapper.vm.isLoading = false;
      wrapper.vm.pesquisarProduto();
      expect(wrapper.vm.isLoading).toBeFalsy();
      expect(wrapper.vm.modoFiltro).toBeFalsy();
      expect(wrapper.vm.dialogCarregamento).toBeTruthy();
    });

  });

  describe("Evento de digitação", ()=>{
    jest.useFakeTimers();
    let event = {keyCode: 13};

    it("Deve limpar o timeout e colocar no default 0", ()=>{
      wrapper.vm.timeoutId = 10;
      wrapper.vm.search = undefined;
      wrapper.vm.onKeyUp(event);
      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.timeoutId).toBe(0);
      expect(wrapper.vm.listaItens).toEqual([]);
      expect(wrapper.vm.isLoading).toBeFalsy();
    })

    it("Deve chamar a api para efetuar a busca (enter pressionado)", async ()=>{
      wrapper.vm.timeoutId = 0;
      wrapper.vm.search = "abc";
      await wrapper.vm.onKeyUp(event);
      expect(apiProduto.localizarProdutoPesquisaAvancada).toHaveBeenCalled();
    })

    it("Deve chamar a api para efetuar a busca (usuario parou de digitar por um tempo)", async ()=>{
      wrapper.vm.timeoutId = 0;
      wrapper.vm.search = "abc";
      await wrapper.vm.onKeyUp({});
      expect(wrapper.vm.timeoutId).not.toBe(0);
      jest.runAllTimers();
      expect(apiProduto.localizarProdutoPesquisaAvancada).toHaveBeenCalled();
      expect(wrapper.vm.timeoutId).toBe(0);
    })
  })
});