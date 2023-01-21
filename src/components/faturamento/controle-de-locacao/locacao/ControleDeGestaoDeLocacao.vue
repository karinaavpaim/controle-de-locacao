<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 justify-space-around>
      <v-layout justify-space-between>
        <v-flex xm12 justify-start>
          <v-breadcrumbs large class="breadcrumb-alinhamento" :items="breadCrumbs">
            <template v-slot:divider>
              <v-icon>mdi-18px mdi-chevron-right</v-icon>
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
        </v-flex>
      </v-layout>

      <v-layout justify-space-between>
        <v-flex xs5>
          <pesquisa-empresa
            :id="'pesquisa-empresa-codigo-nome-'+id"
            v-model="empresa"
            label="Empresa"
            placeholder="Pesquise pelo código ou nome da empresa"
            atributoExibicao="codigoNome"
            atributoValor="identificador"
            empresaDoSistema
          ></pesquisa-empresa>
        </v-flex>

        <v-flex xs7 align-self-center class="text-right" v-show="filtrosAtivos.length">
          <v-chip
            v-for="filtro in filtrosAtivos"
            :key="filtro.descricao"
            @click:close="removerFiltrosPorGrupo(filtrosPesquisaGestao, filtro)"
            x-small
            close
            class="ml-1"
          >
            {{ filtro.descricao }}
          </v-chip>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex>
          <v-layout>
            <v-flex class="md3 ml-auto">
              <v-text-field
                :id="'textfield-pesquisar-'+id"
                class="input-pesquisar pesquisa-externa-grid ma-0"
                v-model="pesquisa"
                append-icon="search"
                label="Pesquisar"
                v-show="orcamentosDeLocacao.length > 0"
                single-line
                hide-details
              ></v-text-field>
            </v-flex>

            <v-flex class="largura-igual-conteudo ml-5">
              <v-btn
                :id="'btn-filtros-'+id"
                class="btn-tertiary width-icon mr-0 mt-0 ml-0 my-2"
                text
                @click="exibirFiltros = !exibirFiltros"
              >
                <v-icon class="size-icon-filter" v-show="!exibirFiltros">arrow_back_ios</v-icon>
                  Filtros
                <v-icon class="size-icon-filter ml-2" v-show="exibirFiltros">arrow_forward_ios</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <tabela-generica
              :id="'tabela-generica-'+id"
              :lista-colunas="colunasTabelaGestaoLocacao"
              :itens-tabela="orcamentosDeLocacao"
              :exibirPesquisa="false"
              :pesquisaExterna="pesquisa"
              mensagemNenhumItem="Não encontramos orçamentos para esta empresa."
              chave-modelo-configuracoes-pagina="linhasTabelaPadrao"
            >
              <template v-slot:primeiras-colunas-personalizadas="{ item }">
                <td class="text-center">
                  <v-badge left avatar color="transparent" offset-y="16" offset-x="-3">
                    <template v-slot:badge v-if="item.possuiItemComProdutoPadrao">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-avatar v-on="on">
                            <v-icon small color="#f4511e">mdi-alert-decagram-outline</v-icon>
                          </v-avatar>
                        </template>
                        <span>Este contrato possui o produto padrão.</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:default>
                      <destaque-pesquisa :pesquisa="pesquisa">{{ item.codigo }}</destaque-pesquisa>
                    </template>
                  </v-badge>
                </td>
                <td class="text-left px-1 d-flex align-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-dados-cliente-'+id"
                        color="primary"
                        class="pa-1"
                        icon
                        x-small
                        v-on="on"
                        @click="exibirModalDadosDoCliente(item)"
                        @click.stop
                      >
                        <v-icon>mdi-account-box-outline</v-icon>
                      </v-btn>
                    </template>
                    Dados do cliente
                  </v-tooltip>
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.nomeCliente }}</destaque-pesquisa>
                </td>
              </template>

              <template v-slot:area-expandida="{ item }">
                <v-row>
                  <v-flex lg12>
                    <v-row no-gutters>
                      <v-flex sm12>
                        <v-row no-gutters>
                          <v-flex sm12 pl-12>
                            <h3 class="label-padrao">Objetivo do orçamento</h3>
                            <strong>{{ item.descricao || '-' }}</strong>
                          </v-flex>
                        </v-row>
                      </v-flex>
                    </v-row>
                  </v-flex>
                </v-row>
              </template>

              <template v-slot:ultimas-colunas-personalizadas="{ item }">
                <td class="text-center">
                  <chip-select
                    :itens-listagem="montarStatusOrcamento(item)"
                    @onChange=" (status, statusAnterior) => alterarStatus(status, item, statusAnterior)"
                    v-model="item.valorStatus"
                  >
                    <destaque-pesquisa :pesquisa="pesquisa">{{ item.descricaoStatus }}</destaque-pesquisa>
                  </chip-select>
                </td>
                <td class="text-center">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.dataEmissaoIso | data_br }}</destaque-pesquisa>
                </td>
                <td class="text-center tabela-coluna-oculta">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.dataEmissaoFormatada | data_br }}</destaque-pesquisa>
                </td>
                <td class="text-center">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.dataReferenciaIso | data_br }}</destaque-pesquisa>
                </td>
                <td class="text-center tabela-coluna-oculta">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.dataReferenciaFormatada | data_br }}</destaque-pesquisa>
                </td>
                <!-- <td class="text-center">
                  <v-progress-linear :value="`${Math.ceil(evolucaoDaLocacao)}%`" :dark="true" background-color="#F2F2F2" background-opacity="#165091" height="15" reactive>
                    <template v-slot="{ value }">
                      <span>{{ value }}</span>
                      <div class="barra-progresso-texto-secundario-container" v-bind:style="{'--porcentagem-progresso': value}">
                        <span>{{ value }}</span>
                      </div>
                    </template>
                  </v-progress-linear>
                </td> -->
                <td class="text-right">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :id="'btn-ajustar-locacao-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.AJUSTAR"
                        @click="ajustarLocacao(item)"
                        @click.stop
                        :disabled="metodoDesabilitarBotaoAjustarLocacao(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    Ajustar
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-analisar-resultado-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.RESULTADO"
                        @click="gerarResultado(item)"
                        @click.stop
                        :disabled="metodoDesabilitarBotaoAnalisarResultados(item)"
                      >
                        <v-icon>mdi-poll</v-icon>
                      </v-btn>
                    </template>
                    Analisar resultado
                  </v-tooltip>

                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-cancelar-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.GESTAO_LOCACAO.CANCELAR"
                        @click="configurarCancelamentoOrcamento(item)"
                        @click.stop
                        :disabled="metodoDesabilitarBotaoCancelar(item)"
                      >
                        <v-icon>mdi-cancel</v-icon>
                      </v-btn>
                    </template>
                    Cancelar
                  </v-tooltip> -->
                 <v-menu offset-y offset-overflow left slide-y @click.stop="()=>{}">
                    <template #activator="{ on: onMenu }">
                      <v-tooltip bottom>
                        <template #activator="{ on: onTooltip }">
                          <v-btn :id="'btn-opcoes-'+id" color="primary" icon x-small v-on="{ ...onMenu, ...onTooltip }">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        Mais opções
                      </v-tooltip>
                    </template>

                    <v-list class="lista-do-menu">
                      <v-list-item
                        v-for="(opcao, index) in montarMenuOpcoes(item)"
                        :key="index"
                        :disabled="desativarOpcaoCancelar(item, opcao)"
                        @click="opcao.metodo(item)"
                        v-acesso="opcao.acesso"
                      >
                        <v-list-item-title>{{ opcao.titulo }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
              </template>
            </tabela-generica>

            <v-overlay :value="carregando">
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>

            <v-dialog v-model="modalDadosCliente" scrollable max-width="60%" :id="'dialog-dados-cliente-'+id">
              <v-card>
                <v-card-title class="display-block pl-4">
                  <h2 class="titulo-modal">Dados do cliente</h2>
                </v-card-title>

                <v-card-text class="pb-0">
                  <v-row no-gutters class="pt-5 px-1">
                    <v-flex lg12>
                      <v-row>
                        <v-flex sm6>
                          <h3 class="label-padrao">Cliente</h3>
                          <p class="resumo-padrao text-truncate mr-5">{{ dadosDoCliente && dadosDoCliente.nomeCliente || '-' }}</p>
                        </v-flex>
                        <v-flex sm3>
                          <h3 class="label-padrao">Nome curto</h3>
                          <p class="resumo-padrao">{{ dadosDoCliente && dadosDoCliente.nomeCurto || '-' }}</p>
                        </v-flex>
                        <v-flex sm3>
                          <h3 class="label-padrao">{{ dadosDoCliente && dadosDoCliente.CPFouCNPJ.length > 14 ? 'CNPJ':'CPF' }}</h3>
                          <p class="resumo-padrao">{{ dadosDoCliente && dadosDoCliente.CPFouCNPJ || '-' }}</p>
                        </v-flex>
                      </v-row>
                      <v-row class="pt-5">
                        <v-flex sm6>
                          <h3 class="label-padrao">E-mail de contato</h3>
                          <p class="resumo-padrao">{{ dadosDoCliente && dadosDoCliente.emailPessoaDeContatoCliente || '-' }}</p>
                        </v-flex>
                        <v-flex sm3>
                          <h3 class="label-padrao">Pessoa de contato</h3>
                          <p class="resumo-padrao">{{ dadosDoCliente && dadosDoCliente.nomePessoaDeContatoCliente || '-' }}</p>
                        </v-flex>
                        <v-flex sm3 pb-6>
                          <h3 class="label-padrao">Telefone de contato</h3>
                          <p class="resumo-padrao">{{ dadosDoCliente && dadosDoCliente.telefonePessoaDeContatoCliente || '-' }}</p>
                        </v-flex>
                      </v-row>
                    </v-flex>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="btn-tertiary"
                    text
                    @click="fecharModal"
                    :id="'btn-dados-cliente-fechar-'+id"
                  >Fechar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
        </v-flex>

        <v-flex v-show="exibirFiltros" xs3 grow>
          <v-layout fill-height>
            <v-flex shrink>
              <v-divider vertical class="mx-3"></v-divider>
            </v-flex>
            <v-flex xm12>
              <filtros-pesquisa-orcamento
                :id="'filtros-pesquisa-orcamento-'+id"
                xm12
                ref="filtros"
                v-model="filtrosPesquisaGestao"
                titulo="Filtrar contratos"
                :listaDeStatusParaFiltro="listaStatus"
                @onFiltrar="salvarFiltroEFiltrar"
                @onLimpar="limparFiltroEFiltrar"
              ></filtros-pesquisa-orcamento>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import TabelaGenerica from "@/components/comum/TabelaGenerica";
import { STATUS_GESTAO_LOCACAO_LISTA, STATUS_ORCAMENTO_LOCACAO, COLUNAS_TABELA_GESTAO_LOCACAO, OPCOES_MENU } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import gestaoEControleOrcamento from "@/mixins/faturamento/controle-de-locacao/gestao-controle-orcamento-mixins";
import { obterListaDeOpcoesParaGestao, obterListaComProximosStatusParaGestaoDeLocacao, opcaoCancelarPodeSerDesabilitadaNoOrcamento } from "@/utils/workflow-controle-de-locacao";
import { OPCOES_STORE_CONTROLE_LOCACAO } from "@/store/modules/controle-locacao";
import FiltrosPesquisaOrcamentoModel from '@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model';
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";
import { CfgMensagemFlutuante } from '@Bimer/vue-mensagem-flutuante';

export default {
  mixins: [gestaoEControleOrcamento],

  components: {
    'tabela-generica': TabelaGenerica
  },

  data() {
    return {
      id: 'controle-de-gestao-de-locacao',
      breadCrumbs: [{
        text: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.title,
        disabled: true,
        to: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name,
        color: '#757575'
      }],
      pesquisa: "",
      acessosBimerUp: ACESSOS_BIMER_UP,
      colunasTabelaGestaoLocacao: COLUNAS_TABELA_GESTAO_LOCACAO,
      statusParaFiltro: STATUS_GESTAO_LOCACAO_LISTA,
      opcoesItem: [],
      listaStatus: STATUS_GESTAO_LOCACAO_LISTA,
      STATUS_ORCAMENTO_LOCACAO
    };
  },

  mounted() {
    this.inicializarOpcoesDosOrcamentos();
  },

  methods: {

    gerarAditivo(orcamento){
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.geracaoDeAditivoDeProposta.name,
        params: { idOrcamento: orcamento.identificador },
        query: { aditivo: true } 
      });
    },

    inicializarOpcoesDosOrcamentos() {
      let opcoesMenu = Object.assign({}, OPCOES_MENU);
      opcoesMenu.CANCELAR.metodo = this.configurarCancelamentoOrcamento;
      opcoesMenu.GERAR_ADITIVO.metodo = this.gerarAditivo;
      this.opcoesItem = opcoesMenu;
    },

     montarMenuOpcoes(orcamento) {
      orcamento.status = orcamento.valorStatus;
      return obterListaDeOpcoesParaGestao(
        orcamento,
        this.opcoesItem
      );
    },

    desativarOpcaoCancelar(orcamento, opcao) {
      return opcaoCancelarPodeSerDesabilitadaNoOrcamento(orcamento, opcao);
    },

    ajustarLocacao(orcamento) {
      this.$router.push(
        Object.assign(
          { params: { idOrcamento: orcamento.identificador }},
          ROTAS_FATURAMENTO_METADATA.ajustarLocacao
        )
      );
    },

    metodoDesabilitarBotaoAjustarLocacao(orcamento) {
      return !!(orcamento.status == STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor || orcamento.status == STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor || orcamento.status == STATUS_ORCAMENTO_LOCACAO.APROVADO.valor);
    },

    metodoDesabilitarBotaoCancelar(orcamento) {
      return !!(orcamento.possuiItemMovimentado || orcamento.status == STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor || orcamento.status == STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor);
    },

    metodoDesabilitarBotaoAnalisarResultados(orcamento) {
      return !!(orcamento.status == STATUS_ORCAMENTO_LOCACAO.APROVADO.valor || orcamento.status == STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor || (!orcamento.possuiItemMovimentado && orcamento.status == STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor));
    },

    gerarResultado(orcamento) {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.analiseDeResultados.name,
        params: {idLocacao: orcamento.identificador}
      });
    },

    configurarCancelamentoOrcamento(orcamento) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.mensagem = `Confirma o cancelamento do orçamento: ${orcamento.codigo}?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.cancelarOrcamento
      cfgMsg.botaoPrimario.params = orcamento;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    montarStatusOrcamento(orcamento) {
      orcamento.status  = orcamento.valorStatus;
      var listaDeStatus = obterListaComProximosStatusParaGestaoDeLocacao(orcamento);
      return listaDeStatus || STATUS_GESTAO_LOCACAO_LISTA.filter(s => s.valor == orcamento.status);
    },
    
    salvarFiltroEFiltrar(){
      this.filtrosPesquisaGestao.gravadoPeloUsuario = true;
      this.rotaDeOrigemDashboard = false;
      this.filtrarOrcamentosSalvandoFiltro();
    },

    limparFiltroEFiltrar(){
      this.filtrosPesquisaGestao = new FiltrosPesquisaOrcamentoModel();
      this.filtrosPesquisaGestao.gravadoPeloUsuario = false;
      this.rotaDeOrigemDashboard = false;
      this.filtrarOrcamentosSalvandoFiltro();
    },

    filtrarOrcamentosSalvandoFiltro() {
      this.filtrosPesquisaGestao.idEmpresa = this.empresa && this.empresa.identificador;
      this.filtrosPesquisaGestao.buscarOrcamentos = false;
      this.filtrosPesquisaGestao.buscarLocacoes = true;
  
      if (this.rotaDeOrigemDashboard) {
        this.filtrosPesquisaGestao.listaDeStatus = [this.$route.params.dashboard.status];
        this.filtrosPesquisaGestao.dataFinalReferencia = this.$route.params.dashboard.periodoReferencia.dataAtual;
        this.filtrosPesquisaGestao.dataInicialReferencia = this.$route.params.dashboard.periodoReferencia.dataInicial;
      } else {
        this.$store.dispatch(OPCOES_STORE_CONTROLE_LOCACAO.ACTIONS.ALTERAR_FILTRO_PADRAO_PESQUISA_GESTAO, this.filtrosPesquisaGestao);
      }

      this.filtrarOrcamentosPorTipo(this.filtrosPesquisaGestao);
    }
  }
};
</script>

<style lang="scss" scoped>
.margin-bottom-14 {
  margin-bottom: 14px;
}
</style>