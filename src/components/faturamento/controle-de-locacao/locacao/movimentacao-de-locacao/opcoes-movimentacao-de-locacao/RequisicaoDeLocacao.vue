<template>
  <v-container fluid px-0 :id="id" :class="{ 'pt-0' : !equipamentos.length }">
    <v-row class="px-3 mb-5">
      <v-flex>
        <tabela-generica
          :id="'tabela-generica-equipamentos-'+id"
          :lista-colunas="colunasTabelaEquipamentos"
          :itens-tabela="equipamentos"
          coluna-chave="identificadorItemLocacao"
          titulo="Equipamentos"
          expandir-multiplos
          :exibirTitulo="!!equipamentos.length"
          :exibirBlocoSemDados="false"
          :itens-para-expandir.sync="itensParaExpandirEquipamentos"
        >
          <template v-slot:primeiras-colunas-personalizadas="{ item }">
            <td class="selo-tabela-generica">
              <v-badge avatar color="transparent" offset-y="6" offset-x="-6">
                <template v-slot:badge v-if="(item.produto.identificador == identificadorProdutoPadrao) || item.atendidoComCorte">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on="on">
                        <v-icon small :color="`${item.atendidoComCorte ? 'primary' : '#f4511e'}`">
                          {{ item.atendidoComCorte ? 'mdi-information-outline' : 'mdi-alert-decagram-outline' }}
                        </v-icon>
                      </v-avatar>
                    </template>
                    <span>{{ item.atendidoComCorte  ? 'Este item teve requisição atendida com corte.' : 'Este item possui o produto padrão.' }}</span>
                  </v-tooltip>
                </template>
              </v-badge>
            </td>
          </template>

          <template v-slot:ultimas-colunas-personalizadas="{ item }">
            <td>
              <!-- @HACK para forcar que o campo seja inteiro pois o input retorna string -->
              <v-text-field 
                :class="'textfield-equipamentos-quantidade-a-requisitar-'+id"
                @input="(valor)=>item.quantidadeARequisitar = valor && parseInt(valor)"
                hide-details
                :error="!item.quantidadeARequisitarValida()"
                v-model="item.quantidadeARequisitar"
                :disabled="!item.podeRequisitar()"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                class="input-acao-requisitar"
                type="number"
                min="0"
                @click="(e)=>e.stopPropagation()"
              ></v-text-field>
            </td>
          </template>

          <template v-slot:area-expandida="{ item }">
            <v-flex xs12 v-if="!item.baixas || !item.baixas.length">
              <v-layout wrap class="card-no-data py-6">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não existem baixas de requisições para devolver neste item.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-container fluid class="container-devolucao" v-else>
              <v-col cols="12" class="card-devolucao" :key="indice" v-for="(baixa, indice) in item.baixas">
                <v-row class="area-devolver">
                  <v-col cols="2">
                    <h4 class="label-area-expandida">{{`${baixa.lote?"Lote":"Série"}`}}</h4>
                    <p class="conteudo-area-expandida">{{dadosLoteOuSerie(baixa).codigo || "-"}}</p>
                  </v-col>
                  <v-col cols="3">
                    <h4 class="label-area-expandida">Descrição</h4>
                    <p class="conteudo-area-expandida">{{obterTextoObservacaoOuVazioDoLoteSerie(dadosLoteOuSerie(baixa))}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida">Requisição</h4>
                    <p class="conteudo-area-expandida">{{baixa.codigoRequisicao}}</p>
                  </v-col>
                  <v-col cols="2">
                    <h4 class="label-area-expandida">Data de baixa</h4>
                    <p class="conteudo-area-expandida">{{baixa.dataDaBaixa | dataFormatada}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Liberado</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{baixa.quantidade}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Expedido</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{baixa.quantidadeExpedida}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Em devolução</h4>
                    <v-tooltip top :disabled="!baixa.codigosRequisicoesEmDevolucao">
                      <template v-slot:activator="{ on }">
                        <p v-on="on" class="conteudo-area-expandida tipo-numero">{{baixa.quantidadeEmDevolucao}}</p>
                      </template>
                      <span>{{`Requisições aguardando atendimento: ${baixa.codigosRequisicoesEmDevolucao}`}}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida">Devolver</h4>
                    <!-- @HACK para forcar que o campo seja inteiro pois o input retorna string -->
                    <v-text-field 
                      :class="'textfield-equipamentos-quantidade-a-devolver-'+id"
                      @input="(valor)=>baixa.quantidadeADevolver = valor && parseInt(valor)"
                      hide-details 
                      v-model="baixa.quantidadeADevolver"
                      onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" 
                      class="input-acao-devolver" 
                      type="number"
                      min="0"
                      :error="!baixa.quantidadeADevolverValida()"
                      :disabled="baixa.quantidadeExpedida >= baixa.quantidade"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
          </template>
        </tabela-generica>

        <v-flex float-right v-if="equipamentos.length">
          <v-btn :id="'btn-requisitar-todos-equipamentos-'+id" class="btn-tertiary" text @click="requisitarTodosOsEquipamentos()" :disabled="desativarRequisitarTodos(equipamentos)">Requisitar todos</v-btn>
          <v-btn :id="'btn-limpar-requisitar-todos-equipamentos-'+id" class="btn-tertiary mr-0" text @click="limparTodosOsEquipamentos()" :disabled="desativarLimparTodos(equipamentos)">Limpar todos</v-btn>
        </v-flex>
      </v-flex>
    </v-row>

    <v-row class="px-3 mb-5">
      <v-flex>
        <tabela-generica
          :id="'tabela-generica-materiais-'+id"
          :lista-colunas="colunasTabelaMateriais"
          :itens-tabela="materiais"
          coluna-chave="identificadorItemLocacao"
          titulo="Materiais"
          expandir-multiplos
          :exibirTitulo="!!materiais.length"
          :exibirBlocoSemDados="false"
          :itens-para-expandir.sync="itensParaExpandirMateriais"
        >
          <template v-slot:primeiras-colunas-personalizadas="{ item }">
            <td class="selo-tabela-generica">
              <v-badge avatar color="transparent" offset-y="6" offset-x="-6">
                <template v-slot:badge v-if="(item.produto.identificador == identificadorProdutoPadrao) || item.atendidoComCorte">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on="on">
                        <v-icon small :color="`${item.atendidoComCorte ? 'primary' : '#f4511e'}`">
                          {{ item.atendidoComCorte ? 'mdi-information-outline' : 'mdi-alert-decagram-outline' }}
                        </v-icon>
                      </v-avatar>
                    </template>
                    <span>{{ item.atendidoComCorte  ? 'Este item teve requisição atendida com corte.' : 'Este item possui o produto padrão.' }}</span>
                  </v-tooltip>
                </template>
              </v-badge>
            </td>
          </template>

          <template v-slot:ultimas-colunas-personalizadas="{ item }">
            <td>
              <!-- @HACK para forcar que o campo seja inteiro pois o input retorna string -->
              <v-text-field 
                :class="'textfield-materiais-quantidade-a-requisitar-'+id"
                @input="(valor)=>item.quantidadeARequisitar = valor && parseInt(valor)"
                hide-details
                :error="!item.quantidadeARequisitarValida()"
                v-model="item.quantidadeARequisitar"
                :disabled="!item.podeRequisitar()"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                class="input-acao-requisitar"
                type="number"
                min="0"
                @click="(e)=>e.stopPropagation()"
              ></v-text-field>
            </td>
          </template>

          <template v-slot:area-expandida="{ item }">
            <v-flex xs12 v-if="!item.baixas || !item.baixas.length">
              <v-layout wrap class="card-no-data py-6">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não existem baixas de requisições para devolver neste item.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-container fluid class="container-devolucao" v-else>
              <v-col cols="12" class="card-devolucao" :key="indice" v-for="(baixa, indice) in item.baixas">
                <v-row class="area-devolver">
                  <v-col cols="2">
                    <h4 class="label-area-expandida">{{`${baixa.lote?"Lote":"Série"}`}}</h4>
                    <p class="conteudo-area-expandida">{{dadosLoteOuSerie(baixa).codigo || "-"}}</p>
                  </v-col>
                  <v-col cols="3">
                    <h4 class="label-area-expandida">Descrição</h4>
                    <p class="conteudo-area-expandida">{{obterTextoObservacaoOuVazioDoLoteSerie(dadosLoteOuSerie(baixa))}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida">Requisição</h4>
                    <p class="conteudo-area-expandida">{{baixa.codigoRequisicao}}</p>
                  </v-col>
                  <v-col cols="2">
                    <h4 class="label-area-expandida">Data de baixa</h4>
                    <p class="conteudo-area-expandida">{{baixa.dataDaBaixa | dataFormatada}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Liberado</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{baixa.quantidade}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Expedido</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{baixa.quantidadeExpedida}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Em devolução</h4>
                    <v-tooltip top :disabled="!baixa.codigosRequisicoesEmDevolucao">
                      <template v-slot:activator="{ on }">
                        <p v-on="on" class="conteudo-area-expandida tipo-numero">{{baixa.quantidadeEmDevolucao}}</p>
                      </template>
                      <span>{{`Requisições aguardando atendimento: ${baixa.codigosRequisicoesEmDevolucao}`}}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida">Devolver</h4>
                    <!-- @HACK para forcar que o campo seja inteiro pois o input retorna string -->
                    <v-text-field 
                      :class="'textfield-equipamentos-quantidade-a-devolver-'+id"
                      @input="(valor)=>baixa.quantidadeADevolver = valor && parseInt(valor)"
                      hide-details 
                      v-model="baixa.quantidadeADevolver"
                      onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" 
                      class="input-acao-devolver" 
                      type="number"
                      min="0"
                      :error="!baixa.quantidadeADevolverValida()"
                      :disabled="baixa.quantidadeExpedida >= baixa.quantidade"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
          </template>
        </tabela-generica>

        <v-flex float-right v-if="materiais.length">
          <v-btn :id="'btn-requisitar-todos-materiais-'+id" class="btn-tertiary" text @click="requisitarTodosOsMateriais()" :disabled="desativarRequisitarTodos(materiais)">Requisitar todos</v-btn>
          <v-btn :id="'btn-limpar-requisitar-todos-materiais-'+id" class="btn-tertiary mr-0" text @click="limparTodosOsMateriais()" :disabled="desativarLimparTodos(materiais)">Limpar todos</v-btn>
        </v-flex>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import TabelaGenerica from "@/components/comum/TabelaGenerica";
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_EQUIPAMENTOS, COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_MATERIAIS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import moment from "moment";
import SetorModel from '@/models/geral/setor-model';

export default {
  name: "RequisicaoDeLocacao",
  components: {
    'tabela-generica': TabelaGenerica
  },

  props: {
    itensDaTabela: { type: Array, required: false, default: ()=>[] },
    setorRequisitado: { type: SetorModel, required: false, default: ()=>new SetorModel },
    setorRequisitante: { type: SetorModel, required: false, default: ()=>new SetorModel },
    identificadorProdutoPadrao: { type: String, default: undefined }
  },

  computed: {
    equipamentos() {
      return this.itensDaTabela.filter((item)=>item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO)
    },

    materiais() {
      return this.itensDaTabela.filter((item)=>item.categoria === CATEGORIAS_ITEM.MATERIAL)
    }
  },

  filters: {
    dataFormatada: function(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY");
      }
      return "-";
    }
  },

  data() {
    return {
      id: 'requisicao-de-locacao',
      colunasTabelaEquipamentos: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_EQUIPAMENTOS,
      colunasTabelaMateriais: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_REQUISICAO_MATERIAIS,
      itensParaExpandirMateriais: [],
      itensParaExpandirEquipamentos: []
    }
  },

  methods: {
    dadosLoteOuSerie(baixa) {
      return (baixa.serie || baixa.lote) || {}
    },

    obterTextoObservacaoOuVazioDoLoteSerie(loteSerie) {
      return loteSerie 
        && loteSerie.observacao 
        && loteSerie.observacao.replace(/\s+/g,"").length ? loteSerie.observacao : "-"
    },

    requisitarTodosOsEquipamentos() {
      this.equipamentos.forEach(
        item=>item.quantidadeARequisitar = item.quantidadePedida - item.quantidadeRequisitada
      );
    },

    requisitarTodosOsMateriais() {
      this.materiais.forEach(
        item=>item.quantidadeARequisitar = item.quantidadePedida - item.quantidadeRequisitada
      );
    },

    limparTodosOsEquipamentos() {
      this.equipamentos.forEach(item=>item.quantidadeARequisitar = 0);
    },

    limparTodosOsMateriais() {
      this.materiais.forEach(item=>item.quantidadeARequisitar = 0);
    },

    desativarRequisitarTodos(itens) {
      return itens.every(item => 
        (item.quantidadePedida - item.quantidadeRequisitada) == 0 || (item.quantidadePedida - item.quantidadeRequisitada) == item.quantidadeARequisitar);
    },

    desativarLimparTodos(itens) {
      return !itens.some(item => item.quantidadeARequisitar != 0);
    },
  }
}
</script>

<style lang="scss" scoped>

div.input-acao-requisitar {
  padding: 0;
  margin: 0;
}

::v-deep input[type=number]::-webkit-inner-spin-button {
  opacity: 1;
}

::v-deep .v-text-field input{
  padding: 0;
  text-align: right;
}

.container-devolucao {
  padding: 0;
}

.area-devolver {
  background-color: transparent;
  padding: 0;
}

.container .card-devolucao:not(:last-of-type) {
  margin-bottom: 20px;
}

div.card-devolucao {
  background-color: $white;
  padding: 0 10px 0 10px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

div.input-acao-devolver {
  padding: 0;
  margin: 0;
}

::v-deep div.input-acao-devolver div.v-input__slot {
  margin: 0;
}

::v-deep div.input-acao-devolver input {
  padding: 0;
}

::v-deep div.input-acao-devolver input {
  padding: 0;
  text-align: right;
}

::v-deep input[type=number]::-webkit-inner-spin-button {
  opacity: 1
}

.label-area-expandida {
  font-size: 12px;
  font-weight: 400;
  color: #757575;
}

p.conteudo-area-expandida {
  font-size: 13px;
  font-weight: 600;
}
</style>