<template>
  <v-layout color="transparent" :id="id">
    <v-autocomplete
      :id="'autocomplete-modelo-proposta-'+id"
      v-model="item"
      :items="modelosDePropostas"
      :label="apresentarLabelOriginal ? labelOriginal : labelComModeloSelecionado"
      persistent-hint
      clearable
      item-text="nome"
      item="identificador"
      @change="itemAlterado"
      return-object
      class="tested"
      autocomplete="off"
      :disabled="disabled"
      :error="apresentarHintDeErro"
      :error-messages="apresentarHintDeErro ? textoDeErro : []">
    </v-autocomplete>
  </v-layout>
</template>

<script>
  import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api.js";
  import ModeloPropostaLocacaoModel from '@/models/faturamento/proposta-locacao/modelo-proposta-model.js'
  import { TIPOS_MODELOS } from "@/constants/faturamento/controle-de-locacao/modelo-proposta-constants.js";

  const LABEL_ORIGINAL = 'Escolha o modelo';
  const LABEL_COM_MODELO_SELECIONADO = 'Modelo';
    
  export default {
    model: {
      prop: 'itemSelecionado',
      event: 'onChange'
    },
    props: {
      id: { type: String, required: false, default: ()=> 'pesquisa-modelo-proposta' },
      disabled: { type: Boolean, default: false },
      apresentarHintDeErro: { type: Boolean, default: false },
      itemSelecionado: { type: ModeloPropostaLocacaoModel, default: undefined },
      tipoModelo: { tipoModelo: String, default: TIPOS_MODELOS.PROPOSTA.VALOR }
    },

    data() {
      return {
        apresentarLabelOriginal: true,
        labelOriginal: LABEL_ORIGINAL,
        labelComModeloSelecionado: LABEL_COM_MODELO_SELECIONADO,
        item: undefined,
        modelosDePropostas: []
      };
    },

    watch: {
      itemSelecionado(item){
        this.item = item;
        this.apresentarLabelOriginal = false;
      }
    },
    
    mounted() { 
      this.inicializar();
    },

    methods: {
      inicializar(){
        if(this.itemSelecionado.identificador){
          this.modelosDePropostas = [this.itemSelecionado];
          this.item = this.itemSelecionado;
          return;
        }
        this.obterModelosCadastrados();
      },

      itemAlterado() {
        this.$emit("onChange", this.item || undefined);
        this.apresentarLabelOriginal = false;
      },

       obterModelosCadastrados() {
        apiProposta.obterModelosDePropostaSemTrazerConteudo().then((resp) => {
          this.modelosDePropostas = resp.filter(m => m.tipoModelo == this.tipoModelo);          
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .v-text-field__details {
    height: 28px;
  }
</style>