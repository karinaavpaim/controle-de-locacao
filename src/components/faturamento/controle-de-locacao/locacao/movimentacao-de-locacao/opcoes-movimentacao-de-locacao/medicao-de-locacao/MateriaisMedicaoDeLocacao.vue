<template>
  <v-container fluid px-0 :id="id">
    <v-row class="px-3">
      <v-flex>
        <tabela-generica
          :id="'tabela-generica-'+id"
          :lista-colunas="colunasTabelaMateriais"
          :itens-tabela="itensDaTabela"
          :itens-para-expandir.sync="itensParaExpandir"
          coluna-chave="identificadorItemLocacao"
          chave-ordenacao-padrao="produto.codigo"
          titulo="Materiais"
          expandir-multiplos
        >
          <template v-slot:primeiras-colunas-personalizadas="{ item }">
            <td class="selo-tabela-generica">
              <v-badge avatar color="transparent" offset-y="6" offset-x="-6">
                <template v-slot:badge>
                  <v-tooltip top v-if="(item.produto && item.produto.identificador) == identificadorProdutoPadrao">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" size="16" color="#f4511e" class="alinhamento-icone-padrao">
                        mdi-alert-decagram-outline
                      </v-icon>
                    </template>
                    <span>Este item possui o produto padrão.</span>
                  </v-tooltip>
                  <v-tooltip top v-if="(item.produto && item.produto.identificador) != identificadorProdutoPadrao">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" size="16" :class="obterClasseParaStatus(item.status)">
                        {{ item.status ? 'mdi-tag' : '' }}
                      </v-icon>
                    </template>
                    <span>{{ obterDescricaoDoStatus(item.status) }}</span>
                  </v-tooltip>
                </template>
              </v-badge>
            </td>
            <td>{{ item.produto.codigo }}</td>
            <td>{{ item.produto.nome }}</td>
            <td class="text-center">
              <v-progress-linear :value="item.retornarPorcentagemProgressaoDoItem()+'%'" :dark="true" background-color="#F2F2F2" background-opacity="#165091" height="15" reactive>
                <template v-slot="{ value }">
                  <span>{{ value }}</span>
                  <div class="barra-progresso-texto-secundario-container" v-bind:style="{'--porcentagem-progresso': value}">
                    <span>{{ value }}</span>
                  </div>
                </template>
              </v-progress-linear>
            </td>
          </template>

          <template v-slot:area-expandida="{ item }">
            <v-flex xs12 v-if="exibirBlocoSemDados(item)">
              <v-layout wrap class="card-no-data py-8">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não existem itens expedidos para medir.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 v-if="item.desmembramentos.length && !item.valorUnitario">
              <v-layout wrap class="card-no-data py-8">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não é possível medir um item com valor unitário zerado.</span>
                </v-flex>
              </v-layout>
            </v-flex>

             <v-container fluid px-0 py-0 v-if="item.desmembramentos.length && item.valorUnitario">
              <v-col cols="12" class="card-medicao" :key="indice" v-for="(desmembramento, indice) in item.desmembramentos"><!-- :hidden="desmembramento.totalmenteMedido" -->
                <v-row class="altura-card-expandido">
                  <v-col cols="6" class="pb-0 pt-0">
                    <v-row>
                      <v-col cols="3" class="mt-1">
                        <v-row :class="desmembramento.totalmenteMedido && 'bloco-desabilitado'">
                          <v-col cols="8" class="text-left ml-3">
                            <h4 class="label-area-expandida">Lote / Série</h4>
                            <p class="conteudo-area-expandida">
                              {{ dadosLoteOuSerie(desmembramento).codigo || "-" }} 
                            </p>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="2" class="text-right">
                        <v-row>
                          <v-text-field 
                            :class="'textfield-quantidade-a-medir-'+id"
                            class="alinhamento-hint tipo-numero"
                            label="Quantidade"
                            @change="emitirAlteracoes"
                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                            @input="(valor)=>desmembramento.quantidadeAMedir = valor && parseInt(valor)"
                            v-model="desmembramento.quantidadeAMedir"
                            :error="quantidadeDesmembramentoInvalida(item, desmembramento)"
                            :hint="desmembramento.quantidadeAMedir + ' / '+(desmembramento.totalmenteMedido?desmembramento.quantidadeMedida:desmembramento.quantidadeMaxima)"
                            :disabled="desmembramento.totalmenteMedido"
                            persistent-hint>
                          </v-text-field>
                        </v-row>
                      </v-col>

                      <v-col cols="5" class="pt-3 pr-0">
                        <date-picker 
                          :classeId="'datepicker-periodo-medicao-'+id"
                          :data-em-array.sync="desmembramento.datasAMedir"
                          @onChange="emitirAlteracoes"
                          label="Data da medição"
                          hint=""
                          v-bind:dataMinima="item.dataInicialLocacao"
                          v-bind:dataMaxima="item.dataFinalLocacao"
                          :desabilitar="desmembramento.totalmenteMedido"
                        ></date-picker>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="6" class="pb-0 pt-0">
                    <v-row :class="desmembramento.totalmenteMedido && 'bloco-desabilitado'">
                      <v-col cols="4"></v-col>
                      <v-col cols="8" class="pl-0 mt-1">
                        <v-row>
                          <v-col cols="4" class="text-right">
                            <h4 class="label-area-expandida">Unitário líquido</h4>
                            <p class="conteudo-area-expandida">{{ item.valorUnitario | dinheiro }}</p>
                          </v-col>

                          <v-col cols="4" class="text-right">
                            <h4 class="label-area-expandida">Valor da medição</h4>
                            <p class="conteudo-area-expandida">{{ item.valorTotalParaMedicao(desmembramento) | dinheiro }}</p>
                          </v-col>

                          <v-col cols="4" class="text-right pl-0 nao-imprimir">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  v-on="on"
                                  :class="'btn-desmembrar-'+id"
                                  color="black"
                                  class="ma-2"
                                  :disabled="desmembramento.quantidadeMaxima === 1 || !!desmembramento.totalmenteMedido"
                                  text
                                  @click="duplicarCardMedicao(item, desmembramento)"
                                  icon
                                >
                                  <v-icon>mdi-content-duplicate</v-icon>
                                </v-btn>
                                <!-- cards-variant -->
                              </template>
                              <span>Desmembrar</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  v-on="on"
                                  :class="'btn-limpar-'+id"
                                  class="ma-2"
                                  color="black"
                                  :disabled="desabilitarDesfazer(desmembramento)"
                                  text
                                  @click="desfazerMedicao(item, desmembramento)"
                                  icon
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </template>
                              <span>Limpar campos</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
          </template>
          <template v-slot:ultimas-colunas-personalizadas="{ item }">
            <td class="text-right nowrap px-0 pr-1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    class="mx-1"
                    x-small
                    icon
                    color="primary"
                    @click.stop="emitirEventoHistoricoRemessaRetorno(item)"
                    :id="'btn-historico-movimentacoes-'+id"
                    v-on="on"
                    :disabled="item.quantidadeExpedida <= 0">
                    <v-icon>mdi-calendar-search</v-icon>
                  </v-btn>
                </template>
                <span>Histórico de movimentações</span>
              </v-tooltip>
            </td>
          </template>
        </tabela-generica>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import TabelaGenerica from "@/components/comum/TabelaGenerica";
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_MATERIAIS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import DatePicker from "@/components/comum/Datepicker";
import medicaoDeLocacaoMixin from "@/mixins/faturamento/controle-de-locacao/medicao-de-locacao-mixin";

export default {
  name: "MateriaisMedicaoDeLocacao",
  mixins: [medicaoDeLocacaoMixin],
  components: {
    "tabela-generica": TabelaGenerica,
    "date-picker": DatePicker
  },
  props: {
    id: { type: String, required: false, default: ()=> 'materiais-medicao' },
    identificadorProdutoPadrao: { type: String, default: undefined },
  },
  data() {
    return {
      colunasTabelaMateriais: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_MATERIAIS,
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.card-medicao {
  background-color: $white;
  padding: 0 10px 0 10px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.card-medicao:not(:last-of-type) {
  margin-bottom: 20px;
}

.altura-card-expandido {
  height: 100px;
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