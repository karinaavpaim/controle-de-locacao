import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import EquipamentosMedicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/EquipamentosMedicaoDeLocacao.vue';
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_EQUIPAMENTOS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";

describe('EquipamentosMedicaoDeLocacao.js', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(EquipamentosMedicaoDeLocacao, {
      store,
      router,
      propsData: {}
    });
  });

  describe("Ao inicializar o componente", () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      const baseOpcoes = EquipamentosMedicaoDeLocacao.data();
      expect(typeof EquipamentosMedicaoDeLocacao.data).toBe('function');
      expect(baseOpcoes.colunasTabelaEquipamentos).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_EQUIPAMENTOS);
    });

    it ('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().itensDaTabela).toEqual([]);
    });
  });
});