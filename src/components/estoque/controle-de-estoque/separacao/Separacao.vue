<template>
  <v-app id="separacao">
    <v-container fluid fill-height>

      <v-row class="no-gutters linha-filtros">
        <v-col>
          <v-select
            :items="this.separacao.documentos"
            v-model="descricaoDocumentoFiltrado"
            item-text="descricao"
            item-value="descricao"
            clearable
            dense
            :menu-props="{ offsetY: true }"
            label="Filtro"
          >
            <template v-slot:selection="{ item }">
              <v-chip
                label
                x-small
                :color="tiposDocumentoControleEstoque[item.tipo].cor"
              >{{ item.descricao }}</v-chip>
            </template>
            <template v-slot:item="{ item }">
              <v-chip
                label
                small
                :color="tiposDocumentoControleEstoque[item.tipo].cor"
              >{{ item.descricao }}</v-chip>
            </template>
          </v-select>
        </v-col>

        <v-col class="text-right">
          <lista-participantes
            v-model="separacao.participantes"
          ></lista-participantes>
        </v-col>
      </v-row>

      <v-row :class="`${$vuetify.breakpoint.smAndDown ? 'no-gutters' : ''}`">
        <v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
          <v-data-table
            id="tabela-produtos"
            class="contorno-tabela"
            :headers="cabecalhosProdutosAgrupados"
            sort-by="produto.codigo"
            v-model="produtosAgrupadosSelecionados"
            @current-items="(itensVisiveis) => produtosAgrupadosVisiveis = itensVisiveis"
            :items="produtosAgrupados"
            item-key="produto.identificador"
            loading-text="Carregando, aguarde"
            :fixed-header="true"
            :disable-pagination="true"
            :hide-default-footer="true"
            :mobile-breakpoint="0"
            :single-select="true"
            :search="descricaoDocumentoFiltrado"
            @click:row="linhaProdutosAgrupadosClick"
            :height="alturaTabela"
          >
            <template v-slot:item.produtoCodigo="{ item: acumulado }">
              {{ acumulado.codigo }}
            </template>

            <template v-slot:item.produtoNome="{ item: acumulado }">
              {{ acumulado.nome }}
            </template>

            <template v-slot:item.itens="{ item: acumulado }">
              {{ retornarStatusParaProdutoAgrupado(acumulado.itens) }}
            </template>

            <template v-slot:no-data>
              <v-flex class="text-center">
                <v-progress-circular :size="30" color="primary" indeterminate></v-progress-circular>
              </v-flex>
            </template>
          </v-data-table>
        </v-col>

        <v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
          <v-data-table
            id="tabela-itens-documentos"
            class="contorno-tabela fill-height"
            :headers="cabecalhosItensDocumentos"
            sort-by="documento.descricao"
            v-model="itensDocumentosSelecionados"
            @current-items="(itensVisiveis) => itensDocumentosVisiveis = itensVisiveis"
            :items="itensDocumentos"
            item-key="item.identificador"
            loading-text="Carregando, aguarde"
            no-data-text="Selecione um produto"
            :fixed-header="true"
            :disable-pagination="true"
            :hide-default-footer="true"
            :mobile-breakpoint="0"
            :search="descricaoDocumentoFiltrado"
            :custom-filter="filtrarItemDocumento"
            @click:row="linhaItensDocumentosClick"
            :height="alturaTabela"
          >
            <template v-slot:item.descricao="{ item }">
              <v-chip
                label
                small
                :color="tiposDocumentoControleEstoque[item.documento.tipo].cor"
              >{{ item.documento.descricao }}</v-chip>
            </template>

            <template
              v-slot:item.quantidadeInformada="{ item: itemDocumento }"
            >{{ itemDocumento.item.movimentos.reduce((total, m) => total += m.quantidade, 0) }}</template>

            <template v-slot:item.itemStatus="{ item: itemDocumento }"
            >{{ statusItemDocumentoControleEstoque[itemDocumento.item.status].descricao }}</template>

            <template v-slot:body.append v-if="itensDocumentosVisiveis.length">
              <tr class="rodape-somatorio">
                <td class="text-center">Total:</td>
                <td class="text-center">{{ totalPedido }}</td>
                <td class="text-center">{{ totalInformado }}</td>
                <td></td>
                <td></td>
              </tr>
            </template>

            <template v-slot:no-data>
              <v-flex class="text-center">
                <span>Selecione um produto</span>
              </v-flex>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="barra-de-acoes">
        <v-col class="text-right">
          <v-btn
            class="btn-primary"
            text
            :block="$vuetify.breakpoint.xsOnly"
            @click="finalizarSeparacao"
            :disabled="!permiteFinalizar"
          >Finalizar</v-btn>
        </v-col>
      </v-row>

      <item-separacao
        v-model="itemDocumento.item"
        :documento="itemDocumento.documento"
        :abrirJanela="exibirDetalhes"
        :botaoAnteriorHabilitado="botaoItemDocumentoAnteriorHabilitado"
        :botaoProximoHabilitado="botaoProximoItemDocumentoHabilitado"
        @onAnteriorClick="anteriorItemDocumentoClick"
        @onProximoClick="proximoItemDocumentoClick"
        @fecharJanela="() => exibirDetalhes = false"
      ></item-separacao>
    </v-container>
  </v-app>
</template>

<script>
import { ROTAS_ESTOQUE_METADATA } from '@/constants/router/estoque-router-constants';
import {
  TIPOS_DOCUMENTO_CONTROLE_ESTOQUE,
  STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE
} from "@/constants/estoque/controle-de-estoque/selecao-documentos-constants";
import {
  CABECALHOS_PRODUTOS_AGRUPADOS,
  CABECALHOS_ITENS_DOCUMENTOS
  } from "@/constants/estoque/controle-de-estoque/separacao-constants";
import apiSelecaoDocumento from "@/api/estoque/controle-de-estoque/selecao-documento-api";
import apiDocumentoControleEstoque from "@/api/estoque/controle-de-estoque/documento-controle-estoque-api";
import SelecaoDeDocumentosModel from '@/models/estoque/controle-de-estoque/selecao-documento-model';
import ItemDocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/item-documento-controle-estoque-model';
import DocumentoControleEstoqueModel from '@/models/estoque/controle-de-estoque/documento-controle-estoque-model';
import ListaParticipantes from "@/components/estoque/controle-de-estoque/comum/ListaParticipantes.vue";
import ItemSeparacao from "@/components/estoque/controle-de-estoque/separacao/ItemSeparacao.vue"
import separacaoMixin from "@/mixins/estoque/controle-de-estoque/separacao-mixin.js";

export default {
  name: "Separacao",
  components: {
    ListaParticipantes,
    ItemSeparacao
  },

  mixins: [separacaoMixin],

  data() {
    return {
      separacao: new SelecaoDeDocumentosModel(),
      assinaturaNotificacoes: undefined,
      participantesAnteriores: [],
      revertendoParticipantes: false,
      descricaoDocumentoFiltrado: undefined,
      produtosAgrupados: [],
      produtosAgrupadosSelecionados: [],
      produtosAgrupadosVisiveis: [],
      itensDocumentos: [],
      itensDocumentosSelecionados: [],
      itensDocumentosVisiveis: [],
      itemDocumento: { documento: new DocumentoControleEstoqueModel(), item: new ItemDocumentoControleEstoqueModel() },
      exibirDetalhes: false,
      botaoItemDocumentoAnteriorHabilitado: true,
      botaoProximoItemDocumentoHabilitado: true,
      tiposDocumentoControleEstoque: TIPOS_DOCUMENTO_CONTROLE_ESTOQUE,
      statusItemDocumentoControleEstoque: STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE,
      cabecalhosProdutosAgrupados: CABECALHOS_PRODUTOS_AGRUPADOS,
      cabecalhosItensDocumentos: this.retornarCabecalhosItensDocumentos(),
      alturaTabela: 300,
      permiteFinalizar: true
    };
  },

  computed: {
    totalPedido() {
      return this.itensDocumentosVisiveis.reduce((total, itemDocumento) => total += itemDocumento.item.quantidade, 0);
    },

    totalInformado() {
      return this.itensDocumentosVisiveis.reduce((total, itemDocumento) =>
        total += itemDocumento.item.movimentos.reduce((total, m) => total += m.quantidade, 0), 0);
    }
  },

  watch: {
    '$vuetify.breakpoint.mdAndUp'() {
      this.ajustarTamanhoDaTabela();
    },

    itemDocumento() {
      this.$nextTick(() => { //espera o item carregar na interface para depois atualizar os botões.
        this.botaoItemDocumentoAnteriorHabilitado = this.habilitarBotaoItemDocumentoAnterior();
        this.botaoProximoItemDocumentoHabilitado = this.habilitarBotaoProximoItemDocumento();
      });
    },

    exibirDetalhes() {
      if (!this.exibirDetalhes)
        this.itensDocumentosSelecionados = [];
    },

    'separacao.participantes'() {
      if (this.revertendoParticipantes) return;

      if (!this.participantesAnteriores.length) {
        // Faz uma cópia da lista, sem manter a referência.
        this.participantesAnteriores = [...(this.separacao.participantes)];

        // O primeiro participante é o próprio funcionário que criou a seleção.
        // Se não haviam participantes anteriores, não precisa notificar.
        return;
      }

      this.notificarParticipanteConvidado();
    }
  },

  created() {
    apiSelecaoDocumento.obterSelecoesDeDocumentos(this.$route.params.identificador)
    .then(resposta => {
      this.separacao = (Array.isArray(resposta) && !!resposta.length && resposta[0]) || new SelecaoDeDocumentosModel();
      if (this.separacao.finalizada || !this.separacao.participantes.length)
        throw "Não abrir uma separação finalizada ou sem participantes.";
      this.listarItensSeparacao();
    })
    .catch(() => {
      this.$mensagemFlutuante.erro({
        titulo: `Não foi possível abrir a separação solicitada.`
      });
      this.$router.push({ name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueDocumentos.name });
    });

    this.assinarNotificacoesMovimentos();
  },

  mounted() {
    this.ajustarTamanhoDaTabela();
  },

  beforeRouteLeave(destino, origem, next) {
    if (this.assinaturaNotificacoes) {
      this.assinaturaNotificacoes.unsubscribe();
      window.removeEventListener('beforeunload', this.assinaturaNotificacoes.unsubscribe, false);
    }
    next();
  },

  methods: {
    assinarNotificacoesMovimentos() {
      this.$nextTick(() => {
        this.assinaturaNotificacoes = apiDocumentoControleEstoque.assinarNotificacoesMovimentos(this.movimentoAtualizado);
        window.addEventListener('beforeunload', this.assinaturaNotificacoes.unsubscribe, false);
      });
    },

    movimentoAtualizado(notificacao) {
      let movimentoAtualizado = notificacao && notificacao.movimentoItemDocumentoControleEstoqueAtualizado;

      if (!movimentoAtualizado) return;

      var documento = this.separacao.documentos.find(d => (d.identificador == movimentoAtualizado.identificadorDocumento)
        && (d.tipo == movimentoAtualizado.tipoDocumento));
      var item = documento && documento.itens.find(i => i.identificador == movimentoAtualizado.identificadorItem);

      if (!item) return;

      let indiceMovimento = item.movimentos.findIndex(m => m.identificador == movimentoAtualizado.movimento.identificador);

      if (indiceMovimento > -1) {
        item.movimentos[indiceMovimento] = movimentoAtualizado.movimento;
      } else {
        item.movimentos.push(movimentoAtualizado.movimento);
      }

      this.atualizarStatusItem(item);
    },

    listarItensSeparacao() {
      if (!this.separacao || !Array.isArray(this.separacao.documentos))
        this.produtosAgrupados = [];

      this.itensDocumentos = this.separacao.documentos.reduce(
        (lista, documento) => lista.concat(
          documento.itens.map(item => ({ documento: documento, item: item })) //TODO: Criar um modelo para o grid
        ), []);

      this.produtosAgrupados = this.itensDocumentos.reduce(
        (lista, itemDocumento) => {
          let indice = lista.findIndex(i => i.produto.identificador == itemDocumento.item.produto.identificador);

          if (indice == -1) {
            return lista.concat({ //TODO: Criar um modelo para o grid
              produto: itemDocumento.item.produto,
              itens: [itemDocumento.item],
              descricao: itemDocumento.documento.descricao
            })
          } else {
            // Incrementa a descrição acumulada para permitir pesquisar pelos documentos agrupados por produto.
            lista[indice].descricao += `|${itemDocumento.documento.descricao}`;

            // Armazena o item para poder atualizar o status agrupado por produto.
            lista[indice].itens.push(itemDocumento.item);
            return lista;
          }
        }, []);
    },

    retornarStatusParaProdutoAgrupado(itens) {
      var totalQuantidades = itens.reduce((total, item) => total + item.quantidade, 0);
      var totalMovimentos = itens.reduce(
        (totalItens, item) => totalItens + item.movimentos.reduce(
          (totalMovimento, movimento) => totalMovimento + movimento.quantidade, 0
        ), 0
      );
      if (totalMovimentos == 0) return 'Pendente';
      if (totalMovimentos == totalQuantidades) return 'Atendido totalmente';
      return 'Atendido parcial';
    },

    retornarCabecalhosItensDocumentos() {
      var colunaOcultaIdentificadorProduto = Object.assign({}, CABECALHOS_ITENS_DOCUMENTOS.IDENTIFICADOR_PRODUTO);
      colunaOcultaIdentificadorProduto.filter = (identificador) => identificador == (this.produtosAgrupadosSelecionados[0]
        && this.produtosAgrupadosSelecionados[0].produto
        && this.produtosAgrupadosSelecionados[0].produto.identificador);

      return [
        Object.assign({}, CABECALHOS_ITENS_DOCUMENTOS.DESCRICAO),
        Object.assign({}, CABECALHOS_ITENS_DOCUMENTOS.QUANTIDADE),
        Object.assign({}, CABECALHOS_ITENS_DOCUMENTOS.QUANTIDADE_INFORMADA),
        Object.assign({}, CABECALHOS_ITENS_DOCUMENTOS.STATUS),
        colunaOcultaIdentificadorProduto
      ];
    },

    linhaProdutosAgrupadosClick(produtoAgrupado) {
      this.produtosAgrupadosSelecionados = [produtoAgrupado];
      this.itensDocumentosSelecionados = [];
    },

    filtrarItemDocumento(_, pesquisa, itemDocumento) {
      return (!pesquisa) || (itemDocumento.documento.descricao == pesquisa);
    },

    linhaItensDocumentosClick(itemDocumento) {
      this.itensDocumentosSelecionados = [itemDocumento];
      this.itemDocumento = itemDocumento;
      this.exibirDetalhes = true;
    },

    ajustarTamanhoDaTabela() {
      this.$nextTick(() => {
        // let alturaTela = document.querySelector('.v-application--wrap').getBoundingClientRect().height;
        let alturaTela = window.innerHeight;

        if (!alturaTela)
          return;

        let alturaLinhaFiltros = document.querySelector('.linha-filtros').getBoundingClientRect().height || 56;
        let alturaLinhaFinalizar = document.querySelector('.barra-de-acoes').getBoundingClientRect().height || 72;
        let alturaToolbar = 50;
        let paddingContainer = 12 + 12;

        this.alturaTabela = (
          (alturaTela - alturaToolbar - alturaLinhaFiltros - alturaLinhaFinalizar)
          / (this.$vuetify.breakpoint.mdAndUp ? 1 : 2)
        ) - paddingContainer;
      });
    },

    habilitarBotaoItemDocumentoAnterior() {
      return (this.retornarIndiceItemDocumentoAtual() > 0) || (this.retornarIndiceProdutoAgrupadoAtual() > 0);
    },

    habilitarBotaoProximoItemDocumento() {
      return (this.retornarIndiceItemDocumentoAtual() < this.itensDocumentosVisiveis.length - 1) ||
        (this.retornarIndiceProdutoAgrupadoAtual() < this.produtosAgrupadosVisiveis.length - 1);
    },

    anteriorItemDocumentoClick() {
      let indice = this.retornarIndiceItemDocumentoAtual();

      if (indice > 0) {
        this.itemDocumento = this.itensDocumentosVisiveis[indice - 1];
        this.itensDocumentosSelecionados = [this.itemDocumento];
      } else {
        this.selecionarProdutoAgrupadoVisivelAnterior() && this.selecionarUltimoItemDocumentoVisivel();
      }
    },

    proximoItemDocumentoClick() {
      let indice = this.retornarIndiceItemDocumentoAtual();

      if (indice < this.itensDocumentosVisiveis.length - 1) {
        this.itemDocumento = this.itensDocumentosVisiveis[indice + 1];
        this.itensDocumentosSelecionados = [this.itemDocumento];
      } else {
        this.selecionarProximoProdutoAgrupadoVisivel() && this.selecionarPrimeiroItemDocumentoVisivel();
      }
    },

    selecionarPrimeiroItemDocumentoVisivel() {
      this.$nextTick(() => { // aguarda o produto atualizar os itens através do filtro do cabeçalho.
        this.itensDocumentosSelecionados = [this.itensDocumentosVisiveis[0]];
        this.itemDocumento = this.itensDocumentosSelecionados[0];
      });
    },

    selecionarUltimoItemDocumentoVisivel() {
      this.$nextTick(() => { // aguarda o produto atualizar os itens através do filtro do cabeçalho.
        this.itensDocumentosSelecionados = [this.itensDocumentosVisiveis[this.itensDocumentosVisiveis.length - 1]];
        this.itemDocumento = this.itensDocumentosSelecionados[0];
      });
    },

    selecionarProdutoAgrupadoVisivelAnterior() {
      let indice = this.retornarIndiceProdutoAgrupadoAtual();

      if (indice > 0) {
        this.produtosAgrupadosSelecionados = [this.produtosAgrupadosVisiveis[indice - 1]];
        return true;
      }

      return false;
    },

    selecionarProximoProdutoAgrupadoVisivel() {
      let indice = this.retornarIndiceProdutoAgrupadoAtual();

      if (indice < this.produtosAgrupadosVisiveis.length - 1) {
        this.produtosAgrupadosSelecionados = [this.produtosAgrupadosVisiveis[indice + 1]];
        return true;
      }

      return false;
    },

    retornarIndiceItemDocumentoAtual() {
      return this.itensDocumentosVisiveis.findIndex(i =>
        (i.documento.identificador == this.itemDocumento.documento.identificador) &&
        (i.item.identificador == this.itemDocumento.item.identificador)
      );
    },

    retornarIndiceProdutoAgrupadoAtual() {
      return this.produtosAgrupadosVisiveis.findIndex(p =>
        (p.produto.identificador == this.produtosAgrupadosSelecionados[0].produto.identificador)
      );
    },

    notificarParticipanteConvidado() {
      let novoParticipante = this.separacao.participantes.find(
        p => !this.participantesAnteriores.some(
          pa => pa.funcionario.identificador == p.funcionario.identificador))
      apiSelecaoDocumento.incluirParticipanteNaSelecao(
        this.separacao.identificador,
        novoParticipante.funcionario.identificador)
        .then(() => {
          this.$mensagemFlutuante.sucesso({
            titulo: 'Convite enviado!',
            mensagem: 'O funcionário receberá uma notificação assim que entrar no sistema.'
          });
          // Faz uma cópia da lista, sem manter a referência.
          this.participantesAnteriores = [...(this.separacao.participantes)];
        })
        .catch(erro => {
          this.$mensagemFlutuante.erro({
            titulo: 'Não foi possível convidar o participante.',
            mensagem: Array.isArray(erro) && erro[0] && erro[0].statusText
          });
          this.revertendoParticipantes = true;
          // Faz uma cópia da lista, sem manter a referência.
          this.separacao.participantes = [...(this.participantesAnteriores)];
          this.revertendoParticipantes = false;
        });
    },

    finalizarSeparacao() {
      this.permiteFinalizar = false;
      apiSelecaoDocumento.finalizarSelecaoDeDocumentos(this.separacao.identificador)
      .then(() => {
        this.$mensagemFlutuante.sucesso({ titulo: 'Separação concluída' });
        this.$router.push({ name: ROTAS_ESTOQUE_METADATA.controleDeEstoqueDocumentos.name });
      })
      .catch(erro => {
        this.$mensagemFlutuante.erro({
          titulo: 'Não foi possível finalizar a separação',
          mensagem: Array.isArray(erro) && erro[0] && erro[0].statusText,
          onClose: () => this.permiteFinalizar = true
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-btn {
  margin: 6px;
}

::v-deep .v-data-table.tabela-itens-documentos .v-chip {
  padding: 0 4px 0 4px;
}

::v-deep .v-data-table td:last-child,
::v-deep .v-data-table th:last-child {
  display: none;
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

::v-deep .rodape-somatorio td {
  position: sticky;
  bottom: 0;
  background-color: white;
  border-top: thin solid rgba(0,0,0,.12);
  box-shadow: 0px 0px 5px -3px rgba(0, 0, 0, 0.12);
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