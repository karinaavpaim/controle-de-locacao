import { sync } from 'vuex-router-sync';
import { mount } from '@vue/test-utils';
import router from '@/router';
import store from '@/store';
import ServicosMedicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/ServicosMedicaoDeLocacao.vue';
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_SERVICOS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import ItemMedicaoModel from '@/models/estoque/medicao/item-medicao-locacao-model';
import DesmembramentoMedicaoModel from '@/models/estoque/medicao/desmembramento-medicao-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

describe('ServicosMedicaoDeLocacao.js', () => {
  sync(store, router);
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ServicosMedicaoDeLocacao, {store});
  });

  describe("Ao inicializar o componente", () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      const baseOpcoes = ServicosMedicaoDeLocacao.data();
      expect(typeof ServicosMedicaoDeLocacao.data).toBe('function');
      expect(baseOpcoes.colunasTabelaServicos).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_SERVICOS);
    });

    it ('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().itensDaTabela).toEqual([]);
    });

    it('Deve validar o filtro de dinheiro.', () => {
      expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
    });

    it('Deve emitir o evento onchange quando o método "emitirAlteracoes" for chamado.', () => {
      wrapper.vm.emitirAlteracoes();
      expect(wrapper.emitted().onChange).toBeTruthy();
    });

    it('Deve validar método valorDoHint', () => {
      let item = new ItemMedicaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2
      });
      let apontamentoARegistrar = 3;

      let resultado = wrapper.vm.valorDoHint(item, apontamentoARegistrar);
      expect(wrapper.vm.valorDoHint(item, apontamentoARegistrar)).toBe(resultado);
    });

    it('Deve validar método obterMaximoApontamentoARegistrar.', () => {
      let item = new ItemMedicaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2
      });

      wrapper.vm.obterMaximoApontamentoARegistrar(item);
      let resultado = (item.quantidadePedida - item.quantidadeTotalmenteMedido);
      expect(wrapper.vm.obterMaximoApontamentoARegistrar(item)).toBe(resultado);
    });

    it('Deve chamar o method "emitirAlteracoes".', () => {
      wrapper.vm.emitirAlteracoes();
      expect(wrapper.emitted().onChange).toBeTruthy();
    });

    it('Deve desfazer a medição quando o método for chamado.', () => {
      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        identificadorFuncionario: 1
      });

      let item = new ItemMedicaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento]
      });

      wrapper.vm.desfazerMedicao(item, desmembramento);
      expect(desmembramento.quantidadeAMedir).toBe(desmembramento.quantidadeMaxima);
      expect(desmembramento.datasAMedir).toStrictEqual([]);
      expect(desmembramento.identificadorFuncionario).toBeUndefined();
    });

    it('Deve desabilitar o desfazer.', () => {
      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        identificadorFuncionario: 1,
        totalmenteMedido: false
      });

      expect(wrapper.vm.desabilitarDesfazer(desmembramento)).toBeFalsy();

      let desmembramento2 = new DesmembramentoMedicaoModel({
        totalmenteMedido: true
      });

      expect(wrapper.vm.desabilitarDesfazer(desmembramento2)).toBeTruthy();
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
});