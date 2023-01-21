<template>
  <div :id="id">
    <v-layout wrap>
      <v-flex sm12 text-left>
        <v-row class="ma-0 pa-0">
          <v-col cols="8" class="ma-0 pa-0">
            <v-btn class="btn-secondary-icon width-icon margem-zero" text @click="abrirModalAdicionarNovaDespesa()" :id="'btn-adicionar-'+id">
              <v-icon class="mr-1">mdi-18px mdi-plus</v-icon>Adicionar
            </v-btn>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0">
            <v-text-field
              :id="'textfield-pesquisar-'+id"
              v-model="pesquisa"
              class="ma-0 pa-0"
              append-icon="search"
              label="Pesquisar"
              :disabled="despesasAdicionadas.length === 0"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-flex>

      <v-flex sm12 lg12>
        <v-flex sm12 v-show="(despesasAdicionadas.length > 0)">
          <v-data-table
            :headers="colunasDespesas"
            :items="itensFiltrados"
            class="contorno-tabela"
            :items-per-page="5"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.identificador">
                  <td class="text-left px-0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-avatar v-on="on">
                          <v-icon size="16" :class="obterClasseParaStatus(item.status)">
                            mdi-tag
                          </v-icon>
                        </v-avatar>
                      </template>
                      <span><destaque-pesquisa :pesquisa="pesquisa">{{ obterDescricaoDoStatus(item.status) }}</destaque-pesquisa></span>
                    </v-tooltip>
                  </td>
                  <td class="text-left px-0">
                    <destaque-pesquisa :pesquisa="pesquisa">{{ item.naturezaLancamento.codigo }} - {{ item.naturezaLancamento.nome }}</destaque-pesquisa>
                  </td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.quantidade }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.calcularValorTotalUnitario() | dinheiro }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.calcularValorTotalComoDespesa() | dinheiro }}</destaque-pesquisa></td>
                  <td v-if="!item.movimentado" class="text-right nowrap px-0 pr-1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mx-1" x-small icon color="primary" @click="abrirModalEditarDespesa(item)" :id="'btn-editar-'+id" v-on="on">
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mr-3" x-small icon color="primary" @click="verificarExclusaoDoItemDaTabela(item)" :id="'btn-excluir-'+id" v-on="on">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir</span>
                    </v-tooltip>
                  </td>

                  <td class="text-right" v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mx-0" x-small icon color="primary" @click="visualizarDespesa(item)" :id="'btn-visualizar-'+id" v-on="on">
                          <v-icon>mdi-eye-settings</v-icon>
                        </v-btn>
                      </template>
                      <span>Visualizar</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex mt-2 xs12 v-show="(despesasAdicionadas.length == 0)">
          <v-layout wrap class="card-no-data py-12">
            <v-flex xs12>
              <span class="subheader">Não há despesas adicionadas neste orçamento.</span>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout wrap>
      <v-dialog @keydown.esc="dialogDespesas = false" v-model="dialogDespesas" persistent max-width="60%">
        <v-card>
          <v-col cols="12" class="pa-0">
            <v-row no-gutters>
              <v-col cols="6">
                <v-card-title class="display-block">
                  <h2 class="titulo-modal" v-if="!despesa.movimentado">{{ (editarDespesaSelecionada) ? 'Editar' : 'Adicionar' }} despesa</h2>
                  <h2 class="titulo-modal" v-else>Visualizar despesa</h2>
                </v-card-title>
              </v-col>

              <v-col cols="6">
                <v-alert text dense color="red" border="left" class="notificacao-alerta mt-3 mb-0 mr-4" v-if="mensagemDeCamposObrigatorios">
                  <span v-if="mensagemDeCamposObrigatorios">{{ mensagemDeCamposObrigatorios }}</span>
                </v-alert>
              </v-col>
            </v-row>
          </v-col>

          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 sm12 mx-1>
                  <pesquisa-auto-complete
                    :id="'pesquisa-auto-complete-natureza-lancamento-'+id"
                    @alterarDados="alterarNaturezaLancamento"
                    label="Descrição"
                    :itemSelecionado="naturezaLancamentoSelecionada"
                    :metodoLocalizacao="localizarNatureza"
                    :metodoFiltro="filtrarNatureza"
                    atributoExibicao="codigoNome"
                    :formatadorItemDetalhe="(item)=>{ return `Classificação: ${item.classificacao}` }"
                    :limparModel="limpar"
                    :autoFocus="focoHabilitado"
                    :desabilitar="despesa.movimentado"
                    @onFocus="alterarFocus">
                  </pesquisa-auto-complete>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 sm12 ma-1>
                  <h2 class="subtitulo-modal">Composição de preço</h2>
                </v-flex>

                <v-flex xs12 sm12 mx-2 mt-2>
                  <v-row>
                    <v-flex xs12 sm3 px-2>
                      <v-text-field
                        :id="'textfield-quantidade-'+id"
                        v-mask="'###'"
                        class="tipo-numero"
                        label="Quantidade"
                        :disabled="despesa.movimentado"
                        :rules="[v => !!v || 'Obrigatório']"
                        v-model="despesa.quantidade">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm3 px-2>
                      <campo-dinheiro
                        :id="'campo-dinheiro-valor-'+id"
                        class="tipo-numero"
                        label="Valor unitário"
                        v-model="despesa.valorItem"
                        :disabled="despesa.movimentado"
                        :maxlength="15"
                        :permitir-negativo="false">
                      </campo-dinheiro>
                    </v-flex>

                    <v-flex xs12 sm3 px-2 text-right>
                      <h3 class="label-padrao">
                        Adicional unitário
                        <!-- <sup>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-avatar size="14" v-on="on">
                                <v-icon small color="primary">mdi-information-outline</v-icon>
                              </v-avatar>
                            </template>
                            <span>Serviço 18%</span>
                          </v-tooltip>
                        </sup> -->
                      </h3>
                      <p class="totalizadores-rodape">
                        {{ despesa.valorAdicionalPersonalizado | dinheiro }}
                      </p>
                    </v-flex>

                    <v-flex xs12 sm3 px-2 text-right>
                      <h3 class="label-padrao">Unitário líquido</h3>
                      <p class="totalizadores-rodape">
                        {{ despesa.calcularValorTotalUnitario() | dinheiro }}
                      </p>
                    </v-flex>

                    <v-flex xs12 sm12 px-2 pb-5 text-right>
                      <h3 class="label-padrao">Valor total do item</h3>
                      <p class="total-modal">{{ despesa.calcularValorTotalComoDespesa() | dinheiro }}</p>
                    </v-flex>
                  </v-row>
                </v-flex>
              </v-layout>

              <!-- 
                TODO: Comentado temporariamente para liberação do MVP.
                Vamos descomnetar quando mudarmos a forma de calcular a medição pelo orçado.
              -->
                <!-- <v-flex xs12 sm3 pl-3 pr-3>
                <v-switch
                  v-if="ajustandoItem && !despesa.incluidoNaGestao"
                  v-model="despesa.medirPeloOrcado"
                  inset
                  label="Medir pelo Orçado"
                  :disabled="despesa.identificadorEntidadeOrigem == 0 || despesa.movimentado"
                ></v-switch>
              </v-flex>  -->
            </v-container>
          </v-form>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-show="!despesa.movimentado" class="btn-primary" text @click="adicionarDespesaNaTabela" :id="'btn-salvar-'+id">
              Salvar
            </v-btn>
            <v-btn class="btn-tertiary" text @click="cancelarInclusaoDespesa" :id="'btn-cancelar-'+id">
              Cancelar
            </v-btn>
          </v-card-actions>          
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import Mascara from "@/utils/mascara-dinheiro.js";
import CampoDinheiro from "@/components/comum/CampoDinheiro";
import apiNaturezaLancamento from "@/api/financeiro/natureza-lancamento-api.js";
import PesquisaAutoComplete from "@/components/comum/PesquisaAutoComplete.vue";
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import { COLUNAS_DESPESAS } from "@/constants/faturamento/controle-de-locacao/despesas-orcamento-locacao-constants.js";
import DespesaModel from '@/models/faturamento/orcamento-locacao/despesa-model';
import NaturezaLancamentoModel from '@/models/financeiro/natureza-lancamento-model';
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";

export default {
  components: {
    PesquisaAutoComplete,
    CampoDinheiro,
    DestaquePesquisa
  },

  model: {
    prop: 'despesasAdicionadas',
    event: 'onChange'
  },

  props: {
    id: { type: String, required: false, default: () => 'despesas-orcamento' },
    despesasAdicionadas: { type: Array, required: true },
    adicionalPersonalizado: { type: Object, default: undefined },
    ajustandoItem: { type: Boolean , default: false } 
  },

  filters: {
    dinheiro(valor) {
      return Mascara.aplicarMascaraParaRealComPrefixo(valor);
    }
  },

  computed: {
    itensFiltrados() {
      // verifica se tem um termo para comparar e se o valor do comparado nao for 
      // nulo ou booleano, busca pelo minusculo das strings
      let comparador = (valor, busca) => !busca || (valor != null && typeof valor !== 'boolean' && valor.toString().toLocaleLowerCase().indexOf(busca.toLocaleLowerCase()) !== -1)
      return this.despesasAdicionadas.filter(d => {
        return this.valoresDoItemParaFiltro(d).some(v => comparador(v, this.pesquisa))
      });
    }
  },

  data() {
    return {
      index: -1,
      limpar: false,
      focoHabilitado: false,
      adicionarDespesa: false,
      editarDespesaSelecionada: false,
      naturezaLancamentoSelecionada: undefined,
      valorTotalDasDespesas: 0,
      dialogDespesas: false,
      mensagemDeCamposObrigatorios: "",
      mostrarMensagemDeCamposObrigatorios: false,
      colunasDespesas: COLUNAS_DESPESAS,
      despesa: this.obterNovaDespesa(),
      listaNaturezasLancamento: undefined,
      pesquisa: ""
    }
  },

  watch: {
    'despesa.valorItem': function() {
      this.fazerCalculoAposAlteracaoNosValoresDaDespesa();
    },

    'despesa.quantidade': function() {
      this.fazerCalculoAposAlteracaoNosValoresDaDespesa();
    }
  },

  methods: {
    valoresDoItemParaFiltro(item){
      return [ 
        this.obterDescricaoDoStatus(item.status),
        `${item.naturezaLancamento.codigo} - ${item.naturezaLancamento.nome}`,
        item.quantidade,
        this.$options.filters.dinheiro(item.calcularValorTotalUnitario()),
        this.$options.filters.dinheiro(item.calcularValorTotalComoDespesa())
      ]
    },

    async localizarNatureza() {
      if (!Array.isArray(this.listaNaturezasLancamento) || !this.listaNaturezasLancamento.length) {
        // listar todas as naturezas de lançamento
        this.listaNaturezasLancamento = await apiNaturezaLancamento.localizarNaturezasAnaliticas('');
      }

      return Promise.resolve(this.listaNaturezasLancamento);
    },

    filtrarNatureza(naturezaLancamento, consulta, textoExibido) {
      var consultaMinuscula = consulta.toLowerCase();
      return textoExibido.toLowerCase().includes(consultaMinuscula)
        || naturezaLancamento.classificacao.toLowerCase().includes(consultaMinuscula);
    },

    fazerCalculoAposAlteracaoNosValoresDaDespesa() {
      let aliquotas = this.adicionalPersonalizado && this.adicionalPersonalizado.obterTotaisDeAliquotasPorCategoria();
      this.despesa.calcularValorAdicionalPersonalizado(aliquotas);
    },

    alterarFocus() {
      this.focoHabilitado = false;
    },

    abrirModalAdicionarNovaDespesa() {
      this.dialogDespesas = true;
      this.editarDespesaSelecionada = false;
      
      this.$nextTick(() => {
        this.focoHabilitado = true;
        this.despesa.incluidoNaGestao = !!(!this.editarDespesaSelecionada && this.ajustandoItem);
      });
    },

    camposObrigatoriosEstaoPreenchidos() {
      let retornar = true;
      this.mensagemDeCamposObrigatorios = "";

      if (
        typeof this.despesa.naturezaLancamento.identificador === "undefined" ||
        this.despesa.naturezaLancamento.identificador === ""
      ) {
        this.mensagemDeCamposObrigatorios += "Selecione uma despesa";
        retornar = false;
      }

      if (this.despesa.quantidade < 1) {
        this.mensagemDeCamposObrigatorios +=
          " - Quantidade deve ser maior que zero";
        retornar = false;
      }

      if (this.despesa.valorItem === 0) {
        this.mensagemDeCamposObrigatorios +=
          " - Valor deve ser maior que R$ 0,00 ";
        retornar = false;
      }

      this.mostrarMensagemDeCamposObrigatorios = !retornar;
      return retornar;
    },

    adicionarDespesaNaTabela() {
      if (!this.camposObrigatoriosEstaoPreenchidos()) {
        return;
      }

      if (this.editarDespesaSelecionada) {
        let index = this.obterPosicaoDaDespesaNaListaDeDespesasAdicionadas(this.despesa);
        /* Substituindo, pois o 'this.depesa' é uma cópia sem referência propositalmente para não alterar o 
            modelo ao mudar valores na tela */
        this.despesasAdicionadas.splice(index, 1, this.despesa);
        this.limparCampos();
        this.dialogDespesas = false;
      }
      else {
        this.despesasAdicionadas.push(this.despesa);
        this.limparCampos();
        this.abrirModalAdicionarNovaDespesa();
      }

      this.valorTotalDasDespesas = this.despesasAdicionadas
        .map(v => v.calcularValorTotalComoDespesa())
        .reduce((total, prox) => total + prox);

      this.editarDespesaSelecionada = false;
    },

    obterPosicaoDaDespesaNaListaDeDespesasAdicionadas(despesa) {
      return this.despesasAdicionadas.findIndex(d => d.identificador == despesa.identificador);
    },

    alterarNaturezaLancamento(naturezaLancamento) {
      this.despesa.naturezaLancamento = new NaturezaLancamentoModel(naturezaLancamento);
    },

    questionarUsuarioSobreDeletarItemDaTabela() {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Exclusão da despesa`;
      cfgMsg.mensagem = `Confirma a exclusão desta despesa?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.deletarItemDaTabela;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    deletarItemDaTabela() {
      this.despesasAdicionadas.splice(this.index, 1);
      this.valorTotalDasDespesas -= this.despesa.calcularValorTotalComoDespesa();
      this.limparCampos();
    },

    verificarExclusaoDoItemDaTabela(despesa) {
      this.index = this.obterPosicaoDaDespesaNaListaDeDespesasAdicionadas(
        despesa
      );
      this.questionarUsuarioSobreDeletarItemDaTabela();
      this.despesa = new DespesaModel(despesa);
      this.mostrarMensagemDeCamposObrigatorios = false;
    },

    cancelarInclusaoDespesa() {
      this.dialogDespesas = false;
      this.limparCampos();
      this.editarDespesaSelecionada = false;
      this.mostrarMensagemDeCamposObrigatorios = false;
    },

    limparCampos() {
      this.despesa = this.obterNovaDespesa();
      this.limpar = !this.limpar;
      this.naturezaLancamentoSelecionada = undefined;
    },

    obterNovaDespesa() {
      var listaIdentificadores = (this.despesasAdicionadas.length && this.despesasAdicionadas.map(d => d.identificador)) || [0];
      return new DespesaModel({ identificador: Math.max(...listaIdentificadores) + 1 });
    },

    abrirModalEditarDespesa(despesa) {
      this.editarDespesaSelecionada = true;
      this.dialogDespesas = true;

      this.$nextTick(() => {
        this.despesa = new DespesaModel(despesa);
        this.naturezaLancamentoSelecionada = this.despesa.naturezaLancamento;
        
      });
    },

    obterClasseParaStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].classe) || '';
    },

    obterDescricaoDoStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].descricao) || '';
    },

    visualizarDespesa(despesa) {
      this.$nextTick(() => {
        this.despesa = new DespesaModel(despesa);
        this.naturezaLancamentoSelecionada = this.despesa.naturezaLancamento;
        
      });
      this.dialogDespesas = true;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep table thead tr :nth-child(2) {
  padding-left: 0px;
}

::v-deep i.v-icon.notranslate.mdi.mdi-tag {
  margin-right: 0px;
}
</style>