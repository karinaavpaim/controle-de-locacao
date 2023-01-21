<template>
  <v-app :id="id">
    <v-container fluid px-5 py-0>
      <v-layout wrap>
        <v-breadcrumbs large class="breadcrumb-alinhamento" :items="breadCrumbs">
          <template v-slot:divider>
            <v-menu
              transition="slide-y-transition"
              bottom
              offset-y
              v-model="exibirOpcoesMenuBreadcrumb"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-18px {{ exibirOpcoesMenuBreadcrumb ? "mdi-chevron-down" : "mdi-chevron-right" }}</v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, indice) in obterOpcoesMenuMovimentacao()"
                  :key="indice"
                >
                  <v-list-item-title @click="navegarParaRota(item.rota, entidadeAtual)">{{ item.nome }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <v-breadcrumbs-item
            slot="item"
            slot-scope="{ item }"
            :class="[item.disabled && 'breadcrumb-atual']"
            exact
            :to="{ name: item.to }"
          >
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
                    <p class="resumo-padrao">{{ entidadeAtual.codigoLocacao }}</p>
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
      </v-layout>
    </v-container>

    <v-container fluid px-5 pt-0>
      <requisicao-de-locacao
        v-if="$route.name === rotas.requisicaoDeLocacao.name"
        :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
        :itensDaTabela="entidadeAtual.itens"
        :setorRequisitado="entidadeAtual.setorRequisitado"
        :setorRequisitante="entidadeAtual.setorRequisitante"
        :id="'requisicao-de-locacao-' + id"
        ref="requisicaoDeLocacaoComponent"
      ></requisicao-de-locacao>

      <expedicao-de-locacao
        v-if="$route.name === rotas.expedicaoDeLocacao.name"
        :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
        :itensDaTabela="entidadeAtual.itens"
        :id="'expedicao-de-locacao-' + id"
      ></expedicao-de-locacao>

      <medicao-de-locacao
        v-if="$route.name === rotas.medicaoDeLocacao.name && entidadeAtual.itens"
        :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
        :medicaoDaLocacao="entidadeAtual"
        :id="'medicao-de-locacao-' + id"
        ref="medicaoDeLocacaoComponent"
        @historicoRemessaRetorno="carregarDadosHistoricoRemessaRetorno"
      ></medicao-de-locacao>
    </v-container>

    <historico-remessa-retorno-item-locacao
      :identificadorDaLocacao="$route.params.idLocacao && Number($route.params.idLocacao)"
      :itemDaLocacao="itemDaLocacao"
      v-model="exibirHistoricoRemessaRetorno"
    ></historico-remessa-retorno-item-locacao>

    <barra-de-acoes-rodape
      :descricaoDoBotaoPrimario="metadados.descricaoDoBotaoPrimario"
      :acaoBotaoPrimario="confirmarAlteracoes"
      :acaoBotaoSecundario="voltarParaMovimentacao"
      :acaoBotaoTerciario="salvarRascunho"
      :mostrarBotaoTerciario="$route.name === rotas.medicaoDeLocacao.name"
      :metodoDesabilitarBotaoPrimario="metadados.metodoDesabilitarBotaoPrimario"
      :acaoBotaoQuaternario="excluirRascunhoEvoltarParaListagem"
      :mostrarBotaoQuaternario="!!locacaoCache.identificador"
      :id="'barra-de-acoes-rodape-' + id"
    ></barra-de-acoes-rodape>

    <v-overlay :value="carregando" class="nao-imprimir">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import RequisicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/RequisicaoDeLocacao";
import ExpedicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/ExpedicaoDeLocacao";
import MedicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/MedicaoDeLocacao";
import HistoricoRemessaRetornoItemLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/HistoricoRemessaRetornoItemLocacao.vue";
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import dataUtils from "@/utils/data.js";
import apiRequisicao from "@/api/estoque/requisicao-api";
import apiExpedicao from "@/api/estoque/expedicao-api";
import apiMedicao from "@/api/estoque/medicao-api";
import BarraDeAcoesRodape from "@/components/comum/BarraDeAcoesRodape";
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import MedicaoLocacaoModel from "@/models/estoque/medicao/medicao-locacao-model";
import apiLocacaoCache from "@/api/faturamento/controle-de-locacao/locacao-cache-api";
import LocacaoCacheModel from "@/models/faturamento/orcamento-locacao/locacao-cache-model";
import { CATEGORIAS } from "@/constants/faturamento/controle-de-locacao/locacao-cache-constants";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import * as env from "../../../../../../../vue.enviroment.config";
import Highcharts from "highcharts";
import MetaDadosAnaliseResultadoModel from "@/models/faturamento/orcamento-locacao/analise-de-resultados/metadados-analise-resultado-model";
import apiAnaliseDeResultados from "@/api/faturamento/controle-de-locacao/analise-de-resultados-api";
import ImpressaoLocacao from "@/utils/locacao/impressao/impressao_locacao";
import { TIPOS_REQUISICAO } from "@/constants/faturamento/controle-de-locacao/requisicao-constants";
import BreadcrumbsMixin from "@/mixins/faturamento/controle-de-locacao/breadcrumbs-mixin";
import RegistroEmUsoMixin from "@/mixins/sistema/registro-em-uso-mixin";
import notificacaoPerdaDeDadosMixin from "@/mixins/sistema/notificacao/notificacao-perda-de-dados-mixin";

export default {
  mixins: [
    BreadcrumbsMixin,
    RegistroEmUsoMixin,
    notificacaoPerdaDeDadosMixin
  ],

  components: {
    "requisicao-de-locacao": RequisicaoDeLocacao,
    "expedicao-de-locacao": ExpedicaoDeLocacao,
    "medicao-de-locacao": MedicaoDeLocacao,
    "historico-remessa-retorno-item-locacao": HistoricoRemessaRetornoItemLocacao,
    "barra-de-acoes-rodape": BarraDeAcoesRodape,
  },

  data() {
    return {
      id: "base-opcoes-movimentacao-locacao",
      Highcharts: Highcharts,
      rotas: ROTAS_FATURAMENTO_METADATA,
      carregando: false,
      desabilitarBotaoPrimario: false,
      identificadorProdutoPadraoBimer: undefined,
      entidadeAtual: new Object(),
      graficoPizzaCabecalho: undefined,
      metadados: this._obterMetadadosPelaRota(),
      locacaoCache: new LocacaoCacheModel(),
      usuarioLogado: {},
      veioDeNotificacao: false,
      metadadosAnaliseDeResultado: new MetaDadosAnaliseResultadoModel(),
      verificaSeHouveAlteracao: false,
      exibirOpcoesMenuBreadcrumb: false,
      exibirHistoricoRemessaRetorno: false,
      itemDaLocacao: undefined,
      contatoPrincipalCliente: new Object,
    }
  },

  watch: {
    "$route.params"() {
      if (this.$route.params.idLocacao) {
        this.entidadeAtual = new Object();
        this.metadados = this._obterMetadadosPelaRota();
        this.obterEntidadeAtualPeloIdentificadorDaLocacao(this.$route.params.idLocacao);
      }
    },
  },

  updated() {
    this.veioDeNotificacao = !!this.$route.params.veioDeNotificacao;
  },

  created() {
    this.acaoRegistroJaEmUso = this.voltarParaMovimentacao;
    this.acaoUsoRegistrado = this.obterLocacoesCachePeloIdentificadorLocacao;
  },

  mounted() {
    this.usuarioLogado = env.obterDadosDoUsuarioLogado();
    this.obterEntidadeAtualPeloIdentificadorDaLocacao(this.$route.params.idLocacao);
  },

  filters: {
    data_br(dataIso) {
      return dataUtils.aplicarMascaraEmDataIso(dataIso);
    },
  },

  computed: {
    breadCrumbs: function() {
      let rotaAtual = Object.values(ROTAS_FATURAMENTO_METADATA).find(rota => rota.name === this.$route.name)

      return [{
        text: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.title,
        disabled: false,
        to: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.name
      },
      {
        text: rotaAtual.title,
        disabled: true,
        color: '#757575'
      }]
    },

    valorRealizadoGraficoCabecalho() {
      return this.metadadosAnaliseDeResultado.totalGeral.realizado;
    },

    valorPendenteGraficoCabecalho() {
      let valor = this.metadadosAnaliseDeResultado.totalGeral.pendente;
      return valor >= 0 ? valor : valor * -1;
    },
  },

  methods: {
    carregarDadosHistoricoRemessaRetorno(item) {
      this.itemDaLocacao = new ItemOrcamentoLocacaoModel(item);

      // Quando o item vem da medição, o identificador do mesmo está em um atributo diferente.
      this.itemDaLocacao.identificador = this.itemDaLocacao.identificador || item.identificadorItemLocacao;
      this.exibirHistoricoRemessaRetorno = true;
    },

    async obterDadosDaMedicao(identificador) {
      try {
        let medicoes = await apiMedicao.obterMedicoes(identificador);

        return Promise.resolve(medicoes);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    obterContatoPrincipalCliente(cliente) {
      this.contatoPrincipalCliente =
        cliente.enderecoPrincipal.pessoasDeContato.find(
          (contato) => contato.contatoPrincipal
        );
    },

    montarGraficoPizzaCabecalho() {
      Highcharts.setOptions({
        lang: {
          decimalPoint: ",",
          thousandsSep: ".",
        },
      });

      this.graficoPizzaCabecalho = {
        colors: ["#165091", "#cfd8dc"],
        chart: {
          backgroundColor: ["#FAFAFA"],
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          height: "165px",
          style: {
            fontFamily: "Roboto",
          },
        },
        title: {
          text: ((this.valorRealizadoGraficoCabecalho / (this.valorRealizadoGraficoCabecalho + this.valorPendenteGraficoCabecalho)) * 100).toFixed(0) + '%',
          verticalAlign: 'middle',
          y: 30,
          style: {
            fontFamily: "Roboto",
            fontSize: "22px",
          },
        },
        subtitle: {
          text: "Evolução do contrato",
          align: "left",
          style: {
            fontFamily: "Roboto Condensed",
            fontSize: "16px",
          },
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
            valueSuffix: "%",
          },
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            borderWidth: 0,
            dataLabels: {
              style: {
                fontWeight: "bold",
                color: "#FFFFFF",
                fontSize: "13px",
              },
              enabled: false,
              format: '<b style="font-size: 13px; font-weight: 400; color: #757575">{point.name}</b><br> <b style="font-size: 16px; font-weight: 400; color: {point.color}">{point.percentage:,.1f}%</b>'
            },
            showInLegend: false,
          },
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

    configurarTrocaDeMedicaoPorRascunhoMedicao(locacaoCache) {
      let rascunho = new MedicaoLocacaoModel(JSON.parse(locacaoCache.valor));
      let cfgMsg = new CfgMensagemFlutuante();
      this.locacaoCache = locacaoCache;

      cfgMsg.titulo = `Atenção`;
      cfgMsg.mensagem = `Existe um rascunho salvo para a medição do contrato ${rascunho.codigoLocacao}. \n O que deseja fazer com este rascunho?`;
      cfgMsg.botaoPrimario.texto = "Utilizar";
      cfgMsg.botaoPrimario.callback = () => {
        this.entidadeAtual.atualizarItensDespesasPorLocacaoCache(locacaoCache);
      };
      cfgMsg.botaoSecundario.texto = "Excluir";
      cfgMsg.botaoSecundario.callback = this.excluirRascunho;
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    obterRascunhoDaMedicao(idLocacaoCache) {
      apiLocacaoCache.obterLocacaoCache(idLocacaoCache, undefined,  true)
      .then(response => {

        if(this.veioDeNotificacao){
          this.locacaoCache = new LocacaoCacheModel(response[0]);
          this.entidadeAtual.atualizarItensDespesasPorLocacaoCache(
            this.locacaoCache
          );
          return;
        }

        this.configurarTrocaDeMedicaoPorRascunhoMedicao(response[0]);
      })
      .catch(erro => {
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter o rascunho da medição.`,
          mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
        });
      })
    },

    obterLocacoesCachePeloIdentificadorLocacao(identificadorLocacao) {
      apiLocacaoCache
        .obterLocacaoCache(undefined, undefined, false)
        .then((response) => {
          var rascunhos = response.filter(
            (locacaoCache) =>
              locacaoCache.nomeEntidade === CATEGORIAS.MEDICAO.NOME_ENTIDADE &&
              locacaoCache.identificadorEntidade == identificadorLocacao
          );

        let rascunho = rascunhos.find(rascunho => rascunho.identificadorUsuario != this.usuarioLogado.identificador)
        if (rascunho && rascunho.identificador) {
          this.notificarQueRegistroJaEstaEmUso(`Neste momento esta medição está salva em rascunho com o usuário ${rascunho.loginUsuario}.`)
          return;
        }

        if (rascunhos.length) {
          this.obterRascunhoDaMedicao(rascunhos[0].identificador);
        }
      })
      .catch(erro => {
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter as medições salvas em rascunho.`,
          mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
        });
      });
    },

    excluirRascunho() {
      return apiLocacaoCache
        .deletarLocacaoCache(this.locacaoCache.identificador)
        .then(() => {
          this.locacaoCache = new LocacaoCacheModel();
          this.$mensagemFlutuante.sucesso({
            titulo: `O rascunho da medição foi excluído com sucesso!`,
          });
        })
        .catch((erro) => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível excluir o rascunho da medição.`,
            mensagem:
              (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro,
          });
        });
    },

    excluirRascunhoEvoltarParaListagem() {
      this.excluirRascunho().then(() => {
        this.voltarParaMovimentacao();
      });
    },

    salvarRascunho() {
      let medicao = new MedicaoLocacaoModel(this.entidadeAtual);

      this.locacaoCache.descricao = CATEGORIAS.MEDICAO.DESCRICAO;
      this.locacaoCache.identificadorEntidade = medicao.identificadorLocacao;
      this.locacaoCache.nomeEntidade = CATEGORIAS.MEDICAO.NOME_ENTIDADE;
      this.locacaoCache.valor = JSON.stringify(medicao);

      apiLocacaoCache
        .cadastrarOuEditarLocacaoCache(this.locacaoCache)
        .then(() => {
          this.$mensagemFlutuante.sucesso({
            titulo: `O rascunho da medição foi salvo com sucesso!`,
          });
          this.voltarParaMovimentacao();
        })
        .catch((erro) => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível salvar o rascunho da medição.`,
            mensagem:
              (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro,
          });
        });
    },

    voltarParaMovimentacao() {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.name
      }, () => {}, () => {}); // Resolvendo 2 problemas, um no teste que não econtrava o catch e outro de NavigationDuplicated.
    },

    _obterMetadadosPelaRota() {
      let metadados = {
        salvar: undefined,
        obter: undefined,
        descricaoDoBotaoPrimario: "Salvar",
        imprimir: () => {}, // sera usado quando for feito a impressao de medicao
        metodoDesabilitarBotaoPrimario: () => {},
        metodoConfirmacao: (callback) => callback(),
      };

      switch (this.$route.name) {
        case ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name:
          metadados.obter = apiRequisicao.obterRequisicoesPorIdLocacao;
          metadados.salvar = this._gerarRequisicao;
          metadados.metodoConfirmacao = this.confirmarRequisicao;
          metadados.descricaoDoBotaoPrimario = "Gerar requisição";
          metadados.metodoDesabilitarBotaoPrimario = () =>
          (
            !!this.entidadeAtual.itens && !this.entidadeAtual.itens.some(item =>
              (item.quantidadeARequisitar > 0)
              || (Array.isArray(item.baixas) && !!item.baixas.length && item.baixas.some(baixa=>baixa.quantidadeADevolver > 0))
            )
          ) || this.desabilitarBotaoPrimario;
        break;

        case ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name:
          metadados.obter = apiExpedicao.obterExpedicoes;
          metadados.salvar = this._gerarExpedicao;
          metadados.metodoConfirmacao = this.confirmarExpedicao;
          metadados.metodoDesabilitarBotaoPrimario = () => this.entidadeAtual.itens && this.entidadeAtual.itens.reduce((anterior, item)=>{
            return anterior && item.liberacoes.reduce((anterior, liberacao)=> anterior && !(liberacao.quantidadeAExpedir > 0), true)
          }, true) || this.desabilitarBotaoPrimario;
          metadados.descricaoDoBotaoPrimario = "Gerar expedição";
        break;

        case ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name:
          metadados.obter = this.obterDadosDaMedicao;
          metadados.salvar = this._gerarMedicao;
          metadados.metodoConfirmacao = this.confirmarMedicao;
          metadados.metodoDesabilitarBotaoPrimario = () =>
            (this.entidadeAtual.itens &&
              !this.entidadeAtual.itens.some((item) =>
                item.desmembramentos.some((desmembramento) =>
                  desmembramento.modeloAlterado()
                )
              )) ||
            this.desabilitarBotaoPrimario;

          metadados.descricaoDoBotaoPrimario = "Gerar medição";
        break;
      }

      return metadados;
    },

    _gerarRequisicao() {
      let houveAlteracao = false;
      let erros = this.entidadeAtual.itens.reduce((erros, item)=>{
        if (item.quantidadeARequisitar
          || (
            Array.isArray(item.baixas)
            && !!item.baixas.length
            && item.baixas.some(b => b.quantidadeADevolver)
          )) houveAlteracao = true;

        if (!item.quantidadeARequisitarValida())
          erros.push(`O item código ${item.produto.codigo} ultrapassa a quantidade máxima para requisição.`);

        if (item.baixas.some(baixa => !baixa.quantidadeADevolverValida()))
          erros.push(`O item código ${item.produto.codigo} ultrapassa a quantidade máxima para devolução.`);

        return erros;
      }, []);

      if (!houveAlteracao)
        erros.push("Os itens da requisição não possuem quantidade a requisitar ou a devolver.");

      if (erros.length)
        return Promise.reject(erros.join("\n"));

      this.deveAvisarQuePerderaDados = false;

      return new Promise((resolve, reject) => {
        apiRequisicao
          .enviarDadosRequisicao(this.entidadeAtual)
          .then((res) => {
            ImpressaoLocacao.imprimirRequisicao(res).catch((erro) => {
              this.$mensagemFlutuante.erro({
                titulo: `Não foi possível imprimir a requisição.`,
                mensagem:
                  (Array.isArray(erro) && erro[0] && erro[0].statusText) ||
                  erro,
              });
            });
            resolve(res);
          })
          .catch((e) => reject(e));
      });
    },

    _gerarExpedicao() {
      let houveAlteracao = false;
      let erros = [];
      this.entidadeAtual.itens.forEach((item) => {
        erros = item.liberacoes.reduce((erros, liberacao) => {
          if (liberacao.quantidadeAExpedir) houveAlteracao = true;

          if (!liberacao.quantidadeAExpedirValida())
            erros.push(`O item código ${item.produto.codigo} ultrapassa a quantidade máxima para expedição.`)
          return erros;
        }, erros);
      });

      if (!houveAlteracao) erros.push("Os itens da expedição não possuem quantidade a expedir.")

      if (erros.length)
        return Promise.reject(erros.join("\n"));

      this.deveAvisarQuePerderaDados = false;

      return new Promise((resolve, reject) => {
        apiExpedicao
          .enviarDadosExpedicao(this.entidadeAtual)
          .then((res) => {
            ImpressaoLocacao.imprimirExpedicao(this.entidadeAtual).catch(
              (erro) => {
                this.$mensagemFlutuante.erro({
                  titulo: `Não foi possível imprimir a expedição.`,
                  mensagem:
                    (Array.isArray(erro) && erro[0] && erro[0].statusText) ||
                    erro,
                });
              }
            );
            resolve(res);
          })
          .catch((e) => reject(e));
      });
    },

    existemDespesasPendentes(medicao) {
      return medicao.despesas.some(function(despesa) {
        return despesa.desmembramentos.some(function(d) {
          if (!d.totalmenteMedido && (d.quantidadeAMedir != d.quantidadeMaxima)) {
            return true;
          }

          if (!d.datasAMedir.length && d.quantidadeAMedir) {
            return true;
          }

          return false;
        });
      });
    },

    obterItensPendentes(medicao) {
      return medicao.itens.filter(item =>
        item.desmembramentos.length && item.desmembramentos.some((i) => !i.totalmenteMedido)
      );
    },

    estaSendoMedidoCompletamente(medicao) {
      let itensPendentes = this.obterItensPendentes(medicao);

      if (!Array.isArray(itensPendentes) || !itensPendentes.length) {
        return false;
      }

      for (var i = 0; i < itensPendentes.length; i++) {
        if (itensPendentes[i].desmembramentos.some(d => ((itensPendentes[i].quantidadeDiarias - d.datasMedidas.length) > d.datasAMedir.length)
          || (d.quantidadeAMedir < d.quantidadeMaxima))) {
          return false;
        }
      }

      return true;
    },

    confirmarRequisicao(callback) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = "Atenção!";
      cfgMsg.mensagem = "Deseja gerar a requisição?";
      cfgMsg.exibirIconeFechar = false;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = callback;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    confirmarExpedicao(callback) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = "Atenção!";
      cfgMsg.mensagem = "Deseja gerar a expedição?";
      cfgMsg.exibirIconeFechar = false;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = callback;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    confirmarMedicao(callback) {
      let medicao = new MedicaoLocacaoModel(this.entidadeAtual);

      if (this.existemDespesasPendentes(medicao) && this.estaSendoMedidoCompletamente(medicao)) {
        let cfgMsg = new CfgMensagemFlutuante();
        cfgMsg.titulo = `Deseja concluir a medição sem a inclusão de todas as despesas?`;
        cfgMsg.mensagem = `A medição das despesas precisa ser somada aos itens do contrato, conforme prioridade definida nas configurações do sistema.`;
        cfgMsg.exibirIconeFechar = false;
        cfgMsg.botaoPrimario.texto = "Sim";
        cfgMsg.botaoPrimario.callback = callback;
        cfgMsg.botaoSecundario.texto = "Não";
        this.$mensagemFlutuante.confirmacao(cfgMsg);
      } else {
        let cfgMsg = new CfgMensagemFlutuante();
        cfgMsg.titulo = `Atenção!`;
        cfgMsg.mensagem = `Deseja gerar a medição?`;
        cfgMsg.exibirIconeFechar = false;
        cfgMsg.botaoPrimario.texto = "Sim";
        cfgMsg.botaoPrimario.callback = callback;
        cfgMsg.botaoSecundario.texto = "Não";
        this.$mensagemFlutuante.confirmacao(cfgMsg);
      }
    },

    confirmarAlteracoes() {
      this.metadados.metodoConfirmacao(this.enviarDados);
    },

    _gerarMedicao() {
      let erros = this.entidadeAtual.obterErrosDaMedicaoDeLocacao();
      if (erros.length) return Promise.reject(erros.join("\n"));

      // Faco a copia do objeto e parse para o envio. (nao posso modificar o original)
      // para detalhes do motivo, verificar desmembramento-medicao-model.js
      let medicao = new MedicaoLocacaoModel(this.entidadeAtual);
      medicao.itens.forEach((item) =>
        item.atualizarIdentificadorDosDesmembramentosPreenchidos()
      );

      medicao.despesas.forEach((despesa) =>
        despesa.atualizarIdentificadorDosDesmembramentosPreenchidos()
      );

      this.deveAvisarQuePerderaDados = false;

      return new Promise((resolve, reject) => {
        apiMedicao
          .enviarDadosMedicao(medicao)
          .then((res) => {
            ImpressaoLocacao.imprimirMedicao(this.entidadeAtual).catch(
              (erro) => {
                this.$mensagemFlutuante.erro({
                  titulo: `Não foi possível imprimir a medição.`,
                  mensagem:
                    (Array.isArray(erro) && erro[0] && erro[0].statusText) ||
                    erro,
                });
              }
            );
            resolve(res);
          })
          .catch((e) => reject(e));
      });
    },

    notificarSucessoRequisicao(dados) {
      var mensagemSucesso = ``;
      var requisicao = dados.find((r) => r.tipo == TIPOS_REQUISICAO.REQUISICAO);
      var devolucao = dados.find((r) => r.tipo == TIPOS_REQUISICAO.DEVOLUCAO);

      if (requisicao) {
        mensagemSucesso += `Requisição ${requisicao.codigoRequisicao} criada com sucesso.`;
      }

      if (devolucao) {
        mensagemSucesso += requisicao ? `\n` : ``;
        mensagemSucesso += `Requisição de devolução ${devolucao.codigoRequisicao} criada com sucesso.`;
      }

      this.$mensagemFlutuante.sucesso({ titulo: "Sucesso!", mensagem: mensagemSucesso });
    },

    enviarDados() {
      this.carregando = true;
      this.desabilitarBotaoPrimario = true;
      this.metadados
        .salvar()
        .then((dados) => {
          if ((this.$route.name == ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name)
            && Array.isArray(dados)
            && dados.length) {
            this.notificarSucessoRequisicao(dados);
          } else {
            this.$mensagemFlutuante.sucesso({titulo: "Informações salvas com sucesso!"});
          }

          if (this.locacaoCache.modeloValido()) {
            this.excluirRascunhoEvoltarParaListagem(); // Aqui vai poder ser de qualquer coisa. Medicao, Expedicao e Requisicao
          }

          this.$router.push(ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao).catch(() => {});
        })
        .catch((erro) => {
          this.$mensagemFlutuante.erro({
            titulo: "Não foi possível salvar as informações.",
            mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
          });
        })
        .finally(() => {
          this.carregando = false;
          this.desabilitarBotaoPrimario = false;
        });
    },

    obterDadosDoGraficoDoCabecalho(identificador) {
      apiAnaliseDeResultados.obterResultadosPorIdLocacao(identificador)
      .then(dadosGrafico => {
        this.metadadosAnaliseDeResultado = dadosGrafico[0].obterMetaDados();
        this.montarGraficoPizzaCabecalho();
      })
      .catch(() => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter as informações do gráfico.`,
          });
        });
    },

    obterEntidadeAtualPeloIdentificadorDaLocacao(identificador) {
      if (!identificador) return;

      this.carregando = true;
      // Tenta registrar o uso antes de carregar os dados (url já está em uso), para garantir a concorrência.
      // Mesmo que os dados não carreguem, o uso é liberado ao sair da url.
      this.registrarUso(identificador, this.entidadesRegistroEmUso.ORCAMENTO)
        .then(() => this.carregarDados(identificador));
    },

    carregarDados(identificador) {
      this.obterDadosDoGraficoDoCabecalho(identificador);
      let metodo = this.metadados.obter;

      metodo(identificador)
        .then((resposta) => {
          this.entidadeAtual = resposta[0];
          this.obterContatoPrincipalCliente(this.entidadeAtual.cliente);

          // Consultando empresa 0 fictícia já que esta configuração vem do Bimer e não está vinculada à
          // nenhuma empresa. Caso precise das demais configurações, será necessário incluir a
          // empresa nos modelos de todas as classes que herdam desta classe base.
          this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_GERAIS].then(configuracoes => {
              this.identificadorProdutoPadraoBimer = configuracoes.secaoGeral
                && configuracoes.secaoGeral.identificadorProdutoPadraoBimer;
          });

          this.notificarProdutosInativos();
        })
        .catch((erro) => {
          this.carregando = false;
          let mensagemErro = Array.isArray(erro) && erro[0] && erro[0].statusText || erro;

          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter as informações do contrato.`,
            mensagem: mensagemErro || `Por favor, tente novamente.`,
          });
        })
        .finally(() => (this.carregando = false));
    },

    notificarProdutosInativos() {
      let itensInativos = this.entidadeAtual.itens.filter(item => !item.produto.ativoVenda);
      if (itensInativos.length) {
        let listaProdutos = itensInativos.map(i => `• ${i.produto.codigoNome}`);
        let listaProdutosDistintos = [...new Set(listaProdutos)];
        this.$mensagemFlutuante.aviso({
          titulo: `Atenção`,
          mensagem: `Os itens abaixo foram inativados para venda em seu cadastro:\n${listaProdutosDistintos.join('\n')}`
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .selo-tabela-generica {
  padding: 0;
}

::v-deep .breadcrumb-alinhamento .v-icon--link {
  padding-left: 1px;
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