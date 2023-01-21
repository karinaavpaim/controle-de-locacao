import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import MedicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/MedicaoDeLocacao.vue';
import orcamentoDetalhes from '../../../../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import MedicaoLocacaoModel from '@/models/estoque/medicao/medicao-locacao-model';

describe('MedicaoDeLocacao.js', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(MedicaoDeLocacao, {
      store,
      router,
      propsData: {}
    });
  });

  describe("Ao inicializar o componente", () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof MedicaoDeLocacao.data).toBe('function');
      expect(typeof wrapper.vm.totalizadores).toBe('object');
      expect(typeof wrapper.vm.periodoMedicaoPreenchimentoAutomatico).toBe('object');
      expect(typeof wrapper.vm.categoriasPreenchimentoSelecionadas).toBe('object');
      expect(typeof wrapper.vm.categoriasPreenchimentoAutomatico).toBe('object');
      expect(typeof wrapper.vm.exibirPreenchimentoAutomatico).toBe('boolean');
    });

    it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
      expect(typeof MedicaoDeLocacao.computed.equipamentos).toBe('function');
      expect(typeof MedicaoDeLocacao.computed.materiais).toBe('function');
      expect(typeof MedicaoDeLocacao.computed.servicos).toBe('function');
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().medicaoDaLocacao).toEqual(new MedicaoLocacaoModel);
    });

    it('Deve validar o filtro de dinheiro.', () => {
      expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
    });

    it('Valida o valor computed equipamentos.', () => {
      let componente = mount(MedicaoDeLocacao, {
        propsData: {}
      });
      componente.vm.medicaoDaLocacao = {
        itens: orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO)
      };
      expect(componente.vm.equipamentos).toEqual(componente.vm.medicaoDaLocacao.itens);
    });

    it('Valida o valor computed materiais.', () => {
      let componente = mount(MedicaoDeLocacao, {
        propsData: {}
      });
      componente.vm.medicaoDaLocacao = {
        itens: orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.MATERIAL)
      };
      expect(componente.vm.materiais).toEqual(componente.vm.medicaoDaLocacao.itens);
    });

    it('Valida o valor computed serviços.', () => {
      let componente = mount(MedicaoDeLocacao, {
        propsData: {}
      });
      componente.vm.medicaoDaLocacao = {
        itens: orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.SERVICO)
      };
      expect(componente.vm.servicos).toEqual(componente.vm.medicaoDaLocacao.itens);
    });
  });

  describe("Construção - ", () => {
    describe("Preenchimento Automático", () => {
      it('Deve desativar a categoria do preenchimento automático, quando não houverem itens para medir', () => {
        let itens = [];

        expect(wrapper.vm.desativarCategoriaPreenchimentoSemItensParaMedir(itens)).toBeTruthy();
      });

      it('Deve desativar a categoria do preenchimento automático, quando não houverem desmembramentos nos itens para medir', () => {
        let itens = [{
          desmembramentos: []
        }];

        expect(wrapper.vm.desativarCategoriaPreenchimentoSemItensParaMedir(itens)).toBeTruthy();
      });

      it('Deve desativar a categoria do preenchimento automático, quando os desmembramentos dos itens estiverem totalmente medidos', () => {
        let itens = [{
          desmembramentos: [{
              totalmenteMedido: true
            },
            {
              totalmenteMedido: true
            }
          ]
        }];

        expect(wrapper.vm.desativarCategoriaPreenchimentoSemItensParaMedir(itens)).toBeTruthy();
      });

      it('Deve ativar a categoria do preenchimento automático, quando os desmembramentos dos itens não estiverem totalmente medidos', () => {
        let itens = [{
          desmembramentos: [{
              totalmenteMedido: true
            },
            {
              totalmenteMedido: false
            }
          ]
        }];

        expect(wrapper.vm.desativarCategoriaPreenchimentoSemItensParaMedir(itens)).toBeFalsy();
      });

      it('Deve ativar o botão aplicar preenchimento automático', () => {
        wrapper.vm.periodoMedicaoPreenchimentoAutomatico = ['2021-01-01', '2021-01-02'];
        wrapper.vm.categoriasPreenchimentoSelecionadas = 'categoria';

        expect(wrapper.vm.desativarBotaoAplicarPreenchimento()).toBeFalsy();
      });

      it('Deve desativar o botão aplicar preenchimento automático', () => {
        wrapper.vm.periodoMedicaoPreenchimentoAutomatico = [];
        wrapper.vm.categoriasPreenchimentoSelecionadas = [];

        expect(wrapper.vm.desativarBotaoAplicarPreenchimento()).toBeTruthy();
      });

      it('Deve ativar o botão limpar preenchimento automático', () => {
        wrapper.vm.categoriasPreenchimentoSelecionadas = 'categoria';

        expect(wrapper.vm.desativarBotaoLimparPreenchimento()).toBeFalsy();
      });

      it('Deve desativar o botão limpar preenchimento automático', () => {
        wrapper.vm.categoriasPreenchimentoSelecionadas = [];

        expect(wrapper.vm.desativarBotaoLimparPreenchimento()).toBeTruthy();
      });
    });
  });
});