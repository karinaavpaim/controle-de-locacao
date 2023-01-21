<template>
  <v-app :id="id">
    <v-container
      fluid
      px-5
      pt-0
      justify-space-around
      v-if="orcamento.identificador"
    >
      <v-layout>
        <v-flex xm12 justify-start>
          <v-breadcrumbs
            large
            class="breadcrumb-alinhamento"
            :items="breadCrumbs"
          >
            <template v-slot:divider>
              <v-icon>mdi-18px mdi-chevron-right</v-icon>
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
        </v-flex>
      </v-layout>

      <div class="area-geracao-proposta">
        <v-layout>
          <v-flex md5>
            <h3 class="label-padrao">Cliente</h3>
            <p class="resumo-orcamento">{{ orcamento.cliente.nome }}</p>
          </v-flex>
          <v-flex md3 ml-5>
            <h3 class="label-padrao">CNPJ/CPF</h3>
            <p class="resumo-orcamento">{{ orcamento.cliente.CPFouCNPJ }}</p>
          </v-flex>
          <v-flex md4>
            <h3 class="label-padrao">Data de referência</h3>
            <p class="resumo-orcamento">{{ orcamento.dataReferencia | aplicarMascaraIso  }}</p>
          </v-flex>
        </v-layout>

        <v-layout class="py-3">
          <v-flex md5>
            <h3 class="label-padrao">Objetivo do orçamento</h3>
            <p class="resumo-orcamento resumo-descricao-orcamento">
              {{ orcamento.descricao || "-" }}
            </p>
          </v-flex>
          <v-flex md3 ml-5>
            <h3 class="label-padrao">Valor total do orçamento</h3>
            <p class="resumo-orcamento">{{ orcamento.totalOrcamento | aplicarMascaraReal}}</p>
          </v-flex>
          <v-flex md4>
            <h3 class="label-padrao">Código do orçamento</h3>
            <p class="resumo-orcamento">{{ orcamento.codigo }}</p>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex md5>
            <pesquisa-de-modelo-de-proposta
              v-model="modelo"
              @onChange="alterarModeloSelecionado"
              :apresentarHintDeErro="apresentarErro"
              :disabled="!editorSomenteLeitura"
              :id="'pesquisa-modelo-proposta-' + id"
              :tipoModelo="tipoModelo"
            ></pesquisa-de-modelo-de-proposta>
          </v-flex>
          <v-flex md4 ml-5>
            <h3 class="label-padrao">Descrição do modelo</h3>
            <p class="resumo-modelo">
              {{ (modelo && modelo.descricao) || "-" }}
            </p>
          </v-flex>
          <v-flex md3>
            <v-btn
              class="btn-tertiary btn-acoes-geracao-proposta"
              text
              @click="cancelarEdicaoDoConteudoDaProposta()"
              :hidden="ocultarBotaoCancelar"
              :id="'btn-cancelar-modelo-' + id"
            >
              Cancelar
            </v-btn>
            <v-btn
              class="btn-quaternary btn-acoes-geracao-proposta"
              text
              @click="editarConteudoDaProposta()"
              :disabled="!modeloSelecionado"
              :id="'btn-' + textoBotaoParaEditarOuSalvar + '-modelo-' + id"
            >
              <v-icon left medium>{{ iconeEditarOuSalvar }}</v-icon>
              {{ textoBotaoParaEditarOuSalvar }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <v-layout wrap class="layout-editor-de-proposta">
        <v-flex v-show="buscandoModelo" class="icone-de-progresso">
          <v-progress-circular
            :size="80"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex>
        <v-flex xs12 sm12 md12>
          <editor-de-proposta
            :id="'editor-de-proposta-' + id"
            v-model="conteudoDoEditor"
            editorToolbar="inserirdados undo redo pagebreak formatselect 
                 fontselect fontsizeselect bold italic underline 
                  alignleft aligncenter alignright 
                 alignjustify outdent indent numlist bullist 
                 forecolor backcolor removeformat table"
            :alturaDoEditor="450"
            :desabilitarEditor="editorSomenteLeitura"
            :inicial="conteudoDoEditor"
            :tipoModelo="tipoModelo"
          ></editor-de-proposta>
        </v-flex>
      </v-layout>
    </v-container>
    <div
      v-if="orcamento.identificador"
      v-show="mostrarRodapeDeAcoes"
      class="footer-bar-sticky footer-bar-box footer-modelo-proposta"
    >
      <v-btn
        v-show="modeloSelecionado"
        class="btn-tertiary"
        text
        @click="visualizarProposta()"
        :id="'btn-visualizar-proposta-' + id"
      >
        Visualizar
      </v-btn>
      <v-btn
        v-show="modelo && modelo.identificador"
        class="btn-primary width-btn-primary"
        text
        @click="salvar()"
        :disabled="desabilitarBotaoPrimario"
        :id="'btn-salvar-proposta-' + id"
      >
        Salvar
      </v-btn>
      <v-btn
        class="btn-tertiary"
        text
        @click="cancelarProposta()"
        :id="'btn-cancelar-proposta-' + id"
        >Cancelar</v-btn
      >
    </div>
  </v-app>
</template>
  
<script>
import dataUtils from "@/utils/data.js";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import PesquisaDeModeloDeProposta from "@/components/faturamento/controle-de-locacao/proposta/PesquisaDeModeloDeProposta.vue";
import Editor from "@/components/comum/EditorTinymceBimer.vue";
import apiProposta from "@/api/faturamento/controle-de-locacao/proposta-locacao-api.js";
import apiOrcamento from "@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js";
import compositor from "@/plugins/editor-tinymce/composicao-variaveis/compositor-variaveis.js";
import mascaraDinheiro from "../../../../utils/mascara-dinheiro";
import ModeloPropostaLocacaoModel from "@/models/faturamento/proposta-locacao/modelo-proposta-model";
import PropostaLocacaoModel from "@/models/faturamento/proposta-locacao/proposta-locacao-model";
import { TIPOS_MODELOS } from "@/constants/faturamento/controle-de-locacao/modelo-proposta-constants.js";

import apiHistoricoOrcamento from '@/api/faturamento/controle-de-locacao/historico-orcamento-api';
import HistoricoLocacaoModel from '@/models/faturamento/orcamento-locacao/historico-locacao/historico-locacao-model';
import AditivoModel from '@/models/faturamento/orcamento-locacao/historico-locacao/aditivo-model';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import impressaoUtils from "@/utils/impressao";

export default {
  components: {
    "editor-de-proposta": Editor,
    PesquisaDeModeloDeProposta,
  },
  filters:{
    aplicarMascaraIso(data){
      return dataUtils.aplicarMascaraEmDataIso(data);
    },
    aplicarMascaraReal(valor){
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  },

  mounted() {
    if(this.$route.query.aditivo){
      this.gerarAditivo = true;  
      this.tipoModelo = TIPOS_MODELOS.ADITIVO.VALOR;
    }

    this.editandoPropostaExistente = this.$route.query.editar !== undefined;

    this.obterOrcamentoPeloIdentificador(this.$route.params.idOrcamento);
  },

  data: () => ({
    //TODO:  Transformar as propriedades de orçamento em um modelo de orçamento.
    id: "geracao-de-proposta",
    editorSomenteLeitura: true,
    desabilitarBotaoPrimario: false,
    editandoPropostaExistente: false,
    modeloSelecionado: false,
    ocultarBotaoCancelar: true,
    mostrarRodapeDeAcoes: true,
    identificadorDoOrcamentoSelecionado: "",
    nomeDoCliente: "",
    cpfCnpjDoCliente: "",
    dataDeReferenciaDoOrcamento: "",
    descricaoDoOrcamento: "",
    codigoDoOrcamento: "",
    valorTotalDoOrcamento: "",
    conteudoDoEditor: "",
    buscandoModelo: false,
    apresentarErro: false,
    orcamento: new OrcamentoLocacaoModel(),
    mensagemDeErro: "",
    modelo: new ModeloPropostaLocacaoModel(),
    proposta: new PropostaLocacaoModel(),
    gerarAditivo: false,
    historicosOrcamento: [],
    aditivoModel: new AditivoModel(),
    tipoModelo: TIPOS_MODELOS.PROPOSTA.VALOR,    
  }),

  computed: {
    textoBotaoParaEditarOuSalvar() {
      return this.editorSomenteLeitura ? "Editar" : "Salvar";
    },
    iconeEditarOuSalvar() {
      return this.editorSomenteLeitura ? "edit" : "save";
    },
    breadCrumbs: function () {
      return [
        {
          text: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.title,
          disabled: false,
          to: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name,
        },
        {
          text: this.editandoPropostaExistente
            ? ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao.title
            : ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.title,
          disabled: true,
          to: this.editandoPropostaExistente
            ? ROTAS_FATURAMENTO_METADATA.edicaoDePropostaDeLocacao.name
            : ROTAS_FATURAMENTO_METADATA.geracaoDePropostaDeLocacao.name,
          color: "#757575",
        },
      ];
    },
  },

  methods: {

    imprimirAditivo(proposta) {
       impressaoUtils.imprimir(
          `Impressão ${this.gerarAditivo ? 'do aditivo': 'da proposta'}`,
          proposta.conteudo
        ).catch((erro) => {
            this.$mensagemFlutuante.erro({
              titulo: `Não foi possível imprimir ${this.gerarAditivo} ? 'o aditivo' : 'a proposta'`,
              mensagem:
                (Array.isArray(erro) && erro[0] && erro[0].statusText) ||
                erro,
            });
        }).finally(() =>  this.cancelarProposta());
    },

    obterHistoricoMaisRecente(historicos){
      historicos = historicos
      .sort((h1, h2) => 
        h1.identificador < h2.identificador ? -1 : h1.identificador > h2.identificador ? 1 : 0)
      .reverse();

      return historicos[0];      
    },

    gerarAditivoPeloHistoricoMaisRecente(orcamento, historicos){
        let historicoRecente = this.obterHistoricoMaisRecente(historicos);

        this.aditivoModel = new AditivoModel().gerarAditivoPorHistorico(historicoRecente.valorHistorico, orcamento);
        this.aditivoModel.identificadorHistoricoOrcamento = historicoRecente.identificador;
        this.proposta.identificadorHistoricoOrcamento = historicoRecente.identificador;
    },
    

    obterHistoricosDoOrcamento(idendificadorOrcamento){
      apiHistoricoOrcamento
      .obterHistoricosPeloIdendificadorDaLocacao(idendificadorOrcamento)
      .then(response => {
        this.historicosOrcamento = response.map(historico => new HistoricoLocacaoModel(historico));     
        this.gerarAditivoPeloHistoricoMaisRecente(this.orcamento, this.historicosOrcamento);
      })
      .catch(() => {
          this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter os históricos referente ao orçamento ${this.orcamento.codigo}.`,
          mensagem: "",
        })
      });
    },
    alterarModeloSelecionado(modelo) {
      this.limparModeloSeNaoInformado(modelo);

      if (!this.modelo.identificador || !modelo) return;

      this.apresentarErro = false;
      this.conteudoDoEditor = "";
      this.obterModeloDePropostaPeloIdentificador(this.modelo.identificador);
    },

    limparModeloSeNaoInformado(modelo) {
      if (!modelo) {
        this.modelo = new ModeloPropostaLocacaoModel();
      }

      if (!this.modelo.identificador) {
        this.modelo.nome = undefined;
        this.modelo.descricao = undefined;
        this.modelo.conteudo = undefined;
        this.conteudoDoEditor = "";
        this.modeloSelecionado = false;
      }
    },

    obterPropostaDoOrcamento(identificadorOrcamento) {
      apiProposta
        .obterProposta(identificadorOrcamento)
        .then((propostas) => {
          this.proposta = propostas[0];
          // cria uma cópia do modelo, sem referência
          this.modelo = new ModeloPropostaLocacaoModel({
            identificador: this.proposta.modelo.identificador,
            conteudo: this.proposta.conteudoPropostaModelo,
            nome: this.proposta.modelo.nome,
            descricao: this.proposta.modelo.descricao,
            tipoModelo: this.proposta.modelo.tipoModelo
          });
          this.modeloSelecionado = true;
          this.conteudoDoEditor = this.proposta.conteudo;
        })
        .catch(() =>
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter a proposta referente ao orçamento ${this.orcamento.codigo}.`,
            mensagem: "",
          })
        );
    },

    modoSomenteLeitura(ativar) {
      this.editorSomenteLeitura = ativar;
      this.mostrarRodapeDeAcoes = ativar;
      this.ocultarBotaoCancelar = ativar;
    },

    cancelarEdicaoDoConteudoDaProposta() {
      this.modoSomenteLeitura(true);
      this.conteudoDoEditor = this.proposta.conteudo;
    },

    editarConteudoDaProposta() {
      if (this.editorSomenteLeitura) {
        this.modoSomenteLeitura(false);
        // ao editar, ler sempre do conteúdo guardado na proposta, com as alterações feitas pelo usuário.
        this.conteudoDoEditor = this.proposta.conteudoPropostaModelo;
        return;
      }

      // após editar, o conteúdo a ser usado é guardado na proposta com as alterações que o usuário fizer.
      this.proposta.conteudoPropostaModelo = this.conteudoDoEditor;
      this.obterConteudoDoModeloDePropostaComAsVariaveisSubstituidasPorValores(
        this.conteudoDoEditor,
        this.orcamento
      )
        .then((conteudoDoModeloComValores) => {
          this.proposta.conteudo = conteudoDoModeloComValores;
          this.conteudoDoEditor = conteudoDoModeloComValores;
          this.modoSomenteLeitura(true);
        })
        .catch((error) => {
          this.$mensagemFlutuante.erro({
            titulo: `${error}`,
            mensagem: "",
          });
        });
    },

    visualizarProposta() {
      //Comando interno do tinymce, futuramente verificar a possibilidade de criar essa rotina no nosso código para termos o controle.
      // eslint-disable-next-line no-undef
      tinyMCE.execCommand("mcePreview");
    },

    async salvar() {
      if (!this.modelo.modeloValido()) {
        this.$mensagemFlutuante.erro({
          titulo: `Informe um modelo para gravação ${this.gerarAditivo ? 'do aditivo': ' da proposta' }.`,
          mensagem: "",
        });
        return;
      }

      this.buscandoModelo = true;
      
      try {
        this.desabilitarBotaoPrimario = true;
        this.editandoPropostaExistente
          ? await apiProposta.editarProposta(this.proposta)
          : await apiProposta.cadastrarProposta(this.proposta);

        this.$mensagemFlutuante.sucesso({
          titulo: `${this.gerarAditivo ? 'Aditivo de proposta': 'Proposta' } ${
            this.editandoPropostaExistente ? "alterada" : "cadastrada"
          } com sucesso.`,
          mensagem: ``,
        });

        this.imprimirAditivo(this.proposta);

      } catch (erro) {
        this.desabilitarBotaoPrimario = false;
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível salvar ${this.gerarAditivo ? 'o aditivo': 'a proposta' } do orçamento.`,
          mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro,
        });
      } finally {
        this.buscandoModelo = false;
      }
    },

    cancelarProposta() {
      this.gerarAditivo ? 
        this.retornarParaATelaDeGestaoDeOrcamento() : 
        this.retornarParaATelaDeControleDeOrcamento();
    },

    retornarParaATelaDeControleDeOrcamento() {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao.name,
      });
    },

    retornarParaATelaDeGestaoDeOrcamento() {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.controleDeGestaoDeLocacao.name,
      });
    },

    obterModeloDePropostaPeloIdentificador(identificador) {
      this.buscandoModelo = true;

      apiProposta
        .obterModeloDePropostaPorIdentificador(identificador)
        .then((modelosDeProposta) => {
          // Atualizar o modelo, pois para otimizar a pesquisa este é consultado sem o conteúdo.
          this.modelo = modelosDeProposta[0];
          this.obterConteudoDoModeloDePropostaComAsVariaveisSubstituidasPorValores(
            this.modelo.conteudo,
            this.orcamento
          )
            .then((conteudoDoModeloComValores) => {
              // Guardar o conteúdo do modelo selecionado na nova proposta, para usar sempre a partir dela.
              this.proposta.conteudoPropostaModelo = this.modelo.conteudo;
              this.proposta.conteudo = conteudoDoModeloComValores;
              this.conteudoDoEditor = conteudoDoModeloComValores;
              this.proposta.modelo = this.modelo;
              this.modeloSelecionado = true;
            })
            .catch((erro) => {
              this.$mensagemFlutuante.erro({
                titulo: `Não foi possível obter o modelo selecionado.`,
                mensagem: `Motivo: ${
                  (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
                }`,
              });
            })
            .finally(() => {
              this.buscandoModelo = false;
            });
        })
        .catch((erro) => {
          this.buscandoModelo = false;
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter o modelo selecionado.`,
            mensagem: `Motivo: ${
              (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
            }`,
          });
        });
    },

    obterOrcamentoPeloIdentificador(identificadorOrcamento) {
      apiOrcamento
        .consultarDetalhesOrcamentoPorIdentificador(identificadorOrcamento)
        .then((orcamentos) => {
    
          this.orcamento = new OrcamentoLocacaoModel(orcamentos[0]);
 
          if (this.editandoPropostaExistente && this.orcamento.identificador) {
            this.obterPropostaDoOrcamento(this.orcamento.identificador);
            this.modoSomenteLeitura(true);
          } else {
            this.proposta.identificadorOrcamento = this.orcamento.identificador;
          }

          if(this.gerarAditivo){
            this.obterHistoricosDoOrcamento(this.orcamento.identificador)
          } 

        })
        .catch(() => (this.orcamento = new OrcamentoLocacaoModel()))
    },

    async obterConteudoDoModeloDePropostaComAsVariaveisSubstituidasPorValores(conteudoDaProposta, orcamento) {
      
       let variaveisDoSistema = (this.gerarAditivo) ? 
        await compositor.obterVariaveisParaAditivo(this.aditivoModel) :
        await compositor.obterVariaveisParaProposta(orcamento);

      variaveisDoSistema.forEach(item => {
        item.filhas.forEach(variavel => {
          let replace = `((<span nome-variavel="@@${variavel.atributo}@@")[A-z, :, 0-9, >, ", ., =, \\-, (, ),;,#,&,\\/]*(<\\/span>))`;
          let regex = new RegExp(replace, "ig");

          ((conteudoDaProposta && conteudoDaProposta.match(regex)) || []).forEach(elemento =>
            conteudoDaProposta = conteudoDaProposta.replace(elemento, variavel.conteudo())
          );
        });
      });

      return Promise.resolve(conteudoDaProposta);
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-editor-de-proposta {
  margin-top: -32px;
}

p.resumo-orcamento {
  font-weight: 500;
  color: $grey-900;
  font-size: 15px;
}

p.resumo-orcamento.resumo-descricao-orcamento {
  font-size: 13px;
}

p.resumo-modelo {
  font-size: 12px;
}

.area-geracao-proposta {
  margin: 0 80px;
}

%ajustes-divs-internas-toolbar {
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(50, 50, 50, 0.1);
  padding: 2px;
  width: 100%;
}

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

.btn-acoes-geracao-proposta {
  float: right;
  margin-right: 0;
}
</style>