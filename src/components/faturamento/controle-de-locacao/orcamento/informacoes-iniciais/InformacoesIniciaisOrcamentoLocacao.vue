<template>
  <div :id="id">
    <v-layout wrap justify-space-between>
      <v-col cols="12" class="px-0 py-0">
        <v-row>
          <v-col cols="9" class="py-0">
            <pesquisa-pessoa
              :id="'pesquisa-pessoa-cliente-'+id"
              v-model="orcamentoLocacao.cliente"
              label="Cliente"
              placeholder="Pesquise pelo código ou por um trecho do nome"
              atributoExibicao="codigoNomeCPFouCNPJ"
              :habilitarPesquisaAvancada="false"
              :focus="autoFocus"
              :rules="[v => !!v || 'Obrigatório']"
              :categoriasDePessoa="['CLIENTE']"
              :desabilitar="desabilitarCampos.cliente"
              @onChange="preencherPessoaDeContato"
            ></pesquisa-pessoa>
          </v-col>

          <v-col cols="3" class="py-0">
            <v-autocomplete
              :id="'autocomplete-adicionais-personalizados-'+id"
              v-model="adicionalPersonalizadoSelecionado"
              :items="adicionaisPersonalizados"
              item-text="descricao"
              label="Adicionais personalizados"
              return-object
              :disabled="desabilitarCampos.adicionaisPersonalizados"
              :clearable="true"
            ></v-autocomplete>
          </v-col>

          <v-col cols="9" class="py-0">
            <v-row>
              <v-col cols="4" class="py-0">
                <v-text-field
                  :id="'textfield-pessoa-contato-cliente-'+id"
                  v-model="orcamentoLocacao.nomePessoaDeContatoCliente"
                  prepend-inner-icon="mdi-account"
                  label="Pessoa de contato no cliente"
                  clearable
                  maxlength="100"
                  :disabled="desabilitarCampos.nomePessoaDeContatoCliente"
                ></v-text-field>
              </v-col>

              <v-col cols="8" class="py-0">
                <v-text-field
                  :id="'textfield-email-pessoa-contato-cliente-' + id"
                  v-model="orcamentoLocacao.emailPessoaDeContatoCliente"
                  prepend-inner-icon="mdi-at"
                  label="E-mail de contato no cliente"
                  clearable
                  :rules="emailRules"
                  maxlength="100"
                  :disabled="desabilitarCampos.emailPessoaDeContatoCliente"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="3" class="py-0">
            <v-text-field
              :id="'textfield-telefone-pessoa-contato-cliente-' + id"
              v-model="orcamentoLocacao.telefonePessoaDeContatoCliente"
              prepend-inner-icon="mdi-phone"
              label="Telefone de contato no cliente"
              v-mask="['(##) ####-####', '(##) #####-####']"
              clearable
              :rules="telefoneRules"
              :disabled="desabilitarCampos.telefonePessoaDeContatoCliente"
            ></v-text-field>
          </v-col>

          <v-col cols="9" class="py-0">
            <v-row>
              <v-col cols="4" class="py-0">
                <date-picker
                  :id="'datepicker-referencia-'+id"
                  v-model="orcamentoLocacao.dataReferencia"
                  label="Data de referência"
                  :mensagemDeErro="mensagemDeErroDataReferencia"
                  hint
                  :desabilitar="desabilitarCampos.dataReferencia"
                  data-minima="2000-01-01"
                  @onChange="dataAlterada(TIPO_DATA.REFERENCIA)"
                ></date-picker>
              </v-col>

              <v-col cols="4" class="py-0">
                <date-picker
                  :id="'datepicker-inicio-contrato-'+id"
                  v-model="orcamentoLocacao.dataInicioContrato"
                  label="Prev. de início"
                  :mensagemDeErro="mensagemDeErroDataInicial"
                  hint
                  data-minima="2000-01-01"
                  @onChange="dataDoOrcamentoAlterada(TIPO_DATA.INICIO)"
                ></date-picker>
              </v-col>

              <v-col cols="4" class="py-0">
                <date-picker
                  :id="'datepicker-termino-contrato-'+id"
                  v-model="orcamentoLocacao.dataTerminoContrato"
                  label="Prev. de término"
                  :mensagemDeErro="mensagemDeErroDataFinal"
                  hint
                  v-bind:dataMinima="orcamentoLocacao.dataInicioContrato"
                  @onChange="dataDoOrcamentoAlterada(TIPO_DATA.FIM)"
                ></date-picker>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="3" class="py-0">
            <!-- <v-select
              :id="'select-tabela-precos-' + id"
              class="select-preco"
              label="Tabela de preço padrão"
              return-object
              clearable
              slot="selection"
            ></v-select> -->
          </v-col>

          <v-col cols="12" class="py-0">
            <v-text-field 
              :id="'textfield-objetivo-proposta-'+id"
              v-model="orcamentoLocacao.descricao"
              label="Objetivo do orçamento"
              counter
              maxlength="100"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import DatePicker from "@/components/comum/Datepicker";
import PesquisaPessoa from "@/components/sistemas-gerais/pessoa/PesquisaPessoa.vue";
import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";
import apiOrcamento from "@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import moment from 'moment';
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";

export default {
  props: {
    id: { type: String, required: false, default: ()=> 'informacoes-iniciais-orcamento' },
    autoFocus: { type: Boolean, default: false },
    orcamentoLocacao: { type: OrcamentoLocacaoModel, required: true },
    desabilitarCampos: {
      type: Object,
      default: () => {
        return {
          cliente: false,
          dataReferencia: false,
          adicionaisPersonalizados: false
        }
      }
    }
  },

  model: {
    prop: "orcamentoLocacao",
    event: "onChange"
  },

  components: {
    DatePicker,
    PesquisaPessoa
  },

  data: () => ({
    mensagemDeErroDataReferencia: "",
    mensagemDeErroDataInicial: "",
    mensagemDeErroDataFinal: "",
    adicionalPersonalizadoSelecionado: undefined,
    adicionaisPersonalizados: [],
    TIPO_DATA: {
      INICIO: "data-inicio",
      FIM: "data-fim",
      REFERENCIA: "data-referencia"
    },
    emailRules: [ v => !v || /.+@.+\..+/.test(v) || 'E-mail deve ser válido' ],
    telefoneRules: [ v => !v || /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/.test(v) || 'Telefone deve ser válido' ]
  }),

  mounted() {
    this.focoHabilitado = true;
    this.filtrarAdicionaisPersonalizados();
    this.preencherDataDeReferencia();
  },

  watch: {
    "orcamentoLocacao.adicionalPersonalizado": function(adicionalPersonalizado) {
      this.adicionalPersonalizadoSelecionado = adicionalPersonalizado;
    },

    adicionalPersonalizadoSelecionado: function(adicionalPersonalizado) {
      if (adicionalPersonalizado) {
        if (
          !this.orcamentoLocacao.adicionalPersonalizado ||
          adicionalPersonalizado.identificador !=
            this.orcamentoLocacao.adicionalPersonalizado.identificador
        ) {
          this.atualizarAdicionalNoOrcamento(adicionalPersonalizado);
        }
      } else {
        this.orcamentoLocacao.adicionalPersonalizado = adicionalPersonalizado;
        this.orcamentoLocacao.calcularAdicionaisPersonalizados();
      }
    }
  },

  methods: {
    periodoInvalido() {
      if (this.orcamentoLocacao.dataInicioContrato && this.orcamentoLocacao.dataTerminoContrato)
        return moment(this.orcamentoLocacao.dataInicioContrato).isAfter(this.orcamentoLocacao.dataTerminoContrato);
      return false;
    },

    preencherDataDeReferencia() {
      let dataDeHoje = moment().format("YYYY-MM-DD");

      if (this.$route.name == ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name) {
        this.orcamentoLocacao.dataReferencia = dataDeHoje;
      }
    },

    dataAlterada(tipoData) {
      this.mensagemDeErroDataReferencia = "";

      if (!this.orcamentoLocacao.dataReferencia && tipoData == this.TIPO_DATA.REFERENCIA)
        this.mensagemDeErroDataReferencia = "Obrigatório";
    },

    validarCamposObrigatoriosDeData() {
      this.mensagemDeErroDataInicial = "";
      this.mensagemDeErroDataFinal = "";

      if (this.periodoInvalido()) {
        this.mensagemDeErroDataInicial = "Período inválido";
        this.mensagemDeErroDataFinal = "Período inválido";
      }
    },

    dataDoOrcamentoAlterada(tipoData) {
      this.validarCamposObrigatoriosDeData();

      if (!this.orcamentoLocacao.itens.length ||
         (!this.orcamentoLocacao.dataInicioContrato && tipoData == this.TIPO_DATA.INICIO) ||
         (!this.orcamentoLocacao.dataTerminoContrato && tipoData == this.TIPO_DATA.FIM))
        return;

      let cfgMsg = new CfgMensagemFlutuante;
      cfgMsg.titulo = `Atualização do orçamento`;
      cfgMsg.mensagem = `Deseja aplicar esta data aos itens já adicionados?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      if (tipoData == this.TIPO_DATA.INICIO)
        cfgMsg.botaoPrimario.callback = () => {
          this.orcamentoLocacao.itens.forEach((item)=>{
            item.dataInicialLocacao = this.orcamentoLocacao.dataInicioContrato;
          });
        }
      else
        cfgMsg.botaoPrimario.callback = () => {
          this.orcamentoLocacao.itens.forEach((item)=>{
            item.dataFinalLocacao = this.orcamentoLocacao.dataTerminoContrato;
          });
        }

      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    filtrarAdicionaisPersonalizados() {
      this.adicionaisPersonalizados = [];

      apiOrcamento
        .obterAdicionaisPersonalizados()
        .then(resp => (this.adicionaisPersonalizados = resp))
        .catch(() => (this.adicionaisPersonalizados = []));
    },

    atualizarAdicionalNoOrcamento(adicionalPersonalizado) {
      apiOrcamento
        .obterItensDosAdicionaisPersonalizados(adicionalPersonalizado.identificador)
        .then(resposta => {
          adicionalPersonalizado.itens = resposta[0].itens;
          this.orcamentoLocacao.adicionalPersonalizado = adicionalPersonalizado;
          this.orcamentoLocacao.calcularAdicionaisPersonalizados();
        })
        .catch(erro => {
          this.$mensagemFlutuante.erro({
            titulo: "Não foi possível atualizar.",
            mensagem: erro
          });
        });
    },

    preencherPessoaDeContato() {
      let contatoPrincipalCliente = this.orcamentoLocacao.cliente
        && this.orcamentoLocacao.cliente.enderecoPrincipal
        && this.orcamentoLocacao.cliente.enderecoPrincipal.contatoPrincipal;

      if (!contatoPrincipalCliente) {
        this.orcamentoLocacao.nomePessoaDeContatoCliente = undefined;
        this.orcamentoLocacao.emailPessoaDeContatoCliente = undefined;
        this.orcamentoLocacao.telefonePessoaDeContatoCliente = undefined;

        return;
      }

      if (this.$route.name == ROTAS_FATURAMENTO_METADATA.novoOrcamentoLocacao.name
        || this.$route.name == ROTAS_FATURAMENTO_METADATA.editarOrcamentoLocacao.name
        || this.$route.name == ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.name) {
        this.orcamentoLocacao.nomePessoaDeContatoCliente = contatoPrincipalCliente.pessoaDeContato;
        this.orcamentoLocacao.emailPessoaDeContatoCliente = contatoPrincipalCliente.email;
        this.orcamentoLocacao.telefonePessoaDeContatoCliente = (
          contatoPrincipalCliente.telefoneFixo || contatoPrincipalCliente.telefoneCelular
        );
      }
    },
  }
};

</script>

<style lang="scss" scoped>
</style>