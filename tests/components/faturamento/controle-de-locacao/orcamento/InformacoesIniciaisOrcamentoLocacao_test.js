import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import InformacoesIniciaisOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/informacoes-iniciais/InformacoesIniciaisOrcamentoLocacao';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import AdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/adicional-personalizado-model';
import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import despesas from '../../../../fakes/faturamento/controle-de-locacao/despesas.json';
import DespesaModel from '@/models/faturamento/orcamento-locacao/despesa-model.js';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import PessoaDeContatoModel from '@/models/geral/pessoa/pessoa-de-contato-model';
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import VueRouter from 'vue-router';

describe('InformacoesIniciaisOrcamentoLocacao.vue', () => {
  let wrapper;

  sync(store, router);
  let itensAdicionais = [new ItemAdicionalPersonalizadoModel({
    identificador: '123456',
    aliquota: 10,
    descricao: 'porcentagem',
    atualizaDespesas: true,
    atualizaEquipamentos: true,
    atualizaMateriais: true,
    atualizaServicos: true,
    revisao: 1,
  })];

  let _adicionaisMock = [new AdicionalPersonalizadoModel({
    identificador: "123456",
    codigo: "00001",
    descricao: "Adicional X",
    itens: itensAdicionais
  })];

  beforeEach(() => {
    wrapper = mount(InformacoesIniciaisOrcamentoLocacao, {
      store,
      router,
      propsData: {
        orcamentoLocacao: new OrcamentoLocacaoModel()
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.adicionalPersonalizado).toBeUndefined();
    expect(wrapper.vm.adicionaisPersonalizados.length).toBe(0);
    expect(wrapper.vm.adicionalPersonalizadoSelecionado).toBeUndefined();
  });

  it('Deve verificar se todos métodos definidos nos objetos computed e watch estão criados.', () => {
    expect(typeof InformacoesIniciaisOrcamentoLocacao.watch.adicionalPersonalizadoSelecionado).toBe('function');
  });

  it('Deve verificar se todos métodos definidos nos objetos methods estão criados.', () => {
    expect(typeof InformacoesIniciaisOrcamentoLocacao.methods.periodoInvalido).toBe('function');
    expect(typeof InformacoesIniciaisOrcamentoLocacao.methods.preencherDataDeReferencia).toBe('function');
    expect(typeof InformacoesIniciaisOrcamentoLocacao.methods.dataAlterada).toBe('function');
    expect(typeof InformacoesIniciaisOrcamentoLocacao.methods.dataDoOrcamentoAlterada).toBe('function');
    expect(typeof InformacoesIniciaisOrcamentoLocacao.methods.filtrarAdicionaisPersonalizados).toBe('function');
    expect(typeof InformacoesIniciaisOrcamentoLocacao.methods.atualizarAdicionalNoOrcamento).toBe('function');
  });

  it('Deve validar o método periodoInvalido', () => {
    wrapper.vm.orcamentoLocacao.dataInicioContrato = '2020-01-01';
    wrapper.vm.orcamentoLocacao.dataTerminoContrato = '2020-01-02';
    wrapper.vm.periodoInvalido();

    expect(wrapper.vm.orcamentoLocacao.dataInicioContrato < wrapper.vm.orcamentoLocacao.dataTerminoContrato).toBeTruthy();

    wrapper.vm.orcamentoLocacao.dataInicioContrato = '';
    wrapper.vm.orcamentoLocacao.dataTerminoContrato = '';
    wrapper.vm.periodoInvalido();

    expect(wrapper.vm.periodoInvalido()).toBeFalsy();
  });

  it('Deve validar o método preencherDataDeReferencia.', () => {
    let dataDeHoje = '2021-01-01';
    wrapper.vm.orcamentoLocacao.dataReferencia = '2021-01-01';
    wrapper.vm.preencherDataDeReferencia();
    expect(ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name).toBe("NovoOrcamentoDeLocacao");
    expect(wrapper.vm.orcamentoLocacao.dataReferencia).toBe(dataDeHoje);
  });

  it('Deve validar o método dataAlterada.', () => {
    let tipoData = wrapper.vm.TIPO_DATA.REFERENCIA;
    wrapper.vm.orcamentoLocacao.dataReferencia = '2020-01-01';

    wrapper.vm.dataAlterada(tipoData);
    expect(wrapper.vm.mensagemDeErroDataReferencia).toBe("");

    wrapper.vm.orcamentoLocacao.dataReferencia = '';

    wrapper.vm.dataAlterada(tipoData);
    expect(wrapper.vm.mensagemDeErroDataReferencia).toBe("Obrigatório");
  });

  it('Deve obter com sucesso os Adicionais personalizados', async () => {
    jest.spyOn(apiOrcamento, 'obterAdicionaisPersonalizados')
      .mockImplementation(() => Promise.resolve([_adicionaisMock]));

    expect(wrapper.vm.adicionaisPersonalizados.length).toBe(0);
    await wrapper.vm.filtrarAdicionaisPersonalizados();
    expect(wrapper.vm.adicionaisPersonalizados.length).toBe(1);
  });

  it('Não deve obter com sucesso os Adicionais personalizados', async () => {
    jest.spyOn(apiOrcamento, 'obterAdicionaisPersonalizados')
      .mockImplementation(() => Promise.reject('Deu ruim :('));

    await wrapper.vm.filtrarAdicionaisPersonalizados();
    expect(wrapper.vm.adicionaisPersonalizados.length).toBe(0);
  });

  it('Deve obter com sucesso os itens dos adicionais personalizados', async () => {
    wrapper.vm.orcamentoLocacao.adicionalPersonalizado = _adicionaisMock[0];

    jest.spyOn(apiOrcamento, 'obterItensDosAdicionaisPersonalizados')
      .mockImplementation(() => Promise.resolve(_adicionaisMock));

    await wrapper.vm.atualizarAdicionalNoOrcamento(_adicionaisMock);
    expect(wrapper.vm.orcamentoLocacao.adicionalPersonalizado.itens).toEqual(_adicionaisMock[0].itens);
  });

  it('Não obtém os adicionais personalizados por falha na API', async () => {
    wrapper.vm.orcamentoLocacao.adicionalPersonalizado = [];

    jest.spyOn(apiOrcamento, 'obterItensDosAdicionaisPersonalizados')
      .mockImplementation(() => Promise.reject('Deu ruim :('));

    await wrapper.vm.atualizarAdicionalNoOrcamento(_adicionaisMock);
    expect(wrapper.vm.orcamentoLocacao.adicionalPersonalizado.itens).toEqual(undefined);
  });

  it('Deve calcular Adicionais personalizados mesmo que não tenha um adicional informado', async () => {
    var despesa = despesas[0];
    despesa.valorAdicionalPersonalizado = 10;
    wrapper.vm.orcamentoLocacao.despesas = [new DespesaModel(despesa)];
    let orcamento = new OrcamentoLocacaoModel(wrapper.vm.orcamentoLocacao);

    expect(wrapper.vm.orcamentoLocacao.despesas[0].valorAdicionalPersonalizado).toEqual(10);
    orcamento.adicionalPersonalizado = _adicionaisMock[0];

    wrapper.setProps({
      orcamentoLocacao: orcamento
    });

    orcamento.adicionalPersonalizado = undefined;
    expect(wrapper.vm.orcamentoLocacao.despesas[0].valorAdicionalPersonalizado).toEqual(0);
  });

  it('Deve atualizar o adicional quando o mesmo for passado por props', async () => {
    var despesa = despesas[0];
    despesa.valorAdicionalPersonalizado = 20;

    let orcamento = new OrcamentoLocacaoModel(wrapper.vm.orcamentoLocacao);

    orcamento.adicionalPersonalizado = _adicionaisMock[0];
    orcamento.despesas = [new DespesaModel(despesa)];

    wrapper.setProps({
      orcamentoLocacao: orcamento
    });

    expect(wrapper.vm.orcamentoLocacao.despesas[0].valorAdicionalPersonalizado).toEqual(20);
  });

  describe('Regras de validação', () => {
    describe('emailRules', () => {
      it('Deve validar o e-mail.', () => {
        expect(wrapper.vm.$data.emailRules[0]('')).toBeTruthy();
        expect(wrapper.vm.$data.emailRules[0]('emaildocontato@teste.com')).toBeTruthy();
      });

      it('Deve recusar o e-mail.', () => {
        expect(wrapper.vm.$data.emailRules[0]('emaildocontato')).toBe('E-mail deve ser válido');
      });
    })

    describe('telefonelRules', () => {
      it('Deve validar o telefone.', () => {
        expect(wrapper.vm.$data.telefoneRules[0]('')).toBeTruthy();
        expect(wrapper.vm.$data.telefoneRules[0]('(21) 2121-2233')).toBeTruthy();
      });

      it('Deve recusar o telefone.', () => {
        expect(wrapper.vm.$data.telefoneRules[0]('2121')).toBe('Telefone deve ser válido');
      });
    })
  });

  describe("dataDoOrcamentoAlterada - ", () => {
    it("Deve ter a propriedade de tipoData vinda do componente", () => {
      expect(wrapper.vm.TIPO_DATA).toBeDefined();
    })

    it("Deve perguntar se deve trocar as datas dos itens do orçamento (INICIO) e alterar em seguida", () => {
      let tipoData = wrapper.vm.TIPO_DATA.INICIO;
      let config;
      let spy = jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation((cfg) => {
        config = cfg
      });

      let orcamento = new OrcamentoLocacaoModel({
        itens: [new ItemOrcamentoLocacaoModel, new ItemOrcamentoLocacaoModel],
        dataInicioContrato: "12-12-2005"
      });

      wrapper.setProps({
        orcamentoLocacao: orcamento
      });
      wrapper.vm.dataDoOrcamentoAlterada(tipoData)

      expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
      expect(config.botaoPrimario.callback).toBeDefined();
      config.botaoPrimario.callback()
      wrapper.vm.orcamentoLocacao.itens.forEach((item) => {
        expect(item.dataInicialLocacao).toBe(orcamento.dataInicioContrato);
      })
      spy.mockClear()
    })

    it("Deve perguntar se deve trocar as datas dos itens do orçamento (fim) e alterar em seguida", () => {
      let tipoData = wrapper.vm.TIPO_DATA.FIM;
      let config;
      let spy = jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation((cfg) => {
        config = cfg
      });

      let orcamento = new OrcamentoLocacaoModel({
        itens: [new ItemOrcamentoLocacaoModel, new ItemOrcamentoLocacaoModel],
        dataTerminoContrato: "12-12-2005"
      });

      wrapper.setProps({
        orcamentoLocacao: orcamento
      });
      wrapper.vm.dataDoOrcamentoAlterada(tipoData)

      expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
      expect(config.botaoPrimario.callback).toBeDefined();
      config.botaoPrimario.callback()
      wrapper.vm.orcamentoLocacao.itens.forEach((item) => {
        expect(item.dataFinalLocacao).toBe(orcamento.dataTerminoContrato);
      })
      spy.mockClear()
    })

    it("Não deve fazer nada, pois não existem itens no orçamento", () => {
      let tipoData = wrapper.vm.TIPO_DATA.INICIO;
      let spy = jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => {});

      let orcamento = new OrcamentoLocacaoModel({
        dataInicioContrato: "12-12-2005"
      });
      wrapper.setProps({
        orcamentoLocacao: orcamento
      });
      wrapper.vm.dataDoOrcamentoAlterada(tipoData)

      expect(wrapper.vm.$mensagemFlutuante.confirmacao).not.toHaveBeenCalled();
      spy.mockClear()
    })

    it("Não deve fazer nada, pois a data sendo alterada esta indefinida", () => {
      let tipoData = wrapper.vm.TIPO_DATA.INICIO;
      let spy = jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => {});

      let orcamento = new OrcamentoLocacaoModel({
        itens: [new ItemOrcamentoLocacaoModel, new ItemOrcamentoLocacaoModel]
      });
      wrapper.setProps({
        orcamentoLocacao: orcamento
      });
      wrapper.vm.dataDoOrcamentoAlterada(tipoData)

      expect(wrapper.vm.$mensagemFlutuante.confirmacao).not.toHaveBeenCalled();
      spy.mockClear()
    })
  })

  describe('preencherPessoaDeContato', () => {

    let localVue = createLocalVue();
    let router = new VueRouter({
      routes: [
        ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao,
        ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao
      ]
    });

    let wrapperContato = shallowMount(InformacoesIniciaisOrcamentoLocacao, {
      localVue,
      router,
      propsData: {
        orcamentoLocacao: new OrcamentoLocacaoModel()
      }
    });

    async function _executarTestesDaPessoaDeContatoPorRota(rota, done) {
      router.push({
        name: rota
      });

      try {
        await wrapperContato.vm.$nextTick();

        wrapperContato.vm.orcamentoLocacao.cliente = new PessoaModel({
          enderecoPrincipal: {
            contatoPrincipal: new PessoaDeContatoModel({
              pessoaDeContato: 'Nome do contato',
              email: 'emaildocontato@teste.com',
              telefoneCelular: '(21) 99999-9999',
              telefoneFixo: '(21) 2222-3333'
            })
          }
        });

        wrapperContato.vm.preencherPessoaDeContato();

        expect(wrapperContato.vm.$route.name).toBe(rota);
        expect(wrapperContato.vm.orcamentoLocacao.nomePessoaDeContatoCliente).toEqual('Nome do contato');
        expect(wrapperContato.vm.orcamentoLocacao.emailPessoaDeContatoCliente).toEqual('emaildocontato@teste.com');
        expect(wrapperContato.vm.orcamentoLocacao.telefonePessoaDeContatoCliente).toEqual('(21) 2222-3333');

        wrapperContato.vm.orcamentoLocacao.cliente.enderecoPrincipal.contatoPrincipal.telefoneFixo = undefined;
        wrapperContato.vm.preencherPessoaDeContato();
        expect(wrapperContato.vm.orcamentoLocacao.telefonePessoaDeContatoCliente).toEqual('(21) 99999-9999');

        done();
      } catch (e) {
        done.fail(e);
      }
    }

    it('Deve preencher os dados de pessoa de contato, caso tenha contato principal e esteja na rota de novo orçamento.', async (done) => {
      await _executarTestesDaPessoaDeContatoPorRota(ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name, done);
    });

    it('Deve preencher os dados de pessoa de contato, caso tenha contato principal e esteja na rota de editar orçamento.', async (done) => {
      await _executarTestesDaPessoaDeContatoPorRota(ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name, done);
    });

    it('Deve preencher os dados de pessoa de contato, caso tenha contato principal e esteja na rota de duplicar orçamento.', async (done) => {
      await _executarTestesDaPessoaDeContatoPorRota(ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.name, done);
    });
  });

  it('Deve remover os dados de pessoa de contato, caso não tenha cliente no orçamento.', () => {
    wrapper.vm.orcamentoLocacao.nomePessoaDeContatoCliente = 'Nome do contato';
    wrapper.vm.orcamentoLocacao.emailPessoaDeContatoCliente = 'emaildocontato@teste.com';
    wrapper.vm.orcamentoLocacao.telefonePessoaDeContatoCliente = '(21) 99999-9999';
    wrapper.vm.orcamentoLocacao.cliente = undefined;
    wrapper.vm.preencherPessoaDeContato();

    expect(wrapper.vm.orcamentoLocacao.nomePessoaDeContatoCliente).toEqual(undefined);
    expect(wrapper.vm.orcamentoLocacao.emailPessoaDeContatoCliente).toEqual(undefined);
    expect(wrapper.vm.orcamentoLocacao.telefonePessoaDeContatoCliente).toEqual(undefined);
  });

  it('Deve remover os dados de pessoa de contato, caso não tenha o enderecoPrincipal do cliente no orçamento.', () => {
    wrapper.vm.orcamentoLocacao.nomePessoaDeContatoCliente = 'Nome do contato';
    wrapper.vm.orcamentoLocacao.emailPessoaDeContatoCliente = 'emaildocontato@teste.com';
    wrapper.vm.orcamentoLocacao.telefonePessoaDeContatoCliente = '(21) 99999-9999';
    wrapper.vm.orcamentoLocacao.cliente = {
      enderecoPrincipal: undefined
    };
    wrapper.vm.preencherPessoaDeContato();

    expect(wrapper.vm.orcamentoLocacao.nomePessoaDeContatoCliente).toEqual(undefined);
    expect(wrapper.vm.orcamentoLocacao.emailPessoaDeContatoCliente).toEqual(undefined);
    expect(wrapper.vm.orcamentoLocacao.telefonePessoaDeContatoCliente).toEqual(undefined);
  });

  it('Deve remover os dados de pessoa de contato, caso não tenha o contatoPrincipal do enderecoPrincipal do cliente no orçamento.', () => {
    wrapper.vm.orcamentoLocacao.nomePessoaDeContatoCliente = 'Nome do contato';
    wrapper.vm.orcamentoLocacao.emailPessoaDeContatoCliente = 'emaildocontato@teste.com';
    wrapper.vm.orcamentoLocacao.telefonePessoaDeContatoCliente = '(21) 99999-9999';
    wrapper.vm.orcamentoLocacao.cliente = {
      enderecoPrincipal: {
        contatoPrincipal: undefined
      }
    };
    wrapper.vm.preencherPessoaDeContato();

    expect(wrapper.vm.orcamentoLocacao.nomePessoaDeContatoCliente).toEqual(undefined);
    expect(wrapper.vm.orcamentoLocacao.emailPessoaDeContatoCliente).toEqual(undefined);
    expect(wrapper.vm.orcamentoLocacao.telefonePessoaDeContatoCliente).toEqual(undefined);
  });
});