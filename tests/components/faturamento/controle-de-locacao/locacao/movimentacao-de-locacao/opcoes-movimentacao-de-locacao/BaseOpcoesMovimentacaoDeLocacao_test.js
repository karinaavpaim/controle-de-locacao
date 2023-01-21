import { mount } from '@vue/test-utils';
import BaseOpcoesMovimentacaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/BaseOpcoesMovimentacaoDeLocacao.vue';
import apiRequisicao from '@/api/estoque/requisicao-api';
import apiExpedicao from '@/api/estoque/expedicao-api';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';
import LocacaoCacheModel from '@/models/faturamento/orcamento-locacao/locacao-cache-model';
import apiLocacaoCache from "@/api/faturamento/controle-de-locacao/locacao-cache-api";
import RequisicaoModel from '@/models/estoque/requisicao/requisicao-model';
import ExpedicaoModel from '@/models/estoque/expedicao/expedicao-model';
import locacaoRequisicao from '../../../../../../fakes/faturamento/controle-de-locacao/locacao-requisicao.json';
import locacaoExpedicao from '../../../../../../fakes/faturamento/controle-de-locacao/locacao-expedicao.json';
import ImpressaoLocacao from "@/utils/locacao/impressao/impressao_locacao";
import DesmembramentoModel from "@/models/estoque/medicao/desmembramento-medicao-model";
import store from '@/store';

const listaLocacaoCache = [
  new LocacaoCacheModel({
    identificador:1,
    identificadorUsuario: "001",
    identificadorEntidade:"1",
    nomeEntidade: "MEDICAO",
    descricao: "Medição salva em rascunho",
    valor:'{"codigoLocacao":"001080","identificadorLocacao":"1102","dataReferencia":"2020-11-15T00:00:00.000","descricao":"Lore ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum","cliente":{"identificador":"00A000000K","nome":"MILPLAN ENGENHARIA S.A.","codigo":"000007","CPFouCNPJ":"15.063.096/0012-67","nomeCurto":"MILPLAN-PA"},"itens":[{"identificadorItemLocacao":"2569","categoria":"EQUIPAMENTO","dataInicialLocacao":"2020-11-16T00:00:00.000","dataFinalLocacao":"2020-11-27T00:00:00.000","quantidadeExpedida":0,"valorUnitario":25.8,"valorTotal":2580,"quantidadeDiarias":10,"quantidadePedida":10,"produto":{"identificador":"00A000000E","nome":"LINK TORQUE; TWH120N; SEXT. 100MM","codigo":"000010","codigoNome":"000010 - LINK TORQUE; TWH120N; SEXT. 100MM"},"desmembramentos":[]}]}'
    }),
  new LocacaoCacheModel({
    identificador:2,
    identificadorUsuario: "002",
    identificadorEntidade:"00002",
    nomeEntidade: "TESTE B",
    descricao: "TESTE B",
    valor:'{"codigoLocacao":"001080","identificadorLocacao":"1102","dataReferencia":"2020-11-15T00:00:00.000","descricao":"Lore ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum","cliente":{"identificador":"00A000000K","nome":"MILPLAN ENGENHARIA S.A.","codigo":"000007","CPFouCNPJ":"15.063.096/0012-67","nomeCurto":"MILPLAN-PA"},"itens":[{"identificadorItemLocacao":"2569","categoria":"EQUIPAMENTO","dataInicialLocacao":"2020-11-16T00:00:00.000","dataFinalLocacao":"2020-11-27T00:00:00.000","quantidadeExpedida":0,"valorUnitario":25.8,"valorTotal":2580,"quantidadeDiarias":10,"quantidadePedida":10,"produto":{"identificador":"00A000000E","nome":"LINK TORQUE; TWH120N; SEXT. 100MM","codigo":"000010","codigoNome":"000010 - LINK TORQUE; TWH120N; SEXT. 100MM"},"desmembramentos":[]}]}'
  })
];

describe('BaseOpcoesMovimentacaoDeLocacao.js', () => {
  let wrapper;

  const $router = {
    push(rt){return rt}
  }

  jest.spyOn(ImpressaoLocacao, 'imprimirRequisicao').mockImplementation((() => Promise.resolve({})));
  jest.spyOn(ImpressaoLocacao, 'imprimirExpedicao').mockImplementation((() => Promise.resolve({})));
  jest.spyOn(ImpressaoLocacao, 'imprimirMedicao').mockImplementation((() => Promise.resolve({})));

  jest.spyOn(apiRequisicao, 'obterRequisicoesPorIdLocacao')
      .mockImplementation(() => Promise.resolve(new RequisicaoModel(locacaoRequisicao)));

  var mockApiRequisicao = jest.spyOn(apiRequisicao, 'enviarDadosRequisicao')
      .mockImplementation(() => Promise.resolve([new RequisicaoModel(locacaoRequisicao)]));

  jest.spyOn(apiExpedicao, 'obterExpedicoes')
      .mockImplementation(() => Promise.resolve(new ExpedicaoModel(locacaoExpedicao)));

  const rota = Object.assign({params: {idOrcamento: 194}, push:()=>{}},ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao);

  beforeEach(() => {
    wrapper = mount(BaseOpcoesMovimentacaoDeLocacao, {
      store,
      mocks: {
        $route: rota,
        $router
      },
      propsData: {}
    });
  });


  describe("Ao inicializar o componente", () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.data).toBe('function');
      expect(wrapper.vm.carregando).toBe(false);
      expect(typeof wrapper.vm.desabilitarBotaoPrimario).toBe('boolean');
      expect(typeof wrapper.vm.identificadorProdutoPadraoBimer).toBe('undefined');
      expect(typeof wrapper.vm.entidadeAtual).toBe('object');
      expect(typeof wrapper.vm.graficoPizzaCabecalho).toBe('undefined');
      expect(typeof wrapper.vm.usuarioLogado).toBe('object');
      expect(typeof wrapper.vm.veioDeNotificacao).toBe('boolean');
      expect(typeof wrapper.vm.verificaSeHouveAlteracao).toBe('boolean');
      expect(typeof wrapper.vm.exibirOpcoesMenuBreadcrumb).toBe('boolean');
      expect(typeof wrapper.vm.contatoPrincipalCliente).toBe('object');
    });

    it('Deve verificar se todos métodos definidos nos objetos computed estão criados.', () => {
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.computed.breadCrumbs).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.computed.valorRealizadoGraficoCabecalho).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.computed.valorPendenteGraficoCabecalho).toBe('function');
    });

    it('Deve verificar se todos métodos definidos nos objetos methods estão criados.', () => {
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterDadosDaMedicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterContatoPrincipalCliente).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.montarGraficoPizzaCabecalho).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.configurarTrocaDeMedicaoPorRascunhoMedicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterRascunhoDaMedicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterLocacoesCachePeloIdentificadorLocacao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.excluirRascunho).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.excluirRascunhoEvoltarParaListagem).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.salvarRascunho).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.voltarParaMovimentacao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods._obterMetadadosPelaRota).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods._gerarRequisicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods._gerarExpedicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods._gerarMedicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.notificarSucessoRequisicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.enviarDados).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterDadosDoGraficoDoCabecalho).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterEntidadeAtualPeloIdentificadorDaLocacao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.existemDespesasPendentes).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.obterItensPendentes).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.estaSendoMedidoCompletamente).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.confirmarMedicao).toBe('function');
      expect(typeof BaseOpcoesMovimentacaoDeLocacao.methods.confirmarAlteracoes).toBe('function');
    });
  });

  describe("Construção - ", () => {
    it('Deve validar o filtro de data em formato iso.', () => {
      expect(wrapper.vm.$options.filters.data_br('2019-10-15')).toEqual('15/10/2019');
    });

    it('Deve obter a entidade atual pelo identificador da locação.', () => {
      wrapper.vm.obterEntidadeAtualPeloIdentificadorDaLocacao(194);
      expect(wrapper.vm.entidadeAtual).toStrictEqual({});
    });

    it('Deve registrar o uso antes de obter os dados pelo identificador.', () => {
      let wrapperTeste = mount(BaseOpcoesMovimentacaoDeLocacao, {
        store,
        mocks: {
          $route: rota,
          $router
        },
        propsData: {}
      });

      jest.spyOn(wrapperTeste.vm, 'registrarUso').mockImplementation(() => Promise.resolve());
      jest.spyOn(wrapperTeste.vm, 'carregarDados').mockImplementation(() => {});

      wrapperTeste.vm.obterEntidadeAtualPeloIdentificadorDaLocacao(1);

      expect(wrapperTeste.vm.carregarDados).not.toHaveBeenCalled();
      expect(wrapperTeste.vm.registrarUso).toHaveBeenCalledWith(1, wrapperTeste.vm.entidadesRegistroEmUso.ORCAMENTO);
      wrapperTeste.vm.$nextTick(() => {
        expect(wrapperTeste.vm.carregarDados).toHaveBeenCalledWith(1);
      });
    });

    it('Deve validar método voltarParaMovimentacao.', () => {
        jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
        wrapper.vm.voltarParaMovimentacao();
        expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });

    it('Deve gerar requisição quando o método privado _gerarRequisicao for chamado sem apresentar erros.', () => {
      wrapper.vm.entidadeAtual = new RequisicaoModel(locacaoRequisicao);
      wrapper.vm._gerarRequisicao();
      expect(apiRequisicao.enviarDadosRequisicao).toHaveBeenCalled();
    });

    it('Deve salvar os dados quando o metodo enviarDados for chamado.', async (done) => {
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);

      wrapper.vm.entidadeAtual = new RequisicaoModel(locacaoRequisicao);
      
      await wrapper.vm.enviarDados();
      wrapper.vm.$nextTick(() => {
        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
            done();
          }
          catch (err) { done.fail(err) }
        });
      });
    });

    it('Não deve salvar os dados quando o metodo enviarDados for chamado e ocorrer algum erro.', async (done) => {
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
      mockApiRequisicao.mockClear();

      jest.spyOn(apiRequisicao, 'enviarDadosRequisicao')
      .mockImplementation(() => Promise.reject(true));

      wrapper.vm.entidadeAtual = new RequisicaoModel(locacaoRequisicao);
      wrapper.vm.entidadeAtual.itens[0].quantidadeARequisitar = 9999;
      
      await wrapper.vm.enviarDados();
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve informar o sucesso da gravação mesmo quando a entidade atual não for requisição de material', async (done) => {
      const rotaAuxiliar = Object.assign({params: {idOrcamento: 194}, push:()=>{}}, ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao);
      let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
      var wrapperAuxiliar = mount(BaseOpcoesMovimentacaoDeLocacao, {
        store,
        mocks: {
          $route: rotaAuxiliar,
          $router,
          $mensagemFlutuante: {
            sucesso: metodoMensagemFlutuante
          }
        },
        propsData: {}
      });

      jest.spyOn(apiExpedicao, 'enviarDadosExpedicao').mockImplementation(() => Promise.resolve());

      wrapperAuxiliar.vm.entidadeAtual = new ExpedicaoModel(JSON.parse(JSON.stringify(new ExpedicaoModel(locacaoExpedicao))));
      wrapperAuxiliar.vm.entidadeAtual.itens[1].liberacoes[0].quantidadeAExpedir = 1;

      await wrapperAuxiliar.vm.enviarDados();
      wrapperAuxiliar.vm.$nextTick(() => {
        try {
          wrapperAuxiliar.vm.$nextTick(() => {
            expect(wrapperAuxiliar.vm.$mensagemFlutuante.sucesso).toHaveBeenCalledWith({"titulo": "Informações salvas com sucesso!"});
            done();
          });
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve retornar uma lista de erros quando o método privado _gerarRequisicao for chamado e apresentar erros.', async () => {
      wrapper.vm.entidadeAtual = new RequisicaoModel(locacaoRequisicao);
      wrapper.vm.entidadeAtual.itens[0].quantidadeARequisitar = 9999;
      
      await expect(wrapper.vm._gerarRequisicao()).rejects.toBe('O item código 000619 ultrapassa a quantidade máxima para requisição.');
    });

    it('Deve retornar uma lista de erros quando o método privado _gerarExpedicao for chamado e apresentar erros.', async () => {
      wrapper.vm.entidadeAtual = new ExpedicaoModel(JSON.parse(JSON.stringify(new ExpedicaoModel(locacaoExpedicao))));
      wrapper.vm.entidadeAtual.itens[0].liberacoes[0].quantidadeAExpedir = 0;
      wrapper.vm.entidadeAtual.itens[1].liberacoes[0].quantidadeAExpedir = 0;

      await expect(wrapper.vm._gerarExpedicao()).rejects.toBe('Os itens da expedição não possuem quantidade a expedir.');
    });

    it('Deve disparar mensagem para questionar o usuário se deseja continuar o rascunho.', async (done) => {
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);
      await wrapper.vm.configurarTrocaDeMedicaoPorRascunhoMedicao(listaLocacaoCache[0]);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve obter rascunho da medicao e configurar a troca de medição por rascunho.', async () => {

      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.resolve(listaLocacaoCache));
      jest.spyOn(wrapper.vm, 'configurarTrocaDeMedicaoPorRascunhoMedicao').mockImplementation(() => Promise.resolve(true));
      
      await wrapper.vm.obterRascunhoDaMedicao('001');
      expect(wrapper.vm.configurarTrocaDeMedicaoPorRascunhoMedicao).toHaveBeenCalled();
    });

    it('Deve disparar mensagem quando não for possível obter rascunho da medicao.', async (done) => {
      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockClear();
      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.reject(true));  
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
  
      await wrapper.vm.obterRascunhoDaMedicao('001');
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
    
    it('Deve obter as locacoesCache pelo identificador da locacao.', async (done) => {
      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockClear();
      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.resolve(listaLocacaoCache));  
      jest.spyOn(wrapper.vm, 'notificarQueRegistroJaEstaEmUso').mockImplementation(() => true);
  
      await wrapper.vm.obterLocacoesCachePeloIdentificadorLocacao('1');
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.notificarQueRegistroJaEstaEmUso).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
    
    it('Deve disparar mensagem quando não for possível obter as locacoesCache pelo identificador da locacao.', async (done) => {
      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockClear();
      jest.spyOn(apiLocacaoCache, 'obterLocacaoCache').mockImplementation(() => Promise.reject(true));  
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
  
      await wrapper.vm. obterLocacoesCachePeloIdentificadorLocacao('001');
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve ser possível excluir rascunho', async (done) => {
      jest.spyOn(apiLocacaoCache, 'deletarLocacaoCache').mockImplementation(() => Promise.resolve(true));  
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);
  
      await wrapper.vm.excluirRascunhoEvoltarParaListagem();
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve disparar mensagem quando não for possível excluir rascunho.', async (done) => {
      jest.spyOn(apiLocacaoCache, 'deletarLocacaoCache').mockImplementation(() => Promise.reject(true));  
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
  
      await wrapper.vm.excluirRascunhoEvoltarParaListagem();
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve retornar false, pois não existem despesas', () => {
      let medicao = {
        despesas: []
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeFalsy();
    });

    it('Deve retornar false, pois não existem desmembramentos', () => {
      let medicao = {
        despesas: [
          {
            desmembramentos: []
          }
        ]
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeFalsy();
    });

    it('Deve verificar se existem despesas pendentes, pois não está totalmente medido e quantidadeAMedir é inferior a quantidadeMaxima', () => {
      let medicao = {
        despesas: [
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  totalmenteMedido: false,
                  quantidadeAMedir: 2,
                  quantidadeMaxima: 5
                }
              )
            ]
          }
        ]
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeTruthy();
    });

    it('Deve verificar se não existem despesas pendentes, pois está totalmente medido e quantidadeAMedir é igual a quantidadeMaxima', () => {
      let medicao = {
        despesas: [
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  totalmenteMedido: true,
                  quantidadeAMedir: 5,
                  quantidadeMaxima: 5,
                  datasAMedir: ['2021-01-01']
                }
              )
            ]
          }
        ]
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeFalsy();
    });

    it('Deve retornar true pois existem despesas pendentes, já que datasAMedir e quantidadeAMedir não estão preenchidos', () => {
      let medicao = {
        despesas: [
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  datasAMedir: [],
                  quantidadeAMedir: 0,
                  quantidadeMaxima: 5
                }
              )
            ]
          }
        ]
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeTruthy();
    });

    it('Deve retornar false pois não existem despesas pendentes, já que datasAMedir e quantidadeAMedir estão preenchidos', () => {
      let medicao = {
        despesas: [
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  datasAMedir: ['2021-01-01'],
                  quantidadeAMedir: 5,
                  quantidadeMaxima: 5
                }
              )
            ]
          }
        ]
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeFalsy();
    });

    it('Deve retornar false porque existem despesas pendentes, já que quantidadeAMedir está zerada e datasAMedir está preenchida', () => {
      let medicao = {
        despesas: [
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  datasAMedir: ['2021-01-01'],
                  quantidadeAMedir: 5,
                  quantidadeMaxima: 5
                }
              )
            ]
          }
        ]
      };

      expect(wrapper.vm.existemDespesasPendentes(medicao)).toBeFalsy();
    });


    it('Deve retornar apenas itens que possuam algum desmembramento pendente', () => {
      let itemPendente = {
        desmembramentos: [
          new DesmembramentoModel(
            {
              totalmenteMedido: false
            }
          )
        ]
      };

      let medicao = {
        itens: [
          itemPendente,
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  totalmenteMedido: true
                }
              )
            ]
          }
        ]
      }

      expect(wrapper.vm.obterItensPendentes(medicao)).toEqual(expect.arrayContaining([itemPendente]));
    });

    it('Deve retornar array vazio, se não tiver nenhum item com desmembramento pendente', () => {
      let medicao = {
        itens: [
          {
            desmembramentos: [
              new DesmembramentoModel(
                {
                  totalmenteMedido: true
                }
              )
            ]
          }
        ]
      }

      expect(wrapper.vm.obterItensPendentes(medicao)).toEqual(expect.arrayContaining([]));
    });

    it('Deve identificar que está sendo totalmente medido', () => {
      let medicao = {
        itens: [
          {
            quantidadeDiarias: 2,
            desmembramentos: [
              new DesmembramentoModel(
                {
                  totalmenteMedido: false,
                  datasMedidas: [],
                  datasAMedir: ['2021-01-01', '2021-01-02'],
                  quantidadeAMedir: 10,
                  quantidadeMaxima: 10
                }
              )
            ]
          }
        ]
      };

      expect(wrapper.vm.estaSendoMedidoCompletamente(medicao)).toBeTruthy();
    });

    it('Deve identificar que não está sendo totalmente medido', () => {
      let medicao = {
        itens: [{
          quantidadeDiarias: 2,
          desmembramentos: [
            new DesmembramentoModel(
              {
                totalmenteMedido: false,
                datasMedidas: [],
                datasAMedir: ['2021-01-01', '2021-01-02'],
                quantidadeAMedir: 5,
                quantidadeMaxima: 10
              }
            )
          ]
        }]
      };

      expect(wrapper.vm.estaSendoMedidoCompletamente(medicao)).toBeFalsy();
    });

    it('Deve chamar o método confirmarRequisicao', () => {
      var metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
      var wrapperRequisicao = mount(BaseOpcoesMovimentacaoDeLocacao, {
        store,
        mocks: {
          $mensagemFlutuante: {
            confirmacao: metodoMensagemFlutuante
          },
          $route: rota,
          $router
        },
        propsData: {}
      });

      wrapperRequisicao.vm.confirmarRequisicao();

      wrapperRequisicao.vm.$nextTick(() => {
        expect(wrapperRequisicao.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
      });
    });

    it('Deve chamar o método confirmarExpedicao', () => {
      var metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
      var wrapperExpedicao = mount(BaseOpcoesMovimentacaoDeLocacao, {
        store,
        mocks: {
          $mensagemFlutuante: {
            confirmacao: metodoMensagemFlutuante
          },
          $route: rota,
          $router
        },
        propsData: {}
      });

      wrapperExpedicao.vm.confirmarExpedicao();

      wrapperExpedicao.vm.$nextTick(() => {
        expect(wrapperExpedicao.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
      });
    });

    it('Deve exibir uma mensagem flutuante quando existirem despesas pendentes e os itens estejam sendo medidos em sua totalidade', () => {
      var metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
      var wrapperMedicao = mount(BaseOpcoesMovimentacaoDeLocacao, {
        store,
        mocks: {
          $mensagemFlutuante: {
            confirmacao: metodoMensagemFlutuante
          },
          $route: rota,
          $router
        },
        propsData: {}
      });

      jest.spyOn(wrapperMedicao.vm, 'existemDespesasPendentes').mockImplementation(() => { return true });
      jest.spyOn(wrapperMedicao.vm, 'estaSendoMedidoCompletamente').mockImplementation(() => { return true });

      wrapperMedicao.vm.confirmarMedicao();

      wrapperMedicao.vm.$nextTick(() => {
        expect(wrapperMedicao.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
      });
    });

    it('Não deve exibir uma mensagem flutuante quando não existirem despesas pendentes ou os itens não estejam sendo medidos em sua totalidade', () => {
      var callback = jest.fn().mockImplementation(() => {});

      jest.spyOn(wrapper.vm, 'existemDespesasPendentes').mockImplementation(() => { return true });
      jest.spyOn(wrapper.vm, 'estaSendoMedidoCompletamente').mockImplementation(() => { return false });

      wrapper.vm.confirmarMedicao(callback);

      wrapper.vm.$nextTick(() => {
        expect(callback).toHaveBeenCalled();
      });
    });

    it('Não chamar o método de enviarDados quando estiver na rota de medição', () => {
      const rota = Object.assign({ params: { idOrcamento: 194 }, push: () => {}}, ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao);

      var wrapperTeste = mount(BaseOpcoesMovimentacaoDeLocacao, {
        store,
        mocks: {
          $route: rota,
          $router
        },
        propsData: {}
      });

      jest.spyOn(wrapperTeste.vm, 'enviarDados').mockImplementation(() => {});
      jest.spyOn(wrapperTeste.vm, 'confirmarMedicao').mockImplementation(() => {});

      wrapperTeste.vm.confirmarAlteracoes();

      wrapperTeste.vm.$nextTick(() => {
        expect(wrapperTeste.vm.enviarDados).not.toHaveBeenCalled();
        expect(wrapperTeste.vm.confirmarMedicao).toHaveBeenCalled();
      });
    });
  });
});