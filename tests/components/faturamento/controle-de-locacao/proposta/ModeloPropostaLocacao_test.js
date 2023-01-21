import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import ModeloPropostaLocacao from '@/components/faturamento/controle-de-locacao/proposta/ModeloPropostaLocacao.vue';
import apiProposta  from '@/api/faturamento/controle-de-locacao/proposta-locacao-api.js';
import axiosGraphql from '@/api/axios-config.js';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';

describe('ModeloPropostaLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  var mock = jest.spyOn(apiProposta, 'cadastrarModeloProposta')
  .mockImplementation(() => Promise.resolve({identificador:"1", nome:"teste"}));

  jest.spyOn(axiosGraphql, 'executarQueryGraphQL')
  .mockImplementation(() => Promise.resolve({}));

  jest.spyOn(axiosGraphql, 'executarMutationGraphQL')
  .mockImplementation(() => Promise.resolve({}));

  beforeEach(() => {
    wrapper = mount(ModeloPropostaLocacao, {
      store,
      router,
      propsData: {}
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.nomeValido).toEqual(true);
    expect(wrapper.vm.descricaoValida).toEqual(true);
    expect(wrapper.vm.nomeExcedeuLimite).toEqual(false);
    expect(wrapper.vm.propostaLocacao.nome).toEqual(undefined);
    expect(wrapper.vm.propostaLocacao.descricao).toEqual(undefined);
    expect(wrapper.vm.propostaLocacao.conteudo).toEqual("");
    expect(wrapper.vm.propostaLocacao.tipoModelo).toEqual(undefined);
  });

  it('Deve validar os campos quando o método "camposEstaoValidos" for chamado', () => {
    wrapper.vm.propostaLocacao.nome = "Proposta Proposta Proposta Proposta Proposta Proposta Proposta";

    wrapper.vm.camposEstaoValidos();
    wrapper.vm.obterTextoParaNomeInvalido();

    expect(wrapper.vm.nomeValido).toBe(false);
    expect(wrapper.vm.nomeExcedeuLimite).toBe(true);

    wrapper.vm.propostaLocacao.nome = "Nome da Proposta";
    wrapper.vm.nomeOriginalDoModeloEmCasoDeDuplicacao = "Nome da Proposta";
    wrapper.vm.nomeIgualAoOriginal = false;

    wrapper.vm.camposEstaoValidos();
    wrapper.vm.obterTextoParaNomeInvalido();

    expect(wrapper.vm.nomeValido).toBe(false);
    expect(wrapper.vm.nomeIgualAoOriginal).toBe(true);
  });

  it('Deve retornar false se os campos obrigatórios não estiverem preenchidos para salvar modelo', () => {
    expect(wrapper.vm.camposEstaoValidos()).toBe(false);
    wrapper.vm.propostaLocacao.nome ="Nome da Proposta";
    expect(wrapper.vm.camposEstaoValidos()).toBe(true);
  });

  it('Deve retornar true se os campos obrigatórios estiverem preenchidos para salvar modelo', () => {
    wrapper.vm.propostaLocacao.nome = "Nome da Proposta";
    wrapper.vm.propostaLocacao.descricao = "Descrição da Proposta";
    expect(wrapper.vm.camposEstaoValidos()).toBe(true);
  });

  it('Deve limpar os campos quando o método "limparCampos" for chamado', () => {
    wrapper.vm.propostaLocacao.nome = "Nome da Proposta";
    wrapper.vm.propostaLocacao.descricao = "Descrição da Proposta";

    wrapper.vm.limparCampos();

    expect(wrapper.vm.propostaLocacao.nome.trim()).toBe("");
    expect(wrapper.vm.propostaLocacao.descricao.trim()).toBe("");
  });

  it('Deve cancelar a criação do modelo quando o método "cancelarModelo" for chamado', () => {
    wrapper.vm.cancelarModelo();
    expect(wrapper.vm.propostaLocacao.conteudo).toBe('');
  });

  it('Deve salvar modelo quando o método "salvarModelo" for chamado', async (done) => {
    wrapper.vm.propostaLocacao.nome = "Nome da Proposta";
    wrapper.vm.propostaLocacao.descricao = "Descrição da Proposta";
    wrapper.vm.propostaLocacao.tipoModelo = "Aditivo";
    wrapper.vm.propostaLocacao.conteudo = "Conteudo do modelo";

    mock.mockClear();
    jest.spyOn(apiProposta, 'cadastrarModeloProposta')
        .mockImplementation(() => Promise.resolve(true)); 

    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);
    await wrapper.vm.salvarModelo();

    wrapper.vm.$nextTick(() => {
      try {
        expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
        done();
      }
      catch (err) { done.fail(err) }
    });
  });
});

describe('ModeloPropostaLocacao.vue', () => {
  let wrapper;
  sync(store, router);

   var mock = jest.spyOn(apiProposta, 'obterModeloDePropostaPorIdentificador')
                  .mockImplementation(() => Promise.resolve(propostas)); 

  var propostas = [
    { identificador:"1", nome: "nome A", descricao: "descricao A", conteudo: "conteudo A", tipoModelo:"Proposta" },
    { identificador:"2", nome: "nome B", descricao: "descricao B", conteudo: "conteudo B", tipoModelo:"Aditivo" }
  ];

  beforeEach(() => {
    wrapper = mount(ModeloPropostaLocacao, {
      store,
      router,
      propsData: {}
    });

    wrapper.vm.$router.push({
      name: ROTAS_FATURAMENTO_METADATA.edicaoDeModeloPropostaLocacao.name,
      params: { idModelo: "1" }
    });
  });

  it('Deve validar o breadcrumb quando o componente for carregado por dentro da geração de proposta.', () => {
    wrapper.vm.cadastroDeModeloPeloControleDeModelosDeProposta = false;
    let breadCrumbs = wrapper.vm.obterItensParaBreadcrumb();

    expect(breadCrumbs[0]).toEqual({"disabled": false,"text": "Controle de orçamento","to": "ControleDeOrcamentoDeLocacao",});
    expect(breadCrumbs[1]).toEqual({"disabled": false,"text": "Gerar proposta","to": "GeracaoDePropostaDeLocacao","color": "#757575"});
  });

  it('Deve validar o breadcrumb quando o componente for carregado por dentro controle de modelos de proposta.', () => {
    wrapper.vm.cadastroDeModeloPeloControleDeModelosDeProposta = true;
    wrapper.vm.modoEdicao = true;
    let breadCrumbs = wrapper.vm.obterItensParaBreadcrumb();

    expect(breadCrumbs[0]).toEqual({"disabled": false,"text": "Modelos","to": "ControleDeModelosDeProposta",});
    expect(breadCrumbs[1]).toEqual({"disabled": true,"text": "Editar modelo","to": "EdicaoDeModeloPropostaLocacao","color": "#757575"});
  });

  it('Deve obter os modelos por identificador.', async () => {
    await wrapper.vm.carregarInformacoesDoModelo(true);
    expect(wrapper.vm.modoEdicao).toBe(true);
    expect(wrapper.vm.buscandoModelo).toBe(false);
  });

  it('Deve disparar mensagem informan do que não foi possível obter o modelo quando a API rejeitar a requisição.', async () => {
    mock.mockClear();
    jest.spyOn(apiProposta, 'obterModeloDePropostaPorIdentificador')
        .mockImplementation(() => Promise.reject("Houve um erro na API"));

    await wrapper.vm.carregarInformacoesDoModelo();
  });

  it('Deve salvar a edição do modelo quando o método salvarModelo for chamado e estiver em modoEdicao.', async (done) => {
    mock.mockClear();

    wrapper.vm.modoEdicao = true;
    wrapper.vm.propostaLocacao = Object.assign(wrapper.vm.propostaLocacao, propostas[0]);

    jest.spyOn(apiProposta, 'editarModeloProposta')
        .mockImplementation(() => Promise.resolve(true)); 

    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'sucesso').mockImplementation(() => true);
    await wrapper.vm.salvarModelo();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.sucesso).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  });

  it('Deve retornar mensagem de erro quando o método salvarModelo for chamado em modoEdicao e a API rejeitar a requisição', async (done) => {
    mock.mockClear();
    jest.spyOn(apiProposta, 'editarModeloProposta')
    .mockImplementation(() => Promise.reject("Falha na API"));

    wrapper.vm.modoEdicao = true;
    wrapper.vm.propostaLocacao = Object.assign(wrapper.vm.propostaLocacao, propostas[0]);
    wrapper.vm.propostaLocacao.nome = "Teste A";
    wrapper.vm.propostaLocacao.descricao = "Descricao do teste A";
    wrapper.vm.propostaLocacao.tipoModelo= "Proposta";
    
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
    await wrapper.vm.salvarModelo();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  });

  it('Não deve salvar modelo quando houver falha na API', async (done) => {
    wrapper.vm.propostaLocacao.nome = "Nome da Proposta";
    wrapper.vm.propostaLocacao.descricao = "Descrição da Proposta";
    wrapper.vm.propostaLocacao.tipoModelo = "Proposta";

    mock.mockClear();
    jest.spyOn(apiProposta, 'editarModeloProposta')
        .mockImplementation(() => Promise.reject("Houve um erro na API")); 

    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'erro').mockImplementation(() => true);
    await wrapper.vm.salvarModelo();

      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
          done();
        }
        catch (err) { done.fail(err) }
      });
  });
});