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
                :id="'btn-novo-adicional-'+id"
                class="btn-primary-icon width-icon ml-0 mb-2"
                text
                v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.NOVO"
                @click="criarAdicional"
              >
                <v-icon class="mr-1">mdi-18px mdi-plus</v-icon>Novo adicional
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
                    v-show="adicionaisPersonalizados.length > 0"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs12 v-show="(adicionaisPersonalizados.length > 0) || carregando">
              <v-data-table
                :search="pesquisa"
                :headers="colunasTabelaControleAdicionaisPersonalizados"
                :items-per-page="itensPorPagina"
                sort-by="codigo"
                :sort-desc="false"
                :items="adicionaisPersonalizados"
                class="contorno-tabela mt-2"
                @pagination="paginacaoAlterada"
                :footer-props="{'items-per-page-options': opcoesLinhasPorPagina}">
              >
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.name">
                      <td class="text-center">
                        <destaque-pesquisa :pesquisa="pesquisa">{{ item.codigo }}</destaque-pesquisa>
                      </td>
                      <td class="text-left">
                        <destaque-pesquisa :pesquisa="pesquisa">{{ item.descricao }}</destaque-pesquisa>
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
                              v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.EDITAR"
                              @click="editarAdicionalPersonalizado(item)"
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
                              v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.DUPLICAR"
                              @click="duplicarAdicionaisPersonalizados(item)"
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
                              v-acesso="acessosBimerUp.FATURAMENTO.CONTROLE_LOCACAO.ADICIONAIS_PERSONALIZADOS.EXCLUIR"
                              @click="configurarExclusaoAdicionalPersonalizado(item)"
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

            <v-flex mt-2 xs12 v-show="(adicionaisPersonalizados.length == 0) && !carregando">
              <v-layout wrap class="card-no-data py-12">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não encontramos adicionais personalizados.</span>
                </v-flex>
                <v-flex xs12>
                  <span class="subheader grey--text lighten-1">
                    Clique em Novo adicional para criar um.
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

    <v-dialog
      :id="'dialog-adicional-personalizado-'+id"
      v-model="dialogAdicionalPersonalizado"
      persistent
      max-width="960px"
      width="auto"
      content-class="modal-adicional-personalizado"
      :eager="true"
    >
      <adicionais-personalizados
        :adicionaisPersonalizados="adicionaisPersonalizados"
        :adicionalPersonalizado="adicionalPersonalizado"
        :modoEdicao="modoEdicao"
        :modoCopia="modoCopia"
        :descricaoOriginal="descricaoOriginal"
        @fecharModal="fecharModalAdicionalPersonalizado"
        :focoPrincipal="dialogAdicionalPersonalizado"
      ></adicionais-personalizados>
    </v-dialog>
  </v-app>
</template>

<script>
import apiOrcamento from "@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js";
import adicionalPersonalizadoApi from "@/api/faturamento/controle-de-locacao/adicionais-personalizados-api";
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";
import AdicionalPersonalizado from "@/components/faturamento/controle-de-locacao/orcamento/AdicionalPersonalizado";
import AdicionalPersonalizadoModel from "@/models/faturamento/orcamento-locacao/adicional-personalizado-model";
import { COLUNAS_TABELA_CONTROLE_ADICIONAIS_PERSONALIZADOS, ITENS_DO_MENU_OPCOES } from "@/constants/faturamento/controle-de-locacao/controle-de-adicionais-personalizados-constants.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { ACESSOS_BIMER_UP } from "@/constants/geral/usuario/sistema-acesso-constants.js";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import { OPCOES_LINHAS_TABELA_POR_PAGINA, VALOR_PADRAO_ITENS_POR_PAGINA } from "@/constants/sistema/storage/configuracoes-pagina-constants"
import { OPCOES_STORE_CONFIGURACOES } from '@/store/modules/configuracoes';

export default {
  components: {
    DestaquePesquisa,
    "adicionais-personalizados": AdicionalPersonalizado
  },

  data() {
    return {
      id: 'controle-de-adicionais-personalizados',
      modoEdicao: false,
      modoCopia: false,
      descricaoOriginal:'',
      dialogAdicionalPersonalizado: false,
      carregando: true,
      opcoes: ITENS_DO_MENU_OPCOES,
      acessosBimerUp: ACESSOS_BIMER_UP,
      breadCrumbs: [{
        text: ROTAS_FATURAMENTO_METADATA.controleDeAdicionaisPersonalizados.title,
        disabled: true,
        to: ROTAS_FATURAMENTO_METADATA.controleDeAdicionaisPersonalizados.name,
        color: '#757575'
      }],
      paginacao: {
        sortBy: "codigo",
        descending: false
      },
      pesquisa: "",
      adicionaisPersonalizados: [],
      colunasTabelaControleAdicionaisPersonalizados: COLUNAS_TABELA_CONTROLE_ADICIONAIS_PERSONALIZADOS,
      adicionalPersonalizado: new AdicionalPersonalizadoModel(),
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
   this.filtrarAdicionaisPersonalizados();
  },

  watch: {},

  methods: {

    paginacaoAlterada(obj){
      if (this.itensPorPagina !== obj.itemsPerPage) {
        this.$store.dispatch(OPCOES_STORE_CONFIGURACOES.ACTIONS.ALTERAR_CONFIGURACOES_PAGINA, Promise.resolve({linhasTabelaPadrao: obj.itemsPerPage}));
      }
    },

    fecharModalAdicionalPersonalizado() {
      this.dialogAdicionalPersonalizado = false;
    },

    editarAdicionalPersonalizado(modelo) {
      this.carregando = true;

      adicionalPersonalizadoApi
        .obterPorIdentificador(modelo.identificador)
          .then(AdicionalObtido => {
            this.modoCopia = false;
            this.modoEdicao = true;
            this.descricaoOriginal = '';
            this.adicionalPersonalizado = new AdicionalPersonalizadoModel(AdicionalObtido[0]);
            this.dialogAdicionalPersonalizado = true;
          })
          .catch(() => {
            this.carregando = false;
          })
          .finally((this.carregando = false));
    },

    criarAdicional() {
      this.modoCopia = false;
      this.modoEdicao = false;
      this.descricaoOriginal = '';
      this.adicionalPersonalizado = new AdicionalPersonalizadoModel();
      this.dialogAdicionalPersonalizado = true;
    },

    filtrarAdicionaisPersonalizados() {
      this.carregando = true;
      this.adicionaisPersonalizados = [];

      apiOrcamento
        .obterAdicionaisPersonalizados()
        .then(resp => (this.adicionaisPersonalizados = resp))
        .catch(() => {
          this.adicionaisPersonalizados = [];
          this.carregando = false;
        })
        .finally((this.carregando = false));
    },

    configurarExclusaoAdicionalPersonalizado(modelo) {
     let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Exclusão do adicional personalizado`;
      cfgMsg.mensagem = `Confirma a exclusão do adicional personalizado código: ${modelo.identificador} ?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.excluirAdicionaisPersonalizados;
      cfgMsg.botaoPrimario.params = modelo;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    removerAdicionalPersonalizadoDaLista(idAdicional) {
      let index = this.adicionaisPersonalizados.findIndex(a => a.identificador == idAdicional);
      if(index < 0) return;
      this.adicionaisPersonalizados.splice(index, 1);
    },

    excluirAdicionaisPersonalizados(modelo) {
      this.carregando = true;

      adicionalPersonalizadoApi
        .excluir(modelo.identificador)
        .then(() => {
          this.removerAdicionalPersonalizadoDaLista(modelo.identificador);
          this.$mensagemFlutuante.sucesso({
            titulo: `O adicional personalizado foi excluido com sucesso!`
          });
        })
        .catch((erro) => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível excluir o adicional personalizado.`,
            mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
          });
        })
        .finally((this.carregando = false));
    },

    duplicarAdicionaisPersonalizados(modelo) {
      this.carregando = true;

      adicionalPersonalizadoApi
        .obterPorIdentificador(modelo.identificador)
        .then(AdicionalObtido => {
          this.modoEdicao = false;
          this.modoCopia = true;
          this.adicionalPersonalizado = new AdicionalPersonalizadoModel(AdicionalObtido[0]);
          this.descricaoOriginal = this.adicionalPersonalizado.descricao;
          this.adicionalPersonalizado.codigo = undefined;
          this.adicionalPersonalizado.identificador = undefined;
          this.adicionalPersonalizado.descricao = `${this.adicionalPersonalizado.descricao}`;
          this.dialogAdicionalPersonalizado = true;
        })
        .catch(() => {
          this.carregando = false;
        })
        .finally((this.carregando = false));
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-dialog.modal-adicional-personalizado {
  width: auto;
}
</style>