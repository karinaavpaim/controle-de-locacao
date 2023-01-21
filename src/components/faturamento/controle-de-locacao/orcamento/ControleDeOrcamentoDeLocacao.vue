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
            @click:close="removerFiltrosPorGrupo(filtrosPesquisaOrcamento, filtro)"
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
            <v-flex class="largura-igual-conteudo">
              <v-btn
                v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.NOVO"
                :id="'btn-novo-orcamento-'+id"
                class="btn-primary-icon width-icon ml-0 mb-2"
                text
                @click="adicionarNovoOrcamento"
              >
                <v-icon class="mr-1">mdi-18px mdi-plus</v-icon>Novo orçamento
              </v-btn>
            </v-flex>

            <v-flex class="md3 ml-auto">
              <v-text-field
                :id="'textfield-pesquisar-orcamentos'+id"
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
              :lista-colunas="colunasTabelaOrcamentoLocacao"
              :itens-tabela="orcamentosDeLocacao"
              :exibirPesquisa="false"
              :pesquisaExterna="pesquisa"
              chave-modelo-configuracoes-pagina="linhasTabelaPadrao"
              mensagemNenhumItem="Não encontramos orçamentos para esta empresa."
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
                <td class="text-right">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.totalValor | dinheiro }}</destaque-pesquisa>
                </td>
                <td class="text-right tabela-coluna-oculta">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.totalFormatado | data_br }}</destaque-pesquisa>
                </td>
                <td class="text-right">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-editar-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.EDITAR"
                        @click="editarOrcamento(item)"
                        :disabled="metodoDesabilitarBotaoEditar(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    Editar
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-duplicar-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ORCAMENTOS.DUPLICAR"
                        @click="duplicarOrcamento(item)"
                      >
                        <v-icon>mdi-content-duplicate</v-icon>
                      </v-btn>
                    </template>
                    Duplicar
                  </v-tooltip>

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

            <v-dialog v-model="modalDadosCliente" scrollable max-width="60%" :id="'dialog-dados-cliente-' + id">
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
                v-model="filtrosPesquisaOrcamento"
                @onFiltrar="salvarFiltroEFiltrar"
                @onLimpar="limparFiltroEFiltrar"
                :listaDeStatusParaFiltro="listaStatus"
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
import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api";
import apiOrcamento from "@/api/faturamento/controle-de-locacao/orcamento-locacao-api";
import impressaoUtils from "@/utils/impressao";
import gestaoEControleOrcamento from "@/mixins/faturamento/controle-de-locacao/gestao-controle-orcamento-mixins";
import { STATUS_ORCAMENTO_LOCACAO, STATUS_ORCAMENTO_LOCACAO_LISTA, OPCOES_MENU, COLUNAS_TABELA_ORCAMENTO_LOCACAO } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";
import { obterListaDeOpcoesParaControleDoOrcamento, obterListaComProximosStatusParaControleDoOrcamento, opcaoCancelarPodeSerDesabilitadaNoOrcamento } from "@/utils/workflow-controle-de-locacao";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import { OPCOES_STORE_CONTROLE_LOCACAO } from "@/store/modules/controle-locacao";
import FiltrosPesquisaOrcamentoModel from '@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model';

export default {
  mixins: [gestaoEControleOrcamento],

  components: {
    'tabela-generica': TabelaGenerica
  },

  data() {
    return {
      id: 'controle-de-orcamento',
      acessosBimerUp: ACESSOS_BIMER_UP,
      colunasTabelaOrcamentoLocacao: COLUNAS_TABELA_ORCAMENTO_LOCACAO,
      breadCrumbs: [{
        text: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.title,
        disabled: true,
        to: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name,
        color: '#757575'
      }],
      pesquisa: "",
      listaStatus: STATUS_ORCAMENTO_LOCACAO_LISTA,
      STATUS_ORCAMENTO_LOCACAO
    };
  },

  mounted() {
    this.inicializarOpcoesDosOrcamentos();
  },

  methods: {
    inicializarOpcoesDosOrcamentos() {
      let opcoesMenu = Object.assign({}, OPCOES_MENU);
      opcoesMenu.EDITAR_ORCAMENTO.metodo = this.editarOrcamento;
      opcoesMenu.DUPLICAR_ORCAMENTO.metodo = this.duplicarOrcamento;
      opcoesMenu.CANCELAR.metodo = this.configurarCancelamentoOrcamento;
      opcoesMenu.EXCLUIR.metodo = this.configurarExclusaoOrcamento;
      opcoesMenu.GERAR_PROPOSTA.metodo = this.gerarProposta;
      opcoesMenu.EDITAR_PROPOSTA.metodo = this.editarProposta;      
      opcoesMenu.IMPRIMIR_PROPOSTA.metodo = this.imprimirProposta;
      opcoesMenu.EXCLUIR_PROPOSTA.metodo = this.configurarExclusaoPropostaDoOrcamento;      
      this.opcoesItem = opcoesMenu;
    },

    montarStatusOrcamento(orcamento) {
      orcamento.status = orcamento.valorStatus;
      var listaDeStatus = obterListaComProximosStatusParaControleDoOrcamento(orcamento);
      return (
        listaDeStatus ||
        STATUS_ORCAMENTO_LOCACAO_LISTA.filter(s => s.valor == orcamento.status)
      );
    },

    montarMenuOpcoes(orcamento) {
      orcamento.status = orcamento.valorStatus;
      return obterListaDeOpcoesParaControleDoOrcamento(
        orcamento,
        this.opcoesItem
      );
    },

    metodoDesabilitarBotaoEditar(orcamento) {
      if (!(orcamento.status === STATUS_ORCAMENTO_LOCACAO.EM_DIGITACAO.valor || orcamento.status === STATUS_ORCAMENTO_LOCACAO.PRONTO.valor || orcamento.status === STATUS_ORCAMENTO_LOCACAO.REVISAO.valor))
        return true;
    },

    desativarOpcaoCancelar(orcamento, opcao) {
      return opcaoCancelarPodeSerDesabilitadaNoOrcamento(orcamento, opcao);
    },

    adicionarNovoOrcamento() {
      if (!this.empresa) {
        this.$mensagemFlutuante.erro({
          titulo: `Informe a empresa de trabalho.`,
          mensagem: "Empresa é um campo obrigatório."
        });
        return;
      }

      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name
      });
    },

    salvarFiltroEFiltrar() {
      this.filtrosPesquisaOrcamento.gravadoPeloUsuario = true;
      this.rotaDeOrigemDashboard = false;
      this.filtrarOrcamentosSalvandoFiltro();
    },

    limparFiltroEFiltrar() {
      this.filtrosPesquisaOrcamento = new FiltrosPesquisaOrcamentoModel();
      this.filtrosPesquisaOrcamento.gravadoPeloUsuario = false;
      this.rotaDeOrigemDashboard = false;
      this.filtrarOrcamentosSalvandoFiltro();
    },

    filtrarOrcamentosSalvandoFiltro() {
      this.filtrosPesquisaOrcamento.idEmpresa = this.empresa && this.empresa.identificador;
      this.filtrosPesquisaOrcamento.buscarOrcamentos = true;
      this.filtrosPesquisaOrcamento.buscarLocacoes = false;

      if (this.rotaDeOrigemDashboard) {
        this.filtrosPesquisaOrcamento.listaDeStatus = [this.$route.params.dashboard.status];
        this.filtrosPesquisaOrcamento.dataFinalReferencia = this.$route.params.dashboard.periodoReferencia.dataAtual;
        this.filtrosPesquisaOrcamento.dataInicialReferencia = this.$route.params.dashboard.periodoReferencia.dataInicial;
      } else {
        this.$store.dispatch(OPCOES_STORE_CONTROLE_LOCACAO.ACTIONS.ALTERAR_FILTRO_PADRAO_PESQUISA_ORCAMENTO, this.filtrosPesquisaOrcamento);
      }

      // this.$store.commit('controleDeLocacao/alterarFiltrosPadrao', this.filtrosPesquisaOrcamento);
      this.filtrarOrcamentosPorTipo(this.filtrosPesquisaOrcamento);
    },

    imprimirProposta(orcamento) {
      apiProposta
        .obterProposta(orcamento.identificador)
        .then(response => {
            impressaoUtils.imprimir(
              `Impressão da proposta ${orcamento.identificador}`,
              response[0].conteudo
            );
        })
        .catch((erro) => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível imprimir a proposta.`,
            mensagem:
              (Array.isArray(erro) && erro[0] && erro[0].statusText) ||
              erro,
          });
        });
    },

    editarOrcamento(orcamento) {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name,
        params: { idOrcamento: orcamento.identificador }
      });
    },

    gerarProposta(orcamento) {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.name,
        params: { idOrcamento: orcamento.identificador }
      });
    },

    configurarExclusaoPropostaDoOrcamento(orcamento) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Exclusão da proposta`;
      cfgMsg.mensagem = `Confirma a exclusão da proposta para o orçamento ${orcamento.codigo}?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.excluirProposta;
      cfgMsg.botaoPrimario.params = { orcamento };
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    excluirProposta(obj) {
      apiOrcamento
        .deletarPropostaDoOrcamento(obj.orcamento.identificador)
        .then(response => {
          let status = this.retornarStatus(response[0].status);
          let index = this.orcamentosDeLocacao.findIndex(
            o => o.identificador === response[0].identificador
          );

          this.orcamentosDeLocacao[index].descricaoStatus = status.descricao;
          this.orcamentosDeLocacao[index].classeStatus = status.classeExibicao;
          this.orcamentosDeLocacao[index].valorStatus = status.valor;

          this.$mensagemFlutuante.sucesso({
            titulo: `A proposta foi excluída.`
          });
        })
        .catch(() => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível excluir a proposta.`
          });
        });
    },

    editarProposta(orcamento) {
      this.$router.push(
        Object.assign(
          { params: { idOrcamento: orcamento.identificador }},
          ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao));
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn--fab.v-size--x-small {
  height: 25px;
  width: 25px;
}
</style>