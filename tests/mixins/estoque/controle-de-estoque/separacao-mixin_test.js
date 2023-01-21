'use strict';

import { mount } from '@vue/test-utils'
import separacaoMixin from "@/mixins/estoque/controle-de-estoque/separacao-mixin.js";
import {
  STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE
} from "@/constants/estoque/controle-de-estoque/selecao-documentos-constants";

describe('notificacoes-controle-de-estoque-mixin.js', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount({
      render() {},
      mixins: [separacaoMixin]
    });
  });

  it('Deve atualizar o status do item para pendente quando não houverem movimentações.', () => {
    var item = {
      status: undefined,
      movimentos: []
    };

    wrapper.vm.atualizarStatusItem(item);
    expect(item.status).toBe(STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE.PENDENTE.valor);
  });

  it('Deve atualizar o status do item para parcialmente atendido quando não houverem movimentações suficientes.', () => {
    var item = {
      quantide: 5,
      status: undefined,
      movimentos: [
        { quantidade: 1 }
      ]
    };

    wrapper.vm.atualizarStatusItem(item);
    expect(item.status).toBe(STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE.ATENDIDO_PARCIALMENTE.valor);
  });

  it('Deve atualizar o status do item para totalmente atendido quando houverem movimentações suficientes.', () => {
    var item = {
      quantidade: 1,
      status: undefined,
      movimentos: [
        { quantidade: 1 }
      ]
    };

    wrapper.vm.atualizarStatusItem(item);
    expect(item.status).toBe(STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE.ATENDIDO_TOTALMENTE.valor);
  });
});