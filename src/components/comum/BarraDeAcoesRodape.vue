<template>
  <div :id="id" class="footer-bar-sticky">
    <div class="barra-de-acoes-box">
      <slot name="barra-de-acoes-rodape">
        <v-btn v-if="mostrarBotaoTerciario"
          :id="`btn-terciario-${id}`"
          class="btn-tertiary"
          text
          :disabled="metodoDesabilitarBotaoTerciario()"
          @click="acaoBotaoTerciario">
          {{ descricaoDoBotaoTerciario }}
        </v-btn>

        <v-btn
          :id="'btn-primario-'+id"
          class="btn-primary width-btn-primary"
          text
          :disabled="metodoDesabilitarBotaoPrimario()"
          @click="acaoBotaoPrimario">
          {{descricaoDoBotaoPrimario}}
        </v-btn>

        <v-btn v-if="mostrarBotaoQuaternario"
          :id="`btn-quarternario-${id}`"
          class="btn-tertiary"
          text
          :disabled="metodoDesabilitarBotaoQuaternario()"
          @click="acaoBotaoQuaternario">
          {{ descricaoDoBotaoQuaternario }}
        </v-btn>

        <v-btn
          :id="'btn-secundario-'+id"
          class="btn-tertiary"
          text
          @click="acaoBotaoSecundario">
          Cancelar
        </v-btn>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, required: false, default: ()=> 'barra-de-acoes-rodape' }, // default apenas por retrocompatibidade. alterar para undefined quando possivel
    descricaoDoBotaoPrimario: { type: String, default: 'Salvar' },
    descricaoDoBotaoTerciario: { type: String, default: 'Salvar rascunho' },
    descricaoDoBotaoQuaternario: { type: String, default: 'Excluir rascunho' },
    acaoBotaoPrimario: { type: Function },
    acaoBotaoSecundario: { type: Function },
    acaoBotaoTerciario: { type: Function },
    acaoBotaoQuaternario: { type: Function },
    metodoDesabilitarBotaoPrimario: { type: Function },
    metodoDesabilitarBotaoTerciario: { type: Function, default:()=>{}},
    metodoDesabilitarBotaoQuaternario: { type: Function, default:()=>{}},
    mostrarBotaoTerciario: { type: Boolean, default: false },
    mostrarBotaoQuaternario: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
  .barra-de-acoes-box {
    height: 58px;
    background-color: $white;
    text-align: right;
    padding: 5px;
    padding-right: 12px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
                0 2px 2px 0 rgba(0,0,0,.14),
                0 -3px 5px 0 rgba(0,0,0,.12);
    border-radius: 4px;
  }
</style>