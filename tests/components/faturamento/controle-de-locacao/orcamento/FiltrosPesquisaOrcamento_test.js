import { mount } from '@vue/test-utils';
import FiltrosPesquisaOrcamento from '@/components/faturamento/controle-de-locacao/orcamento/filtros/FiltrosPesquisaOrcamento.vue';
import FiltrosPesquisaOrcamentoModel from "@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model";
import {
  TIPOS_DE_CONTRATO_LISTA,
  PERIODO_EMISSAO,
  PERIODO_EMISSAO_LISTA
} from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import pessoas from '../../../../fakes/sistemas-gerais/pessoa/pessoas.json';

describe('FiltrosPesquisaOrcamento.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FiltrosPesquisaOrcamento, {
      propsData: {
        periodoDeEmissao: undefined
      }
    });
  });

  describe('Construção - ', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof FiltrosPesquisaOrcamento.data).toBe('function');
      expect(wrapper.vm.codigo).toBeUndefined();
      expect(wrapper.vm.listaStatus).toEqual([]);
      expect(wrapper.vm.cliente).toBeUndefined();
      expect(wrapper.vm.dataEmissaoInicial).toBeUndefined();
      expect(wrapper.vm.dataEmissaoFinal).toBeUndefined();
      expect(wrapper.vm.tipoContrato).toBeUndefined();
      expect(wrapper.vm.dataReferencia).toBeUndefined();
      expect(wrapper.vm.dataInicioContrato).toBeUndefined();
      expect(wrapper.vm.dataTerminoContrato).toBeUndefined();
      expect(wrapper.vm.exibirFiltrosAvancados).toBe(false);
      expect(wrapper.vm.exibirDatasEmissaoPersonalizadas).toBe(false);
      expect(wrapper.vm.tiposDeContratoParaFiltro).toBe(TIPOS_DE_CONTRATO_LISTA);
      expect(wrapper.vm.periodoDeEmissaoLista).toBe(PERIODO_EMISSAO_LISTA);
      expect(wrapper.vm.periodoDeEmissaoOpcoes).toBe(PERIODO_EMISSAO);
      expect(wrapper.vm.periodoDeEmissaoSelecionado).toBeUndefined();
      expect(typeof wrapper.vm.timeZoneEmMilissegundos).toBe("number");
    });

    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().filtrosPesquisa.constructor.name).toBe("FiltrosPesquisaOrcamentoModel");
      expect(wrapper.props().periodoDeEmissao).toBeUndefined();
    });
  });

  describe('Ações - ', () => {
    it('Deve atribuir os metadados do cliente na variável cliente', () => {
      let componente = mount(FiltrosPesquisaOrcamento, {
        propsData: {}
      });

      wrapper.props().filtrosPesquisa.metadados.cliente = new FiltrosPesquisaOrcamentoModel({idEmpresa: 1});
      wrapper.vm.cliente = wrapper.props().filtrosPesquisa.metadados.cliente;
      componente.vm.updated = wrapper.props().filtrosPesquisa.metadados.cliente;
      expect(wrapper.vm.cliente).toBe(componente.vm.updated);
    });

    it('Deve validar o método limparPeriodoEmissao.', () => {
      wrapper.vm.limparPeriodoEmissao();
      expect(wrapper.vm.periodoDeEmissaoSelecionado).toBeUndefined();
      expect(wrapper.vm.filtrosPesquisa.metadados.periodoEmissao).toBeUndefined();
    });

    it('Deve Alterar os filtros de pesquisa ao informar o período de emissão.', () => {
      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toBeUndefined();
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toBeUndefined();

      wrapper.vm.periodoDeEmissao = PERIODO_EMISSAO.ESSA_SEMANA;
      wrapper.vm.onFiltrar();

      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toBeDefined();
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toBeDefined();
    });

    it('Deve limpar os filtros da pesquisa quando for solicitado.', () => {
      wrapper.vm.onLimpar();
      expect(wrapper.emitted().onLimpar[wrapper.emitted().onLimpar.length-1][0]).toEqual(new FiltrosPesquisaOrcamentoModel());
      expect(wrapper.props().filtrosPesquisa.buscarOrcamentos).toEqual(undefined);
      expect(wrapper.props().filtrosPesquisa.buscarLocacoes).toEqual(undefined);
      expect(wrapper.props().filtrosPesquisa.buscarLocacoesMovimentadas).toEqual(undefined);
    });

    it('Deve alterar a data de emissão inicial para três dias atrás e a final para hoje.', () => {
      wrapper.vm.periodoDeEmissaoSelecionado = PERIODO_EMISSAO.ULTIMOS_3_DIAS;

      var data = new Date();
      var dia = `${data.getDate()}`;
      var mes = `${data.getMonth() + 1}`;
      var dataEmissaoFinal = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T23:59:59`;

      data.setDate(data.getDate() - 3);
      dia = `${data.getDate()}`;
      mes = `${data.getMonth() + 1}`;
      var dataEmissaoInicial = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T00:00:00`;

      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toEqual(dataEmissaoFinal);
      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toEqual(dataEmissaoInicial);
    });

    it('Deve alterar a data de emissão inicial para o início desta semana e a final para hoje.', () => {
      wrapper.vm.periodoDeEmissaoSelecionado = PERIODO_EMISSAO.ESSA_SEMANA;

      var data = new Date();
      var dia = `${data.getDate()}`;
      var mes = `${data.getMonth() + 1}`;
      var dataEmissaoFinal = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T23:59:59`;

      data.setDate(data.getDate() - data.getDay());
      dia = `${data.getDate()}`;
      mes = `${data.getMonth() + 1}`;
      var dataEmissaoInicial = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T00:00:00`;

      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toEqual(dataEmissaoFinal);
      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toEqual(dataEmissaoInicial);
    });

    it('Deve alterar o período de emissão para uma semana atrás, iniciando no domingo e encerrando no sábado.', () => {
      wrapper.vm.periodoDeEmissaoSelecionado = PERIODO_EMISSAO.SEMANA_PASSADA;

      var data = new Date();
      data.setDate(data.getDate() - data.getDay() - 1);

      var dia = `${data.getDate()}`;
      var mes = `${data.getMonth() + 1}`;
      var dataEmissaoFinal = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T23:59:59`;

      data.setDate(data.getDate() - 6);
      dia = `${data.getDate()}`;
      mes = `${data.getMonth() + 1}`;
      var dataEmissaoInicial = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T00:00:00`;

      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toEqual(dataEmissaoFinal);
      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toEqual(dataEmissaoInicial);
    });

    it('Deve alterar a data de emissão inicial para o dia primeiro do mês atual e a final para hoje.', () => {
      wrapper.vm.periodoDeEmissaoSelecionado = PERIODO_EMISSAO.ESSE_MES;

      var data = new Date();
      var dia = `${data.getDate()}`;
      var mes = `${data.getMonth() + 1}`;
      var dataEmissaoFinal = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T23:59:59`;

      data.setDate(1);
      dia = `${data.getDate()}`;
      var dataEmissaoInicial = `${data.getFullYear()}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T00:00:00`;

      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toEqual(dataEmissaoFinal);
      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toEqual(dataEmissaoInicial);
    });

    it('Deve criticar quando a data de emissão final for menor que a data de emissão inicial.', () => {
      wrapper.vm.periodoDeEmissaoSelecionado = PERIODO_EMISSAO.SELECIONAR_DATA;
      wrapper.vm.filtrosPesquisa.dataEmissaoInicial = "2020-01-21";
      wrapper.vm.filtrosPesquisa.dataEmissaoFinal = "2020-01-01";
      wrapper.vm.onFiltrar();
      expect(wrapper.vm.validarDataEmissaoFinal()).toBe("Deve ser maior que a data inicial");
    });

    it('Deve criticar quando a data de referência final for menor que a data de referência inicial.', () => {
      wrapper.vm.filtrosPesquisa.dataInicialReferencia = "2020-01-21";
      wrapper.vm.filtrosPesquisa.dataFinalReferencia = "2020-01-01";
      wrapper.vm.onFiltrar();
      expect(wrapper.vm.validarDataReferenciaFinal()).toBe("Deve ser maior que a data inicial");
    });

    it('Deve criticar quando a data de contrato final for menor que a data de contrato inicial.', () => {
      wrapper.vm.filtrosPesquisa.dataInicioContrato = "2020-01-21";
      wrapper.vm.filtrosPesquisa.dataTerminoContrato = "2020-01-01";
      wrapper.vm.onFiltrar();
      expect(wrapper.vm.validarDataContratoFinal()).toBe("Deve ser maior que a data inicial");
    });

    it('Deve retornar se o período de emissão foi alterado', () => {
      wrapper.vm.periodoEmissaoAlterado();
      wrapper.vm.exibirDatasEmissaoPersonalizadas = false;
      expect(wrapper.props().filtrosPesquisa.dataEmissaoInicial).toEqual(undefined);
      expect(wrapper.props().filtrosPesquisa.dataEmissaoFinal).toEqual(undefined);
    });

    it('Deve retornar o cliente quando este for selecionado', () => {
      wrapper.vm.atribuirFiltroCliente(pessoas[0]);
      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.idCliente).toEqual(pessoas[0].identificador);

      wrapper.vm.atribuirFiltroCliente();
      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.idCliente).toBeUndefined();
      expect(wrapper.props().filtrosPesquisa.metadados.cliente).toBeUndefined();
    });

    it('Deve retornar o código do orçamento quando este for selecionado', () => {
      wrapper.vm.filtrosPesquisa.codigo = "123";
      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.codigo).toEqual("123");
    });

    it('Validar método periodoEmissaoAlterado', () => {
      let event = '2020-01-01';
      wrapper.vm.periodoEmissaoAlterado(event);
      expect(wrapper.props().filtrosPesquisa.metadados.periodoEmissao).toEqual(event);
    });

    it('Deve retornar as datas de referência quando estas forem selecionadas', () => {
      wrapper.vm.filtrosPesquisa.dataInicialReferencia = "2019-09-27T00:00:00";
      wrapper.vm.filtrosPesquisa.dataFinalReferencia = "2019-09-27T00:00:00";
      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.dataInicialReferencia).toEqual("2019-09-27T00:00:00");
      expect(wrapper.props().filtrosPesquisa.dataFinalReferencia).toEqual("2019-09-27T00:00:00");
    });

    it('Deve retornar o período de vigência do contrato quando este for selecionado', () => {
      wrapper.vm.filtrosPesquisa.dataInicioContrato = "2019-09-25T00:00:00";
      wrapper.vm.filtrosPesquisa.dataTerminoContrato = "2019-09-30T00:00:00";
      wrapper.vm.onFiltrar();
      expect(wrapper.props().filtrosPesquisa.dataInicioContrato).toEqual("2019-09-25T00:00:00");
      expect(wrapper.props().filtrosPesquisa.dataTerminoContrato).toEqual("2019-09-30T00:00:00");
    });
  });
});