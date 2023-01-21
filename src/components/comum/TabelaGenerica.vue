<!-- eslint-disable vue/require-v-for-key -->
<template>
  <v-flex :id="id">
    <v-flex v-if="!!titulo && exibirTitulo">
      <h2 class="h2-padrao">
        {{titulo}}
      </h2>
    </v-flex>

    <div class="bloco-sem-dados" v-if="!temItensParaExibir && exibirBlocoSemDados">
      <slot name="sem-dados">
        <v-flex mt-5 xs12 v-if="(!itensTabela || itensTabela.length == 0)">
          <v-layout wrap class="card-no-data py-12">
            <v-flex xs12>
              <v-icon class="ma-1">error_outline</v-icon>
              <span class="subheader">{{`${mensagemNenhumItem || 'Não existem itens a serem exibidos.'}`}}</span>
            </v-flex>
            <v-flex xs12>
              <span class="subheader grey--text lighten-1">
                {{subMensagemNenhumItem}}
              </span>
            </v-flex>
          </v-layout>
        </v-flex>
      </slot>
    </div>

    <div class="bloco-com-dados" v-if="temItensParaExibir">
      <v-flex md3 offset-md9 v-if="exibirPesquisa">
        <v-text-field
          :id="'textfield-pesquisar-'+id"
          class="input-pesquisar py-2 ma-0"
          v-model="pesquisa"
          append-icon="search"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>

      <v-data-table
        v-if="listaColunas && itensTabela"
        class="contorno-tabela mt-2 tabela-orcamentos"
        :search="pesquisa"
        :headers="listaDeColunasCompleta"
        :items-per-page="itensPorPagina"
        :sort-by="chaveOrdenacaoPadrao || listaColunas[0].value"
        :item-key="colunaChave || listaColunas[0].value"
        :sort-desc="true"
        :items="itensTabela"
        :single-expand="!expandirMultiplos"
        :hide-default-footer="esconderRodape"
        :disable-pagination="desabilitarPaginacao"
        :expanded.sync="itensExpandidos"
        @pagination="paginacaoAlterada"
        :page.sync="paginaAtual"
        :footer-props="{'items-per-page-options': opcoesLinhasPorPagina}">
        <template v-slot:item="{ item, headers, expand, isExpanded }">
          <tr class="unselectable" :class="{'expansivel': exibirColunaComIconeParaExpandir}" @click="temAreaExpandida && !expandirManualmente && expand(!isExpanded)">
            <td v-if="exibirColunaComIconeParaExpandir" class="container-icone-expandir">
              <v-icon :class="{'rotacao-chevron-abrir': isExpanded}" >chevron_right</v-icon>
            </td>
            <slot name="primeiras-colunas-personalizadas" :item="item" :expand=expand :isExpanded=isExpanded></slot>
            <td v-for="(cabecalho, indiceValor) in headers.filter((h)=>h.tipo !== tiposDeDado.CUSTOMIZADO)" :key="indiceValor" :class="cabecalho.posicao_valor">
              <destaque-pesquisa :pesquisa="pesquisa">{{ obterDadoFormatadoPorTipo(item, cabecalho) }}</destaque-pesquisa>
            </td>
            <slot name="ultimas-colunas-personalizadas" :item="item" :expand=expand :isExpanded=isExpanded></slot>
          </tr>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <tr> <!-- A documentacao do vuetify nao especifica a tr. Mas se nao por, a td fica "solta" na tabela -->
            <td :colspan="headers.length" class="bloco-expansivel-td">
              <slot name="area-expandida" v-bind:item="item">
              </slot>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </v-flex>
</template>

<script>
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";
import { TIPOS_DE_DADO } from "@/constants/comum/tabela-generica-constants"
import { default as dataUtils } from "@/utils/data";
import { default as mascaraDinheiro } from "@/utils/mascara-dinheiro";
import { OPCOES_LINHAS_TABELA_POR_PAGINA, VALOR_PADRAO_ITENS_POR_PAGINA } from "@/constants/sistema/storage/configuracoes-pagina-constants"
import { OPCOES_STORE_CONFIGURACOES } from '@/store/modules/configuracoes';

/*
EXEMPLO DE OBJETO DE COLUNA
  {
    text: 'Pendente',
    align: 'left',
    sortable: false,
    value: 'liberacoes',
    width: "80px",
    // posicao do texto no cabecalho
    posicao_valor: ALINHAMENTOS.DIREITA,
    // tipo de dado. Isso define o que vai acontecer com as informacoes da coluna
    tipo: TIPOS_DE_DADO.DINAMICO,
    // Se o tipo de dado for dinamico, sera possivel passar um metodo para formatar as informacoes
    metodo: (liberacoes)=>liberacoes.reduce((somatorio, item)=>somatorio + item.quantidadeAExpedir, 0)
  }
*/
export default {
  components: {
    "destaque-pesquisa": DestaquePesquisa
  },
  props: {
    id: { type: String, required: true, default: ()=> 'tabela-generica' }, // Identificador que sera utilizado no container do componente, antes mesmo da tabela em si
    colunaChave: { type: String, default: undefined }, // Chave primária da tabela
    chaveOrdenacaoPadrao: { type: String, default: undefined }, // Chave para coluna padrão de ordenação.
    titulo: { type: String, required: false, default: undefined }, // Titulo em azul que fica em cima da tabela
    listaColunas: { type: Array, required: true, default: undefined }, // lista contendo a definicao dos cabecalhos da tabela
    itensTabela: { type: Array, required: true, default: undefined }, // lista contendo os itens para exibicao. o caminho dos dados devem estar na definicao dos cabecalhos
    expandirMultiplos: { type: Boolean, required: false, default: false }, // define se sera possivel expandir diversas linhas sem fechar as outras
    expandirManualmente: { type: Boolean, required: false, default: false }, // Indica que as linhas sao expansiveis, mas que o controle de abertura sera externo
    exibirIconeAbertura: { type: Boolean, required: false, default: false }, // Define se o chevron na primeira coluna sera exibido
    mensagemNenhumItem: { type: String, required: false, default: undefined }, // mensagem que aparece quando nao existe nenhum item no array e o slot nao foi preenchido
    subMensagemNenhumItem: { type: String, required: false, default: undefined }, // mensagem que aparece abaixo da mensagem principal e com coloracao mais suave
    esconderRodape: { type: Boolean, required: false, default: false }, 
    desabilitarPaginacao: { type: Boolean, required: false, default: false },
    itensParaExpandir: { type: Array, required: false, default: ()=>[] }, // Utilizado para expandir os itens da tabela expansivel
    paginaAtualTabela: {type: Number, required: false, default: 1}, // Página atual quando a tabela for carregada.
    exibirTitulo: { type: Boolean, required: false, default: true },
    exibirBlocoSemDados: { type: Boolean, required: false, default: true },
    exibirPesquisa: { type: Boolean, required: false, default: true },
    pesquisaExterna: { type: String, required: false, default: undefined },
    // Chave existente no modelo de configuracoes por pagina, para carregar e salvar o numero de linhas para exibicao. Hoje armazena apenas Number, mas pode se tornar um Object no futuro
    chaveModeloConfiguracoesPagina: { type: String, required: false, default: undefined }
  },
  computed: {
    temItensParaExibir(){
      return !!(this.itensTabela && this.itensTabela.length > 0);
    },

    temColunaPersonalizada(){
      return !!(this.$scopedSlots['coluna-personalizada'] || this.$slots['coluna-personalizada'])
    },

    temAreaExpandida(){
      return !!(this.$scopedSlots['area-expandida'] || this.$slots['area-expandida'])
    },

    exibirColunaComIconeParaExpandir(){
      return !!(this.areaExpandeAutomaticamente || (this.exibirIconeAbertura && this.temAreaExpandida))
    },

    areaExpandeAutomaticamente(){
      return (this.temAreaExpandida && !this.expandirManualmente)
    },

    listaDeColunasCompleta(){
      let cabecalhoExpandir = {
        text: "",
        align: 'center',
        sortable: false,
        value: 'custom',
        width: "5px",
        tipo: TIPOS_DE_DADO.CUSTOMIZADO
      }
      let colunas = this.listaColunas.concat();

      this.exibirColunaComIconeParaExpandir && colunas.unshift(cabecalhoExpandir);
      return colunas;
    },
  },

  watch: {
    chaveModeloConfiguracoesPagina: {
      immediate: true,
      handler(chave){
        this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_PAGINA].then((configs)=>{
          this.itensPorPagina = (chave && configs[chave]) || VALOR_PADRAO_ITENS_POR_PAGINA;
        }).catch(()=>this.itensPorPagina = VALOR_PADRAO_ITENS_POR_PAGINA);
      }
    },
    itensParaExpandir: {
      immediate: true,
      handler(itens) {
        this.itensExpandidos = itens;
      }
    },
    paginaAtualTabela(valor){
      this.paginaAtual = valor || 1;
    },
    itensTabela(){
       this.paginaAtual = 1;
    },
    pesquisaExterna() {
      this.pesquisa = this.pesquisaExterna; 
    }
  },

  data() {
    return {
      opcoesLinhasPorPagina: OPCOES_LINHAS_TABELA_POR_PAGINA,
      indiceItemSendoEditado: 0,
      pesquisa: "",
      movimentacaoDeLocacao: [],
      tiposDeDado: TIPOS_DE_DADO,
      itensExpandidos: [],
      paginaAtual: this.paginaAtualTabela,
      itensPorPagina: 5
    };
  },
  methods: {
    paginacaoAlterada(obj){
      if (this.chaveModeloConfiguracoesPagina && (this.itensPorPagina !== obj.itemsPerPage)) {
        let config = {};
        config[this.chaveModeloConfiguracoesPagina] = obj.itemsPerPage;
        this.$store.dispatch(OPCOES_STORE_CONFIGURACOES.ACTIONS.ALTERAR_CONFIGURACOES_PAGINA, Promise.resolve(config));
      }
    },

    obterDadoFormatadoPorTipo(obj, cabecalho){
      let dado = this._obterDadoPorCaminhoDoObjeto(cabecalho.value, obj);
      try{
        switch (cabecalho.tipo) {
          case TIPOS_DE_DADO.DATA:
            return dado && dataUtils.aplicarMascaraEmDataIso(dado);
          case TIPOS_DE_DADO.DINHEIRO:
            return !isNaN(dado) && mascaraDinheiro.aplicarMascaraParaRealComPrefixo(dado);
          case TIPOS_DE_DADO.DINAMICO:
            return cabecalho.metodo(dado, obj);
          default: return dado;
        }
      }
      catch (e){
        return "> erro <";
      }
    },

    _obterDadoPorCaminhoDoObjeto(caminho, obj, separador='.'){
      var props = Array.isArray(caminho) ? caminho : caminho.split(separador)
      return props.reduce((anterior, atual) => anterior && anterior[atual], obj)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep tr.expansivel {
  cursor: pointer;
}

.bloco-expansivel-td {
  padding: 20px;
  background-color: $grey-100;
}

.rotacao-chevron-abrir {
  transform: rotate(90deg)
}

::v-deep .container-icone-expandir {
  padding: 0 0 0 10px;
}
</style>