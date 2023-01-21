import { mount } from '@vue/test-utils';
import RepassesOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/repasses/RepassesOrcamentoLocacao.vue';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import RepasseModel from '@/models/faturamento/orcamento-locacao/repasse-model';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import { COLUNAS_REPASSES } from '@/constants/faturamento/controle-de-locacao/repasses-orcamento-locacao-constants.js';

describe('RepassesOrcamentoLocacao.vue', () => {
  let wrapper;
  let _pessoasMock = [new PessoaModel({"identificador":"00A000001C","codigo":"000027","codigoNome":"000027 - ARMAZEM OFFSHORE DE MACAE COMERCIAL E IMPORTADORA","nome":"ARMAZEM OFFSHORE DE MACAE COMERCIAL E IMPORTADORA","categorias":[{"nome":"Fornecedor","identificador":"0000000006"}]}),new PessoaModel({"identificador":"00A00000EQ","codigo":"000439","codigoNome":"000439 - EXPRESSO PREDILETO TRANSPORTES, LOGISTICA E ARMAZE","nome":"EXPRESSO PREDILETO TRANSPORTES, LOGISTICA E ARMAZE","categorias":[{"nome":"Transportador","identificador":"0000000003"}]},{"identificador":"00A00000G0","codigo":"000477","codigoNome":"000477 - ARMAZEM AMBIENTAL COMERCIAL IMPORTADORA EIRELI","nome":"ARMAZEM AMBIENTAL COMERCIAL IMPORTADORA EIRELI","categorias":[{"nome":"Fornecedor","identificador":"0000000006"}]})];
  let _repasseMock = {
    aliquotaFaturamento: 200,
    aliquotaDuplicata: 0,
    pessoa: _pessoasMock[0]
  }

  beforeEach(() => {
    wrapper = mount(RepassesOrcamentoLocacao, {
      propsData: {
        itensDoOrcamento: [new ItemOrcamentoLocacaoModel({"categoria":"EQUIPAMENTO","identificador":"123456","nome":"item XPTO","codigoNome":"0002","valorUnitario":150,"quantidade":1,"diarias":1,"periodoInicial":"01/01/2000","periodoFinal":"02/01/2000","valorAcrescimo":10,"valorDesconto":5,"valorTotalItem":"R$ 145,00","repasses":[]})]
      }
    });
  });

  it('Deve definir os dados padroes do componente.', () => {
    const componente = RepassesOrcamentoLocacao.data();
    expect(componente.dialogRepasses).toBeFalsy();
    expect(componente.focusCampoPessoa).toBeFalsy();
    expect(componente.colunasRepasse).toBe(COLUNAS_REPASSES);
    expect(componente.repasses.length).toBe(0);
    expect(componente.repasse).toEqual(new RepasseModel());
  });

  it("Deve adicionar o objeto de repasse na tabela", () => {
    expect(wrapper.vm.repasses.length).toBe(0)
    wrapper.vm.repasse = new RepasseModel(_repasseMock)
    wrapper.vm.salvarRepasseTabela();
    expect(wrapper.vm.repasses.length).toBe(1)
    expect(wrapper.vm.repasses[0].aliquotaFaturamento).toBe(200)
    expect(wrapper.vm.repasses[0].pessoa.codigoNome).toBeDefined()
  });

  it("Deve adicionar o objeto de repasse na array de itensDoOrcamento", () => {
    wrapper.vm.repasse = new RepasseModel(_repasseMock)
    wrapper.vm.salvarRepasseTabela();
    expect(wrapper.vm.itensDoOrcamento[0].repasses.length).toBe(1);
  });

  it('Deve validar pessoa e NÃO salvar na tabela', () => {
    wrapper.vm.repasse = new RepasseModel();
    wrapper.vm.salvarRepasseTabela()
    expect(wrapper.vm.repasses.length).toBe(0)
    expect(wrapper.vm.camposObrigatorios).toBe("Pessoa para repasse é um campo obrigatório.");
  });

  it('Não deve permitir adicionar a mesma pessoa de repasse.', () => {
    wrapper.vm.editarRepasseSelecionado = true;
    wrapper.vm.repasse = new RepasseModel(_repasseMock);
    wrapper.vm.salvarRepasseTabela();
    expect(wrapper.vm.repasses.length).toBe(1);
    wrapper.vm.repasse = new RepasseModel(_repasseMock);
    wrapper.vm.salvarRepasseTabela();
    expect(wrapper.vm.repasses.length).toBe(1);
    expect(wrapper.vm.camposObrigatorios).toBe("Não é possível adicionar a mesma pessoa de repasse.");
  });

  it('Deve deletar o item da lista de repasses quando o método "removerRepasseAdicionadoNaLista" for chamado', () => {
    wrapper.vm.repasses.push(new RepasseModel(_repasseMock));
    expect(wrapper.vm.repasses.length).toBe(1);

    wrapper.vm.removerRepasseAdicionadoNaLista(new RepasseModel(_repasseMock));
    expect(wrapper.vm.repasses.length).toBe(0);
  });

  it('Não deve permitir editar um repasse.', () => {
    let repasse = new RepasseModel(_repasseMock);
    wrapper.vm.repasse = repasse
    wrapper.vm.salvarRepasseTabela();
    expect(wrapper.vm.repasses.length).toBe(1);

    repasse.aliquotaDuplicata = 15;
    repasse.aliquotaFaturamento = 25;
    wrapper.vm.editarRepasse(repasse);
    expect(wrapper.vm.editarRepasseSelecionado).toBeTruthy();

    wrapper.vm.salvarRepasseTabela();
    expect(wrapper.vm.repasses.length).toBe(1);
    expect(wrapper.vm.repasses[0].aliquotaDuplicata).toBe(15);
    expect(wrapper.vm.repasses[0].aliquotaFaturamento).toBe(25);
  });

  it('Deve formatar aliquota quando o filter for chamado.', () => {
    expect(typeof wrapper.vm.$options.filters.formataAliquota('50,55')).toBe('string');
    expect(wrapper.vm.$options.filters.formataAliquota('50.55')).toBe('50,55%');
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

  it('Deve verificar e deletar o item da lista de repasses quando o método "deletarItemDaTabela" for chamado', () => {
    wrapper.vm.repasses.push(new RepasseModel(_repasseMock));
    wrapper.vm.verificarExclusaoDoItemDaTabela(_repasseMock);
    expect(wrapper.vm.repasses.length).toBe(1);

    wrapper.vm.deletarItemDaTabela(new RepasseModel(_repasseMock));
    expect(wrapper.vm.repasses.length).toBe(0);
  });

  it('Deve exibir o modal vazio, para a adicao de um novo repasse', () => {
    wrapper.vm.repasse = new RepasseModel();
    wrapper.vm.exibirModalAdicionarRepasse(undefined);

    expect(wrapper.vm.dialogRepasses).toBeTruthy();
    expect(wrapper.vm.repasse.pessoa).toBeUndefined();
  });

  it('Deve exibir o modal de repasse preenchendo os campos para edicao', () => {
    wrapper.vm.repasse = new RepasseModel();
    wrapper.vm.exibirModalAdicionarRepasse(new RepasseModel(_repasseMock))

    expect(wrapper.vm.editarRepasseSelecionado).toBeFalsy();
    expect(wrapper.vm.dialogRepasses).toBeTruthy()
    expect(wrapper.vm.repasse.aliquotaFaturamento).toBe(_repasseMock.aliquotaFaturamento)
  });

  it('Deve limpar e fechar o modal', () => {
    wrapper.vm.repasse = {};
    wrapper.vm.cancelarAdicaoRepasse();

    expect(wrapper.vm.dialogRepasses).toBeFalsy();
    expect(wrapper.vm.repasse.pessoa).toBeUndefined();
  });

  it('Deve comunicar alteração nos itens do orçamento e add os repasses no item', () => {
    wrapper.vm.repasse = new RepasseModel(_repasseMock);
    wrapper.vm.repasse = new PessoaModel(_pessoasMock[0]);
    wrapper.setProps({ itensDoOrcamento: [] })
    expect(wrapper.vm.itensDoOrcamento.length).toBe(0);
  });

  it('Deve aplicar adicionar o repasse na tabela quando vier repasse no item', () => {
    let repasses = [{aliquotaDuplicata: 5, aliquotaFaturamento: 10, pessoa: new PessoaModel({identificador: '123456', nome: 'Teste'})}];
    wrapper.vm.itensDoOrcamento[0].repasses = repasses;

    wrapper.vm.obterRepassesVindoDosItens();

    expect(wrapper.vm.itensDoOrcamento[0].repasses).toEqual(repasses);
    expect(wrapper.vm.repasses).toEqual(repasses);
  });
});