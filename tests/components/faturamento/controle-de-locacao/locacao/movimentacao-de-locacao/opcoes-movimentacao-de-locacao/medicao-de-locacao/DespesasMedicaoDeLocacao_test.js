import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import DespesasMedicaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/DespesasMedicaoDeLocacao.vue';
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_DESPESAS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import DesmembramentoMedicaoModel from '@/models/estoque/medicao/desmembramento-medicao-model';
import DespesaMedicaoLocacaoModel from '@/models/estoque/medicao/despesa-medicao-locacao-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import ItemMedicaoLocacaoModel from '@/models/estoque/medicao/item-medicao-locacao-model';

describe('DespesasMedicaoDeLocacao.js', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(DespesasMedicaoDeLocacao, {
      store,
      router,
      propsData: {}
    });
  });

  describe("Ao inicializar o componente", () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      const baseOpcoes = DespesasMedicaoDeLocacao.data();
      expect(typeof DespesasMedicaoDeLocacao.data).toBe('function');
      expect(baseOpcoes.colunasTabelaDespesas).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_DESPESAS);
    });

    it ('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().id).toBe('despesas-medicao');
      expect(wrapper.props().itensDaTabela).toEqual([]);
    });

    it('Deve validar o filtro de dinheiro.', () => {
      expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
    });

    it('Deve validar método valorDoHint', () => {
      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2
      });
      let apontamentoARegistrar = 3;

      let resultado = wrapper.vm.valorDoHint(item, apontamentoARegistrar);
      expect(wrapper.vm.valorDoHint(item, apontamentoARegistrar)).toBe(resultado);
    });

    it('Deve validar método obterMaximoApontamentoARegistrar.', () => {
      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2
      });

      wrapper.vm.obterMaximoApontamentoARegistrar(item);
      let resultado = (item.quantidadePedida - item.quantidadeTotalmenteMedido);
      expect(wrapper.vm.obterMaximoApontamentoARegistrar(item)).toBe(resultado);
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

    it('Deve chamar o method "emitirAlteracoes".', () => {
      wrapper.vm.emitirAlteracoes();
      expect(wrapper.emitted().onChange).toBeTruthy();
    });

    it('Deve emitir o evento onchange quando o método "emitirAlteracoes" for chamado.', () => {
      wrapper.vm.emitirAlteracoes();
      expect(wrapper.emitted().onChange).toBeTruthy();
    });

    it('Deve desfazer a medição quando o método for chamado.', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'texto'
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento]
      });

      wrapper.vm.desfazerMedicao(item, desmembramento);
      expect(desmembramento.quantidadeAMedir).toBe(desmembramento.quantidadeMaxima);
      expect(desmembramento.datasAMedir).toStrictEqual([]);
      expect(desmembramento.observacao).toBeUndefined();
    });
  });

  describe("desfazerMedicao()", () => {
    it('Deve desfazer a medição com hierarquia, SEM modificar a ordem e MODIFICANDO quantidade do array de desmembramentos.', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'texto',
        identificadorDesmembramento: 1,
        _hierarquia: [0]
      });

      let clone1 = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'texto',
        identificadorDesmembramento: 1,
        _hierarquia: [0, 1]
      });

      let clone2 = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'texto',
        identificadorDesmembramento: 1,
        _hierarquia: [0, 1, 2]
      });

      let clone3 = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'texto',
        identificadorDesmembramento: 1,
        _hierarquia: [0, 1, 2, 3]
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [clone2, desmembramento, clone1, clone3]
      });

      wrapper.vm.desfazerMedicao(item, item.desmembramentos[0]);
      expect(item.desmembramentos.length).toBe(3);
      expect(item.desmembramentos[0]._hierarquia[1]).toBeUndefined();
      expect(item.desmembramentos[1]._hierarquia[2]).toBeUndefined();
      expect(item.desmembramentos[2]._hierarquia[3]).toBeUndefined();

      expect(item.desmembramentos[0]._hierarquia[0]).toBe(0);
      expect(item.desmembramentos[1]._hierarquia[1]).toBe(1);
      expect(item.desmembramentos[2]._hierarquia[2]).toBe(2);

      expect(item.desmembramentos[3]).toBeUndefined();
    });

    it('Deve desfazer a medição com hierarquia, mas apenas limpando os dados pois apenas existe um.', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'desmembramento',
        identificadorDesmembramento: 1,
        _hierarquia: [0]
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento]
      });

      wrapper.vm.desfazerMedicao(item, item.desmembramentos[0]);
      expect(item.desmembramentos.length).toBe(1);
      expect(item.desmembramentos[0]._hierarquia).toBeUndefined();
      expect(item.desmembramentos[0].quantidadeAMedir).toBe(2);
    });
  });

  describe("duplicarCardMedicao", () => {
    it('Deve duplicar a medição SEM hierarquia, sem modificar a ordem do array de desmembramentos.', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'desmembramento'
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento]
      });

      wrapper.vm.duplicarCardMedicao(item, item.desmembramentos[0]);
      expect(item.desmembramentos.length).toBe(2);
      expect(item.desmembramentos[0]._hierarquia.length).toBe(1);
      expect(item.desmembramentos[1]._hierarquia.length).toBe(2);
    });

    it('Deve duplicar a medição COM hierarquia, sem modificar a ordem do array de desmembramentos.', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'desmembramento',
        _hierarquia: [0]
      });

      let clone1 = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'clone1',
        _hierarquia: [0, 1]
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento, clone1]
      });

      wrapper.vm.duplicarCardMedicao(item, item.desmembramentos[1]);
      expect(item.desmembramentos.length).toBe(3);

      expect(item.desmembramentos[0]._hierarquia.length).toBe(1);
      expect(item.desmembramentos[1]._hierarquia.length).toBe(2);
      expect(item.desmembramentos[2]._hierarquia.length).toBe(3);
      expect(item.desmembramentos[0].observacao).toBe(desmembramento.observacao);
      expect(item.desmembramentos[2].observacao).toBeUndefined();
    });
  });

  describe("quantidadeDesmembramentoInvalida", () => {
    it('Deve apontar uma quantidade invalida para o desmembramento, pois a quantidade a medir ultrapassa a quantidade maxima', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 8,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'desmembramento'
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento]
      });

      expect(wrapper.vm.quantidadeDesmembramentoInvalida(item, item.desmembramentos[0])).toBe(true);
    });

    it('Deve apontar uma quantidade invalida para o desmembramento COM HIERARQUIA, pois a quantidade TOTAL a medir ultrapassa a quantidade maxima', () => {

      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 2,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'desmembramento',
        _hierarquia: [0]
      });

      let clone1 = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'clone1',
        _hierarquia: [0, 1]
      });

      let item = new DespesaMedicaoLocacaoModel({
        quantidadePedida: 5,
        quantidadeTotalmenteMedido: 2,
        desmembramentos: [desmembramento, clone1]
      });

      expect(wrapper.vm.quantidadeDesmembramentoInvalida(item, item.desmembramentos[1])).toBe(true);
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

  describe("exibirBlocoSemDados", () => {
    it('Deve retornar true pois não há desmembramentos.', () => {
      let item = new ItemMedicaoLocacaoModel({
        desmembramentos: []
      });

      expect(wrapper.vm.exibirBlocoSemDados(item)).toBeTruthy();
    });

    it('Deve retornar true pois o item está totalmente medido.', () => {
      let item = new ItemMedicaoLocacaoModel({
        status: "ATENDIDO_TOTALMENTE"
      });

      expect(wrapper.vm.exibirBlocoSemDados(item)).toBeTruthy();
    });

    it('Deve retornar false pois há desmembramentos e o item está parcialmente medido.', () => {
      let desmembramento = new DesmembramentoMedicaoModel({
        quantidadeAMedir: 1,
        quantidadeMaxima: 2,
        datasAMedir: 1,
        observacao: 'desmembramento',
        identificadorDesmembramento: 1
      });

      let item = new ItemMedicaoLocacaoModel({
        desmembramentos: [desmembramento],
        status: "ATENDIDO_PARCIALMENTE"
      });

      expect(wrapper.vm.exibirBlocoSemDados(item)).toBeFalsy();
    });
  });
});