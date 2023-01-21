import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";

const notificacaoPerdaDeDadosMixin = {
  beforeRouteLeave(to, from, next) {
    if(!this.deveAvisarQuePerderaDados){
      next()
      return;
    }

    let cfgMsg = new CfgMensagemFlutuante();
    cfgMsg.titulo = `Descartar alterações?`;
    cfgMsg.mensagem = this.mensagemDeConfirmacao;
    cfgMsg.botaoPrimario.texto = "Sim";
    cfgMsg.botaoPrimario.callback = next;
    cfgMsg.botaoSecundario.texto = "Não";
    cfgMsg.botaoSecundario.callback = ()=>{
      this.$mensagemFlutuante.esconder();
      next(false);
    };
    this.$mensagemFlutuante.confirmacao(cfgMsg);
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.emitirEvento);
  },

  created() {
    window.addEventListener('beforeunload', this.emitirEvento);
  },

  methods: {
    emitirEvento(evento) {
      return evento.returnValue = this.mensagemDeConfirmacao;
    }
  },

  data() {
    return {
      deveAvisarQuePerderaDados: true,
      mensagemDeConfirmacao: 'Ao confirmar, você perderá as alterações realizadas.'
    }
  }
};

export default notificacaoPerdaDeDadosMixin;
