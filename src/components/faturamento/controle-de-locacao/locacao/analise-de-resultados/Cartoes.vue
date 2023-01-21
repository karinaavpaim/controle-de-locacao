<template>
  <v-app :id="id">
    <v-flex lg12>
      <v-row dense>
        <v-col cols="2">
          <v-card class="bg-card-orcado">
            <div class="d-flex flex-no-wrap">
              <v-icon class="material-icons">attach_money</v-icon>

              <div>
                <v-card-title class="valor-cards">{{ model.totalGeral.orcado | dinheiro }}</v-card-title>
                <v-card-subtitle class="subtitulo-cards">Orçado</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card class="bg-card-ajustado">
            <div class="d-flex flex-no-wrap">
              <v-icon class="material-icons">mode_edit</v-icon>

              <div>
                <v-card-title class="valor-cards">{{ model.totalGeral.ajustado | dinheiro }}</v-card-title>
                <v-card-subtitle class="subtitulo-cards">Ajustado</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card class="bg-card-realizado">
            <div class="d-flex flex-no-wrap">
              <v-icon class="material-icons">done_all</v-icon>

              <div>
                <v-card-title class="valor-cards">{{ model.totalGeral.realizado | dinheiro }}</v-card-title>
                <v-card-subtitle class="subtitulo-cards">Realizado</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card class="bg-card-pendente">
            <div class="d-flex flex-no-wrap">
              <v-icon class="material-icons">warning</v-icon>

              <div>
                <v-card-title class="valor-cards">{{ model.totalGeral.pendente | dinheiro }}</v-card-title>
                <v-card-subtitle class="subtitulo-cards">Pendente</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card class="bg-card-variacao">
            <div class="d-flex flex-no-wrap">
              <v-icon class="material-icons">swap_horiz</v-icon>

              <div>
                <v-card-title class="valor-cards">{{ model.totalGeral.variacao | dinheiro }}</v-card-title>
                <v-card-subtitle class="subtitulo-cards">Variação</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="2">
          <v-card class="bg-card-diferenca">
            <div class="d-flex flex-no-wrap">
              <v-icon class="material-icons">mdi-calculator</v-icon>

              <div>
                <v-card-title class="valor-cards">{{ model.totalGeral.diferenca | dinheiro }}</v-card-title>
                <v-card-subtitle class="subtitulo-cards">Diferença</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-app>
</template>

<script>
import mascaraDinheiro from "@/utils/mascara-dinheiro";

import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';

export default {
  props: {
    metaDados: { type: Object, default: () => new MetaDadosAnaliseResultadoModel }
  },

   model: {
    prop: "metaDados",
    event: "onChange"
  },
  watch:{
    metaDados(){
      this.model = this.metaDados;
    }
  },

  data() {
    return {
      id: 'cartoes',
      model: this.metaDados
    };
  },

  filters: {
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  }

};
</script>

<style lang="scss" scoped>
.material-icons {
  font-size: 25px;
  margin: 5px 0px 0px 5px;
  color: $white;
}

.valor-cards {
  color: $white;
  font-weight: 500;
  font-size: 17px;
  padding: 5px;
}

.subtitulo-cards {
  color: $white!important;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Roboto Condensed', sans-serif;
  text-transform: uppercase;
  padding: 5px;
}

.bg-card-orcado {
  border: 0;
  background-color: #328ABA;
  height: 60px;
}

.bg-card-ajustado {
  border: 0;
  background-color: #C55288;
  height: 60px;
}

.bg-card-realizado {
  border: 0;
  background-color: #44B08A;
  height: 60px;
}

.bg-card-pendente {
  border: 0;
  background-color: #F2874E;
  height: 60px;
}

.bg-card-variacao {
  border: 0;
  background-color: #6A5C9F;
  height: 60px;
}

.bg-card-diferenca {
  border: 0;
  background-color: #00A6C9;
  height: 60px;
}
</style>