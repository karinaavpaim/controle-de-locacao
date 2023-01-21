<template>
  <div :id="id">
    <v-autocomplete
      :id="'autocomplete-'+id"
      :hide-no-data="desabilitarMensagemNaoHaDados"
      @change="alterar"
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      :filter="metodoFiltro"
      :readonly="!isEditing"
      :label="label"
      :item-text="atributoExibicao"
      return-object
      :clearable="true"
      :disabled="desabilitar"
      :autofocus="autoFocus"
      ref="refPesquisaAutoComplete"
    >
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title v-html="data.item[atributoExibicao]"></v-list-item-title>
          <v-list-item-subtitle v-if="formatadorItemDetalhe" v-html="formatadorItemDetalhe(data.item)"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  export default {
    props: {
      id: { type: String, required: true, default: ()=> 'pesquisa-auto-complete' },
      autoFocus: { type: Boolean, default: false },
      label: { type: String, required: true },
      caracteresParaConsulta: { type: Number, default: 2},
      metodoLocalizacao: { type: Function, required: true },
      metodoFiltro: { type: Function, required: false, default: ()=>{} },
      atributoExibicao: { type: String, required: true },
      formatadorItemDetalhe: { type: Function, required: false, default: ()=>{} },
      desabilitar: { type: Boolean, default: false },
      limparModel: null,
      itemSelecionado: null
    },
    data() {
      return {
        desabilitarMensagemNaoHaDados: true,
        isEditing: true,
        isLoading: false,
        listaItens: this.itemSelecionado ? [this.itemSelecionado] : [],
        search: null,
        model: this.itemSelecionado
      }
    },
    computed: {
      items() {
        return this.listaItens.map(item => {
          return Object.assign({}, item)
        })
      }
    },
    watch: {
      search(valor) {
        if (this.isLoading || !valor) {
          return;
        }
        this.confirmarPesquisa(valor);
      },
      limparModel() {
        this.model = null;
        this.listaItens = [];
        this.itemSelecionado = undefined;
      },
      itemSelecionado() {
        this.listaItens = this.itemSelecionado ? [this.itemSelecionado] : [];
        this.model = this.itemSelecionado;
      },
      autoFocus(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.refPesquisaAutoComplete.focus();
            this.onFocus();
          });
        }
      }
    },
    methods: {
      alterar() {
        this.$emit('alterarDados', this.model);
      },
      confirmarPesquisa(valor) {
        if (valor.length < this.caracteresParaConsulta) {
          return;
        }
        this.isLoading = true;
        this.metodoLocalizacao(valor).then((resultado) => {
          this.listaItens = resultado;
        })
        .catch(() => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível se comunicar com as APIs, verifique se a mesmas estão em execução.`,
          });
        })
        .finally( () => {
          this.isLoading = false;
          this.desabilitarMensagemNaoHaDados = false;
        });
      },
      onFocus() {
        this.$emit('onFocus');
      }
    }
  }
</script>