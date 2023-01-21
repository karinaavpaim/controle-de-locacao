import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import MateriaisMedicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/MateriaisMedicaoDeLocacao.vue';
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_MATERIAIS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";

describe('MateriaisMedicaoDeLocacao.js', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(MateriaisMedicaoDeLocacao, {
      store,
      router,
      propsData: {}
    });
  });

  describe("Ao inicializar o componente", () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      const baseOpcoes = MateriaisMedicaoDeLocacao.data();
      expect(typeof MateriaisMedicaoDeLocacao.data).toBe('function');
      expect(baseOpcoes.colunasTabelaMateriais).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_MATERIAIS);
    });

    it ('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().itensDaTabela).toEqual([]);
    });
  });
});