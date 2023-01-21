import { mount } from '@vue/test-utils';
import EquipamentosOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/itens/equipamentos/EquipamentosOrcamentoLocacao.vue';
import { COLUNAS_EQUIPAMENTOS } from "@/constants/faturamento/controle-de-locacao/equipamentos-orcamento-locacao-constants.js";
import { TIPOS_PRODUTO_EQUIPAMENTO } from "@/constants/estoque/produto-constants.js";
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import apiProdutos from '@/api/estoque/produto-api.js';
import EmpresaProdutoModel from '@/models/estoque/produto/empresa-produto-model';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import ProdutoModel from '@/models/estoque/produto/produto-model';
import axiosConfig from "@/api/axios-config";

describe('EquipamentosOrcamentoLocacao.vue', () => {
    let wrapper;
    sync(store, router);

    jest.spyOn(axiosConfig, 'executarQueryGraphQL').mockImplementation(() => Promise.resolve([]));

    let produtosEmpresa = [
      new EmpresaProdutoModel({
        empresa:{
          identificador: 1
        },
        precos: [{
          preco: {
            identificador: '00A0000001',
            codigo: '01',
            nome: 'preco 01'
          },
          valor: 100
        }]
      })
    ];

    let item = {
      categoria: "EQUIPAMENTO",
      identificador: "123456",
      nome: "item XPTO",
      codigoNome: "0002",
      valorUnitario: 150,
      valorAdicionalPersonalizado: 12,
      quantidade: 1,
      diarias: 1,
      dataInicialLocacao: "2018-01-01",
      dataFinalLocacao: "2018-01-02",
      valorAcrescimo: 10,
      valorDesconto: 5,
      produto: {
        identificador: "123"
      }
    };

    beforeEach(() => {
      wrapper = mount(EquipamentosOrcamentoLocacao, {
        store, router,
        propsData: {}
      });
    });

    it('Deve definir os dados padrão(data()) do componente.', () => {
      const equipamentos = EquipamentosOrcamentoLocacao.data();
      expect(typeof EquipamentosOrcamentoLocacao.data).toBe('function');
      expect(typeof equipamentos.tiposDeProduto).toBe('object');
      expect(typeof equipamentos.colunasEquipamentos).toBe('object');
    });

    it('Deve definir os dados padrão(data()) do componente baseados no itens-mixin.js', () => {
      expect(wrapper.vm.validacao).toBeFalsy();
      expect(wrapper.vm.camposObrigatorios).toBe('');
      expect(wrapper.vm.dialogItem).toBeFalsy();
      expect(wrapper.vm.item).toEqual(new ItemOrcamentoLocacaoModel());
    });

    it('Deve estar pré-definido somente os produtos que não sejam Serviço e Serviço Comercializado.', () => {
      expect(wrapper.vm.tiposDeProduto.length).toBe(TIPOS_PRODUTO_EQUIPAMENTO.length);
      TIPOS_PRODUTO_EQUIPAMENTO.forEach((e) => {
        expect(wrapper.vm.tiposDeProduto.includes(e)).toBe(true);
      });
    });

    it('Deve estar informado as colunas da tabela de equipamentos na ordem correta.', () => {
      expect(wrapper.vm.colunasEquipamentos.length).toBe(COLUNAS_EQUIPAMENTOS.length);
      COLUNAS_EQUIPAMENTOS.forEach((e) => {
        expect(wrapper.vm.colunasEquipamentos.includes(e)).toBe(true);
      });
      expect(wrapper.vm.colunasEquipamentos[0].text).toBe('');
      expect(wrapper.vm.colunasEquipamentos[1].text).toBe('Descrição');
      expect(wrapper.vm.colunasEquipamentos[2].text).toBe('Quantidade');
      expect(wrapper.vm.colunasEquipamentos[3].text).toBe('Diárias');
      expect(wrapper.vm.colunasEquipamentos[4].text).toBe('Período inicial');
      expect(wrapper.vm.colunasEquipamentos[5].text).toBe('Período final');
      expect(wrapper.vm.colunasEquipamentos[6].text).toBe('Unitário líquido');
      expect(wrapper.vm.colunasEquipamentos[7].text).toBe('Valor total');
      expect(wrapper.vm.colunasEquipamentos[8].text).toBe('');
    });

    it('Deve retornar falso se os campos obrigatórios não estiverem preenchidos.', () => {
      wrapper.vm.identificador = "";
      wrapper.vm.item.periodoInicial = "";
      wrapper.vm.item.periodoFinal = "";
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();

      wrapper.vm.identificador = "123456";
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();

      wrapper.vm.item.quantidade = 0;
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();

      wrapper.vm.item.diarias = 0;
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();

      wrapper.vm.item.dataInicialLocacao = "3053-01-01";
      wrapper.vm.item.dataFinalLocacao = "";
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();

      wrapper.vm.item.periodoFinal = "3053-01-01";
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBeFalsy();
    });

    it('Deve retornar true se os campos obrigatórios estiverem preenchidos.', () => {
      wrapper.vm.item = new ItemOrcamentoLocacaoModel(Object.assign({}, item));
      expect(wrapper.vm.camposObrigatoriosEstaoPreenchidos()).toBe(true);
    });

    it('Deve abrir modal para cadastro de um novo item.', () => {
      expect(wrapper.vm.modoEdicao).toBeFalsy();
      expect(wrapper.vm.dialogItem).toBeFalsy();
      wrapper.vm.abrirModalParaAdicionarNovoItem();
      wrapper.vm.$nextTick(()=>{
        expect(wrapper.vm.dialogItem).toBeTruthy();
      })
    });

    it('Deve abrir modal para cadastro de um novo item.', () => {
      expect(wrapper.vm.modoEdicao).toBeFalsy();
      expect(wrapper.vm.dialogItem).toBeFalsy();
      wrapper.vm.abrirModalParaAdicionarNovoItem();
      wrapper.vm.$nextTick(()=>{
        expect(wrapper.vm.dialogItem).toBeTruthy();
      })
    });

    it('Deve emitir o evento onchange quando o método "alterarInformacoes" for chamado.', () => {
      wrapper.vm.emitirInformacoes();
      expect(wrapper.emitted().onChange).toBeTruthy();
    });

    it('Deve cancelar a adição do item quando o metodo "cancelarAdicaoDeItem" for chamado', () => {

      let equipamento = mount(EquipamentosOrcamentoLocacao, {
        propsData: {}
      });

      equipamento.vm.item = new ItemOrcamentoLocacaoModel(Object.assign({}, item));
      equipamento.vm.itens.push(new ItemOrcamentoLocacaoModel(equipamento.vm.item));

      var quantidadeItensNaLista = equipamento.vm.itens.length;
      var identificadorOriginal = equipamento.vm.item.identificador;

      equipamento.vm.item.identificador = '654321';
      equipamento.vm.modoEdicao = true;
      equipamento.vm.cancelarAdicaoDeItem();

      expect(equipamento.vm.itens.length).toBe(quantidadeItensNaLista);
      expect(equipamento.vm.itens[0].identificador).toBe(identificadorOriginal);

      expect(equipamento.vm.item.produto).toBeUndefined();
      expect(equipamento.vm.dialogItem).toBeFalsy();
      expect(equipamento.vm.validacao).toBeFalsy();
    });

    describe('Testes do itens-mixin.js', () => {
      it('Deve validar o filtro de dinheiro.', () => {
        expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
      });

      it('Deve validar o filtro de data.', () => {
        expect(wrapper.vm.$options.filters.data('2019-10-15')).toEqual('15/10/2019');
      });

      it('Deve validar se campos obrigatórios estão preenchidos - data válida.', () => {
        wrapper.vm.camposObrigatoriosEstaoPreenchidos();
        wrapper.vm.periodoInvalido();
        wrapper.vm.periodoInvalido = false;
        expect(wrapper.vm.mensagemDeErroDataInicial).toBe("Obrigatório");
        expect(wrapper.vm.mensagemDeErroDataFinal).toBe("Obrigatório");
      });

      it('Deve validar se campos obrigatórios estão preenchidos - valor inválido.', () => {
        wrapper.vm.item.valorUnitario = 0;
        wrapper.vm.camposObrigatoriosEstaoPreenchidos();
        expect(wrapper.vm.mensagemDeErroValorUnitario).toBe("Obrigatório");

        wrapper.vm.item.valorUnitario = -1;
        wrapper.vm.camposObrigatoriosEstaoPreenchidos();
        expect(wrapper.vm.mensagemDeErroValorUnitario).toBe("Valor inválido");
      });

      it('Deve validar se campos obrigatórios estão preenchidos - data inválida.', () => {
        wrapper.vm.camposObrigatoriosEstaoPreenchidos();
        wrapper.vm.periodoInvalido();
        wrapper.vm.periodoInvalido = true;
        wrapper.vm.mensagemDeErroDataInicial = true;
        wrapper.vm.mensagemDeErroDataFinal = true;
      });

      it('Deve validar o método validarPeriodo.', () => {
        wrapper.vm.item.dataInicialLocacao = '2020-01-01';
        wrapper.vm.item.dataFinalLocacao = '2020-01-02';

        wrapper.vm.validarPeriodo();
        expect(wrapper.vm.mensagemDeErroDataInicial).toBe("");
        expect(wrapper.vm.mensagemDeErroDataFinal).toBe("");
      });

      it('Deve validar os campos de data.', () => {
        wrapper.vm.item.dataInicialLocacao = "";
        wrapper.vm.item.dataFinalLocacao = "";

        wrapper.vm.validarCamposObrigatoriosDeData();
        
        expect(wrapper.vm.mensagemDeErroDataInicial).toBe("Obrigatório");
        expect(wrapper.vm.mensagemDeErroDataFinal).toBe("Obrigatório");

        wrapper.vm.item.dataInicialLocacao = "2020-01-02";
        wrapper.vm.item.dataFinalLocacao = "2020-01-01";

        wrapper.vm.validarCamposObrigatoriosDeData();
        
        expect(wrapper.vm.mensagemDeErroDataInicial).toBe("Período inválido");
        expect(wrapper.vm.mensagemDeErroDataFinal).toBe("Período inválido");
      });

      it('Deve listar os preços do produto corretamente quando os dados necessários estiverem disponíveis.', async () => {
        wrapper.vm.item = {produto: {identificador: 1}};
        wrapper.vm.identificadorEmpresa = 1;
        wrapper.vm.precosProduto = [];
        jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(produtosEmpresa));
        await wrapper.vm.listarPrecosProduto();

        expect(wrapper.vm.precosProduto[0].preco.identificador).toEqual(produtosEmpresa[0].precos[0].preco.identificador);
        expect(wrapper.vm.precosProduto[0].valor).toEqual(produtosEmpresa[0].precos[0].valor);
      });

      it('NÃO deve listar os preços do produto (sem produto, e empresa)', async () => {
        wrapper.vm.item = {};
        wrapper.vm.identificadorEmpresa = 1;
        wrapper.vm.precosProduto = [];
        jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(produtosEmpresa));

        await wrapper.vm.listarPrecosProduto();
        expect(wrapper.vm.precosProduto.length).toEqual(0);

        wrapper.vm.item = {produto: 1};

        await wrapper.vm.listarPrecosProduto();
        expect(wrapper.vm.precosProduto.length).toEqual(0);
        
        wrapper.vm.item = {produto: {identificador: 1}};
        wrapper.vm.identificadorEmpresa = undefined;

        await wrapper.vm.listarPrecosProduto();
        expect(wrapper.vm.precosProduto.length).toEqual(0);
      });

      it('Deve atribuir uma lista vazia aos preços do produto quando nenhum preço for encontrado.', async () => {
        wrapper.vm.item.produto = {identificador: 1};
        wrapper.vm.identificadorEmpresa = 1;
        jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(undefined));
        await wrapper.vm.listarPrecosProduto();

        expect(wrapper.vm.precosProduto).toEqual(expect.arrayContaining([]));
      });

      it('Deve abrir o modal em modo de edição', async (done)=>{
        wrapper.vm.item = {};
        wrapper.vm.itens = [new ItemOrcamentoLocacaoModel(item)]
        jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(produtosEmpresa));
        
        await wrapper.vm.abrirModalParaEditarItem(wrapper.vm.itens[0]);

       
        wrapper.vm.$nextTick(()=>{
          try{
            expect(wrapper.vm.modoEdicao).toBeTruthy();
            expect(wrapper.vm.item).toEqual(wrapper.vm.itens[0]);
            done();
          }
          catch(err){done.fail(err)}
        });
      });
    });

    it('Deve remover a tabela de preço caso o valor unitario seja alterado.', () => {
      wrapper.vm.item = {preco:{identificador: 1}, valorUnitario: 2};
      wrapper.vm.precosProduto = [{preco:{identificador: 1}, valor:3}];
      wrapper.vm.identificadorEmpresa = 1;
      jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(undefined));

      wrapper.vm.alterarValorUnitario();

      expect(wrapper.vm.item.preco).toBeUndefined();
    });

    it('Deve manter a tabela de preço caso o valor unitario seja o mesmo da tabela.', () => {
      wrapper.vm.item = {preco:{identificador: 1}, valorUnitario: 2};
      wrapper.vm.precosProduto = [{preco:{identificador: 1}, valor:2}];
      wrapper.vm.identificadorEmpresa = 1;
      jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(undefined));

      wrapper.vm.alterarValorUnitario();

      expect(wrapper.vm.item.preco).toBeDefined();
    });

    it('Deve alterar o preco unitario de acordo com a tabela de preço selecionada', () => {
      wrapper.vm.item = {preco:{identificador: 1}, valorUnitario: 1};
      wrapper.vm.precosProduto = [{preco:{identificador: 1}, valor:3}];
      jest.spyOn(apiProdutos, 'localizarPrecosProduto').mockImplementation(() => Promise.resolve(undefined));

      wrapper.vm.alterarPrecoDoProduto();

      expect(wrapper.vm.item.valorUnitario).toBe(3);
    });

    it('Não deve adicionar o item na tabela (campos obrigatorios nao preenchidos)', () => {
      wrapper.vm.item = new ItemOrcamentoLocacaoModel();
      wrapper.vm.adicionarItemNaTabela();
      expect(wrapper.vm.itens.length).toBe(0);
    });

    it('Deve emitir um array com os itens, removendo o item atual pois é edição', () => {
      wrapper.vm.indiceItemEdicao = 0;
      wrapper.vm.itens.push(new ItemOrcamentoLocacaoModel());

      expect(wrapper.vm.itens.length).toBe(1);
      item.quantidade = 5;

      wrapper.vm.item = new ItemOrcamentoLocacaoModel(item);
      wrapper.vm.adicionarItemNaTabela();
      expect(wrapper.vm.itens.length).toBe(1);
      expect(wrapper.emitted().onChange[0][0].length).toBe(1)
    });

    it('Deve emitir um array com o item adicionado', () => {
      wrapper.vm.itens.push(new ItemOrcamentoLocacaoModel());

      expect(wrapper.vm.itens.length).toBe(1);
      wrapper.vm.item = new ItemOrcamentoLocacaoModel(item);
      wrapper.vm.adicionarItemNaTabela();
      expect(wrapper.emitted().onChange[0][0].length).toBe(2);
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

    it('Deve verificar e não deletar o item da lista de equipamentos quando o método "deletarItemDaTabela" for chamado', () => {
      let itens = {preco:{identificador: 1}, valorUnitario: 2};
      wrapper.vm.itens.push(new ItemOrcamentoLocacaoModel(itens));
      wrapper.vm.verificarExclusaoDoItemDaTabela(itens);
      expect(wrapper.vm.itens.length).toBe(1);

      wrapper.vm.deletarItemDaTabela(itens);
      expect(wrapper.vm.itens.length).toBe(1);
    });

    it('Validar método _onDescricaoChange.', () => {
      let descricao = 'descricao-do-produto';
      wrapper.vm.item.produto = {
        nome: 'descricao'
      }

      wrapper.vm._onDescricaoChange(descricao);
      expect(wrapper.vm.item.descricao).toBe(descricao);

      let descricao2 = 'descricao-do-produto';
      wrapper.vm.item.produto = {
        nome: 'descricao-do-produto'
      }

      wrapper.vm._onDescricaoChange(descricao2);
      expect(wrapper.vm.item.descricao).toBeUndefined();
    });

    it('Validar método _onProdutoChange.', () => {
      let produto = new ProdutoModel({identificador:"000001", descricao:"produto A"});
      wrapper.vm._onProdutoChange(produto);
      wrapper.vm.listarPrecosProduto(produto);
      wrapper.vm.obterQuantidadeDisponivelDoProduto(produto);
      expect(wrapper.vm.mensagemDeErroProduto).toBe("");

      produto = undefined;
      wrapper.vm._onProdutoChange(produto);
      expect(wrapper.vm.item.descricao).toBeUndefined();
      expect(wrapper.vm.mensagemDeErroProduto).toBe("Obrigatório");
    });
});