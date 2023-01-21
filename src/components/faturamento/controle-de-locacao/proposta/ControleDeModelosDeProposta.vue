<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 justify-space-around>
      <v-layout>
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

      <v-layout>
        <v-flex>
          <v-layout justify-space-between align-end>
            <v-flex xs2 mt-5>
              <v-btn
                :id="'btn-novo-modelo-'+id"
                class="btn-primary-icon width-icon ml-0 mb-2"
                text
                v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.NOVO"
                @click="criarModelo">
                <v-icon class="mr-1">mdi-18px mdi-plus</v-icon>Novo modelo
              </v-btn>
            </v-flex>
            <v-flex>
              <v-layout align-end>
                <v-flex md3 offset-md9>
                  <v-text-field
                    :id="'textfield-pesquisar-'+id"
                    class="input-pesquisar py-2 ma-0"
                    v-model="pesquisa"
                    append-icon="search"
                    label="Pesquisar"
                    v-show="modelosDePropostas.length > 0"
                    single-line
                    hide-details>
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs12 v-show="(modelosDePropostas.length > 0) || carregando">
              <v-data-table
                :search="pesquisa"
                :headers="colunasTabelaControleModelosPropostas"
                :items-per-page="itensPorPagina"
                sort-by="identificador"
                :sort-desc="false"
                :items="modelosDePropostas"
                class="contorno-tabela mt-2"
                @pagination="paginacaoAlterada"
                :footer-props="{'items-per-page-options': opcoesLinhasPorPagina}">
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.name">
                      <td class="text-center">
                        <destaque-pesquisa :pesquisa="pesquisa">{{ item.identificador }}</destaque-pesquisa>
                      </td>
                      <td class="text-left">
                        <destaque-pesquisa :pesquisa="pesquisa">{{ item.nome }}</destaque-pesquisa>
                      </td>
                       <td class="text-left">
                        <destaque-pesquisa :pesquisa="pesquisa">{{ item.tipoModelo }}</destaque-pesquisa>
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
                              v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.EDITAR"
                              @click="editarModeloProposta(item)"
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
                              v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.DUPLICAR"
                              @click="duplicarModeloDeProposta(item)"
                            >
                              <v-icon>mdi-content-duplicate</v-icon>
                            </v-btn>
                          </template>
                          Duplicar
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn 
                              :id="'btn-excluir-'+id"
                              color="primary"
                              icon
                              x-small
                              v-on="on"
                              v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.MODELO_PROPOSTA.EXCLUIR"
                              @click="configurarExclusaoModeloDeProposta(item)"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          Excluir
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-flex>

            <v-flex mt-2 xs12 v-show="(modelosDePropostas.length == 0) && !carregando">
              <v-layout wrap class="card-no-data py-12">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não encontramos modelos.</span>
                </v-flex>
                <v-flex xs12>
                  <span class="subheader grey--text lighten-1">
                    Clique em Novo modelo para criar um.
                  </span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-overlay :value="carregando">
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api.js";
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";
import { COLUNAS_TABELA_CONTROLE_MODELOS_PROPOSTAS, ITENS_DO_MENU_OPCOES } from "@/constants/faturamento/controle-de-locacao/controle-de-modelos-de-propostas-constants.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";
import { OPCOES_LINHAS_TABELA_POR_PAGINA, VALOR_PADRAO_ITENS_POR_PAGINA } from "@/constants/sistema/storage/configuracoes-pagina-constants"
import { OPCOES_STORE_CONFIGURACOES } from '@/store/modules/configuracoes';

export default {
  components: {
    DestaquePesquisa
  },

  data() {
    return {
      id: 'controle-de-modelos-de-proposta',
      carregando: true,
      opcoes: ITENS_DO_MENU_OPCOES,
      acessosBimerUp: ACESSOS_BIMER_UP,
      breadCrumbs: [{
        text: ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.title,
        disabled: true,
        to: ROTAS_FATURAMENTO_METADATA.controleDeModelosDeProposta.name,
        color: '#757575'
      }],
      paginacao: {
        sortBy: "identificador",
        descending: false
      },
      pesquisa: "",
      modelosDePropostas: [],
      colunasTabelaControleModelosPropostas: COLUNAS_TABELA_CONTROLE_MODELOS_PROPOSTAS,
      opcoesLinhasPorPagina: OPCOES_LINHAS_TABELA_POR_PAGINA,
      itensPorPagina: VALOR_PADRAO_ITENS_POR_PAGINA
    };
  },

  beforeMount(){
    this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_PAGINA].then((configs)=>{
      this.itensPorPagina = configs.linhasTabelaPadrao || VALOR_PADRAO_ITENS_POR_PAGINA;
    }).catch(()=>this.itensPorPagina = VALOR_PADRAO_ITENS_POR_PAGINA);
  },

  mounted() {
    this.filtrarModelosDeProposta();
  },

  watch: {
  },

  methods: {

    paginacaoAlterada(obj){
      if (this.itensPorPagina !== obj.itemsPerPage) {
        this.$store.dispatch(OPCOES_STORE_CONFIGURACOES.ACTIONS.ALTERAR_CONFIGURACOES_PAGINA, Promise.resolve({linhasTabelaPadrao: obj.itemsPerPage}));
      }
    },

    editarModeloProposta(modelo) {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.edicaoDeModeloPropostaLocacao.name,
        params: {idModelo: modelo.identificador}
      });
    },

    criarModelo() {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.name
      });
    },

    filtrarModelosDeProposta() {
      this.carregando = true;
      this.modelosDePropostas = [];

      apiProposta
        .obterModelosDePropostaSemTrazerConteudo()
        .then((resp) => {
          this.modelosDePropostas = resp;
        })
        .catch(() => {
          this.modelosDePropostas = [];
          this.carregando = false;
        })
        .finally(this.carregando = false);
    },

    duplicarModeloDeProposta(modelo) {
      if (modelo !== null) {
        this.$router.push({
          name: ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.name,
          params: {idModelo: modelo.identificador}
        });
      }
    },

    configurarExclusaoModeloDeProposta(modelo) {
     let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Exclusão do modelo`;
      cfgMsg.mensagem = `Confirma a exclusão do modelo código: ${modelo.identificador} ?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.excluirProposta;
      cfgMsg.botaoPrimario.params = modelo;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    excluirProposta(modelo){
      apiProposta.deletarModeloProposta(modelo.identificador)
        .then(() => {
          this.modelosDePropostas.splice(this.modelosDePropostas.indexOf(modelo), 1)
          this.$mensagemFlutuante.sucesso({titulo: 'Modelo excluído com sucesso.'})
        })
        .catch(error => {
          this.$mensagemFlutuante.erro({titulo: 'Falha ao excluir o modelo.', 
                                        mensagem: (Array.isArray(error) && error[0].statusText) || error})
        })
    },
  }
};
</script>

<style lang="scss" scoped>
.v-btn--fab.v-size--x-small {
  height: 25px;
  width: 25px;
}
</style>