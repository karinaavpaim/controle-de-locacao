<template>
  <v-container class="scroller area-filtro-pesquisa-orcamento" py-0 pl-0 pr-4 :id="id">
    <v-layout py-2 class="header-bar-sticky">
      <v-flex text-left xs12>
        <span class="titulo-filtro-orcamento">{{titulo}}</span>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-space-between wrap>
      <v-flex xs3>
        <v-text-field :id="'textfield-codigo-'+id" label="Código" v-model="filtrosPesquisa.codigo"></v-text-field>
      </v-flex>

      <v-flex xs8>
        <v-select
          :id="'select-lista-status-'+id"
          class="select-status"
          label="Status"
          :item-text="(o)=>o.descricao"
          :item-value="(o)=>o.valor"
          clearable
          multiple
          v-model="filtrosPesquisa.listaDeStatus"
          :items="listaDeStatusParaFiltro"
        >
          <template v-slot:selection="{ item, index }">
            <span v-if="(filtrosPesquisa.listaDeStatus.length === 1) && (index === 0)">{{ item.descricao }}</span>
            <span v-if="(filtrosPesquisa.listaDeStatus.length > 1) && (index === 0)" class="grey--text caption">
              ({{ filtrosPesquisa.listaDeStatus.length }} selecionados)
            </span>
          </template>
        </v-select>
      </v-flex>

      <v-flex xs12>
        <pesquisa-pessoa
          :id="'pesquisa-pessoa-cliente-'+id"
          v-model="cliente"
          @onChange="atribuirFiltroCliente"
          label="Cliente"
          placeholder
          atributoExibicao="codigoNome"
          :habilitarPesquisaAvancada="false"
          :categoriasDePessoa="['CLIENTE']"
        ></pesquisa-pessoa>
      </v-flex>

      <v-flex xs12>
        <v-select
          :id="'select-periodo-emissao-'+id"
          label="Período de emissão"
          v-model="periodoDeEmissaoSelecionado"
          :items="periodoDeEmissaoLista"
          item-text="descricao"
          item-value="valor"
          return-object
          clearable
          @click:clear="limparPeriodoEmissao"
          @change="periodoEmissaoAlterado"
        ></v-select>
      </v-flex>

      <v-flex xs12 ml-4 v-show="exibirDatasEmissaoPersonalizadas">
        <v-flex xs12>
          <date-picker
            :id="'datepicker-data-emissao-inicial-'+id"
            label="Data inicial"
            hint
            v-model="filtrosPesquisa.dataEmissaoInicial"
            data-minima="2000-01-01"
          ></date-picker>
        </v-flex>

        <v-flex xs12>
          <date-picker
            :id="'datepicker-data-emissao-final-'+id"
            label="Data final"
            :horarioPadrao="horarioFinalPadrao"
            :mensagemDeErro="validarDataEmissaoFinal()"
            hint
            v-model="filtrosPesquisa.dataEmissaoFinal"
            :data-minima="filtrosPesquisa.dataEmissaoInicial"
          ></date-picker>
        </v-flex>
      </v-flex>

      <v-layout
        :id="'link-avancado-'+id"
        @click="exibirFiltrosAvancados = !exibirFiltrosAvancados"
        justify-space-between
        align-center
        class="cursor-pointer"
      >
        <v-flex xs1>
          <v-icon class="primary--text">
            {{ exibirFiltrosAvancados ? 'keyboard_arrow_down' : 'keyboard_arrow_right' }}
          </v-icon>
        </v-flex>
        <v-flex xs4>
          <span class="primary--text">Avançado</span>
        </v-flex>
        <v-flex xs6>
          <v-divider />
        </v-flex>
      </v-layout>

      <v-flex xs12 v-show="exibirFiltrosAvancados">
        <v-layout align-center justify-space-between wrap>
          <v-flex xs12>
            <v-select
              :id="'select-tipo-contrato-'+id"
              label="Tipo de contrato"
              v-model="tipoContrato"
              :items="tiposDeContratoParaFiltro"
              item-text="descricao"
              item-value="valor"
              return-object
              clearable
              multiple
              v-show="false"
            ></v-select>
          </v-flex>

          <v-flex xs12>
            <date-picker
              :id="'datepicker-referencia-inicial-'+id"
              label="Data de referência inicial"
              hint
              v-model="filtrosPesquisa.dataInicialReferencia"
              data-minima="2000-01-01"
            ></date-picker>
          </v-flex>

          <v-flex xs12>
            <date-picker
              :id="'datepicker-referencia-final-'+id"
              label="Data de referência final"
              :horarioPadrao="horarioFinalPadrao"
              hint
              :mensagemDeErro="validarDataReferenciaFinal()"
              v-model="filtrosPesquisa.dataFinalReferencia"
              :data-minima="filtrosPesquisa.dataInicialReferencia"
            ></date-picker>
          </v-flex>

          <v-flex xs12>
            <date-picker
              :id="'datepicker-previsao-inicio-'+id"
              label="Previsão de início"
              hint
              v-model="filtrosPesquisa.dataInicioContrato"
              data-minima="2000-01-01"
            ></date-picker>
          </v-flex>

          <v-flex xs12>
            <date-picker
              :id="'datepicker-previsao-termino-'+id"
              label="Previsão de término"
              :horarioPadrao="horarioFinalPadrao"
              hint
              :mensagemDeErro="validarDataContratoFinal()"
              v-model="filtrosPesquisa.dataTerminoContrato"
              :data-minima="filtrosPesquisa.dataInicioContrato"
            ></date-picker>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout wrap class="footer-bar-sticky text-center">
      <v-flex my-3 xs12>
        <v-divider />
      </v-flex>
      <v-flex>
        <v-btn class="btn-secondary mx-0" text @click="onFiltrar" :id="'btn-filtrar-'+id">Filtrar</v-btn>
      </v-flex>
      <v-flex>
        <v-btn class="btn-tertiary mx-0" text @click="onLimpar" :id="'btn-limpar-'+id">Limpar</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PesquisaPessoa from "@/components/sistemas-gerais/pessoa/PesquisaPessoa.vue";
import { TIPOS_DE_CONTRATO_LISTA, PERIODO_EMISSAO, PERIODO_EMISSAO_LISTA } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import DatePicker from "@/components/comum/Datepicker";
import dataUtils from "@/utils/data.js";
import FiltrosPesquisaOrcamentoModel from "@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model";
import { OPCOES_STORE_CONTROLE_LOCACAO } from "@/store/modules/controle-locacao";
import PessoaModel from '../../../../../models/geral/pessoa/pessoa-model';

export default {
  components: {
    DatePicker,
    PesquisaPessoa
  },

  model: {
    prop: "filtrosPesquisa",
    event: "onFiltrar"
  },

  props: {
    id: { type: String, required: false, default: ()=> 'filtros-pesquisa-orcamento' },
    listaDeStatusParaFiltro: { type:Array, required: true },
    filtrosPesquisa: { type: FiltrosPesquisaOrcamentoModel, required: false, default: new FiltrosPesquisaOrcamentoModel() },
    periodoDeEmissao: { type: Object, required: false, default: undefined },
    titulo: { type: String, required: false, default: "Filtrar orçamentos" }
  },

  watch: {
    periodoDeEmissao() {
      this.periodoDeEmissaoSelecionado = this.periodoDeEmissao;
    },
    'filtrosPesquisa.idCliente': function (cliente) {
      cliente || (this.cliente = undefined);
    },
    'filtrosPesquisa.dataEmissaoInicial': function(){
      this.alterarPeriodoDeEmissaoAtivo();
    },
    'filtrosPesquisa.dataEmissaoFinal': function(){
      this.alterarPeriodoDeEmissaoAtivo();
    }
  },

  data: () => ({
    codigo: undefined,
    listaStatus: [],
    cliente: undefined,
    dataEmissaoInicial: undefined,
    dataEmissaoFinal: undefined,
    tipoContrato: undefined,
    dataInicialReferencia: undefined,
    dataFinalReferencia: undefined,
    dataInicioContrato: undefined,
    dataTerminoContrato: undefined,
    exibirFiltrosAvancados: false,
    exibirDatasEmissaoPersonalizadas: false,
    tiposDeContratoParaFiltro: TIPOS_DE_CONTRATO_LISTA,
    periodoDeEmissaoLista: PERIODO_EMISSAO_LISTA,
    periodoDeEmissaoOpcoes: PERIODO_EMISSAO,
    periodoDeEmissaoSelecionado: undefined,
    timeZoneEmMilissegundos: new Date().getTimezoneOffset() * 60000,
    horarioFinalPadrao: '23:59:59'
  }),

  updated() {
    if (this.filtrosPesquisa.metadados.cliente) {
      this.cliente = this.filtrosPesquisa.metadados.cliente;
    }

    if (this.filtrosPesquisa.metadados.periodoEmissao) {
      this.periodoDeEmissaoSelecionado = this.filtrosPesquisa.metadados.periodoEmissao;
      this.preencherDatasEmissao();
    }
  },

  methods: {
    limparPeriodoEmissao() {
      this.periodoDeEmissaoSelecionado = undefined;
      this.filtrosPesquisa.metadados.periodoEmissao = undefined;
    },

    alterarPeriodoDeEmissaoAtivo() {
      (!this.filtrosPesquisa.dataEmissaoInicial || !this.filtrosPesquisa.dataEmissaoFinal) && (this.periodoDeEmissaoSelecionado = undefined);
    },

    atribuirFiltroCliente(cliente){
      if (cliente) {
        this.filtrosPesquisa.idCliente = cliente.identificador;
        this.filtrosPesquisa.metadados.cliente =  new PessoaModel(cliente);
      } else {
        this.filtrosPesquisa.idCliente = undefined;
        this.filtrosPesquisa.metadados.cliente = undefined;
      }
    },

    periodoEmissaoAlterado($event){
      if ($event){
        this.filtrosPesquisa.metadados.periodoEmissao = $event;
      }

      this.exibirDatasEmissaoPersonalizadas = ($event && $event.valor == this.periodoDeEmissaoOpcoes.SELECIONAR_DATA.valor) || false;
      this.filtrosPesquisa.dataEmissaoInicial = undefined;
      this.filtrosPesquisa.dataEmissaoFinal = undefined
    },

    preencherDatasEmissao() {
      if (!this.periodoDeEmissaoSelecionado) return;

      var dataInicial = new Date();
      var dataFinal = new Date();

      switch (this.periodoDeEmissaoSelecionado.valor) {
        case PERIODO_EMISSAO.ULTIMOS_3_DIAS.valor: {
          dataInicial.setDate(dataInicial.getDate() - 3);
          break;
        }
        case PERIODO_EMISSAO.ESSA_SEMANA.valor: {
          dataInicial.setDate(dataInicial.getDate() - dataInicial.getDay());
          break;
        }
        case PERIODO_EMISSAO.SEMANA_PASSADA.valor: {
          dataFinal.setDate(dataFinal.getDate() - dataFinal.getDay() - 1);
          dataInicial = new Date(dataFinal);
          dataInicial.setDate(dataFinal.getDate() - 6);
          break;
        }
        case PERIODO_EMISSAO.ESSE_MES.valor: {
          dataInicial.setDate(1);
          break;
        }
        case PERIODO_EMISSAO.SELECIONAR_DATA.valor: {

          dataInicial = new Date(this.filtrosPesquisa.dataEmissaoInicial);
          dataFinal = new Date(this.filtrosPesquisa.dataEmissaoFinal);
          return; // TODO: Descobrir o motivo desse return (sem ele a data inicial cai 1 dia ao filtrar [wtf])
        }
      }

      this.filtrosPesquisa.dataEmissaoInicial = dataUtils.formatarDataEHoraIso(dataInicial);
      this.filtrosPesquisa.dataEmissaoFinal = dataUtils.formatarDataEHoraIso(dataFinal, this.horarioFinalPadrao);
    },

    validar() {
      let mensagemErro = this.validarDataEmissaoFinal() || this.validarDataReferenciaFinal() || this.validarDataContratoFinal();
      return !mensagemErro;
    },

    validarDataEmissaoFinal() {
      let dataEmissaoFinalInvalida = !dataUtils.dataFinalMaiorOuIgualDataInicial(
        this.filtrosPesquisa.dataEmissaoInicial,
        this.filtrosPesquisa.dataEmissaoFinal
      );

      if (dataEmissaoFinalInvalida)
        return "Deve ser maior que a data inicial"
      return;
    },

    validarDataReferenciaFinal() {
      let dataReferenciaFinalInvalida = !dataUtils.dataFinalMaiorOuIgualDataInicial(
        this.filtrosPesquisa.dataInicialReferencia,
        this.filtrosPesquisa.dataFinalReferencia
      );

      if (dataReferenciaFinalInvalida)
        return "Deve ser maior que a data inicial"
      return;
    },

    validarDataContratoFinal() {
      let dataContratoFinalInvalida = !dataUtils.dataFinalMaiorOuIgualDataInicial(
        this.filtrosPesquisa.dataInicioContrato,
        this.filtrosPesquisa.dataTerminoContrato);

      if (dataContratoFinalInvalida)
        return "Deve ser maior que a data inicial"
      return;
    },

    onFiltrar() {
      this.preencherDatasEmissao();
      if (!this.validar()) {
        return;
      }

      this.$emit("onFiltrar", this.filtrosPesquisa);
    },

    onLimpar() {
      (this.filtrosPesquisa.buscarOrcamentos) && 
      this.$store.dispatch(OPCOES_STORE_CONTROLE_LOCACAO.ACTIONS.ALTERAR_FILTRO_PADRAO_PESQUISA_ORCAMENTO, new FiltrosPesquisaOrcamentoModel());

      (this.filtrosPesquisa.buscarLocacoes) && 
      this.$store.dispatch(OPCOES_STORE_CONTROLE_LOCACAO.ACTIONS.ALTERAR_FILTRO_PADRAO_PESQUISA_GESTAO, new FiltrosPesquisaOrcamentoModel());

      (this.filtrosPesquisa.buscarLocacoesMovimentadas) && 
      this.$store.dispatch(OPCOES_STORE_CONTROLE_LOCACAO.ACTIONS.ALTERAR_FILTRO_PADRAO_PESQUISA_MOVIMENTACAO, new FiltrosPesquisaOrcamentoModel());
      
      this.periodoDeEmissaoSelecionado = undefined;
      
      this.$emit("onLimpar", new FiltrosPesquisaOrcamentoModel());
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep
  .select-status.v-input.v-text-field.v-select
  .v-input__control
  .v-input__slot
  .v-select__slot
  .v-input__append-inner {
  padding: 0;
}

/* Alterando os scrolls */
.scroller::-webkit-scrollbar-track {
  background-color: $bg_grid;
}

.scroller::-webkit-scrollbar {
  background: rgba(189, 189, 189, 0.4);
  width: 4px;
}

.scroller::-webkit-scrollbar-thumb {
  background: #696969;
  border-radius: 10px;
}

.area-filtro-pesquisa-orcamento {
  max-height: 486px;
  overflow-x: hidden;
  overflow-y: overlay;
}

.cursor-pointer {
  cursor: pointer;
}

.titulo-filtro-orcamento {
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: $cor_primaria;
}
</style>