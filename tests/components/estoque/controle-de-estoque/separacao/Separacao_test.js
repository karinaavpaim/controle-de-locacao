'use strict';

import { mount } from '@vue/test-utils';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import Separacao from '@/components/estoque/controle-de-estoque/separacao/Separacao.vue';
import apiSelecaoDocumento from "@/api/estoque/controle-de-estoque/selecao-documento-api";
import apiDocumentoControleEstoque from "@/api/estoque/controle-de-estoque/documento-controle-estoque-api";

describe('Separacao.vue', () => {
  jest.spyOn(apiDocumentoControleEstoque, 'assinarNotificacoesMovimentos').mockImplementation(() => {});
  sync(store, router);

  it('Não deve abrir uma separação finalizada ou sem participantes.', () => {
    let separacao = {
      finalizada: false,
      participantes: []
    };

    jest.spyOn(apiSelecaoDocumento, 'obterSelecoesDeDocumentos').mockImplementation(() => Promise.resolve([separacao]));
    jest.spyOn(router, 'push').mockImplementation(() => {});
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        },
        $mensagemFlutuante: {
          erro: metodoMensagemFlutuante
        }
      },
      store,
      router
    });

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.separacao.finalizada).toBeUndefined();
      expect(wrapperTeste.vm.separacao.participantes).toEqual(expect.arrayContaining([]));
      expect(wrapperTeste.vm.$router.push).toHaveBeenCalled();
      expect(wrapperTeste.vm.$mensagemFlutuante.erro).toHaveBeenCalled();
    });
  });

  it('Deve abrir uma separação e tentar listar seus itens corretamente.', () => {
    let separacao = {
      finalizada: false,
      participantes: [
        {
          identificador: 453
        }
      ]
    };

    jest.spyOn(apiSelecaoDocumento, 'obterSelecoesDeDocumentos').mockImplementation(() => Promise.resolve([separacao]));
    let listarItensSeparacao = jest.fn();
    let assinarNotificacoesMovimentos = jest.fn();

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      methods: {
        listarItensSeparacao,
        assinarNotificacoesMovimentos
      },
      store,
      router
    });

    wrapperTeste.vm.$nextTick(() => {
      expect(listarItensSeparacao).toHaveBeenCalled();
      expect(assinarNotificacoesMovimentos).toHaveBeenCalled();
    });
  });

  it('Deve retornar o total pedido de determinado produto em todos os itens de documentos.', () => {
    jest.spyOn(apiSelecaoDocumento, 'obterSelecoesDeDocumentos').mockImplementation(() => Promise.resolve());

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.itensDocumentosVisiveis = [
      {
        item:{
          quantidade: 5
        }
      },
      {
        item: {
          quantidade: 5
        }
      }
    ];

    expect(wrapperTeste.vm.totalPedido).toBe(10);
  });

  it('Deve retornar o total pedido de determinado produto em todos os itens de documentos.', () => {
    jest.spyOn(apiSelecaoDocumento, 'obterSelecoesDeDocumentos').mockImplementation(() => Promise.resolve());

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.itensDocumentosVisiveis = [
      {
        item:{
          movimentos: [
            {
              quantidade: 5
            }
          ]
        }
      },
      {
        item: {
          movimentos: [
            {
              quantidade: 2
            },
            {
              quantidade: 3
            }
          ]
        }
      }
    ];

    expect(wrapperTeste.vm.totalInformado).toBe(10);
  });

  it('Deve atualizar o tamanho das tabelas quando a tela mudar de tamanho.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(wrapperTeste.vm, 'ajustarTamanhoDaTabela').mockImplementation(() => {});
    wrapperTeste.vm.$options.watch['$vuetify.breakpoint.mdAndUp'].call(wrapperTeste.vm, true);
    expect(wrapperTeste.vm.ajustarTamanhoDaTabela).toHaveBeenCalled();
  });

  it('Não deve atualizar o tamanho das tabelas quando não conseguir obter o tamanho da tela.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.alturaTabela = undefined;
    window.innerHeight = undefined;
    wrapperTeste.vm.ajustarTamanhoDaTabela();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.alturaTabela).toBeUndefined();
      window.innerHeight = 200; // atribuindo um valor qualquer para não afetar os demais testes.
    });
  });

  it('Deve retornar o status correto para o produto agrupado pendente.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    var produtoAgrupados = [
      {
        quantidade: 10,
        movimentos: []
      }
    ];

    expect(wrapperTeste.vm.retornarStatusParaProdutoAgrupado(produtoAgrupados)).toBe('Pendente');
  });

  it('Deve retornar o status correto para o produto agrupado atendido totalmente.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    var produtoAgrupados = [
      {
        quantidade: 10,
        movimentos: [
          { quantidade: 5 },
          { quantidade: 5 }
        ]
      }
    ];

    expect(wrapperTeste.vm.retornarStatusParaProdutoAgrupado(produtoAgrupados)).toBe('Atendido totalmente');
  });

  it('Deve retornar o status correto para o produto agrupado atendido parcial.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    var produtoAgrupados = [
      {
        quantidade: 10,
        movimentos: [
          { quantidade: 5 }
        ]
      }
    ];

    expect(wrapperTeste.vm.retornarStatusParaProdutoAgrupado(produtoAgrupados)).toBe('Atendido parcial');
  });

  it('Deve limpar os documentos selecionados caso os detalhes deixem de ser exibidos.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.itensDocumentosSelecionados = [{}];
    wrapperTeste.vm.$options.watch.exibirDetalhes.call(wrapperTeste.vm, false);
    expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([]));
  });

  it('Deve habilitar os botões de navegação corretamente.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(wrapperTeste.vm, 'habilitarBotaoItemDocumentoAnterior').mockImplementation(() => { return true });
    jest.spyOn(wrapperTeste.vm, 'habilitarBotaoProximoItemDocumento').mockImplementation(() => { return true });
    wrapperTeste.vm.botaoItemDocumentoAnteriorHabilitado = false;
    wrapperTeste.vm.botaoProximoItemDocumentoHabilitado = false;
    wrapperTeste.vm.$options.watch.itemDocumento.call(wrapperTeste.vm);
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.botaoItemDocumentoAnteriorHabilitado).toBeTruthy();
      expect(wrapperTeste.vm.botaoProximoItemDocumentoHabilitado).toBeTruthy();
      expect(wrapperTeste.vm.habilitarBotaoItemDocumentoAnterior).toHaveBeenCalled();
      expect(wrapperTeste.vm.habilitarBotaoProximoItemDocumento).toHaveBeenCalled();
    });
  });

  it('Não deve notificar os participantes quando a listagem dos mesmos estiver sendo revertida por erro de notificação.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(wrapperTeste.vm, 'notificarParticipanteConvidado').mockImplementation(() => {});
    wrapperTeste.vm.revertendoParticipantes = true;
    wrapperTeste.vm.$options.watch['separacao.participantes'].call(wrapperTeste.vm);
    expect(wrapperTeste.vm.notificarParticipanteConvidado).not.toHaveBeenCalled();
  });

  it('Não deve notificar os participantes quando for a primeira vez que a lista é preenchida (não existem participantes anteriores ainda).', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    jest.spyOn(wrapperTeste.vm, 'notificarParticipanteConvidado').mockImplementation(() => {});
    wrapperTeste.vm.revertendoParticipantes = false;
    wrapperTeste.vm.participantesAnteriores = [];
    
    let participante = {
      funcionario: {
        identificador: 1
      }
    };

    wrapperTeste.vm.separacao.identificador = 333;
    wrapperTeste.vm.separacao.participantes = [participante];
    expect(wrapperTeste.vm.notificarParticipanteConvidado).not.toHaveBeenCalled();
    expect(wrapperTeste.vm.participantesAnteriores).toEqual(expect.arrayContaining([participante]));
  });

  it('Deve cancelar as assinaturas antes de sair da rota atual.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let beforeRouteLeave = wrapperTeste.vm.$options.beforeRouteLeave[0];
    let metodoNext = jest.fn();
    let assinaturaNotificacoes = {
      unsubscribe: jest.fn()
    };

    wrapperTeste.vm.assinaturaNotificacoes = undefined; // Chama uma vez com undefined para completar a cobertura (é um 'if' sem 'else').
    beforeRouteLeave.call(wrapperTeste.vm, 'destino', 'origem', metodoNext);
    wrapperTeste.vm.assinaturaNotificacoes = assinaturaNotificacoes;
    beforeRouteLeave.call(wrapperTeste.vm, 'destino', 'origem', metodoNext);
    expect(metodoNext).toHaveBeenCalled();
    expect(assinaturaNotificacoes.unsubscribe).toHaveBeenCalled();
  });

  it('Não deve atualizar um movimento se nenhum for recebido.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.separacao = {
      documentos: [
        {
          identificador: 1,
          itens: [
            {
              identificador: 1,
              movimentos: []
            }
          ]
        }
      ]
    };

    wrapperTeste.vm.movimentoAtualizado({});
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos.length).toEqual(0);
  });

  it('Não deve atualizar um movimento se o documento ou o item não forem encontrados.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.separacao = {
      documentos: [
        {
          identificador: 123,
          tipo: 'REQUISICAO_MATERIAL',
          itens: [
            {
              identificador: 456,
              movimentos: []
            }
          ]
        }
      ]
    };

    let notificacao = {
      movimentoItemDocumentoControleEstoqueAtualizado: {
        identificadorDocumento: 1234,
        tipoDocumento: 'REQUISICAO_MATERIAL',
        identificadorItem: 345,
        movimento: {
          identificador: 1
        }
      }
    };

    wrapperTeste.vm.movimentoAtualizado(notificacao);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos.length).toEqual(0);

    notificacao.movimentoItemDocumentoControleEstoqueAtualizado.identificadorDocumento = 123;
    wrapperTeste.vm.movimentoAtualizado(notificacao);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos.length).toEqual(0);
  });

  it('Deve inserir ou atualizar um movimento se o documento e o item forem encontrados.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.separacao = {
      documentos: [
        {
          identificador: 123,
          tipo: 'REQUISICAO_MATERIAL',
          itens: [
            {
              identificador: 456,
              movimentos: []
            }
          ]
        }
      ]
    };

    var notificacao = {
      movimentoItemDocumentoControleEstoqueAtualizado: {
        identificadorDocumento: 123,
        tipoDocumento: 'REQUISICAO_MATERIAL',
        identificadorItem: 456,
        movimento: {
          identificador: 1,
          quantidade: 1
        }
      }
    };

    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos.length).toEqual(0);
    wrapperTeste.vm.movimentoAtualizado(notificacao);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos.length).toEqual(1);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos[0].identificador).toEqual(1);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos[0].quantidade).toEqual(1);

    notificacao.movimentoItemDocumentoControleEstoqueAtualizado.movimento.quantidade = 2;
    wrapperTeste.vm.movimentoAtualizado(notificacao);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos.length).toEqual(1);
    expect(wrapperTeste.vm.separacao.documentos[0].itens[0].movimentos[0].quantidade).toEqual(2);
  });

  it('Deve listar os itens de todos os documentos e agrupar os produtos sem repetir.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    wrapperTeste.vm.separacao = {
      documentos: [
        {
          identificador: 123,
          tipo: 'REQUISICAO_MATERIAL',
          itens: [
            {
              identificador: 100,
              produto: {
                identificador: 333
              },
              movimentos: []
            },
            {
              identificador: 101,
              produto: {
                identificador: 334
              },
              movimentos: []
            }
          ]
        },
        {
          identificador: 124,
          tipo: 'REQUISICAO_MATERIAL',
          itens: [
            {
              identificador: 102,
              produto: {
                identificador: 333
              },
              movimentos: []
            }
          ]
        }
      ]
    };

    wrapperTeste.vm.listarItensSeparacao();
    expect(wrapperTeste.vm.itensDocumentos.length).toEqual(3);
    expect(wrapperTeste.vm.itensDocumentos.findIndex(i => i.identificador == 100)).toBeTruthy();
    expect(wrapperTeste.vm.itensDocumentos.findIndex(i => i.identificador == 101)).toBeTruthy();
    expect(wrapperTeste.vm.itensDocumentos.findIndex(i => i.identificador == 102)).toBeTruthy();
    expect(wrapperTeste.vm.produtosAgrupados.length).toEqual(2);
    expect(wrapperTeste.vm.produtosAgrupados.findIndex(p => p.identificador == 333)).toBeTruthy();
    expect(wrapperTeste.vm.produtosAgrupados.findIndex(p => p.identificador == 334)).toBeTruthy();
  });

  it('Deve retornar os cabeçalhos das colunas da tabela de itens, filtrando os registros pelo identificador do produto.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let identificador = 123;

    wrapperTeste.vm.produtosAgrupadosSelecionados = [
      {
        produto: {
          identificador
        }
      }
    ];

    let cabecalhos = wrapperTeste.vm.retornarCabecalhosItensDocumentos();
    expect(cabecalhos).toBeInstanceOf(Array);
    expect(cabecalhos.length).toEqual(5);
    expect(typeof cabecalhos[4].filter).toEqual('function');
    expect(cabecalhos[4].filter(333)).toBeFalsy();
    expect(cabecalhos[4].filter(identificador)).toBeTruthy();
  });

  it('Deve selecionar um novo produto e limpar a seleção dos itens.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let produtoAgrupado = {
      produto: {
        identificador: 123
      }
    };

    var novoProdutoAgrupado = Object.assign({}, produtoAgrupado);
    novoProdutoAgrupado.produto.identificador = 333;

    wrapperTeste.vm.produtosAgrupadosSelecionados = [produtoAgrupado];
    wrapperTeste.vm.itensDocumentosSelecionados = [{}];

    wrapperTeste.vm.linhaProdutosAgrupadosClick(novoProdutoAgrupado);
    expect(wrapperTeste.vm.produtosAgrupadosSelecionados).toEqual(expect.arrayContaining([novoProdutoAgrupado]));
    expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([]));
  });

  it('Deve filtrar os itens de documentos pelo valor informado na pesquisa.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let itemDocumento = {
      documento: {
        descricao: 'RM 001'
      }
    };

    expect(wrapperTeste.vm.filtrarItemDocumento(undefined, '', itemDocumento)).toBeTruthy();
    expect(wrapperTeste.vm.filtrarItemDocumento(undefined, itemDocumento.documento.descricao, itemDocumento)).toBeTruthy();
    expect(wrapperTeste.vm.filtrarItemDocumento(undefined, 'batata', itemDocumento)).toBeFalsy();
  });

  it('Deve selecionar um item de documento e exibir os seus detalhes.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let itemDocumento = {
      documento: {
        descricao: 'RM 001'
      }
    };

    wrapperTeste.vm.itensDocumentosSelecionados = [];
    wrapperTeste.vm.itemDocumento = undefined;
    wrapperTeste.vm.exibirDetalhes = false;

    wrapperTeste.vm.linhaItensDocumentosClick(itemDocumento);
    expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([itemDocumento]));
    expect(wrapperTeste.vm.itemDocumento).toEqual(itemDocumento);
    expect(wrapperTeste.vm.exibirDetalhes).toBeTruthy();
  });

  it('Deve calcular a altura da tabela corretamente.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    var componente = {
      height: 500,
      getBoundingClientRect() {
        return this;
      }
    };

    jest.spyOn(document, 'querySelector').mockImplementation((nomeDoComponente) => {
      if (nomeDoComponente == '.v-application--wrap') {
        componente.height = 500
      } else {
        componente.height = 50
      }
      return componente;
    });

    wrapperTeste.vm.alturaTabela = undefined;
    wrapperTeste.vm.ajustarTamanhoDaTabela();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.alturaTabela).toEqual(176);
    });
  });

  it('Deve calcular a altura da tabela com os valores padrão corretamente.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {
            mdAndUp: true
          }
        }
      },
      store,
      router
    });

    var componente = {
      height: 500,
      getBoundingClientRect() {
        return this;
      }
    };

    jest.spyOn(document, 'querySelector').mockImplementation((nomeDoComponente) => {
      if (nomeDoComponente == '.v-application--wrap') {
        componente.height = 500
      } else {
        componente.height = undefined
      }
      return componente;
    });

    wrapperTeste.vm.alturaTabela = undefined;
    wrapperTeste.vm.ajustarTamanhoDaTabela();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.alturaTabela).toEqual(332);
    });
  });

  it('Não deve calcular a altura da tabela se não encontrar o container principal.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    var componente = {
      getBoundingClientRect() {
        return this;
      }
    };

    jest.spyOn(document, 'querySelector').mockImplementation(() => { return componente });

    wrapperTeste.vm.alturaTabela = undefined;
    wrapperTeste.vm.ajustarTamanhoDaTabela();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.alturaTabela).toBeUndefined();
    });
  });

  it('Deve navegar para o item anterior do mesmo produto agrupado.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let itemDocumento = {
      documento: {
        identificador: 123
      },
      item: {
        identificador: 1
      }
    };

    let itemDocumentoAnterior = {
      documento: {
        identificador: 333
      },
      item: {
        identificador: 2
      }
    };

    wrapperTeste.vm.itemDocumento = itemDocumento;
    wrapperTeste.vm.itensDocumentosVisiveis = [itemDocumentoAnterior, itemDocumento];

    wrapperTeste.vm.anteriorItemDocumentoClick();

    expect(wrapperTeste.vm.itemDocumento.documento.identificador).toEqual(itemDocumentoAnterior.documento.identificador);
    expect(wrapperTeste.vm.itemDocumento.item.identificador).toEqual(itemDocumentoAnterior.item.identificador);
    expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([itemDocumentoAnterior]));
  });

  it('Deve navegar para o último item do produto agrupado anterior, quando o item selecionado já for o primeiro do produto agrupado atual.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let produtoAgrupadoAnterior = {
      produto: {
        identificador: 300
      }
    };

    let produtoAgrupado = {
      produto: {
        identificador: 333
      }
    };

    wrapperTeste.vm.produtosAgrupadosVisiveis = [produtoAgrupadoAnterior, produtoAgrupado];
    wrapperTeste.vm.produtosAgrupadosSelecionados = [produtoAgrupado];

    let itemDocumento = {
      documento: {
        identificador: 123
      },
      item: {
        identificador: 1,
        produto: {
          identificador: 333
        }
      }
    };

    let itemDocumentoAnterior = {
      documento: {
        identificador: 333
      },
      item: {
        identificador: 2,
        produto: {
          identificador: 300
        }
      }
    };

    wrapperTeste.vm.itensDocumentos = [itemDocumentoAnterior, itemDocumento];
    wrapperTeste.vm.itensDocumentosVisiveis = [itemDocumento];
    wrapperTeste.vm.itemDocumento = itemDocumento;

    wrapperTeste.vm.anteriorItemDocumentoClick();

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.produtosAgrupadosSelecionados).toEqual(expect.arrayContaining([produtoAgrupadoAnterior]));
      expect(wrapperTeste.vm.itemDocumento.documento.identificador).toEqual(itemDocumentoAnterior.documento.identificador);
      expect(wrapperTeste.vm.itemDocumento.item.identificador).toEqual(itemDocumentoAnterior.item.identificador);
      expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([itemDocumentoAnterior]));
      expect(wrapperTeste.vm.itemDocumento.produto.identificador).toEqual(produtoAgrupadoAnterior.produto.identificador);
    });
  });

  it('Deve navegar para o próximo item do mesmo produto agrupado.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let itemDocumento = {
      documento: {
        identificador: 123
      },
      item: {
        identificador: 1
      }
    };

    let proximoItemDocumento = {
      documento: {
        identificador: 333
      },
      item: {
        identificador: 2
      }
    };

    wrapperTeste.vm.itemDocumento = itemDocumento;
    wrapperTeste.vm.itensDocumentosVisiveis = [itemDocumento, proximoItemDocumento];

    wrapperTeste.vm.proximoItemDocumentoClick();

    expect(wrapperTeste.vm.itemDocumento.documento.identificador).toEqual(proximoItemDocumento.documento.identificador);
    expect(wrapperTeste.vm.itemDocumento.item.identificador).toEqual(proximoItemDocumento.item.identificador);
    expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([proximoItemDocumento]));
  });

  it('Deve navegar para o primeiro item do próximo produto agrupado, quando o item selecionado já for o último do produto agrupado atual.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let proximoProdutoAgrupado = {
      produto: {
        identificador: 300
      }
    };

    let produtoAgrupado = {
      produto: {
        identificador: 333
      }
    };

    wrapperTeste.vm.produtosAgrupadosVisiveis = [produtoAgrupado, proximoProdutoAgrupado];
    wrapperTeste.vm.produtosAgrupadosSelecionados = [produtoAgrupado];

    let itemDocumento = {
      documento: {
        identificador: 123
      },
      item: {
        identificador: 1,
        produto: {
          identificador: 333
        }
      }
    };

    let proximoItemDocumento = {
      documento: {
        identificador: 333
      },
      item: {
        identificador: 2,
        produto: {
          identificador: 300
        }
      }
    };

    wrapperTeste.vm.itensDocumentos = [itemDocumento, proximoItemDocumento];
    wrapperTeste.vm.itensDocumentosVisiveis = [itemDocumento];
    wrapperTeste.vm.itemDocumento = itemDocumento;

    wrapperTeste.vm.proximoItemDocumentoClick();

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.produtosAgrupadosSelecionados).toEqual(expect.arrayContaining([proximoProdutoAgrupado]));
      expect(wrapperTeste.vm.itemDocumento.documento.identificador).toEqual(proximoItemDocumento.documento.identificador);
      expect(wrapperTeste.vm.itemDocumento.item.identificador).toEqual(proximoItemDocumento.item.identificador);
      expect(wrapperTeste.vm.itensDocumentosSelecionados).toEqual(expect.arrayContaining([proximoItemDocumento]));
      expect(wrapperTeste.vm.itemDocumento.produto.identificador).toEqual(proximoProdutoAgrupado.produto.identificador);
    });
  });

  it('Não deve selecionar o produto agrupado anterior, quando o produto agrupado atual for o primeiro ou único da lista.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let produtoAgrupado = {
      produto: {
        identificador: 333
      }
    };

    let proximoProdutoAgrupado = {
      produto: {
        identificador: 300
      }
    };

    wrapperTeste.vm.produtosAgrupadosVisiveis = [produtoAgrupado, proximoProdutoAgrupado];
    wrapperTeste.vm.produtosAgrupadosSelecionados = [produtoAgrupado];

    expect(wrapperTeste.vm.selecionarProdutoAgrupadoVisivelAnterior()).toBeFalsy();
    expect(wrapperTeste.vm.produtosAgrupadosSelecionados).toEqual(expect.arrayContaining([produtoAgrupado]));
  });

  it('Não deve selecionar o próximo produto agrupado, quando o produto agrupado atual for o último ou único da lista.', () => {
    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router
    });

    let produtoAgrupadoAnterior = {
      produto: {
        identificador: 300
      }
    };

    let produtoAgrupado = {
      produto: {
        identificador: 333
      }
    };

    wrapperTeste.vm.produtosAgrupadosVisiveis = [produtoAgrupadoAnterior, produtoAgrupado];
    wrapperTeste.vm.produtosAgrupadosSelecionados = [produtoAgrupado];

    expect(wrapperTeste.vm.selecionarProximoProdutoAgrupadoVisivel()).toBeFalsy();
    expect(wrapperTeste.vm.produtosAgrupadosSelecionados).toEqual(expect.arrayContaining([produtoAgrupado]));
  });

  it('Deve armazenar os novos participantes na lista de participantes anteriores se todos forem notificados sobre o convite com sucesso.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        },
        $mensagemFlutuante: {
          sucesso: metodoMensagemFlutuante
        }
      },
      store,
      router
    });

    jest.spyOn(apiSelecaoDocumento, 'incluirParticipanteNaSelecao').mockImplementation(() => Promise.resolve());

    let participante = {
      funcionario: {
        identificador: 1
      }
    };

    let participanteNovo = {
      funcionario: {
        identificador: 2
      }
    };

    let identificadorSeparacao = 333;

    wrapperTeste.vm.separacao.identificador = identificadorSeparacao;
    wrapperTeste.vm.separacao.participantes = [participante];
    wrapperTeste.vm.separacao.participantes.push(participanteNovo);

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.participantesAnteriores).toEqual(expect.arrayContaining([participante, participanteNovo]));
      expect(metodoMensagemFlutuante).toHaveBeenCalled();
      expect(apiSelecaoDocumento.incluirParticipanteNaSelecao).toHaveBeenCalledWith(
        identificadorSeparacao, participante.identificador);
    });
  });

  it('Não deve armazenar os novos participantes se houver algum problema ao tentar notificar sobre o convite.', () => {
    let metodoMensagemErro = jest.fn().mockImplementation(() => {});

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        },
        $mensagemFlutuante: {
          erro: metodoMensagemErro
        }
      },
      store,
      router
    });

    jest.spyOn(apiSelecaoDocumento, 'incluirParticipanteNaSelecao').mockImplementation(() => Promise.reject([{ statusText: 'erro-ao-notificar' }]));

    let participante = {
      funcionario: {
        identificador: 1
      }
    };

    let participanteNovo = {
      funcionario: {
        identificador: 2
      }
    };
    let identificadorSeparacao = 333;

    wrapperTeste.vm.separacao.identificador = identificadorSeparacao;
    wrapperTeste.vm.separacao.participantes = [participante];
    wrapperTeste.vm.separacao.participantes.push(participanteNovo);

    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.separacao.participantes).toEqual(expect.arrayContaining([participante]));
      expect(wrapperTeste.vm.participantesAnteriores).toEqual(expect.arrayContaining([participante]));
      expect(metodoMensagemErro).toHaveBeenCalled();
    });
  });

  it('Deve notificar que a separação foi finalizada e navegar para a tela anterior.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation(() => {});

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        },
        $mensagemFlutuante: {
          sucesso: metodoMensagemFlutuante
        }
      },
      store,
      router
    });

    jest.spyOn(apiSelecaoDocumento, 'finalizarSelecaoDeDocumentos').mockImplementation(() => Promise.resolve());
    jest.spyOn(router, 'push').mockImplementation(() => {});

    wrapperTeste.vm.separacao = { identificador: 1 };
    wrapperTeste.vm.finalizarSeparacao();

    wrapperTeste.vm.$nextTick(() => {
      expect(metodoMensagemFlutuante).toHaveBeenCalled();
      expect(wrapperTeste.vm.$router.push).toHaveBeenCalled();
    });
  });

  it('Deve notificar que a separação não foi finalizada e não deve navegar para a tela anterior.', () => {
    let metodoMensagemFlutuante = jest.fn().mockImplementation((parametro) => {
      if ((typeof parametro.onClose) == 'function')
        parametro.onClose();
    });

    var wrapperTeste = mount(Separacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        },
        $mensagemFlutuante: {
          erro: metodoMensagemFlutuante
        }
      },
      store,
      router
    });

    jest.spyOn(apiSelecaoDocumento, 'finalizarSelecaoDeDocumentos').mockImplementation(() => Promise.reject([{ statusText: 'erro-ao-finalizar' }]));
    jest.spyOn(router, 'push').mockImplementation(() => {});

    wrapperTeste.vm.separacao = { identificador: 1 };
    wrapperTeste.vm.finalizarSeparacao();

    wrapperTeste.vm.$nextTick(() => {
      expect(metodoMensagemFlutuante).toHaveBeenCalled();
      expect(wrapperTeste.vm.$router.push).not.toHaveBeenCalled();
      expect(wrapperTeste.vm.permiteFinalizar).toBeTruthy();
    });
  });
});