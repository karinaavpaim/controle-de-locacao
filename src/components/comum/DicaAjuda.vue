<template>
    <div class="dica-ajuda-component">
      <v-tooltip bottom max-width="300">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" :class="'icone-help'">help_circle</v-icon>
        </template>
        <span v-if="!!texto">
          <slot name="texto-help" :texto="texto">
              {{texto}}
          </slot>
        </span>
      </v-tooltip>
    </div>
</template>

<script>
export default {
  props: {
    texto: { type: String, default: "" },
  }
}
</script>

<style lang="scss" scoped>
  .dica-ajuda-component {
    display: inline;
    position: absolute;
    margin-left: 2px;
  }

  .icone-help {
    position: relative;
    display: block;
    width: 18px;
    height: 18px;
    font-size: 18px;
  }
</style>