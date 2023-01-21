<template>
  <div :id="id">
    <v-layout wrap>
      <v-flex sm6>
        <h3 class="label-padrao mt-3">Negociação:</h3>
        <div>
          <span v-show="!this.objParaAdicionarPrazo.prazo">Nenhuma negociação selecionada.</span>
          <v-btn
            :id="'btn-selecionar-'+id"
            class="btn-edit-delete-icon width-icon"
            text
            @click="exibirModalAdicionarPrazo()"
            :hidden="!!this.objParaAdicionarPrazo.prazo"
            :loading="!(!!this.prazos && !!this.prazos.length)"
          >
            Selecionar
          </v-btn>
          <span v-if="!!this.objParaAdicionarPrazo.prazo" class="prazo-selecionado">
            <p class="mt-1">
              {{descricaoPrazoSelecionado()}}
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn x-small icon color="primary" class="alinhamento-icon-delete" @click="removerPrazo()" :id="'icon-excluir-prazo-'+id" v-on="on">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Excluir prazo</span>
              </v-tooltip>
            </p>
          </span>
        </div>
      </v-flex>
    </v-layout>

    <v-layout wrap>
      <v-dialog v-model="dialogPrazo" persistent scrollable max-width="600" @keydown.esc="dialogPrazo = false" :id="'dialog-prazo-'+id">
        <v-card>
          <v-card-title class="display-block">
            <h2 class="titulo-modal">{{tituloModal}}</h2>
          </v-card-title>

          <v-card-text class="px-4">
            <v-layout wrap>
              <v-flex sm12 lg12 v-if="estagioSelecao == estagiosSelecao.SELECAO_PRAZO">
                <v-treeview
                  :id="'treeview-selecao-prazo-'+id"
                  dense
                  shaped
                  hoverable
                  activatable
                  :active.sync="itensSelecionadosTreeview"
                  :search="pesquisaTreeview"
                  open-on-click
                  @update:active="selecionarPrazo"
                  return-object
                  :items="prazosOrganizados"
                  item-text="codigoNome"
                  color="primary">
                </v-treeview>
                <!-- 
                  A prop "open" esta usando o mesmo metodo para iniciar a treeview com o item principal ja aberto (BCDL-2022)
                  Nao coloquei em uma variavel pois seriam muitas voltas para algo simples
                  Caso esse trecho cause lentidao no futuro, alteramos para uma variavel 
                -->
              </v-flex>

              <v-flex sm12 lg12 v-show="exibirTabela">
                <v-data-table
                  :id="'datatable-selecao-prazo-'+id"
                  v-model="itensSelecionadosTabela"
                  item-key="identificador"
                  :headers="cabecalhosTabela"
                  :items="itensTabela"
                  hide-default-header
                  hide-default-footer
                  @click:row="selecionarItemTabela"
                  single-select
                  class="contorno-tabela">
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :id="'btn-voltar-'+id"
              class="btn-tertiary"
              :disabled="estagioSelecao == estagiosSelecao.SELECAO_PRAZO"
              text
              @click="voltarUmEstagio()">Voltar
            </v-btn>

            <v-btn
              :id="'btn-salvar-'+id"
              class="btn-primary"
              :disabled="!podeSalvar"
              text
              @click="emitirInformacoes()">Salvar
            </v-btn>

            <v-btn
              :id="'btn-cancelar-'+id"
              class="btn-tertiary"
              text
              @click="cancelarInclusaoPrazo()">Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import apiPrazo from "@/api/financeiro/prazo-api";
import { COLUNAS_FORMAS_PAGAMENTO, TIPOS_PRAZO, ESTAGIOS_SELECAO, AGRUPAMENTOS_PRAZO } from "@/constants/financeiro/prazos-orcamento-locacao-constants.js";
import PrazoModel from '@/models/financeiro/prazo-model';

export default {
  model: {
    prop: "objParaAdicionarPrazo",
    event: "onChange"
  },

  props: {
    id: { type: String, required: false, default: ()=> 'prazo-orcamento' },
    objParaAdicionarPrazo: { type: Object, required: false, default: ()=>{return {}} }
  },

  data: () => ({
    dialogPrazo: false,
    pesquisaTreeview: "",
    estagiosSelecao: ESTAGIOS_SELECAO,
    estagioSelecao: ESTAGIOS_SELECAO.SELECAO_PRAZO,
    itensTabela: [],
    itensSelecionadosTabela: [],
    itensSelecionadosTreeview: [],
    cabecalhosTabela: COLUNAS_FORMAS_PAGAMENTO,
    prazos: [],
    prazoSelecionado: undefined,
    formaPagamentoEntradaSelecionada: undefined,
    formaPagamentoParcelasSelecionada: undefined
  }),

  computed: {
    prazosOrganizados(){
      /*
      * Esta variavel computada foi criada porque ao chamar o metodo obterHierarquia diretamente na treeview
      * estava ocorrendo um loop infinito. Sera aberta uma tarefa de refatoracao para descobrir o problema
      * O simples fato de adicionar um console.log na raiz do metodo ja ocasionava o iloop
      * O payload de exemplo para ocasionar o problema pode ser encontrado na tarefa BCDL-2298
      * Exemplo: Adicionar o metodo diretamente no treeview, criar uma variavel contadora, exibir com console.log na raiz do metodo e incrementar o contador
      */
      return this.obterHierarquia();
    },
    tituloModal() {
      switch(this.estagioSelecao){
        default: return "Prazos"
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA: return "Forma de pagamento da entrada"
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA: return "Forma de pagamento das parcelas"
      }
    },

    exibirTabela() {
      return this.estagioSelecao === ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA ||
        this.estagioSelecao === ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA
    },

    podeSalvar() {
      return (this.proximoEstagioSelecaoItem().estagio === this.estagioSelecao) && 
        (this.itensSelecionadosTabela && this.itensSelecionadosTabela.length);
    }
  },

  mounted() {
    apiPrazo.obterPrazos()
      .then(prazos => {
        this.prazos = prazos;
      })
      .catch(() => {
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter os prazos.`
        });
      })
  },

  methods: {
    descricaoPrazoSelecionado(){
      let descricao = "";
      if (this.objParaAdicionarPrazo.formaPagamentoEntrada && this.objParaAdicionarPrazo.formaPagamentoParcelas){
        descricao = `(${this.objParaAdicionarPrazo.prazo.nome}) ${this.objParaAdicionarPrazo.formaPagamentoEntrada.nome}(Entrada) + ${this.objParaAdicionarPrazo.formaPagamentoParcelas.nome}`
      } else {
        descricao = this.objParaAdicionarPrazo.formaPagamentoEntrada
                    ? `(${this.objParaAdicionarPrazo.prazo.nome}) ${this.objParaAdicionarPrazo.formaPagamentoEntrada.nome}`
                    : `(${this.objParaAdicionarPrazo.prazo.nome}) ${this.objParaAdicionarPrazo.formaPagamentoParcelas.nome}`
      }

      return descricao;
    },

    voltarUmEstagio() {
      let dadosEstagioAnterior = this.estagioAnteriorSelecaoItem();
      if (this.estagioSelecao === dadosEstagioAnterior.estagio) return;
      if (dadosEstagioAnterior.estagio === ESTAGIOS_SELECAO.SELECAO_PRAZO) {
        this.itensSelecionadosTreeview = [];
      }

      switch(this.estagioSelecao) {
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA:
          this.formaPagamentoEntradaSelecionada = undefined;
        break;
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA:
          this.formaPagamentoParcelasSelecionada = undefined;
        break;
      }

      this.itensTabela = dadosEstagioAnterior.itensTabela;
      this.itensSelecionadosTabela = [dadosEstagioAnterior.itemSelecionadoTabela];
      this.estagioSelecao = dadosEstagioAnterior.estagio;
    },

    selecionarPrazo(prazo) {
      if (!prazo[0]) return;
      this.prazoSelecionado = prazo[0];
      this.avancarEstagioSelecao();
    },

    selecionarItemTabela(item, acoes) {
      acoes.select();
      switch(this.estagioSelecao) {
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA: 
          this.formaPagamentoEntradaSelecionada = item;
        break;
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA: 
          this.formaPagamentoParcelasSelecionada = item;
        break;
      }
      this.avancarEstagioSelecao();
    },

    avancarEstagioSelecao() {
      let dadosProximoEstagio = this.proximoEstagioSelecaoItem();
      if (dadosProximoEstagio.estagio === this.estagioSelecao) return;

      this.itensTabela = dadosProximoEstagio.itensTabela;
      this.itensSelecionadosTabela = [];
      this.estagioSelecao = dadosProximoEstagio.estagio;
    },

    proximoEstagioSelecaoItem() {
      let dadosProximoEstagio = {
        estagio: this.estagioSelecao,
        itensTabela: []
      }

      if (this.prazoSelecionado)
        switch(this.estagioSelecao) {
          case ESTAGIOS_SELECAO.SELECAO_PRAZO: 
            if (this.prazoSelecionado.formasPagamentosEntrada.length) {
              dadosProximoEstagio.estagio = ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA;
              dadosProximoEstagio.itensTabela = this.prazoSelecionado.formasPagamentosEntrada;
            } else {
              dadosProximoEstagio.estagio = ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA;
              dadosProximoEstagio.itensTabela = (this.prazoSelecionado && this.prazoSelecionado.formasPagamentosParcelas) || [];
            }
          break;

          case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA: 
            if (this.prazoSelecionado.formasPagamentosParcelas.length){
              dadosProximoEstagio.estagio = ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA;
              dadosProximoEstagio.itensTabela = this.prazoSelecionado.formasPagamentosParcelas;
            }
          break;
        }

      return dadosProximoEstagio;
    },

    estagioAnteriorSelecaoItem() {
      let dadosEstagioAnterior = {
        estagio: this.estagioSelecao,
        itensTabela: [],
        itemSelecionadoTabela: undefined
      }
      switch(this.estagioSelecao){
        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA: 
          dadosEstagioAnterior.estagio = ESTAGIOS_SELECAO.SELECAO_PRAZO;
        break;

        case ESTAGIOS_SELECAO.FORMA_PAGAMENTO_PARCELA: 
          if (!this.prazoSelecionado.formasPagamentosEntrada.length)
            dadosEstagioAnterior.estagio = ESTAGIOS_SELECAO.SELECAO_PRAZO
          else {
            dadosEstagioAnterior.estagio = ESTAGIOS_SELECAO.FORMA_PAGAMENTO_ENTRADA;
            dadosEstagioAnterior.itensTabela = this.prazoSelecionado.formasPagamentosEntrada;
            dadosEstagioAnterior.itemSelecionadoTabela = this.formaPagamentoEntradaSelecionada;
          }
        break;
      }
      return dadosEstagioAnterior;
    },

    exibirModalAdicionarPrazo() {
      this.estagioSelecao = ESTAGIOS_SELECAO.SELECAO_PRAZO;
      this.itensSelecionadosTreeview = [];
      this.prazoSelecionado = undefined;
      this.formaPagamentoEntradaSelecionada = undefined;
      this.formaPagamentoParcelasSelecionada = undefined;
      this.dialogPrazo = true;
    },

    emitirInformacoes() {
      this.objParaAdicionarPrazo.prazo = this.prazoSelecionado && new PrazoModel(this.prazoSelecionado);
      this.objParaAdicionarPrazo.formaPagamentoEntrada = this.formaPagamentoEntradaSelecionada;
      this.objParaAdicionarPrazo.formaPagamentoParcelas = this.formaPagamentoParcelasSelecionada;

      this.$emit("onChange", this.objParaAdicionarPrazo);
      this.dialogPrazo = false;
    },

    cancelarInclusaoPrazo() {
      this.dialogPrazo = false;
    },

    removerPrazo() {
      this.prazoSelecionado = undefined;
      this.formaPagamentoEntradaSelecionada = undefined;
      this.formaPagamentoParcelasSelecionada = undefined;
      this.emitirInformacoes();
    },
    
    obterHierarquia() {
      // O filtro abaixo remove os itens a pagar, de acordo com a tarefa BCDL-2022
      let listagem = (this.prazos || []).filter(p=>p.tipo !== AGRUPAMENTOS_PRAZO.PAGAR);
      listagem = listagem.reduce((lista, item)=>{
        let niveis = item.codigoClassificacao.split(/\.|-|\//);
        item.id = item.identificador; // identificador para controle do treeview
        this._nivelarPrazo(lista, item, niveis);
        return lista;

      }, []);
      
      return this._removerItensTemporarios(listagem).sort(
        (item1, item2) => 
          (item1.children.length > item2.children.length) ||
          (item2.codigoClassificacao > item1.codigoClassificacao) ? 
            -1 : 1
      )
    },
    
    // O filtro abaixo remove os itens vazios, de acordo com a tarefa BCDL-2022
    _removerItensTemporarios(lista){
      return lista.reduce((novaLista, item)=>{
        if(!item.codigo)
          novaLista.push(...this._removerItensTemporarios(item.children));
        else {
          let children = this._removerItensTemporarios(item.children);
          // copia para nao alterar o array do item
          novaLista.push(Object.assign({}, item, {children}) );
        }

        return novaLista
      }, []);
    },

    _nivelarPrazo(lista, item, niveis) {
      // tamanho 1 significa que esta na raiz. basta um push
      if (niveis.length == 1) {
        if (item.tipoClassificacao == TIPOS_PRAZO.SINTETICO) return;

        let mesmoItem = lista.find(v => (v.__nome === niveis[0]) && (v.__nome !== ""));

        if(mesmoItem) { //se ja tenho o item na lista, adiciono os valores
          for (var nomeProp in item) { mesmoItem[nomeProp] = item[nomeProp]; }
        }
        else {
          item.__nome = niveis[0];// para controle do metodo
          item.children = [];
          lista.push(item);
        }
        return;
      }

      // caso seja length seja maor que um, procuro pelo parent do item na lista
      let parent = niveis.shift();
      let parentObj = lista.find(v => v.__nome === parent);
      if (parentObj)
      {
        this._nivelarPrazo(parentObj.children, item, niveis);
        return;
      }
      //verificar quando eu ja coloquei o dummy na lista

      //no ultimo caso, o nivel > 1 e o parent nao esta na lista
      lista.push({__nome: parent, children: []});
      //refaco o nivelamento
      niveis.unshift(parent);
      this._nivelarPrazo(lista, item, niveis);
    },    
  }
};
</script>

<style lang="scss" scoped>
::v-deep #tabela-selecao-prazo-orcamento-locacao table tr {
  cursor: pointer;
}

.alinhamento-icon-delete {
  margin-top: 2px;
}

.prazo-selecionado {
  margin-right: 5px;
  font-weight: 500;
}
</style>