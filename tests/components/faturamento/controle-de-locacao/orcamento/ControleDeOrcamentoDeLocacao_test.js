'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import ControleDeOrcamentoDeLocacao from '@/components/faturamento/controle-de-locacao/orcamento/ControleDeOrcamentoDeLocacao';
import { FILTROS_PESQUISA, STATUS_ORCAMENTO_LOCACAO_LISTA, OPCOES_MENU, STATUS_ORCAMENTO_LOCACAO, COLUNAS_TABELA_ORCAMENTO_LOCACAO } from '@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js';
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants';
import { OPCOES_STORE_ACESSOS } from "@/store/modules/acessos";
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js'
import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api.js";
import impressaoUtils from '@/utils/impressao';
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import EmpresaModel from "@/models/geral/empresa-model";
import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";
import orcamentoDetalhes from '../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import FiltrosPesquisaOrcamentoModel from '@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model';

store.dispatch(OPCOES_STORE_ACESSOS.ACTIONS.ALTERAR_ACESSOS, Promise.resolve([
  {
    identificador: ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  },
  {
    identificador: ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  },
  {
    identificador: ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  },
  {
    identificador: ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao.acesso,
    tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
  }
]));

const OPCOES_ORCAMENTO = Object.assign({}, OPCOES_MENU);

describe('ControleDeOrcamentoDeLocacao.vue', () => {
  let mock = jest.spyOn(apiOrcamento, 'obterOrcamentos')
                 .mockImplementation(() => Promise.resolve({}));
  jest.spyOn(apiProposta, 'obterProposta').mockImplementation(() => Promise.resolve([{ conteudo: 'Teste' }]));
  let empresa = { empresaAtual: { nome: 'nome-da-empresa' } };

  let wrapper;
  sync(store, router);

  let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);

  beforeEach(() => {
    wrapper = mount(ControleDeOrcamentoDeLocacao, {
      store,
      router,
      propsData: {},
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof ControleDeOrcamentoDeLocacao.data).toBe('function');
      expect(wrapper.vm.breadCrumbs.length).toBe(1);
      expect(wrapper.vm.exibirFiltrosAvancados).toBe(false);
      expect(wrapper.vm.exibirFiltros).toBe(false);
      expect(wrapper.vm.paginacao.sortBy).toBe('codigo');
      expect(wrapper.vm.paginacao.descending).toBe(true);
      expect(typeof wrapper.vm.filtrosPesquisaOrcamento).toBe('object');
      expect(wrapper.vm.filtrosPesquisaOrcamento.constructor.name).toBe('FiltrosPesquisaOrcamentoModel');
      expect(wrapper.vm.pesquisa).toEqual('');
      expect(wrapper.vm.orcamentosDeLocacao).toEqual([]);
      expect(wrapper.vm.colunasTabelaOrcamentoLocacao).toEqual(COLUNAS_TABELA_ORCAMENTO_LOCACAO);
      expect(wrapper.vm.statusParaFiltro).toEqual(STATUS_ORCAMENTO_LOCACAO_LISTA);
      expect(wrapper.vm.empresa).toBeUndefined();
    });
  });

  describe('Ações do componente.', () => {
    it('Deve validar o filtro de data em formato iso.', () => {
      expect(wrapper.vm.$options.filters.data_br('2019-10-15')).toEqual('15/10/2019');
    });

    it('Deve validar o filtro de dinheiro.', () => {
      expect(wrapper.vm.$options.filters.dinheiro('10')).toEqual('R$\xa010,00');
    });

    it('Deve emitir uma mensagem de erro ao tentar criar um novo orçamento sem informar a empresa.', async (done) => {
      wrapper.vm.empresa = undefined;
      
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
      await wrapper.vm.adicionarNovoOrcamento();
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve permitir criar um novo orçamento quando a empresa estiver definida.', () => {
      wrapper.vm.empresa = new EmpresaModel(empresa.empresaAtual);
      wrapper.vm.adicionarNovoOrcamento();
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name);
      });
    });

    it('Deve encaminhar para a página de edição informando o identificador ao tentar editar um orçamento.', () => {
      let orcamento = {
        identificador: 1
      };

      wrapper.vm.editarOrcamento(orcamento);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name);
        expect(wrapper.vm.$route.params).toEqual({ idOrcamento: orcamento.identificador });
      });
    });

    it('Deve retornar um status válido na lista ou o status padrão "AGUARDANDO".', () => {
      expect(wrapper.vm.retornarStatus(STATUS_ORCAMENTO_LOCACAO_LISTA[0].valor)).toEqual(STATUS_ORCAMENTO_LOCACAO_LISTA[0]);
      expect(wrapper.vm.retornarStatus('inexistente')).toEqual(STATUS_ORCAMENTO_LOCACAO.AGUARDANDO);
    });

    it('Deve consultar os orçamentos na API.', async () => {
      wrapper.vm.empresa = new EmpresaModel(empresa.empresaAtual);

      let orcamento = {
        identificador: '1',
        codigo: '333',
        cliente: {},
        status: STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor,
        dataEmissao: '2019-10-16',
        dataReferencia: '2019-10-16',
        dataInicioContrato: '2019-10-16',
        dataTerminoContrato: '2019-10-16',
        totalOrcamento: 100
      };

      jest.spyOn(apiOrcamento, 'obterOrcamentos')
          .mockImplementation(() => Promise.resolve([orcamento]));

      let listagemOrcamento = [
        {
          identificador: orcamento.identificador,
          codigo: orcamento.codigo,
          nomeCliente: '',
          nomeCurto: '',
          identificadorCliente: '',
          descricaoStatus: STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.descricao,
          CPFouCNPJ: '',
          classeStatus: STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.classeExibicao,
          valorStatus: STATUS_ORCAMENTO_LOCACAO.AGUARDANDO.valor,
          dataEmissaoIso: orcamento.dataEmissao.substring(0, 10),
          dataEmissaoFormatada: '16/10/2019',
          dataReferenciaIso: orcamento.dataReferencia.substring(0, 10),
          dataReferenciaFormatada: '16/10/2019',
          dataInicioContratoIso: orcamento.dataInicioContrato.substring(0, 10),
          dataInicioContratoFormatada: '16/10/2019',
          dataTerminoContratoIso: orcamento.dataTerminoContrato.substring(0, 10),
          dataTerminoContratoFormatada: '16/10/2019',
          totalValor: orcamento.totalOrcamento,
          totalFormatado: 'R$\xa0100,00'
        }
      ];

      wrapper.vm.carregando = false;
      await wrapper.vm.filtrarOrcamentosSalvandoFiltro(); // Aguarda as promessas finalizarem para preencher a lista a ser testada.
      expect(wrapper.vm.orcamentosDeLocacao).toEqual(expect.arrayContaining(listagemOrcamento));
    });

    it('Deve montar status do orçamento.', () => {
      let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.valorStatus = orcamento.status;
      expect(wrapper.vm.montarStatusOrcamento(orcamento).length).toEqual(2);
    });

    it('Deve retornar o status atual caso passe um status inexistente', () => {
      let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.valorStatus = "TESTE_TESTE";
      orcamento.status = "TESTE_TESTE"
      expect(wrapper.vm.montarStatusOrcamento(orcamento).length).toEqual(0);
    });

    it('Deve montar menu de opções do orçamento', () => {
      let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.valorStatus = orcamento.status;
      expect(wrapper.vm.montarMenuOpcoes(orcamento).length).toEqual(2);
    });

    it('Deve validar o método metodoDesabilitarBotaoEditar', () => {
      let orcamento = {
        status: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor
      };
      expect(wrapper.vm.metodoDesabilitarBotaoEditar(orcamento)).toBeFalsy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.PRONTO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoEditar(orcamento)).toBeFalsy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.REVISAO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoEditar(orcamento)).toBeFalsy();

      orcamento.status = STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor;
      expect(wrapper.vm.metodoDesabilitarBotaoEditar(orcamento)).toBeTruthy();
    });

    it('Deve obter as opções do status EM_DIGITACAO', () => {
      let resultado = wrapper.vm.desativarOpcaoCancelar({
        status: 'EM_DIGITACAO'
      }, OPCOES_ORCAMENTO);
      expect(resultado).toBeFalsy();
    });

    it('Deve cancelar a alteração de status', async (done) => {
      let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.valorStatus = orcamento.status;

      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'esconder').mockImplementation(() => true);

      await wrapper.vm.cancelarAlteracaoDeStatus({orcamento});
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.esconder).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });
    
    it('Deve chamar mensagem de confirmação para alteração dos status', async (done) => {
      let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.valorStatus = orcamento.status;
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);

      await wrapper.vm.alterarStatus("PRONTO", orcamento, orcamento.status);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve configurar a exclusão e o cancelamento do orçamento', async (done) => {
      let orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.valorStatus = orcamento.status;

      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);

      await wrapper.vm.configurarExclusaoOrcamento( orcamento);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });

      await wrapper.vm.configurarCancelamentoOrcamento(orcamento);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve remover os filtros por Grupo.', () => {     
      let componente = mount(ControleDeOrcamentoDeLocacao, {
        store,
        router,
        propsData: {},
      });
      
      componente.vm.filtrosPesquisaOrcamento.idCliente = '123456';
      componente.vm.filtrosPesquisaOrcamento.codigo = '0002';
      componente.vm.filtrosPesquisaOrcamento.buscarOrcamentos = true;
      componente.vm.filtrosPesquisaOrcamento.buscarLocacoes = false;

      
      let dados = new FiltrosPesquisaOrcamentoModel(componente.vm.filtrosPesquisaOrcamento);
      componente.vm.filtrosPesquisaOrcamento.dataEmissaoInicial = '05/08/2020';
      componente.vm.filtrosPesquisaOrcamento.dataEmissaoFinal = '05/08/2020';
      componente.vm.filtrosPesquisaOrcamento.listaDeStatus = ['AGUARDANDO'];

      componente.vm.removerFiltrosPorGrupo(componente.vm.filtrosPesquisaOrcamento, FILTROS_PESQUISA.STATUS);
      expect(componente.vm.filtrosPesquisaOrcamento.dataEmissaoInicial).toEqual('05/08/2020');
      expect(componente.vm.filtrosPesquisaOrcamento.dataEmissaoFinal).toEqual('05/08/2020');
      
      componente.vm.removerFiltrosPorGrupo(componente.vm.filtrosPesquisaOrcamento, FILTROS_PESQUISA.DATA_EMISSAO);
      expect(componente.vm.filtrosPesquisaOrcamento).toEqual(dados);
    });
  });

  describe('Ações do menu de opções do grid.', () => {
    it('Deve validar o método gerarProposta.', () => {
      let proposta = { identificador: 1 };
      wrapper.vm.gerarProposta(proposta);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.name);
      });
    });

    it('Deve validar o método duplicarOrcamento.', () => {
      wrapper.vm.duplicarOrcamento(orcamento);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name);
      });
    });

    it('Deve validar o método editarProposta.', () => {
      wrapper.vm.editarProposta(orcamento);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao.name);
        expect(wrapper.vm.$route.params.modoEdicaoProposta).toBe(true);
      });
    });

    it('Deve validar o método editarOrcamento.', () => {
      wrapper.vm.editarOrcamento(orcamento);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$route.name).toBe(ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name);
      });
    });

    // TODO: Teste comentados até resolver o problema de importação da mensagem flutuante.
    it('Deve validar o método cancelarOrcamento.', async (done) => {
      mock.mockClear();
      jest.spyOn(apiOrcamento, 'alterarStatusDoOrcamento').mockImplementation(() => Promise.resolve({ status: 'CANCELADO', identificador: 99 }));

      let orcamento = {
        identificador: 99,
        codigo: '00099',
        descricaoStatus: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.descricao,
        classeStatus: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.classeExibicao,
        valorStatus: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor
      };

      let esperado = {
        classeStatus: 'chip-exibicao-status-orcamento-em-digitacao',
        codigo: '00099',
        descricaoStatus: 'Em digitação',
        identificador: 99,
        valorStatus: 'EM_DIGITACAO',
      };

      wrapper.vm.orcamentosDeLocacao = [orcamento];
      await wrapper.vm.cancelarOrcamento(orcamento);

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.orcamentosDeLocacao[0]).toEqual(esperado);
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve validar o método excluirOrcamento.', () => {
      mock.mockClear();
      jest.spyOn(apiOrcamento, 'alterarStatusDoOrcamento').mockImplementation(() => Promise.resolve({ status: 'EXCLUIDO', identificador: 99 }));
      let orcamento = {
        identificador: 99,
        codigo: '00099',
        descricaoStatus: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.descricao,
        classeStatus: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.classeExibicao,
        valorStatus: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor
      };
      wrapper.vm.excluirOrcamento(orcamento);
      expect(wrapper.vm.orcamentosDeLocacao).toEqual([]);
    });

    it('Deve validar o erro no método alterarStatusDoOrcamento.', async (done) => {
      let textoErro = 'Erro teste abcd';
      let codigo = '00099';

      mock.mockClear();
      jest.spyOn(apiOrcamento, 'alterarStatusDoOrcamento').mockImplementation(() => Promise.reject({ statusText: textoErro }));
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => false);

      await wrapper.vm.cancelarOrcamento({ codigo: codigo });

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve imprimir proposta quando o método imprimirProposta for chamado e o orçamento tiver uma proposta.', async (done) => {
      mock.mockClear();
      jest.spyOn(apiProposta, 'obterProposta').mockImplementation(() => Promise.resolve([{ conteudo: 'Teste' }]));
      jest.spyOn(impressaoUtils, 'imprimir').mockImplementation(() =>true );
      
      await wrapper.vm.imprimirProposta(orcamento);
      wrapper.vm.$nextTick(() => {
        try {
          expect(impressaoUtils.imprimir).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) } 
      });
    });

    it('Deve retornar mensagem de falha quando proposta quando o método imprimirProposta for chamado e o orçamento não estiver uma proposta gravada.', async (done) => {
      mock.mockClear();
      jest.spyOn(apiProposta, 'obterProposta').mockImplementation(() => Promise.reject('Error :('));
    
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);

      await wrapper.vm.imprimirProposta(orcamento);

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Deve disparar mensagem para questionar o usuário se deseja excluir a proposta', async (done) => {
      jest.spyOn(wrapper.vm.$mensagemFlutuante, 'confirmacao').mockImplementation(() => true);
      await wrapper.vm.configurarExclusaoPropostaDoOrcamento(orcamento);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.confirmacao).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
    });

    it('Validar o método configurarExclusaoPropostaDoOrcamento', () => {
      jest.spyOn(apiOrcamento, 'deletarPropostaDoOrcamento')
          .mockImplementation(() => Promise.resolve(orcamento.identificador));

      let obj = {orcamento: { identificador: '99', status: 'APROVADO' }}
      wrapper.vm.excluirProposta(obj);

      expect(wrapper.vm.retornarStatus(STATUS_ORCAMENTO_LOCACAO_LISTA[0].valor)).toEqual(STATUS_ORCAMENTO_LOCACAO_LISTA[0]);
      expect(wrapper.vm.retornarStatus('inexistente')).toEqual(STATUS_ORCAMENTO_LOCACAO.AGUARDANDO);
    });

    it('Deve filtrar os orçamentos', async () => {
      wrapper.vm.empresa = {
        identificador: "000100",
      };

      wrapper.vm.filtrosPesquisaOrcamento = new FiltrosPesquisaOrcamentoModel({
        buscarOrcamentos: true,
        buscarLocacoes: false
      });

      jest.spyOn(apiOrcamento, 'obterOrcamentos')
          .mockImplementation(() => Promise.resolve([ orcamento ]));

      wrapper.vm.carregando = false;

      wrapper.vm.filtrarOrcamentosSalvandoFiltro();
      expect(wrapper.vm.filtrosPesquisaOrcamento.idEmpresa).toBe("000100");
      expect(wrapper.vm.filtrosPesquisaOrcamento.buscarOrcamentos).toBe(true);
      expect(wrapper.vm.filtrosPesquisaOrcamento.buscarLocacoes).toBe(false);
      expect(apiOrcamento.obterOrcamentos).toHaveBeenCalledWith(wrapper.vm.filtrosPesquisaOrcamento);
    });
  });
});