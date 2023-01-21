<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 justify-space-around>
      <v-flex xm12>
        <v-breadcrumbs large class="breadcrumb-alinhamento" :items="obterItensParaBreadcrumb()">
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
    </v-container>

    <v-container fluid px-5 pt-0>
      <v-form ref="form" lazy-validation>
        <v-layout wrap>
          
          <v-flex xs12 sm4 grow pr-2 class="alinhamento-modelo-proposta" >
            <v-text-field
              :id="'textfield-nome-'+id"
              label="Nome"
              v-model="propostaLocacao.nome"
              :rules=" [nomeValido || obterTextoParaNomeInvalido()]"
              :maxlength="50"
              counter
              autofocus
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm2 grow pr-2 pl-2 >
            <v-autocomplete
              :id="'textfield-tipo-modelo-'+id"
              label="Tipo de modelo"
              v-model="propostaLocacao.tipoModelo"
              :items="tiposDeModelos"
              @change="atualizarTipoDeModelo"
            ></v-autocomplete>
          </v-flex>

          <v-flex xs12 sm6 grow pl-2 class="alinhamento-modelo-proposta">
            <v-text-field
              :id="'textfield-descricao-'+id"
              label="Descrição"
              v-model="propostaLocacao.descricao"
              counter
              :maxlength="100"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-flex v-show="buscandoModelo" class="icone-de-progresso">
              <v-progress-circular :size="80" color="primary" indeterminate></v-progress-circular>
            </v-flex>
            <editor-de-proposta
              :id="'editor-de-proposta-'+id"
              v-model="propostaLocacao.conteudo"
              adicionarPluginInserirDados
              editorToolbar="inserirdados undo redo pagebreak formatselect 
                 fontselect fontsizeselect bold italic underline 
                  alignleft aligncenter alignright 
                 alignjustify outdent indent numlist bullist 
                 forecolor backcolor removeformat table"
              :alturaDoEditor="450"
              :tipoModelo="tipoModeloAtual"
            ></editor-de-proposta>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
    <div class="footer-bar-sticky footer-bar-box footer-modelo-proposta">
      <v-btn :id="'btn-visualizar-'+id" class="btn-tertiary" text @click="visualizarProposta()">Visualizar</v-btn>
      <v-btn
        :id="'btn-salvar-'+id"
        class="btn-primary width-btn-primary"
        text
        @click="salvarModelo"
        :disabled="desabilitarBotaoPrimario"
      >
        {{ (modoEdicao) ? 'Alterar' : 'Salvar' }}
      </v-btn>
      <v-btn :id="'btn-cancelar-'+id" class="btn-tertiary" text @click="cancelarModelo">Cancelar</v-btn>
    </div>
  </v-app>
</template>

<script>
import Editor from "@/components/comum/EditorTinymceBimer.vue";
import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { HTTP_STATUS_CODES } from '@/constants/comum/http-status-codes-constants.js';
import { LISTA_TIPOS_MODELOS, TIPOS_MODELOS } from "@/constants/faturamento/controle-de-locacao/modelo-proposta-constants.js";
import 'tinymce/icons/default/icons';
import ModeloPropostaLocacaoModel from "@/models/faturamento/proposta-locacao/modelo-proposta-model";
import notificacaoPerdaDeDadosMixin from "@/mixins/sistema/notificacao/notificacao-perda-de-dados-mixin";

export default {
  mixins: [notificacaoPerdaDeDadosMixin],

  components: {
    "editor-de-proposta": Editor
  },
  created() {
    this.cadastroDeModeloPeloControleDeModelosDeProposta =
      this.$route.params.idOrcamento === undefined;
  },

  mounted() {
    this.propostaLocacao.conteudo = "";

    if (typeof this.$route.params.idModelo === "undefined") {
      return;
    }

    this.carregarInformacoesDoModelo(
      this.$route.name === "EdicaoDeModeloPropostaLocacao"
    );
  },

  watch: {
    "propostaLocacao.nome": function(valor) {
      this.nomeExcedeuLimite = valor.length > 50;
      this.nomeValido = !this.nomeExcedeuLimite && valor ? true : false;
      this.nomeIgualAoOriginal = false;
    },
    "propostaLocacao.descricao": function(valor) {
      this.descricaoValida = valor ? true : false;
    }
  },

  data: () => ({
    id: 'modelo-proposta',
    modoEdicao: false,
    modoDuplicar: false,
    desabilitarBotaoPrimario: false,
    buscandoModelo: false,
    testefocus: true,
    nomeValido: true,
    descricaoValida: true,
    nomeExcedeuLimite: false,
    tiposDeModelos: LISTA_TIPOS_MODELOS,
    propostaLocacao: new ModeloPropostaLocacaoModel(),
    cadastroDeModeloPeloControleDeModelosDeProposta: false,
    nomeOriginalDoModeloEmCasoDeDuplicacao: "",
    tipoModeloAtual: TIPOS_MODELOS.ADITIVO.valor,
    historicos: []
  }),

  methods: {
    atualizarTipoDeModelo(){
      this.tipoModeloAtual = this.propostaLocacao.tipoModelo;
    },
    visualizarProposta() {
      //Comando interno do tinymce, futuramente verificar a possibilidade de criar essa rotina no nosso código para termos o controle.
      // eslint-disable-next-line no-undef
      tinyMCE.execCommand('mcePreview');
    },
    carregarInformacoesDoModelo(ativarModoEdicao) {
      this.propostaLocacao.identificador = this.$route.params.idModelo;
      this.modoEdicao = ativarModoEdicao;
      this.buscandoModelo = true;

      apiProposta
        .obterModeloDePropostaPorIdentificador(
          this.propostaLocacao.identificador
        )
        .then(response => {
          this.buscandoModelo = false;
          this.propostaLocacao = new ModeloPropostaLocacaoModel(response[0]);
        })
        .catch(error => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter o modelo para edição.`,
            mensagem: `${error[0].statusText}`
          });
          this.buscandoModelo = false;
        })
        .finally(() => {
          if (
            this.propostaLocacao !== undefined &&
            this.propostaLocacao !== null &&
            !this.modoEdicao
          ) {
            this.nomeOriginalDoModeloEmCasoDeDuplicacao = `${this.propostaLocacao.nome}`;
            this.modoDuplicar = true;
          }
        });
    },

    obterItensParaBreadcrumb() {
      let itensParaBreadcrumb = [];
      if (this.cadastroDeModeloPeloControleDeModelosDeProposta) {
        itensParaBreadcrumb = itensParaBreadcrumb.concat([
          {
            text: "Modelos",
            disabled: false,
            to: ROTAS_FATURAMENTO_METADATA.controleDeModelosDeProposta.name
          }
        ]);
        let jsonTelaAtual = { text: "", disabled: true, to: "" };
        jsonTelaAtual.text = this.ObterTextoDoBreadcrumbParaJanelaAtual();
        jsonTelaAtual.to = this.modoEdicao
          ? ROTAS_FATURAMENTO_METADATA.edicaoDeModeloPropostaLocacao.name
          : ROTAS_FATURAMENTO_METADATA.modeloPropostaLocacao.name;
        jsonTelaAtual.color = '#757575';

        return itensParaBreadcrumb.concat([jsonTelaAtual]);
      }

      return itensParaBreadcrumb.concat([
        {
          text: "Controle de orçamento",
          disabled: false,
          to: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name
        },
        {
          text: "Gerar proposta",
          disabled: false,
          to: ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.name,
          color: '#757575'
        }
      ]);
    },

    ObterTextoDoBreadcrumbParaJanelaAtual() {
      if (this.modoEdicao) {
        return "Editar modelo";
      }

      /* Código comentado porque a idéia de utilizar "Cópia de" nas duplicações será reanalisada pelo UX */
      /* if (this.modoDuplicar) {
        return `Cópia de ${this.nomeOriginalDoModeloEmCasoDeDuplicacao}`;
      } */

      return "Novo modelo";
    },

    obterTextoParaNomeInvalido() {
      if (this.nomeExcedeuLimite) {
        return "O nome não pode conter mais do que 50 caracteres";
      }

      if (this.nomeIgualAoOriginal) {
        return "O nome não pode ser igual ao modelo original";
      }

      return "Obrigatório";
    },

    camposEstaoValidos() {
      if (!this.propostaLocacao.nome || this.propostaLocacao.nome.trim() == "") {
        this.nomeValido = false;

        return false;
      }

      if (this.propostaLocacao.nome.length > 50) {
        this.nomeValido = false;
        this.nomeExcedeuLimite = true;

        return false;
      }

      if (
        this.propostaLocacao.nome ===
        this.nomeOriginalDoModeloEmCasoDeDuplicacao
      ) {
        this.nomeValido = false;
        this.nomeIgualAoOriginal = true;
        return false;
      }

      return true;
    },

    salvarModelo() {
      if(!this.propostaLocacao.modeloValidoParaCadastro()){
        this.$mensagemFlutuante.aviso({
          titulo:"Atenção!",
          mensagem: 'Todos os campos são obrigatórios.',
        });

        return;
      }

      if (this.camposEstaoValidos()) {
        this.desabilitarBotaoPrimario = true;

        if (this.modoEdicao) {
          apiProposta
            .editarModeloProposta(this.propostaLocacao)
            .then(() => {
              this.$mensagemFlutuante.sucesso({
                titulo: `Modelo editado com sucesso!`
              });

              this.limparCampos();
              this.deveAvisarQuePerderaDados = false;
              this.retornarParaATelaDeGeracaoDeProposta();
              this.desabilitarBotaoPrimario = false;
            })
            .catch(erro => {
              this.notificarProblema(erro, `Não foi possível editar o modelo.`, () =>
                this.desabilitarBotaoPrimario = false);
            });
        } else {
          apiProposta
            .cadastrarModeloProposta(this.propostaLocacao)
            .then(() => {
              this.$mensagemFlutuante.sucesso({
                titulo: `Modelo salvo com sucesso.`,
                mensagem: ``
              });

              this.limparCampos();
              this.deveAvisarQuePerderaDados = false;
              this.retornarParaATelaDeGeracaoDeProposta();
              this.desabilitarBotaoPrimario = false;
            })
            .catch(erro => {
              this.notificarProblema(erro, `Não foi possível salvar o modelo.`, () =>
                this.desabilitarBotaoPrimario = false);
            });
        }
      }
    },

    notificarProblema(erro, titulo, onClose) {
      let metodoMensagem = Array.isArray(erro) && erro[0] && (erro[0].status == HTTP_STATUS_CODES.BAD_REQUEST.status)
        ? this.$mensagemFlutuante.aviso
        : this.$mensagemFlutuante.erro;

      metodoMensagem({
        titulo: titulo,
        mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || `${erro}`,
        onClose: onClose
      });
    },

    limparCampos() {
      this.propostaLocacao.nome = " ";
      this.propostaLocacao.descricao = " ";
      this.propostaLocacao.conteudo = " ";
    },

    cancelarModelo() {
      this.retornarParaATelaDeGeracaoDeProposta();
    },

    retornarParaATelaDeGeracaoDeProposta() {
      this.$router.back();
    },
  }
};
</script>

<style lang="scss" scoped>
%ajustes-divs-internas-toolbar {
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(50, 50, 50, 0.1);
  padding: 2px;
  width: 100%;
}

// tox-tbtn tox-tbtn--select tox-tbtn--bespoke tox-tbtn--active
::v-deep .tox-toolbar .tox-toolbar__group:first-child {
  border: none;
  @extend %ajustes-divs-internas-toolbar;
  padding-left: 8px;
}

::v-deep div .tox .tox-toolbar {
  margin: 10px 2px 10px 2px;
  border: none;
  background: none;
  background-color: #fff;
  width: 100%;
}

::v-deep div.tox-sidebar-wrap > .tox-edit-area {
  margin-top: 10px;
  border-top: 1px solid #ddd;
}

::v-deep .tox-tbtn.tox-tbtn--select:first-child {
  width: 170px;
}

::v-deep .tox-tbtn.tox-tbtn--select.tox-tbtn--bespoke {
  width: 100px;
}

::v-deep button.tox-tbtn.tox-tbtn--select[title="Tamanhos da fonte"] {
  width: 60px;
}

.alinhamento-modelo-proposta {
  padding: 0 85px;
}

</style>