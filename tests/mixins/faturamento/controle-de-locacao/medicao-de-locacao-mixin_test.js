import { mount } from '@vue/test-utils';
import medicaoDeLocacaoMixin from '@/mixins/faturamento/controle-de-locacao/medicao-de-locacao-mixin.js';
import DesmembramentoMedicaoModel from '@/models/estoque/medicao/desmembramento-medicao-model';
import ItemMedicaoLocacaoModel from '@/models/estoque/medicao/item-medicao-locacao-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

describe('medicao-de-locacao-mixin.js', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(medicaoDeLocacaoMixin, {});
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const baseOpcoes = medicaoDeLocacaoMixin.data();
    expect(typeof medicaoDeLocacaoMixin.data).toBe('function');
    expect(baseOpcoes.dadosDialogPeriodoMedicaoTodos.exibir).toBe(false);
    expect(baseOpcoes.dadosDialogPeriodoMedicaoTodos.parametros.dataInicialLocacao).toBeUndefined();
    expect(baseOpcoes.dadosDialogPeriodoMedicaoTodos.parametros.dataFinalLocacao).toBeUndefined();
    expect(baseOpcoes.dadosDialogPeriodoMedicaoTodos.parametros.datasSelecionadas).toEqual([]);
  });

  it ('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().itensDaTabela).toEqual([]);
  });

  it('Deve validar o filtro de dinheiro.', () => {
    expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
  });

  it('Valida o valor computed materiais.', () => {
    let modelo = {
      item: 'nome-do-item'
    };
    wrapper.vm.dadosLoteOuSerie(modelo.item);
  });

  it('Deve cancelar o período de medição', () => {
    wrapper.vm.cancelarPeriodoMedicaoTodos();
    expect(wrapper.vm.dadosDialogPeriodoMedicaoTodos.exibir).toBe(false);
  });

  it('Deve emitir o evento onchange quando o método "emitirAlteracoes" for chamado.', () => {
    wrapper.vm.emitirAlteracoes();
    expect(wrapper.emitted().onChange).toBeTruthy();
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

    wrapper.vm.desfazerMedicao({}, desmembramento);
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

      let item = new ItemMedicaoLocacaoModel({
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

      let item = new ItemMedicaoLocacaoModel({
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

      let item = new ItemMedicaoLocacaoModel({
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

      let item = new ItemMedicaoLocacaoModel({
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

      let item = new ItemMedicaoLocacaoModel({
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

      let item = new ItemMedicaoLocacaoModel({
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