import notificacoesControleDeEstoqueMixin from "@/mixins/sistema/notificacao/notificacoes-controle-de-estoque-mixin.js";
import notificacoesLocacaoCacheMixin from "@/mixins/sistema/notificacao/notificacoes-locacao-cache-mixin.js";

const notificacoesMixin = {
  mixins: [
    notificacoesControleDeEstoqueMixin,
    notificacoesLocacaoCacheMixin
  ],

  methods: {
    obterNotificacoesGerais(rota, notificacoes, usuario) {
      this.obterNotificacoesDoControleDeEstoque(rota, notificacoes, usuario.identificadorFuncionario);
      this.obterNotificacoesLocacaoCache(notificacoes, usuario.identificador);
    }
  }
}

export default notificacoesMixin;