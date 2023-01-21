<template>
  <v-dialog @keydown.esc="exibirDialog=false" v-model="exibirDialog" persistent max-width="65%">
    <v-card>
      <v-card-title class="display-block">
        <h2 class="titulo-modal">Histórico de movimentações</h2>
      </v-card-title>

      <v-form ref="form">
        <v-container py-0>
          <v-layout wrap>
            <v-flex xs12 sm12 mx-1 mb-4 mt-3>
              <span><b>Produto:</b> {{ itemDaLocacao && itemDaLocacao.produto && itemDaLocacao.produto.codigoNome }}</span>
            </v-flex>
            <v-flex xs12 sm12 mx-2 mb-4>
              <v-row>
                <v-flex xs12 sm6 px-2>
                  <h2 class="subtitulo-modal">Movimentações de saída</h2>
                  <div v-if="dadosItemRemessaRetorno">
                    <v-data-table
                      :headers="colunasHistoricoMovimentacoesSaida"
                      :items="dadosItemRemessaRetorno"
                      class="contorno-tabela"
                      hide-default-footer
                    >
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr v-for="item in items" :key="item.identificador">
                            <td class="text-left">{{ (item.loteSerieRemessa && item.loteSerieRemessa.codigo) || '-' }}</td>
                            <td class="text-center">{{ item.dataRemessa | data_br }}</td>
                            <td class="text-right">{{ item.quantidadeRemessa }}</td>
                            <td class="text-right">{{ item.numeroDocumentoRemessa }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-data-table>
                  </div>
                  <div class="bloco-sem-dados" v-else>
                    <v-flex xs12 mt-2>
                      <v-layout wrap class="card-no-data py-5">
                        <v-flex xs12>
                          <v-icon class="ma-1">error_outline</v-icon>
                          <span class="subheader">Não existem movimentações a serem exibidas.</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </div>
                </v-flex>

                <v-flex xs12 sm6 px-2>
                  <h2 class="subtitulo-modal">Movimentações de retorno</h2>
                  <div v-if="dadosItemRemessaRetorno">
                    <v-data-table
                      :headers="colunasHistoricoMovimentacoesRetorno"
                      :items="dadosItemRemessaRetorno"
                      class="contorno-tabela"
                      hide-default-footer
                    >
                      <template v-slot:body="{ items }">
                        <tbody>
                          <tr v-for="item in items" :key="item.identificador">
                            <td class="text-left">{{ (item.loteSerieRetorno && item.loteSerieRetorno.codigo) || '-' }}</td>
                            <td class="text-center">{{ item.dataRetorno | data_br }}</td>
                            <td class="text-right">{{ item.quantidadeRetorno || '-' }}</td>
                            <td class="text-right">{{ item.numeroDocumentoRetorno || '-' }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-data-table>
                  </div>
                  <div class="bloco-sem-dados" v-else>
                    <v-flex xs12 mt-2>
                      <v-layout wrap class="card-no-data py-5">
                        <v-flex xs12>
                          <v-icon class="ma-1">error_outline</v-icon>
                          <span class="subheader">Não existem movimentações a serem exibidas.</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </div>
                </v-flex>
              </v-row>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-tertiary" text @click="exibirDialog=false" :id="'btn-fechar-'+id">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dataUtils from "@/utils/data.js";
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import { COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_SAIDA, COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_RETORNO } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";

export default {
  name: "HistoricoRemessaRetornoItemLocacao",

  model: {
    prop: "exibirHistoricoRemessaRetorno",
    event: "onChange"
  },

  props: {
    id: { type: String, required: false, default: ()=> 'historico-remessa-retorno-item-locacao' },
    identificadorDaLocacao: { type: Number, required: false, default: undefined },
    itemDaLocacao: { type: ItemOrcamentoLocacaoModel, required: false, default: () => new ItemOrcamentoLocacaoModel() },
    exibirHistoricoRemessaRetorno: { type: Boolean, required: false, default: false}
  },

  watch: {
    exibirHistoricoRemessaRetorno() {
      if (this.exibirHistoricoRemessaRetorno) {
        this.abrirModalParaVisualizarDatasDeMedicao();
      }
    },

    exibirDialog() {
      this.$emit('onChange', this.exibirDialog);
    }
  },

  filters: {
    data_br(dataIso) {
      return dataIso ? dataUtils.aplicarMascaraEmDataIso(dataIso) : '-';
    },
  },

  data() {
    return {
      exibirDialog: false,
      dadosLocacaoRemessaRetorno: undefined,
      dadosItemRemessaRetorno: [],
      colunasHistoricoMovimentacoesSaida: COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_SAIDA,
      colunasHistoricoMovimentacoesRetorno: COLUNAS_TABELA_HISTORICO_MOVIMENTACAO_RETORNO
    }
  },

  methods: {
    abrirModalParaVisualizarDatasDeMedicao() {
      if (!Array.isArray(this.dadosLocacaoRemessaRetorno)) {
        apiOrcamento.obterDadosRemessaRetornoDosItens(this.identificadorDaLocacao)
        .then(dados => {
          this.dadosLocacaoRemessaRetorno = (Array.isArray(dados) && dados) || [];
          this.dadosItemRemessaRetorno = this.dadosLocacaoRemessaRetorno.filter(d => d.identificadorItemOrcamento == this.itemDaLocacao.identificador);
        });
      } else {
        this.dadosItemRemessaRetorno = this.dadosLocacaoRemessaRetorno.filter(d => d.identificadorItemOrcamento == this.itemDaLocacao.identificador);
      }

      this.exibirDialog = this.exibirHistoricoRemessaRetorno;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>