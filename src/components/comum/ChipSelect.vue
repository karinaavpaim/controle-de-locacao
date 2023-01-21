<template>
  <v-menu offset-y nudge-bottom="2" content-class="chip-lista-shadow" v-model="menuAtivo" @click.stop="()=>{}">
    <template v-slot:activator="{ on }">
      <v-chip 
        v-on="on" 
        v-bind:class="[
          selecionado.classeSelecao, 
          itensListagem.length === 1?'center-text unclickable':undefined
        ]" 
        class="chip-body unselectable">
        {{selecionado.descricao}}
        <v-icon 
          v-if="!!itensListagem && !!itensListagem.length && itensListagem.length > 1" 
          class="arrow-icon-position"
          v-bind:class="{'chip-open-icon-rotate': menuAtivo}"
          right>
          arrow_drop_down
        </v-icon>
      </v-chip>
    </template>

    <v-list class="chip-list sem-padding">
      <v-list-item
        v-for="(item, index) in listagemLocal"
        :key="index"
        @click="setNovoValorManualmente(item.valor)"
        v-acesso="item.acesso"
        class="chip-list-item-container sem-padding">
        <div class="marca-pre-texto" v-bind:class="[item.classeSelecao]"></div>
        <v-list-item-title>{{ item.descricao }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    model: {
      prop: 'model',
      event: 'onChange'
    },
    props: {
      model: { type: String },
      itensListagem: {
        type: Array,
        default: ()=>[]
      },
    },
    
    data: () => ({
      selecionado: {
        classeSelecao:"red",
        descricao:"Não configurado",
        valor: undefined
      },
      listagemLocal:[],
      menuAtivo: false
    }),

    watch: {
      model(novoValor) {
        this.setNovoValorManualmente(novoValor);
      }
    },

    mounted() {
      if (this.listagemValida())  
        this.selecionado = this.itensListagem[0]

      if (this.model)
        this.setNovoValorManualmente(this.model)
    },

    methods: {
      setNovoValorManualmente(valor) {
        if (!this.listagemValida() || !valor)
          return;

        this.itensListagem.forEach(el => {
          if (valor === el.valor)
            this.selecionado = el;
        });

        this.atualizarListagemLocal();

        if (this.model === valor) return;

        this.emitirAlteracoes();   
      },

      atualizarListagemLocal() {
        this.listagemLocal = this.itensListagem.filter(item => this.selecionado.valor !== item.valor)
      },

      // Retorna o valor atual e o valor anterior para quem estiver escutando
      // Desta forma, quem está escutando pode decidir o que fazer com os valores.
      emitirAlteracoes() {
        this.$emit("onChange", this.selecionado.valor, this.model);
      },

      listagemValida() {
        return !!this.itensListagem && !!this.itensListagem.length
      }
    }
  }
</script>
<style lang="scss" scoped>
  .marca-pre-texto {
    width: 3px;
    height: 100%;
    margin-right: 10px;
  }

  .chip-body {
    height: 22px;
    width: 110px;
    margin: auto 0;
    font-size: 13px;
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 500;
    letter-spacing: 0.4px;
  }

  ::v-deep .v-list-item__title {
    font-size: 13px;
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 500;
    letter-spacing: 0.4px;
  }

  .chip-open-icon-rotate {
    transform: rotate(180deg);
  }

  span.v-chip--clickable.unclickable {
    cursor: default;
  }

  span.center-text ::v-deep span {
    margin: 0 auto;
  }

  .chip-lista-shadow {
    -webkit-box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0), 0 8px 10px 1px rgba(0,0,0,.07), 0 3px 14px 2px rgba(0,0,0,.06);
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0), 0 8px 10px 1px rgba(0,0,0,.07), 0 3px 14px 2px rgba(0,0,0,.06);
  }

  i.arrow-icon-position {
    position: absolute;
    right: 10px;
    margin: 0;
    font-size: 18px;
  }

  .chip-list {
    width: 105px;
  }

  ::v-deep.chip-list-item-container {
    min-height: 27px;
    height: 27px;
  }

  ::v-deep.chip-list-item-container a {
    height: 27px;
    font-size: 12px;
  }

  .sem-padding, ::v-deep.sem-padding div a {
    padding: 0;
  }
</style>