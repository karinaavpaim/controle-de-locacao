'use strict';

import { mount } from '@vue/test-utils';
import rotas from '../../fakes/comum/rotas.json';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import Toolbar from '@/components/comum/Toolbar.vue';
import { TIPOS_ACESSO_SISTEMA } from '@/constants/geral/usuario/sistema-acesso-constants';
import { OPCOES_STORE_ACESSOS } from "@/store/modules/acessos";
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js'
import { ROTAS_CRM_METADATA } from '@/constants/router/crm-router-constants.js'
import apiPessoa from "@/api/sistemas-gerais/pessoa-api";
let imagemUsuarioPadrao = require("@/assets/user.jpg");

describe('Toolbar.vue', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(Toolbar, {
      mocks: {
        $vuetify: {
          breakpoint: {
            mdAndUp: true
          }
        }
      },
      store,
      router,
      propsData: {}
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.openOnHover).toBeFalsy();
    expect(wrapper.vm.fecharComClique).toBeTruthy();
    expect(wrapper.vm.fecharComCliqueFora).toBeFalsy();
    expect(wrapper.vm.menuValue).toBeFalsy();
    expect(wrapper.vm.submenuValue).toBeFalsy();
    expect(wrapper.vm.extended).toBeFalsy();
    expect(wrapper.vm.extendedSlot).toBeFalsy();
    expect(wrapper.vm.prominent).toBeFalsy();
    expect(wrapper.vm.menuAtivado).toBeFalsy();
    expect(wrapper.vm.dense).toBeFalsy();
    expect(wrapper.vm.collapse).toBeFalsy();
    expect(wrapper.vm.flat).toBeFalsy();
    expect(wrapper.vm.extensionHeight).toEqual(48);
    expect(typeof wrapper.vm.componentesBimer).toBe('object');
  });

  it('Deve converter as rotas em itens do menu', () =>{
    var objetoComItensDoMenu = wrapper.vm.converterRotasEmItensDoMenu(rotas);

    expect(objetoComItensDoMenu.length).toBe(5);

    expect(objetoComItensDoMenu[0].title).toBe('CRM');
    expect(objetoComItensDoMenu[0].itens.length).toBe(2);
    expect(objetoComItensDoMenu[0].itens[0].itens.length).toBe(2);
    expect(objetoComItensDoMenu[0].itens[1].itens.length).toBe(2);

    expect(objetoComItensDoMenu[1].title).toBe('geral');
    expect(objetoComItensDoMenu[1].itens.length).toBe(3);
    expect(objetoComItensDoMenu[1].itens[0].itens).toBeUndefined();
    expect(objetoComItensDoMenu[1].itens[1].itens).toBeUndefined();
    expect(objetoComItensDoMenu[1].itens[2].itens).toBeUndefined();

    expect(objetoComItensDoMenu[2].title).toBe('estoque');
    expect(objetoComItensDoMenu[2].itens.length).toBe(1);
    expect(objetoComItensDoMenu[2].itens[0].itens.length).toBe(1);

    expect(objetoComItensDoMenu[3].title).toBe('financeiro');
    expect(objetoComItensDoMenu[3].itens.length).toBe(1);

    expect(objetoComItensDoMenu[4].title).toBe('faturamento');
    expect(objetoComItensDoMenu[4].itens.length).toBe(1);
    expect(objetoComItensDoMenu[4].itens[0].itens.length).toBe(2);
  });

  it('Deve validar se a propriedade CloseDependents está sendo definida como false para os itens do menu', () => {
    wrapper.vm.componentesBimer = wrapper.vm.converterRotasEmItensDoMenu(rotas);
    wrapper.vm.definirPropriedadeCloseDependentsParaOsItensDoMenu();

    var componentesBimerLocal = wrapper.vm.componentesBimer;

    for (let index = 0; index < componentesBimerLocal.length; index++) {
      expect(wrapper.vm.$refs['menu-'+index][0].closeDependents).toBe(false);
    }
  });

  it('Deve validar se a função subMenuAberto está retornando os resultados corretos', () => {
    var indexParaTeste = '0';
    wrapper.vm.$refs['submenu-'+indexParaTeste] = false;
    expect(wrapper.vm.subMenuAberto(indexParaTeste)).toBe(false);

    wrapper.vm.$refs['submenu-' + indexParaTeste] = true;
    wrapper.vm.$refs['submenu-' + indexParaTeste] = [{'isActive':true}];
    expect(wrapper.vm.subMenuAberto(indexParaTeste)).toBe(true);

    wrapper.vm.$refs['submenu-' + indexParaTeste] = true;
    wrapper.vm.$refs['submenu-' + indexParaTeste] = [{'isActive':false}];
    expect(wrapper.vm.subMenuAberto(indexParaTeste)).toBe(false);
  });

  it('Deve validar se a rota foi alterada corretamente para o menu selecionado.', () => {
    ROTAS_FATURAMENTO_METADATA.enderecoParaTeste = {
      name: '',
      path: '/endereco/para/teste',
      acesso: '000123'
    };

    store.dispatch(OPCOES_STORE_ACESSOS.ACTIONS.ALTERAR_ACESSOS, Promise.resolve([
      {
        identificador: ROTAS_FATURAMENTO_METADATA.enderecoParaTeste.acesso,
        tipo: TIPOS_ACESSO_SISTEMA.HABILITADO
      }
    ]));

    wrapper.vm.menuSelecionado(0, ROTAS_FATURAMENTO_METADATA.enderecoParaTeste.path);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.path).toBe(ROTAS_FATURAMENTO_METADATA.enderecoParaTeste.path);
    });
  });

  it('Deve obter as notificações.', () => {
    jest.spyOn(wrapper.vm, 'obterNotificacoesGerais').mockImplementation(() => {});

    wrapper.vm.notificacoes.lista = [1,2,3];
    wrapper.vm.notificacoes.exibirIcone = true;
    wrapper.vm.obterNotificacoes({});
    expect(wrapper.vm.obterNotificacoesGerais).toHaveBeenCalled();
    expect(wrapper.vm.notificacoes.lista).toEqual(expect.arrayContaining([]));
    expect(wrapper.vm.notificacoes.exibirIcone).toBeFalsy();
  });

  it('Deve validar o método direcionar.', () => {
    let notificacao = {
      rota: ROTAS_FATURAMENTO_METADATA.configuracaoControleLocacao.name
    }
    wrapper.vm.direcionar(notificacao);
    expect(wrapper.vm.$router.push({name: notificacao.rota})).toBeTruthy();
  });

  it('Deve validar o método obterRotaParaAbaSelecionada.', () => {
    let destino = { name: 'ControleDeOrcamentoDeLocacao' }
    let rota = { agrupamento: 1 }
    wrapper.vm.obterRotaParaAbaSelecionada(destino);
    expect(wrapper.vm.abaSelecionada).toBe(rota.agrupamento);
  });

  it('Deve validar o método verificarExibicaoMenuSecundario.', () => {
    let destino = { name: 'ControleDeOrcamentoDeLocacao' }
    wrapper.vm.verificarExibicaoMenuSecundario(destino);
    expect(wrapper.vm.exibirMenuSecundario).toBeTruthy();
  });

  it('Deve tentar redimensionar da tabela ao alterar o tamanho da tela.', () => {
    jest.spyOn(wrapper.vm, 'verificarExibicaoMenuSecundario').mockImplementation(() => {});
    wrapper.vm.$options.watch['$vuetify.breakpoint.mdAndUp'].call(wrapper.vm, true);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.verificarExibicaoMenuSecundario).toHaveBeenCalled();
    });
  });

  it('Deve obter a imagem do usuário logado quando este possuir uma imagem.', () => {
    var pessoa = { foto: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=' };
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([pessoa]));
    wrapper.vm.usuarioLogado = { identificadorFuncionario: "00A0000001" };
    wrapper.vm.obterImagemUsuarioLogado();
    wrapper.vm.$nextTick(() => {
      expect(apiPessoa.localizarPessoaComFoto).toHaveBeenCalledWith(wrapper.vm.usuarioLogado.identificadorFuncionario);
      expect(wrapper.vm.imagemUsuarioLogado).toEqual(pessoa.foto);
    });
  });

  it('Deve obter a imagem do usuário padrão quando o usuário logado não possuir uma imagem.', () => {
    var pessoa = { foto: undefined };
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([pessoa]));
    wrapper.vm.usuarioLogado = { identificadorFuncionario: "00A0000001" };
    wrapper.vm.obterImagemUsuarioLogado();
    wrapper.vm.$nextTick(() => {
      expect(apiPessoa.localizarPessoaComFoto).toHaveBeenCalledWith(wrapper.vm.usuarioLogado.identificadorFuncionario);
      expect(wrapper.vm.imagemUsuarioPadrao).toEqual(imagemUsuarioPadrao);
      expect(wrapper.vm.imagemUsuarioLogado).toEqual(wrapper.vm.imagemUsuarioPadrao);
    });
  });

  it('Deve obter a imagem do usuário padrão quando o usuário logado não possuir uma pessoa do tipo funcionário relacionada à ele.', () => {
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.resolve([]));
    wrapper.vm.usuarioLogado = { identificadorFuncionario: undefined };
    wrapper.vm.obterImagemUsuarioLogado();
    wrapper.vm.$nextTick(() => {
      expect(apiPessoa.localizarPessoaComFoto).not.toHaveBeenCalled();
      expect(wrapper.vm.imagemUsuarioPadrao).toEqual(imagemUsuarioPadrao);
      expect(wrapper.vm.imagemUsuarioLogado).toEqual(wrapper.vm.imagemUsuarioPadrao);
    });
  });

  it('Deve obter a imagem do usuário padrão quando ocorrer um erro ao consultar a imagem do usuário logado.', () => {
    jest.spyOn(apiPessoa, 'localizarPessoaComFoto').mockImplementation(() => Promise.reject());
    wrapper.vm.usuarioLogado = { identificadorFuncionario: "00A0000001" };
    wrapper.vm.obterImagemUsuarioLogado();
    wrapper.vm.$nextTick(() => {
      expect(apiPessoa.localizarPessoaComFoto).toHaveBeenCalledWith(wrapper.vm.usuarioLogado.identificadorFuncionario);
      expect(wrapper.vm.imagemUsuarioPadrao).toEqual(imagemUsuarioPadrao);
      expect(wrapper.vm.imagemUsuarioLogado).toEqual(wrapper.vm.imagemUsuarioPadrao);
    });
  });

  it('Deve obter os itens do menu secundário, dado qualquer rota que faça parte de um sistema que o utilize.', () => {
    var lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.dashboardLocacao);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.analiseDeResultados);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.controleDeModelosDeProposta);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.controleDeAdicionaisPersonalizados);
    validarListaDeItensDoMenu(lista);
    lista = wrapper.vm.obterItensMenuSecundario(ROTAS_FATURAMENTO_METADATA.configuracaoControleLocacao);
    validarListaDeItensDoMenu(lista);
  });

  function validarListaDeItensDoMenu(lista) {
    expect(Array.isArray(lista)).toBeTruthy();
    expect(lista.length).toEqual(7);
    expect(lista[0].title).toBe(ROTAS_FATURAMENTO_METADATA.dashboardLocacao.title);
    expect(lista[1].title).toBe(ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.title);
    expect(lista[2].title).toBe(ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.title);
    expect(lista[3].title).toBe(ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.title);
    expect(lista[4].title).toBe(ROTAS_FATURAMENTO_METADATA.controleDeModelosDeProposta.title);
    expect(lista[5].title).toBe(ROTAS_FATURAMENTO_METADATA.controleDeAdicionaisPersonalizados.title);
    expect(lista[6].title).toBe(ROTAS_FATURAMENTO_METADATA.configuracaoControleLocacao.title);
  }

  it('Deve obter uma lista vazia quando a rota informada fizer parte de um sistema que não utiliza o menu secundário.', () => {
    var lista = wrapper.vm.obterItensMenuSecundario(ROTAS_CRM_METADATA.dashboardContatoDeVenda);
    expect(Array.isArray(lista)).toBeTruthy();
    expect(lista.length).toEqual(0);
  });

  it('Deve invocar os métodos quando o watch da rota for chamado devido à uma navegação.', () => {
    jest.spyOn(wrapper.vm, 'obterNotificacoes').mockImplementation(() => {});
    jest.spyOn(wrapper.vm, 'obterRotaParaAbaSelecionada').mockImplementation(() => {});
    jest.spyOn(wrapper.vm, 'verificarExibicaoMenuSecundario').mockImplementation(() => {});
    jest.spyOn(wrapper.vm, 'obterItensMenuSecundario').mockImplementation(() => {});

    wrapper.vm.$options.watch['$route'].call(wrapper.vm, ROTAS_FATURAMENTO_METADATA.dashboardLocacao);
    expect(wrapper.vm.obterNotificacoes).toHaveBeenCalledWith(ROTAS_FATURAMENTO_METADATA.dashboardLocacao);
    expect(wrapper.vm.obterRotaParaAbaSelecionada).toHaveBeenCalledWith(ROTAS_FATURAMENTO_METADATA.dashboardLocacao);
    expect(wrapper.vm.verificarExibicaoMenuSecundario).toHaveBeenCalledWith(ROTAS_FATURAMENTO_METADATA.dashboardLocacao);
    expect(wrapper.vm.obterItensMenuSecundario).toHaveBeenCalledWith(ROTAS_FATURAMENTO_METADATA.dashboardLocacao);
  });
});