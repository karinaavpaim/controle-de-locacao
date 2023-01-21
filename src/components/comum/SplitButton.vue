<template>
  <div class="split-button-container" @click.stop="()=>{}">
    <v-btn class="btn-quaternary btn-principal-split-button borda-btn-adicionar-temporaria" @click="botaoPrimario.callback(botaoPrimario.parametros)" :disabled="botaoPrimario.disabled">
      {{botaoPrimario.texto}}
    </v-btn>

    <v-menu nudge-bottom="38" left v-if="botoesSecundarios.length">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="btn-quaternary btn-abrir-listagem-split-button" :disabled="botaoPrimario.disabled">
          <v-icon left>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in botoesSecundarios" :key="index" @click="()=>!item.disabled && item.callback(item.parametros)" :disabled="item.disabled">
          <v-list-item-title>{{ item.texto }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    botoes: { type: Array, default: ()=>[{
      /*
      * Formato do objeto que alimenta o array
      */
       texto: "Adicionar",
       disabled: false,
       parametros: {},
       callback: ()=>{}
      }]
    },
  },
  computed: {
    botaoPrimario(){
      return this.botoes[0] || {callback: ()=>{}};
    },
    botoesSecundarios(){
      return (this.botoes && this.botoes.slice(1)) || [];
    }
  }
}
</script>

<style lang="scss" scoped>
  .split-button-container {
    display: flex;
  }

  .btn-principal-split-button, .btn-abrir-listagem-split-button {
    box-shadow: none;
    margin: 0;
  }

  button.btn-quaternary.btn-principal-split-button {
    margin-right: 0;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button.btn-quaternary.btn-abrir-listagem-split-button {
    margin-left: -10px;
    width: 30px;
    padding: 0;
    min-width: 30px;
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  button.btn-quaternary.btn-abrir-listagem-split-button > span > i {
    padding: 0;
    margin: 0;
  }

  button.btn-quaternary.borda-btn-adicionar-temporaria {
    border-right: 1px solid #165091;
    border-radius: 2px;
  }
</style>