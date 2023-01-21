import { mount } from '@vue/test-utils';
import apiNaturezaLancamento from "@/api/financeiro/natureza-lancamento-api.js";
import DespesasOrcamentoLocacao from "@/components/faturamento/controle-de-locacao/orcamento/despesas/DespesasOrcamentoLocacao";
import despesas from '../../../../fakes/faturamento/controle-de-locacao/despesas.json';
import { COLUNAS_DESPESAS } from "@/constants/faturamento/controle-de-locacao/despesas-orcamento-locacao-constants.js";
import DespesaModel from '@/models/faturamento/orcamento-locacao/despesa-model';
import NaturezaLancamentoModel from '@/models/financeiro/natureza-lancamento-model';
import AdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/adicional-personalizado-model.js';
import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

describe('DespesasOrcamentoLocacao.vue', () => {
  let mockApi = jest.spyOn(apiNaturezaLancamento, 'localizarNaturezasAnaliticas')
      .mockImplementation(() => Promise.resolve(despesas));

  let itensAdicionais = [new ItemAdicionalPersonalizadoModel({
    identificador: '123456',
    revisao: 1,
    descricao: 'porcentagem',
    aliquota: 10,
    atualizaDespesas: true,
    atualizaEquipamentos: true,
    atualizaMateriais: true,
    atualizaServicos: true
  })];

  let _adicionaisMock = [new AdicionalPersonalizadoModel({
    itens: itensAdicionais,
    identificador: "123456",
    codigo: "00001",
    descricao: "Adicional X"
  })];

  let wrapper;

  beforeEach(() => {
    wrapper = mount(DespesasOrcamentoLocacao, {
      propsData: {
        despesasAdicionadas: []
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(typeof DespesasOrcamentoLocacao.data).toBe('function');
    expect(wrapper.vm.limpar);
    expect(wrapper.vm.adicionarDespesa).toBeFalsy();
    expect(wrapper.vm.despesaSelecionada).toBeUndefined();
    expect(wrapper.vm.valorTotalDasDespesas).toBe(0);
    expect(wrapper.vm.dialogDespesas).toBeFalsy();
    expect(wrapper.vm.mensagemDeCamposObrigatorios).toBe('');
    expect(wrapper.vm.mostrarMensagemDeCamposObrigatorios).toBeFalsy();
    expect(wrapper.vm.colunasDespesas).toBe(COLUNAS_DESPESAS);
    expect(wrapper.vm.despesa.constructor.name).toBe(DespesaModel.name);
  });

  it('Deve mostrar mensagem quando o usuario não selecionar a despesa e clicar em adicionar', () => {
    wrapper.vm.despesa.valorItem = 10;
    expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();
    expect(wrapper.vm.mensagemDeCamposObrigatorios).toBe('Selecione uma despesa');
  });

  it('Deve mostrar mensagem quando o usuario não informar o valor e clicar em adicionar', () => {
    wrapper.vm.despesa.naturezaLancamento = new NaturezaLancamentoModel(despesas[0].naturezaLancamento);
    wrapper.vm.despesa.valorItem = 0;
    expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();
    expect(wrapper.vm.mensagemDeCamposObrigatorios).toBe(' - Valor deve ser maior que R$ 0,00 ');
  });

  it('Deve mostrar mensagem quando o usuario não informar a quantidade e clicar em adicionar', () => {
    wrapper.vm.despesa.naturezaLancamento = new NaturezaLancamentoModel(despesas[0].naturezaLancamento);
    wrapper.vm.despesa.quantidade = 0;
    wrapper.vm.despesa.valorItem = 1;
    expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();
    expect(wrapper.vm.mensagemDeCamposObrigatorios).toBe(' - Quantidade deve ser maior que zero');
  });

  it('Não deve mostrar mensagem quando o usuario preencher os campos corretamente e clicar em adicionar', () => {
    wrapper.vm.despesa.naturezaLancamento = new NaturezaLancamentoModel(despesas[0].naturezaLancamento);
    wrapper.vm.despesa.quantidade = wrapper.vm.despesa.valorItem = 1;

    expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeTruthy();
    expect(wrapper.vm.mensagemDeCamposObrigatorios).toBe('');
  });

  it('Deve adicionar a despesa na lista de despesa quando o metodo "adicionarDespesaNaTabela" for chamado', () => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.despesa.valorItem = 10;
    wrapper.vm.aditarDespesaSelecionada = false;
    
    wrapper.vm.adicionarDespesaNaTabela();
    expect(wrapper.vm.mensagemDeCamposObrigatorios).toBe('');
    expect(wrapper.vm.despesasAdicionadas.length).toBe(1);
  });

  it('Não deve adicionar a despesa na lista de despesa quando o metodo "adicionarDespesaNaTabela" for chamado e os campos obrigatorios não forem preenchidos', () => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.despesa.quantidade = 0;      
    wrapper.vm.adicionarDespesaNaTabela();
    expect(wrapper.vm.despesasAdicionadas.length).toBe(0);
  });
  
  it('Deve editar a despesa na lista de despesa quando o metodo "adicionarDespesaNaTabela" for chamado e a despesa já tiver sido adicionada', () => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.despesasAdicionadas.push(wrapper.vm.despesa);
    wrapper.vm.despesa.valorItem = 15;
    wrapper.vm.despesa.valorTotal = wrapper.vm.despesa.calcularValorTotalComoDespesa();
    wrapper.vm.editarDespesaSelecionada = true;

    wrapper.vm.adicionarDespesaNaTabela();
    expect(wrapper.vm.despesasAdicionadas.length).toBe(1);
    expect(wrapper.vm.despesasAdicionadas[0].naturezaLancamento.identificador).toEqual(despesas[0].naturezaLancamento.identificador); 
  });

  it('Deve alterar a natureza de lançamento quando o metodo "alterarNaturezaLancamento" for chamado.', () => {
    expect(wrapper.vm.despesa.naturezaLancamento).not.toEqual(despesas[0].naturezaLancamento);
    wrapper.vm.alterarNaturezaLancamento(despesas[0].naturezaLancamento);
    expect(wrapper.vm.despesa.naturezaLancamento).toEqual(despesas[0].naturezaLancamento);
  });

  it('Deve validar o filtro de dinheiro.', () => {
    expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
  });

  it('Deve deletar a despesa da lista de despesas adicionadas quando o metodo "deletarItemDaTabela" for chamado', () => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.despesa.valorItem = 12;
    wrapper.vm.despesa.valorTotal =  wrapper.vm.despesa.calcularValorTotalComoDespesa();
    wrapper.vm.despesasAdicionadas.push(wrapper.vm.despesa);

    expect(wrapper.vm.despesasAdicionadas.length).toBe(1);

    wrapper.vm.deletarItemDaTabela(wrapper.vm.despesa);
    expect(wrapper.vm.despesasAdicionadas.length).toBe(0);
  });

  it("Deve perguntar se deseja excluir o item", ()=>{
    let config;
    let spy = jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation((cfg) =>{config = cfg});

    wrapper.vm.questionarUsuarioSobreDeletarItemDaTabela()

    expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
    expect(config.botaoPrimario.callback).toBeDefined();
    config.botaoPrimario.callback()
    spy.mockClear()
  });

  it('NÃO deve deletar a despesa da lista de despesas adicionadas quando o metodo "deletarItemDaTabela" for chamado', ()=>{
    let spy = jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() =>{});

    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.despesa.valorItem = 12;
    wrapper.vm.despesa.valorTotal =  wrapper.vm.despesa.calcularValorTotalComoDespesa();
    wrapper.vm.despesasAdicionadas.push(wrapper.vm.despesa);
    expect(wrapper.vm.despesasAdicionadas.length).toBe(1);

    expect(wrapper.vm.$mensagemFlutuante.confirmacao).not.toHaveBeenCalled();
    spy.mockClear()
  });

  it('Deve verificar e deletar o item', () => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.verificarExclusaoDoItemDaTabela(wrapper.vm.despesa);

    wrapper.vm.despesa.valorItem = 12;
    wrapper.vm.despesa.valorTotal = wrapper.vm.despesa.calcularValorTotalComoDespesa();
    wrapper.vm.despesasAdicionadas.push(wrapper.vm.despesa);

    expect(wrapper.vm.despesasAdicionadas.length).toBe(1);

    wrapper.vm.deletarItemDaTabela(wrapper.vm.despesa);
    expect(wrapper.vm.despesasAdicionadas.length).toBe(0);
  });

  it('Deve cancelar inclusao da despesa quando o metodo "cancelarInclusaoDespesa" for chamado', () => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.despesa.valorItem = 12;
    wrapper.vm.despesa.valorTotal =  wrapper.vm.despesa.calcularValorTotalComoDespesa();
    wrapper.vm.dialogDespesas = true;
    wrapper.vm.editarDespesaSelecionada = true;
    wrapper.vm.mostrarMensagemDeCamposObrigatorios = true;

    wrapper.vm.cancelarInclusaoDespesa();
    expect(wrapper.vm.despesa.valor).not.toEqual("R$ 2,10");
    expect(wrapper.vm.despesa.valorTotal).not.toEqual("R$ 2,10");
    expect(wrapper.vm.dialogDespesas).toBeFalsy();
    expect(wrapper.vm.editarDespesaSelecionada).toBeFalsy();
    expect(wrapper.vm.mostrarMensagemDeCamposObrigatorios).toBeFalsy();
  });

  it('Deve editar despesa quando o metodo "abrirModalEditarDespesa" for chamado', (done) => {
    wrapper.vm.despesa = new DespesaModel(despesas[0]);
    wrapper.vm.abrirModalEditarDespesa(despesas[0]);
    expect(wrapper.vm.despesa.valor).not.toEqual("R$ 2,10");
    expect(wrapper.vm.despesa.valorTotal).not.toEqual("R$ 2,10");
    expect(wrapper.vm.dialogDespesas).toBeTruthy();
    expect(wrapper.vm.editarDespesaSelecionada).toBeTruthy();

    wrapper.vm.$nextTick(()=>{
      try {
        wrapper.vm.despesa = new DespesaModel(despesas[0]);
        wrapper.vm.naturezaLancamentoSelecionada = wrapper.vm.despesa.naturezaLancamento;
        done();
      }
      catch(err){done.fail(err)}
    });
  });

  it('Deve exibir o modal de adicionar despesa.', async () => {
    await wrapper.vm.abrirModalAdicionarNovaDespesa();
    expect(wrapper.vm.dialogDespesas).toBe(true);
    expect(wrapper.vm.focoHabilitado).toBe(true);
  });

  it('Deve calcular o valor do Adicional quando a valor do item for alterado', () => {
    wrapper.setProps({ adicionalPersonalizado: _adicionaisMock[0] })
    wrapper.vm.despesa.quantidade = 2;
    wrapper.vm.despesa.valorItem = 15;

    expect(wrapper.vm.despesa.valorAdicionalPersonalizado).toBe(1.67);
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

  it('Deve exibir o diálogo de despesas ao invocar o método para a despesa.', () => {
    let despesa = { naturezaLancamento: {} };
    wrapper.vm.visualizarDespesa(despesa);
    expect(wrapper.vm.dialogDespesas).toBeTruthy();
  });

  it('Deve filtrar corretamente a natureza de lançamento pela classificação (mesmo parcial).', () => {
    let naturezaLancamento = {
      classificacao: '02.01.01.02.01',
      codigoNome: '00001 - INTERNET'
    };
    let consulta = '02.01';

    expect(wrapper.vm.filtrarNatureza(naturezaLancamento, consulta, naturezaLancamento.codigoNome)).toBeTruthy();
  });

  it('Deve localizar as naturezas de lançamentos corretamente quando não estiverem carregadas.', async() => {
    expect(await wrapper.vm.listaNaturezasLancamento).toEqual(expect.arrayContaining([]));
    expect(await wrapper.vm.localizarNatureza()).toEqual(expect.arrayContaining(despesas));
    expect(await wrapper.vm.listaNaturezasLancamento).toEqual(expect.arrayContaining(despesas));
  });

  it('Não deve localizar as naturezas de lançamentos quando já estiverem carregadas.', async() => {
    mockApi.mockClear();
    jest.spyOn(apiNaturezaLancamento, 'localizarNaturezasAnaliticas').mockImplementation(() => Promise.resolve());
    wrapper.vm.listaNaturezasLancamento = despesas;
    expect(await wrapper.vm.localizarNatureza()).toEqual(expect.arrayContaining(despesas));
    expect(apiNaturezaLancamento.localizarNaturezasAnaliticas).not.toHaveBeenCalled();
  });
});