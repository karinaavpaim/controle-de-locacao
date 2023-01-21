import { mount } from '@vue/test-utils';
import PesquisaPessoa from '@/components/sistemas-gerais/pessoa/PesquisaPessoa.vue';
import pessoas from '../../../fakes/sistemas-gerais/pessoa/pessoas.json';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import pessoaApi from '@/api/sistemas-gerais/pessoa-api';
import PessoaPesquisaAvancadaModel from '@/models/geral/pessoa/pessoa-pesquisa-avancada-model';

describe('PesquisaPessoa.vue - ', () => {
  const KEYCODE_ENTER = 13;

  let wrapper;
  let pessoaSelecionada = new PessoaModel(pessoas[0]);

  let mock = jest.spyOn(pessoaApi, 'localizarPessoa')
    .mockImplementation(() => Promise.resolve(pessoas.map(p => new PessoaModel(p))));


  let pessoaPesquisaAvancada = new PessoaPesquisaAvancadaModel({
    codigo: "000002",
    nome: "",
    telefoneFixo: "",
    telefoneCelular: "",
    CPFouCNPJ: ""
  });

  beforeEach(() => {
    jest.useFakeTimers();

    wrapper = mount(PesquisaPessoa, {
      propsData: {
        label: 'Teste pesquisa pessoa',
        itemSelecionado: null,
        atributoExibicao: 'login',
        limparModel: null,
        desabilitar: false
      }
    });
  });

  describe('Construção - ', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      const defaultData = PesquisaPessoa.data();
      expect(typeof PesquisaPessoa.data).toBe('function');
      expect(defaultData.desabilitarMensagemNaoHaDados).toBe(true);
      expect(defaultData.isLoading).toBe(false);
      expect(defaultData.listaItens).toEqual(expect.arrayContaining([]));
      expect(defaultData.search).toBe(null);
      expect(defaultData.model).toBeUndefined();
      expect(defaultData.itemSelecionado).toBeUndefined();
      expect(defaultData.pesquisando).toBe(false);
      expect(defaultData.mensagemAlerta).toBeUndefined();
      expect(defaultData.exibirAlerta).toBe(false);
      expect(defaultData.tipoAlerta).toBeUndefined();
      expect(defaultData.resultado).toBe(false);
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().label).toBe('Teste pesquisa pessoa');
      expect(wrapper.props().itemSelecionado).toBe(null);
      expect(wrapper.props().atributoExibicao).toBe('login');
      expect(wrapper.props().desabilitar).toBeFalsy();
      expect(wrapper.props().focus).toBeFalsy();
      expect(wrapper.props().habilitarPesquisaAvancada).toBeFalsy();
      expect(wrapper.props().categoriasDePessoa.length).toBe(0);
    });
  });

  describe('Ação: ', () => {
    describe('Casos de sucesso com o escopo preenchido: ', () => {
      beforeEach(() => {
        wrapper.vm.itemSelecionado = pessoaSelecionada;
        wrapper.vm.listaItens = [pessoaSelecionada];
        wrapper.vm.pesquisaAvancada = {
          NomePessoa: 'Fernanda'
        };
        wrapper.vm.resultado = true;
        wrapper.vm.model = pessoaSelecionada;
      });

      it('Deve emitir o onChange quando o método emitirItem é chamado.', () => {
        wrapper.vm.emitirItem();
        expect(wrapper.emitted('onChange')).toBeTruthy();
      });

      it('Deve exibir o modal de pesquisa avançada quando o método exibirModalPesquisaAvancada é chamado.', () => {
        wrapper.vm.exibirModalPesquisaAvancada();
        expect(wrapper.vm.dialog).toBe(true);
        expect(wrapper.vm.emEdicao).toBe(false);
      });

      it('Deve emitir o onFocus quando o método onFocus é chamado.', () => {
        wrapper.vm.onFocus();
        expect(wrapper.emitted('onFocus')).toBeTruthy();
      });

      it('Deve emitir o onChange mesmo com model undefined.', () => {
        wrapper.vm.model = undefined;
        wrapper.vm.emitirItem();
        expect(wrapper.emitted('onChange')).toBeTruthy();
      });

      it('Dar focus no campo de texto (cobertura)', () => {
        wrapper.setData({ focus: true });
        expect(wrapper.vm.focus).toBeTruthy();
        wrapper.setData({ focus: false });
        expect(wrapper.vm.focus).toBeFalsy();
      });

      it('Deve fechar o modal quando o metodo fecharModal fort chamado', () => {
        wrapper.vm.dialog = true;
        wrapper.vm.fecharModal();
        expect(wrapper.vm.dialog).toEqual(false);
      });

      it('Deve selecionar a pessoa', () => {
        wrapper.vm.model = undefined;
        wrapper.vm.selecionarPessoa(new PessoaModel({ identificador: "000001", nome: "Fulano de tal" }));
        expect(wrapper.vm.model.identificador).toEqual("000001");
        expect(wrapper.vm.model.nome).toEqual("Fulano de tal");
      });
      it('O método localizarPessoaPesquisaAvancada deve pesquisar as pessoas na api e retornar os valores para a lista de itens.', async () => {
        mock.mockClear();
        jest.spyOn(pessoaApi, 'localizarPessoaPesquisaAvancada')
          .mockImplementation(() => Promise.resolve(pessoas.filter(p => p.codigo == pessoaPesquisaAvancada.codigo).map((p) => new PessoaModel(p))));

        wrapper.vm.listaItens = [];

        await wrapper.vm.localizarPessoaPesquisaAvancada(pessoaPesquisaAvancada);
        expect(wrapper.vm.listaItens.length).toBe(1);
        expect(wrapper.vm.listaItens[0].codigo).toBe(pessoaPesquisaAvancada.codigo);
      });

      it('Deve mostrar mensagem de pessoa não encontrada quando não encontrar o pessoa.', async () => {
        mock.mockClear();
        jest.spyOn(pessoaApi, 'localizarPessoaPesquisaAvancada')
          .mockImplementation(() => Promise.resolve([]));

        wrapper.vm.listaItens = [];

        await wrapper.vm.localizarPessoaPesquisaAvancada(pessoaPesquisaAvancada);
        expect(wrapper.vm.listaItens.length).toBe(0);
        expect(wrapper.vm.pessoaNaoEncontrada).toBe(true);
      });

      it('Não deve retornar valores quando ocorrer erro na api na pesquisa avançada.', async (done) => {
        mock.mockClear();
        jest.spyOn(pessoaApi, 'localizarPessoaPesquisaAvancada')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));
        jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);

        wrapper.vm.listaItens = [];

        await wrapper.vm.localizarPessoaPesquisaAvancada(pessoaPesquisaAvancada);
        expect(typeof wrapper.vm.listaItens).toBe('object');
        expect(wrapper.vm.listaItens.length).toBe(0);

        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
            done();
          }
          catch (err) { done.fail(err) }
        });

      });

    });
  });

  describe('Eventos: ', () => {
    describe('onKeyUp', () => {
      it('Deve atribuir um array vazio na listagem e finalizar (a busca nao tem texto)', () => {
        wrapper.vm.listaItens = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        wrapper.vm.search = "";
        wrapper.vm.onKeyUp();
        expect(wrapper.vm.listaItens.length).toBe(0);
      });

      it('Deve fazer a pesquisa para a listagem de resultados (enter foi pressionado)', async (done) => {
        wrapper.vm.listaItens = [1]
        wrapper.vm.search = "teste";
        wrapper.vm.onKeyUp({ keyCode: KEYCODE_ENTER });
        await wrapper.vm.onKeyUp({ keyCode: 0 });
        jest.runAllTimers();

        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.listaItens.length).toBe(pessoas.length);
            expect(wrapper.vm.timeoutId).toBe(0);
            done();
          } catch (e) {
            done.fail(e);
          }
        })
      });

      it('Deve fazer a pesquisa para a listagem de resultados (depois de um tempo sem digitar) e limpar o timeout anterior', async (done) => {
        wrapper.vm.listaItens = [1]
        wrapper.vm.timeoutId = 9999999;
        wrapper.vm.search = "teste";
        wrapper.vm.desabilitarMensagemNaoHaDados = true;
        await wrapper.vm.onKeyUp({ keyCode: 0 });
        jest.runAllTimers();

        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.listaItens.length).toBe(pessoas.length);
            expect(wrapper.vm.timeoutId).toBe(0);
            done();
          } catch (e) {
            done.fail(e);
          }
        })
       
      });

      it('Deve fazer a pesquisa mas nenhum resultado foi encontrado.', async (done) => {
        mock.mockClear();
        mock = jest.spyOn(pessoaApi, 'localizarPessoa')
          .mockImplementation(() => Promise.resolve(undefined));

        wrapper.vm.listaItens = [1]
        wrapper.vm.search = "teste";
        wrapper.vm.onKeyUp({ keyCode: KEYCODE_ENTER });
        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.listaItens.length).toBe(0);
            done();
          } catch (e) {
            done.fail(e);
          }
        })
      });

      it('Não deve chamar o metodo de localizar pessoa quando o modelo de pesquisa avancada for invalido.', () => {
        wrapper.vm.pessoaPesquisaAvancada = new PessoaPesquisaAvancadaModel();
        wrapper.vm.isLoading = true;
        wrapper.vm.pesquisarPessoa();
        expect(wrapper.vm.isLoading).toBeFalsy();
        expect(wrapper.vm.listaItens.length).toBe(0);
      });

      it('Deve chamar o metodo de localizar pessoa quando o modelo de pesquisa avancada for valido.', () => {
        wrapper.vm.pessoaPesquisaAvancada = pessoaPesquisaAvancada;
        wrapper.vm.isLoading = false;
        wrapper.vm.pesquisarPessoa();
        expect(wrapper.vm.isLoading).toBeFalsy();
        expect(wrapper.vm.modoFiltro).toBeFalsy();
        expect(wrapper.vm.dialogCarregamento).toBeTruthy();
        jest.runAllTimers();
      });

    });
  });
});