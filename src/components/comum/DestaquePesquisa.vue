<template>
  <div>
      <span v-for="(trecho, indice) in gerarTrechos(this.$slots.default[0].text || '')" :key="indice" :class="{ 'texto-destaque':  destacarTrecho(trecho) }">{{trecho}}</span>
  </div>
</template>

<script>
export default {
  props: {
    pesquisa: {
      type: String,
      required: true
    }
  },
  computed: {
    textoPesquisa() {
      // eslint-disable-next-line no-useless-escape
      return (this.pesquisa && this.pesquisa.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) || "";
    }
  },

  methods: {
    destacarTrecho(trecho){
      return this.textoPesquisa && new RegExp(this.textoPesquisa, 'i').test(trecho);
    },
    gerarTrechos(texto){
      let resultado = this.textoPesquisa ? texto.split(new RegExp(`(${this.textoPesquisa})`,"gi")) : [texto];
      // limpando elementos vazios gerados pelo split no inicio e fim da string
      resultado[0] === "" && resultado.shift();
      resultado[resultado.length-1] === "" && resultado.pop()
      return resultado;
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .texto-destaque {
    background: $blue-200;
    color: $black;
  }
</style>