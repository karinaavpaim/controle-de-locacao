<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    v-model="exibirJanela"
  >
    <v-card>
      <v-row class="no-gutters">
        <v-col
          class="align-self-center"
          :cols="$vuetify.breakpoint.smAndUp ? 4 : 12"
        >
          <v-img
            :src="imagemProdutoSelecionado"
            :key="chaveImagemProduto"
            :height="$vuetify.breakpoint.xsOnly ? 100 : 200"
            contain
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-icon
                  x-large
                  color="orange"
                >mdi-dolly</v-icon>
              </v-row>
            </template>
          </v-img>
          <v-progress-linear
            :active="carregandoImagemProduto"
            indeterminate
          ></v-progress-linear>
        </v-col>

        <v-col
          class="destaque-card-produto"
          :cols="$vuetify.breakpoint.smAndUp ? 8 : 12"
        >
          <v-card-title class="destaque-nome-produto">
            <div class="overline">{{ item.produto && item.produto.codigoNome }}</div>
          </v-card-title>
          <v-card-text class="mt-2">
            <v-row>
              <v-col class="pb-0">
                <v-select
                  :items="[documento]"
                  v-model="documento"
                  item-text="descricao"
                  label="Documento"
                  append-icon
                  readonly
                  dense
                  class="somente-leitura"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip
                      label
                      x-small
                      :color="tiposDocumentoControleEstoque[item.tipo].cor"
                    >{{ item.descricao }}</v-chip>
                  </template>
                </v-select>
              </v-col>

              <v-col class="pb-0">
                <v-text-field
                  label="Solicitante"
                  v-model="solicitante"
                  readonly
                  dense
                  class="somente-leitura"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pb-0">
                <v-text-field
                  label="Unidade"
                  v-model="unidadeProduto"
                  readonly
                  dense
                  class="somente-leitura"
                ></v-text-field>
              </v-col>

              <v-col class="pb-0">
                <v-text-field
                  label="Solicitado"
                  v-model="item.quantidade"
                  readonly
                  dense
                  class="somente-leitura"
                ></v-text-field>
              </v-col>

              <v-col cols="4" class="pb-0">
                <v-text-field
                  label="Pendente"
                  v-model="quantidadePendente"
                  append-icon="mdi-arrow-right"
                   @click:append="informarQuantidadePendente"
                  readonly
                  dense
                  class="somente-leitura"
                ></v-text-field>
              </v-col>

              <v-col cols="3" class="pb-0">
                <v-text-field
                  label="Informado"
                  v-model="quantidadeInformada"
                  :error="quantidadeInformada > (quantidadePendente && (controleLoteSerie == 'SERIE') ? 1 : quantidadePendente)"
                  :disabled="!quantidadePendente"
                  min="0"
                  type="number"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="justify-space-around no-gutters">
              <v-col
                class="pb-0"
                cols="8"
                v-if="controleLoteSerie != 'NENHUM'"
              >
                <pesquisa-produto-lote-serie
                  :label="(controleLoteSerie == 'LOTE') ? 'Lote' : 'Série'"
                  class="pt-3"
                  dense
                  v-model="loteSerie"
                  :identificador-produto="identificadorProduto"
                  :identificador-setor-requisitado="identificadorSetorRequisitado"
                ></pesquisa-produto-lote-serie>
              </v-col>
              <v-col :class="((controleLoteSerie == 'NENHUM') ? '' : 'col-4') + ' pb-0'">
                <v-btn
                  :class="`btn-primary ${(controleLoteSerie == 'NENHUM') ? 'ml-0' : ''}`"
                  text
                  :block="controleLoteSerie == 'NENHUM'"
                  :disabled="!permitirRegistrar"
                  @click="registrarMovimento"
                >Registrar</v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="py-0">
                <v-data-table
                  id="tabela-movimentos"
                  class="contorno-tabela"
                  :headers="cabecalhosMovimentos"
                  sort-by="identificador"
                  :items="item.movimentos"
                  loading-text="Carregando, aguarde"
                  :fixed-header="true"
                  :disable-pagination="true"
                  :hide-default-footer="true"
                  :mobile-breakpoint="0"
                  height="200"
                >
                  <template
                    v-slot:item.loteSerie="{ item }"
                  >{{ (item.lote && item.lote.codigo) || (item.serie && item.serie.codigo) || '-' }}</template>

                  <template v-slot:item.responsavel="{ item }">
                    <v-avatar
                      size="36"
                      color="blue"
                    >
                      <v-img
                        v-if="item.responsavel && item.responsavel.foto"
                        :src="item.responsavel && item.responsavel.foto"
                        max-height="36px"
                        max-width="36px"
                        class="borda-avatar"
                      ></v-img>
                      <span
                        v-else
                        class="white--text"
                      >{{ (item.responsavel && item.responsavel.nome && item.responsavel.nome.substring(0, 2)) || 'SN' }}</span>
                    </v-avatar>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions :class="$vuetify.breakpoint.xsOnly ? 'justify-space-around' : 'justify-end'">
            <v-btn
              class="btn-primary"
              text
              :disabled="!botaoAnteriorHabilitado"
              @click="onAnteriorClick"
            >Anterior</v-btn>
            <v-btn
              class="btn-primary"
              text
              :disabled="!botaoProximoHabilitado"
              @click="onProximoClick"
            >Próximo</v-btn>
            <v-btn
              class="btn-secondary"
              text
              @click="fecharJanela"
            >Fechar</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  TIPOS_DOCUMENTO_CONTROLE_ESTOQUE
} from "@/constants/estoque/controle-de-estoque/selecao-documentos-constants";
import { CABECALHOS_MOVIMENTOS } from "@/constants/estoque/controle-de-estoque/separacao-constants";
import PesquisaProdutoLoteSerie from "@/components/estoque/PesquisaProdutoLoteSerie";
import MovimentoItemDocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/movimento-item-documento-controle-estoque-model';
import MovimentoItemDocumentoControleEstoqueAtualizadoModel from "@/models/estoque/controle-de-estoque/movimento-item-documento-controle-estoque-atualizado-model";
import ItemDocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/item-documento-controle-estoque-model';
import DocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/documento-controle-estoque-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import apiProduto from "@/api/estoque/produto-api";
import apiPessoa from "@/api/sistemas-gerais/pessoa-api";
import apiDocumentoControleEstoque from "@/api/estoque/controle-de-estoque/documento-controle-estoque-api";
import separacaoMixin from "@/mixins/estoque/controle-de-estoque/separacao-mixin.js";
import * as ambiente from "../../../../../vue.enviroment.config";

export default {
  name: "ItemSeparacao",
  components: {
    PesquisaProdutoLoteSerie
  },

  mixins: [separacaoMixin],

  computed: {
    identificadorSetorRequisitado() {
      return this.documento && this.documento.setorOrigem && this.documento.setorOrigem.identificador;
    },

    solicitante() {
      return this.documento.setorOrigem && this.documento.setorOrigem.descricao;
    },

    unidadeProduto() {
      return this.item.produto && this.item.produto.unidade && this.item.produto.unidade.sigla;
    },

    controleLoteSerie() {
      return this.item.produto && this.item.produto.controleLoteSerie;
    },

    quantidadePendente() {
      return this.item.quantidade - this.item.movimentos.reduce((total, m) => total += m.quantidade, 0);
    },

    permitirRegistrar() {
      return (this.quantidadeInformada > 0) &&
        (this.quantidadeInformada <= this.quantidadePendente) &&
        (this.loteSerie || (this.controleLoteSerie == 'NENHUM'));
    }
  },

  data() {
    return {
      exibirJanela: false,
      identificadorProduto: undefined,
      carregandoImagemProduto: false,
      chaveImagemProduto: 0,
      imagemProdutoSelecionado: undefined,
      tiposDocumentoControleEstoque: TIPOS_DOCUMENTO_CONTROLE_ESTOQUE,
      cabecalhosMovimentos: CABECALHOS_MOVIMENTOS,
      loteSerie: undefined,
      quantidadeInformada: 0,
      responsavelAtual: undefined,
      responsavelAtualSimplificado: undefined
    };
  },

  model: {
    prop: "item",
    event: "onUpdate"
  },

  props: {
    item: {
      type: ItemDocumentoControleEstoqueModel,
      required: true
    },
    documento: {
      type: DocumentoControleEstoqueModel,
      default: new DocumentoControleEstoqueModel()
    },
    abrirJanela: {
      type: Boolean,
      default: false
    },
    botaoAnteriorHabilitado: {
      type: Boolean,
      default: true
    },
    botaoProximoHabilitado: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    item() {
      this.atualizarImagensDosParticipantesNosMovimentos();

      if (this.identificadorProduto == this.item.produto.identificador)
        return;

      this.identificadorProduto = this.item.produto.identificador;
      this.carregarImagemProdutoAtual();
    },

    'item.movimentos'() {
      this.atualizarImagensDosParticipantesNosMovimentos();
    },

    abrirJanela(valor) {
      if (valor)
        this.exibirJanela = true;
    }
  },

  methods: {
    obterResponsavelAtualSimplificado() {
        if (this.responsavelAtualSimplificado)
          return this.responsavelAtualSimplificado;

        let usuarioLogado = ambiente.obterDadosDoUsuarioLogado();
        this.responsavelAtualSimplificado = { identificador: usuarioLogado.identificadorFuncionario };
        return this.responsavelAtualSimplificado;
    },

    obterResponsavelAtual() {
      if (this.responsavelAtual)
        return this.responsavelAtual;

      let usuarioLogado = ambiente.obterDadosDoUsuarioLogado();
      this.responsavelAtual = new PessoaModel({ identificador: usuarioLogado.identificadorFuncionario });
      this.obterDadosDoResponsavel(this.responsavelAtual);

      return this.responsavelAtual;
    },

    obterDadosDoResponsavel(responsavel) {
      apiPessoa.localizarPessoaComFoto(responsavel.identificador)
        .then(pessoas => {
          let pessoa = Array.isArray(pessoas) && pessoas[0];
          responsavel.foto = pessoa.foto;
          responsavel.nome = pessoa.nome;
        })
        .catch(() => {}); // Não apresentar erro.
    },

    atualizarImagensDosParticipantesNosMovimentos() {
      if (!this.item.movimentos.length)
        return;

      this.item.movimentos.forEach(
        m => m.responsavel && !m.responsavel.foto && this.atualizarImagemDoParticipante(m));
    },

    atualizarImagemDoParticipante(movimento) {
      let responsavelAtual = this.obterResponsavelAtual();

      if (movimento.responsavel.identificador == responsavelAtual.identificador) {
        movimento.responsavel = responsavelAtual;
        return;
      }

      let cache = this.item.movimentos.find(m => m.responsavel.foto
        && (m.responsavel.identificador == movimento.responsavel.identificador));

      if (cache && cache.responsavel) {
        movimento.responsavel = cache.responsavel;
        return;
      }

      this.obterDadosDoResponsavel(movimento.responsavel);
    },

    carregarImagemProdutoAtual() {
      this.chaveImagemProduto++; // Atualiza a imagem para exibir o placeholder
      this.imagemProdutoSelecionado = undefined;
      this.carregandoImagemProduto = true;
      apiProduto.obterImagensProduto(this.identificadorProduto)
        .then(this.exibirImagemProdutoAtual)
        .finally(() => this.carregandoImagemProduto = false);
    },

    exibirImagemProdutoAtual(imagens) {
      this.imagemProdutoSelecionado =
        (Array.isArray(imagens) && !!imagens.length && imagens[0].conteudo) || undefined;
    },

    registrarMovimento() {
      let registro = this.obterDadosParaRegistrarNovoMovimento();
      apiDocumentoControleEstoque.incluirDocumentoControleEstoqueItemMovimento(registro)
        .then(resposta => {
          let movimentoRegistrado = (Array.isArray(resposta) && resposta[0]) || {};

          movimentoRegistrado
            && movimentoRegistrado.identificador
            && !this.item.movimentos.some(m => m.identificador == movimentoRegistrado.identificador)
            && this.item.movimentos.push(movimentoRegistrado);

          this.atualizarStatusItem(this.item);
          this.quantidadeInformada = 0;
          this.loteSerie = undefined;
        })
        .catch(this.notificarErroDeRegistro);
    },

    obterDadosParaRegistrarNovoMovimento() {
      let movimento = new MovimentoItemDocumentoControleEstoqueModel({
        lote: (this.controleLoteSerie == 'LOTE') ? this.loteSerie : undefined,
        serie: (this.controleLoteSerie == 'SERIE') ? this.loteSerie : undefined,
        quantidade: Number(this.quantidadeInformada),
        responsavel: this.obterResponsavelAtualSimplificado() // não enviar o responsável com foto.
      });

      return new MovimentoItemDocumentoControleEstoqueAtualizadoModel({
        identificadorDocumento: this.documento.identificador,
        tipoDocumento: this.documento.tipo,
        identificadorItem: this.item.identificador,
        movimento: movimento
      });
    },

    notificarErroDeRegistro(erro) {
      this.$mensagemFlutuante.erro({
        titulo: "Não foi possível registrar",
        mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || (erro && erro.statusText) || erro
      });
    },

    informarQuantidadePendente() {
      this.quantidadeInformada = (this.controleLoteSerie == 'SERIE') && this.quantidadePendente
        ? 1
        : this.quantidadePendente;
    },

    limparCampos() {
      this.loteSerie = undefined;
      this.quantidadeInformada = 0;
    },

    onAnteriorClick() {
      this.limparCampos();
      this.$emit('onAnteriorClick');
    },

    onProximoClick() {
      this.limparCampos();
      this.$emit('onProximoClick');
    },

    fecharJanela() {
      this.limparCampos();
      this.exibirJanela = false;
      this.$emit('fecharJanela');
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .borda-avatar {
  border:1px solid blue;
}

::v-deep .v-btn {
  margin: 6px;
}

::v-deep .somente-leitura.v-text-field > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections {
  cursor: default;
}

::v-deep .somente-leitura.v-text-field > .v-input__control > .v-input__slot:before,
::v-deep .somente-leitura.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}

::v-deep .v-data-table td, ::v-deep .v-data-table th {
  padding: 0 4px;
}

::v-deep .v-data-table tbody tr:not(.v-data-table__selected),
::v-deep .v-data-table tbody tr:hover:not(.v-data-table__selected):not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent;
}

::v-deep .v-data-table tbody tr.v-data-table__selected,
::v-deep .v-data-table tbody tr.v-data-table__selected:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #BBDEFB;
}

::v-deep .destaque-nome-produto {
  border-top: thin solid rgba(0,0,0,.12);
  border-bottom: thin solid rgba(0,0,0,.12);
}

::v-deep .rodape-somatorio td {
  position: sticky;
  bottom: 0;
  background-color: white;
  border-top: thin solid rgba(0,0,0,.12);
  box-shadow: 0px 0px 5px -3px rgba(0, 0, 0, 0.12);
}

@import '~vuetify/src/styles/styles.sass';
@media #{map-get($display-breakpoints, 'sm-and-up')} {
  ::v-deep .destaque-card-produto {
    border-left: thin solid rgba(0,0,0,.12);
  }
}

::v-deep input[type=number]::-webkit-inner-spin-button {
    opacity: 1;
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