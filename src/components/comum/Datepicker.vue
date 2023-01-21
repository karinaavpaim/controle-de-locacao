<template>
  <div :id="id">
    <v-menu
      v-model="openCalendar"
      :close-on-content-click="false"
      transition="scale-transition"
      nudge-top="0"
      offset-y
      max-width="290px"
      min-width="290px">
      <template v-slot:activator="{ on }">
        <v-text-field
          :id="id?'textfield-data-'+id:id"
          :class="classeId?'textfield-data-'+classeId:classeId"
          v-model="dataFormatada"
          :label="label"
          autocomplete="off"
          prepend-inner-icon="event"
          @change="atualizarDataModificada"
          @click="dataDatePicker = converterDataFormatadaEmDataPadraoOnClick(dataFormatada)"
          @blur="dataDatePicker = converterDataFormatadaEmDataPadraoOnBlur(dataFormatada)"
          v-on:keyup.enter="dataDatePicker = converterDataFormatadaEmDataPadraoOnEnter(dataFormatada)"
          v-on:keyup.tab="dataDatePicker = converterDataFormatadaEmDataPadraoOnTab(dataFormatada)"
          v-on:keydown.tab="openCalendar=false"
          :rules="rules"
          :error="!!mensagemDeErro || dataInvalida"
          :error-messages="mensagemDeErro"
          v-mask="'##/##/####'"
          v-bind:return-masked-value="true"
          :hint="hint"
          persistent-hint
          clearable
          v-on="on"
          maxlength="10"
          @click:prepend-inner="abrirCalendarioPeloIconeOnClick"
          update:error
          :disabled="desabilitar"
        ></v-text-field>
      </template>
      <v-date-picker 
        v-model="dataDatePicker"
        :min="dataMinima"
        :max="dataMaxima"
        :no-title="!apresentarTitulo"
        @input="openCalendar=false"
        locale="pt"
        :disabled="desabilitar"
        @change="atualizarDataModificada"
        :color="cor">
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
  import moment from 'moment';
  import dataUtils from '@/utils/data'

  export default {
    model: {
      prop: 'entrada',
      event: 'onChange'
    },
    props: {
      id: { type: String, required: false },
      classeId: { type: String, required: false },
      entrada: { type: String, default: undefined },
      
      //A propriedade "dataEmArray" foi criada para comportar casos em que o sistema espera array com um elemento.
      //Deve ser utilizada com .sync no componente pai e em casos de extrema necessidade.
      dataEmArray: { type: Array, default: ()=>[] },
      label: { type: String, default: undefined },
      dataSelecionada: undefined,
      mensagemDeErro: { type: String, required: false },
      rules: { type: Array, required: false },
      hint: { type: String, default: '*Obrigatório' },
      dataMinima: { type: String, default: '1989-01-01' },
      dataMaxima: { type: String, default: '2200-12-31' },
      horarioPadrao: { type: String, default: '00:00:00' },
      cor: { type: String, default: '#165091' },
      apresentarTitulo: { type: Boolean, default: false },
      desabilitar: { type: Boolean, default: false }
    },

    data() {
      return {
        dataDeHoje: moment(),
        dataDatePicker: moment().format("YYYY/MM/DD"),
        dataFormatada: this.dataSelecionada,
        openCalendar: false,
        dataInvalida: false
      }
    },

    watch: {
      dataEmArray: {
        immediate: true,
        handler(novaData) {
          let data = novaData && novaData[0]
          this.dataDatePicker = this.retornarDataEmFormatoValido(data);
          this.dataFormatada = this.formatarDataParaPadraoBrasileiro(data);
        }
      },

      entrada(novaData) {
        this.setNovaDataManualmente(novaData);
      },

      dataDatePicker() {
        this.dataDatePicker = this.retornarDataEmFormatoValido(this.dataDatePicker);
        this.setNovaDataManualmente(this.dataDatePicker);
        this.dataFormatada = this.formatarDataParaPadraoBrasileiro(this.dataDatePicker);
      },

      dataSelecionada() {
        this.dataFormatada = this.dataSelecionada;
      },
    },

    methods: {
      abrirCalendarioPeloIconeOnClick() {
        this.dataDatePicker = this.converterDataFormatadaEmDataPadraoOnClick();
        this.openCalendar = true;
      },

      retornarDataEmFormatoValido(data) {
        if(data  === "Invalid date") {
          return this.dataDeHoje.format('YYYY-MM-DD');
        } else if(!data){
          return undefined;
        }

        let anoMinimoPadrao = 1989;
        let anoMaximoPadrao = 2200;

        let anoMinimo = (this.dataMinima && parseInt(this.dataMinima.substring(0,4))) || anoMinimoPadrao;
        let anoMaximo = (this.dataMaxima && parseInt(this.dataMaxima.substring(0,4))) || anoMaximoPadrao;
        let anoInformado = parseInt(data.substring(0,4));
        let mesEDia = data.substring(4, data.length);

        data = (anoInformado < anoMinimo) ? anoMinimo + mesEDia : data;
        data = (anoInformado > anoMaximo) ? anoMaximo + mesEDia : data;
        return data;
      },

      setNovaDataManualmente(novaData) {
        this.dataDatePicker = !novaData ? undefined : moment(novaData).format('YYYY-MM-DD');
        this.atualizarDataModificada();
      },

      atualizarDataModificada() {
        let dataEntrante = (this.entrada || (this.dataEmArray && this.dataEmArray[0]));
        if ((dataEntrante === this.dataDatePicker) || (dataEntrante && this.dataDatePicker && (moment(dataEntrante).diff(this.dataDatePicker, 'days') === 0)))
          return; // para evitar o evento de change caso a data esteja sendo modificada programaticamente ou não haja modificacao

        this.$emit('dataDatePicker', this.dataDatePicker);
        this.$emit('dataFormatada', this.dataFormatada);
        let data = !this.dataDatePicker
          ? undefined
          : dataUtils.formatarDataEHoraIso(this.dataDatePicker, this.horarioPadrao);
        this.$emit("update:dataEmArray", data?[data]:[]); // ATENCAO - A ORDEM DOS EVENTOS INTERFERE NO RESULTADO
        this.$emit("onChange", data);
      },

      formatarDataParaPadraoBrasileiro(dataSemFormatacao) {
        if (!dataSemFormatacao) {
          return undefined
        }

        this.dataInvalida = !(this.dataValida(dataSemFormatacao));
        return moment(dataSemFormatacao, 'YYYY-MM-DD').format('DD/MM/YYYY');
      },

      converterDataFormatadaEmDataPadrao(dataFormatada) {
        if (!dataFormatada){
          return undefined
        }
        return moment(dataFormatada, 'DD/MM/YYYY').format('YYYY-MM-DD')
      },

      converterDataFormatadaEmDataPadraoOnClick(dataFormatada) {
        return this.converterDataFormatadaEmDataPadrao(dataFormatada);
      },

      converterDataFormatadaEmDataPadraoOnBlur(dataFormatada) {
        return this.converterDataFormatadaEmDataPadrao(dataFormatada);
      },

      converterDataFormatadaEmDataPadraoOnEnter(dataFormatada) {
        return this.converterDataFormatadaEmDataPadrao(dataFormatada);
      },

      converterDataFormatadaEmDataPadraoOnTab(dataFormatada) {
        return this.converterDataFormatadaEmDataPadrao(dataFormatada);
      },

      dataValida(dataASerVerificada) {
        return moment(dataASerVerificada).isValid()
      },
    }
  }
</script>