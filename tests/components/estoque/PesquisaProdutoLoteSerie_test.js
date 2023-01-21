import apiProdutoLoteSerie  from '@/api/estoque/produto-lote-serie-api'
import { mount } from '@vue/test-utils';
import PesquisaProdutoLoteSerie from '@/components/estoque/PesquisaProdutoLoteSerie.vue';
import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';

describe('PesquisaProdutoLoteSerie.vue', () => {
  let produtoLote = new ProdutoLoteSerieModel({
    identificador: '00A0000001',
    codigo: 'ABC123',
    dataValidade: '19/07/2021',
    observacao: 'Lote para testes',
    quantidadeDisponivel: 100,
    tipo: 'LOTE'
  });
  let produtoSerie = new ProdutoLoteSerieModel({
    identificador: '00A0000001',
    codigo: 'CDE456',
    dataValidade: '19/07/2021',
    observacao: 'Serie para testes',
    quantidadeDisponivel: 1,
    tipo: 'SERIE'
  });
  let wrapper;

  var mock = jest.spyOn(apiProdutoLoteSerie, 'obterLotesSeriesDoProdutoParaSeparacao').mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    wrapper = mount(PesquisaProdutoLoteSerie, {
      propsData: {
        itemText: 'codigo',
        identificadorSetorRequisitado: '00A0000001'
      }
    });
  });

  describe('Construção - ', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof PesquisaProdutoLoteSerie.data).toBe('function');
      expect(PesquisaProdutoLoteSerie.data().listaItens).toBeInstanceOf(Array);
      expect(PesquisaProdutoLoteSerie.data().carregando).toBeFalsy();
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().loteSerieSelecionado).toBeUndefined();
      expect(wrapper.props().identificadorProduto).toBeUndefined();
      expect(wrapper.props().identificadorSetorRequisitado).toBe('00A0000001');
      expect(wrapper.props().label).toBe('Lote/Série');
      expect(wrapper.props().placeholder).toBe('Selecione');
      expect(wrapper.props().itemText).toBe('codigo');
      expect(wrapper.props().disabled).toBeFalsy();
      expect(wrapper.props().dense).toBeFalsy();
    });

    it('Deve inicializar a lista com o lote/serie selecionado ou com uma lista vazia.', () => {
      let wrapperTeste = mount(PesquisaProdutoLoteSerie, {
        propsData: {
          itemText: 'codigo',
          identificadorSetorRequisitado: '00A0000001'
        }
      });

      wrapperTeste.vm.loteSerieSelecionado = undefined;
      expect(wrapperTeste.vm.listaItens).toEqual(expect.arrayContaining([]));

      wrapperTeste.vm.loteSerieSelecionado = produtoLote;
      expect(wrapperTeste.vm.listaItens).toEqual(expect.arrayContaining([produtoLote]));
    });
  });

  describe('Ações - ', () => {
    it('Deve emitir o evento onUpdate quando o método "onUpdate" for chamado e o modelo não estiver definido.', () => {
      wrapper.vm.onUpdate();
      expect(wrapper.emitted().onUpdate).toBeTruthy();
      expect(wrapper.emitted().onUpdate[0][0]).toEqual(undefined);
    });

    it('Deve limpar o modelo quando o evento "onBlur" for chamado e o lote/serie selecionado no compontente for nulo.', () => {
      wrapper.vm.modelo = produtoLote;
      expect(wrapper.vm.modelo).toEqual(produtoLote);

      wrapper.vm.$refs = {
        pesquisaProdutoLoteSerie: {
          selectedItem: undefined
        }
      };

      wrapper.vm.onBlur();
      expect(wrapper.vm.modelo).toEqual(undefined);
    });

    it('Deve manter o modelo quando o evento "onBlur" for chamado e o lote/serie selecionado no compontente estiver definido.', () => {
      wrapper.vm.modelo = produtoLote;
      expect(wrapper.vm.modelo).toEqual(produtoLote);

      wrapper.vm.$refs = {
        pesquisaProdutoLoteSerie: {
          selectedItem: produtoLote
        }
      };

      wrapper.vm.onBlur();
      expect(wrapper.vm.modelo).toEqual(produtoLote);
    });

    it('O método localizarProdutoLoteSerie deve retornar os valores para a lista de itens.', async () => {
      expect(wrapper.vm.listaItens).toEqual(expect.arrayContaining([]));
      mock.mockClear();
      jest.spyOn(apiProdutoLoteSerie, 'obterLotesSeriesDoProdutoParaSeparacao').mockImplementation(
        () => Promise.resolve([produtoSerie]));

      await wrapper.vm.localizarProdutoLoteSerie();
      expect(wrapper.vm.listaItens.length).toBe(1);
    });

    it('Não deve retornar valores quando ocorrer erro na api.', async () => {
      mock.mockClear();
      jest.spyOn(apiProdutoLoteSerie, 'obterLotesSeriesDoProdutoParaSeparacao').mockImplementation(
        () => Promise.reject("Houve um erro na API"));

      await wrapper.vm.localizarProdutoLoteSerie(0);
      expect(wrapper.vm.listaItens.length).toBe(0);
    });

    it('Deve retornar nome entidade.', () => {
      wrapper.vm.label = 'LOTE';
      expect(wrapper.vm.retornarNomeEntidade()).toBe('os lotes');

      wrapper.vm.label = 'SÉRIE';
      expect(wrapper.vm.retornarNomeEntidade()).toBe('as séries');

      wrapper.vm.label = '';
      expect(wrapper.vm.retornarNomeEntidade()).toBe('os lotes/séries');
    });
  });
});