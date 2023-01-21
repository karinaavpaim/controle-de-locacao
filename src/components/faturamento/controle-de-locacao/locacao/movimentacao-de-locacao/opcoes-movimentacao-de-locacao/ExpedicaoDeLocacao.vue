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
        >
          <template v-slot:primeiras-colunas-personalizadas="{ item }">
            <td class="selo-tabela-generica">
              <v-badge avatar color="transparent" offset-y="6" offset-x="0">
                <template v-slot:badge v-if="(item.produto.identificador == identificadorProdutoPadrao) || item.atendidoComCorte">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on="on">
                        <v-icon small :color="`${item.atendidoComCorte ? 'primary' : '#f4511e'}`">
                          {{ item.atendidoComCorte ? 'mdi-information-outline' : 'mdi-alert-decagram-outline' }}
                        </v-icon>
                      </v-avatar>
                    </template>
                    <span>{{ item.atendidoComCorte ? 'Este item teve requisição atendida com corte.' : 'Este item possui o produto padrão.' }}</span>
                  </v-tooltip>
                </template>
              </v-badge>
            </td>
          </template>

          <template v-slot:area-expandida="{ item }">
            <v-flex xs12 v-if="!item.liberacoes || !item.liberacoes.length">
              <v-layout wrap class="card-no-data py-6">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não existem itens liberados para expedir.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-container fluid class="container-expedicao" v-if="item.liberacoes.length" >
              <v-col cols="12" class="card-expedicao" :key="indice" v-for="(liberacao, indice) in item.liberacoes">
                <v-row class="area-expedir">
                  <v-col cols="2">
                    <h4 class="label-area-expandida">{{`${liberacao.lote?"Lote":"Série"}`}}</h4>
                    <p class="conteudo-area-expandida">{{dadosLoteOuSerie(liberacao).codigo || "-"}}</p>
                  </v-col>
                  <v-col cols="5">
                    <h4 class="label-area-expandida">Descrição</h4>
                    <p class="conteudo-area-expandida">{{tratarTextoObservacaoLoteSerie(dadosLoteOuSerie(liberacao))}}</p>
                  </v-col>
                  <v-col cols="2">
                    <h4 class="label-area-expandida">Data de validade</h4>
                    <p class="conteudo-area-expandida">{{liberacao.validade | dataFormatada}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Liberado</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{liberacao.quantidadeLiberada}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Expedido</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{liberacao.quantidadeExpedida}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida">Expedir</h4>
                    <!-- @HACK para forcar que o campo seja inteiro pois o input retorna string -->
                    <v-text-field 
                      :class="'textfield-equipamentos-quantidade-a-expedir-'+id"
                      @change="calcularTotais"
                      @input="(valor)=>liberacao.quantidadeAExpedir = valor && parseInt(valor)"
                      hide-details 
                      v-model="liberacao.quantidadeAExpedir" 
                      onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" 
                      class="input-acao-expedir" 
                      type="number"
                      min="0"
                      :error="!liberacao.quantidadeAExpedirValida()"
                      :disabled="liberacao.quantidadeExpedida >= liberacao.quantidadeLiberada"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
          </template>
        </tabela-generica>

        <v-flex float-right v-if="equipamentos.length">
          <v-btn
            class="btn-tertiary"
            :id="'btn-expedir-todos-equipamentos-'+id"
            text
            @click="expedirTodosOsEquipamentos()"
            :disabled="desativarExpedirTodos(equipamentos)"
          >
            Expedir todos
          </v-btn>
          <v-btn
            class="btn-tertiary mr-0"
            :id="'btn-limpar-todos-equipamentos-'+id"
            text
            @click="limparTodosOsEquipamentos()"
            :disabled="desativarLimparTodos(equipamentos)"
          >
            Limpar todos
          </v-btn>
        </v-flex>
      </v-flex>
    </v-row>

    <v-row class="px-3 mb-5">
      <v-flex>
        <tabela-generica
          :id="'tabela-generica-materiais-'+id"
          :lista-colunas="colunasTabelaMateriais"
          :itens-tabela="materiais"
          titulo="Materiais"
          coluna-chave="identificadorItemLocacao"
          expandir-multiplos
          :exibirTitulo="!!materiais.length"
          :exibirBlocoSemDados="false"
        >
          <template v-slot:primeiras-colunas-personalizadas="{ item }">
            <td class="selo-tabela-generica">
              <v-badge avatar color="transparent" offset-y="6" offset-x="0">
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

          <template v-slot:area-expandida="{ item }">
            <v-flex xs12 v-if="!item.liberacoes || !item.liberacoes.length">
              <v-layout wrap class="card-no-data py-6">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não existem itens liberados para expedir.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-container fluid class="container-expedicao" v-if="item.liberacoes.length" >
              <v-col cols="12" class="card-expedicao" :key="indice" v-for="(liberacao, indice) in item.liberacoes">
                <v-row class="area-expedir">
                  <v-col cols="2">
                    <h4 class="label-area-expandida">{{`${liberacao.serie?"Série":"Lote"}`}}</h4>
                    <p class="conteudo-area-expandida">{{dadosLoteOuSerie(liberacao).codigo || "-"}}</p>
                  </v-col>
                  <v-col cols="5">
                    <h4 class="label-area-expandida">Descrição</h4>
                    <p class="conteudo-area-expandida">{{tratarTextoObservacaoLoteSerie(dadosLoteOuSerie(liberacao))}}</p>
                  </v-col>
                  <v-col cols="2">
                    <h4 class="label-area-expandida">Data de validade</h4>
                    <p class="conteudo-area-expandida">{{liberacao.validade | dataFormatada}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero">Liberado</h4>
                    <p class="conteudo-area-expandida tipo-numero">{{liberacao.quantidadeLiberada}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida tipo-numero mr-4">Expedido</h4>
                    <p class="conteudo-area-expandida tipo-numero mr-4">{{liberacao.quantidadeExpedida}}</p>
                  </v-col>
                  <v-col cols="1">
                    <h4 class="label-area-expandida">Expedir</h4>
                    <!-- @HACK para forcar que o campo seja inteiro pois o input retorna string -->
                    <v-text-field 
                      :class="'textfield-materiais-quantidade-a-expedir-'+id"
                      @change="calcularTotais"
                      @input="(valor)=>liberacao.quantidadeAExpedir = valor && parseInt(valor)"
                      hide-details 
                      v-model="liberacao.quantidadeAExpedir" 
                      onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" 
                      class="input-acao-expedir" 
                      type="number"
                      min="0"
                      :error="!liberacao.quantidadeAExpedirValida()"
                      :disabled="liberacao.quantidadeExpedida >= liberacao.quantidadeLiberada"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
          </template>
        </tabela-generica>

        <v-flex float-right v-if="materiais.length">
          <v-btn
            class="btn-tertiary"
            :id="'btn-expedir-todos-materiais-'+id"
            text
            @click="expedirTodosOsMateriais()"
            :disabled="desativarExpedirTodos(materiais)"
          >
            Expedir todos
          </v-btn>
          <v-btn
            class="btn-tertiary mr-0"
            :id="'btn-limpar-todos-materiais-'+id"
            text
            @click="limparTodosOsMateriais()"
            :disabled="desativarLimparTodos(materiais)"
          >
            Limpar todos
          </v-btn>
        </v-flex>
      </v-flex>
    </v-row>

    <v-row no-gutters>
      <v-flex sm2 offset-4 mt-2 text-right :class="{'bloco-desabilitado' : !equipamentos.length}">
        <h3 class="label-padrao">Equipamentos</h3>
        <p class="totalizadores-rodape">
          {{ totalizadores.equipamento | dinheiro }}
        </p>
      </v-flex>
      <v-flex sm2 mt-2 text-right :class="{'bloco-desabilitado' : !materiais.length}">
        <h3 class="label-padrao">Materiais</h3>
        <p class="totalizadores-rodape">
          {{ totalizadores.material | dinheiro }}
        </p>
      </v-flex>
      <v-flex sm4 text-right>
        <h3 class="label-padrao">Total da expedição</h3>
        <p class="total-orcamento">
          {{ totalDaExpedicao | dinheiro }}
        </p>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import TabelaGenerica from "@/components/comum/TabelaGenerica";
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_EQUIPAMENTOS, COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_MATERIAIS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import mascaraDinheiro from "@/utils/mascara-dinheiro";
import moment from "moment";

export default {
  components: {
    'tabela-generica': TabelaGenerica
  },

  props: {
    itensDaTabela: { type: Array, required: false, default: ()=>[] },
    identificadorProdutoPadrao: { type: String, default: undefined }
  },

  filters: {
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    },
    dataFormatada: function(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY");
      }
      return "-";
    }
  },

  computed: {
    materiais() {
      return this.itensDaTabela.filter((item)=>item.categoria === CATEGORIAS_ITEM.MATERIAL)
    },
    equipamentos() {
      return this.itensDaTabela.filter((item)=>item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO)
    },
    totalDaExpedicao() {
      return this.totalizadores.equipamento + this.totalizadores.material;
    }
  },

  data() {
    return {
      id: 'expedicao-de-locacao',
      colunasTabelaEquipamentos: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_EQUIPAMENTOS,
      colunasTabelaMateriais: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_EXPEDICAO_MATERIAIS,
      totalizadores: {
        material: 0,
        equipamento: 0
      }
    }
  },

  methods: {
    dadosLoteOuSerie(item) {
      return (item.serie || item.lote) || {}
    },

    tratarTextoObservacaoLoteSerie(loteSerie) {
      return loteSerie 
        && loteSerie.observacao 
        && loteSerie.observacao.replace(/\s+/g,"").length ? loteSerie.observacao : "-"
    },

    expedirTodosOsEquipamentos() {
      this.equipamentos.forEach(
        item=>item.liberacoes.forEach(
          l=>l.quantidadeAExpedir = l.quantidadeLiberada - l.quantidadeExpedida
        )
      );
      this.calcularTotais();
    },

    expedirTodosOsMateriais() {
      this.materiais.forEach(
        item=>item.liberacoes.forEach(
          l=>l.quantidadeAExpedir = l.quantidadeLiberada - l.quantidadeExpedida
        )
      );
      this.calcularTotais();
    },

    limparTodosOsEquipamentos() {
      this.equipamentos.forEach(
        item=>item.liberacoes.forEach(
          l=>l.quantidadeAExpedir = 0
        )
      );
      this.calcularTotais();
    },

    limparTodosOsMateriais() {
      this.materiais.forEach(
        item=>item.liberacoes.forEach(
          l=>l.quantidadeAExpedir = 0
        )
      );
      this.calcularTotais();
    },

    desativarExpedirTodos(itens) {
      return itens.every(
        item => item.liberacoes.every(l => 
          (l.quantidadeLiberada - l.quantidadeExpedida) == 0 || 
          (l.quantidadeLiberada - l.quantidadeExpedida) == l.quantidadeAExpedir
        )
      );
    },

    desativarLimparTodos(itens) {
      return itens.every(item => 
        item.liberacoes.every(l => l.quantidadeAExpedir == 0)
      );
    },

    calcularTotais() {
      this.totalizadores = this.itensDaTabela.reduce((totalizador, item)=>{
        let valorTotal = item.liberacoes.reduce((totalizador, item)=> item.quantidadeAExpedir + totalizador, 0) * item.valorUnitario;

        switch (item.categoria) {
          case CATEGORIAS_ITEM.EQUIPAMENTO: totalizador.equipamento += valorTotal; break;
          case CATEGORIAS_ITEM.MATERIAL: totalizador.material += valorTotal; break;
        }
        return totalizador;
      }, {
        material: 0,
        equipamento: 0
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.container-expedicao {
  padding: 0;
}

.area-expedir {
  background-color: transparent;
  padding: 0;
}

.container .card-expedicao:not(:last-of-type) {
  margin-bottom: 20px;
}

div.card-expedicao {
  background-color: $white;
  padding: 0 10px 0 10px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

div.input-acao-expedir {
  padding: 0;
  margin: 0;
}

::v-deep div.input-acao-expedir div.v-input__slot {
  margin: 0;
}

::v-deep div.input-acao-expedir input {
  padding: 0;
}

::v-deep div.input-acao-expedir input {
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