<template>
  <div :id="id">
    <v-autocomplete
      :id="'autocomplete-produto-'+id"
      @blur="onBlur"
      @change="alterar"
      v-model="model"
      :items="listaItens"
      :loading="isLoading"
      :search-input.sync="search"
      :readonly="!emEdicao"
      :label="label"
      :item-text="atributoExibicao"
      :error="!!mensagemDeErro"
      :error-messages="mensagemDeErro"
      :rules="rules"
      return-object
      auto-select-first
      :clearable="true"
      @keyup="onKeyUp"
      :hide-no-data="desabilitarMensagemNaoHaDados"
      autocomplete="off"
      ref="pesquisarProduto"
      :disabled="desabilitar"
    >
      <template v-slot:selection="data" v-if="_temSlotSelecao()">
        <slot name="selection" :produto="data.item"></slot>
      </template>

      <template v-slot:append-outer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon class="bg-icon" :disabled="desabilitar" :id="'icon-pesquisa-avancada-'+id" color="primary" @click="exibirModalPesquisaAvancada()" v-text="'mdi-magnify'" v-on="on"></v-icon>
          </template>
          <span>Pesquisa avançada</span>
        </v-tooltip>

        <v-dialog v-model="dialog" persistent scrollable max-width="50%" :id="'dialog-pesquisa-avancada-produto-'+id">
          <v-card>
            <v-card-title>
              <h2 class="titulo-modal">{{ modoFiltro ? 'Localização de produtos' : 'Seleção de produtos' }}</h2>
            </v-card-title>

            <v-card-text class="px-4 py-0">
              <div v-if="modoFiltro">
                <v-row no-gutters>
                  <v-col cols="12" sm="2" md="2" class="py-0 pr-2">
                    <v-text-field
                      autofocus
                      label="Código"
                      v-model="produtoPesquisaAvancada.codigo"
                      autocomplete="off"
                      :id="'textfield-pesquisa-avancada-produto-codigo-'+id"
                      maxlength="6"
                      counter="6"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" class="py-0 px-2">
                    <v-text-field
                      label="Nome ou nome curto"
                      v-model="produtoPesquisaAvancada.nome"
                      autocomplete="off"
                      :id="'textfield-pesquisa-avancada-produto-nome-'+id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4" class="py-0 pl-2">
                    <v-text-field
                      label="Classificação"
                      v-model="produtoPesquisaAvancada.classificacao"
                      autocomplete="off"
                      :id="'textfield-pesquisa-avancada-produto-classificacao-'+id"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="4" md="4" class="py-0 pr-2">
                    <v-text-field
                      label="Característica"
                      v-model="produtoPesquisaAvancada.caracteristica"
                      autocomplete="off"
                      :id="'textfield-pesquisa-avancada-produto-caracteristica-'+id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4" class="py-0 px-2">
                    <v-text-field
                      label="Nome do grupo"
                      v-model="produtoPesquisaAvancada.nomeGrupo"
                      autocomplete="off"
                      :id="'textfield-pesquisa-avancada-produto-grupo-'+id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4" class="py-0 pl-2">
                    <v-text-field
                      label="Aplicação"
                      v-model="produtoPesquisaAvancada.aplicacao"
                      autocomplete="off"
                      :id="'textfield-pesquisa-avancada-produto-aplicacao-'+id"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <div v-if="!modoFiltro">
                <div v-if="produtoNaoEncontrado" class="mensagem-produto-nao-encontrado">
                  <span>Nenhum produto encontrado!</span>
                </div>
                <div v-if="!!listaItens && !produtoNaoEncontrado && !dialogCarregamento">
                  <v-list dense>
                    <v-list-item-group color="primary">
                      <v-list-item @click="selecionarProduto(item)" v-for="item in listaItens" :key="item.identificador" :id="'list-pesquisa-avancada-produto-selecao-'+id">
                        <v-list-item-content>
                          <v-list-item-title v-text="item.codigoNome"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </div>
              <div v-show="dialogCarregamento" class="icone-de-progresso-circular-pesquisa">
                <v-progress-circular :size="130" color="primary" indeterminate></v-progress-circular>              
              </div>
            </v-card-text>

            <v-card-actions class="mx-2" v-if="!modoFiltro && !dialogCarregamento">
              <v-textarea
                outlined
                :no-resize="true"
                :rows="2"
                fixed
                class="mt-5"
                name="aplicação"
                label="Aplicação"
                v-model="produto.descricaoAplicacao"
                v-show="!produtoNaoEncontrado"
                disabled
              ></v-textarea>
            </v-card-actions>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="modoFiltro"
                class="btn-primary"
                text
                @click="pesquisarProduto"
                :disabled="(!produtoPesquisaAvancada.modeloValido() && modoFiltro) || dialogCarregamento"
                :id="'btn-pesquisa-avancada-produto-pesquisar-'+id"
              >Pesquisar</v-btn>
              <v-btn v-if="!modoFiltro"
                class="btn-tertiary"
                text
                @click="voltarParaPesquisaAvancada()"
                :id="'btn-pesquisa-avancada-produto-voltar-'+id"
              >Voltar</v-btn>
              <v-btn v-if="!modoFiltro"
                class="btn-primary"
                text
                @click="adicionarProdutoNaTabela()"
                :disabled="produtoNaoEncontrado || !model"
                :id="'btn-pesquisa-avancada-produto-selecionar-'+id"
              >Selecionar</v-btn>
              <v-btn
                class="btn-tertiary"
                text
                @click="fecharModal"
                :id="'btn-pesquisa-avancada-produto-fechar-'+id"
              >Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import apiProdutos from "@/api/estoque/produto-api.js";
import {
  TEMPO_ESPERA_PARA_PESQUISA_AUTOCOMPLETE,
  INPUT_KEY_CODES
} from "@/constants/comum/configuracoes-constants";
import ProdutoModel from "@/models/estoque/produto/produto-model";
import ProdutoPesquisaAvancadaModel from "@/models/estoque/produto/pesquisa-avancada-produtos-model";

export default {
  model: {
    prop: "itemSelecionado",
    event: "onChange"
  },
  props: {
    id: { type: String, required: true, default: ()=> 'pesquisar-produto' },
    label: { type: String, required: true },
    itemSelecionado: { type: ProdutoModel },
    atributoExibicao: { type: String, required: true },
    tiposDeProduto: { type: Array, default: () => [] },
    identificadoresSetores: { type: Array, default: () => [] },
    codigoEmpresa: { type: String, required: false },
    autoFocus: { type: Boolean, default: false },
    desabilitar: {type: Boolean, default: false,},
    mensagemDeErro: {
      type: String,
      required: false
    },
    rules: {
      type: Array,
      required: false
    },
  },
  data() {
    return {
      emEdicao: true,
      isLoading: false,
      dialog: false,
      dialogCarregamento: false,
      listaItens: this.itemSelecionado ? [this.itemSelecionado] : [],
      search: undefined,
      model: this.itemSelecionado,
      desabilitarMensagemNaoHaDados: true,
      timeoutId: 0,
      produto: new ProdutoModel(),
      produtoPesquisaAvancada: new ProdutoPesquisaAvancadaModel(),
      modoFiltro: true,
      produtoNaoEncontrado: false
    };
  },

  watch: {
    itemSelecionado(val) {
      this.listaItens = val ? [val] : [];
      this.model = val;
    },

    autoFocus(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.pesquisarProduto.focus();
          this.onFocus();
        });
      }
    }
  },

  methods: {
    onFocus() {
      this.$emit("onFocus");
    },

    exibirModalPesquisaAvancada() {
      this.dialog = true;
      this.emEdicao = !this.emEdicao;
      this.produtoPesquisaAvancada = new ProdutoPesquisaAvancadaModel();
      this.produto = new ProdutoModel();
    },

    fecharModal() {
      this.modoFiltro = true;
      this.dialog = false;
      this.emEdicao = true;
      this.produtoNaoEncontrado = false;
      this.produtoPesquisaAvancada = new ProdutoPesquisaAvancadaModel();
      this.produto = new ProdutoModel();
    },

    selecionarProduto(item) {
      this.produto.descricaoAplicacao = item.descricaoAplicacao;
      this.model = item;
    },

    voltarParaPesquisaAvancada() {
      this.modoFiltro = !this.modoFiltro;
      this.model = this.itemSelecionado;
    },

    adicionarProdutoNaTabela() {
      this.dialog = false;
      this.$emit("onChange", this.model);
      this.modoFiltro = true;
      this.emEdicao = true;
    },

    pesquisarProduto() {
      if (!this.produtoPesquisaAvancada.modeloValido()) {
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      this.produtoNaoEncontrado = false;
      this.modoFiltro = false;
      this.dialogCarregamento = true;
      this.produtoPesquisaAvancada.codigoEmpresa = this.codigoEmpresa;
      this.produtoPesquisaAvancada.identificadoresSetores = this.identificadoresSetores;
      this.produtoPesquisaAvancada.ultilizarAndNoFiltro = true;

      this.desabilitarMensagemNaoHaDados = true;
      this.localizarProdutoPesquisaAvancada(this.produtoPesquisaAvancada);
    },

    onKeyUp(evt) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }

      let pesquisa = this.search && this.search.trim();

      if (!pesquisa) {
        this.listaItens = [];
        this.isLoading = false;
        return;
      }
   
      this.produtoPesquisaAvancada = new ProdutoPesquisaAvancadaModel({
        codigo: pesquisa,
        nome: pesquisa,
        codigoEmpresa: this.codigoEmpresa,
        identificadoresSetores: this.identificadoresSetores,
        ultilizarAndNoFiltro: false
      });

      this.isLoading = true;
      if (evt.keyCode === INPUT_KEY_CODES.enter) {
        this.localizarProdutoPesquisaAvancada(this.produtoPesquisaAvancada);
        return;
      }

      this.timeoutId = setTimeout(() => {
        this.timeoutId = 0;
        this.desabilitarMensagemNaoHaDados = true;
        this.localizarProdutoPesquisaAvancada(this.produtoPesquisaAvancada);
      }, TEMPO_ESPERA_PARA_PESQUISA_AUTOCOMPLETE);
    },

    localizarProdutoPesquisaAvancada(produtoPesquisaAvancada) {
      apiProdutos
        .localizarProdutoPesquisaAvancada(
          produtoPesquisaAvancada,
          this.tiposDeProduto
        )
        .then(resultado => {
          this.dialogCarregamento = false;
          if (resultado.length == 0) {
            this.produtoNaoEncontrado = true;
            return;
          }

          this.listaItens = resultado;
          this.produtoNaoEncontrado = false;
          this.produtoPesquisaAvancada = new ProdutoPesquisaAvancadaModel();
        })
        .catch(erro => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter os produtos.`,
            mensagem: `Motivo: ${erro[0].statusText}`
          });
          this.dialogCarregamento = false;
        })
        .finally((this.isLoading = false));
    },

    localizarProduto(texto) {
      apiProdutos
        .localizarProduto(texto, this.tiposDeProduto)
        .then(resultado => {
          this.listaItens = resultado;
        })
        .catch(error => {
          this.$mensagemFlutuante.erro({
            titulo: "Não foi possível se comunicar com as APIs, verifique se a mesmas estão em execução.",
            mensagem: `${error[0].statusText}`
          });
        })
        .finally((this.isLoading = false));
    },

    alterar() {
      this.$emit("onChange", this.model || undefined);
    },

    onBlur() {
      if (!this.$refs.pesquisarProduto.selectedItem) {
        this.model = undefined;
        this.alterar();
      }
    },

    _temSlotSelecao() {
      return !!(this.$slots["selection"] || this.$scopedSlots["selection"]);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list {
  overflow-y: auto;
}

div.v-dialog__content.v-dialog__content--active:nth-child(odd) {
  z-index: 999;
}

.mensagem-produto-nao-encontrado {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 50px;
}
</style>