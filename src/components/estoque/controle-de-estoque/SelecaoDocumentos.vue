<template>
  <v-app id="selecaoDocumentos" :style="propriedadesCSS">
    <v-container fluid px-5>
      <v-layout flex-column justify-space-around>

        <v-card
          class="mb-4 pa-3"
          v-show="!exibirFiltro"
          @click="exibirFiltro = true"
        >
          <v-layout row justify-space-between px-4>
            <v-flex xs12 md4>
              <h3 class="label-padrao">Empresa</h3>
              <span>{{ (empresa && empresa.codigoNome) || '-' }}</span>
            </v-flex>
            <v-flex xs6 md4>
              <h3 class="label-padrao">Setor</h3>
              <span v-if="$vuetify.breakpoint.xsOnly">
                {{ (setorRequisitado && setorRequisitado.codigoNome && setorRequisitado.codigoNome.substring(0, 22)) || '-' }}
              </span>
              <span v-else>{{ (setorRequisitado && setorRequisitado.codigoNome) || '-' }}</span>
            </v-flex>
            <v-flex xs6 md3>
              <h3 class="label-padrao">Período</h3>
              <span>{{ dataReferenciaInicial | data_br }} a {{ dataReferenciaFinal | data_br }}</span>
            </v-flex>
          </v-layout>
        </v-card>

        <v-layout class="pa-4" row justify-space-between v-show="exibirFiltro">
          <v-flex xs12 sm12 md3>
            <pesquisa-empresa
              id="pesquisa-empresa"
              v-model="empresa"
              label="Empresa"
              placeholder="Pesquise pelo código ou nome da empresa"
              atributoExibicao="codigoNome"
              atributoValor="identificador"
            ></pesquisa-empresa>
          </v-flex>

          <v-flex xs12 sm4 md3>
            <v-autocomplete
              id="pesquisa-setor"
              :items="setores"
              placeholder="Selecione o setor"
              :error="setorRequisitadoInvalido"
              item-text="codigoNome"
              :return-object="true"
              v-model="setorRequisitado"
              auto-select-first
              autocomplete="off"
              :loading="carregandoSetores"
              clearable
            ></v-autocomplete>
          </v-flex>

          <v-flex xs5 sm3 md2>
            <date-picker
              id="data-inicio"
              label="Data início"
              hint
              v-model="dataReferenciaInicial"
              horarioPadrao="00:00:00"
              mensagensDeErro="Obrigatório"
              :apresentarMensagemDeErro="dataReferenciaInicialInvalida"
            ></date-picker>
          </v-flex>

          <v-flex offset-xs2 xs5 offset-sm0 sm3 md2>
            <date-picker
              id="data-fim"
              label="Data fim"
              hint
              v-model="dataReferenciaFinal"
              horarioPadrao="23:59:59"
              :data-minima="dataReferenciaInicial"
              mensagensDeErro="Obrigatório"
              :apresentarMensagemDeErro="dataReferenciaFinalInvalida"
            ></date-picker>
          </v-flex>

          <v-flex xs12 sm3 md1>
            <v-btn
              class="btn-primary"
              @click="filtrarDocumentos"
              text
              :block="$vuetify.breakpoint.xsOnly"
            >Filtrar</v-btn>
          </v-flex>
        </v-layout>

        <v-layout row class="align-stretch">
          <v-flex xs12 sm8 md9>
            <v-tabs
              v-model="abaAtual"
              :fixed-tabs="$vuetify.breakpoint.xsOnly"
            >
              <v-tab href="#aba-separacao">Separação</v-tab>
              <v-tab href="#aba-conferencia">Conferência</v-tab>
            </v-tabs>
          </v-flex>

          <v-flex xs12 sm4 md3>
            <v-text-field
              class="input-pesquisar py-2 ma-0"
              :v-model="abaAtual == 'aba-separacao' ? pesquisaSeparacao : pesquisaConferencia"
              append-icon="search"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field>
          </v-flex>

          <v-tabs-items v-model="abaAtual">
            <v-tab-item value="aba-separacao">
              <v-data-table
                id="tabela-documentos-separacao"
                class="contorno-tabela flex align-stretch"
                :headers="colunasTabelaListaDocumentosSeparacao"
                sort-by="dataReferencia"
                v-model="documentosSeparacaoSelecionados"
                @current-items="(itensVisiveis) => documentosSeparacaoVisiveis = itensVisiveis"
                :items="documentosSeparacao"
                item-key="descricao"
                :search="pesquisaSeparacao"
                loading-text="Carregando, aguarde"
                no-data-text="Nenhum documento encontrado, refine sua pesquisa."
                :fixed-header="true"
                :disable-pagination="true"
                :hide-default-footer="true"
                :mobile-breakpoint="0"
                @click:row="alternarSelecao"
              >
                <template v-slot:item.dataReferencia="{ item }">
                  <destaque-pesquisa :pesquisa="pesquisaSeparacao">{{ item.dataReferencia | data_hora_br }}</destaque-pesquisa>
                </template>

                <template v-slot:item.descricao="{ item }">
                  <v-chip label small :color="tiposDocumentoControleEstoque[item.tipo].cor">
                    <destaque-pesquisa :pesquisa="pesquisaSeparacao">{{ item.descricao }}</destaque-pesquisa>
                  </v-chip>
                </template>

                <template v-slot:item.setorOrigem.descricao="{ item }">
                  <destaque-pesquisa :pesquisa="pesquisaSeparacao">{{ item.setorOrigem.descricao }}</destaque-pesquisa>
                </template>

                <template v-slot:item.status="{ item }">
                  <destaque-pesquisa :pesquisa="pesquisaSeparacao">{{ statusDocumentoControleEstoque[item.status] }}</destaque-pesquisa>
                </template>

                <template v-slot:no-data>
                  <v-flex class="text-center">
                    <span>Nenhum documento encontrado, refine sua pesquisa.</span>
                  </v-flex>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item value="aba-conferencia">
              <v-data-table
                id="tabela-documentos-conferencia"
                class="contorno-tabela flex align-stretch"
                :headers="colunasTabelaListaDocumentosConferencia"
                sort-by="dataReferencia"
                v-model="documentosConferenciaSelecionados"
                @current-items="(itensVisiveis) => documentosConferenciaVisiveis = itensVisiveis"
                :items="documentosConferencia"
                item-key="descricao"
                :search="pesquisaConferencia"
                loading-text="Carregando, aguarde"
                no-data-text="Nenhum documento encontrado, refine sua pesquisa."
                :fixed-header="true"
                :disable-pagination="true"
                :hide-default-footer="true"
                :mobile-breakpoint="0"
                @click:row="alternarSelecao"
              >
                <template v-slot:item.dataReferencia="{ item }">
                  <destaque-pesquisa :pesquisa="pesquisaConferencia">{{ item.dataReferencia | data_hora_br }}</destaque-pesquisa>
                </template>

                <template v-slot:item.descricao="{ item }">
                  <v-chip label small :color="tiposDocumentoControleEstoque[item.tipo].cor">
                    <destaque-pesquisa :pesquisa="pesquisaConferencia">{{ item.descricao }}</destaque-pesquisa>
                  </v-chip>
                </template>

                <template v-slot:item.setorOrigem.descricao="{ item }">
                  <destaque-pesquisa :pesquisa="pesquisaConferencia">{{ item.setorOrigem.descricao }}</destaque-pesquisa>
                </template>

                <template v-slot:item.status="{ item }">
                  <destaque-pesquisa :pesquisa="pesquisaConferencia">{{ statusDocumentoControleEstoque[item.status] }}</destaque-pesquisa>
                </template>

                <template v-slot:no-data>
                  <v-flex class="text-center">
                    <span>Nenhum documento encontrado, refine sua pesquisa.</span>
                  </v-flex>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </v-layout>

        <v-row class="footer-mobile d-flex flex-column flex-md-row">
          <v-col class="xs12 md8 pb-0">
            <v-row class="d-flex justify-space-around no-gutters">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-checkbox hide-details class="mt-0" v-model="filtrarRequisicaoMaterial" v-on="on">
                    <template v-slot:label>
                      <v-chip label x-small :color="tiposDocumentoControleEstoque.REQUISICAO_MATERIAL.cor" v-on="on">
                        {{tiposDocumentoControleEstoque.REQUISICAO_MATERIAL[$vuetify.breakpoint.mdAndUp ? 'descricao' : 'sigla']}}
                      </v-chip>
                    </template>
                  </v-checkbox>
                </template>
                  {{tiposDocumentoControleEstoque.REQUISICAO_MATERIAL.descricao}}
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-checkbox hide-details class="mt-0" v-model="filtrarPedidoDeVenda" v-on="on" v-show="abaAtual == 'aba-separacao'">
                    <template v-slot:label>
                      <v-chip label x-small :color="tiposDocumentoControleEstoque.PEDIDO_DE_VENDA.cor" v-on="on">
                        {{tiposDocumentoControleEstoque.PEDIDO_DE_VENDA[$vuetify.breakpoint.mdAndUp ? 'descricao' : 'sigla']}}
                      </v-chip>
                    </template>
                  </v-checkbox>
                </template>
                  {{tiposDocumentoControleEstoque.PEDIDO_DE_VENDA.descricao}}
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-checkbox hide-details class="mt-0" v-model="filtrarInventario" v-on="on" v-show="abaAtual == 'aba-separacao'">
                    <template v-slot:label>
                      <v-chip label x-small :color="tiposDocumentoControleEstoque.INVENTARIO.cor" v-on="on">
                        {{tiposDocumentoControleEstoque.INVENTARIO[$vuetify.breakpoint.mdAndUp ? 'descricao' : 'sigla']}}
                      </v-chip>
                    </template>
                  </v-checkbox>
                </template>
                  {{tiposDocumentoControleEstoque.INVENTARIO.descricao}}
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-checkbox hide-details class="mt-0" v-model="filtrarNotaFiscal" v-on="on" v-show="abaAtual == 'aba-conferencia'">
                    <template v-slot:label>
                      <v-chip label x-small :color="tiposDocumentoControleEstoque.NOTA_FISCAL.cor" v-on="on">
                        {{tiposDocumentoControleEstoque.NOTA_FISCAL[$vuetify.breakpoint.mdAndUp ? 'descricao' : 'sigla']}}
                      </v-chip>
                    </template>
                  </v-checkbox>
                </template>
                  {{tiposDocumentoControleEstoque.NOTA_FISCAL.descricao}}
              </v-tooltip>
            </v-row>
          </v-col>

          <v-col class="xs12 md4">
            <v-row class="d-flex justify-space-between justify-sm-end mx-0">
              <v-btn
                id="btn-selecionar"
                class="btn-primary"
                :disabled="((abaAtual == 'aba-separacao') &&
                  (documentosSeparacaoSelecionados.length == documentosSeparacaoVisiveis.length))
                  || ((abaAtual == 'aba-conferencia') &&
                  (documentosConferenciaSelecionados.length == documentosConferenciaVisiveis.length))"
                text
                @click="selecionarTodos"
              >Selecionar todos</v-btn>
              <v-btn
                id="btn-iniciar"
                class="btn-primary"
                :disabled="carregandoAcao ||
                  ((abaAtual == 'aba-separacao') && (documentosSeparacaoSelecionados.length == 0)) ||
                  ((abaAtual == 'aba-conferencia') && (documentosConferenciaSelecionados.length == 0))"
                :loading="carregandoAcao"
                text
                @click="iniciarAcao"
              >{{ abaAtual == 'aba-separacao' ? 'Separar' : 'Conferir' }}</v-btn>
              <v-btn
                id="btn-limpar"
                class="btn-tertiary"
                :disabled="
                  ((abaAtual == 'aba-separacao') && (documentosSeparacaoSelecionados.length == 0)) ||
                  ((abaAtual == 'aba-conferencia') && (documentosConferenciaSelecionados.length == 0))"
                text
                @click="limparSelecao"
              >Limpar seleção</v-btn>
            </v-row>
          </v-col>
        </v-row>

      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import PesquisaEmpresa from "@/components/sistemas-gerais/empresa/PesquisaEmpresa.vue";
import EmpresaModel from "@/models/geral/empresa-model";
import SetorModel from '@/models/geral/setor-model';
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";
import DatePicker from "@/components/comum/Datepicker";
import apiEmpresa from "@/api/sistemas-gerais/empresa-api";
import apiSelecaoDocumento from "@/api/estoque/controle-de-estoque/selecao-documento-api";
import apiDocumentoControleEstoque from "@/api/estoque/controle-de-estoque/documento-controle-estoque-api";
import SelecaoDeDocumentosModel from "@/models/estoque/controle-de-estoque/selecao-documento-model.js";
import PessoaParticipanteControleDeEstoqueModel from "@/models/estoque/controle-de-estoque/pessoa-participante-controle-de-estoque-model.js";
import { ROTAS_ESTOQUE_METADATA } from '@/constants/router/estoque-router-constants.js';
import {
  TIPOS_DOCUMENTO_CONTROLE_ESTOQUE,
  STATUS_DOCUMENTO_CONTROLE_ESTOQUE,
  CABECALHOS_SELECAO_DOCUMENTOS
} from "@/constants/estoque/controle-de-estoque/selecao-documentos-constants.js";
import dataUtils from "@/utils/data.js";
import moment from 'moment';
import * as ambiente from "../../../../vue.enviroment.config";

export default {
  name: "SelecaoDocumentos",
  components: {
    PesquisaEmpresa,
    DestaquePesquisa,
    DatePicker
  },

  filters: {
    data_hora_br: function(data) {
      return dataUtils.aplicarMascaraDataHoraEmDataIso(data, '-');
    },
    data_br: function(data) {
      return dataUtils.aplicarMascaraEmDataIso(data, '--/--/----');
    }
  },

  computed: {
    propriedadesCSS() {
      return {
        '--altura-tabela': this.alturaTabela
      }
    }
  },

  data() {
    return {
      alturaTabela: '300px',
      exibirFiltro: true,
      chaveFiltroLocalStorage: 'filtro-selecao-documentos-controle-estoque',
      assinaturaNotificacoes: undefined,
      empresa: undefined,
      carregandoAcao: false,
      setores: undefined,
      carregandoSetores: false,
      setorRequisitado: undefined,
      dataReferenciaInicial: undefined,
      dataReferenciaFinal: undefined,
      empresaInvalida: false,
      setorRequisitadoInvalido: false,
      dataReferenciaInicialInvalida: false,
      dataReferenciaFinalInvalida: false,
      pesquisaSeparacao: "",
      pesquisaConferencia: "",
      abaAtual: 'aba-separacao',
      colunasTabelaListaDocumentosSeparacao: this.retornarCabecalhosListaDocumentos(this.filtrarDocumentosSeparacaoPorTipo),
      colunasTabelaListaDocumentosConferencia: this.retornarCabecalhosListaDocumentos(this.filtrarDocumentosConferenciaPorTipo),
      documentosSeparacao: [],
      documentosSeparacaoVisiveis: [],
      documentosSeparacaoSelecionados: [],
      documentosConferencia: [],
      documentosConferenciaVisiveis: [],
      documentosConferenciaSelecionados: [],
      tiposDocumentoControleEstoque: TIPOS_DOCUMENTO_CONTROLE_ESTOQUE,
      statusDocumentoControleEstoque: STATUS_DOCUMENTO_CONTROLE_ESTOQUE,
      filtrarRequisicaoMaterial: false,
      filtrarPedidoDeVenda: false,
      filtrarInventario: false,
      filtrarNotaFiscal: false
    };
  },

  watch: {
    empresa() {
      if (this.carregandoSetores) return;

      if (!this.empresa) {
        this.setorRequisitado = undefined;
        this.setores = [];
        return;
      }

      this.carregarSetoresDaEmpresa(this.empresa.identificador)
    },
    exibirFiltro() {
      this.ajustarTamanhoDaTabela();
    },
    '$vuetify.breakpoint.mdAndUp'() {
      this.ajustarTamanhoDaTabela();
    }
  },

  mounted() {
    this.restaurarFiltroDoStorage();

    if (this.setorRequisitado) {
      this.filtrarDocumentos();
    } else {
      this.exibirFiltro = true;
    }

    this.assinarNotificacoes();
  },

  beforeRouteLeave(destino, origem, next) {
    if (this.assinaturaNotificacoes) {
      this.assinaturaNotificacoes.unsubscribe();
      window.removeEventListener('beforeunload', this.assinaturaNotificacoes.unsubscribe, false);
    }
    next();
  },

  methods: {
    assinarNotificacoes() {
      this.$nextTick(() => {
        this.assinaturaNotificacoes = apiSelecaoDocumento.assinarNotificacoesSeparacao(this.separacaoAlterada);
        window.addEventListener('beforeunload', this.assinaturaNotificacoes.unsubscribe, false);
      });
    },

    separacaoAlterada(notificacao) {
      let selecaoDeDocumentos = notificacao && notificacao.selecaoDeDocumentosAtualizada;

      if (!selecaoDeDocumentos) return;

      Array.isArray(selecaoDeDocumentos.documentos) && selecaoDeDocumentos.documentos.forEach(documento => {
          this.atualizarStatusDocumento(documento, this.documentosSeparacao);
          this.atualizarStatusDocumento(documento, this.documentosConferencia);
        });
    },

    atualizarStatusDocumento(documento, lista) {
      let indice = lista.findIndex(d => (d.identificadorDocumento == documento.identificadorDocumento)
        && (d.tipo == documento.tipo));

      if (indice == -1) return;

      lista[indice].status = documento.status;
    },

    filtrarDocumentos() {
      if (!this.validarFiltro())
        return;

      this.guardarFiltroNoStorage();

      apiDocumentoControleEstoque.obterCapasDosDocumentosControleEstoque(
        this.setorRequisitado.identificador,
        this.dataReferenciaInicial,
        this.dataReferenciaFinal
      )
        .then(resposta => {
          let documentos = (Array.isArray(resposta) && resposta) || [];
          this.documentosSeparacao = this.retornarDocumentosSeparacao(documentos);
          this.documentosConferencia = this.retornarDocumentosConferencia(documentos);
          this.exibirFiltro = false;
        })
        .catch(erro => {
          this.exibirMensagemErroFlutuante('Não foi possível obter os documentos', erro);
          this.exibirFiltro = true;
        });
    },

    validarFiltro() {
      if (!this.empresa) {
        this.exibirMensagemErroFlutuante('A empresa não foi informada.');
        return false;
      }

      this.setorRequisitadoInvalido = !this.setorRequisitado;

      if (this.setorRequisitadoInvalido) {
        this.exibirMensagemErroFlutuante('O setor não foi informado.');
        return false;
      }

      this.dataReferenciaInicialInvalida = !this.dataReferenciaInicial;

      if (this.dataReferenciaInicialInvalida) {
        this.exibirMensagemErroFlutuante('A data de referência inicial não foi informada.');
        return false;
      }

      this.dataReferenciaFinalInvalida = !this.dataReferenciaFinal;

      if (this.dataReferenciaFinalInvalida) {
        this.exibirMensagemErroFlutuante('A data de referência final não foi informada.');
        return false;
      }

      return true;
    },

    retornarDocumentosSeparacao(documentos) {
      var tipos = [
        this.tiposDocumentoControleEstoque.REQUISICAO_MATERIAL.sigla,
        this.tiposDocumentoControleEstoque.PEDIDO_DE_VENDA.sigla,
        this.tiposDocumentoControleEstoque.INVENTARIO.sigla
      ];
      return documentos.filter(d => tipos.includes(this.tiposDocumentoControleEstoque[d.tipo].sigla));
    },

    retornarDocumentosConferencia(documentos) {
      var tipos = [
        this.tiposDocumentoControleEstoque.REQUISICAO_MATERIAL.sigla,
        this.tiposDocumentoControleEstoque.NOTA_FISCAL.sigla
      ];
      return documentos.filter(d => tipos.includes(this.tiposDocumentoControleEstoque[d.tipo].sigla));
    },

    restaurarFiltroDoStorage() {
      let filtroStorage = localStorage.getItem(this.chaveFiltroLocalStorage);
      let filtro = JSON.parse(filtroStorage || '{}');
      this.empresa = filtro.empresa && new EmpresaModel(filtro.empresa);
      this.setorRequisitado = filtro.empresa && new SetorModel(filtro.setorRequisitado);
      this.setores = (this.setorRequisitado && [this.setorRequisitado]) || [];

      this.dataReferenciaInicial = filtro.dataReferenciaInicial
        ? filtro.dataReferenciaInicial
        : this.dataReferenciaInicial = dataUtils.formatarDataEHoraIso(new Date(), '00:00:00');
      this.dataReferenciaFinal = filtro.dataReferenciaFinal
        ? filtro.dataReferenciaFinal
        : this.dataReferenciaFinal = dataUtils.formatarDataEHoraIso(new Date(), '23:59:59');
    },

    guardarFiltroNoStorage() {
      let filtro = {
        empresa: this.empresa,
        setorRequisitado: this.setorRequisitado,
        dataReferenciaInicial: this.dataReferenciaInicial,
        dataReferenciaFinal: this.dataReferenciaFinal
      };
      localStorage.setItem(this.chaveFiltroLocalStorage, JSON.stringify(filtro));
    },

    filtrarDocumentosSeparacaoPorTipo(tipo) {
      var siglaTipo = this.tiposDocumentoControleEstoque[tipo] && this.tiposDocumentoControleEstoque[tipo].sigla;
      return (!this.filtrarRequisicaoMaterial && !this.filtrarPedidoDeVenda && !this.filtrarInventario)
        || (this.filtrarRequisicaoMaterial && (siglaTipo == this.tiposDocumentoControleEstoque.REQUISICAO_MATERIAL.sigla))
        || (this.filtrarPedidoDeVenda && (siglaTipo == this.tiposDocumentoControleEstoque.PEDIDO_DE_VENDA.sigla))
        || (this.filtrarInventario && (siglaTipo == this.tiposDocumentoControleEstoque.INVENTARIO.sigla));
    },

    filtrarDocumentosConferenciaPorTipo(tipo) {
      var siglaTipo = this.tiposDocumentoControleEstoque[tipo] && this.tiposDocumentoControleEstoque[tipo].sigla;
      return (!this.filtrarRequisicaoMaterial && !this.filtrarNotaFiscal)
        || (this.filtrarRequisicaoMaterial && (siglaTipo == this.tiposDocumentoControleEstoque.REQUISICAO_MATERIAL.sigla))
        || (this.filtrarNotaFiscal && (siglaTipo == this.tiposDocumentoControleEstoque.NOTA_FISCAL.sigla));
    },

    retornarCabecalhosListaDocumentos(metodo) {
      var colunaTipoDocumento = Object.assign({}, CABECALHOS_SELECAO_DOCUMENTOS.TIPO_DOCUMENTO);
      colunaTipoDocumento.filter = metodo;

      return [
        Object.assign({}, CABECALHOS_SELECAO_DOCUMENTOS.DATA_EMISSAO),
        Object.assign({}, CABECALHOS_SELECAO_DOCUMENTOS.DESCRICAO),
        Object.assign({}, CABECALHOS_SELECAO_DOCUMENTOS.DESCRICAO_ORIGEM),
        Object.assign({}, CABECALHOS_SELECAO_DOCUMENTOS.STATUS_DOCUMENTO),
        colunaTipoDocumento
      ];
    },

    carregarSetoresDaEmpresa(identificadorEmpresa) {
      this.carregandoSetores = true;
      apiEmpresa.localizarSetoresPorIdentificadorEmpresa(identificadorEmpresa)
      .then(setores => {
        this.setores = setores;
        this.carregandoSetores = false;
      })
      .catch(erro => {
        this.carregandoSetores = false;
        this.exibirMensagemErroFlutuante('Não foi possível obter os setores vinculados a empresa selecionada', erro);
      });
    },

    alternarSelecao(item, propriedades) {
      if (this.abaAtual == 'aba-separacao') {
        this.incluirRemoverItem(this.documentosSeparacaoSelecionados, item, propriedades.isSelected);
      } else {
        this.incluirRemoverItem(this.documentosConferenciaSelecionados, item, propriedades.isSelected);
      }
    },

    incluirRemoverItem(lista, item, selecionado) {
      if (selecionado) {
        lista.splice(lista.indexOf(item), 1);
      } else {
        lista.push(item);
      }
    },

    selecionarTodos() {
      if (this.abaAtual == 'aba-separacao') {
        this.documentosSeparacaoSelecionados = this.documentosSeparacaoVisiveis;
      } else {
        this.documentosConferenciaSelecionados = this.documentosConferenciaVisiveis;
      }
    },

    iniciarAcao() {
      if (!this.validarDocumentosSelecionados()) {
        this.criticarDocumentoEmAndamento();
        return;
      }

      this.carregandoAcao = true;
      var novaSelecao = this.criarSelecaoDeDocumentos();
      apiSelecaoDocumento.gravarSelecaoDeDocumentos(novaSelecao)
        .then(this.redirecionarParaAcaoSolicitada)
        .catch(this.informarErroAoGravar)
        .finally(() => this.carregandoAcao = false);
    },

    criarSelecaoDeDocumentos() {
      let usuarioLogado = ambiente.obterDadosDoUsuarioLogado();
      var novaSelecao = new SelecaoDeDocumentosModel({
        dataReferencia: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
        finalizada: false,
        documentos: (this.abaAtual == 'aba-separacao')
          ? this.documentosSeparacaoSelecionados : this.documentosConferenciaSelecionados,
        participantes: [
            new PessoaParticipanteControleDeEstoqueModel({
                funcionario: { identificador: usuarioLogado.identificadorFuncionario }
            })
        ],
        tipo: (this.abaAtual == 'aba-separacao') ? 'SEPARACAO' : 'CONFERENCIA'
      });
      return novaSelecao;
    },

    redirecionarParaAcaoSolicitada(resposta) {
      let separacaoGravada = resposta[0] || {};
      this.$router.push({
        name: (this.abaAtual == 'aba-separacao')
          ? ROTAS_ESTOQUE_METADATA.controleDeEstoqueSeparacao.name
          : ROTAS_ESTOQUE_METADATA.controleDeEstoqueConferencia.name,
        params: { identificador: separacaoGravada.identificador }
      });
    },

    informarErroAoGravar(erro) {
      this.exibirMensagemErroFlutuante(`Não foi possível iniciar a ${ (this.abaAtual == 'aba-separacao')
        ? 'separação' : 'conferência' }`, erro);
    },

    limparSelecao() {
      if (this.abaAtual == 'aba-separacao') {
        this.documentosSeparacaoSelecionados = [];
      } else {
        this.documentosConferenciaSelecionados = [];
      }
    },

    validarDocumentosSelecionados() {
      let pendente = this.statusDocumentoControleEstoque.PENDENTE;
      let parcial = this.statusDocumentoControleEstoque.CONCLUIDO_PARCIAL;
      let documentosSeparacaoValidos = (this.abaAtual == 'aba-separacao') && 
        this.documentosSeparacaoSelecionados.every(
          d => [pendente,parcial].includes(this.statusDocumentoControleEstoque[d.status]));
      let documentosConferenciaValidos = (this.abaAtual == 'aba-conferencia') &&
        this.documentosConferenciaSelecionados.every(
          d => [pendente,parcial].includes(this.statusDocumentoControleEstoque[d.status]));

      return documentosSeparacaoValidos || documentosConferenciaValidos;
    },

    criticarDocumentoEmAndamento() {
      let plural = ((this.abaAtual == 'aba-separacao') && (this.documentosSeparacaoSelecionados.length > 1))
          || ((this.abaAtual == 'aba-conferencia') && (this.documentosConferenciaSelecionados.length > 1));
        this.exibirMensagemErroFlutuante(
          `${ plural ? 'Algum dos documentos selecionados' : 'O documento selecionado' } já está em andamento.`);
    },

    ajustarTamanhoDaTabela() {
      this.$nextTick(() => {
        let tabela = (this.abaAtual == 'aba-separacao') ? 'tabela-documentos-separacao' : 'tabela-documentos-conferencia';
        var tabelaDocumentos = document.querySelector(`#${tabela}.v-data-table.contorno-tabela .v-data-table__wrapper`);
        let barraDeAcoes = document.querySelector(".footer-mobile");

        if ((!tabelaDocumentos) || (!barraDeAcoes))
          return;

        var tamanhoTabela = barraDeAcoes.getBoundingClientRect().top - tabelaDocumentos.getBoundingClientRect().top;
        this.alturaTabela = `${tamanhoTabela}px`;
      });
    },

    exibirMensagemErroFlutuante(titulo, erro) {
      var mensagem = { titulo: titulo };
      let mensagemErro = Array.isArray(erro) && erro[0] && erro[0].statusText;

      if (mensagemErro)
        mensagem = Object.assign(mensagem, { mensagem: mensagemErro });

      this.$mensagemFlutuante.aviso(mensagem);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep #tabela-documentos-separacao.v-data-table.contorno-tabela .v-data-table__wrapper,
::v-deep #tabela-documentos-conferencia.v-data-table.contorno-tabela .v-data-table__wrapper {
  height: var(--altura-tabela);
}

::v-deep .v-btn {
  margin: 6px;
}

::v-deep .v-data-table td, ::v-deep .v-data-table th {
  padding: 0 4px;
}

::v-deep .v-data-table td:last-child,
::v-deep .v-data-table th:last-child {
  display: none;
}

::v-deep .v-data-table tbody tr:not(.v-data-table__selected),
::v-deep .v-data-table tbody tr:hover:not(.v-data-table__selected):not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent;
}

::v-deep .v-data-table tbody tr.v-data-table__selected,
::v-deep .v-data-table tbody tr.v-data-table__selected:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #BBDEFB;
}

::v-deep .v-tabs-items,
::v-deep .v-tabs-items .v-tabs-item {
    width: 100%;
}

@import '~vuetify/src/styles/styles.sass';
@media #{map-get($display-breakpoints, 'xs-only')} {
  ::v-deep .coluna-data-emissao {
    width: 80px
  }

  ::v-deep .coluna-descricao {
    width: 90px
  }

  ::v-deep .coluna-status {
    width: 68px
  }
}

@media #{map-get($display-breakpoints, 'sm-and-up')} {
  ::v-deep .coluna-data-emissao {
    width: 160px
  }
}

::v-deep .footer-mobile {
  z-index: 12;
  padding: 0 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: $white;
  text-align: right;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.14),
              0 -3px 5px 0 rgba(0,0,0,.12);
}

::v-deep input[type="color"],
::v-deep input[type="date"],
::v-deep input[type="datetime"],
::v-deep input[type="datetime-local"],
::v-deep input[type="email"],
::v-deep input[type="month"],
::v-deep input[type="number"],
::v-deep input[type="password"],
::v-deep input[type="search"],
::v-deep input[type="tel"],
::v-deep input[type="text"],
::v-deep input[type="time"],
::v-deep input[type="url"],
::v-deep input[type="week"],
::v-deep select:focus,
::v-deep textarea {
  font-size: 16px;
}
</style>