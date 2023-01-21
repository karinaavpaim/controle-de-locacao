<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 class="lighten-5">
      <v-breadcrumbs large class="breadcrumb-alinhamento" :items="breadCrumbs">
        <template v-slot:divider>
          <v-icon>mdi-18px mdi-chevron-right</v-icon>
        </template>
        <v-breadcrumbs-item
          slot="item"
          slot-scope="{ item }"
          :class="item.disabled && 'breadcrumb-atual'"
          exact
          :to="{name: item.to}">
          <span :style="`color: ${item.color}`">
            {{ item.text }}
          </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-layout justify-space-between align-end>
        <v-flex md5 justify-start>
          <v-layout>
            <pesquisa-empresa
              :id="'pesquisa-empresa-codigo-nome-'+id"
              v-model="empresa"
              label="Empresa"
              placeholder="Pesquise pelo código ou nome da empresa"
              atributoExibicao="codigoNome"
              atributoValor="identificador"
              empresaDoSistema
              :limparCampo="false"
            ></pesquisa-empresa>
          </v-layout>
        </v-flex>

        <v-flex md2 justify-end>
          <v-select
            :id="'select-periodo-visualizacao-' + id"
            label="Período de visualização"
            v-model="periodoDeVisualizacaoSelecionado"
            :items="periodoDeVisualizacaoLista"
            item-text="descricao"
            item-value="valorEmDias"
            return-object
            @change="alterarPeriodoVisualizacaoDashboard"
          ></v-select>
        </v-flex>
      </v-layout>

      <div class="container-cartoes">
        <v-card
          v-for="(status, index) in listaStatusLocacao"
          :key="index"
          class="tamanho-cartao"
          :color="statusLocacao[status].cor_de_fundo"
          outlined
          @click="aplicarRotaEFiltroDePeriodoAoCard(status)"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="card-status">{{ statusLocacao[status].nome }}</div>
              <v-list-item-title class="valor-cartao">{{ obterTotalOrcamentosPorStatus(status) }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar rounded size="40">
              <v-icon :color="statusLocacao[status].cor_do_icone" :class="statusLocacao[status].classe">{{ statusLocacao[status].icone }}</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </div>

      <v-row>
        <v-col cols="6">
          <highcharts :options="graficoLocacaoPorStatus" v-if="dadosDashboard.locacoesPorStatus.length"></highcharts>

          <div class="bloco-sem-dados mt-1" v-else>
            <p class="titulo-graficos">Contratos por status</p>
            <v-layout wrap class="card-no-data py-12">
              <v-flex xs12>
                <v-icon class="ma-1">error_outline</v-icon>
                <span class="subheader">Não existem dados a serem exibidos.</span>
              </v-flex>
            </v-layout>
          </div>
        </v-col>

        <v-col cols="6">
          <div v-if="obterProdutosPelaCategoriaSelecionada().length">
            <highcharts :options="graficoProdutosMaisLocados"></highcharts>
          </div>

          <div class="bloco-sem-dados mt-1" v-else>
            <p class="titulo-graficos">Top 10 itens mais contratados</p>
            <v-layout wrap class="card-no-data py-12">
              <v-flex xs12>
                <v-icon class="ma-1">error_outline</v-icon>
                <span class="subheader">Não existem dados a serem exibidos.</span>
              </v-flex>
            </v-layout>
          </div>

          <div class="centralizado">
            <v-radio-group class="py-0" v-model="opcaoRadio" row>
              <v-radio label="Equipamentos" color="#0077C2" :value="categoriaItem.EQUIPAMENTO.valor"></v-radio>
              <v-radio label="Materiais" color="#0077C2" :value="categoriaItem.MATERIAL.valor"></v-radio>
              <v-radio label="Serviços" color="#0077C2" :value="categoriaItem.SERVICO.valor"></v-radio>
            </v-radio-group>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Highcharts from "highcharts";
import { STATUS_LOCACAO, CATEGORIA_ITEM, PERIODO_VISUALIZACAO, PERIODO_VISUALIZACAO_LISTA } from '@/constants/faturamento/controle-de-locacao/dashboard-constants';
import PesquisaEmpresa from '@/components/sistemas-gerais/empresa/PesquisaEmpresa.vue';
import { OPCOES_STORE_EMPRESA } from '@/store/modules/empresa';
import apiDashboardLocacao from '@/api/faturamento/controle-de-locacao/dashboard-locacao-api';
import DashboardLocacaoModel from '@/models/faturamento/orcamento-locacao/dashboard-locacao/dashboard-locacao-model';
import floatUtils from '@/utils/float-util';
import dataUtils from '@/utils/data';
import { OPCOES_STORE_CONFIGURACOES } from '@/store/modules/configuracoes';

export default {
  components: {
    PesquisaEmpresa
  },

  data() {
    return {
      id: 'dashboard-locacao',
      breadCrumbs: [{
        text: 'Dashboard',
        disabled: true,
        to: '',
        color: '#757575'
      }],
      Highcharts: Highcharts,
      opcaoRadio: CATEGORIA_ITEM.EQUIPAMENTO.valor,
      graficoLocacaoPorStatus: new Object,
      graficoProdutosMaisLocados: new Object,
      statusLocacao: STATUS_LOCACAO,
      listaStatusLocacao: Object.keys(STATUS_LOCACAO),
      categoriaItem: CATEGORIA_ITEM,
      empresa: undefined,
      dadosDashboard: new DashboardLocacaoModel(),
      periodoDeVisualizacaoLista: PERIODO_VISUALIZACAO_LISTA,
      periodoDeVisualizacaoOpcoes: PERIODO_VISUALIZACAO,
      periodoDeVisualizacaoSelecionado: undefined
    };
  },

  watch: {
    'empresa'() {
      this.alterarPeriodoVisualizacaoDashboard();
    },

    'opcaoRadio'() {
      this.montarGraficoProdutosMaisLocados();
    }
  },

  async beforeMount() {
    let empresaAtual = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL];
    let empresaPadrao = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_PADRAO];
    let listaEmpresas = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.LISTA_EMPRESAS];

    this.empresa = (empresaAtual || empresaPadrao || listaEmpresas[0]);
  },

  methods: {
    async alterarPeriodoVisualizacaoDashboard(periodo) {
      if (!periodo) {
          let configs = await this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_PAGINA];
          this.periodoDeVisualizacaoSelecionado = configs.periodoDashboard;
          periodo = configs.periodoDashboard;

      } else {
        this.$store.dispatch(OPCOES_STORE_CONFIGURACOES.ACTIONS.ALTERAR_CONFIGURACOES_PAGINA, Promise.resolve({periodoDashboard: periodo}));
      }

      let textoBreadCrumb = PERIODO_VISUALIZACAO_LISTA.find(p => p.valorEmDias === periodo.valorEmDias).descricao;
      this.breadCrumbs[0].text = textoBreadCrumb && 'Dashboard dos ' + textoBreadCrumb.toLowerCase();
      this.carregarDadosDoDashboard();
    },

    aplicarRotaEFiltroDePeriodoAoCard(status) {
      this.$router.push({
        name: this.statusLocacao[status].rota,
        params: {
          dashboard: {
            status: status,
            periodoReferencia: dataUtils.retornarDataInicialAteAtualISODosXDias(this.periodoDeVisualizacaoSelecionado.valorEmDias)
          }
        }
      });
    },

    limparDashboard() {
      this.dadosDashboard = new DashboardLocacaoModel();
      this.inicializarGraficos();
    },

    carregarDadosDoDashboard() {
      if (!this.empresa) {
        this.limparDashboard();
        return;
      }

      var identificadorEmpresa = this.empresa && this.empresa.identificador;
      apiDashboardLocacao.obterDadosDashboardLocacao(
        identificadorEmpresa,
        dataUtils.retornarDataInicialAteAtualISODosXDias(this.periodoDeVisualizacaoSelecionado.valorEmDias)
      ).then(dados => {
        this.dadosDashboard = (Array.isArray(dados) && dados[0]) || new DashboardLocacaoModel();
        this.inicializarGraficos();
      }).catch(erro => {
        this.limparDashboard();
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível consultar os dados do dashboard.`,
          mensagem: Array.isArray(erro) && erro[0] && erro.statusText
        });
      });
    },

    inicializarGraficos() {
      this.montarGraficoLocacaoPorStatus();
      this.montarGraficoProdutosMaisLocados();
    },

    montarGraficoLocacaoPorStatus() {
      Highcharts.setOptions({
        lang: {
          decimalPoint: ',',
          thousandsSep: '.'
        }
      });

      this.graficoLocacaoPorStatus = {
        colors: this.dadosDashboard.locacoesPorStatus.map(l => STATUS_LOCACAO[l.status].cor_de_fundo),
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
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
          text: 'Contratos por status'
        },
        tooltip: {
          formatter: function() {
            return this.point.name
              + '<br/><b>'
              + Highcharts.numberFormat(this.point.percentage, 2, ',', '.')
              + '%</b><br/>';
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
            fontFamily: 'Roboto Condensed',
            color: '#000000',
            fontSize: "13px"
          },
          itemMarginBottom: 5,
          align: 'center',
          width: 550,
          labelFormat: '{name}',
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
              distance: -40,
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
          name: '',
          colorByPoint: true,
          data: this.obterPercentuaisDasLocacoesPorStatus()
        }]
      }
    },

    obterPercentuaisDasLocacoesPorStatus(){
      var total = this.dadosDashboard.locacoesPorStatus.reduce((total, item) => total + item.quantidade, 0);
      var lista = this.dadosDashboard.locacoesPorStatus.map(item => {
        return {
          name: STATUS_LOCACAO[item.status].nome,
          y: floatUtils.duasCasasDecimais((item.quantidade * 100) / total)
        };
      });
      return lista;
    },

    montarGraficoProdutosMaisLocados() {
      Highcharts.setOptions({
        lang: {
          decimalPoint: ',',
          thousandsSep: '.'
        }
      });

      this.graficoProdutosMaisLocados = {
        colors: ['#0077C2'],
        chart: {
          style: {
            fontFamily: 'Roboto',
          },
          type: 'bar',
          height: '330px'
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
          text: CATEGORIA_ITEM[this.opcaoRadio].titulo
        },
        xAxis: {
          categories: this.obterProdutosPelaCategoriaSelecionada().map(p => p.nome),
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Quantidade',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          formatter: function() {
            return this.x + '<br/><b>Quantidade: ' + this.point.y +'</b><br/>';
          },
          style: { color: "#000000", fontSize: "13px" },
          backgroundColor: "#FFF",
          borderWidth: 2,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          }
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false
        },
        series: [{
          pointWidth: 10,
          name: CATEGORIA_ITEM[this.opcaoRadio].nome,
          data: this.obterProdutosPelaCategoriaSelecionada().map(p => p.quantidade),
        }]
      }
    },

    obterProdutosPelaCategoriaSelecionada() {
      switch (this.opcaoRadio) {
        case CATEGORIA_ITEM.EQUIPAMENTO.valor: return this.dadosDashboard.produtosMaisLocadosPorCategoria.dezEquipamentosMaisLocados;
        case CATEGORIA_ITEM.MATERIAL.valor: return this.dadosDashboard.produtosMaisLocadosPorCategoria.dezMateriaisMaisLocados;
        case CATEGORIA_ITEM.SERVICO.valor: return this.dadosDashboard.produtosMaisLocadosPorCategoria.dezServicosMaisLocados;
      }
    },

    obterTotalOrcamentosPorStatus(status) {
      var totais = this.dadosDashboard.locacoesPorStatus.find(l => l.status == status);
      return (totais && totais.quantidade) || 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.centralizado {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.v-radio {
  font-family: 'Roboto Condensed', sans-serif;
}

::v-deep .v-list-item__content div.card-status {
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #FFFFFF;
}

::v-deep .v-list--three-line .v-list-item .v-list-item__content, .v-list-item--three-line .v-list-item__content {
  align-self: initial;
  padding-top: 0;
}

.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border: 0;
}

.container-cartoes {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.tamanho-cartao {
  width: 252px;
  height: 72px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.valor-cartao {
  font-weight: 500;
  font-size: 22px;
  color: #FFFFFF;
}

.v-icon.tamanho-icone-cartao {
  font-size: 50px;
}

.v-icon.tamanho-icone-arquivo-cartao {
  font-size: 40px;
}

.titulo-graficos {
  color: $black;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Roboto Condensed';
  text-transform: uppercase;
  text-align: center;
  padding-bottom: 15px;
}
</style>