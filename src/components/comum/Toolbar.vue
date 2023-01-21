<template>
  <div>
    <v-toolbar
      class="toolbar-bimer-up"
      :extended="extended"
      :prominent="prominent"
      :dense="dense"
      :collapse="collapse"
      :text="text"
      :extension-height="extensionHeight"
      height="50px"
    >
      <v-toolbar-title>
        <v-img
          :src="require('@/assets/Bimer_up_branco.png')"
          contain
          height="48"
          width="152"
          max-width="152"
          @click="$vuetify.goTo(0)"
        />
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="centralizar-menu" v-if="$vuetify.breakpoint.mdAndUp">
        <template v-for="(item, index) in componentesBimer">
          <v-menu
            :v-model="menuValue"
            :open-on-hover="openOnHover"
            offset-y
            :key="index"
            :close-on-click="fecharComClique"
            :close-on-content-click="exibirItensEmMenuSecundario(item) || !item.contemSubItens"
            :id="'menu-'+index"
            :ref="'menu-'+index"
          >
            <template v-slot:activator="{ on }">
              <v-btn v-acesso="item.acesso" text class="botao-menu-bimerup cor-texto-principal-menu" v-on="on">
                <span>{{ item.title }}</span>
                <v-icon class="seta-para-baixo_">arrow_drop_down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-acesso="menu.acesso" v-for="(menu, menu_index) in item.itens" :key="menu_index">
                <v-list-item-title
                  :class="menu.title===rotasFaturamento.controleDeOrcamentoDeLocacao.grupo ? 'menu-badge-beta': ''"
                  v-if="!menu.itens || menu.itens.some(i => i.menuSecundario)"
                  @click="menuSelecionado(menu.path)"
                >
                  {{ menu.title }}
                </v-list-item-title>

                <v-menu
                  :v-model="submenuValue"
                  offset-x
                  open-on-hover
                  :key="menu_index"
                  :id="'submenu-'+menu_index"
                  :ref="'submenu-'+menu_index"
                  v-else
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-acesso="menu.acesso" text class="botao-submenu-bimerup cor-texto-principal-menu_" v-on="on">
                      <span>{{ menu.title }}</span>
                      <v-icon dark>arrow_right</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item v-acesso="submenu.acesso" v-for="(submenu, submenu_index) in menu.itens" :key="submenu_index">
                      <v-list-item-title @click="menuSelecionado(submenu.path)">{{ submenu.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-app-bar-nav-icon
        dark
        v-show="!$vuetify.breakpoint.mdAndUp"
        @click="menuAtivado = !menuAtivado"
      ></v-app-bar-nav-icon>

      <template>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              v-show="notificacoes.exibirIcone"
              icon
              :class="`configuracoes-menu-info info-notificacao ${notificacoes.lista.length === 0 ? 'sem-notificacoes' : ''}`"
            >
              <v-badge
                overlap
                bordered
                color="red"
                :value="notificacoes.lista.length > 0"
                :content="notificacoes.lista.length"
              >
                <v-icon class="icone-notificacao">notifications</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list v-if="notificacoes.lista.length > 0">
            <v-list-item class="notificacao-item"
              v-for="(notificacao, indice) in notificacoes.lista"
              :key="indice"
              @click="direcionar(notificacao)"
            >
              <v-list-item-title>{{ notificacao.descricao }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu offset-y class="configuracoes-menu-info info-usuario">
          <template v-slot:activator="{ on }">
            <v-btn text class="botao-menu-bimerup cor-texto-principal-menu" v-on="on">
              <v-img
                :src="imagemUsuarioLogado"
                :lazy-src="imagemUsuarioPadrao"
                id="avatarPadrao"
                class="avatar-usuario"
                :alt="usuarioLogado.nomeLogin"
                :title="usuarioLogado.nomeLogin"
              ></v-img>
              <span class="usuario-logado-header_" v-show="$vuetify.breakpoint.mdAndUp">{{usuarioLogado.nomeLogin}}</span>
              <v-icon class="seta-para-baixo_">arrow_drop_down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title @click="realizarLogout()">
                <v-icon class="seta-para-baixo_">exit_to_app</v-icon>
                <span>Sair</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn icon class="configuracoes-menu-info info-ajuda display-none">
          <v-icon class="cor-texto-principal-menu">help</v-icon>
        </v-btn>
      </template>
    </v-toolbar>

    <v-navigation-drawer
      v-model="menuAtivado"
      class="menu-mobile"
      fixed
      temporary
    >
      <v-list nav>
        <v-list-group
          v-for="(item, index) in componentesBimer"
          :key="index"
          :id="'menu-mobile-' + index"
          :ref="'menu-mobile-' + index"
          no-action
          sub-group
          v-acesso="item.acesso"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>

          <template v-for="(menu, menu_index) in item.itens">
            <v-list-item
              v-if="!Array.isArray(menu.itens) || (menu.itens.length == 0)"
              :id="'submenu-mobile-' + menu_index"
              :ref="'submenu-mobile-' + menu_index"
              :key="menu_index"
              v-acesso="menu.acesso"
            >
              <v-list-item-title @click="menuSelecionado(menu.path)">
                {{ menu.title }}
              </v-list-item-title>
            </v-list-item>

            <v-list-group
              class="ml-4"
              v-else
              :key="menu_index"
              :id="'submenu-mobile-' + menu_index"
              :ref="'submenu-mobile-' + menu_index"
              sub-group
              v-acesso="menu.acesso"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(submenu, submenu_index) in menu.itens"
                :key="submenu_index"
                link
                v-acesso="submenu.acesso"
              >
                <v-list-item-title @click="menuSelecionado(submenu.path)">
                  {{ submenu.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-flex mt-12 v-if="exibirMenuSecundario">
      <v-tabs
        :value="abaSelecionada"
        centered
        class="menu-secundario-cdl"
        slider-color="primary"
        height="40"
      >
        <v-tab
          v-for="(componente, indice) in componentesMenuSecundario"
          :key="`menuSecundario-${indice}`"
          :to="componente.path"
          v-acesso="componente.acesso"
        >
          <v-icon left>{{componente.icon}}</v-icon>
          {{componente.title}}
        </v-tab>
      </v-tabs>
    </v-flex>
  </div>
</template>

<script>
import router from "@/router";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants";
import * as ambiente from "../../../vue.enviroment.config";
import apiPessoa from "@/api/sistemas-gerais/pessoa-api";
import notificacoesMixin from "@/mixins/sistema/notificacao/notificacoes-mixin.js";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";
import { OPCOES_STORE_USUARIO } from "@/store/modules/usuario";

export default {
  mixins: [notificacoesMixin],

  data: () => ({
    openOnHover: false,
    fecharComClique: true,
    fecharComCliqueFora: false,
    menuValue: false,
    submenuValue: false,
    extended: false,
    extendedSlot: false,
    prominent: false,
    menuAtivado: false,
    dense: false,
    collapse: false,
    text: false,
    extensionHeight: 48,
    componentesBimer: null,
    componentesMenuSecundario: null,
    usuarioLogado: {},
    imagemUsuarioPadrao: require("@/assets/user.jpg"),
    imagemUsuarioLogado: undefined,
    notificacoes: {
      lista: [],
      exibirIcone: false
    },
    abaSelecionada: 0,
    exibirMenuSecundario: false,
    rotasFaturamento: ROTAS_FATURAMENTO_METADATA
  }),

  created: function() {
    this.imagemUsuarioLogado = this.imagemUsuarioPadrao;
    this.componentesBimer = this.converterRotasEmItensDoMenu(router);
  },

  mounted: function() {
    this.definirPropriedadeCloseDependentsParaOsItensDoMenu();
    this.obterUsuarioLogado();
    this.obterImagemUsuarioLogado();
    this.obterNotificacoes(this.$route);
  },

  watch: {
    $route(destino) {
      this.obterNotificacoes(destino);
      this.obterRotaParaAbaSelecionada(destino);
      this.verificarExibicaoMenuSecundario(destino);
      this.componentesMenuSecundario = this.obterItensMenuSecundario(destino);
    },

    '$vuetify.breakpoint.mdAndUp'() {
      this.verificarExibicaoMenuSecundario(this.$route);
    },
  },

  methods: {
    obterRotaParaAbaSelecionada(destino) {
      var rota = router.options.routes.find(r => r.name == destino.name);
      this.abaSelecionada = rota.agrupamento;
    },

    verificarExibicaoMenuSecundario(destino) {
      var sistema = router.options.routes.find(r => r.name == destino.name);
      this.exibirMenuSecundario = this.$vuetify.breakpoint.mdAndUp && router.options.routes.some(
        r => r.menuSecundario && (r.familia == sistema.familia) && (r.grupo == sistema.grupo)
      );
    },

    obterItensMenuSecundario(destino) {
      var lista = [];

      var sistema = router.options.routes.find(r => r.name == destino.name);

      this.componentesBimer.forEach(nivelUm => {
        nivelUm.itens.forEach(nivelDois => {
          /* Código abaixo comentado pois no nível dois os grupos são incluídos sem informação de menuSecundario.
            Atualmente, não se aplica à nenhum caso existente. */
          // if (nivelDois.menuSecundario && (nivelDois.familia == sistema.familia) && (nivelDois.nomeGrupo == sistema.grupo)) {
          //   lista.push(nivelDois);
          // } else {
            nivelDois.itens && nivelDois.itens.forEach(nivelTres => {
              if (nivelTres.menuSecundario && (nivelTres.familia == sistema.familia) && (nivelTres.nomeGrupo == sistema.grupo)) {
                lista.push(nivelTres);
              }
            });
          // }
        });
      });

      return lista;
    },

    direcionar(notificacao){
      this.$router.push(notificacao.rota).catch(() => {});
    },

    obterUsuarioLogado() {
      this.usuarioLogado =  ambiente.obterDadosDoUsuarioLogado();
      this.$store.dispatch(OPCOES_STORE_USUARIO.ACTIONS.ALTERAR_USUARIO_LOGADO, this.usuarioLogado);
    },

    obterImagemUsuarioLogado() {
      if (!this.usuarioLogado.identificadorFuncionario) {
        this.imagemUsuarioLogado = this.imagemUsuarioPadrao;
        return;
      }

      apiPessoa.localizarPessoaComFoto(this.usuarioLogado.identificadorFuncionario)
        .then(pessoas => {
          let pessoa = Array.isArray(pessoas) && pessoas.length && pessoas[0];
          this.imagemUsuarioLogado = pessoa.foto || this.imagemUsuarioPadrao;
        })
        .catch(() => this.imagemUsuarioLogado = this.imagemUsuarioPadrao);
    },

    obterNotificacoes(rota) {
      this.notificacoes.lista = [];
      this.notificacoes.exibirIcone = false;
      this.obterNotificacoesGerais(rota, this.notificacoes, this.usuarioLogado);
    },

    definirPropriedadeCloseDependentsParaOsItensDoMenu() {
      for (let index = 0; index < this.componentesBimer.length; index++) {
        Array.isArray(this.$refs["menu-" + index])
          && this.$refs["menu-" + index][0]
          && (this.$refs["menu-" + index][0].closeDependents = false);
      }
    },

    menuSelecionado(path) {
      this.$router.push(`${path}`).catch(() => {});
    },

    subMenuAberto(index) {
      if (!this.$refs["submenu-" + index]) {
        return false;
      }

      return !!(this.$refs["submenu-" + index][0].isActive);
    },

    converterRotasEmItensDoMenu(rotas) {
      var rotasDefinidas = rotas.options.routes;
      var componentesParaOMenu = this.obterComponentesBaseParaCriacaoDoMenu();

      for (var indiceMenu = 0; indiceMenu < componentesParaOMenu.length; indiceMenu++) {
        var rotasPorFamilia = rotasDefinidas.filter(
          rota =>
            rota.familia.toLowerCase() ===
            componentesParaOMenu[indiceMenu].title.toLowerCase()
        );

        if (rotasPorFamilia.length === 0) {
          componentesParaOMenu.splice(indiceMenu, 1);
          indiceMenu--;
        } else {
          rotasPorFamilia.forEach(rota => {
            componentesParaOMenu =
              rota.naoExibir !== undefined && rota.naoExibir
                ? componentesParaOMenu
                : this.obterComponenteParaOMenuComItemAdicionado(componentesParaOMenu, indiceMenu, rota);
          });
        }
      }

      return componentesParaOMenu;
    },

    obterComponenteParaOMenuComItemAdicionado(componente, indice, rota) {
      var resultado = rota.grupo === undefined
        ? this.adicionarItemSemGrupoNoMenu(componente, indice, rota)
        : this.adicionarItemComGrupoNoMenu(componente, indice, rota);

      return resultado;
    },

    adicionarItemComGrupoNoMenu(componente, indice, rota) {
      var indiceSubMenu = componente[indice].itens.findIndex(
        itemMenu => itemMenu.title.toLowerCase() === rota.grupo.toLowerCase()
      );

      componente[indice].contemSubItens = true;

      if (indiceSubMenu === -1) {
        return this.adicionarItemNoMenuCriandoOGrupo(componente, indice, rota);
      }

      return this.adicionarItemNoMenuSemCriarOGrupo(componente, indice, rota, indiceSubMenu);
    },

    adicionarItemNoMenuCriandoOGrupo(componente, indice, rota) {
      componente[indice].itens.push({
        nomeGrupo: rota.grupo,
        familia: rota.familia,
        icon: "",
        title: rota.grupo,
        path: this.obterUrlDoGrupo(rota.grupo),
        acesso: this.obterAcessoDoGrupo(rota.grupo),
        menuSecundario: false,
        itens: [this.obterContratoDoItemPreenchido(rota)]
      });

      return componente;
    },

    adicionarItemNoMenuSemCriarOGrupo(componente, indice, rota, indiceSubMenu) {
      componente[indice].itens[indiceSubMenu].itens.push(
        this.obterContratoDoItemPreenchido(rota)
      );

      return componente;
    },

    adicionarItemSemGrupoNoMenu(componente, indice, rota) {
      componente[indice].itens.push(this.obterContratoDoItemPreenchido(rota));

      return componente;
    },

    obterContratoDoItemPreenchido(rota) {
      var contrato = {
        nomeGrupo: rota.grupo,
        familia: rota.familia,
        icon: rota.icon,
        title: rota.title,
        path: rota.path,
        acesso: rota.acesso,
        menuSecundario: rota.menuSecundario
      };

      return contrato;
    },

    obterComponentesBaseParaCriacaoDoMenu() {
      return [
        {
          icon: "mdi-clock",
          title: "CRM",
          path: "",
          contemSubItens: false,
          itens: []
        },
        {
          icon: "mdi-clock",
          title: "geral",
          path: "",
          contemSubItens: false,
          itens: []
        },
        {
          icon: "mdi-clock",
          title: "estoque",
          path: "",
          contemSubItens: false,
          itens: []
        },
        {
          icon: "mdi-clock",
          title: "financeiro",
          path: "",
          contemSubItens: false,
          itens: []
        },
        {
          icon: "mdi-clock",
          title: "faturamento",
          path: "",
          contemSubItens: false,
          itens: [],
          acesso: ACESSOS_BIMER_UP.FATURAMENTO.SELF
        }
      ];
    },

    obterAcessoDoGrupo(nomeGrupo) {
      switch (nomeGrupo) {
        case ROTAS_FATURAMENTO_METADATA.dashboardLocacao.grupo:
          return ACESSOS_BIMER_UP.FATURAMENTO.CONTROLE_LOCACAO.SELF;
        default: return '';
      }
    },

    obterUrlDoGrupo(nomeGrupo) {
      switch (nomeGrupo) {
        case ROTAS_FATURAMENTO_METADATA.dashboardLocacao.grupo:
          return ROTAS_FATURAMENTO_METADATA.dashboardLocacao.path;
        default: return '';
      }
    },

    exibirItensEmMenuSecundario(menu) {
      return menu.itens.some(
        submenu => Array.isArray(submenu.itens)
          && submenu.itens.some(item => item.menuSecundario)
      );
    },

    realizarLogout() {
      localStorage.removeItem("configuracoes");
      let usuario = ambiente.obterUsuarioLogado();

      usuario.valores[0].valor.Senha = null;

      window.localStorage.setItem("usuario", btoa(JSON.stringify(usuario)));
      ambiente.redirecionarParaAutenticacao();
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-badge-beta:before{
  content: "beta";
  position: fixed;
  width: 60px;
  height: 20px;
  background: #EE8E4A;
  top: 4px;
  right: -16px;
  text-align: center;
  font-size: 10px;
  font-family: sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  color: #fff;
  line-height: 22px;
  transform: rotate(45deg);
}

.centralizar-menu {
  margin-left: 85px;
}

.v-menu__content {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

::v-deep .v-navigation-drawer.menu-mobile {
  z-index: 1000;
}

::v-deep .v-navigation-drawer.menu-mobile .v-list-item__title:first-letter {
  text-transform: capitalize;
}

::v-deep .v-navigation-drawer.menu-mobile .v-list-group--disabled .v-list-item__title,
::v-deep .v-navigation-drawer.menu-mobile .v-list-group--disabled .v-icon {
  color: $btn-disabled-color;
}

.theme--light.v-toolbar.toolbar-bimer-up {
  background-color: $cor_primaria;
  position: fixed;
  z-index: 10;
  width: 100%;
  padding: 0;
}

.v-btn.theme--light.botao-menu-bimerup,
.botao-menu-bimerup.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--text) {
  background-color: transparent;
  box-shadow: none;
  text-transform: capitalize;
  margin: 0;
  height: inherit;
}

::v-deep .v-list-item button,
.v-btn.theme--light.botao-submenu-bimerup,
.botao-submenu-bimerup.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--text) {
  background-color: transparent;
  box-shadow: none;
  font-size: 13px;
  font-weight: 400;
  text-transform: initial;
  margin-left: 0px;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  text-align: right;
  margin: 0px;
  padding: 12px 16px;
  height: 100%;
}

::v-deep .botao-submenu-bimerup .v-btn__content {
  justify-content: left;
}

.link-bimer-up,
.link-bimer-up:hover,
.link-bimer-up:focus,
.link-bimer-up:visited .link-bimer-up:active {
  font-size: 20px;
  color: $white;
  text-decoration: none;
}

.theme--light.v-btn.cor-texto-principal-menu,
.v-btn .v-btn__content .v-icon.cor-texto-principal-menu {
  color: $white;
  font-weight: normal;
}

.theme--light.v-btn.cor-texto-principal-menu:disabled,
.v-btn .v-btn__content .v-icon.cor-texto-principal-menu:disabled {
  color: $btn-disabled-color;
}

.botao-submenu-bimerup.v-btn--active:before,
.botao-submenu-bimerup.v-btn:focus:before {
  background-color: transparent;
}

::v-deep .v-list-item {
  padding-left: 0px;
  padding-right: 0px;

  cursor: pointer;
}

::v-deep .v-list-item .v-list-item__title {
  height: 100%;
  padding: 16px 16px;
}

::v-deep .v-list-item .v-list-item__title:hover {
  background-color: $very-light-gray;
}
::v-deep .v-btn.v-size--default {
  font-size: 13px;
}

.avatar-usuario {
  border-radius: 100%;
  width: 30px;
  height: 30px;
  margin-right: 5px;
  margin-top: -2px;
  box-shadow: 0 0 3px #fff;
}

::v-deep
  .v-toolbar__content
  .v-btn.v-btn--icon.v-size--default.configuracoes-menu-info.info-notificacao,
::v-deep
  .v-toolbar__content
  .v-btn.v-btn--icon.v-size--default.configuracoes-menu-info.info-ajuda {
  margin: 0px;
  width: auto;
  color: $white;
}

::v-deep
  .v-toolbar__content
  .v-btn.v-btn--icon.v-size--default.configuracoes-menu-info.info-notificacao.sem-notificacoes {
  color: #4876a9;
}

.info-notificacao .material-icons {
  color: inherit;
}

.display-none {
  display: none;
}

.v-list-item.v-list-item--link.notificacao-item {
  cursor: pointer;
}

::v-deep .v-slide-group__content.v-tabs-bar__content {
  background-color: $bg_grid;
  border-bottom: 1px solid #c9c9c9;
}

::v-deep .v-toolbar {
  box-shadow: none;
}

.menu-secundario-cdl {
  position: fixed;
  z-index: 10;
  width: 100%;
  padding: 0;
}

::v-deep .menu-secundario-cdl > .v-tabs-bar .v-tabs-bar__content {
  justify-content: center;
}

::v-deep .menu-secundario-cdl > .v-tabs-bar .v-tabs-bar__content .v-tab {
  margin: 0;
}
</style>