<template>
  <div>
    <v-row>
      <v-col offset-md="9" align-self="end" cols="12" sm="3">
        <v-text-field
          v-model="pesquisar"
          append-icon="mdi-magnify"
          label="Pesquisar pela descrição"
          single-line
          hide-details
          @input="tratarPesquisaTreeview"
          key="id"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <div class="tree-view-cabecalho tree-view-cabecalho-apresentacao totalizador">
          <div>CATEGORIA</div>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" role="text">ORÇADO</div>
            </template>
            Itens ou Despesas adicionados no orçamento
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" role="text">AJUSTADO</div>
            </template>
            Itens ou Despesas ajustadas ou adicionados na Gestão
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" role="text">REALIZADO</div>
            </template>
            Itens ou Despesas Medidos
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" role="text">PENDENTE</div>
            </template>
            Pendente = Realizado - Ajustado
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" role="text">VARIAÇÃO</div>
            </template>
            Variação = Realizado - Ajustado - Pendente
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" role="text">DIFERENÇA</div>
            </template>
            Diferença = Ajustado - Orçado
          </v-tooltip>
        </div>
        <v-divider></v-divider>
      </v-col>

      <v-col cols="12">
        <v-treeview
          ref="tree"
          open-on-click
          :items="metaDados.detalhamento"
          :search="pesquisar"
          left
          item-key="identificador"
          item-text="descricao"
          hoverable
          dense
          activatable
          item-children="filhos"
        >
          <template v-slot:label="{ item }">
            <v-tooltip top v-if="(item.itemLocacao && item.itemLocacao.produto.identificador) == identificadorProdutoPadraoBimer">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" size="16" color="#f4511e" class="alinhamento-icone-padrao">
                  {{ item.status ? 'mdi-alert-decagram-outline' : '' }}
                </v-icon>
              </template>
              <span>Este item possui o produto padrão.</span>
            </v-tooltip>
            <v-tooltip top v-else>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" size="16" :class="obterClasseParaStatus(item.status)">
                  {{ item.status ? 'mdi-tag' : '' }}
                </v-icon>
              </template>
              <span>{{ obterDescricaoDoStatus(item.status) }}</span>
            </v-tooltip>
            <span :class="`${item.totalizador ? 'totalizador' : ''}`">{{ item.descricao }}</span>
          </template>
          <template v-slot:append="{ item }">
            <div :class="`tree-view-apresentacao ${item.totalizador ? 'totalizador' : ''}`">
              <div>
                <span>{{ item.orcado | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.ajustado | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.realizado | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.pendente | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.variacao | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.diferenca | dinheiro }}</span>
              </div>
            </div>
          </template>
        </v-treeview>
      </v-col>
    </v-row>

    <v-row v-if="metaDados.adicionaisPersonalizados.length">
      <v-layout
        @click="exibirAdicionaisPersonalizados = !exibirAdicionaisPersonalizados"
        justify-space-between
        align-center
        class="area-adicional-personalizado"
      >
        <v-divider />
        <v-icon class="flex-shrink-1 ml-1">
          {{ exibirAdicionaisPersonalizados ? "keyboard_arrow_down" : "keyboard_arrow_right" }}
        </v-icon>
        <span class="flex-shrink-1 mr-3">Adicionais&nbsp;Personalizados</span>
        <v-divider />
      </v-layout>
    </v-row>

    <v-row v-if="exibirAdicionaisPersonalizados && metaDados.adicionaisPersonalizados.length">
      <v-col cols="12">
        <v-treeview
          class="adicionais-personalizados-itens"
          open-on-click
          :items="metaDados.adicionaisPersonalizados"
          :search="pesquisar"
          left
          item-key="identificador"
          item-text="descricao"
          hoverable
          dense
          activatable
        >
          <template v-slot:label="{ item }">
            <span :class="`${item.totalizador ? 'totalizador' : ''}`">{{ item.descricao }}</span>
          </template>
          <template v-slot:append="{ item }">
            <div :class="`tree-view-apresentacao ${item.totalizador ? 'totalizador' : ''}`">
              <div>
                <span>{{ item.orcado | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.ajustado | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.realizado | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.pendente | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.variacao | dinheiro }}</span>
              </div>
              <div>
                <span>{{ item.diferenca | dinheiro }}</span>
              </div>
            </div>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
</div>
</template>

<script>
import mascaraDinheiro from "@/utils/mascara-dinheiro.js";
import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

export default {
  name: "TreeViewAnaliseDeResultados",
  props: {
    metaDados: { type: Object, default: () => new MetaDadosAnaliseResultadoModel },
    identificadorProdutoPadrao: { type: String, default: undefined }
  },

  model: {
    prop: "metaDados",
    event: "onChange"
  },

  watch: {
    metaDados() {
      this.model = this.metaDados;
    },
    identificadorProdutoPadrao() {
      this.identificadorProdutoPadraoBimer = this.identificadorProdutoPadrao;
    }
  },

  filters: {
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  },

  data () {
    return {
      pesquisar: "",
      exibirAdicionaisPersonalizados: false,
      abrir: [1],
      abrirTodos: false,
      ultimosAbertos: [],
      model: this.metaDados,
      identificadorProdutoPadraoBimer: this.identificadorProdutoPadrao,
    }
  },

  methods: {
    tratarPesquisaTreeview(val) {
      if (val) {
        if (!this.abrirTodos) {
          this.ultimosAbertos = this.abrir;
          this.abrirTodos = true;
          this.$refs.tree.updateAll(true);
        }
      } else {
        this.$refs.tree.updateAll(false);
        this.abrirTodos = false;
        this.abrir = this.ultimosAbertos;
      }
    },

    obterClasseParaStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].classe) || '';
    },

    obterDescricaoDoStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].descricao) || '';
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-view-cabecalho {
  padding: 10px;
  background-color: $bg_grid;
}

.tree-view-apresentacao {
  display: inline-flex;
  justify-content: space-between;
}

.tree-view-cabecalho-apresentacao {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  padding-left: 15px;
}

.tree-view-cabecalho-apresentacao > div:first-child {
  width: 70%;
  text-align: left;
}

::v-deep .v-treeview-node__label {
  text-align: left;
}

.tree-view-apresentacao div,
.tree-view-cabecalho-apresentacao div {
  min-width: 112px;
  text-align: end;
}

.totalizador {
  font-size: 13px;
  font-weight: 600;
}

::v-deep div.v-treeview-node.v-treeview-node--click {
  border-bottom: 1px solid #E8EEF1;
  border-top: 1px solid #E8EEF1;
}

::v-deep div.v-treeview-node.v-treeview-node--click:last-child,
::v-deep div.v-treeview-node.v-treeview-node--click:first-child {
  border-bottom: none;
}

::v-deep .area-adicional-personalizado > .v-icon:hover,
::v-deep .area-adicional-personalizado > span:hover {
  cursor: pointer;
}

::v-deep div:not([totalizador]) div.v-treeview-node__children > div.v-treeview-node:nth-child(odd){
  background-color: #F1F9FE;
}

::v-deep div.adicionais-personalizados-itens .v-treeview-node:nth-child(odd):not(:last-child) {
  background-color: #F1F9FE;
  border-bottom: 1px solid #E8EEF1;
}

::v-deep div.adicionais-personalizados-itens .v-treeview-node:nth-child(odd) {
  border-top: 1px solid #E8EEF1;
}
</style>