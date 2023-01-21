import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import ExpedicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/ExpedicaoDeLocacao.vue';
import { 
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_EQUIPAMENTOS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_MATERIAIS
} from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import orcamentoDetalhes from '../../../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import locacaoExpedicao from '../../../../../../fakes/faturamento/controle-de-locacao/locacao-expedicao.json';
import ExpedicaoModel from '@/models/estoque/expedicao/expedicao-model';
import ItemExpedicaoModel from '@/models/estoque/expedicao/item-expedicao-model';

describe('ExpedicaoDeLocacao.js', () => {
  let wrapper;
  sync(store, router);

  describe("Ao inicializar o componente", () => {
    beforeEach(() => {
      wrapper = mount(ExpedicaoDeLocacao, {
        store,
        router,
        propsData: {}
      });
    });

    it('Deve definir os dados padrão(data()) do componente.', () => {
      const baseOpcoes = ExpedicaoDeLocacao.data();
      expect(typeof ExpedicaoDeLocacao.data).toBe('function');
      expect(baseOpcoes.colunasTabelaEquipamentos).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_EQUIPAMENTOS);
      expect(baseOpcoes.colunasTabelaMateriais).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_MATERIAIS);
    });

    it ('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().itensDaTabela).toEqual([]);
    });

    it('Deve validar o filtro de data em formato iso.', () => {
      expect(wrapper.vm.$options.filters.dataFormatada('2019-10-15')).toEqual('15/10/2019');
      expect(wrapper.vm.$options.filters.dataFormatada()).toEqual('-');
    });

    it ('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
      expect(typeof ExpedicaoDeLocacao.computed.equipamentos).toBe('function');
      expect(typeof ExpedicaoDeLocacao.computed.materiais).toBe('function');
      expect(typeof ExpedicaoDeLocacao.methods.dadosLoteOuSerie).toBe('function');
    });

    it('Valida o valor computed equipamentos.', () => {
      let componente = mount(ExpedicaoDeLocacao, {
        store,
        propsData: {}
      });
      componente.vm.itensDaTabela = orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO);
      expect(componente.vm.equipamentos).toEqual(componente.vm.itensDaTabela);
    });

    it('Valida o valor computed materiais.', () => {
      let componente = mount(ExpedicaoDeLocacao, {
        store,
        propsData: {}
      });
      componente.vm.itensDaTabela = orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.MATERIAL);
      expect(componente.vm.materiais).toEqual(componente.vm.itensDaTabela);
    });

    it('Valida o valor computed materiais.', () => {
      let modelo = {
        item: 'nome-do-item'
      };
      wrapper.vm.dadosLoteOuSerie(modelo.item);
    });

    it('Valida o método tratarTextoObservacaoLoteSerie.', () => {
      let loteSerie = { observacao : 'teste' };

      var retorno = wrapper.vm.tratarTextoObservacaoLoteSerie(undefined);
      expect(retorno).toBe("-");

      retorno = wrapper.vm.tratarTextoObservacaoLoteSerie(loteSerie);
      expect(retorno).toBe(loteSerie.observacao);
      expect(retorno.length).toBe(5);
    });

    it('Validar o método expedirTodosOsEquipamentos', () => {
      wrapper.vm.itensDaTabela = new ExpedicaoModel(locacaoExpedicao).itens;
      wrapper.vm.expedirTodosOsEquipamentos();
      wrapper.vm.equipamentos.forEach(equipamento => 
        equipamento.liberacoes.forEach(liberacao => 
          expect(liberacao.quantidadeAExpedir).toBe(liberacao.quantidadeLiberada - liberacao.quantidadeExpedida)
      ))
      wrapper.vm.materiais.forEach(material => 
        material.liberacoes.forEach(liberacao => 
          expect(liberacao.quantidadeAExpedir).toBe(0)
      ))
    });

    it('Validar o método expedirTodosOsMateriais', () => {
      wrapper.vm.itensDaTabela = new ExpedicaoModel(locacaoExpedicao).itens;
      wrapper.vm.expedirTodosOsMateriais();
      wrapper.vm.materiais.forEach(material => 
        material.liberacoes.forEach(liberacao => 
          expect(liberacao.quantidadeAExpedir).toBe(liberacao.quantidadeLiberada - liberacao.quantidadeExpedida)
      ))
      wrapper.vm.equipamentos.forEach(equipamento => 
        equipamento.liberacoes.forEach(liberacao => 
          expect(liberacao.quantidadeAExpedir).toBe(0)
      ))
    });

    it('Validar o método limparTodosOsEquipamentos', () => {
      wrapper.vm.itensDaTabela = new ExpedicaoModel(locacaoExpedicao).itens;
      wrapper.vm.expedirTodosOsEquipamentos();
      wrapper.vm.limparTodosOsEquipamentos();
      wrapper.vm.equipamentos.forEach(equipamento => 
        equipamento.liberacoes.forEach(liberacao => 
          expect(liberacao.quantidadeAExpedir).toBe(0)
      ))
    });

    it('Deve desativar o botão "Expedir Todos"', () => {
      let itens = [
        new ItemExpedicaoModel({ quantidadeLiberada: 10, quantidadeExpedida: 10, quantidadeAExpedir: 0 }),
        new ItemExpedicaoModel({ quantidadeLiberada: 10, quantidadeExpedida: 5, quantidadeAExpedir: 5 })
      ];

      expect(wrapper.vm.desativarExpedirTodos(itens)).toBeTruthy();
    });

    it('Deve ativar o botão "Expedir Todos"', () => {
      let itens = [
        new ItemExpedicaoModel({ quantidadeLiberada: 10, quantidadeExpedida: 1, quantidadeAExpedir: 1 }),
        new ItemExpedicaoModel({ quantidadeLiberada: 2, quantidadeExpedida: 2, quantidadeAExpedir: 0 })
      ];

      expect(wrapper.vm.desativarExpedirTodos(itens)).toBeTruthy();
    });

    it('Deve desativar o botão "Limpar Todos"', () => {
      let itens = [
        new ItemExpedicaoModel({ quantidadeAExpedir: 0 }),
        new ItemExpedicaoModel({ quantidadeAExpedir: 0 })
      ];

      expect(wrapper.vm.desativarLimparTodos(itens)).toBeTruthy();
    });

    it('Deve ativar o botão "Limpar Todos"', () => {
      let itens = [
        new ItemExpedicaoModel({ quantidadeAExpedir: 1 }),
        new ItemExpedicaoModel({ quantidadeAExpedir: 0 })
      ];

      expect(wrapper.vm.desativarLimparTodos(itens)).toBeTruthy();
    });

    it('Validar o método limparTodosOsMateriais', () => {
      wrapper.vm.itensDaTabela = new ExpedicaoModel(locacaoExpedicao).itens;
      wrapper.vm.expedirTodosOsMateriais();
      wrapper.vm.limparTodosOsMateriais();
      wrapper.vm.materiais.forEach(material => 
        material.liberacoes.forEach(liberacao => 
          expect(liberacao.quantidadeAExpedir).toBe(0)
      ))
    });

    it('Validar o método calcularTotais', () => {
      wrapper.vm.itensDaTabela = new ExpedicaoModel(locacaoExpedicao).itens;
      wrapper.vm.expedirTodosOsEquipamentos();
      wrapper.vm.expedirTodosOsMateriais();
      wrapper.vm.calcularTotais();
      expect(wrapper.vm.totalizadores.material).toBe(20);
      expect(wrapper.vm.totalizadores.equipamento).toBe(42);
    });
  });
});