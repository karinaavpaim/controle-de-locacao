'use strict';

import { mount } from '@vue/test-utils';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import SelecaoDocumentos from '@/components/estoque/controle-de-estoque/SelecaoDocumentos.vue';
import apiEmpresa from "@/api/sistemas-gerais/empresa-api";
import apiDocumentoControleEstoque from "@/api/estoque/controle-de-estoque/documento-controle-estoque-api";
import apiSelecaoDocumento from "@/api/estoque/controle-de-estoque/selecao-documento-api";
import { ROTAS_ESTOQUE_METADATA } from "@/constants/router/estoque-router-constants.js";

describe('SelecaoDocumentos.vue', () => {
  jest.spyOn(apiSelecaoDocumento, 'assinarNotificacoesSeparacao').mockImplementation(() => {});
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {}
    });
  });

  it('Deve validar o filtro de data em formato iso.', () => {
    expect(wrapper.vm.$options.filters.data_hora_br('2019-10-15')).toEqual('15/10/2019 00:00:00');
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.exibirFiltro).toBeTruthy();
  });

  it('Deve filtrar e exibir os documentos obtidos corretamente.', () => {
    let documento = {
      identificador: 1,
      tipo: 'REQUISICAO_MATERIAL'
    };

    jest.spyOn(apiDocumentoControleEstoque, 'obterCapasDosDocumentosControleEstoque').mockImplementation(() => Promise.resolve([documento]));

    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.empresa = {};
    wrapperTeste.vm.setorRequisitado = {};
    wrapperTeste.vm.dataReferenciaInicial = '2020-08-01';
    wrapperTeste.vm.dataReferenciaFinal = '2020-08-01';
    wrapperTeste.vm.exibirFiltro = true;
    wrapperTeste.vm.filtrarDocumentos();
    wrapperTeste.vm.$nextTick(() => {
      expect(apiDocumentoControleEstoque.obterCapasDosDocumentosControleEstoque).toHaveBeenCalled();
      expect(wrapperTeste.vm.exibirFiltro).toBeFalsy();
      expect(wrapperTeste.vm.documentosSeparacao[0].identificador).toBe(documento.identificador);
    });
  });

  it('Não deve filtrar os documentos quando o filtro não estiver válido.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.empresa = undefined;
    wrapperTeste.vm.setorRequisitado = undefined;
    wrapperTeste.vm.dataReferenciaInicial = undefined;
    wrapperTeste.vm.dataReferenciaFinal = undefined;
    wrapperTeste.vm.exibirFiltro = true;
    wrapperTeste.vm.filtrarDocumentos();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.exibirFiltro).toBeTruthy();
    });
  });

  it('Deve exibir uma mensagem se houver erro ao tentar obter os documentos.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(apiDocumentoControleEstoque, 'obterCapasDosDocumentosControleEstoque').mockImplementation(() => Promise.reject('algo-inválido'));
    jest.spyOn(wrapperTeste.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    wrapperTeste.vm.empresa = {};
    wrapperTeste.vm.setorRequisitado = {};
    wrapperTeste.vm.dataReferenciaInicial = '2020-08-01';
    wrapperTeste.vm.dataReferenciaFinal = '2020-08-01';
    wrapperTeste.vm.exibirFiltro = true;
    wrapperTeste.vm.filtrarDocumentos();
    wrapperTeste.vm.$nextTick(() => {
      expect(apiDocumentoControleEstoque.obterCapasDosDocumentosControleEstoque).toHaveBeenCalled();
      expect(wrapperTeste.vm.exibirFiltro).toBeTruthy();
      expect(wrapperTeste.vm.exibirMensagemErroFlutuante).toHaveBeenCalled();
    });
  });

  it('Deve ocultar os filtros e exibir os documentos se o setor requisitado já estiver no storage.', () => {
    let mockRestaurarFiltroDoStorage = jest.fn().mockImplementation(() => {});
    jest.spyOn(apiDocumentoControleEstoque, 'obterCapasDosDocumentosControleEstoque').mockImplementation(() => Promise.resolve());

    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      methods: {
        restaurarFiltroDoStorage: mockRestaurarFiltroDoStorage
      },
      data() {
        return {
          empresa: {},
          setorRequisitado: {},
          setores: [{}]
        }
      }
    });

    wrapperTeste.vm.$nextTick(() => {
      expect(mockRestaurarFiltroDoStorage).toHaveBeenCalled();
      expect(apiDocumentoControleEstoque.obterCapasDosDocumentosControleEstoque).toHaveBeenCalled();
      expect(wrapperTeste.vm.exibirFiltro).toBeFalsy();
    });
  });

  it('Deve carregar os setores da empresa quando esta for informada.', () => {
    let setores = [{},{}];
    jest.spyOn(apiEmpresa, 'localizarSetoresPorIdentificadorEmpresa').mockImplementation(() => Promise.resolve(setores));

    wrapper.vm.empresa = { identificador: 1 };
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.setores).toEqual(expect.arrayContaining(setores));
    });
  });

  it('Não deve carregar os setores quando a empresa não for informada.', () => {
    let setores = [{},{}];
    jest.spyOn(apiEmpresa, 'localizarSetoresPorIdentificadorEmpresa').mockImplementation(() => Promise.resolve(setores));

    wrapper.vm.empresa = 0;
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.setores).toEqual(expect.arrayContaining([]));
    });
  });

  it('Deve tentar redimensionar da tabela ao alterar a exibição do filtro.', () => {
    jest.spyOn(wrapper.vm, 'ajustarTamanhoDaTabela').mockImplementation(() => {});
    wrapper.vm.$options.watch.exibirFiltro.call(wrapper.vm, true);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.ajustarTamanhoDaTabela).toHaveBeenCalled();
    });
  });

  it('Deve tentar redimensionar da tabela ao alterar o tamanho da tela.', () => {
    jest.spyOn(wrapper.vm, 'ajustarTamanhoDaTabela').mockImplementation(() => {});
    wrapper.vm.$options.watch['$vuetify.breakpoint.mdAndUp'].call(wrapper.vm, true);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.ajustarTamanhoDaTabela).toHaveBeenCalled();
    });
  });

  it('Deve alterar a altura da tabela quando estiver com a aba de separação selecionada.', () => {
    let componente = {
      top: 10,
      getBoundingClientRect() {
        return this.top;
      }
    };

    jest.spyOn(document, 'querySelector').mockImplementation(() => componente);
    let altura = '10px';
    wrapper.vm.alturaTabela = altura;
    wrapper.vm.abaAtual = 'aba-separacao';
    wrapper.vm.ajustarTamanhoDaTabela();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.alturaTabela).not.toBe(altura);
    });
  });

  it('Deve alterar a altura da tabela quando estiver com a aba de conferência selecionada.', () => {
    let altura = '10px';
    wrapper.vm.alturaTabela = altura;
    wrapper.vm.abaAtual = 'aba-conferencia';
    wrapper.vm.ajustarTamanhoDaTabela();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.alturaTabela).not.toBe(altura);
    });
  });

  it('Deve validar o filtro quando todos os campos estiverem preenchidos.', () => {
    wrapper.vm.empresa = {};
    wrapper.vm.setorRequisitado = {};
    wrapper.vm.dataReferenciaInicial = '2020-09-01';
    wrapper.vm.dataReferenciaFinal = '2020-09-02';
    expect(wrapper.vm.validarFiltro()).toBeTruthy();
  });

  it('Deve criticar quando validar os filtros e a empresa não estiver preenchida.', () => {
    wrapper.vm.empresa = undefined;
    expect(wrapper.vm.validarFiltro()).toBeFalsy();
  });

  it('Deve criticar quando validar os filtros e o setor não estiver preenchido.', () => {
    wrapper.vm.empresa = {};
    wrapper.vm.setorRequisitado = undefined;
    expect(wrapper.vm.validarFiltro()).toBeFalsy();
  });

  it('Deve criticar quando validar os filtros e a data inicial não estiver preenchida.', () => {
    wrapper.vm.empresa = {};
    wrapper.vm.setorRequisitado = {};
    wrapper.vm.dataReferenciaInicial = undefined;
    expect(wrapper.vm.validarFiltro()).toBeFalsy();
  });

  it('Deve criticar quando validar os filtros e a data final não estiver preenchida.', () => {
    wrapper.vm.empresa = {};
    wrapper.vm.setorRequisitado = {};
    wrapper.vm.dataReferenciaInicial = '2020-09-01';
    wrapper.vm.dataReferenciaFinal = undefined;
    expect(wrapper.vm.validarFiltro()).toBeFalsy();
  });

  it('Deve exibir a mensagem flutuante.', () => {
    jest.spyOn(wrapper.vm.$mensagemFlutuante, 'aviso').mockImplementation(() => {});
    wrapper.vm.exibirMensagemErroFlutuante('Título', { statusText: 'mensagem de erro' });
    expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
  });

  it('Deve cancelar as assinaturas antes de sair da rota atual.', () => {
    let beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0];
    let metodoNext = jest.fn();
    let assinaturaNotificacoes = {
      unsubscribe: jest.fn()
    };

    wrapper.vm.assinaturaNotificacoes = undefined; // Chama uma vez com undefined para completar a cobertura (é um 'if' sem 'else').
    beforeRouteLeave.call(wrapper.vm, 'destino', 'origem', metodoNext);
    wrapper.vm.assinaturaNotificacoes = assinaturaNotificacoes;
    beforeRouteLeave.call(wrapper.vm, 'destino', 'origem', metodoNext);
    expect(metodoNext).toHaveBeenCalled();
    expect(assinaturaNotificacoes.unsubscribe).toHaveBeenCalled();
  });

  it('Deve atualizar a lista de documentos quando receber uma notificação para tal.', () => {
    let documentoDesatualizado = {
      identificador: 1,
      tipo: 'REQUISICAO_MATERIAL',
      status: 'PENDENTE'
    };

    let documentoAtualizado = {
      identificador: 1,
      tipo: 'REQUISICAO_MATERIAL',
      status: 'EM_SEPARACAO'
    };

    let notificacao = {
      selecaoDeDocumentosAtualizada: {
        documentos: [documentoAtualizado]
      }
    }

    wrapper.vm.documentosSeparacao = [documentoDesatualizado];
    expect(wrapper.vm.documentosSeparacao[0].status).toBe(documentoDesatualizado.status);
    wrapper.vm.separacaoAlterada(notificacao);
    expect(wrapper.vm.documentosSeparacao[0].status).toBe(documentoAtualizado.status);
  });

  it('Não deve atualizar os documentos quando receber uma notificação que não contenha uma seleção de documentos.', () => {
    let documentoDesatualizado = {
      identificador: 1,
      tipo: 'REQUISICAO_MATERIAL',
      status: 'PENDENTE'
    };

    let notificacao = {}

    wrapper.vm.documentosSeparacao = [documentoDesatualizado];
    expect(wrapper.vm.documentosSeparacao[0].status).toBe(documentoDesatualizado.status);
    wrapper.vm.separacaoAlterada(notificacao);
    expect(wrapper.vm.documentosSeparacao[0].status).toBe(documentoDesatualizado.status);
  });

  it('Deve filtrar os documentos de separação por tipo.', () => {
    wrapper.vm.filtrarRequisicaoMaterial = false;
    wrapper.vm.filtrarPedidoDeVenda = false;
    wrapper.vm.filtrarInventario = false;

    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('REQUISICAO_MATERIAL')).toBeTruthy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('PEDIDO_DE_VENDA')).toBeTruthy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('INVENTARIO')).toBeTruthy();

    wrapper.vm.filtrarRequisicaoMaterial = true;
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('REQUISICAO_MATERIAL')).toBeTruthy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('PEDIDO_DE_VENDA')).toBeFalsy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('INVENTARIO')).toBeFalsy();
    wrapper.vm.filtrarRequisicaoMaterial = false;

    wrapper.vm.filtrarPedidoDeVenda = true;
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('REQUISICAO_MATERIAL')).toBeFalsy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('PEDIDO_DE_VENDA')).toBeTruthy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('INVENTARIO')).toBeFalsy();
    wrapper.vm.filtrarPedidoDeVenda = false;

    wrapper.vm.filtrarInventario = true;
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('REQUISICAO_MATERIAL')).toBeFalsy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('PEDIDO_DE_VENDA')).toBeFalsy();
    expect(wrapper.vm.filtrarDocumentosSeparacaoPorTipo('INVENTARIO')).toBeTruthy();
    wrapper.vm.filtrarInventario = false;
  });

  it('Deve filtrar os documentos de conferência por tipo.', () => {
    wrapper.vm.filtrarRequisicaoMaterial = false;
    wrapper.vm.filtrarNotaFiscal = false;

    expect(wrapper.vm.filtrarDocumentosConferenciaPorTipo('REQUISICAO_MATERIAL')).toBeTruthy();
    expect(wrapper.vm.filtrarDocumentosConferenciaPorTipo('NOTA_FISCAL')).toBeTruthy();

    wrapper.vm.filtrarRequisicaoMaterial = true;
    expect(wrapper.vm.filtrarDocumentosConferenciaPorTipo('REQUISICAO_MATERIAL')).toBeTruthy();
    expect(wrapper.vm.filtrarDocumentosConferenciaPorTipo('NOTA_FISCAL')).toBeFalsy();
    wrapper.vm.filtrarRequisicaoMaterial = false;

    wrapper.vm.filtrarNotaFiscal = true;
    expect(wrapper.vm.filtrarDocumentosConferenciaPorTipo('REQUISICAO_MATERIAL')).toBeFalsy();
    expect(wrapper.vm.filtrarDocumentosConferenciaPorTipo('NOTA_FISCAL')).toBeTruthy();
    wrapper.vm.filtrarNotaFiscal = false;
  });

  it('Deve exibir uma mensagem caso não consiga carregar os setores da empresa.', () => {
    jest.spyOn(apiEmpresa, 'localizarSetoresPorIdentificadorEmpresa').mockImplementation(() => Promise.reject('erro'));
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    wrapper.vm.carregarSetoresDaEmpresa(1);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalled();
    });
  });

  it('Deve exibir uma mensagem de erro para separação quando esta for a aba selecionada.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    const titulo = 'Não foi possível iniciar a separação';
    const mensagem = 'erro teste';
    wrapper.vm.abaAtual = 'aba-separacao';
    wrapper.vm.informarErroAoGravar(mensagem);
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalledWith(titulo, mensagem);
  });

  it('Deve exibir uma mensagem de erro para conferência quando esta for a aba selecionada.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    const titulo = 'Não foi possível iniciar a conferência';
    const mensagem = 'erro teste';
    wrapper.vm.abaAtual = 'aba-conferencia';
    wrapper.vm.informarErroAoGravar(mensagem);
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalledWith(titulo, mensagem);
  });

  it('Deve exibir uma mensagem quando o documento selecionado já estiver em separação.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    const titulo = 'O documento selecionado já está em andamento.';
    wrapper.vm.abaAtual = 'aba-separacao';
    wrapper.vm.documentosSeparacaoSelecionados = [{}];
    wrapper.vm.criticarDocumentoEmAndamento();
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalledWith(titulo);
  });

  it('Deve exibir uma mensagem quando o documento selecionado já estiver em conferência.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    const titulo = 'O documento selecionado já está em andamento.';
    wrapper.vm.abaAtual = 'aba-conferencia';
    wrapper.vm.documentosConferenciaSelecionados = [{}];
    wrapper.vm.criticarDocumentoEmAndamento();
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalledWith(titulo);
  });

  it('Deve exibir uma mensagem quando algum dos documentos selecionados já estiver em separação.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    const titulo = 'Algum dos documentos selecionados já está em andamento.';
    wrapper.vm.abaAtual = 'aba-separacao';
    wrapper.vm.documentosSeparacaoSelecionados = [{},{}];
    wrapper.vm.criticarDocumentoEmAndamento();
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalledWith(titulo);
  });

  it('Deve exibir uma mensagem quando algum dos documentos selecionados já estiver em conferência.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});

    const titulo = 'Algum dos documentos selecionados já está em andamento.';
    wrapper.vm.abaAtual = 'aba-conferencia';
    wrapper.vm.documentosConferenciaSelecionados = [{},{}];
    wrapper.vm.criticarDocumentoEmAndamento();
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalledWith(titulo);
  });

  it('Deve exibir a mensagem de aviso, incluindo o título e extraindo o texto do erro corretamente.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        },
        $mensagemFlutuante: {
          aviso: metodoMensagemFlutuante
        }
      },
      store,
      router
    });

    var titulo = 'titulo teste';
    var erro = [{ statusText: 'mensagem teste'}];
    var parametro = {
      titulo: titulo,
      mensagem: erro[0].statusText
    };

    wrapperTeste.vm.exibirMensagemErroFlutuante(titulo, erro);

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.$mensagemFlutuante.aviso).toHaveBeenCalledWith(parametro);
    });
  });

  it('Deve redirecionar para a separação quando esta aba estiver selecionada.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(wrapperTeste.vm.$router, 'push').mockImplementation(() => {});

    var separacoes = [{ identificador: 1 }];
    var parametro = {
      name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueSeparacao.name,
      params: separacoes[0]
    };
    wrapperTeste.vm.abaAtual = 'aba-separacao';
    wrapperTeste.vm.redirecionarParaAcaoSolicitada(separacoes);

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.$router.push).toHaveBeenCalledWith(parametro);
    });
  });

  it('Deve redirecionar para a conferência quando esta aba estiver selecionada.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(wrapperTeste.vm.$router, 'push').mockImplementation(() => {});

    var conferencias = [];
    var parametro = {
      name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueConferencia.name,
      params: { identificador: undefined }
    };
    wrapperTeste.vm.abaAtual = 'aba-conferencia';
    wrapperTeste.vm.redirecionarParaAcaoSolicitada(conferencias);

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.$router.push).toHaveBeenCalledWith(parametro);
    });
  });

  it('Deve alternar a seleção de um documento de separação.', () => {
    let item = { identificador: 1 };
    var propriedades = { isSelected: false };
    wrapper.vm.abaAtual = 'aba-separacao';

    wrapper.vm.alternarSelecao(item, propriedades); // seleciona
    expect(wrapper.vm.documentosSeparacaoSelecionados[0].identificador).toBe(item.identificador);

    propriedades.isSelected = true;
    wrapper.vm.alternarSelecao(item, propriedades); // remove seleção
    expect(wrapper.vm.documentosSeparacaoSelecionados[0]).toBeUndefined();
  });

  it('Deve alternar a seleção de um documento de conferência.', () => {
    let item = { identificador: 1 };
    var propriedades = { isSelected: false };
    wrapper.vm.abaAtual = 'aba-conferencia';

    wrapper.vm.alternarSelecao(item, propriedades); // seleciona
    expect(wrapper.vm.documentosConferenciaSelecionados[0].identificador).toBe(item.identificador);

    propriedades.isSelected = true;
    wrapper.vm.alternarSelecao(item, propriedades); // remove seleção
    expect(wrapper.vm.documentosConferenciaSelecionados[0]).toBeUndefined();
  });

  it('Deve selecionar todos os documentos de separação visíveis.', () => {
    let documento = { identificador: 1 };
    wrapper.vm.documentosSeparacaoVisiveis = [documento];
    wrapper.vm.abaAtual = 'aba-separacao';

    wrapper.vm.selecionarTodos();
    expect(wrapper.vm.documentosSeparacaoSelecionados[0].identificador).toBe(documento.identificador);
  });

  it('Deve selecionar todos os documentos de conferência visíveis.', () => {
    let documento = { identificador: 1 };
    wrapper.vm.documentosConferenciaVisiveis = [documento];
    wrapper.vm.abaAtual = 'aba-conferencia';

    wrapper.vm.selecionarTodos();
    expect(wrapper.vm.documentosConferenciaSelecionados[0].identificador).toBe(documento.identificador);
  });

  it('Não deve iniciar a ação de separação quando houverem documentos em andamento selecionados.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});
    wrapper.vm.abaAtual = 'aba-separacao';
    let documento = { status: 'EM_SEPARACAO' };
    wrapper.vm.documentosSeparacaoSelecionados = [documento];

    wrapper.vm.iniciarAcao();
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalled();
  });

  it('Não deve iniciar a ação de conferência quando houverem documentos em andamento selecionados.', () => {
    jest.spyOn(wrapper.vm, 'exibirMensagemErroFlutuante').mockImplementation(() => {});
    wrapper.vm.abaAtual = 'aba-conferencia';
    let documento = { status: 'EM_CONFERENCIA' };
    wrapper.vm.documentosConferenciaSelecionados = [documento];

    wrapper.vm.iniciarAcao();
    expect(wrapper.vm.exibirMensagemErroFlutuante).toHaveBeenCalled();
  });

  it('Deve iniciar a ação de separação quando todos os documentos selecionados estiverem pendentes.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(apiSelecaoDocumento, 'gravarSelecaoDeDocumentos').mockImplementation(() => Promise.resolve());
    jest.spyOn(wrapperTeste.vm.$router, "push").mockImplementation(() => {});

    wrapperTeste.vm.abaAtual = 'aba-separacao';
    let documento = { status: 'PENDENTE' };
    wrapperTeste.vm.documentosSeparacaoSelecionados = [documento];

    wrapperTeste.vm.iniciarAcao();

    wrapperTeste.vm.$nextTick(() => {
        expect(wrapperTeste.vm.$router.push).toHaveBeenCalled();
    });
  });

  it('Deve iniciar a ação de conferência quando todos os documentos selecionados estiverem pendentes.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(apiSelecaoDocumento, 'gravarSelecaoDeDocumentos').mockImplementation(() => Promise.resolve([{}]));
    jest.spyOn(wrapperTeste.vm.$router, "push").mockImplementation(() => {});

    wrapperTeste.vm.abaAtual = 'aba-conferencia';
    let documento = { status: 'PENDENTE' };
    wrapperTeste.vm.documentosConferenciaSelecionados = [documento];

    wrapperTeste.vm.iniciarAcao();

    wrapperTeste.vm.$nextTick(() => {
        expect(wrapperTeste.vm.$router.push).toHaveBeenCalled();
    });
  });

  it('Deve limpar a seleção de documentos existente.', () => {
    var wrapperTeste = mount(SelecaoDocumentos, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.abaAtual = 'aba-separacao';
    wrapperTeste.vm.documentosSeparacaoSelecionados = [{}];
    expect(wrapperTeste.vm.documentosSeparacaoSelecionados).toEqual(expect.arrayContaining([{}]));
    wrapperTeste.vm.limparSelecao();
    expect(wrapperTeste.vm.documentosSeparacaoSelecionados).toEqual(expect.arrayContaining([]));

    wrapperTeste.vm.abaAtual = 'aba-conferencia';
    wrapperTeste.vm.documentosConferenciaSelecionados = [{}];
    expect(wrapperTeste.vm.documentosConferenciaSelecionados).toEqual(expect.arrayContaining([{}]));
    wrapperTeste.vm.limparSelecao();
    expect(wrapperTeste.vm.documentosConferenciaSelecionados).toEqual(expect.arrayContaining([]));
  });
});