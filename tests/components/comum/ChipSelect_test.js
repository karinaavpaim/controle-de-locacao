'use strict';

import { mount } from '@vue/test-utils';
import ChipSelect from '@/components/comum/ChipSelect.vue';
import {
  STATUS_ORCAMENTO_LOCACAO,
  STATUS_ORCAMENTO_LOCACAO_LISTA
} from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";

describe('ChipSelect.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ChipSelect, {
      propsData: {
        itensListagem: STATUS_ORCAMENTO_LOCACAO_LISTA
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.selecionado.classeSelecao).toBe(STATUS_ORCAMENTO_LOCACAO_LISTA[0].classeSelecao);
    expect(wrapper.vm.selecionado.descricao).toBe(STATUS_ORCAMENTO_LOCACAO_LISTA[0].descricao);
    expect(wrapper.vm.selecionado.valor).toBe(STATUS_ORCAMENTO_LOCACAO_LISTA[0].valor);
    expect(wrapper.vm.listagemLocal).toBeDefined();
  });

  it ('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().itensListagem).toEqual(expect.arrayContaining([]));
  });

  it('Deve alterar o valor do item selecionado de acordo com o model.', () => {
    wrapper.vm.model = STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor;
    expect(wrapper.vm.listagemLocal.length).toBe(STATUS_ORCAMENTO_LOCACAO_LISTA.length - 1);
  });

  it('Deve emitir os valores padroes do objeto pois nao foi passada uma lista valida (vazia)', () => {
    wrapper = mount(ChipSelect, {
      propsData: {
        itensListagem: []
      }
    });
    expect(wrapper.vm.selecionado.classeSelecao).toBe("red");
    expect(wrapper.vm.selecionado.descricao).toBe("Não configurado");
    expect(wrapper.vm.selecionado.valor).toBeUndefined();
  });

  it('Deve selecionar o primeiro item da listagem pois nao foi passado um model valido (null)', () => {
    wrapper = mount(ChipSelect, {
      propsData: {
        itensListagem: STATUS_ORCAMENTO_LOCACAO_LISTA,
        model: null
      }
    });
    expect(wrapper.vm.selecionado).toBe(STATUS_ORCAMENTO_LOCACAO_LISTA[0]);
  });

  it('Deve selecionar o item do model pois o mesmo esta na lista', () => {
    wrapper = mount(ChipSelect, {
      propsData: {
        itensListagem: STATUS_ORCAMENTO_LOCACAO_LISTA,
        model: STATUS_ORCAMENTO_LOCACAO_LISTA[2].valor
      }
    });
    expect(wrapper.vm.selecionado).toBe(STATUS_ORCAMENTO_LOCACAO_LISTA[2]);
  });

  it('Deve selecionar o item do model pois o mesmo esta na lista', () => {
    let componente = mount(ChipSelect, {
      propsData: {}
    });
    componente.vm.itensListagem = [];

    let valor = 1;
    expect(wrapper.vm.setNovoValorManualmente(valor)).toEqual(wrapper.vm.emitirAlteracoes());
  });

  it('Deve selecionar o item do model pois o mesmo esta na lista', () => {
    wrapper.vm.emitirAlteracoes();
    expect(wrapper.emitted().onChange).toBeTruthy();
  });
});