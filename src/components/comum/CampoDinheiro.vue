<template>
  <div :id="id">
    <v-text-field
      :id="'textfield-valor-'+id"
      v-bind:readonly="readonly"
      :label="label"
      :maxlength="maxlength"
      :rules="rules"
      :error="!!mensagemDeErro"
      :error-messages="mensagemDeErro"
      v-model.lazy="valor"
      v-money="formatoDinheiro"
      @change="emitirAlteracoes"
      @keydown="verificarSinal"
      :autofocus="autoFocus"
      ref="campoTexto"
      :disabled="disabled">
    </v-text-field>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'entrada',
      event: 'change'
    },
    props: {
      id: { type: String, required: true, default: ()=> 'campo-dinheiro' },
      autoFocus: { type: Boolean, default: false },
      entrada: { type: Number, default: 0 },
      label: { type: String, required: true },
      permitirNegativo: { type: Boolean, required: false, default: false },
      rules: { type: Array, required: false },
      mensagemDeErro: { type: String, required: false },
      maxlength: { type: Number, required: false },
      readonly: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false }
    },
    
    data: () => ({
      valor: 0,
      formatoDinheiro: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2
      }
    }),

    watch: {
      entrada(novoValor) {
        this.setNovoValorManualmente(novoValor);
      },

      autoFocus(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.campoTexto.focus();
            this.onFocus();
          });
        }
      }
    },

    methods: {
      onFocus() {
        this.$emit('onFocus');
      },

      // hack para forcar a mascara renderizar o que esta sendo passado e nao remover os zeros em inteiros
      // a mascara quando recebe o valor sem os zeros a direita da virgula da problemas
      setNovoValorManualmente(valor) {
        this.$refs.campoTexto.$el
            .getElementsByTagName("input")[0].value = this.valor = parseFloat(valor).toFixed(2)
      },

      // sanity check
      // esse metodo sera chamado apenas no evento de mudanca do campo
      // emitir as alteracoes para cada mudanca do valor (watch), acarretara em erros ao
      // passar numeros terminador em 0 (Ex. 100 sera exibido como 0,01) programaticamente
      // para ver melhor: console.log
      emitirAlteracoes() {
        this.$emit("change", parseFloat(this.removerMascara(this.valor)));
      },

      //nao permitir negativos
      verificarSinal(e) {
        if (!this.permitirNegativo && e.key && e.key === "-")
          e.preventDefault();
      },

      removerMascara(value) {
        if (typeof value == "string") {
          return parseFloat(
            value
              .replace("R$ ", "")
              .replace(/\./g, "")
              .replace(",", ".")
          );
        } else if (typeof value == "number") {
          return value;
        }
        return 0;
      }
    }
  }
</script>