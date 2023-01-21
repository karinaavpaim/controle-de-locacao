<template>
  <div :id="id">
    <v-layout wrap>
      <v-flex xs12 sm4 pb-0>
        <v-autocomplete
          :id="'autocomplete-tipo-entrega-'+id"
          @change="alterarTipoEntrega"
          v-model="entrega.tipoEntrega"
          :items="tiposEntrega"
          label="Tipo de entrega"
          persistent-hint>
        </v-autocomplete>
      </v-flex>

      <v-flex xs12 sm8 pb-0>
        <pesquisa-pessoa
          class="pl-1"
          @onChange="alterarPessoa"
          label="Transportadora"
          placeholder=""
          atributoExibicao="codigoNome"
          :habilitarPesquisaAvancada="false"
          :categoriasDePessoa="['TRANSPORTADOR']"
          :id="'pesquisa-pessoa-transportadora-'+id">
        </pesquisa-pessoa>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import PesquisaPessoa from "@/components/sistemas-gerais/pessoa/PesquisaPessoa.vue";
import PessoaModel from "@/models/geral/pessoa/pessoa-model";

export default {
  props: {
    id: { type: String, required: false, default: ()=> 'transportadoras-orcamento' },
  },

  components: {
    PesquisaPessoa
  },

  data: () => ({
    entrega: {
      transportadora: new PessoaModel(),
      tipoEntrega: ""
    },

    tiposEntrega: [
      "Por conta do Emitente",
      "Por conta do Destinatário"
    ]
  }),

  methods: {
    alterarTipoEntrega(tipoEntrega) {
      this.entrega.tipoEntrega = tipoEntrega;
      this.notificarDadosAlterados();
    },
    alterarPessoa(pessoa) {
      this.entrega.transportadora = pessoa;
      this.notificarDadosAlterados();
    },
    notificarDadosAlterados() {
      this.$emit("onChange", this.entrega ? Object.assign(this.entrega) : undefined);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>