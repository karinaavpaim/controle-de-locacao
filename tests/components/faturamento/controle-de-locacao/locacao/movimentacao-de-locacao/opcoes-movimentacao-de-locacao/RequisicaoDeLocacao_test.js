import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import RequisicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/RequisicaoDeLocacao.vue';
import { 
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_EQUIPAMENTOS,
  COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_MATERIAIS
} from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import orcamentoDetalhes from '../../../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import locacaoRequisicao from '../../../../../../fakes/faturamento/controle-de-locacao/locacao-requisicao.json';
import RequisicaoModel from '@/models/estoque/requisicao/requisicao-model';
import ItemRequisicaoModel from '@/models/estoque/requisicao/item-requisicao-model';

describe('RequisicaoDeLocacao.js', () => {
  let wrapper;
  sync(store, router);

  describe("Ao inicializar o componente", () => {
    beforeEach(() => {
      wrapper = mount(RequisicaoDeLocacao, {
        store,
        router,
        propsData: {}
      });
    });

    it('Deve definir os dados padrão(data()) do componente.', () => {
      const baseOpcoes = RequisicaoDeLocacao.data();
      expect(typeof RequisicaoDeLocacao.data).toBe('function');
      expect(baseOpcoes.colunasTabelaEquipamentos).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_EQUIPAMENTOS);
      expect(baseOpcoes.colunasTabelaMateriais).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_MATERIAIS);
    });

    it ('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().itensDaTabela).toEqual([]);
    });

    it ('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
      expect(typeof RequisicaoDeLocacao.computed.equipamentos).toBe('function');
      expect(typeof RequisicaoDeLocacao.computed.materiais).toBe('function');
    });

    it('Valida o valor computed equipamentos.', () => {
      let componente = mount(RequisicaoDeLocacao, {
        store,
        propsData: {}
      });
      componente.vm.itensDaTabela = orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO);
      expect(componente.vm.equipamentos).toEqual(componente.vm.itensDaTabela);
    });

    it('Valida o valor computed materiais.', () => {
      let componente = mount(RequisicaoDeLocacao, {
        store,
        propsData: {}
      });
      componente.vm.itensDaTabela = orcamentoDetalhes.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.MATERIAL);
      expect(componente.vm.materiais).toEqual(componente.vm.itensDaTabela);
    });

    it('Deve formatar a data para o padrão iso ou retornar um hífen representando vazio.', () => {
      expect(wrapper.vm.$options.filters.dataFormatada('2019-10-15')).toEqual('15/10/2019');
      expect(wrapper.vm.$options.filters.dataFormatada()).toEqual('-');
    });

    it('Deve retornar os dados de lote ou série ou um objeto vazio.', () => {
      let codigo = 'ABC123';
      var modelo = {
        serie: codigo,
        lote: undefined
      };

      expect(wrapper.vm.dadosLoteOuSerie(modelo)).toBe(codigo);
      modelo.serie = undefined;
      modelo.lote = codigo;
      expect(wrapper.vm.dadosLoteOuSerie(modelo)).toBe(codigo);
      modelo.lote = undefined;
      expect(wrapper.vm.dadosLoteOuSerie(modelo)).toEqual({});
    });

    it('Deve obter o texto do lote ou série ou um hífen representando vazio.', () => {
      let loteSerie = { observacao : 'teste' };

      var retorno = wrapper.vm.obterTextoObservacaoOuVazioDoLoteSerie(undefined);
      expect(retorno).toBe("-");

      retorno = wrapper.vm.obterTextoObservacaoOuVazioDoLoteSerie(loteSerie);
      expect(retorno).toBe(loteSerie.observacao);
      expect(retorno.length).toBe(5);
    });

    it('Validar o método requisitarTodosOsEquipamentos', () => {
      wrapper.vm.itensDaTabela = new RequisicaoModel(locacaoRequisicao).itens;
      wrapper.vm.requisitarTodosOsEquipamentos();
      wrapper.vm.equipamentos.forEach(equipamento => 
        expect(equipamento.quantidadeARequisitar).toBe(equipamento.quantidadePedida - equipamento.quantidadeRequisitada)
      )
      wrapper.vm.materiais.forEach(material => 
        expect(material.quantidadeARequisitar).toBe(0)
      )
    });

    it('Validar o método requisitarTodosOsMateriais', () => {
      wrapper.vm.itensDaTabela = new RequisicaoModel(locacaoRequisicao).itens;
      wrapper.vm.requisitarTodosOsMateriais();
      wrapper.vm.materiais.forEach(material => 
        expect(material.quantidadeARequisitar).toBe(material.quantidadePedida - material.quantidadeRequisitada)
      )
      wrapper.vm.equipamentos.forEach(equipamento => 
        expect(equipamento.quantidadeARequisitar).toBe(0)
      )
    });

    it('Validar o método limparTodosOsEquipamentos', () => {
      wrapper.vm.itensDaTabela = new RequisicaoModel(locacaoRequisicao).itens;
      wrapper.vm.requisitarTodosOsEquipamentos();
      wrapper.vm.limparTodosOsEquipamentos();
      wrapper.vm.equipamentos.forEach(equipamento => 
        expect(equipamento.quantidadeARequisitar).toBe(0)
      )
    });

    it('Validar o método limparTodosOsMateriais', () => {
      wrapper.vm.itensDaTabela = new RequisicaoModel(locacaoRequisicao).itens;
      wrapper.vm.requisitarTodosOsMateriais();
      wrapper.vm.limparTodosOsMateriais();
      wrapper.vm.materiais.forEach(material => 
        expect(material.quantidadeARequisitar).toBe(0)
      )
    });

    it('Deve desativar o botão "Requisitar Todos"', () => {
      let itens = [
        new ItemRequisicaoModel({ quantidadePedida: 10, quantidadeRequisitada: 10, quantidadeARequisitar: 0 }),
        new ItemRequisicaoModel({ quantidadePedida: 10, quantidadeRequisitada: 5, quantidadeARequisitar: 5 })
      ];

      expect(wrapper.vm.desativarRequisitarTodos(itens)).toBeTruthy();
    });

    it('Deve ativar o botão "Requisitar Todos"', () => {
      let itens = [
        new ItemRequisicaoModel({ quantidadePedida: 10, quantidadeRequisitada: 1, quantidadeARequisitar: 1 }),
        new ItemRequisicaoModel({ quantidadePedida: 2, quantidadeRequisitada: 2, quantidadeARequisitar: 0 })
      ];

      expect(wrapper.vm.desativarRequisitarTodos(itens)).toBeFalsy();
    });

    it('Deve desativar o botão "Limpar Todos"', () => {
      let itens = [
        new ItemRequisicaoModel({ quantidadeARequisitar: 0 }),
        new ItemRequisicaoModel({ quantidadeARequisitar: 0 })
      ];

      expect(wrapper.vm.desativarLimparTodos(itens)).toBeTruthy();
    });

    it('Deve ativar o botão "Limpar Todos"', () => {
      let itens = [
        new ItemRequisicaoModel({ quantidadeARequisitar: 1 }),
        new ItemRequisicaoModel({ quantidadeARequisitar: 0 })
      ];

      expect(wrapper.vm.desativarLimparTodos(itens)).toBeFalsy();
    });
  });
});