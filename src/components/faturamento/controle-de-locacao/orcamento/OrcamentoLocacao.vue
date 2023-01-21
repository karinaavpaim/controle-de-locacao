<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 id="novo-orcamento">
      <v-layout wrap>
        <v-breadcrumbs large class="breadcrumb-alinhamento" :items="breadCrumbs">
          <template v-slot:divider>
            <v-icon v-if="!ajustarGestaoLocacao">mdi-18px mdi-chevron-right</v-icon>
            <v-menu
              v-else
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
      </v-layout>

      <v-layout wrap>
        <v-flex lg10>
          <v-flex class="contorno-orcamento">
            <v-flex float-right ml-5>
              <v-row no-gutters>
                <v-flex mr-6>
                  <p class="label-codigo-orcamento">Status</p>
                  <p class="codigo-orcamento" :itens-listagem="statusLista">{{ statusLista[0].descricao }}</p>
                </v-flex>
                <v-flex mr-6>
                  <p class="label-codigo-orcamento">Código</p>
                  <p class="codigo-orcamento">{{ orcamento.codigo || '-' }}</p>
                </v-flex>
                <v-flex>
                  <p class="label-codigo-orcamento">Revisão</p>
                  <p class="codigo-orcamento">{{ orcamento.revisao || '-' }}</p>
                </v-flex>
              </v-row>
            </v-flex>

            <h2 class="h2-padrao">Empresa</h2>

            <div v-if="orcamento.empresa" class="mt-1">
              <v-col cols="12">
                <v-row>
                  <v-col cols="7">
                    <h3 class="label-padrao-empresa">Empresa</h3>
                    <p class="resumo-padrao-empresa">{{ orcamento.empresa.codigoNome || '-' }}</p>
                    <small class="label-padrao-empresa" v-if="orcamento.empresa.endereco && orcamento.empresa.endereco.modeloValido()">
                      <span>{{ orcamento.empresa.endereco.nomeLogradouro }}, </span>
                      <span>{{ orcamento.empresa.endereco.numeroLogradouro }} - </span>
                      <span v-if="orcamento.empresa.endereco.complemento">{{ orcamento.empresa.endereco.complemento }} - </span>
                      <span>{{ orcamento.empresa.endereco.bairro.nome }}, </span>
                      <span>{{ orcamento.empresa.endereco.cidade.nome }} - </span>
                      <span>{{ orcamento.empresa.endereco.cidade.UF.sigla }}, </span>
                      <span>{{ orcamento.empresa.endereco.cep }}</span>
                    </small>
                  </v-col>

                  <v-col cols="2">
                    <h3 class="label-padrao-empresa">CNPJ</h3>
                    <p class="resumo-padrao-empresa">{{ orcamento.empresa.CNPJ || '-' }}</p>
                  </v-col>

                  <v-col cols="3" class="pl-5">
                    <h3 class="label-padrao-empresa">Nome curto</h3>
                    <p class="resumo-padrao-empresa">{{ orcamento.empresa.nomeCurto || '-' }}</p>
                  </v-col>
                </v-row>
              </v-col>
            </div>

            <h2 class="h2-padrao">Informações iniciais</h2>

            <v-alert text dense color="red" border="left" class="notificacao-alerta" v-if="salvarOrcamento && !orcamento._validarInformacoesIniciais()">
              Cliente e data de referência são campos obrigatórios
            </v-alert>

            <v-flex ml-2 my-2>
              <informacoes-iniciais
                v-model="orcamento"
                :autoFocus="focoInformacoesIniciais"
                @onFocus="alterarFocus"
                :desabilitarCampos="camposDesabilitados"
              ></informacoes-iniciais>

              <outras-informacoes
                v-model="orcamento"
                :autoFocus="focoHabilitado"
                @onFocus="alterarFocus"
              ></outras-informacoes>
            </v-flex>

            <h2 class="h2-padrao">Itens</h2>
            <v-alert text dense color="red" border="left" class="notificacao-alerta" v-if="salvarOrcamento && !orcamento._validarItens()">
              O orçamento deve ter pelo menos um item do tipo equipamento ou serviço ou material
            </v-alert>

            <v-flex sm12 lg12 ml-2 my-2>
              <v-flex xs12 sm12 px-0>

                <!-- PREENCHIMENTO AUTOMATICO -->
                <v-flex class="container-preenchimento-automatico" mb-3>
                  <v-row class="align-start" no-gutters>
                    <v-btn
                      :id="'btn-exibir-esconder-preenchimento-automatico-diarias-itens-' + id"
                      class="btn-tertiary mx-0 my-0 pr-2"
                      text
                      @click="exibirPreenchimentoAutomaticoDiariasItens = !exibirPreenchimentoAutomaticoDiariasItens"
                      :disabled="!orcamento.itens || !orcamento.itens.length"
                    >
                      Preenchimento automático
                      <v-icon class="ml-1">
                        {{ exibirPreenchimentoAutomaticoDiariasItens ? "keyboard_arrow_left" : "keyboard_arrow_right" }}
                      </v-icon>
                    </v-btn>
                    <transition name="slide-x-transition">
                      <v-row class="justify-space-evenly align-end" no-gutters v-show="exibirPreenchimentoAutomaticoDiariasItens">
                        <v-col cols="4">
                          <v-text-field 
                            :id="'textfield-diarias-preenchimento-automatico-diarias-itens-'+id"
                            class="mt-0 pt-0 tipo-numero"
                            v-model="diariasPreenchimentoAutomatico"
                            hide-details 
                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                            label="Diárias"
                            v-mask="'###'"
                          ></v-text-field>
                        </v-col>
                    
                        <v-btn
                          class="btn-edit-delete-icon width-icon"
                          :id="'btn-aplicar-periodo-categorias-selecionadas-' + id"
                          text
                          @click="aplicarQuantidadeDeDiariasPadrao"
                          :disabled="!Number(diariasPreenchimentoAutomatico)"
                        >
                          <v-icon class="mr-1">
                            mdi-18px mdi-check-bold
                          </v-icon>
                          Aplicar
                        </v-btn>
                      </v-row>
                    </transition>
                  </v-row>
                </v-flex>
                <!-- FIM PREENCHIMENTO AUTOMATICO -->

                <v-tabs v-model="tabsItens.active" slider-color="primary" :id="'tabs-itens-'+id">

                  <v-tab icons-and-text v-for="n in tabsItensDoOrcamento" :key="n">
                    <v-icon v-if="n == 'Equipamentos'" class="mr-1">mdi-18px mdi-screwdriver</v-icon>
                    <v-icon v-if="n == 'Materiais'" class="mr-1">mdi-18px mdi-wall</v-icon>
                    <v-icon v-if="n == 'Serviços'" class="mr-1">mdi-18px mdi-wrench</v-icon>
                    <div> {{ n }}</div>
                  </v-tab>

                  <v-tab-item
                    :transition="false"
                    :reverse-transition="false"
                    v-for="n in tabsItensDoOrcamento"
                    :key="n"
                  >
                    <v-card class="card-table" text v-if="n == 'Equipamentos'">
                      <equipamentos
                        v-model="orcamento.itens"
                        :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
                        :adicionalPersonalizado="orcamento.adicionalPersonalizado"
                        :dataInicialPadrao="orcamento.dataInicioContrato"
                        :dataFinalPadrao="orcamento.dataTerminoContrato"
                        :quantidadeDiariasPadrao="(orcamento.quantidadeDiariasPadrao && parseInt(orcamento.quantidadeDiariasPadrao)) || 1"
                        :ajustandoItem="ajustarGestaoLocacao"
                      ></equipamentos>
                    </v-card>

                    <v-card class="card-table" text v-if="n == 'Materiais'">
                      <materiais
                        v-model="orcamento.itens"
                        :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
                        :adicionalPersonalizado="orcamento.adicionalPersonalizado"
                        :dataInicialPadrao="orcamento.dataInicioContrato"
                        :dataFinalPadrao="orcamento.dataTerminoContrato"
                        :ajustandoItem="ajustarGestaoLocacao"
                      ></materiais>
                    </v-card>

                    <v-card class="card-table" text v-if="n == 'Serviços'">
                      <servicos
                        v-model="orcamento.itens"
                        :identificadorProdutoPadrao="identificadorProdutoPadraoBimer"
                        :adicionalPersonalizado="orcamento.adicionalPersonalizado"
                        :dataInicialPadrao="orcamento.dataInicioContrato"
                        :dataFinalPadrao="orcamento.dataTerminoContrato"
                        :quantidadeDiariasPadrao="(orcamento.quantidadeDiariasPadrao && parseInt(orcamento.quantidadeDiariasPadrao)) || 1"
                        :ajustandoItem="ajustarGestaoLocacao"
                      ></servicos>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-flex>
            </v-flex>

            <h2 class="h2-padrao">Despesas e Repasses</h2>

            <v-flex sm12 lg12 ml-2 my-2>
              <v-flex xs12 sm12 pl-0 pr-0>
                <v-tabs
                  v-model="tabsDespesasRepasses.active"
                  color="#f2f2f2"
                  slider-color="primary"
                  :id="'tabs-despesas-repasses-'+id"
                >
                  <v-tab icons-and-text v-for="n in tabsGeraisOrcamento" :key="n">
                    <v-icon v-if="n == 'Despesas'" class="mr-1">mdi-18px mdi-currency-usd</v-icon>
                    <v-icon v-if="n == 'Repasses'" class="mr-1">mdi-18px mdi-cash-multiple</v-icon>
                    <div> {{ n }}</div>
                  </v-tab>

                  <v-tab-item
                    :transition="false"
                    :reverse-transition="false"
                    v-for="n in tabsGeraisOrcamento"
                    :key="n"
                  >
                    <v-card class="card-table" text v-show="n == 'Despesas'">
                      <despesas
                        v-model="orcamento.despesas"
                        :adicionalPersonalizado="orcamento.adicionalPersonalizado"
                        :ajustandoItem="ajustarGestaoLocacao"
                      ></despesas>
                    </v-card>

                    <v-card class="card-table" text v-show="n == 'Repasses'">
                      <repasses v-model="orcamento.itens" :modoEdicao="!!orcamento.identificador"></repasses>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-flex>
            </v-flex>

            <h2 class="h2-padrao">Negociação e Entrega</h2>

            <v-flex ml-2>
              <v-flex>
                <prazo-orcamento v-model="orcamento"></prazo-orcamento>
              </v-flex>
              <v-flex mt-2>
                <enderecos-orcamento
                  v-model="orcamento"
                  :cliente="this.orcamento.cliente"
                  :autoFocus="focoHabilitado"
                ></enderecos-orcamento>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>

        <v-flex lg2>
          <v-layout wrap ml-5 class="posicionamento-resumo">
            <v-flex class="contorno-resumo">
              <h2 class="h2-padrao mt-2">Resumo</h2>

              <v-flex mt-2 mb-2 text-right>
                <h3 class="label-padrao-uppercase">Equipamentos</h3>
                <p class="totalizadores-resumo">
                  {{ orcamento.calcularERetornarValoresItens().valorTotalEquipamentos | dinheiro }}
                </p>
              </v-flex>
              <v-flex mb-2 text-right>
                <h3 class="label-padrao-uppercase">Materiais</h3>
                <p class="totalizadores-resumo">
                  {{ orcamento.calcularERetornarValoresItens().valorTotalMateriais | dinheiro }}
                </p>
              </v-flex>
              <v-flex mb-2 text-right>
                <h3 class="label-padrao-uppercase">Serviços</h3>
                <p class="totalizadores-resumo">
                  {{ orcamento.calcularERetornarValoresItens().valorTotalServicos | dinheiro }}
                </p>
              </v-flex>
              <v-flex mb-2 text-right>
                <h3 class="label-padrao-uppercase">Despesas</h3>
                <p class="totalizadores-resumo">
                  {{ orcamento.calcularERetornarValoresDespesas().valorTotalDespesa | dinheiro }}
                </p>
              </v-flex>

              <v-divider></v-divider>
              <v-flex mt-2 text-right>
                <h3 class="label-padrao-uppercase">Acréscimos</h3>
                <p class="totalizadores-resumo">
                  {{ totalAcrescimos.valorTotalAcrescimos | dinheiro }}
                </p>
              </v-flex>
              <v-flex mt-2 mb-2 text-right>
                <h3 class="label-padrao-uppercase">Descontos</h3>
                <p class="totalizadores-resumo">
                  {{ totalDescontos.valorTotalDescontos | dinheiro }}
                </p>
              </v-flex>
              <v-divider></v-divider>

              <v-flex mt-2 mb-2 text-right>
                <h3 class="label-padrao-uppercase">Total do orçamento</h3>
                <p class="total-orcamento-resumo">{{ totalItens + orcamento.calcularERetornarValoresDespesas().valorTotalDespesa | dinheiro }}</p>
              </v-flex>
              <v-divider></v-divider>

              <div class="text-center mt-3 ajuste-card-resumo">
                <v-dialog v-model="dialog" scrollable width="700">
                  <template v-slot:activator="{ on }">
                    <v-btn :id="'btn-adicionais-'+id" class="btn-sem-width mx-0 my-0 px-3" text v-on="on" :disabled="!orcamento.adicionalPersonalizadoItens.length">
                      Adicionais personalizados
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="display-block">
                      <h2 class="titulo-modal">Adicionais personalizados</h2>
                    </v-card-title>

                    <v-card-text>
                      <v-layout wrap>
                        <v-flex
                          col-4
                          mb-2
                          v-for="item in orcamento.adicionalPersonalizadoItens"
                          v-bind:key="item.identificador"
                        >
                          <h3 class="label-padrao">{{item.adicionalPersonalizadoItem.descricao}}</h3>
                          <p class="totalizadores-rodape">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <span v-on="on">{{ item.valorTotalAdicionalPersonalizado | dinheiro }}</span>
                              </template>
                              R$ {{ item.valorTotalAdicionalPersonalizado }}
                            </v-tooltip>
                          </p>
                        </v-flex>
                      </v-layout>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="btn-tertiary" text @click="dialog = false" :id="'btn-fechar-' + id">
                        Fechar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-overlay :value="carregandoOrcamento">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-layout>
    </v-container>

    <div class="footer-bar-sticky footer-bar-box footer-orcamento">
      <v-btn :id="'btn-salvar-'+id" class="btn-primary width-btn-primary" text @click="salvarOrcamentoOuLocacao" :disabled="desabilitarBotaoPrimario">
        {{this.editando && 'Alterar' || 'Salvar'}}
      </v-btn>
      <v-btn :id="'btn-cancelar-'+id" class="btn-tertiary" text @click="voltarParaListagem">
        Cancelar
      </v-btn>
    </div>
  </v-app>
</template>

<script>
import EmpresaModel from "@/models/geral/empresa-model";
import InformacoesIniciais from "@/components/faturamento/controle-de-locacao/orcamento/informacoes-iniciais/InformacoesIniciaisOrcamentoLocacao";
import PrazoOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/prazo/PrazoOrcamentoLocacao.vue';
import Enderecos from "@/components/faturamento/controle-de-locacao/orcamento/enderecos/EnderecosOrcamentoLocacao";
import OutrasInformacoesOrcamentoLocacao from "@/components/faturamento/controle-de-locacao/orcamento/outras-informacoes/OutrasInformacoesOrcamentoLocacao";
import Equipamentos from "@/components/faturamento/controle-de-locacao/orcamento/itens/equipamentos/EquipamentosOrcamentoLocacao";
import Servicos from "@/components/faturamento/controle-de-locacao/orcamento/itens/servicos/ServicosOrcamentoLocacao";
import Materiais from "@/components/faturamento/controle-de-locacao/orcamento/itens/materiais/MateriaisOrcamentoLocacao";
import Despesas from "@/components/faturamento/controle-de-locacao/orcamento/despesas/DespesasOrcamentoLocacao";
import Repasses from "@/components/faturamento/controle-de-locacao/orcamento/repasses/RepassesOrcamentoLocacao";
import mascaraDinheiro from "@/utils/mascara-dinheiro";
import moment from "moment";
import apiOrcamento from "@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js";
import apiConfiguracao from "@/api/faturamento/controle-de-locacao/configuracao-locacao-api.js";
import OrcamentoLocacaoModel from "../../../../models/faturamento/orcamento-locacao/orcamento-locacao-model";
import ItemAdicionalPersonalizadoOrcamentoModel from "@/models/faturamento/orcamento-locacao/item-adicional-personalizado-orcamento-model";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { STATUS_ORCAMENTO_LOCACAO, STATUS_ORCAMENTO_LOCACAO_LISTA } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import { CATEGORIAS_ITEM, STATUS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import { orcamentoPodeSerEditado, orcamentoPodeSerAjustado } from "@/utils/workflow-controle-de-locacao";
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import { HTTP_STATUS_CODES } from '@/constants/comum/http-status-codes-constants.js';
import BreadcrumbsMixin from "@/mixins/faturamento/controle-de-locacao/breadcrumbs-mixin";
import RegistroEmUsoMixin from "@/mixins/sistema/registro-em-uso-mixin";
import notificacaoPerdaDeDadosMixin from "@/mixins/sistema/notificacao/notificacao-perda-de-dados-mixin";

export default {
  name: "Orcamento",

  mixins: [
    BreadcrumbsMixin,
    RegistroEmUsoMixin,
    notificacaoPerdaDeDadosMixin
  ],

  components: {
    "informacoes-iniciais": InformacoesIniciais,
    "prazo-orcamento": PrazoOrcamentoLocacao,
    "enderecos-orcamento": Enderecos,
    "outras-informacoes": OutrasInformacoesOrcamentoLocacao,
    equipamentos: Equipamentos,
    servicos: Servicos,
    materiais: Materiais,
    despesas: Despesas,
    repasses: Repasses,
  },

  data: () => ({
    id: 'orcamento',
    dialog: false,
    salvarOrcamento: false,
    focoHabilitado: false,
    carregandoOrcamento: false,
    carregandoEmpresaEConfiguracoes: false,
    desabilitarBotaoPrimario: false,
    editando: false,
    recalcularAdicionalPersonalizado: false,
    identificadorProdutoPadraoBimer: undefined,
    codigoOriginal: undefined,
    focoInformacoesIniciais: false,
    mensagem: "Confirme se todos os campos obrigatórios foram preenchidos.",
    rotas: ROTAS_FATURAMENTO_METADATA,
    statusLista: [STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO],
    exibirPreenchimentoAutomaticoDiariasItens: false,
    tabsItens: {
      active: 0
    },
    tabsDespesasRepasses: {
      active: 0
    },
    orcamento: new OrcamentoLocacaoModel({
      status: STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor
    }),
    tabsItensDoOrcamento: ["Equipamentos", "Materiais", "Serviços"],
    tabsGeraisOrcamento: ["Despesas", "Repasses"],
    tab: null,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    exibirAdicionaisPersonalizados: false,
    camposDesabilitados: {
      cliente: false,
      dataReferencia: false,
      adicionaisPersonalizados: false,
      nomePessoaDeContatoCliente: false,
      emailPessoaDeContatoCliente: false,
      telefonePessoaDeContatoCliente: false
    },
    ajustarGestaoLocacao: undefined,
    exibirOpcoesMenuBreadcrumb: false,
    diariasPreenchimentoAutomatico: undefined
  }),

  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
      }
      return "-";
    },
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  },

  async mounted() {
    this.carregandoEmpresaEConfiguracoes = true;
    this.orcamento.empresa = new EmpresaModel(
      await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL]
    );

    this.focoInformacoesIniciais = !this.$route.params.idOrcamento;

    /*
    *  @TODO: -- REFATORAR ESSE TRECHO PARA RECUPERAR AS INFORMACOES DA STORE ASSIM COMO OS DADOS DA EMPRESA --
    * ==========================================================================================================
    */
    this.orcamento.empresa && apiConfiguracao
      .obterConfiguracaoLocacaoPeloIdentificadorEmpresa(this.orcamento.empresa.identificador)
      .then(listaConfiguracoes => {
        let configuracoes = listaConfiguracoes[0] || {};
        this.identificadorProdutoPadraoBimer = configuracoes.secaoGeral
          && configuracoes.secaoGeral.identificadorProdutoPadraoBimer;
        return this.obterOrcamentoPeloIdentificador(this.$route.params.idOrcamento);
      })
      .finally(()=>this.carregandoEmpresaEConfiguracoes = false);
  },

  computed: {
    pessoasRepasse: function() {
      return this.orcamento
        .retornarRepassesComTotais()
        .map(r => r.repasse.pessoa);
    },

    breadCrumbs: function() {
      let text = this.codigoOriginal
        ? `Novo orçamento (cópia do ${this.codigoOriginal})`
        : this.orcamento.codigo
        ? ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.title
        : ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.title;
      text = this.ajustarGestaoLocacao
        ? ROTAS_FATURAMENTO_METADATA.ajustarLocacao.title
        : text;

      let rotas = this.orcamento.codigo
        ? ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name
        : ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name;
      rotas = this.ajustarGestaoLocacao
        ? ROTAS_FATURAMENTO_METADATA.ajustarLocacao.name
        : rotas;

      let titulo = this.ajustarGestaoLocacao
        ? ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.title
        : ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.title;
      
      let rotaPai = this.ajustarGestaoLocacao
        ? ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name
        : ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name

      return [
        {
          text: titulo,
          disabled: false,
          to: rotaPai
        },
        {
          text: text,
          disabled: true,
          to: rotas,
          color: '#757575'
        }
      ];
    },

    totalItens: function() {
      let totais = this.orcamento.calcularERetornarValoresItens();
      return (
        totais.valorTotalEquipamentos +
        totais.valorTotalServicos +
        totais.valorTotalMateriais
      );
    },

    totalDescontos: function() {
      return this.orcamento.itens.reduce(
        (acumulador, item) => {
          acumulador.valorDescontoEquipamentos +=
            item.categoria == "EQUIPAMENTO" ? item.valorDesconto : 0;
          acumulador.valorDescontoServicos +=
            item.categoria == "SERVICO" ? item.valorDesconto : 0;
          acumulador.valorDescontoMateriais +=
            item.categoria == "MATERIAL" ? item.valorDesconto : 0;
          acumulador.valorTotalDescontos =
            acumulador.valorDescontoEquipamentos +
            acumulador.valorDescontoServicos +
            acumulador.valorDescontoMateriais;
          return acumulador;
        },
        {
          valorDescontoEquipamentos: 0,
          valorDescontoServicos: 0,
          valorDescontoMateriais: 0,
          valorTotalDescontos: 0
        }
      );
    },

    totalAcrescimos: function() {
      return this.orcamento.itens.reduce(
        (acumulador, item) => {
          acumulador.valorAcrescimoEquipamentos +=
            item.categoria == "EQUIPAMENTO" ? item.valorAcrescimo : 0;
          acumulador.valorAcrescimoServicos +=
            item.categoria == "SERVICO" ? item.valorAcrescimo : 0;
          acumulador.valorAcrescimoMateriais +=
            item.categoria == "MATERIAL" ? item.valorAcrescimo : 0;
          acumulador.valorTotalAcrescimos =
            acumulador.valorAcrescimoEquipamentos +
            acumulador.valorAcrescimoServicos +
            acumulador.valorAcrescimoMateriais;
          return acumulador;
        },
        {
          valorAcrescimoEquipamentos: 0,
          valorAcrescimoServicos: 0,
          valorAcrescimoMateriais: 0,
          valorTotalAcrescimos: 0
        }
      );
    }
  },

  watch: {
    "orcamento.adicionalPersonalizado.itens": function() {
      this.preencherAdicionalPersonalizadoItens();
    },
    "orcamento.itens": function() {
      this.preencherAdicionalPersonalizadoItens();
    },
    "orcamento.despesas": function() {
      this.preencherAdicionalPersonalizadoItens();
    },
    orcamento() {
      this.statusLista = STATUS_ORCAMENTO_LOCACAO_LISTA.filter(
        s => s.valor == this.orcamento.status
      );
    }
  },

  async created() {
    let configuracoes = await this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_EMPRESA_ATUAL];

    this.editando = !!this.$route.params.idOrcamento && !(this.$route.name == ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.name);

    //saber por query se estou no modo de gestão de locação.
    this.ajustarGestaoLocacao = this.$route.query.ajuste !== undefined;

    /*
      TODO:
      Transformar em modelo
      Encapsular este código de desabilitar campos em um método
      Criar testes unitários para o método que desabilita campos
    */
    this.camposDesabilitados.cliente = this.ajustarGestaoLocacao;
    this.camposDesabilitados.dataReferencia = this.ajustarGestaoLocacao;
    this.camposDesabilitados.adicionaisPersonalizados = this.ajustarGestaoLocacao || !configuracoes.secaoGeral.utilizarAdicionaisPersonalizados;
    this.camposDesabilitados.nomePessoaDeContatoCliente = this.ajustarGestaoLocacao;
    this.camposDesabilitados.emailPessoaDeContatoCliente = this.ajustarGestaoLocacao;
    this.camposDesabilitados.telefonePessoaDeContatoCliente = this.ajustarGestaoLocacao;

    this.acaoRegistroJaEmUso = this.voltarParaListagem;
    this.acaoUsoRegistrado = () => {};
  },

  methods: {
    descricaoPrazo() {
      let descricao = "Nenhuma forma de pagamento selecionada";
      if (this.orcamento.prazo) {
        let entrada = this.orcamento.formaPagamentoEntrada;
        let parcela = this.orcamento.formaPagamentoParcelas;
        let entradaParcela = entrada && parcela ? `${entrada.nome}(Entrada) + ${parcela.nome}` : ((entrada && entrada.nome) || parcela && parcela.nome)

        descricao = `(${this.orcamento.prazo.nome}) ${entradaParcela}`
      }
      return descricao;
    },

    voltarParaListagem() {
      let rota = this.ajustarGestaoLocacao
        ? ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name
        : ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name;

      this.$router.push({ name: rota }).catch(() => {});
    },

    alterarFocus() {
      this.focoHabilitado = false;
    },

    obterOrcamentoPeloIdentificador(identificador) {
      if (!identificador) return;

      this.carregandoOrcamento = true;

      apiOrcamento
        .consultarDetalhesOrcamentoPorIdentificador(identificador)
        .then(async (resposta) => {
          this.orcamento = resposta[0];
          this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL].then((empresaAtual)=>{
            // BCDL-1587
            // Altero a empresa atual para a empresa do orçamento. Pois no acesso direto por url, a empresa atual não existe.
            // se nao tiver empresa, gero erro.
            if (!resposta[0].empresa){
              // apenas por precaução.
              this.$mensagemFlutuante.erro({
                titulo: "A empresa do orçamento não foi encontrada."
              });
              this.$router.back();
              return;
            }
            if (!empresaAtual || resposta[0].empresa.identificador != empresaAtual.identificador)
              this.$store.dispatch(OPCOES_STORE_EMPRESA.ACTIONS.ALTERAR_EMPRESA_ATUAL, new Promise((resolve)=>resolve(new EmpresaModel(this.orcamento.empresa))));
          });

          /* 
            Metodo para validar se o usuário pode acessar as rotas específicas, bloqueando
            ao tentar burlar o sistema, alterando a rota manualmente no navegador.
           */
          await this.validarAcessibilidadeDasRotas();
          this.notificarProdutosInativos();
        })
        .catch(() => {
          this.carregandoOrcamento = false;
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter as informações do orçamento`,
            mensagem: `Por favor, tente novamente.`
          });
        })
        .finally(() => {
          this.carregandoOrcamento = false;

          // Perguntar quando for edição e sempre recalcular nos demais casos o restante (quando necessário)
          if (this.existeAdicionalPersonalizadoItensComRevisaoDiferente()) {
            if (!this.editando) {
              this.preencherAdicionalPersonalizadoItens();
              return;
            }

            this.questionarUsuarioSeDesejaRecalcularOsAdicionais();
          }
        });
    },

    validarAcessibilidadeAjustarLocacao() {
      if (!this.orcamento.idEntidadeOrigem || !this.ajustarGestaoLocacao ||
          !orcamentoPodeSerAjustado(this.orcamento)) {
          this.voltarParaListagem();
      }
    },
    
    validarAcessibilidadeEditarOrcamento() {
      if (!orcamentoPodeSerEditado(this.orcamento) || this.ajustarGestaoLocacao) {
        this.voltarParaListagem();
      }
    },

    async validarAcessibilidadeDasRotas() {
      if (this.$route.name == ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.name) {
        this.orcamento.status = STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor;
        this.codigoOriginal = this.orcamento.codigo;
        this.orcamento.codigo = undefined;
        this.orcamento.revisao = undefined;
        this.preencherAdicionalPersonalizadoAoDuplicarOrcamento();
        this.alterarStatusDeItensEDespesasParaAberto();
      } else if (this.$route.name == ROTAS_FATURAMENTO_METADATA.ajustarLocacao.name) {
        this.validarAcessibilidadeAjustarLocacao();
        await this.registrarUso(this.orcamento.identificador, this.entidadesRegistroEmUso.ORCAMENTO);

      } else if (this.$route.name == ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name) {
        this.validarAcessibilidadeEditarOrcamento();
        await this.registrarUso(this.orcamento.identificador, this.entidadesRegistroEmUso.ORCAMENTO);
      }
    },

    notificarProdutosInativos() {
      let itensInativos = this.orcamento.itens.filter(item => !item.produto.ativoVenda);
      if (itensInativos.length) {
        let listaProdutos = itensInativos.map(i => `• ${i.produto.codigoNome}`);
        let listaProdutosDistintos = [...new Set(listaProdutos)];
        this.$mensagemFlutuante.aviso({
          titulo: `Atenção`,
          mensagem: `Os itens abaixo foram inativados para venda em seu cadastro:\n${listaProdutosDistintos.join('\n')}`
        });
      }
    },

    alterarStatusDeItensEDespesasParaAberto() {
      this.orcamento.itens.forEach(item => item.status = STATUS_ITEM.ABERTO.nome);
      this.orcamento.despesas.forEach(despesa => despesa.status = STATUS_ITEM.ABERTO.nome);
    },

    existeAdicionalPersonalizadoItensComRevisaoDiferente() {
      if (!this.orcamento.adicionalPersonalizado) {
        return false;
      }

      if (this.orcamento.adicionalPersonalizado.itens.length != this.orcamento.adicionalPersonalizadoItens.length) {
        return true;
      }

      return this.orcamento.adicionalPersonalizadoItens.some(
        i => i.revisao < i.adicionalPersonalizadoItem.revisao
      );
    },

    questionarUsuarioSeDesejaRecalcularOsAdicionais() {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Alteração de valores`;
      cfgMsg.mensagem = `O adicional personalizado utilizado teve seu cadastro alterado. Deseja atualizar os totais?\nCaso clique em "Não" e altere ou inclua um item ou despesa, os totais serão recalculados.`;
      cfgMsg.botaoPrimario.callback = this.preencherAdicionalPersonalizadoItens;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    preencherAdicionalPersonalizadoItens() {
      if (this.carregandoOrcamento) {
        return;
      }

      this.orcamento.adicionalPersonalizadoItens = ((this.orcamento.adicionalPersonalizado && this.orcamento.adicionalPersonalizado.itens)|| [])
        .map(i => new ItemAdicionalPersonalizadoOrcamentoModel({
          adicionalPersonalizadoItem: i,
          revisao: i.revisao,
          valorTotalAdicionalPersonalizado: 0
        }));

      this.recalcularAdicionalPersonalizado = true;
      this.calcularTotaisAdicionalPersonalizadoItens();
      this.orcamento.calcularAdicionaisPersonalizados();
    },

    preencherAdicionalPersonalizadoAoDuplicarOrcamento() {
      if (this.camposDesabilitados.adicionaisPersonalizados) {
        this.orcamento.adicionalPersonalizado = undefined;
      }
    },

    obterItensPorCategoria(categoria){
      let itens = (Array.isArray(this.orcamento.itens) && this.orcamento.itens) || [];
      return itens.filter(i => i.categoria == categoria);
    },

    calcularTotaisAdicionalPersonalizadoItens() {
      if (this.carregandoOrcamento
        || !this.orcamento.adicionalPersonalizadoItens.length
        || !this.orcamento.adicionalPersonalizado) {
        return;
      }

      let totaisAliquotas = this.orcamento.adicionalPersonalizado.obterTotaisDeAliquotasPorCategoria();
      let equipamentos = this.obterItensPorCategoria(CATEGORIAS_ITEM.EQUIPAMENTO);
      let materiais = this.obterItensPorCategoria(CATEGORIAS_ITEM.MATERIAL);
      let servicos = this.obterItensPorCategoria(CATEGORIAS_ITEM.SERVICO);
      let despesas = (Array.isArray(this.orcamento.despesas) && this.orcamento.despesas) || [];

      this.orcamento.adicionalPersonalizadoItens.forEach(orcamentoAdicionalItem => {
        orcamentoAdicionalItem.valorTotalAdicionalPersonalizado = 0;
        let adicionalItem = orcamentoAdicionalItem.adicionalPersonalizadoItem;

        if (adicionalItem.atualizaEquipamentos) {
          orcamentoAdicionalItem.valorTotalAdicionalPersonalizado +=
            this._calcularTotalDoItemDeAdicional(
              equipamentos,
              adicionalItem.aliquota,
              totaisAliquotas.valorTotalAliquotaEquipamentos);
        }

        if (adicionalItem.atualizaMateriais) {
          orcamentoAdicionalItem.valorTotalAdicionalPersonalizado +=
            this._calcularTotalDoItemDeAdicional(
              materiais,
              adicionalItem.aliquota,
              totaisAliquotas.valorTotalAliquotaMateriais);
        }

        if (adicionalItem.atualizaServicos) {
          orcamentoAdicionalItem.valorTotalAdicionalPersonalizado +=
            this._calcularTotalDoItemDeAdicional(
              servicos,
              adicionalItem.aliquota,
              totaisAliquotas.valorTotalAliquotaServicos);
        }

        if (adicionalItem.atualizaDespesas) {
          orcamentoAdicionalItem.valorTotalAdicionalPersonalizado +=
            this._calcularTotalDoItemDeAdicional(
              despesas,
              adicionalItem.aliquota,
              totaisAliquotas.valorTotalAliquotaDespesas);
        }
      });
    },

    _calcularTotalDoItemDeAdicional(itens, aliquotaItemAdicional, totalAliquotas)  {
      return itens.reduce((total, item) => {
        let totalAdicionalItem = item.valorAdicionalPersonalizado
          * (item.quantidade || 1)
          * (item.quantidadeDiarias || 1);

        return total + ((totalAdicionalItem * aliquotaItemAdicional) / totalAliquotas);
      }, 0);
    },

    async salvarOrcamentoOuLocacao() {
      this.salvarOrcamento = true;

      if (!this.orcamento.modeloValidoParaGravacao()) {
        this.$mensagemFlutuante.erro({
          titulo: `Orçamento está incompleto para operação.`,
          mensagem: this.mensagem
        });
        return;
      }

      try {
        this.desabilitarBotaoPrimario = true;
        let resposta = this.editando
          ? await apiOrcamento.editar(this.orcamento, this.recalcularAdicionalPersonalizado)
          : await apiOrcamento.cadastrar(this.orcamento);

        this.$mensagemFlutuante.sucesso({
          titulo: `Orçamento ${resposta.codigo} ${
            this.editando ? "alterado" : "cadastrado"
          } com sucesso!`,
          mensagem: ""
        });

        this.deveAvisarQuePerderaDados = false;
        
        this.ajustarGestaoLocacao
          ? this.voltarTelaGestaoLocacao()
          : this.voltarTelaOrcamento();
      } catch (erro) {
        this.desabilitarBotaoPrimario = false;
        this.salvarOrcamento = false;
        if (erro[0] && (HTTP_STATUS_CODES.BAD_REQUEST.status == erro[0].status)) {
          this.$mensagemFlutuante.aviso({
            titulo: `Atenção! Não foi possível salvar ${(this.ajustarGestaoLocacao && "o contrato") || "o orçamento"}.`,
            mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
          });
        } else {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível salvar ${(this.ajustarGestaoLocacao && "o contrato") || "o orçamento"}.`,
            mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
          });
        }
      }
    },

    voltarTelaOrcamento() {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
      }).catch(() => {});
    },

    voltarTelaGestaoLocacao() {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name
      }).catch(() => {});
    },

    informacoesObrigatoriasForamPreenchidas() {
      return this.orcamento.modeloValidoParaGravacao();
    },

    // =========================== preenchimento automatico de diarias
    aplicarQuantidadeDeDiariasPadrao() {
      let itensJaMedidosAcimaDoSolicitado = [];
      let itensComValorNegativo = [];
      this.orcamento.itens.filter(item => item.categoria != CATEGORIAS_ITEM.MATERIAL)
        .forEach(item => {
          if (this.diariasPreenchimentoAutomatico < item.diariasJaMedidas) {
            itensJaMedidosAcimaDoSolicitado.push(item);
          } else {
            let diariasOriginal = item.quantidadeDiarias;
            item.quantidadeDiarias = parseInt(this.diariasPreenchimentoAutomatico);

            if (item.calcularValorTotal() < 0) {
              item.quantidadeDiarias = diariasOriginal;
              itensComValorNegativo.push(item);
            }
          }
        });

      if (itensJaMedidosAcimaDoSolicitado.length || itensComValorNegativo.length) {
        this.notificarItensInalterados(itensJaMedidosAcimaDoSolicitado, itensComValorNegativo);
      }
      else
        this.$mensagemFlutuante.sucesso({titulo: "Diárias dos itens aplicadas com sucesso."});

      return this.diariasPreenchimentoAutomatico;
    },

    notificarItensInalterados(itensJaMedidos, itensNegativados) {
      var mensagemMedidos = itensJaMedidos.map(item => {
        let nomeProduto = this.obterNomeProdutoLimitado(item.produto, 35);
        return `• ${nomeProduto} - ${item.diariasJaMedidas} diárias já medidas.`;
      }).join(`\n`);
      mensagemMedidos = mensagemMedidos
        && `Os produtos abaixo não foram alterados, pois já foram medidos com as seguintes quantidades de diárias:\n\n${mensagemMedidos}`;

      var mensagemNegativados = itensNegativados.map(item => {
        let nomeProduto = this.obterNomeProdutoLimitado(item.produto, 50);
        return `• ${nomeProduto}.`;
      }).join(`\n`);
      mensagemNegativados = mensagemNegativados
        && `Os produtos abaixo não foram alterados, pois resultaria em valor negativo:\n\n${mensagemNegativados}`;

      if (mensagemMedidos && mensagemNegativados) {
        this.exibirNotificacaoDiariasInalteradas(mensagemMedidos, () => {
          this.exibirNotificacaoDiariasInalteradas(mensagemNegativados);
          });
      } else {
          this.exibirNotificacaoDiariasInalteradas(mensagemMedidos || mensagemNegativados);
      }
    },

    exibirNotificacaoDiariasInalteradas(mensagem, callback) {
      this.$mensagemFlutuante.aviso({
            titulo: "Itens com diárias inalteradas",
            mensagem: mensagem,
            onClose: (typeof callback) == 'function' ? callback : () => {}
          });
    },

    obterNomeProdutoLimitado(produto, tamanho) {
      return (produto.codigoNome.length > tamanho)
          ? `${produto.codigoNome.substring(0, tamanho - 3)}...`
          : produto.codigoNome;
    }
    // =========================== fim preenchimento automatico de diarias
  }
};
</script>

<style lang="scss" scoped>

button[id^="btn-exibir-esconder-preenchimento-automatico-diarias"].btn-tertiary,  .container-preenchimento-automatico {
  width: fit-content;
}

#novo-orcamento {
  background-color: $bg_grid;
}

.contorno-orcamento {
  background-color: $white;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 20px;
}

.contorno-resumo {
  background-color: $white;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 10px;
}

.posicionamento-resumo {
  position: sticky;
  top: 88px;
  min-height: calc(100vh - 120px);
  max-height: 100%;
}

.ajuste-card-resumo {
  margin-bottom: 6px;
}

#tabs-itens-orcamento ::v-deep table thead tr :nth-child(2) {
  padding-left: 0px;
}

.label-padrao-empresa {
  font-size: 11px;
  font-weight: 400;
  line-height: 18px;
  color: $grey-600;
}

.resumo-padrao-empresa {
  font-weight: 500;
  font-size: 14px;
  color: $grey-900;
}

::v-deep .v-slide-group__content {
  background-color: $white;
  height: 43px;
}

::v-deep .v-tab.v-tab--active {
  background-color: rgba(22, 80, 145, 0.15);
  color: $cor_primaria;
}

::v-deep .v-tabs-slider.primary {
  border-bottom: 3px solid $cor_primaria;
}

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

::v-deep .v-tab.v-tab--active {
  background-color: transparent;
}
</style>