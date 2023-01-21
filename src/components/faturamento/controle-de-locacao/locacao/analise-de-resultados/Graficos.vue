<template>
  <v-app :id="id">
    <v-flex lg12 mt-2>
      <v-row dense>
        <v-col cols="6">
          <div class="contorno-grafico">
            <highcharts :options="graficoDemonstrativoPorCategoria"></highcharts>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="contorno-grafico">
            <div v-if="graficoOrcado">
              <highcharts :options="graficoDemonstrativoOrcadoPorCategoria"></highcharts>
            </div>
            <div v-if="!graficoOrcado">
              <highcharts :options="graficoDemonstrativoAjustadoPorCategoria"></highcharts>
            </div>
            <div class="centralizado">
              <v-radio-group class="py-0" v-model="graficoOrcado" row>
                <v-radio label="Orçado" color="#328ABA" :value="true"></v-radio>
                <v-radio label="Ajustado" color="#C55288" :value="false"></v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-flex>
  </v-app>
</template>

<script>
import Highcharts from "highcharts";
import MetaDadosAnaliseResultadoModel from '@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model';
import { CATEGORIAS_ANALISE } from '@/constants/faturamento/controle-de-locacao/analise-resultados-constants';

export default {
  props: {
    metaDados: { type: Object, default: () => new MetaDadosAnaliseResultadoModel }
  },
  
  model: {
    prop: "metaDados",
    event: "onChange"
  },

  watch:{
    metaDados() {
      this.model = this.metaDados;
      this.inicializarGraficos();
    }
  },

  data() {
    return {
      Highcharts: Highcharts,
      id: 'graficos',
      graficoDemonstrativoPorCategoria: new Object,
      graficoDemonstrativoOrcadoPorCategoria: new Object,
      graficoDemonstrativoAjustadoPorCategoria: new Object,
      rankingOrcadoPorCategoria: [],
      rankingAjustadoPorCategoria: [],
      orcados: [],
      ajustados: [],
      realizados: [],
      model: this.metaDados,
      graficoOrcado: true
    };
  },

  mounted() {
    this.inicializarGraficos();
  },

  methods: {
    inicializarGraficos() {
      this.obterOrcadoPorCategoria();
      this.obterAjustadoPorCategoria();
      this.obterRealizadoPorCategoria();
      this.montarGraficoDemonstrativoPorCategoria();
      this.montarGraficoDemonstrativoOrcadoPorCategoria();
      this.montarGraficoDemonstrativoAjustadoPorCategoria();
    },

    obterOrcadoPorCategoria() {
      this.model.detalhamento
      .filter(e => e.identificador != CATEGORIAS_ANALISE.TOTAL.ID)
      .forEach(element =>
        this.orcados.push({ 'name': element.descricao, 'y': element.orcado })
      );
    },

    obterAjustadoPorCategoria() {
      this.model.detalhamento
      .filter(e => e.identificador != CATEGORIAS_ANALISE.TOTAL.ID)
      .forEach(element =>
        this.ajustados.push({ 'name': element.descricao, 'y': element.ajustado })
      );
    },

    obterRealizadoPorCategoria() {
      this.model.detalhamento
      .filter(e => e.identificador != CATEGORIAS_ANALISE.TOTAL.ID)
      .forEach(element =>
        this.realizados.push({ 'name': element.descricao, 'y': element.realizado })
      );
    },

    montarRankingOrcadoPorCategoria() {
      this.model.detalhamento
      .filter(e => e.identificador != CATEGORIAS_ANALISE.TOTAL.ID)
      .forEach(element =>
        this.rankingOrcadoPorCategoria.push({ 'name': element.descricao, 'y': element.orcado, 'valor': element.orcado })
      );
    },

    montarRankingAjustadoPorCategoria() {
      this.model.detalhamento
      .filter(e => e.identificador != CATEGORIAS_ANALISE.TOTAL.ID)
      .forEach(element =>
        this.rankingAjustadoPorCategoria.push({ 'name': element.descricao, 'y': element.ajustado, 'valor': element.ajustado })
      );
    },

    montarGraficoDemonstrativoPorCategoria() {
      Highcharts.setOptions({
        lang: {
          decimalPoint: ',',
          thousandsSep: '.'
        }
      });

      this.graficoDemonstrativoPorCategoria = {
        colors: ['#328ABA', '#C55288', '#44B08A'],
        chart: {
          type: "column",
          height: '362px',
          style: {
            fontFamily: 'Roboto Condensed'
          }
        },
        title: {
          style: {
            color: "#000000",
            fontSize: "15px",
            fontWeight: "500",
            fontFamily: 'Roboto Condensed',
            textTransform: "uppercase",
            align: 'center'
          },
          text: 'Demonstrativo por categoria'
        },
        xAxis: {
          type: 'category',
          title: {
            text: null
          },
        },
        yAxis: {
          min: 0,
          visible: true,
          title: {
            text: "",
            align: "high"
          },
          labels: {
            overflow: "justify"
          }
        },
        legend: {
          itemStyle: {
            fontWeight: '400',
            fontSize: "13px",
            fontFamily: 'Roboto Condensed',
            color: '#000000'
          },
        },
        tooltip: {
          formatter: function() {
            return this.point.name + '<br/>' + this.series.name + ': ' + '<b>R$ ' + Highcharts.numberFormat(this.point.y,2,',','.')+'</b><br/>';
          },
          style: { opacity: "1", color: "#000000", fontSize: "13px", fontFamily: 'Roboto' },
          backgroundColor: "#FFF",
          borderWidth: 2
        },
        plotOptions: {
          column: {
            states: {
              inactive: {
                opacity: 1
              }
            }
          },
          series: {
            dataLabels: {
              enabled: false,
              shadow: true,
              style: {
                fontWeight: '900',
                color: '#000000',
              },
              format: 'R$ {point.y:,.2f}'
            }
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: "Orçado",
            data: this.orcados
          },
          {
            name: "Ajustado",
            data: this.ajustados
          },
          {
            name: "Realizado",
            data: this.realizados
          },
        ]
      };
    },

    montarGraficoDemonstrativoOrcadoPorCategoria() {
      this.montarRankingOrcadoPorCategoria();

      Highcharts.setOptions({
        lang: {
          decimalPoint: ',',
          thousandsSep: '.'
        }
      });

      this.graficoDemonstrativoOrcadoPorCategoria = {
        colors: ['#236182', '#4FA7D6', '#2F8DCC', '#8FC5EA'],
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: '300px',
          style: {
            fontFamily: 'Roboto',
          }
        },
        title: {
          style: {
            color: "#000000",
            fontSize: "15px",
            fontWeight: "500",
            fontFamily: 'Roboto Condensed',
            textTransform: "uppercase",
            align: 'center'
          },
          text: 'Demonstrativo orçado por categoria'
        },
        tooltip: {
          formatter: function() {
            return this.point.name + '<br/><b>R$ ' + Highcharts.numberFormat(this.point.y,2,',','.')+'</b><br/>';
          },
          style: { opacity: "1", color: "#000000", fontSize: "13px" },
          backgroundColor: "#FFF",
          borderWidth: 2,
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        legend: {
          useHTML: true,
          enabled: true,
          itemStyle: {
            fontWeight: '400',
            fontFamily: 'Roboto Condensed',
            color: '#000000',
            fontSize: "13px"
          },
          itemMarginBottom: 10,
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          width: '250px',
          labelFormat: '<b>{name}</b> R$ {valor:,.2f}',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0.5,
            dataLabels: {
              style: {
                fontFamily: 'Roboto Condensed'
              },
              enabled: true,
              format: '{point.percentage:,.1f}%',
              distance: -50,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 4
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          colorByPoint: true,
          data: this.rankingOrcadoPorCategoria
        }]
      }
    },

    montarGraficoDemonstrativoAjustadoPorCategoria() {
      this.montarRankingAjustadoPorCategoria();

      Highcharts.setOptions({
        lang: {
          decimalPoint: ',',
          thousandsSep: '.'
        }
      });

      this.graficoDemonstrativoAjustadoPorCategoria = {
        colors: ['#451D30', '#85385C', '#D15890', '#B9859D'],
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: '300px',
          style: {
            fontFamily: 'Roboto'
          }
        },
        title: {
          style: {
            color: "#000000",
            fontSize: "15px",
            fontWeight: "500",
            fontFamily: 'Roboto Condensed',
            textTransform: "uppercase",
            align: 'center'
          },
          text: 'Demonstrativo ajustado por categoria'
        },
        tooltip: {
          formatter: function() {
            return this.point.name + '<br/><b>R$ ' + Highcharts.numberFormat(this.point.y,2,',','.')+'</b><br/>';
          },
          style: { color: "#000000", fontSize: "13px" },
          backgroundColor: "#FFF",
          borderWidth: 2,
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        legend: {
          useHTML: true,
          enabled: true,
          itemStyle: {
            fontWeight: '400',
            color: '#000000',
            fontSize: "13px"
          },
          itemMarginBottom: 10,
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          width: '250px',
          labelFormat: '<b>{name}</b> R$ {valor:,.2f}',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0.5,
            dataLabels: {
              style: {
                fontFamily: 'Roboto Condensed'
              },
              enabled: true,
              format: '{point.percentage:,.1f}%',
              distance: -50,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 4
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          colorByPoint: true,
          data: this.rankingAjustadoPorCategoria
        }]
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contorno-grafico {
  border: 1px solid #e0e0e0;
  padding: 10px 10px 0px 10px;
}

.centralizado {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.v-radio {
  font-family: 'Roboto Condensed', sans-serif;
}
</style>