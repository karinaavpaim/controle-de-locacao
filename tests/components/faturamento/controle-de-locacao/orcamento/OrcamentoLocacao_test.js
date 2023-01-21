import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import routes from '@/router/routes';
import store from '@/store';
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import OrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/OrcamentoLocacao.vue';
import _repasseFake from '../../../../fakes/faturamento/controle-de-locacao/repasses.json';
import _despesasFake from '../../../../fakes/faturamento/controle-de-locacao/despesas.json';
import _orcamentoContratoFake from '../../../../fakes/faturamento/controle-de-locacao/orcamento-contrato.json';
import PessoaModel from '@/models/geral/pessoa/pessoa-model.js';
import DespesaModel from '@/models/faturamento/orcamento-locacao/despesa-model.js';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model.js';
import FormaPagamentoModel from '@/models/financeiro/forma-pagamento-model';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model.js';
import RepasseModel from '@/models/faturamento/orcamento-locacao/repasse-model.js';
import EmpresaModel from '@/models/geral/empresa-model.js';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';
import VueRouter from 'vue-router';
import apiConfiguracao from "@/api/faturamento/controle-de-locacao/configuracao-locacao-api.js";
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";
import PrazoModel from '@/models/financeiro/prazo-model';
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";

describe('OrcamentoLocacao.vue', () => {
  let wrapper;
  sync(store, router);
  store.dispatch(OPCOES_STORE_EMPRESA.ACTIONS.ALTERAR_EMPRESA_ATUAL, new Promise((resolve)=>resolve(new EmpresaModel({identificador: 1}))));

  let despesas = [new DespesaModel(_despesasFake[0])];
  let itens = [
    new ItemOrcamentoLocacaoModel({
      categoria: 'EQUIPAMENTO',
      valorDesconto: 10,
      valorAcrescimo: 5,
      valorUnitario: 20,
      quantidade: 2,
      identificador: '123456',
      repasses: [new RepasseModel(_repasseFake)]
    }),
    new ItemOrcamentoLocacaoModel({
      categoria: 'SERVICO',
      valorDesconto: 5,
      valorAcrescimo: 3,
      valorUnitario: 20,
      quantidade: 3,
      identificador: '123456',
      repasses: [new RepasseModel(_repasseFake)]
    }),
    new ItemOrcamentoLocacaoModel({
      categoria: 'MATERIAL',
      valorDesconto: 4,
      valorAcrescimo: 8,
      valorUnitario: 16,
      quantidade: 2,
      identificador: '123456',
      repasses: [new RepasseModel(_repasseFake)]
    })
  ];

  let empresa = new EmpresaModel({ identificador:'645321', nome: 'empresa XPTO' });
  let cliente = new PessoaModel({ identificador:"123456", nome:'cliente XYZ' });
  
  let prazo = new PrazoModel({nome: '60 DIAS'});
  let formaPagamentoEntrada = new FormaPagamentoModel({nome: 'DINHEIRO'});
  let formaPagamentoParcelas = new FormaPagamentoModel({nome: 'TED'});

  let orcamentoModel = new OrcamentoLocacaoModel({
    empresa: empresa,
    cliente: cliente,
    itens: itens,
    despesas: despesas,
    codigoEnderecoEntrega: '02',
    dataReferencia: '01/01/2200',
    prazo: prazo,
    formaPagamentoEntrada: formaPagamentoEntrada,
    formaPagamentoParcelas: formaPagamentoParcelas,
  });

  var mock = jest.spyOn(apiOrcamento, 'cadastrar')
                 .mockImplementation(() => Promise.resolve(new OrcamentoLocacaoModel(_orcamentoContratoFake)));

  let respostaConfiguracao = {secaoGeral: {identificadorProdutoPadraoBimer: "1"}}
  jest.spyOn(apiConfiguracao, 'obterConfiguracaoLocacaoPeloIdentificadorEmpresa')
      .mockImplementation(()=>Promise.resolve([respostaConfiguracao]))

  beforeEach(() => {
    wrapper = mount(OrcamentoLocacao, {
      store,
      router,
      propsData: {}
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(typeof wrapper.vm.breadCrumbs).toBe('object');
    expect(wrapper.vm.tabsItens.active).toBe(0);
    expect(wrapper.vm.tabsDespesasRepasses.active).toBe(0);
    expect(typeof wrapper.vm.orcamento).toBe('object');      
    expect(wrapper.vm.tabsItensDoOrcamento.length).toBe(3);
    expect(wrapper.vm.tabsItensDoOrcamento[0]).toBe('Equipamentos');
    expect(wrapper.vm.tabsItensDoOrcamento[1]).toBe('Materiais');
    expect(wrapper.vm.tabsItensDoOrcamento[2]).toBe('Serviços');
    expect(wrapper.vm.tabsGeraisOrcamento.length).toBe(2);
    expect(wrapper.vm.tabsGeraisOrcamento[0]).toBe('Despesas');
    expect(wrapper.vm.tabsGeraisOrcamento[1]).toBe('Repasses');
    expect(wrapper.vm.orcamento.despesas.length).toBe(0);
  });

  it('Deve validar o filtro de data em formato iso.', () => {
    expect(wrapper.vm.$options.filters.formatDate('2019-10-15')).toEqual('15/10/2019');
    expect(wrapper.vm.$options.filters.formatDate('')).toEqual('-');
  });

  /*
  * NOVO ORÇAMENTO LOCAÇÃO
  */

  describe("Eventos do OrcamentoLocacao.vue", () => {
    it('Validar o método obterOrcamentoPeloIdentificador', async (done) => {
      let orcamento = { identificador: 333 };
      wrapper.vm.obterOrcamentoPeloIdentificador(orcamento.identificador);

      expect(wrapper.vm.carregandoOrcamento).toBe(true);

      const resposta = [Object.assign({ identificador: 1 }, _orcamentoContratoFake)];
      let mockConsultar = jest.spyOn(apiOrcamento, 'consultarDetalhesOrcamentoPorIdentificador')
                              .mockImplementation(() => Promise.resolve(resposta));

      wrapper.vm.orcamento = new OrcamentoLocacaoModel();

      mockConsultar.mockClear();
      mockConsultar = jest.spyOn(apiOrcamento, 'consultarDetalhesOrcamentoPorIdentificador')
          .mockImplementation(() => Promise.reject("Houve um erro na API"));

      expect(wrapper.vm.carregandoOrcamento).toBe(true);
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);

      await wrapper.vm.obterOrcamentoPeloIdentificador(orcamento.identificador);

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
      mockConsultar.mockClear();
    });

    it('Deve retornar false quando as informações obrigatórios não forem preenchidas.', () => {
      wrapper.vm.orcamento = new OrcamentoLocacaoModel();
      expect(wrapper.vm.informacoesObrigatoriasForamPreenchidas()).toBeFalsy();
    });

    it('Deve retornar verdadeiro quando as informações obrigatórios forem preenchidas.', () => {
      wrapper.vm.orcamento = orcamentoModel;
      wrapper.vm.orcamento.codigoEnderecoEntrega = "02"
      expect(wrapper.vm.informacoesObrigatoriasForamPreenchidas()).toBe(true);
    });

    it('Deve alterar o focus para false', () => {
      wrapper.vm.alterarFocus();
      expect(wrapper.vm.focoHabilitado).toBeFalsy();
    });

    it('Deve voltar para tela de Gestão de locação', () => {
      jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => Promise.resolve());
      wrapper.vm.voltarTelaGestaoLocacao();
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });

    it('Não deve cadastrar o orçamento quando todos os dados obrigatórios não forem preenchidos e o método salvarOrcamentoOuLocacao', async (done) => {
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
      await wrapper.vm.salvarOrcamentoOuLocacao();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve cadastrar o orçamento quando todos os dados obrigatórios forem preenchidos e o metodo salvarOrcamentoOuLocacao', async  (done) => {
      wrapper.vm.orcamento = orcamentoModel;
      wrapper.vm.orcamento.codigoEnderecoEntrega = "02"

      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);

      await wrapper.vm.salvarOrcamentoOuLocacao();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve disparar mensagem de falha quando ocorrer erro na gravação do orcamento', async (done) => {
      wrapper.vm.orcamento = orcamentoModel;
      mock.mockClear();
      jest.spyOn(apiOrcamento, 'cadastrar')
          .mockImplementation(() => Promise.reject("erroooooo!!"));

      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);

      await wrapper.vm.salvarOrcamentoOuLocacao();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve obter o total de descontos.', () => {
      wrapper.vm.orcamento = orcamentoModel;  
      expect(wrapper.vm.totalDescontos.valorDescontoEquipamentos).toBe(10);
      expect(wrapper.vm.totalDescontos.valorDescontoServicos).toBe(5);
      expect(wrapper.vm.totalDescontos.valorDescontoMateriais).toBe(4);
      expect(wrapper.vm.totalDescontos.valorTotalDescontos).toBe(19);
    });

    it('Deve obter o total de acréscimos.', () => {
      wrapper.vm.orcamento = orcamentoModel;  
      expect(wrapper.vm.totalAcrescimos.valorAcrescimoEquipamentos).toBe(5);
      expect(wrapper.vm.totalAcrescimos.valorAcrescimoServicos).toBe(3);
      expect(wrapper.vm.totalAcrescimos.valorAcrescimoMateriais).toBe(8);
      expect(wrapper.vm.totalAcrescimos.valorTotalAcrescimos).toBe(16);
    });
  });

  describe("Parâmetros da rota", () => {
    it('Deve criar uma cópia do orçamento sem o código ao informar na rota os parâmetros "identificador" e "duplicar"', (done) => {
      const resposta = [Object.assign({ identificador: 1 }, _orcamentoContratoFake)];

      jest.spyOn(apiOrcamento, 'consultarDetalhesOrcamentoPorIdentificador')
          .mockImplementation(() => Promise.resolve(resposta));

      const routerDuplicacao = new VueRouter({ routes: routes.paths,  mode: 'history' });

      routerDuplicacao.push({
        name: ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.name,
        params: { idOrcamento: 1 }
      });
  
      var wrapperDuplicacao = mount(OrcamentoLocacao, {
        store,
        router: routerDuplicacao,
        propsData: {}
      });

      expect(wrapperDuplicacao.vm.$route.path).toEqual(ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.path.replace(':idOrcamento', '1'));
      
      /*
      * @TODO: O ideal é separar estes testes. Refatorar assim que possivel.
      */
      wrapperDuplicacao.vm.$nextTick(async () => {
        wrapperDuplicacao.vm.$nextTick(async ()=>{
          wrapperDuplicacao.vm.$nextTick(async ()=>{
            wrapperDuplicacao.vm.$nextTick(async ()=>{
              try {
                wrapperDuplicacao.vm.$nextTick(async ()=>{
                  expect(wrapperDuplicacao.vm.orcamento.empresa.identificador).toBe(1);
                  expect(apiOrcamento.consultarDetalhesOrcamentoPorIdentificador).toHaveBeenCalledWith(1);
                  wrapperDuplicacao.vm.$nextTick(async ()=>{
                    expect(wrapperDuplicacao.vm.orcamento.identificador).toBe(resposta[0].identificador);
                    expect(wrapperDuplicacao.vm.orcamento.codigo).toBeUndefined();
                    done();
                  });
                })
              }
              catch(err){done.fail(err)}
            });
          });
        });
      });
    });

    it('Deve editar um orçamento ao informar na rota o identificador', (done) => {
      const resposta = [new OrcamentoLocacaoModel(Object.assign({ identificador: 1 }, _orcamentoContratoFake))];
      jest.spyOn(apiOrcamento, 'consultarDetalhesOrcamentoPorIdentificador')
          .mockImplementation(() => Promise.resolve(resposta));

      jest.spyOn(apiOrcamento, 'editar').mockImplementation(() => Promise.resolve({ codigo: '001' }));

      const routerEdicao = new VueRouter({ routes: routes.paths,  mode: 'history' });

      routerEdicao.push({
        name: ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name,
        params: { idOrcamento: 1 }
      });

      var wrapperEdicao = mount(OrcamentoLocacao, {
        store,
        router: routerEdicao,
        propsData: {}
      });

      expect(wrapperEdicao.vm.$route.path).toEqual(ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.path.replace(':idOrcamento', '1'));
      expect(wrapperEdicao.vm.$route.params.idOrcamento).toBe(1);
      expect(wrapperEdicao.vm.$route.params.duplicar).toBeUndefined();

      /*
      * @TODO: O ideal é separar estes testes. Refatorar assim que possivel.
      */
      wrapperEdicao.vm.$nextTick(async () => {
          wrapperEdicao.vm.$nextTick(async ()=>{
            wrapperEdicao.vm.$nextTick(async ()=>{
              wrapperEdicao.vm.$nextTick(async ()=>{
                try {
                  expect(wrapperEdicao.vm.orcamento.empresa.identificador).toBe(1);
                  expect(apiOrcamento.consultarDetalhesOrcamentoPorIdentificador).toHaveBeenCalledWith(1);
                  wrapperEdicao.vm.$nextTick(async ()=>{
                    expect(wrapperEdicao.vm.orcamento.identificador).toBe(1);
                    await wrapperEdicao.vm.salvarOrcamentoOuLocacao();
                    expect(apiOrcamento.editar).toHaveBeenCalled();
                    done();
                  });
                }
                catch(err){done.fail(err)}
              });
            });
          });
      });
    });

    it('Valida o método descricaoPrazo', () => {
      orcamentoModel.prazo.length = 1;
      wrapper.vm.descricaoPrazo();
      let entrada = orcamentoModel.formaPagamentoEntrada;
      let parcela = orcamentoModel.formaPagamentoParcelas;
      expect(entrada.nome).toBe("DINHEIRO");
      expect(parcela.nome).toBe("TED");

      let descricao = "Nenhuma forma de pagamento selecionada";
      orcamentoModel.prazo.length = 0;
      wrapper.vm.descricaoPrazo();
      expect(descricao).toBe("Nenhuma forma de pagamento selecionada");
    });

    it('Deve disparar mensagem para questionar o usuário se deseja recalcular os adicionais', async (done) => {
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);
      await wrapper.vm.questionarUsuarioSeDesejaRecalcularOsAdicionais();
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
  });

  it('Deve aplicar a quantidade de diárias padrão nos itens que tiverem menos diárias medidas que esta quantidade.', () => {
    let locacao = new OrcamentoLocacaoModel({
      itens: [{
          categoria: CATEGORIAS_ITEM.EQUIPAMENTO,
          diariasJaMedidas: 2,
          quantidadeDiarias: 10
        },
        {
          categoria: CATEGORIAS_ITEM.SERVICO,
          diariasJaMedidas: 0,
          quantidadeDiarias: 7
        }
      ]
    });

    let wrapperTeste = mount(OrcamentoLocacao, {
      store,
      router,
    });

    wrapperTeste.vm.orcamento = locacao;
    wrapperTeste.vm.diariasPreenchimentoAutomatico = 5;

    wrapperTeste.vm.aplicarQuantidadeDeDiariasPadrao();

    expect(wrapperTeste.vm.orcamento.itens[0].quantidadeDiarias).toBe(wrapperTeste.vm.diariasPreenchimentoAutomatico);
    expect(wrapperTeste.vm.orcamento.itens[1].quantidadeDiarias).toBe(wrapperTeste.vm.diariasPreenchimentoAutomatico);
  });

  it('Não deve aplicar a quantidade de diárias padrão nos itens que tiverem diárias medidas acima desta quantidade e deve notificar.', () => {
    let locacao = new OrcamentoLocacaoModel({
      itens: [{
          categoria: CATEGORIAS_ITEM.EQUIPAMENTO,
          diariasJaMedidas: 8,
          quantidadeDiarias: 10
        },
        {
          categoria: CATEGORIAS_ITEM.SERVICO,
          diariasJaMedidas: 6,
          quantidadeDiarias: 7
        }
      ]
    });

    let wrapperTeste = mount(OrcamentoLocacao, {
      store,
      router
    });
    jest.spyOn(wrapperTeste.vm, 'notificarItensInalterados').mockImplementation(() => {});

    wrapperTeste.vm.orcamento = locacao;
    wrapperTeste.vm.diariasPreenchimentoAutomatico = 5;

    wrapperTeste.vm.aplicarQuantidadeDeDiariasPadrao();

    expect(locacao.itens[0].quantidadeDiarias).toBe(10);
    expect(locacao.itens[1].quantidadeDiarias).toBe(7);
    expect(wrapperTeste.vm.notificarItensInalterados).toHaveBeenCalledWith(expect.arrayContaining([
      locacao.itens[0],
      locacao.itens[1]
    ]), []);
  });

  it('Não deve aplicar a quantidade de diárias padrão nos itens que resultarem em valor negativo e deve notificar.', () => {
    let locacao = new OrcamentoLocacaoModel({
      itens: [{
          categoria: CATEGORIAS_ITEM.EQUIPAMENTO,
          quantidadeDiarias: 10,
          quantidade: 1,
          valorUnitario: 10,
          valorDesconto: 100
        },
        {
          categoria: CATEGORIAS_ITEM.SERVICO,
          quantidadeDiarias: 7,
          quantidade: 2,
          valorUnitario: 5,
          valorDesconto: 70
        }
      ]
    });

    let wrapperTeste = mount(OrcamentoLocacao, {
      store,
      router
    });
    jest.spyOn(wrapperTeste.vm, 'notificarItensInalterados').mockImplementation(() => {});

    wrapperTeste.vm.orcamento = locacao;
    wrapperTeste.vm.diariasPreenchimentoAutomatico = 1;

    wrapperTeste.vm.aplicarQuantidadeDeDiariasPadrao();

    expect(locacao.itens[0].quantidadeDiarias).toBe(10);
    expect(locacao.itens[1].quantidadeDiarias).toBe(7);
    expect(wrapperTeste.vm.notificarItensInalterados).toHaveBeenCalledWith(
      [],
      expect.arrayContaining([
        locacao.itens[0],
        locacao.itens[1]
      ])
    );
  });

  it('Deve notificar quais itens tiveram as diárias inalteradas.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
    let wrapperTeste = mount(OrcamentoLocacao, {
      mocks: {
        $mensagemFlutuante: {
          aviso: metodoMensagemFlutuante
        }
      },
      store,
      router,
      propsData: {
        orcamento: new OrcamentoLocacaoModel()
      }
    });

    let listaJaMedidos = [{
        diariasJaMedidas: 10,
        produto: {
          codigoNome: "001 - produto1"
        }
      },
      {
        diariasJaMedidas: 6,
        produto: {
          codigoNome: "002 - produto2produto2produto2produto2"
        }
      }
    ];
    let listaNegativados = [
      {
        quantidadeDiarias: 10,
        quantidade: 1,
        valorUnitario: 10,
        valorDesconto: 100,
        produto: {
          codigoNome: "003 - produto2"
        }
      }
    ];

    wrapperTeste.vm.notificarItensInalterados(listaJaMedidos, []);

    let regexJaMedido = `/(\\D*já foram medidos\\D*${listaJaMedidos[0].produto.codigoNome} - ${listaJaMedidos[0].diariasJaMedidas}\\D*)\\n`;
    regexJaMedido += `(\\D*${listaJaMedidos[1].produto.codigoNome.substring(0, 32)}... - ${listaJaMedidos[1].diariasJaMedidas}\\D*)/g`;
    let regexNegativado = `/(\\D*resultaria em valor negativo\\D*)\\n(\\D*${listaNegativados[0].produto.codigoNome}\\D*)/g`;

    wrapperTeste.vm.$nextTick(() => {
      expect(metodoMensagemFlutuante).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: "Itens com diárias inalteradas",
          mensagem: expect.stringMatching(regexJaMedido)
        })
      );

      wrapperTeste.vm.$nextTick(() => {
        expect(metodoMensagemFlutuante).toHaveBeenCalledWith(
          expect.objectContaining({
            titulo: "Itens com diárias inalteradas",
            mensagem: expect.stringMatching(regexNegativado)
          })
        );
      });
    });
  });

  it('Deve registrar o uso ao validar a locação sendo ajustada.', async () => {
    const routerAjustarLocacao = new VueRouter({ routes: routes.paths,  mode: 'history' });

    routerAjustarLocacao.push({
      name: ROTAS_FATURAMENTO_METADATA.ajustarLocacao.name,
      params: { idOrcamento: 1 }
    });

    let wrapperTeste = mount(OrcamentoLocacao, {
      store,
      router: routerAjustarLocacao,
      propsData: {
        orcamento: new OrcamentoLocacaoModel()
      }
    });

    jest.spyOn(wrapperTeste.vm, 'registrarUso').mockImplementation(() => Promise.resolve());
    jest.spyOn(wrapperTeste.vm, 'validarAcessibilidadeAjustarLocacao').mockImplementation(() => {});
    await wrapperTeste.vm.validarAcessibilidadeDasRotas();

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.registrarUso).toHaveBeenCalledWith(1, wrapperTeste.vm.entidadesRegistroEmUso.ORCAMENTO);
    });
  });
});