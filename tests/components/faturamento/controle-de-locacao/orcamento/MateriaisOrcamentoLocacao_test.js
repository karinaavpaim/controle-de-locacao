import { mount } from '@vue/test-utils';
import MateriaisOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/itens/materiais/MateriaisOrcamentoLocacao.vue';
import { TIPOS_PRODUTO_MATERIAIS } from "@/constants/estoque/produto-constants.js";
import { COLUNAS_MATERIAIS } from "@/constants/faturamento/controle-de-locacao/materiais-orcamento-locacao-constants.js";
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';

describe('MateriaisOrcamentoLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(MateriaisOrcamentoLocacao, {
      store, router,
      propsData: {}
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const materiais = MateriaisOrcamentoLocacao.data();
    expect(typeof MateriaisOrcamentoLocacao.data).toBe('function');
    expect(typeof materiais.tiposDeProduto).toBe('object');
    expect(typeof materiais.colunasMateriais).toBe('object');
  });

  it('Deve estar pré-definido somente os produtos com os tipos Materiais.', () => {
    expect(wrapper.vm.tiposDeProduto.length).toBe(TIPOS_PRODUTO_MATERIAIS.length);
    TIPOS_PRODUTO_MATERIAIS.forEach((m) => {
      expect(wrapper.vm.tiposDeProduto.includes(m)).toBe(true);
    });
  });

  it('Deve estar informado as colunas da tabela de Materiais na ordem correta.', () => {
    expect(wrapper.vm.colunasMateriais.length).toBe(COLUNAS_MATERIAIS.length); 
    COLUNAS_MATERIAIS.forEach((c) => {
      expect(wrapper.vm.colunasMateriais.includes(c)).toBe(true);
    });
    expect(wrapper.vm.colunasMateriais[0].text).toBe('');
    expect(wrapper.vm.colunasMateriais[1].text).toBe('Descrição');
    expect(wrapper.vm.colunasMateriais[2].text).toBe('Quantidade');
    expect(wrapper.vm.colunasMateriais[3].text).toBe('Unitário líquido');
    expect(wrapper.vm.colunasMateriais[4].text).toBe('Valor total');
    expect(wrapper.vm.colunasMateriais[5].text).toBe('');
  });

  it('Deve obter a classe do status.', () => {
    const status = 'ABERTO';
    expect(STATUS_ITEM[status]).not.toEqual(undefined);
    expect(wrapper.vm.obterClasseParaStatus(status)).toEqual(STATUS_ITEM.ABERTO.classe);
  });

  it('Não deve obter a classe para um status inexistente.', () => {
    const status = '123';
    expect(STATUS_ITEM[status]).toEqual(undefined);
    expect(wrapper.vm.obterClasseParaStatus(status)).toEqual('');
  });

  it('Deve obter a descrição do status.', () => {
    const status = 'ABERTO';
    expect(STATUS_ITEM[status]).not.toEqual(undefined);
    expect(wrapper.vm.obterDescricaoDoStatus(status)).toEqual(STATUS_ITEM.ABERTO.descricao);
  });

  it('Não deve obter a descrição de um status inexistente.', () => {
    const status = '123';
    expect(STATUS_ITEM[status]).toEqual(undefined);
    expect(wrapper.vm.obterDescricaoDoStatus(status)).toEqual('');
  });
});