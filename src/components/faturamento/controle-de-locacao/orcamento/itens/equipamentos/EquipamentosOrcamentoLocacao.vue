<template>
  <div :id="id">
    <v-layout wrap>
      <v-flex sm12 text-left>
        <v-row class="ma-0 pa-0">
          <v-col cols="8" class="ma-0 pa-0">
            <v-btn class="btn-secondary-icon width-icon margem-zero" text @click="abrirModalParaAdicionarNovoItem" :id="'btn-adicionar-'+id">
              <v-icon class="mr-1">mdi-18px mdi-plus</v-icon>Adicionar
            </v-btn>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0">
            <v-text-field
              :id="'textfield-pesquisar-'+id"
              v-model="pesquisa"
              class="ma-0 pa-0"
              append-icon="search"
              label="Pesquisar"
              :disabled="itensDoComponente.length === 0"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-flex>

      <v-flex sm12 lg12>
        <v-flex sm12 v-show="(itensDoComponente.length > 0)">
          <v-data-table
            :headers="colunasEquipamentos"
            :items="itensFiltrados"
            class="contorno-tabela"
            :items-per-page="5"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.identificador">
                  <td class="text-left px-0">
                    <template v-if="(item.produto && item.produto.identificador) == identificadorProdutoPadrao">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-avatar v-on="on">
                            <v-icon size="16" color="#f4511e" class="alinhamento-icone-padrao">
                              mdi-alert-decagram-outline
                            </v-icon>
                          </v-avatar>
                        </template>
                        <span>Este item possui o produto padrão.</span>
                      </v-tooltip>
                    </template>
                    <template v-if="(item.produto && item.produto.identificador) !== identificadorProdutoPadrao">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-avatar v-on="on">
                            <v-icon size="16" :class="obterClasseParaStatus(item.status)">
                              mdi-tag
                            </v-icon>
                          </v-avatar>
                        </template>
                        <span>
                          <destaque-pesquisa :pesquisa="pesquisa">{{ obterDescricaoDoStatus(item.status) }}</destaque-pesquisa>
                        </span>
                      </v-tooltip>
                    </template>
                  </td>
                  <td class="text-left px-0"><destaque-pesquisa :pesquisa="pesquisa">{{item.obterCodigoEDescricaoAtual()}}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.quantidade }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.quantidadeDiarias }}</destaque-pesquisa></td>
                  <td class="text-center"><destaque-pesquisa :pesquisa="pesquisa">{{ item.dataInicialLocacao | data }}</destaque-pesquisa></td>
                  <td class="text-center"><destaque-pesquisa :pesquisa="pesquisa">{{ item.dataFinalLocacao | data }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.calcularValorTotalUnitario() | dinheiro }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.calcularValorTotal() | dinheiro }}</destaque-pesquisa></td>
                  <td class="text-right nowrap px-0 pr-1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mx-1" x-small icon color="primary" @click="abrirModalParaEditarItem(item)" :id="'btn-editar-'+id" v-on="on">
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mr-3" x-small icon color="primary" @click="verificarExclusaoDoItemDaTabela(item)" :id="'btn-excluir-'+id" v-on="on" :disabled="item.movimentado">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex mt-2 xs12 v-show="itens.filter((i) => i.categoria === categoriaComponente).length == 0">
          <v-layout wrap class="card-no-data py-12">
            <v-flex xs12>
              <span class="subheader">Não há equipamentos adicionados neste orçamento.</span>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout wrap>
      <v-dialog @keydown.esc="dialogItem = false" v-model="dialogItem" persistent max-width="65%">
        <v-card>
          <v-col cols="12" class="pa-0">
            <v-row no-gutters>
              <v-col cols="6">
                <v-card-title class="display-block">
                  <h2 class="titulo-modal">{{ modoEdicao ? "Editar" : "Adicionar" }} equipamento</h2>
                </v-card-title>
              </v-col>

              <v-col cols="6">
                <v-alert text dense color="red" border="left" class="notificacao-alerta mt-3 mb-0 mr-4" v-if="exibirMensagemDeErroDiariasMinima || mensagemDeErroValorTotalDoItem">
                  <span v-if="exibirMensagemDeErroDiariasMinima">Não é possível informar uma quantidade inferior de diárias, pois este item possui {{ item.diariasJaMedidas }} diárias medidas.</span>
                  <span v-if="mensagemDeErroValorTotalDoItem">{{ mensagemDeErroValorTotalDoItem }}</span>
                </v-alert>
              </v-col>
            </v-row>
          </v-col>

          <v-form ref="form">
            <v-container v-show="!carregandoEdicao" py-0>
              <v-layout wrap>
                <v-flex xs12 sm12 mx-2>
                  <v-row>
                    <v-flex xs12 sm3 px-2>
                      <pesquisar-produto
                        :id="'pesquisar-produto-'+id"
                        @onChange="_onProdutoChange"
                        label="Equipamento"
                        v-model="item.produto"
                        atributoExibicao="codigoNome"
                        :tiposDeProduto="tiposDeProduto"
                        v-bind:mensagemDeErro="mensagemDeErroProduto"
                        :autoFocus="focoHabilitado"
                        @onFocus="alterarFocus"
                        :desabilitar="item.movimentado"
                        :codigoEmpresa="identificadorEmpresa"
                        :identificadoresSetores="[
                          configuracaoControleLocacao.secaoSetor.setorEstoquePrincipal,
                          configuracaoControleLocacao.secaoSetor.setorEstoqueExpedicao,
                        ]"
                      >
                        <template v-slot:selection="{ produto }">
                          {{ produto.codigo }}
                        </template>
                      </pesquisar-produto>
                    </v-flex>

                    <v-flex xs12 sm9 px-2>
                      <v-text-field
                        :id="'textfield-descricao-'+id"
                        :disabled="habilitaEditarDescricaoDoItem && !produtoPadraoSelecionado() || item.movimentado"
                        @change="_onDescricaoChange"
                        label="Descrição do equipamento"
                        v-model="descricao"
                        maxlength="100"
                        counter="100">
                        <template v-slot:append-outer>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon 
                                class="bg-icon"
                                color="primary"
                                :id="'btn-editar-descricao-'+id"
                                v-text="'edit'"
                                v-on="on"
                                @click="editarDescricaoDoItem"
                                :disabled="item.movimentado || !habilitaEditarDescricaoDoItem || produtoPadraoSelecionado()"
                              ></v-icon>
                            </template>
                            <span>Editar</span>
                          </v-tooltip>
                        </template>
                      </v-text-field>
                    </v-flex>
                  </v-row>
                </v-flex>

                <v-flex xs12 sm12 mx-2>
                  <v-row>
                    <v-flex xs12 sm3 px-2>
                      <v-text-field
                        :id="'textfield-setor-'+id"
                        disabled
                        label="Setor"
                        v-model="codigoNomeSetorEstoquePrincipal"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm9 px-2>
                      <v-row>
                        <v-flex xs12 sm2 pl-3 pr-2>
                          <v-text-field
                            :id="'textfield-quantidade-disponivel-'+id"
                            disabled
                            class="tipo-numero"
                            :readonly="!produtoPadraoSelecionado()"
                            label="Disponível"
                            v-model="quantidadeDisponivel"
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 sm2 px-2>
                          <v-text-field
                            :id="'textfield-quantidade-'+id"
                            class="tipo-numero"
                            v-model="item.quantidade"
                            v-mask="'###'"
                            label="Quantidade"
                            :rules="[rules.min]"
                            :disabled="item.movimentado"
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 sm2 px-2>
                          <v-text-field
                            :id="'textfield-quantidade-diarias-'+id"
                            class="tipo-numero"
                            v-model="item.quantidadeDiarias"
                            v-mask="'###'"
                            label="Diárias"
                            @change="camposObrigatoriosEstaoPreenchidos()"
                            :rules="[rules.min, !exibirMensagemDeErroDiariasMinima]"
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 sm3 px-2>
                          <date-picker
                            :id="'datepicker-periodo-inicial-'+id"
                            v-model="item.dataInicialLocacao"
                            label="Prev. inicial"
                            v-bind:mensagemDeErro="mensagemDeErroDataInicial"
                            hint
                            @onChange="validarPeriodo"
                            data-minima="2000-01-01"
                            :desabilitar="item.movimentado"
                          ></date-picker>
                        </v-flex>

                        <v-flex xs12 sm3 pl-2 pr-3>
                          <date-picker
                            :id="'datepicker-periodo-final-'+id"
                            v-model="item.dataFinalLocacao"
                            label="Prev. final"
                            v-bind:mensagemDeErro="mensagemDeErroDataFinal"
                            hint
                            @onChange="validarPeriodo"
                            v-bind:dataMinima="item.dataInicialLocacao"
                          ></date-picker>
                        </v-flex>
                      </v-row>
                    </v-flex>
                  </v-row>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 sm12 ma-1>
                  <h2 class="subtitulo-modal">Composição de preço</h2>
                </v-flex>

                <v-flex xs12 sm12 mx-2 pt-2>
                  <v-row>
                    <v-flex xs12 sm3 px-2>
                      <v-select
                        :id="'select-tabela-precos-'+id"
                        class="select-preco"
                        label="Tabela de preço"
                        :item-text="(p)=>`${p.codigo} - ${p.nome}`"
                        return-object
                        clearable
                        slot="selection"
                        v-model="item.preco"
                        :loading="carregandoPrecos"
                        :disabled="carregandoPrecos || item.movimentado"
                        @change="alterarPrecoDoProduto"
                        :items="precos"
                      ></v-select>
                    </v-flex>

                    <v-flex xs12 sm3 px-2>
                      <campo-dinheiro
                        :id="'campo-dinheiro-valor-unitario-' + id"
                        class="tipo-numero"
                        label="Valor unitário"
                        v-model="item.valorUnitario"
                        v-bind:mensagemDeErro="mensagemDeErroValorUnitario"
                        @change="alterarValorUnitario"
                        :maxlength="15"
                        :permitir-negativo="false"
                        :disabled="item.movimentado"
                      ></campo-dinheiro>
                    </v-flex>

                    <v-flex xs12 sm3 px-2 text-right>
                      <h3 class="label-padrao">
                        Adicional unitário
                        <!-- <sup>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-avatar size="14" v-on="on">
                                <v-icon small color="primary">mdi-information-outline</v-icon>
                              </v-avatar>
                            </template>
                            <span>Serviço 18%</span>
                          </v-tooltip>
                        </sup> -->
                      </h3>
                      <p class="totalizadores-rodape">
                        {{ item.valorAdicionalPersonalizado | dinheiro }}
                      </p>
                    </v-flex>

                    <v-flex xs12 sm3 px-2 text-right>
                      <h3 class="label-padrao">Unitário líquido</h3>
                      <p class="totalizadores-rodape">
                        {{ item.calcularValorTotalUnitario() | dinheiro }}
                      </p>
                    </v-flex>
                  </v-row>
                </v-flex>

                <v-flex xs12 sm12 mx-2>
                  <v-row>
                    <v-flex xs12 sm3 px-2>
                      <campo-dinheiro
                        :id="'campo-dinheiro-valor-acrescimo-'+id"
                        class="tipo-numero"
                        label="Acréscimo"
                        v-model="item.valorAcrescimo"
                        :maxlength="15"
                        :permitir-negativo="false"
                        :disabled="item.movimentado"
                      ></campo-dinheiro>
                    </v-flex>

                    <v-flex xs12 sm3 px-2>
                      <campo-dinheiro
                        :id="'campo-dinheiro-valor-desconto-'+id"
                        class="tipo-numero"
                        label="Desconto"
                        v-model="item.valorDesconto"
                        :maxlength="15"
                        :permitir-negativo="false"
                        :disabled="item.movimentado"
                      ></campo-dinheiro>
                    </v-flex>

                    <v-flex xs12 sm6 px-2 text-right>
                      <h3 class="label-padrao">Total do item</h3>
                      <p class="total-modal ajuste-altura-temporario-total">
                        {{ valorTotalItem | dinheiro }}
                      </p>
                    </v-flex>
                  </v-row>
                </v-flex>
              </v-layout>
              <!-- 
                TODO: Comentado temporariamente para liberação do MVP.
                Vamos descomnetar quando mudarmos a forma de calcular a medição pelo orçado.
              -->
              <!-- <v-flex xs12 sm3 pl-3 pr-3>
                <v-switch 
                  v-if="ajustandoItem && !item.incluidoNaGestao"
                  v-model="item.medirPeloOrcado"
                  inset
                  label="Medir pelo Orçado"
                  :disabled="item.identificadorEntidadeOrigem == 0 || item.movimentado"
                ></v-switch>
              </v-flex> -->
            </v-container>

            <v-flex v-show="carregandoEdicao" class="icone-de-progresso-circular">
              <v-progress-circular :size="80" color="primary" indeterminate></v-progress-circular>
            </v-flex>
          </v-form>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-primary" text @click="adicionarItemNaTabela" :id="'btn-salvar-'+id">
              Salvar
            </v-btn>
            <v-btn class="btn-tertiary" text @click="cancelarAdicaoDeItem" :id="'btn-cancelar-'+id">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import DatePicker from "@/components/comum/Datepicker";
import CampoDinheiro from "@/components/comum/CampoDinheiro";
import PesquisarProduto from "@/components/estoque/PesquisarProduto";
import itensMixin from "@/mixins/faturamento/controle-de-locacao/itens-mixin.js";
import { COLUNAS_EQUIPAMENTOS } from "@/constants/faturamento/controle-de-locacao/equipamentos-orcamento-locacao-constants.js";
import { TIPOS_PRODUTO_EQUIPAMENTO } from "@/constants/estoque/produto-constants.js";
import { CATEGORIAS_ITENS_ORCAMENTO_LOCACAO } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants";

export default {
  mixins: [itensMixin],
  props: {
    id: {
      type: String,
      required: false,
      default: () => "equipamentos-orcamento",
    },
  },

  components: {
    DatePicker,
    CampoDinheiro,
    PesquisarProduto
  },

  data: () => ({
    categoriaComponente: CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.EQUIPAMENTO.valor,
    tiposDeProduto: TIPOS_PRODUTO_EQUIPAMENTO,
    colunasEquipamentos: COLUNAS_EQUIPAMENTOS
  }),

  methods: {
    valoresDoItemParaFiltro(item){
      return [ 
        this.obterDescricaoDoStatus(item.status),
        item.obterCodigoEDescricaoAtual(),
        item.quantidade,
        item.quantidadeDiarias,
        this.$options.filters.data(item.dataInicialLocacao),
        this.$options.filters.data(item.dataFinalLocacao),
        this.$options.filters.dinheiro(item.calcularValorTotalUnitario()),
        this.$options.filters.dinheiro(item.calcularValorTotal())
      ]
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep i.v-icon.notranslate.mdi.mdi-tag, ::v-deep i.v-icon.notranslate.mdi.mdi-alert-decagram-outline {
  margin-right: 0px;
}
</style>