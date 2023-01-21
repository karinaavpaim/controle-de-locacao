<template>
  <v-autocomplete
    :label="label"
    :placeholder="placeholder"
    :loading="carregando"
    @change="onUpdate"
    @blur="onBlur"
    :dense="dense"
    :items="listaItens"
    :item-text="itemText"
    v-model="modelo"
    return-object
    auto-select-first
    :clearable="true"
    :hide-no-data="true"
    :disabled="disabled"
    ref="pesquisaProdutoLoteSerie"
  >
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title v-html="data.item.codigo"></v-list-item-title>
        <v-list-item-subtitle v-html="`Disponível: ${data.item.quantidadeDisponivel}`"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import apiProdutoLoteSerie from "@/api/estoque/produto-lote-serie-api";
import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';

export default {
  name: "PesquisaProdutoLoteSerie",
  data() {
    return {
      listaItens: this.loteSerieSelecionado ? [this.loteSerieSelecionado] : [],
      modelo: this.loteSerieSelecionado,
      carregando: false
    };
  },

  model: {
    prop: "loteSerieSelecionado",
    event: "onUpdate"
  },

  props: {
    loteSerieSelecionado: {
      type: ProdutoLoteSerieModel,
      default: undefined
    },
    identificadorProduto: {
      type: String,
      default: undefined
    },
    identificadorSetorRequisitado: {
      required: true,
      type: String
    },
    label: {
      type: String,
      default: "Lote/Série"
    },
    placeholder: {
      type: String,
      default: "Selecione"
    },
    itemText: {
      type: String,
      default: "codigo"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    identificadorProduto: {
        handler() {
            this.localizarProdutoLoteSerie();
        },
        immediate: true
    },

    loteSerieSelecionado(valor) {
      this.modelo = valor;

      if (valor && !this.listaItens.length)
        this.listaItens = [valor];
    }
  },

  methods: {
    onUpdate() {
      this.$emit('onUpdate', this.modelo || undefined);
    },

    onBlur() {
      if (!this.$refs.pesquisaProdutoLoteSerie.selectedItem) {
        this.modelo = undefined;
        this.onUpdate();
      }
    },

    localizarProdutoLoteSerie() {
      this.listaItens = [];
      this.carregando = true;
      apiProdutoLoteSerie.obterLotesSeriesDoProdutoParaSeparacao(this.identificadorProduto, this.identificadorSetorRequisitado)
        .then(resultado => {
          this.listaItens = resultado;
        })
        .catch(erro => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível carregar ${this.retornarNomeEntidade()} do produto.`,
            mensagem: erro
          });
        })
        .finally((this.carregando = false));
    },

    retornarNomeEntidade() {
      if (this.label.toLowerCase() == 'lote')
        return "os lotes";

      if (this.label.toLowerCase() == 'série')
        return "as séries";

      return "os lotes/séries";
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep input[type="color"],
::v-deep input[type="date"],
::v-deep input[type="datetime"],
::v-deep input[type="datetime-local"],
::v-deep input[type="email"],
::v-deep input[type="month"],
::v-deep input[type="number"],
::v-deep input[type="password"],
::v-deep input[type="search"],
::v-deep input[type="tel"],
::v-deep input[type="text"],
::v-deep input[type="time"],
::v-deep input[type="url"],
::v-deep input[type="week"],
::v-deep select:focus,
::v-deep textarea {
  font-size: 16px;
}
</style>