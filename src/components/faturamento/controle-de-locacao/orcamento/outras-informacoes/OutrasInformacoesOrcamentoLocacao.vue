<template>
  <v-layout wrap :id="id">
    <v-flex xs12 sm12 pb-0>
      <v-flex xs12 sm12>
        <v-textarea
          :id="'textarea-observacao-'+id"
          label="Observação"
          rows="1"
          v-model="orcamentoLocacao.observacao"
          :autofocus="autoFocus"
          ref="outrasInformacoes">
        </v-textarea>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';

export default {
  props: {
    id: { type: String, required: false, default: ()=> 'outras-informacoes' },
    autoFocus: { type: Boolean, default: false },
    orcamentoLocacao: { type: OrcamentoLocacaoModel, required: true }
  },

  model: {
    prop: 'orcamentoLocacao',
    event: 'onChange'
  },

  data: () => ({}),

  methods: {
    onFocus() {
      this.$emit('onFocus');
    }
  },

  watch: {
    autoFocus(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.outrasInformacoes.focus();
          this.onFocus();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>