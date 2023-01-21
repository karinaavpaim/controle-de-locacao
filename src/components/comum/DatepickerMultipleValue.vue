<template>
  <v-row class="limite-altura">
    <v-hover v-slot:default="{ hover }">
      <v-col cols="12" sm="12">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dataApresentacao"
              :id="id?'text-field-data'+id:id" 
              :class="classeId?'text-field-data'+classeId:classeId" 
              multiple
              :label="label"
              :error="exibirErro"
              prepend-inner-icon="event"
              @click:prepend-inner="abrirCalendarioPeloIconeOnClick"
              readonly
              @click="()=> {menu = false}"
              v-on="on"
              clearable
              :disabled="desabilitar"
              @click:clear="datas = []"
            ></v-text-field>
          </template>
          <v-date-picker
            :disabled="desabilitar"
            :id="id?'date-picker-data'+id:id" 
            :class="classeId?'date-picker-data'+classeId:classeId" 
            v-model="datas"
            multiple
            color="primary"
            no-title
            scrollable
            :min="dataMinima"
            :max="dataMaxima"
            locale="pt"
          ></v-date-picker>
        </v-menu>
        <v-expand-transition>
          <div v-if="hover && apresentarTooltip" class="tooltip layout-tooltip">
            <div v-for="range in datasTooltip" :key="range">
              <span>{{ range }}</span>
            </div>
          </div>
        </v-expand-transition>
      </v-col>
    </v-hover>
  </v-row>
</template>

<script>
import moment from "moment";

export default {
  model: {
    prop: "entrada",
    event: "onChange"
  },
  props: {
    entrada: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: undefined
    },
    classeId: {
      type: String,
      default: undefined
    },
    label: {
      type: String,
      default: undefined
    },
    exibirErro: {
      type: Boolean,
      default: false
    },
    valorApresentacao: {
      type: String,
      default: " datas selecionadas"
    },
    apresentarTooltip: {
      type: Boolean,
      default: false
    },
    semDados: {
      type: String,
      default: "Não há data selecionada"
    },
    desabilitar: {
      type: Boolean,
      default: false
    },
    dataMinima: {
      type: String,
      default: "1989-08-05"
    },
    dataMaxima: {
      type: String,
      default: "2200-12-31"
    },
    formatoApresentacao: {
      type: String,
      default: "DD/MM/YYYY"
    }
  },
  computed: {
    datasTooltip() {
      if (this.datas.length == 0) {
        return [this.semDados];
      }
      return this.rangeDatas.map(d => {
        return `De ${moment(d.dataMenor).format(
          this.formatoApresentacao
        )} até ${moment(d.dataMaior).format(this.formatoApresentacao)}`;
      });
    }
  },

  data() {
    return {
      datas: this.entrada,
      dataApresentacao: this.entrada && this.retornarNoFormatoParaApresentacao(this.entrada),
      menu: false
    };
  },

  watch: {
    entrada(entrada){
      /* Comparando os arrays por valor ao invés de referência, para evitar loop infinito. */
      if (entrada && this.datas && entrada.join() != this.datas.join()) {
        this.datas = entrada;
      }
    },

    datas() {
      let datas = this.ordenarArray(Object.assign([], this.datas));
      this.montarDataDeApresentacao(datas);
      this.montarRangeDatas(datas);
    }
  },

  methods: {
    abrirCalendarioPeloIconeOnClick() {
      this.datas = [];
      this.menu = true;
    },

    montarArrayComRangeDeDatas(arrayDatas) {
      let datas = this.ordenarArray(arrayDatas);
      return datas.reduce((acumulador, data, indice) => {
        if (indice === 0) {
          return this.adicionarNovaDataNoArray(acumulador, data);
        }

        let ultimaDataAcumulador = acumulador[acumulador.length - 1].dataMaior;
        let dataSeguinte = moment(ultimaDataAcumulador)
          .add(1, "days")
          .format("YYYY-MM-DD");

        if (dataSeguinte == data)
          acumulador[acumulador.length - 1].dataMaior = data;
        else acumulador = this.adicionarNovaDataNoArray(acumulador, data);

        return acumulador;
      }, []);
    },

    adicionarNovaDataNoArray(array, data) {
      array.push({
        dataMenor: data,
        dataMaior: data
      });
      return array;
    },
    ordenarArray(array) {
      return array.sort((date1, date2) => {
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
      });
    },

    montarRangeDatas(arrayDatas) {
      this.rangeDatas = this.montarArrayComRangeDeDatas(arrayDatas);
      this.$emit("onChangeRange", this.rangeDatas);
    },

    montarDataDeApresentacao(arrayDatas) {
      this.dataApresentacao = this.retornarNoFormatoParaApresentacao(
        arrayDatas
      );
      this.$emit("onChange", arrayDatas);
    },
    retornarNoFormatoParaApresentacao(arrayDeDatas) {
      if(!arrayDeDatas.length){
        return "";
      }
 
      return (
        (arrayDeDatas.length != 1 &&
          `${arrayDeDatas.length}${this.valorApresentacao}`) ||
        "1 data selecionada"
      );
    }
  }


};
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
  width: 100%;
  z-index: 7;
  cursor: pointer;
}

.layout-tooltip {
  border-radius: 3px;
  padding: 6px;
  box-shadow: 0 0 5px 0 rgba(50, 50, 50, 0.12);
  text-align: center;
  background-color: $grey-50;
}

.tooltip:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  width: 0px;
  margin-left: -12px;
  height: 0;
  position: absolute;
  margin-top: -19px;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-bottom: 16px solid $grey-50;
}

.limite-altura {
  max-height: 94px;
}
</style>