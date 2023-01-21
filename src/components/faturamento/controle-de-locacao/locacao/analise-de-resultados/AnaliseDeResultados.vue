<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 class="lighten-5">
      <v-breadcrumbs large class="breadcrumb-alinhamento" :items="breadCrumbs">
        <template v-slot:divider>
          <v-menu
              transition="slide-y-transition"
              bottom
              offset-y
              v-model="exibirOpcoesMenuBreadcrumb"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-18px {{ exibirOpcoesMenuBreadcrumb ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, indice) in obterOpcoesMenuGestao()"
                  :key="indice"
                >
                  <v-list-item-title @click="navegarParaRota(item.rota)">{{ item.nome }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </template>
        <v-breadcrumbs-item
          slot="item"
          slot-scope="{ item }"
          :class="[item.disabled && 'breadcrumb-atual']"
          exact
          :to="{name: item.to}">
          <span :style="`color: ${item.color}`">
            {{ item.text }}
          </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-flex lg12>
        <v-row>
          <v-col lg="10" class="px-2 pl-3 pt-0">
            <div class="contorno-cabecalho">
              <v-row>
                <v-col md="2">
                  <label class="label-padrao">Código do contrato</label>
                  <p class="resumo-padrao">{{ entidadeAtual.codigo }}</p>
                </v-col>
                <v-col md="4">
                  <label class="label-padrao">Cliente</label>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" role="text">
                        <p class="resumo-padrao text-truncate nome-cliente" v-if="entidadeAtual.cliente">{{ entidadeAtual.cliente.nome }}</p>
                      </div>
                    </template>
                    <span>{{ entidadeAtual.cliente && entidadeAtual.cliente.nome }}</span>
                  </v-tooltip>
                  <p class="micro-copia" v-if="entidadeAtual.cliente">{{ entidadeAtual.cliente.nomeCurto || "-"  }} ({{ entidadeAtual.cliente.CPFouCNPJ || "-" }})</p>
                </v-col>
                <v-col md="4" class="pa-0">
                  <v-row>
                    <v-col md="4">
                      <label class="label-padrao">Pessoa de contato</label>
                      <p class="resumo-padrao text-truncate">{{ entidadeAtual && entidadeAtual.nomePessoaDeContatoCliente || "-" }}</p>
                    </v-col>
                    <v-col md="8">
                      <label class="label-padrao">E-mail</label>
                      <p class="resumo-padrao text-truncate">{{ (entidadeAtual && entidadeAtual.emailPessoaDeContatoCliente || contatoPrincipalCliente && contatoPrincipalCliente.email) || "-" }}</p>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col md="2">
                  <label class="label-padrao">Telefone</label>
                  <p class="resumo-padrao">{{ (entidadeAtual && entidadeAtual.telefonePessoaDeContatoCliente || contatoPrincipalCliente && contatoPrincipalCliente.telefoneFixo) || "-" }}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="10" class="py-2">
                  <label class="label-padrao">Objetivo do orçamento</label>
                  <p class="resumo-padrao">{{ entidadeAtual.descricao || "-" }}</p>
                </v-col>
                <v-col md="2" class="py-2">
                  <label class="label-padrao">Data de referência</label>
                  <p class="resumo-padrao">{{ entidadeAtual.dataReferencia | data_br }}</p>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col lg="2" class="px-0 pr-3 pt-0">
            <div class="contorno-grafico-cabecalho pl-1">
              <highcharts :options="graficoPizzaCabecalho" v-if="!!graficoPizzaCabecalho"></highcharts>
            </div>
          </v-col>
        </v-row>
      </v-flex>

      <v-flex lg12>
        <cartoes
          v-model="metadadosAnaliseDeResultado"
        ></cartoes>

        <graficos
          v-model="metadadosAnaliseDeResultado"
        ></graficos>
      </v-flex>

       <v-flex lg12>
        <tree-view
          v-model="metadadosAnaliseDeResultado"
          :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
        ></tree-view>
      </v-flex>

      <v-overlay :value="carregando">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
  </v-app>
</template>

<script>
import apiAnaliseDeResultados from "@/api/faturamento/controle-de-locacao/analise-de-resultados-api";
import Cartoes from "@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/Cartoes.vue";
import Graficos from "@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/Graficos.vue";
import TreeView from "@/components/faturamento/controle-de-locacao/locacao/analise-de-resultados/TreeView.vue";
import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import dataUtils from "@/utils/data.js";
import Highcharts from "highcharts";
import BreadcrumbsMixin from "@/mixins/faturamento/controle-de-locacao/breadcrumbs-mixin";

export default {
  mixins: [BreadcrumbsMixin],
  components: {
    Cartoes,
    Graficos,
    TreeView
  },

  data() {
    return {
      id: 'analise-de-resultado',
      Highcharts: Highcharts,
      entidadeAtual: new Object,
      graficoPizzaCabecalho: new Object,
      metadadosAnaliseDeResultado: new MetaDadosAnaliseResultadoModel(),
      carregando: true,
      identificadorProdutoPadraoBimer: undefined,
      exibirOpcoesMenuBreadcrumb: false,
      contatoPrincipalCliente: new Object
    }
  },

  mounted() {
    this.obterMetaDadosLocacao(this.$route.params.idLocacao);
  },

  filters: {
    data_br(dataIso) {
      return dataUtils.aplicarMascaraEmDataIso(dataIso);
    }
  },

  computed: {
    breadCrumbs: function() {
      return [
        {
          text: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.title,
          disabled: false,
          to: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name
        },
        {
          text: ROTAS_FATURAMENTO_METADATA.analiseDeResultados.title,
          disabled: true,
          to: ROTAS_FATURAMENTO_METADATA.analiseDeResultados.name,
          color: '#757575'
        }
      ];
    },

    valorRealizadoGraficoCabecalho() {
      return this.metadadosAnaliseDeResultado.totalGeral.realizado;
    },
    
    valorPendenteGraficoCabecalho() {
      let valor = this.metadadosAnaliseDeResultado.totalGeral.pendente;
      return (valor >= 0) ? valor : valor * -1;
    },
  },

  methods: {
    obterContatoPrincipalCliente(cliente) {
      this.contatoPrincipalCliente =
        cliente.enderecoPrincipal.pessoasDeContato.find(
          (contato) => contato.contatoPrincipal
        );
    },

    montarGraficoPizzaCabecalho() {
      Highcharts.setOptions({
        lang: {
          decimalPoint: ',',
          thousandsSep: '.'
        }
      });

      this.graficoPizzaCabecalho = {
        colors: ['#165091', '#cfd8dc'],
        chart: {
          backgroundColor: ['#FAFAFA'],
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: '155px',
          style: {
            fontFamily: 'Roboto'
          }
        },
        title: {
          text: ((this.valorRealizadoGraficoCabecalho / (this.valorRealizadoGraficoCabecalho + this.valorPendenteGraficoCabecalho)) * 100).toFixed(0) + '%',
          verticalAlign: 'middle',
          y: 30,
          style: {
            fontFamily: 'Roboto',
            fontSize: '22px',
          }
        },
        subtitle: {
          text: 'Evolução do contrato',
          align: 'left',
          style: {
            fontFamily: 'Roboto Condensed',
            fontSize: '16px',
          }
        },
        tooltip: {
          formatter: function() {
            return this.point.name + '<br/><b>R$ ' + Highcharts.numberFormat(this.point.y,2,',','.')+'</b><br/>';
          },
          style: { opacity: "1", color: "#000000", fontSize: "13px" },
          backgroundColor: "#FFF",
          borderWidth: 2
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0,
            dataLabels: {
              style: {
                fontWeight: 'bold',
                color: '#FFFFFF',
                fontSize: "13px"
              },
              enabled: false,
              format: '<b style="font-size: 13px; font-weight: 400; color: #757575">{point.name}</b><br> <b style="font-size: 16px; font-weight: 400; color: {point.color}">{point.percentage:,.1f}%</b>'
            },
            showInLegend: false
          }
        },
        series: [{
          name: 'Valor',
          colorByPoint: true,
          innerSize: '70%',
          data: [{
            name: 'Realizado',
            y: this.valorRealizadoGraficoCabecalho
          },
          {
            name: 'Pendente',
            y: this.valorPendenteGraficoCabecalho
          }]
        }]
      }
    },

    obterMetaDadosLocacao(identificador) {
      this.carregando = true;
      apiAnaliseDeResultados.obterResultadosPorIdLocacao(identificador)
      .then(resposta => {
        this.metadadosAnaliseDeResultado = resposta[0].obterMetaDados();
        this.entidadeAtual = resposta[0].locacao;
        this.obterContatoPrincipalCliente(this.entidadeAtual.cliente);
        this.montarGraficoPizzaCabecalho();
        this.preencherIdentificadorProdutoPadrao();
      })
      .catch(erro =>{
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter as informações para análise de resultados.`,
          mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
        });
      })
      .finally(() => this.carregando = false);
    },

    preencherIdentificadorProdutoPadrao() {
      this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_GERAIS].then(configuracoes => {
        this.identificadorProdutoPadraoBimer = configuracoes.secaoGeral
        && configuracoes.secaoGeral.identificadorProdutoPadraoBimer;
      });
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .breadcrumb-alinhamento .v-icon--link {
  color: #165091;
  background-color: #cfd8dc;
  border-radius: 50%;
}

::v-deep .v-list-item {
  padding-left: 0px;
  padding-right: 0px;
  cursor: pointer;
}

::v-deep .v-list-item .v-list-item__title {
  height: 100%;
  padding: 16px 16px;
}

::v-deep .v-list-item .v-list-item__title:hover {
  background-color: $very-light-gray;
}

.micro-copia {
  font-size: 12px;
  color: $gray;
  font-weight: 300;
}
</style>