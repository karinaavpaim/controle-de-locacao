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
            @click:close="removerFiltrosPorGrupo(filtrosPesquisaMovimentacao, filtro)"
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
              :lista-colunas="colunasMovimentacaoDeLocacao"
              :itens-tabela="orcamentosDeLocacao"
              :exibirPesquisa="false"
              :pesquisaExterna="pesquisa"
              mensagemNenhumItem="Não encontramos locações para esta empresa."
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
                    v-model="item.valorStatus">
                    <destaque-pesquisa :pesquisa="pesquisa">{{ item.descricaoStatus }}</destaque-pesquisa>
                  </chip-select>
                </td>
                <td class="text-center">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.dataInicioContratoIso | data_br }}</destaque-pesquisa>
                </td>
                <td class="text-center">
                  <destaque-pesquisa :pesquisa="pesquisa">{{ item.dataTerminoContratoIso | data_br }}</destaque-pesquisa>
                </td>
                <td class="text-right">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-requisitar-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.REQUISITAR"
                        @click="gerarRequisicao(item)"
                        @click.stop
                      >
                        <v-icon>mdi-cart</v-icon>
                      </v-btn>
                    </template>
                    Requisitar
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-expedir-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.EXPEDIR"
                        @click="gerarExpedicao(item)"
                        @click.stop
                      >
                        <v-icon>mdi-truck-check</v-icon>
                      </v-btn>
                    </template>
                    Expedir
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn 
                        :id="'btn-medir-'+id"
                        color="primary"
                        icon
                        x-small
                        v-on="on"
                        v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MOVIMENTO_LOCACAO.MEDIR"
                        @click="gerarMedicao(item)"
                        @click.stop
                      >
                        <v-icon>mdi-clipboard-check</v-icon>
                      </v-btn>
                    </template>
                    Medir
                  </v-tooltip>
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
                v-model="filtrosPesquisaMovimentacao"
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
import { STATUS_ORCAMENTO_LOCACAO, STATUS_GESTAO_LOCACAO_LISTA } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import gestaoEControleOrcamento from "@/mixins/faturamento/controle-de-locacao/gestao-controle-orcamento-mixins";
import { obterListaComProximosStatusParaMovimentacaoDeLocacao } from "@/utils/workflow-controle-de-locacao";
import { OPCOES_STORE_CONTROLE_LOCACAO } from "@/store/modules/controle-locacao";
import FiltrosPesquisaOrcamentoModel from '@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model';
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";

export default {
  mixins: [gestaoEControleOrcamento],

  components: {
    'tabela-generica': TabelaGenerica
  },

  data() {
    return {
      id: 'movimentacao',
      breadCrumbs: [{
        text: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.title,
        disabled: true,
        to: ROTAS_FATURAMENTO_METADATA.movimentacaoDeLocacao.name,
        color: '#757575'
      }],
      pesquisa: "",
      acessosBimerUp: ACESSOS_BIMER_UP,
      colunasMovimentacaoDeLocacao: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO,
      statusParaFiltro: [STATUS_ORCAMENTO_LOCACAO.LIBERADO, STATUS_ORCAMENTO_LOCACAO.EXECUCAO],
      opcoesItem: [],
      listaStatus: [STATUS_ORCAMENTO_LOCACAO.LIBERADO, STATUS_ORCAMENTO_LOCACAO.EXECUCAO]
    };
  },

  methods: {
    gerarRequisicao(orcamento) {
      if (!orcamento.possuiMaterialOuEquipamento) {
        this.$mensagemFlutuante.aviso({
          titulo: `Não é possível requisitar`,
          mensagem: `Nenhum equipamento ou material foi encontrado no contrato ${orcamento.codigo}.`
        });
        return;
      }

      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name,
        params: {idLocacao: orcamento.identificador}
      });
    },

    gerarExpedicao(orcamento) {
      if ((orcamento.codigoEnderecoEntrega == undefined) || (orcamento.codigoEnderecoEntrega == '')) {
        this.$mensagemFlutuante.aviso({
          titulo: `Não é possível expedir`,
          mensagem: `O contrato ${orcamento.codigo} não possui o endereço de entrega informado.`
        });
        return;
      }

      if (!orcamento.possuiMaterialOuEquipamento) {
        this.$mensagemFlutuante.aviso({
          titulo: `Não é possível expedir`,
          mensagem: `Nenhum equipamento ou material foi encontrado no contrato ${orcamento.codigo}.`
        });
        return;
      }

      this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_EMPRESA_ATUAL]
        .then(conf => {
          if (!conf.secaoExpedicao.tabelaPrecoExpedicao) {
            this.$mensagemFlutuante.aviso({
              titulo: `A tabela de preço para expedição deve ser informada.`
            });

            return;
          }

          this.$router.push({
            name: ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name,
            params: {idLocacao: orcamento.identificador}
          });
        })
        .catch(e => this.$mensagemFlutuante.aviso({
            titulo: `Não foi possível acessar os dados da empresa.`, mensagem: e
          })
        );
    },

    gerarMedicao(orcamento) {
      if ((orcamento.codigoEnderecoEntrega == undefined) || (orcamento.codigoEnderecoEntrega == ''))
      {
        this.$mensagemFlutuante.aviso({
          titulo: `Não é possível medir`,
          mensagem: `O contrato ${orcamento.codigo} não possui o endereço de entrega informado.`
        });
        return;
      }

      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name,
        params: {idLocacao: orcamento.identificador}
      });
    },

    montarStatusOrcamento(orcamento) {
      orcamento.status  = orcamento.valorStatus;
      var listaDeStatus = obterListaComProximosStatusParaMovimentacaoDeLocacao(orcamento);
      return listaDeStatus || STATUS_GESTAO_LOCACAO_LISTA.filter(s => s.valor == orcamento.status);  
    },

    salvarFiltroEFiltrar(){
      this.filtrosPesquisaMovimentacao.gravadoPeloUsuario = true;
      this.rotaDeOrigemDashboard = false;
      this.filtrarOrcamentosSalvandoFiltro();
    },

    limparFiltroEFiltrar(){
      this.filtrosPesquisaMovimentacao = new FiltrosPesquisaOrcamentoModel();
      this.filtrosPesquisaMovimentacao.gravadoPeloUsuario = false;
      this.rotaDeOrigemDashboard = false;
      this.filtrarOrcamentosSalvandoFiltro();
    },

    filtrarOrcamentosSalvandoFiltro() {
      this.filtrosPesquisaMovimentacao.idEmpresa = this.empresa && this.empresa.identificador;
      this.filtrosPesquisaMovimentacao.buscarLocacoesMovimentadas = true;

      if (this.rotaDeOrigemDashboard) {
        this.filtrosPesquisaMovimentacao.listaDeStatus = [this.$route.params.dashboard.status];
        this.filtrosPesquisaMovimentacao.dataFinalReferencia = this.$route.params.dashboard.periodoReferencia.dataAtual;
        this.filtrosPesquisaMovimentacao.dataInicialReferencia = this.$route.params.dashboard.periodoReferencia.dataInicial;
      } else {
        this.$store.dispatch(OPCOES_STORE_CONTROLE_LOCACAO.ACTIONS.ALTERAR_FILTRO_PADRAO_PESQUISA_MOVIMENTACAO, this.filtrosPesquisaMovimentacao);
      }

      this.filtrarOrcamentosPorTipo(this.filtrosPesquisaMovimentacao);
    }
  }
};
</script>

<style lang="scss" scoped>
.margin-bottom-14 {
  margin-bottom: 14px;
}
</style>