'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import GeracaoDePropostaDeLocacao from '@/components/faturamento/controle-de-locacao/proposta/GeracaoDePropostaDeLocacao';
import apiProposta  from '@/api/faturamento/controle-de-locacao/proposta-locacao-api.js';
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import modelosDePropostaFake from '../../../../fakes/faturamento/proposta/modelos-de-proposta-fake.json';
import variaveisModeloPropostaLocacaoFake from '../../../../fakes/faturamento/proposta/variaveis-modelo-proposta-locacao.json';
import PessoaModel from '@/models/geral/pessoa/pessoa-model.js';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import ModeloPropostaLocacaoModel from '@/models/faturamento/proposta-locacao/modelo-proposta-model.js';
import PropostaLocacaoModel from '@/models/faturamento/proposta-locacao/proposta-locacao-model.js';
import apiEndereco from '@/api/sistemas-gerais/endereco-api';
import orcamentoDetalhes from '../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';

import apiHistoricoOrcamento from '@/api/faturamento/controle-de-locacao/historico-orcamento-api';
import HistoricoLocacaoModel from '@/models/faturamento/orcamento-locacao/historico-locacao/historico-locacao-model';

describe('GeracaoDePropostaDeLocacao.vue', () => {
  jest.spyOn(apiEndereco, 'localizarEnderecos')
  .mockImplementation(() =>Promise.resolve([]));

  let wrapper;
  sync(store, router);

  let cliente = new PessoaModel({identificador:'123456', codigo:'0001', CPFouCNPJ: '123456778987'});
  let orcamentoLocacao = new OrcamentoLocacaoModel({identificador: '123456', codigo:'00002', descricao:'teste',dataReferencia:'01/01/2000', totalOrcamento: 50, cliente: cliente})

  let mock = jest.spyOn(apiProposta, 'obterModeloDePropostaPorIdentificador')
  .mockImplementation(() => Promise.resolve(modelosDePropostaFake));

  let spyObterVariaveisDoSistema = jest.spyOn(apiProposta, 'obterVariaveisDoSistema')
  .mockImplementation(() => Promise.resolve(variaveisModeloPropostaLocacaoFake));

  let mockCadastrarProposta = jest.spyOn(apiProposta, 'cadastrarProposta').mockImplementation(() => 
    Promise.resolve({identificador:"1", nome:"teste"}));

  jest.spyOn(apiProposta, 'obterModelosDePropostaSemTrazerConteudo')
  .mockImplementation(() => Promise.resolve({}));

  jest.spyOn(apiOrcamento, 'consultarDetalhesOrcamentoPorIdentificador')
      .mockImplementation(() => Promise.resolve([orcamentoLocacao]));

  beforeEach(() => {
    wrapper = mount(GeracaoDePropostaDeLocacao, {
      store,
      router,
      propsData: {}
    });

    wrapper.vm.$route.params.id = 1;

  });

  it('Deve validar as propriedades do Data', () => {
    expect(wrapper.vm.editorSomenteLeitura).toBe(true);
    expect(wrapper.vm.editandoPropostaExistente).toBe(false);
    expect(wrapper.vm.modeloSelecionado).toBe(false);
    expect(wrapper.vm.mostrarRodapeDeAcoes).toBe(true);
    expect(wrapper.vm.buscandoModelo).toBe(false);
    expect(wrapper.vm.modelo.constructor.name).toBe('ModeloPropostaLocacaoModel');
    expect(wrapper.vm.proposta.constructor.name).toBe('PropostaLocacaoModel');
  });

  it('Deve validar as propriedades computadas', () => {
    wrapper.vm.editorSomenteLeitura = false;
    expect(wrapper.vm.textoBotaoParaEditarOuSalvar).toBe('Salvar');
    wrapper.vm.editorSomenteLeitura = true;
    expect(wrapper.vm.textoBotaoParaEditarOuSalvar).toBe('Editar');

    wrapper.vm.editorSomenteLeitura = false;
    expect(wrapper.vm.iconeEditarOuSalvar).toBe('save');
    wrapper.vm.editorSomenteLeitura = true
    expect(wrapper.vm.iconeEditarOuSalvar).toBe('edit');

    expect(wrapper.vm.breadCrumbs[0].text).toBe(ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.title);
    expect(wrapper.vm.breadCrumbs[0].disabled).toBe(false);
    expect(wrapper.vm.breadCrumbs[0].to).toBe(ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name);

    wrapper.vm.editandoPropostaExistente = true;

    expect(wrapper.vm.breadCrumbs[1].text).toBe(ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao.title);
    expect(wrapper.vm.breadCrumbs[1].disabled).toBe(true);
    expect(wrapper.vm.breadCrumbs[1].to).toBe(ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao.name);

    wrapper.vm.editandoPropostaExistente = false;

    expect(wrapper.vm.breadCrumbs[1].text).toBe(ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.title);
    expect(wrapper.vm.breadCrumbs[1].disabled).toBe(true);
    expect(wrapper.vm.breadCrumbs[1].to).toBe(ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.name);
  });

  it('Deve retornar o conteúdo do modelo para o estado anterior se o componente estiver em modo de edição de proposta.', () => {
    wrapper.vm.editorSomenteLeitura = false;
    wrapper.vm.conteudoDoEditor = "Texto em edição";
    wrapper.vm.proposta.conteudo = "Texto do modelo";
    wrapper.vm.cancelarEdicaoDoConteudoDaProposta();

    expect(wrapper.vm.conteudoDoEditor).toBe('Texto do modelo');
  });

  it('Deve limpar o modelo e voltar para o estado atual se o componente não estiver em modo de edição de proposta.', (done) => {
    wrapper.vm.modoEdicaoProposta = false;
    wrapper.vm.conteudoDoEditor = "Texto do editor";
    wrapper.vm.limparModeloSeNaoInformado(undefined);
    wrapper.vm.$nextTick(()=>{
      try {
        expect(wrapper.vm.modelo.identificador).toBeUndefined();
        expect(wrapper.vm.modelo.nome).toBeUndefined();
        expect(wrapper.vm.modelo.descricao).toBeUndefined();
        expect(wrapper.vm.modelo.conteudo).toBeUndefined();
        done();
      }
      catch(err){done.fail(err)}
    });
  });

  it('Deve obter proposta quando passar o identificador do orçamento que tenha uma proposta.', async () => {
     mock.mockClear();
     jest.spyOn(apiProposta, 'obterProposta')
    .mockImplementation(() => Promise.resolve([new PropostaLocacaoModel({
          identificador: '1',
          identificadorOrcamento: '10',
          identificadorUsuario: '8',
          conteudo: 'Conteudo teste',
          conteudoPropostaModelo: 'Conteudo do modelo',
          modelo: new ModeloPropostaLocacaoModel({
            identificador: '2',
            nome: 'modelo teste',
            descricao: 'descricao teste',
            conteudo: 'conteudo teste'
          })
      })]
    ));
    await wrapper.vm.obterPropostaDoOrcamento(1);
    expect(wrapper.vm.proposta.identificador).toBe('1');
    expect(wrapper.vm.proposta.identificadorOrcamento).toBe('10');
  });

  it('Não deve obter porposta quando passar o identificador do orcamento que não tenha uma proposta', async () => {
    mock.mockClear();
    jest.spyOn(apiProposta, 'obterProposta')
    .mockImplementation(() => Promise.reject("Error"));
    
    wrapper.vm.proposta = new PessoaModel();

    await wrapper.vm.obterPropostaDoOrcamento(1);
    expect(wrapper.vm.proposta.identificador).toBeUndefined();
    expect(wrapper.vm.proposta.identificadorOrcamento).toBeUndefined();
  });

  it('Deve ajustar o layout para modo de edição de proposta', () => {
    wrapper.vm.editorSomenteLeitura = false;
    wrapper.vm.mostrarRodapeDeAcoes = false;
    wrapper.vm.ocultarBotaoCancelar = false;

    wrapper.vm.modoSomenteLeitura(true);

    expect(wrapper.vm.editorSomenteLeitura).toBe(true);
    expect(wrapper.vm.mostrarRodapeDeAcoes).toBe(true);
    expect(wrapper.vm.ocultarBotaoCancelar).toBe(true);
  });

  it('Deve ajustar o layout para modo de edição de conteúdo da proposta', () => {
    wrapper.vm.editorSomenteLeitura = true;
    wrapper.vm.mostrarRodapeDeAcoes = true;
    wrapper.vm.ocultarBotaoCancelar = true;

    wrapper.vm.modoSomenteLeitura(false);

    expect(wrapper.vm.editorSomenteLeitura).toBe(false);
    expect(wrapper.vm.mostrarRodapeDeAcoes).toBe(false);
    expect(wrapper.vm.ocultarBotaoCancelar).toBe(false);
  });

  it('Deve cancelar as alterações do layout da proposta', () => {
    wrapper.vm.modoEdicaoProposta = true;
    wrapper.vm.editorSomenteLeitura = false;
    wrapper.vm.mostrarRodapeDeAcoes = false;
    wrapper.vm.ocultarBotaoCancelar = false;

    wrapper.vm.cancelarEdicaoDoConteudoDaProposta();

    expect(wrapper.vm.editorSomenteLeitura).toBe(true);
    expect(wrapper.vm.mostrarRodapeDeAcoes).toBe(true);
    expect(wrapper.vm.ocultarBotaoCancelar).toBe(true);

    wrapper.vm.limparModeloSeNaoInformado(new ModeloPropostaLocacaoModel(1));
    wrapper.vm.obterModeloDePropostaPeloIdentificador(1);
  });

  it('Deve permitir edicao no conteudo da proposta quando o metodo editarConteudoDaProposta for chamado', async (done) => {
    wrapper.vm.editorSomenteLeitura = false;

    wrapper.vm.orcamento.cliente.codigo = "0005";
    wrapper.vm.orcamento.cliente.identificador = "1";

    wrapper.vm.conteudoDoEditor = `<h1><strong>Cliente:</strong></h1>\n<p>codigo: &nbsp;
    <span nome-variavel="@@Codigo_Cliente@@"</span></p>`;   

    spyObterVariaveisDoSistema.mockClear();
    jest.spyOn(wrapper.vm, 'obterConteudoDoModeloDePropostaComAsVariaveisSubstituidasPorValores')
    .mockImplementation(() => Promise.resolve(`<h1><strong>Cliente:</strong></h1>\n<p>codigo: &nbsp;0005</p>`));

    await wrapper.vm.editarConteudoDaProposta();
    wrapper.vm.$nextTick(()=>{
      try {
        expect(wrapper.vm.conteudoDoEditor).toMatch(/0005/);
        done();
      }
      catch(err){done.fail(err)}
    });
  });

  it('Deve substituir as variaveis na proposta quando o metodo obterConteudoDoModeloDePropostaComAsVariaveisSubstituidasPorValores for chamado', async () => {
    wrapper.vm.orcamento.cliente.codigo = "0005";
    let conteudoProposta = `<h1><strong>Cliente:</strong></h1>\n<p>codigo: &nbsp;
    <span nome-variavel="@@Codigo_Cliente@@"</span></p>`;   

    let conteudoAlterado = await wrapper.vm.obterConteudoDoModeloDePropostaComAsVariaveisSubstituidasPorValores(conteudoProposta, wrapper.vm.orcamento);
    expect(conteudoAlterado).toMatch(/0005/);
  });

  it('Não deve retornar o modelo substituido pelas variaveis quando editarConteudoDaProposta for chamado e ocorrer algum erro', async () => {
    wrapper.vm.editorSomenteLeitura = false;
    
    spyObterVariaveisDoSistema.mockClear();
    jest.spyOn(apiProposta, 'obterVariaveisDoSistema').mockImplementation(() => Promise.reject('Houve um erro na API'));

    await wrapper.vm.editarConteudoDaProposta();
    expect(wrapper.vm.conteudoDoEditor).toBe('');
  });

  it('Não deve editar o conteudo da proposta caso não esteja em modo de edicao de conteudo da proposta', () => {
    wrapper.vm.editorSomenteLeitura = true;
    wrapper.vm.proposta.conteudoPropostaModelo = "Teste 123";

    wrapper.vm.editarConteudoDaProposta();
    expect(wrapper.vm.conteudoDoEditor).toBe("Teste 123");
  });

  it('Não deve obter o conteudo do modelo quando passar um identificador invalido', () => {
    expect(wrapper.vm.conteudoDoEditor).toBe("");
    wrapper.vm.obterModeloDePropostaPeloIdentificador(undefined);
    expect(wrapper.vm.conteudoDoEditor).toBe("");
  });

  it('Não deve obter o conteudo do modelo quando ocorrer erro na requisicao', async () => {
    expect(wrapper.vm.conteudoDoEditor).toBe("");
    wrapper.vm.obterModeloDePropostaPeloIdentificador(1);
    mock.mockClear();
    jest.spyOn(apiProposta, 'obterModeloDePropostaPorIdentificador').mockImplementation(() => Promise.reject('Houve um erro na API'));
  
    await wrapper.vm.obterModeloDePropostaPeloIdentificador();
  
    expect(wrapper.vm.conteudoDoEditor).toBe("");
  });

  it('Não deve salvar proposta com o modelo invalido', async (done) => {
    wrapper.vm.modelo = new ModeloPropostaLocacaoModel();
    
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
    await wrapper.vm.salvar();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  });

  it('Deve salvar proposta com o modelo válido', async (done) => {
    wrapper.vm.modelo = new ModeloPropostaLocacaoModel({
      identificador:"1",
      nome:"Modelo de teste",
      descricao:"Descrição de teste",
      conteudo:"Conteudo de teste",
      tipoModelo:"Proposta"
    });

    wrapper.vm.modoEdicaoProposta = false;
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);
    await wrapper.vm.salvar();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  });

  it('Deve editar proposta com o modelo valido', async (done) => {

    mockCadastrarProposta.mockClear();
    jest.spyOn(apiProposta, 'editarProposta').mockImplementation(() => 
    Promise.resolve({identificador:"1", nome:"teste"}));

    wrapper.vm.modelo = new ModeloPropostaLocacaoModel({
      identificador:"1",
      nome:"Modelo de teste",
      descricao:"Descrição de teste",
      conteudo:"Conteudo de teste",
      tipoModelo:"Proposta"
    });

    wrapper.vm.modoEdicaoProposta = true;
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);
    await wrapper.vm.salvar();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });

  });

  it('Deve retornar erro na gravaçao e edição de proposta quando ocorrer erro na requisição', async (done) => {

    mockCadastrarProposta.mockClear();
    jest.spyOn(apiProposta, 'editarProposta').mockImplementation(() => 
    Promise.reject('Erro qualquer...'));

    wrapper.vm.modelo = new ModeloPropostaLocacaoModel({
      identificador:"1",
      nome:"Modelo de teste",
      descricao:"Descrição de teste",
      conteudo:"Conteudo de teste"
    });

    wrapper.vm.modoEdicaoProposta = true;
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
    await wrapper.vm.salvar();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  });

  it('Deve retornar para a tela de controle de orçamento', () => {
    jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
    wrapper.vm.retornarParaATelaDeControleDeOrcamento();
    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });

  it('Validar método cancelarProposta', () => {
    jest.spyOn(wrapper.vm.$router, "push").mockImplementation(() => {});
    wrapper.vm.cancelarProposta();
    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });

  it('Deve chamar o método visualizarProposta', () => {
    wrapper.vm.visualizarProposta();
  });

  it('Deve obter a proposta e habilitar o modo "somente leitura" da mesma ao resgatar o orçamento que já possua proposta.', () => {
    let orcamento = {
      cliente: {},
      dataReferencia: '2021-05-27T17:16:00',
      totalOrcamento: 100
    };

    let proposta = { modelo: {} };

    jest.spyOn(apiOrcamento, 'consultarDetalhesOrcamentoPorIdentificador').mockImplementation(() => Promise.resolve([orcamento]));
    jest.spyOn(apiProposta, 'obterProposta').mockImplementation(() => Promise.resolve([proposta]));
    wrapper.vm.editandoPropostaExistente = true;
    wrapper.vm.obterOrcamentoPeloIdentificador(1);

    expect(wrapper.vm.editorSomenteLeitura).toBe(true);
  });

  it('Deve obter os históricos do orcamento pelo identificador do orcamento.', async () => {
    let historicos = [
      new HistoricoLocacaoModel({identificador:1}),
      new HistoricoLocacaoModel({identificador:2})
    ];

    jest.spyOn(apiHistoricoOrcamento, 'obterHistoricosPeloIdendificadorDaLocacao').mockImplementation(() => Promise.resolve(historicos));
    
    expect(wrapper.vm.historicosOrcamento.length).toBe(0);
    await wrapper.vm.obterHistoricosDoOrcamento(1);
    expect(wrapper.vm.historicosOrcamento.length).toBe(2);
  });

  it('Não deve obter os históricos do orcamento pelo identificador do orcamento em caso de falha', async (done) => {

    jest.spyOn(apiHistoricoOrcamento, 'obterHistoricosPeloIdendificadorDaLocacao').mockImplementation(() => Promise.reject("Erro!"));
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);

    await wrapper.vm.obterHistoricosDoOrcamento(1);

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  
  });

  it('Deve gera aditivo pelo historico mais recente.', () => {
    let locacao = new OrcamentoLocacaoModel(orcamentoDetalhes);
    
    let historicos = [
      new HistoricoLocacaoModel({identificador:1, valorHistorico: new OrcamentoLocacaoModel(orcamentoDetalhes)}),
      new HistoricoLocacaoModel({identificador:2, valorHistorico: new OrcamentoLocacaoModel(orcamentoDetalhes)})
    ];

    expect(wrapper.vm.aditivoModel.identificadorHistoricoOrcamento).toBe(undefined);

    wrapper.vm.gerarAditivoPeloHistoricoMaisRecente(locacao, historicos);

    expect(wrapper.vm.aditivoModel.identificadorHistoricoOrcamento).toBe(2);
  });

  it('Deve alterar para modelo selecionado.', () => {
    let modelo = new ModeloPropostaLocacaoModel({identificador: 1, nome: "Teste", tipoModelo: "Proposta"});

    wrapper.vm.conteudoDoEditor = "Teste";

    wrapper.vm.alterarModeloSelecionado(modelo);
    expect(wrapper.vm.conteudoDoEditor).toBe("");
  });
});
