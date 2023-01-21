<template>
  <v-snackbar    
    v-bind:id="identificador"    
    :color="classeTipo"
    v-model="snackbar.visivel"
    :bottom="snackbar.y === 'bottom'"
    :left="snackbar.x === 'left'"
    :multi-line="snackbar.mode === 'multi-line'"
    :right="snackbar.x === 'right'"
    :timeout="snackbar.timeout"
    :top="snackbar.y === 'top'"
    :vertical="snackbar.mode === 'vertical'"
    absolute>
    {{ snackbar.text }}
    <v-btn color="primary" text @click="snackbar.visivel = false">Fechar</v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    props: {
      tipo: { 
        type: String,
        validator: value => {
          return ['success', 'warning', 'error'].indexOf(value) !== -1;
        },
      },
      mensagem: { type: String },
      exibir: { type: Boolean, default: false },
      identificador: { type: String }
    },
    data() {      
      return {                
        snackbar: {
          visivel: false,
          y: "top",
          x: null,
          mode: "multi-line",
          timeout: 9000,
          text: ""
        },
        classeTipo: undefined
      }
    },
    watch: {
      exibir() {
        this.snackbar.visivel = !this.snackbar.visivel;
        this.snackbar.text = this.mensagem;
        this.classeTipo = `snackbar-${this.tipo}`;
      }        
    }
  }
</script>