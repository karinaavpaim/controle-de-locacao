import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";

const BreadcrumbsMixin = {
  methods: {
    obterOpcoesMenuMovimentacao() {
      var opcoes = [];

      if (this.$route.name != ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name) {
        opcoes.push({
          nome: ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.title,
          rota: {
            name: ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name,
            params: { idLocacao: this.$route.params.idLocacao }
          }
        });
      }

      if (this.$route.name != ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name) {
        opcoes.push({
          nome: ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.title,
          rota: {
            name: ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name,
            params: { idLocacao: this.$route.params.idLocacao }
          }
        });
      }

      if (this.$route.name != ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name) {
        opcoes.push({
          nome: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.title,
          rota: {
            name: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name,
            params: { idLocacao: this.$route.params.idLocacao }
          }
        });
      }

      return opcoes;
    },

    obterOpcoesMenuGestao() {
      var opcoes = [];

      if (this.$route.name != ROTAS_FATURAMENTO_METADATA.ajustarLocacao.name) {
        opcoes.push({
          nome: ROTAS_FATURAMENTO_METADATA.ajustarLocacao.title,
          rota: Object.assign(
            { params: { idOrcamento: this.$route.params.idLocacao }},
            ROTAS_FATURAMENTO_METADATA.ajustarLocacao
          )
        });
      }

      if (this.$route.name != ROTAS_FATURAMENTO_METADATA.analiseDeResultados.name) {
        opcoes.push({
          nome: ROTAS_FATURAMENTO_METADATA.analiseDeResultados.title,
          rota: {
            name: ROTAS_FATURAMENTO_METADATA.analiseDeResultados.name,
            params: { idLocacao: this.$route.params.idOrcamento }
          }
        });
      }

      return opcoes;
    },

    navegarParaRota(rota, entidadeAtual) {
      switch (rota.name) {
        case ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name:
          if (!entidadeAtual.possuiMaterialOuEquipamento) {
            this.$mensagemFlutuante.aviso({
              titulo: `N??o ?? poss??vel requisitar`,
              mensagem: `Nenhum equipamento ou material foi encontrado no contrato ${entidadeAtual.codigoLocacao}.`
            });
            return;
          }

          break;
        case ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name:
          if ((entidadeAtual.codigoEnderecoEntrega == undefined) || (entidadeAtual.codigoEnderecoEntrega == '')) {
            this.$mensagemFlutuante.aviso({
              titulo: `N??o ?? poss??vel expedir`,
              mensagem: `O contrato ${entidadeAtual.codigoLocacao} n??o possui o endere??o de entrega informado.`
            });
            return;
          }

          if (!entidadeAtual.possuiMaterialOuEquipamento) {
            this.$mensagemFlutuante.aviso({
              titulo: `N??o ?? poss??vel expedir`,
              mensagem: `Nenhum equipamento ou material foi encontrado no contrato ${entidadeAtual.codigoLocacao}.`
            });
            return;
          }

          break;

         case ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name:
          if ((entidadeAtual.codigoEnderecoEntrega == undefined) || (entidadeAtual.codigoEnderecoEntrega == '')) {
            this.$mensagemFlutuante.aviso({
              titulo: `N??o ?? poss??vel medir`,
              mensagem: `O contrato ${entidadeAtual.codigoLocacao} n??o possui o endere??o de entrega informado.`
            });
            return;
          }

          break;
      }

      this.$router.push(rota);
    }
  }
};

export default BreadcrumbsMixin;