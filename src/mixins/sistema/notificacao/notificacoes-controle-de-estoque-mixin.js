import { ROTAS_ESTOQUE_METADATA } from "@/constants/router/estoque-router-constants.js";
import apiSelecaoDocumento from "@/api/estoque/controle-de-estoque/selecao-documento-api";

const notificacoesControleDeEstoqueMixin = {
  data() {
    return {
      assinaturaNotificacoes: undefined,
      rotasEstoque: ROTAS_ESTOQUE_METADATA
    }
  },

  methods: {
    obterNotificacoesDoControleDeEstoque(rota, notificacoes, identificadorFuncionario) {
      // Obtém notificações do controle de estoque somente se o usuário estiver navegando nesta área
      [
        this.rotasEstoque.controleDeEstoqueDocumentos.name,
        this.rotasEstoque.controleDeEstoqueSeparacao.name
      ].includes(rota.name) &&
        this.incluirNotificacoesDoControleDeEstoque(rota, notificacoes, identificadorFuncionario);
    },

    incluirNotificacoesDoControleDeEstoque(rota, notificacoes, identificadorFuncionario) {
      notificacoes.exibirIcone = true;
      !this.assinaturaNotificacoes && this.assinarNotificacoesDoControleDeEstoque(notificacoes, identificadorFuncionario);

      apiSelecaoDocumento.obterSelecoesDeDocumentos(null, identificadorFuncionario)
        .then(selecoes => selecoes.forEach(
          s => this.notificarSeparacaoAoFuncionario(s, notificacoes, identificadorFuncionario, rota)))
        .catch(() => { /*Não é necessário alertar caso não consiga obter as pendências */ });
    },

    assinarNotificacoesDoControleDeEstoque(notificacoes, identificadorFuncionario) {
      this.assinaturaNotificacoes = apiSelecaoDocumento.assinarNotificacoesSeparacao((notificacao) => {
        let separacao = notificacao && notificacao.selecaoDeDocumentosAtualizada;
        if (!separacao || separacao.finalizada) {
            this.removerSeparacaoDasNotificacoes(notificacoes, separacao);
            return;
        }
        this.notificarSeparacaoAoFuncionario(separacao, notificacoes, identificadorFuncionario, this.$route);
      });

      window.addEventListener('beforeunload', () => this.assinaturaNotificacoes.unsubscribe());
    },

    removerSeparacaoDasNotificacoes(notificacoes, separacao) {
        if (!separacao) return;
        let indice = notificacoes.lista.findIndex(
            n => n.rota.name == this.rotasEstoque.controleDeEstoqueSeparacao.name
            && n.rota.params.identificador == separacao.identificador);
        if (indice != -1)
            notificacoes.lista.splice(indice, 1);
    },

    notificarSeparacaoAoFuncionario(separacao, notificacoes, identificadorFuncionario, rota) {
      if (this.deveNotificarSeparacao(separacao, notificacoes, identificadorFuncionario, rota))
        notificacoes.lista.push({
          descricao: `Continuar separação ${separacao.identificador}`,
          rota: {
            name: this.rotasEstoque.controleDeEstoqueSeparacao.name,
            params: { identificador: separacao.identificador }
          }
        }
      );
    },

    deveNotificarSeparacao(separacao, notificacoes, identificadorFuncionario, rota){
      return separacao
          && !separacao.finalizada
          && !this.jaEstaNaRotaDeDestino(separacao, rota)
          && this.deveNotificarFuncionarioAtual(separacao, identificadorFuncionario)
          && !this.listaJaContemASeparacao(notificacoes, separacao);
    },

    jaEstaNaRotaDeDestino(separacao, rota) {
      return ((rota.name == this.rotasEstoque.controleDeEstoqueSeparacao.name)
          && (separacao.identificador == rota.params.identificador));
    },

    deveNotificarFuncionarioAtual(separacao, identificadorFuncionario) {
      return separacao.participantes.some(p => p.funcionario.identificador == identificadorFuncionario);
    },

    listaJaContemASeparacao(notificacoes, separacao) {
      return notificacoes.lista.some(
        n => ((n.rota.params && n.rota.params.identificador) == separacao.identificador)
        && (n.rota.name == this.rotasEstoque.controleDeEstoqueSeparacao.name));
    }
  }
}

export default notificacoesControleDeEstoqueMixin;