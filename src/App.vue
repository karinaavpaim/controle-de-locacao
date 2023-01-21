<template>
  <v-app id="app">
    <comum-toolbar v-if="exibirToolbar()"/>
    <v-content id="container" v-bind:class="{ 'removerAlturaToolbar' : exibirToolbar() }">
      <v-layout fill-height>
        <v-flex>
          <router-view></router-view>
          <mensagem-flutuante-plugin></mensagem-flutuante-plugin>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import routes from './router/routes';
import ComumToolbar from '@/components/comum/Toolbar.vue';
import AutenticacaoApi from '@/api/sistema/autenticacao-api';
import { ROTAS_SISTEMA_METADATA } from '@/constants/router/sistema-router-constants';
import { ROTAS_FATURAMENTO_METADATA } from './constants/router/faturamento-router-constants';
import { OPCOES_STORE_EMPRESA } from '@/store/modules/empresa'
import EmpresaModel from "@/models/geral/empresa-model";

const computed = {
  imagemUsuario() {
    return "https://randomuser.me/api/portraits/men/85.jpg"; //Pegar do backend
  },
  items() {
    // Aqui tem que ser criada uma lógica para montar os itens de acordo com as routes.
    // Não fiz isso ainda até que se defina qual menu vamos utilizar e como vamos utilizar.
    return routes.paths;
  }
};

export default {
  components: {
    ComumToolbar
  },
  data: () => ({
    drawer: {
      // sets the open status of the drawer
      open: true,
      // sets if the drawer is shown above (false) or below (true) the toolbar
      clipped: false,
      // sets if the drawer is CSS positioned as 'fixed'
      fixed: false,
      // sets if the drawer remains visible all the time (true) or not (false)
      permanent: true,
      // sets the drawer to the mini variant, showing only icons, of itself (true)
      // or showing the full drawer (false)
      mini: true
    },
    toolbar: {
      fixed: false,
      // sets if the toolbar contents is leaving space for drawer (false) or not (true)
      clippedLeft: false
    },
    footer: {
      // sets the CSS position of the footer
      fixed: true,
      // sets if the footer is full width (true) or gives space to the drawer (false)
      clippedLeft: true
    }
  }),

  beforeCreate(){
    // carregar empresa inicial no store, assim que o app é carregado
    this.$store.dispatch(OPCOES_STORE_EMPRESA.ACTIONS.ALTERAR_EMPRESA_ATUAL, new Promise(
      (resolve, reject)=>{
        this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.LISTA_EMPRESAS].then((empresas)=>{
          resolve(new EmpresaModel(empresas[0]))
        }).catch(reject)
      }
    ))

  },

  beforeMount() {
    if (this.$router.history.pending && this.$router.history.pending.fullPath.includes('?user=') ||
        this.$router.history.current && this.$router.history.current.fullPath.includes('?user=')){
      
      let usuarioBase64 = this.$router.history.pending ? 
        this.$router.history.pending.query.user : 
        this.$router.history.current.query.user;

      localStorage.setItem('usuario', usuarioBase64);

      this.$router.push({
        name: this.$router.history.pending
          ? this.$router.history.pending.name
          : this.$router.history.current.name
      });
    }
    if (!AutenticacaoApi.estaAutenticado() && (this.$route.name !== ROTAS_SISTEMA_METADATA.login.name)) {
      let redirect = this.$route.name === ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
                     ? ROTAS_SISTEMA_METADATA.login
                     : Object.assign(ROTAS_SISTEMA_METADATA.login, {query:{redirect: this.$route.path}})

      //TODO: REDIRECT REMOVIDO ATE QUE O LOGIN ESTEJA PRONTO NO GRAPHQL
      return redirect;
      //this.$router.push(redirect);
    }
  },

  name: "App",

  computed: Object.assign({}, mapState({ usuario: s => s.usuario.usuario }), computed),

  methods: {
    
    exibirToolbar(){
      let rotaLogin = this.$route.name == ROTAS_SISTEMA_METADATA.login.name;
      let rotaNaoEncontrado = this.$route.name == ROTAS_SISTEMA_METADATA.nao_encontrado.name;
      return  !(rotaLogin || rotaNaoEncontrado);
    },
    
    obterUsuarioAutenticadoPorParametroNaUrl() {
      let usuarioEncript = window.location.search;
      usuarioEncript = usuarioEncript.substring(6);

      if (usuarioEncript.length > 0) {
        return this.descriptografarUsuarioAutenticado(usuarioEncript);
      }

      return null;
    },

    obterUsuarioAutenticadoLocalStorage() {
      let usuarioEncript = window.localStorage.getItem("usuario");
      let parametrosUrl = window.location.search.substring(6);

      if (usuarioEncript == null && parametrosUrl == null) {
        window.localStorage.setItem("usuario", "");
        return null;
      }

      if (parametrosUrl.length > 0) {
        window.localStorage.setItem("usuario", parametrosUrl);

        let usuarioEncript = window.localStorage.getItem("usuario");

        return this.descriptografarUsuarioAutenticado(usuarioEncript);
      }
      return null;
    },

    obterUsuarioAutenticado() {
      let usuarioUrl = this.obterUsuarioAutenticadoPorParametroNaUrl();
      let usuarioStorage = this.obterUsuarioAutenticadoLocalStorage();

      if (usuarioStorage == null && usuarioUrl == null) {
        window.location.href = this.urlBimerUPPadrao;
      }

      if (usuarioStorage !== null) {
        return usuarioStorage;
      } else {
        return usuarioUrl;
      }
    },

    descriptografarUsuarioAutenticado(usuarioEncript) {
      let objetoUsuario = JSON.parse(atob(usuarioEncript));

      return {
        login: objetoUsuario.valores[0].valor.NomeLogin,
        senha: objetoUsuario.valores[0].valor.Senha,
        expirado: objetoUsuario.valores[0].valor.expirado,
        identificador: objetoUsuario.valores[0].valor.identificador,
        funcoes: objetoUsuario.valores[0].valor.Funcoes
      };
    },

    // changes the drawer to permanent
    makeDrawerPermanent() {
      this.drawer.permanent = true;
      // set the clipped state of the drawer and toolbar
      this.drawer.clipped = false;
      this.toolbar.clippedLeft = false;
    },
    // toggles the drawer variant (mini/full)
    toggleMiniDrawer() {
      this.drawer.mini = !this.drawer.mini;
    },
    // toggles the drawer type (permanent vs temporary) or shows/hides the drawer
    toggleDrawer() {
      if (this.drawer.permanent) {
        this.drawer.permanent = !this.drawer.permanent;
        // set the clipped state of the drawer and toolbar
        this.drawer.clipped = true;
        this.toolbar.clippedLeft = true;
      } else {
        // normal drawer
        this.drawer.open = !this.drawer.open;
      }
    }
  }
};
</script>

<style lang="scss">
</style>