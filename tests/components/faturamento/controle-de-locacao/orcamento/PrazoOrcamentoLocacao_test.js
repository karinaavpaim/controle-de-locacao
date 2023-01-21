import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import PrazoOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/prazo/PrazoOrcamentoLocacao.vue';
import apiPrazo from "@/api/financeiro/prazo-api";
import _prazosFake from '../../../../fakes/faturamento/controle-de-locacao/prazos.json';
import { ESTAGIOS_SELECAO } from "@/constants/financeiro/prazos-orcamento-locacao-constants.js";
import FormaPagamentoModel from '@/models/financeiro/forma-pagamento-model';
import PrazoModel from '@/models/financeiro/prazo-model';

describe('PrazoOrcamentoLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  jest.spyOn(apiPrazo, 'obterPrazos')
      .mockImplementation(()=>Promise.resolve(_prazosFake));

  beforeEach(() => {
    wrapper = mount(PrazoOrcamentoLocacao, {
      store, router,
      propsData: {}
    });
  });

  it('Deve selecionar o prazo.', () => {
    wrapper.vm.selecionarPrazo([_prazosFake[0]]);
    expect(wrapper.vm.prazoSelecionado).toBe(_prazosFake[0]);

    wrapper.vm.selecionarPrazo([]);
    expect(wrapper.vm.prazoSelecionado).toBe(_prazosFake[0]);
  });

  it('Deve exibir o modal de adicionar prazo.', () => { 
    wrapper.vm.exibirModalAdicionarPrazo();
    expect(wrapper.vm.dialogPrazo).toBe(true);
    expect(wrapper.vm.itensSelecionadosTreeview.length).toBe(0);
    expect(wrapper.vm.prazoSelecionado).toBeUndefined();
    expect(wrapper.vm.formaPagamentoEntradaSelecionada).toBeUndefined();
    expect(wrapper.vm.formaPagamentoParcelasSelecionada).toBeUndefined();
    expect(wrapper.vm.estagiosSelecao).toBe(ESTAGIOS_SELECAO);
    expect(wrapper.vm.estagioSelecao).toBe(ESTAGIOS_SELECAO.SELECAO_PRAZO);
  });

  it ('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().objParaAdicionarPrazo).toEqual(expect.arrayContaining([]));
  });

  it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
    expect(typeof PrazoOrcamentoLocacao.computed.tituloModal).toBe('function');
  });

  it('Deve retornar o título do modal.', () => {
    wrapper.vm.estagioSelecao = ESTAGIOS_SELECAO.SELECAO_PRAZO;
    expect(wrapper.vm.tituloModal).toBe("Prazos");

    wrapper.vm.estagioSelecao = ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA;
    expect(wrapper.vm.tituloModal).toBe("Forma de pagamento da entrada");

    wrapper.vm.estagioSelecao = ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA;
    expect(wrapper.vm.tituloModal).toBe("Forma de pagamento das parcelas");
  });

  it('Deve cancelar a inclusão do prazo', () => {
    wrapper.vm.cancelarInclusaoPrazo();
    expect(wrapper.vm.dialogPrazo).toBe(false);
  });

  it('Deve remover o prazo', () => {
    wrapper.vm.removerPrazo();
    expect(wrapper.vm.prazoSelecionado).toBeUndefined();
    expect(wrapper.vm.formaPagamentoEntradaSelecionada).toBeUndefined();
    expect(wrapper.vm.formaPagamentoParcelasSelecionada).toBeUndefined();
  });

  it('Deve obter a hierarquia correta dos prazos para seleção no treeviewc', () => {
    let hierarquia = wrapper.vm.obterHierarquia();
    expect(hierarquia.length).toBe(5); // apenas a receber e ambos
    expect(hierarquia[0].__nome).toBeDefined();
    expect(hierarquia[0].__nome).toBe("01");
    expect(hierarquia[0].children).toBeDefined()
    expect(hierarquia[0].children.constructor.name).toBe("Array");
    expect(hierarquia[0].children[0].__nome).toBe("01");
    expect(hierarquia[0].children[0].children).toBeDefined();
    expect(hierarquia[0].children[0].children.constructor.name).toBe("Array");
    expect(hierarquia[0].children[0].children.length).toBe(0);
  });

  it('Deve obter a descrição do prazo selecionado.', () => {
    let descricao = "";
    wrapper.props().objParaAdicionarPrazo.prazo = new PrazoModel({nome: '30 DIAS'});
    wrapper.props().objParaAdicionarPrazo.formaPagamentoEntrada = new FormaPagamentoModel({identificador: 1, nome: ' DINHEIRO(Entrada)'});
    wrapper.props().objParaAdicionarPrazo.formaPagamentoParcelas = new FormaPagamentoModel({identificador: 2, nome: ' DOC'});

    wrapper.vm.descricaoPrazoSelecionado();

    descricao = wrapper.props().objParaAdicionarPrazo.prazo.nome
              + wrapper.props().objParaAdicionarPrazo.formaPagamentoEntrada.nome
              + wrapper.props().objParaAdicionarPrazo.formaPagamentoParcelas.nome;

    expect(descricao).toBe('30 DIAS DINHEIRO(Entrada) DOC');
  });

  it('Deve obter a descrição do prazo selecionado.', () => {
    let descricao2 = "";
    wrapper.props().objParaAdicionarPrazo.prazo = new PrazoModel({nome: '30 DIAS'});
    wrapper.props().objParaAdicionarPrazo.formaPagamentoEntrada = new FormaPagamentoModel({identificador: 1, nome: ' TRANSFERÊNCIA'});
    wrapper.props().objParaAdicionarPrazo.formaPagamentoParcelas = undefined;

    
    wrapper.vm.descricaoPrazoSelecionado();

    descricao2 = wrapper.props().objParaAdicionarPrazo.prazo.nome
               + wrapper.props().objParaAdicionarPrazo.formaPagamentoEntrada.nome;
    
    expect(descricao2).toBe('30 DIAS TRANSFERÊNCIA');
  });

  it('Deve obter a descrição do prazo selecionado.', () => {
    let descricao3 = "";
    wrapper.props().objParaAdicionarPrazo.prazo = new PrazoModel({nome: '30 DIAS'});
    wrapper.props().objParaAdicionarPrazo.formaPagamentoEntrada = undefined;
    wrapper.props().objParaAdicionarPrazo.formaPagamentoParcelas = new FormaPagamentoModel({identificador: 1, nome: ' TED'});

    wrapper.vm.descricaoPrazoSelecionado();

    descricao3 = wrapper.props().objParaAdicionarPrazo.prazo.nome
               + wrapper.props().objParaAdicionarPrazo.formaPagamentoParcelas.nome;

    expect(descricao3).toBe('30 DIAS TED');
  });
});