'use strict';

import { mount } from '@vue/test-utils';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import ItemSeparacao from '@/components/estoque/controle-de-estoque/separacao/ItemSeparacao.vue';
import apiPessoa from "@/api/sistemas-gerais/pessoa-api";
import apiProduto from "@/api/estoque/produto-api";
import apiDocumentoControleEstoque from "@/api/estoque/controle-de-estoque/documento-controle-estoque-api";
import * as ambiente from "../../../../../vue.enviroment.config";

describe('ItemSeparacao.vue', () => {
  let pessoa = {
    foto: 'data:image/jpg;base64',
    identificador: 1,
    nome: 'Joshua Bardwell',
    nomeCurto: 'Bardwell'
  };

  sync(store, router);

  it('Deve obter dados simplificados do responsável atual.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    var metodoObterUsuario = jest.spyOn(ambiente, 'obterDadosDoUsuarioLogado').mockImplementation(() => Promise.resolve({ identificadorFuncionario: 1 }));
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([pessoa]));

    let responsavelAtual = wrapperTeste.vm.obterResponsavelAtualSimplificado();
    wrapperTeste.vm.$nextTick(() => {
      expect(metodoObterUsuario).toHaveBeenCalled();
      expect(responsavelAtual.identificador).toEqual(1);
      expect(responsavelAtual.nome).toBeUndefined();
      expect(responsavelAtual.foto).toBeUndefined();
    });

    metodoObterUsuario.mockClear();
    responsavelAtual = wrapperTeste.vm.obterResponsavelAtualSimplificado();
    expect(metodoObterUsuario).not.toHaveBeenCalled();
  });

  it('Deve obter os dados do responsável atual (usuário logado) quando solicitado.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    var metodoObterUsuario = jest.spyOn(ambiente, 'obterDadosDoUsuarioLogado').mockImplementation(() => Promise.resolve({ identificadorFuncionario: 1 }));
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([pessoa]));

    let responsavelAtual = wrapperTeste.vm.obterResponsavelAtual();
    wrapperTeste.vm.$nextTick(() => {
      expect(metodoObterUsuario).toHaveBeenCalled();
      expect(responsavelAtual.foto).toEqual(pessoa.foto);
      expect(responsavelAtual.nome).toEqual(pessoa.nome);
    });

    metodoObterUsuario.mockClear();
    responsavelAtual = wrapperTeste.vm.obterResponsavelAtual();
    expect(metodoObterUsuario).not.toHaveBeenCalled();
  });

  it('Deve obter o nome do setor solicitante.', () => {
    let descricaoDoSetor = 'descrição do setor';
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        },
        documento: {
          setorOrigem: {
            descricao: descricaoDoSetor
          }
        }
      }
    });

    expect(wrapperTeste.vm.solicitante).toEqual(descricaoDoSetor);
  });

  it('Deve obter a sigla da unidade do produto.', () => {
    let siglaDaUnidade = 'KG';
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            unidade: {
              sigla: siglaDaUnidade
            }
          },
          movimentos: []
        }
      }
    });

    expect(wrapperTeste.vm.unidadeProduto).toEqual(siglaDaUnidade);
  });

  it('Deve obter a quantidade pendente do produto.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          quantidade: 5,
          movimentos: [
            {
              quantidade: 1
            },
            {
              quantidade: 2
            }
          ]
        }
      }
    });

    expect(wrapperTeste.vm.quantidadePendente).toEqual(2); // Quantidade do item - quantidade dos movimentos
  });

  it('Deve permitir registrar um movimento quando a quantidade informada estiver correta e não controlar lote/série.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            controleLoteSerie: 'NENHUM'
          },
          quantidade: 5,
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.quantidadeInformada = 5;
    expect(wrapperTeste.vm.permitirRegistrar).toBeTruthy();
  });

  it('Não deve permitir registrar um movimento quando a quantidade informada for acima da quantidade do item.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            controleLoteSerie: 'NENHUM'
          },
          quantidade: 5,
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.quantidadeInformada = 10;
    expect(wrapperTeste.vm.permitirRegistrar).toBeFalsy();
  });

  it('Não deve permitir registrar um movimento quando já houverem movimentos o suficiente para atender ao item.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            controleLoteSerie: 'NENHUM'
          },
          quantidade: 5,
          movimentos: [
            {
              quantidade: 3
            },
            {
              quantidade: 2
            }]
        }
      }
    });

    wrapperTeste.vm.quantidadeInformada = 1;
    expect(wrapperTeste.vm.permitirRegistrar).toBeFalsy();
  });

  it('Não deve permitir registrar um movimento quando o item controlar lote ou série e nenhum estiver informado.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            controleLoteSerie: 'LOTE'
          },
          quantidade: 5,
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.quantidadeInformada = 1;
    expect(wrapperTeste.vm.permitirRegistrar).toBeFalsy();
  });

  it('Deve permitir registrar um movimento quando o item controlar lote ou série e estiver informado corretamente.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            controleLoteSerie: 'LOTE'
          },
          quantidade: 5,
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.quantidadeInformada = 1;
    wrapperTeste.vm.loteSerie = 'ABC123';
    expect(wrapperTeste.vm.permitirRegistrar).toBeTruthy();
  });

  it('Deve buscar a imagem do produto quando o item for atualizado.', () => {
    let imagem = { conteudo: 'data:image/jpg;base64' };
    jest.spyOn(apiProduto, 'obterImagensProduto').mockImplementation(() => Promise.resolve([imagem]));

    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    jest.spyOn(wrapperTeste.vm, 'atualizarImagensDosParticipantesNosMovimentos').mockImplementation(() => {});
    expect(wrapperTeste.vm.item.produto.identificador).toBeUndefined();
    expect(apiProduto.obterImagensProduto).not.toHaveBeenCalled();
    expect(wrapperTeste.vm.identificadorProduto).toBeUndefined();
    expect(wrapperTeste.vm.imagemProdutoSelecionado).toBeUndefined();

    wrapperTeste.vm.chaveImagemProduto = 1;
    wrapperTeste.setProps({ item: { produto: { identificador: 1 } } });

    wrapperTeste.vm.$nextTick(() => {
      expect(apiProduto.obterImagensProduto).toHaveBeenCalled();
      expect(wrapperTeste.vm.chaveImagemProduto).toEqual(2); // A chave é incrementada ao atualizar o item
      expect(wrapperTeste.vm.item.produto.identificador).toEqual(1);
      expect(wrapperTeste.vm.identificadorProduto).toEqual(1);
      expect(wrapperTeste.vm.imagemProdutoSelecionado).toEqual(imagem.conteudo);
    });
  });

  it('Não deve buscar a imagem do produto quando o item for atualizado mas o novo item possuir o mesmo produto.', () => {
    let imagem = { conteudo: 'data:image/jpg;base64' };
    jest.spyOn(apiProduto, 'obterImagensProduto').mockImplementation(() => Promise.resolve([imagem]));

    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {
            identificador: 1
          },
          movimentos: []
        }
      }
    });

    jest.spyOn(wrapperTeste.vm, 'atualizarImagensDosParticipantesNosMovimentos').mockImplementation(() => {});
    jest.spyOn(wrapperTeste.vm, 'carregarImagemProdutoAtual').mockImplementation(() => {});

    wrapperTeste.vm.identificadorProduto = 1;
    wrapperTeste.setProps({ item: { produto: { identificador: 1 } } });

    expect(wrapperTeste.vm.carregarImagemProdutoAtual).not.toHaveBeenCalled();
  });

  it('Deve exibir a janela ao solicitar a abertura.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.exibirJanela = false;
    wrapperTeste.vm.$options.watch.abrirJanela.call(wrapperTeste.vm, true);
    expect(wrapperTeste.vm.exibirJanela).toBeTruthy();
    wrapperTeste.vm.$options.watch.abrirJanela.call(wrapperTeste.vm, false); //não deve fechar externamente
    expect(wrapperTeste.vm.exibirJanela).toBeTruthy();
  });

  it('Não deve exibir erro caso não consiga obter a foto e nome da pessoa.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([]));
    expect(() => wrapperTeste.vm.obterDadosDoResponsavel({ identificador: 1 })).not.toThrow();
  });

  it('Deve atualizar a imagem dos participantes nos movimentos existentes.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: [
            {
              responsavel: {
                identificador: 1
              }
            }
          ]
        }
      }
    });

    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtual').mockImplementation(() => { return {}; });
    jest.spyOn(wrapperTeste.vm, 'obterDadosDoResponsavel').mockImplementation(() => {});
    wrapperTeste.vm.atualizarImagensDosParticipantesNosMovimentos();
    expect(wrapperTeste.vm.obterDadosDoResponsavel).toHaveBeenCalled();
  });

  it('Não deve atualizar a imagem dos participantes se não houverem movimentos.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    jest.spyOn(wrapperTeste.vm, 'atualizarImagemDoParticipante').mockImplementation(() => {});
    wrapperTeste.vm.atualizarImagensDosParticipantesNosMovimentos();
    expect(wrapperTeste.vm.atualizarImagemDoParticipante).not.toHaveBeenCalled();
  });

  it('Deve aproveitar a imagem do funcionário atual se o participante do movimento for a mesma pessoa.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    var movimento = {
      responsavel: {
        identificador: 1
      }
    };

    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtual').mockImplementation(() => { return pessoa });
    jest.spyOn(wrapperTeste.vm, 'obterDadosDoResponsavel').mockImplementation(() => {});
    wrapperTeste.vm.atualizarImagemDoParticipante(movimento);
    expect(movimento.responsavel.foto).toEqual(pessoa.foto);
    expect(movimento.responsavel.nome).toEqual(pessoa.nome);
    expect(wrapperTeste.vm.obterDadosDoResponsavel).not.toHaveBeenCalled();
  });

  it('Deve aproveitar a imagem do responsável se houver outro movimento na lista para a mesma pessoa.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: [
            {
              responsavel: pessoa
            }
          ]
        }
      }
    });

    var movimento = {
      responsavel: {
        identificador: 1
      }
    };

    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtual').mockImplementation(() => { return {} });
    jest.spyOn(wrapperTeste.vm, 'obterDadosDoResponsavel').mockImplementation(() => {});
    wrapperTeste.vm.atualizarImagemDoParticipante(movimento);
    expect(movimento.responsavel.foto).toEqual(pessoa.foto);
    expect(movimento.responsavel.nome).toEqual(pessoa.nome);
    expect(wrapperTeste.vm.obterDadosDoResponsavel).not.toHaveBeenCalled();
  });

  it('Não deve atribuir a imagem do produto quando esta não estiver disponível.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.exibirImagemProdutoAtual([]);
    expect(wrapperTeste.vm.imagemProdutoSelecionado).toBeUndefined();
  });

  it('Deve registrar um movimento sem lote nem série corretamente.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item: {
          produto: {
            controleLoteSerie: 'NENHUM'
          },
          movimentos: []
        }
      }
    });

    let movimentoRegistrado = { identificador: 1 };
    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtualSimplificado').mockImplementation(() => Promise.resolve({}));
    jest.spyOn(apiDocumentoControleEstoque, 'incluirDocumentoControleEstoqueItemMovimento').mockImplementation(() => Promise.resolve([movimentoRegistrado]));

    let quantidade = 5;
    wrapperTeste.vm.quantidadeInformada = quantidade;
    wrapperTeste.vm.registrarMovimento();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.item.movimentos[0].identificador).toEqual(movimentoRegistrado.identificador);
      expect(wrapperTeste.vm.item.movimentos[0].movimento.lote).toBeUndefined();
      expect(wrapperTeste.vm.item.movimentos[0].movimento.serie).toBeUndefined();
      expect(wrapperTeste.vm.item.movimentos[0].movimento.quantidade).toEqual(quantidade);
      expect(wrapperTeste.vm.quantidadeInformada).toEqual(0);
    });
  });

  it('Não deve incluir um movimento na lista se ele já estiver nela.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item: {
          produto: {},
          movimentos: [
            {
              identificador: 1
            }
          ]
        }
      }
    });

    let movimentoRegistrado = { identificador: 1 };
    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtualSimplificado').mockImplementation(() => Promise.resolve({}));
    jest.spyOn(apiDocumentoControleEstoque, 'incluirDocumentoControleEstoqueItemMovimento').mockImplementation(() => Promise.resolve([movimentoRegistrado]));

    wrapperTeste.vm.registrarMovimento();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.item.movimentos.filter(m => m.identificador == 1).length).toEqual(1);
    });
  });

  it('Não deve incluir um movimento na lista se ele não for registrado corretamente.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtualSimplificado').mockImplementation(() => Promise.resolve({}));
    jest.spyOn(apiDocumentoControleEstoque, 'incluirDocumentoControleEstoqueItemMovimento').mockImplementation(() => Promise.resolve());

    wrapperTeste.vm.registrarMovimento();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.vm.item.movimentos.filter(m => m.identificador == undefined).length).toEqual(0);
    });
  });

  it('Deve obter os dados para registrar um novo movimento com lote corretamente.', () => {
    let documento = {
      identificador: 123,
      tipo: 'REQUISICAO_MATERIAL'
    };

    let item = {
      identificador: 543,
      produto: {
        controleLoteSerie: 'LOTE'
      },
      movimentos: []
    };

    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento,
        item
      }
    });

    let loteSerie = {
      identificador: 999,
      codigo: 'ABC123'
    };

    let quantidade = 5;

    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtualSimplificado').mockImplementation(() => Promise.resolve({}));

    wrapperTeste.vm.loteSerie = loteSerie;
    wrapperTeste.vm.quantidadeInformada = quantidade;

    let dados = wrapperTeste.vm.obterDadosParaRegistrarNovoMovimento();
    wrapperTeste.vm.$nextTick(() => {
      expect(dados.identificadorDocumento).toEqual(documento.identificador);
      expect(dados.tipoDocumento).toEqual(documento.tipo);
      expect(dados.identificadorItem).toEqual(item.identificador);
      expect(dados.movimento.lote.identificador).toEqual(loteSerie.identificador);
      expect(dados.movimento.serie).toBeUndefined();
      expect(dados.movimento.quantidade).toEqual(quantidade);
      expect(wrapperTeste.vm.obterResponsavelAtualSimplificado).toHaveBeenCalled();
    });
  });

  it('Deve obter os dados para registrar um novo movimento com série corretamente.', () => {
    let documento = {
      identificador: 987,
      tipo: 'REQUISICAO_MATERIAL'
    };

    let item = {
      identificador: 567,
      produto: {
        controleLoteSerie: 'SERIE'
      },
      movimentos: []
    };

    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento,
        item
      }
    });

    let loteSerie = {
      identificador: 385,
      codigo: 'ABC675'
    };

    let quantidade = 7;

    jest.spyOn(wrapperTeste.vm, 'obterResponsavelAtualSimplificado').mockImplementation(() => Promise.resolve({}));

    wrapperTeste.vm.loteSerie = loteSerie;
    wrapperTeste.vm.quantidadeInformada = quantidade;

    let dados = wrapperTeste.vm.obterDadosParaRegistrarNovoMovimento();
    wrapperTeste.vm.$nextTick(() => {
      expect(dados.identificadorDocumento).toEqual(documento.identificador);
      expect(dados.tipoDocumento).toEqual(documento.tipo);
      expect(dados.identificadorItem).toEqual(item.identificador);
      expect(dados.movimento.serie.identificador).toEqual(loteSerie.identificador);
      expect(dados.movimento.lote).toBeUndefined();
      expect(dados.movimento.quantidade).toEqual(quantidade);
      expect(wrapperTeste.vm.obterResponsavelAtualSimplificado).toHaveBeenCalled();
    });
  });

  it('Deve exibir uma mensagem flutuante quando notificar um erro de registro de uma movimentação.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item: {
          produto: {},
          movimentos: []
        }
      }
    });

    let metodo = jest.fn();
    wrapperTeste.vm.$mensagemFlutuante.erro = metodo;

    let erro = { statusText: 'erro de registro' };
    wrapperTeste.vm.notificarErroDeRegistro(erro);
    let mensagem = {
      titulo: "Não foi possível registrar",
      mensagem: erro.statusText
    };
    expect(metodo).toHaveBeenCalledWith(mensagem);

    erro = 'erro de registro';
    wrapperTeste.vm.notificarErroDeRegistro(erro);
    mensagem = {
      titulo: "Não foi possível registrar",
      mensagem: erro
    };
    expect(metodo).toHaveBeenCalledWith(mensagem);
  });

  it('Deve informar a quantidade pendente corretamente para itens que controlam série.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item: {
          quantidade: 5,
          produto: {
            controleLoteSerie: 'SERIE'
          },
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.informarQuantidadePendente();
    expect(wrapperTeste.vm.quantidadeInformada).toEqual(1);
  });

  it('Deve informar a quantidade pendente corretamente para itens que não controlam série.', () => {
    let item = {
      quantidade: 5,
      produto: {
        controleLoteSerie: 'NENHUM'
      },
      movimentos: []
    };

    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item
      }
    });

    wrapperTeste.vm.informarQuantidadePendente();
    expect(wrapperTeste.vm.quantidadeInformada).toEqual(item.quantidade);
  });

  it('Deve disparar os eventos corretamente.', () => {
    var wrapperTeste = mount(ItemSeparacao, {
      mocks: {
        $vuetify: {
          breakpoint: {}
        }
      },
      store,
      router,
      propsData: {
        documento: {},
        item: {
          quantidade: 5,
          produto: {
            controleLoteSerie: 'NENHUM'
          },
          movimentos: []
        }
      }
    });

    wrapperTeste.vm.onAnteriorClick();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.emitted().onAnteriorClick).toBeTruthy();
    });

    wrapperTeste.vm.onProximoClick();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.emitted().onProximoClick).toBeTruthy();
    });

    wrapperTeste.vm.exibirJanela = true;
    wrapperTeste.vm.fecharJanela();
    wrapperTeste.vm.$nextTick(() => {
      expect(wrapperTeste.emitted().fecharJanela).toBeTruthy();
      expect(wrapperTeste.vm.exibirJanela).toBeFalsy();
    });
  });
});