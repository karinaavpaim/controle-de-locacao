import apiRegistroEmUso from "@/api/sistema/registro-em-uso-api";
import RegistroEmUsoModel from "@/models/geral/registro-em-uso";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import { ENTIDADES } from "@/constants/sistema/registro-em-uso-constants";

const RegistroEmUsoMixin = {
  data() {
    return {
      registroEmUso: new RegistroEmUsoModel(),
      registrandoUso: false,
      abertoEmOutroLocal: false,
      assinaturaNotificacoes: undefined,
      acaoRegistroJaEmUso: () => {},
      acaoUsoRegistrado: () => {},
      entidadesRegistroEmUso: ENTIDADES
    }
  },

  watch: {
    "$route.params"() {
      this._removerRegistroEmUso();
    },
  },

  destroyed() {
    this._removerRegistroEmUso();
  },

  mounted() {
    this.abertoEmOutroLocal = false;
  },

  beforeRouteLeave(destino, origem, next) {
    this._removerRegistroEmUso();
    next();
  },

  methods: {
    _removerAssinaturaNotificacoes() {
      if (!this.assinaturaNotificacoes) return;

      this.assinaturaNotificacoes.unsubscribe();
      window.removeEventListener('beforeunload', this.assinaturaNotificacoes.unsubscribe, false);
      this.assinaturaNotificacoes = undefined;
    },

    _assinarNotificacoes() {
      this.$nextTick(() => {
        this.assinaturaNotificacoes = apiRegistroEmUso.assinarNotificacoesRegistroEmUso(this._notificacaoRecebida);
        window.addEventListener('beforeunload', this.assinaturaNotificacoes.unsubscribe, false);
      });
    },

    _notificacaoRecebida(notificacao) {
      if (this.registrandoUso || this.abertoEmOutroLocal || !notificacao) return;

      notificacao = notificacao.notificacaoRegistroEmUso;
      let registroEmUsoAtualizado = notificacao && notificacao.registroEmUsoAtualizado;
      let registroNecessitaAtualizacao = notificacao && notificacao.registroNecessitaAtualizacao;

      if (this._registrosIguais(registroEmUsoAtualizado)) {
        this.abertoEmOutroLocal = true;
        this.notificarQueRegistroJaEstaEmUso(`Este registro foi aberto pelo seu usuário em outro local.`);
      }

      if (this._registrosIguais(registroNecessitaAtualizacao)) {
        this.registrarUso(
          registroNecessitaAtualizacao.identificadorEntidade,
          registroNecessitaAtualizacao.nomeEntidade);
      }
    },

    _registrosIguais(registroRecebido) {
      return !!registroRecebido
        && (this.registroEmUso.nomeUsuario == registroRecebido.nomeUsuario)
        && (this.registroEmUso.identificadorEntidade == registroRecebido.identificadorEntidade)
        && (this.registroEmUso.nomeEntidade == registroRecebido.nomeEntidade);
    },

    async registrarUso(identificador, nomeEntidade) {
      if (!identificador) return;

      this.registrandoUso = true;
      this._assinarNotificacoes();

      try {
        let resposta = await apiRegistroEmUso.registrarUso(identificador, nomeEntidade);
        this.registroEmUso = new RegistroEmUsoModel(resposta[0])
        this.acaoUsoRegistrado && this.acaoUsoRegistrado(identificador);
      } catch(erro) {
          this.notificarQueRegistroJaEstaEmUso(Array.isArray(erro) && erro[0] && erro[0].statusText);
      }

      this.registrandoUso = false;
    },

    _removerRegistroEmUso() {
      let identificador = this.registroEmUso.modeloValido() && this.registroEmUso.identificador;
      this.registroEmUso = new RegistroEmUsoModel();
      this._removerAssinaturaNotificacoes();

      if (!identificador || this.abertoEmOutroLocal) {
        return;
      }

      apiRegistroEmUso
        .removerRegistroEmUso(identificador)
        .catch((erro) => {
          this.$mensagemFlutuante.erro({
            titulo: "Não foi possível remover o registro em uso.",
            mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro,
          });
        });
    },

    notificarQueRegistroJaEstaEmUso(mensagem) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Não é possível acessar este registro no momento.`;
      cfgMsg.mensagem = mensagem;
      cfgMsg.exibirIconeFechar = false;
      cfgMsg.botaoPrimario.exibir = true;
      cfgMsg.botaoPrimario.texto = "Ok";
      cfgMsg.botaoPrimario.callback = () => {
        this.abertoEmOutroLocal = false;
        this._removerRegistroEmUso();
        this.acaoRegistroJaEmUso && this.acaoRegistroJaEmUso();
        this.$mensagemFlutuante.esconder();
      };

      cfgMsg.botaoSecundario.exibir = false;
      this.$mensagemFlutuante.interativo(cfgMsg);
    }
  }
};

export default RegistroEmUsoMixin;