<template>
  <v-container fluid px-0 :id="id">
    <v-row class="px-3">

      <v-flex>
        <tabela-generica
          :id="'tabela-generica-'+id"
          :lista-colunas="colunasTabelaServicos"
          :itens-tabela="itensDaTabela"
          :itens-para-expandir.sync="itensParaExpandir"
          coluna-chave="identificadorItemLocacao"
          chave-ordenacao-padrao="produto.codigo"
          titulo="Serviços"
          expandir-multiplos
        >
          <template v-slot:primeiras-colunas-personalizadas="{ item }">
            <td class="selo-tabela-generica">
              <v-badge avatar color="transparent" offset-y="6" offset-x="-6">
                <template v-slot:badge>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" size="16" :class="obterClasseParaStatus(item.status)">
                        {{ item.status ? 'mdi-tag' : '' }}
                      </v-icon>
                    </template>
                    <span>{{ obterDescricaoDoStatus(item.status) }}</span>
                  </v-tooltip>
                </template>
              </v-badge>
            </td>
            <td>{{ item.produto.codigo }}</td>
            <td>{{ item.produto.nome }}</td>
            <td class="text-center">
              <v-progress-linear :value="item.retornarPorcentagemProgressaoDoItem()+'%'" :dark="true" background-color="#F2F2F2" background-opacity="#165091" height="15" reactive>
                <template v-slot="{ value }">
                  <span>{{ value }}</span>
                  <div class="barra-progresso-texto-secundario-container" v-bind:style="{'--porcentagem-progresso': value}">
                    <span>{{ value }}</span>
                  </div>
                </template>
              </v-progress-linear>
            </td>
          </template>

          <template v-slot:area-expandida="{ item }">
            <v-flex xs12 v-if="exibirBlocoSemDados(item)">
              <v-layout wrap class="card-no-data py-8">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não existem itens expedidos para medir.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 v-if="item.desmembramentos.length && !item.valorUnitario">
              <v-layout wrap class="card-no-data py-8">
                <v-flex xs12>
                  <v-icon class="ma-1">error_outline</v-icon>
                  <span class="subheader">Não é possível medir um item com valor unitário zerado.</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-container fluid px-0 py-0 v-if="item.desmembramentos.length && item.valorUnitario">
              <v-col cols="12" class="card-medicao" :key="indice" v-for="(desmembramento, indice) in item.desmembramentos"><!-- :hidden="desmembramento.totalmenteMedido" -->
                <v-row class="altura-card-expandido">
                  <v-col cols="7" class="pb-0 pt-0">
                    <v-row>
                      <v-col cols="4">
                        <pesquisa-pessoa
                          :classeId="'pesquisa-pessoa-funcionario-'+id"
                          v-model="desmembramento.funcionario"
                          @change="emitirAlteracoes"
                          label="Nome do operador"
                          placeholder
                          atributoExibicao="nome"
                          :categoriasDePessoa="['REPRESENTANTE','FUNCIONARIO']"
                          :desabilitar="desmembramento.totalmenteMedido"
                        ></pesquisa-pessoa>
                      </v-col>

                      <v-col cols="2">
                        <v-text-field 
                          :class="'textfield-quantidade-a-medir-'+id"
                          class="alinhamento-hint tipo-numero"
                          label="Quantidade"
                          @change="emitirAlteracoes"
                          onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                          @input="(valor)=>desmembramento.quantidadeAMedir = valor && parseInt(valor)"
                          v-model="desmembramento.quantidadeAMedir"
                          :error="quantidadeDesmembramentoInvalida(item, desmembramento)"
                          :hint="desmembramento.quantidadeAMedir + ' / '+(desmembramento.totalmenteMedido?desmembramento.quantidadeMedida:desmembramento.quantidadeMaxima)"
                          :disabled="desmembramento.totalmenteMedido"
                          persistent-hint>
                        </v-text-field>
                      </v-col>

                      <v-col cols="4" class="pt-0 pr-0">
                        <datepicker-multiple-value
                          :classeId="'datepicker-multiple-value-periodo-medicao-'+id"
                          v-model="desmembramento.datasAMedir"
                          @onChange="emitirAlteracoes"
                          label="Períodos da medição"
                          v-bind:dataMinima="item.dataInicialLocacao"
                          v-bind:dataMaxima="item.dataFinalLocacao"
                          :desabilitar="desmembramento.totalmenteMedido"
                          :exibirErro="diariasExcedidas(item, desmembramento)"
                        ></datepicker-multiple-value>
                      </v-col>
                      <v-col cols="2" class="pt-7 text-right" :class="desmembramento.totalmenteMedido && 'bloco-desabilitado'">
                        <h4 class="label-area-expandida">Diárias</h4>
                        <p class="conteudo-area-expandida">{{ item.quantidadeDiarias }}</p>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="5" class="pb-0 pt-0">
                    <v-row :class="desmembramento.totalmenteMedido && 'bloco-desabilitado'">
                      <v-col cols="4" class="pl-0 mt-1">
                        <v-row>
                          <v-col cols="6" class="text-right">
                            <h4 class="label-area-expandida">Apontado</h4>
                            <p class="conteudo-area-expandida">
                              {{ desmembramento.datasMedidas.length }} dia(s)
                            </p>
                          </v-col>
                          <v-col cols="6" class="text-right">
                            <h4 class="label-area-expandida">Pendente</h4>
                            <p class="conteudo-area-expandida">
                              {{ item.quantidadeDiarias - desmembramento.datasMedidas.length }} dia(s)
                            </p>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="8" class="pl-0 mt-1">
                        <v-row>
                          <v-col cols="4" class="text-right">
                            <h4 class="label-area-expandida">Unitário líquido</h4>
                            <p class="conteudo-area-expandida">{{ item.valorUnitario | dinheiro }}</p>
                          </v-col>

                          <v-col cols="4" class="text-right">
                            <h4 class="label-area-expandida">Valor da medição</h4>
                            <p class="conteudo-area-expandida">{{ item.valorTotalParaMedicao(desmembramento) | dinheiro }}</p>
                          </v-col>

                          <v-col cols="4" class="text-right pl-0 nao-imprimir">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">                                
                                <v-btn
                                  v-on="on"
                                  :class="'btn-desmembrar-'+id"
                                  color="black"
                                  class="ma-2"
                                  :disabled="desmembramento.quantidadeMaxima === 1 || !!desmembramento.totalmenteMedido"
                                  text
                                  @click="duplicarCardMedicao(item, desmembramento)"
                                  icon
                                >
                                  <v-icon>mdi-content-duplicate</v-icon>
                                </v-btn>
                                <!-- cards-variant -->
                              </template>
                              <span>Desmembrar</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">                                
                                <v-btn
                                  v-on="on"
                                  :class="'btn-limpar-'+id"
                                  class="ma-2"
                                  color="black"
                                  :disabled="desabilitarDesfazer(desmembramento)"
                                  text
                                  @click="desfazerMedicao(item, desmembramento)"
                                  icon
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </template>
                              <span>Limpar campos</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
          </template>
        </tabela-generica>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import TabelaGenerica from "@/components/comum/TabelaGenerica";
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_SERVICOS } from "@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants";
import DatepickerMultipleValue from "@/components/comum/DatepickerMultipleValue";
import PesquisaPessoa from '@/components/sistemas-gerais/pessoa/PesquisaPessoa.vue';
import mascaraDinheiro from "@/utils/mascara-dinheiro";
import DesmembramentoMedicaoModel from "@/models/estoque/medicao/desmembramento-medicao-model"
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import medicaoDeLocacaoMixin from "@/mixins/faturamento/controle-de-locacao/medicao-de-locacao-mixin";

export default {
  name: "ServicosMedicaoDeLocacao",
  mixins: [medicaoDeLocacaoMixin],
  components: {
    PesquisaPessoa,
    "tabela-generica": TabelaGenerica,
    "datepicker-multiple-value": DatepickerMultipleValue
  },
  props: {
    id: { type: String, required: false, default: ()=> 'servicos-medicao' },
    itensParaExpandir: { type: Array, required: false, default: ()=>[] },
    itensDaTabela: { type: Array, required: false, default: ()=>[] },
  },

  filters: {
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  },
  data() {
    return {
      colunasTabelaServicos: COLUNAS_TABELA_MOVIMENTACAO_LOCACAO_MEDICAO_SERVICOS
    }
  },
  methods: {
    valorDoHint(item, apontamentoARegistrar){
      return ` ${this.obterMaximoApontamentoARegistrar(item, apontamentoARegistrar)} / ${this.obterMaximoApontamentoARegistrar(item, apontamentoARegistrar)}`;
    },
    
    obterMaximoApontamentoARegistrar(item){
      return (item.quantidadePedida - item.quantidadeTotalmenteMedido);
    },

    desabilitarDesfazer(desmembramento){
      return !(desmembramento._hierarquia && desmembramento._hierarquia.length > 1) &&
      !(  
          !(desmembramento.quantidadeAMedir == desmembramento.quantidadeMaxima) || 
          desmembramento.datasAMedir.length
        ) || 
        desmembramento.totalmenteMedido
    },

    duplicarCardMedicao(item, desmembramento){
      let indiceDesmembramento = item.desmembramentos.indexOf(desmembramento);
      let clone = new DesmembramentoMedicaoModel(desmembramento);
      this._limparAlteracoesDesmembramento(clone);
      if (desmembramento._hierarquia){
        // Se a hierarquia existe, entao esse desmembramento ja foi clonado.
        // logo, identifico o ultimo clone atraves dos identificadores dos clones e pego o ultimo valor inserido para gerar o proximo
        // recupero os dados pelo identificadorDocumentoItem para ter certeza que o desmembramento pertence ao mesmo lote/serie
        let ultimoClone = item
          .obterClonesDoDesmembramento(desmembramento)
          .reduce( (ultimoDesmembramento, desmembramento) => 
          desmembramento._hierarquia &&  desmembramento._hierarquia.length > ultimoDesmembramento._hierarquia.length ? desmembramento : ultimoDesmembramento,
            {_hierarquia: []}
          );

        clone._hierarquia = [...ultimoClone._hierarquia, ultimoClone._hierarquia[ultimoClone._hierarquia.length-1] + 1 ];
      }
      else {
        desmembramento._hierarquia = [0];
        clone._hierarquia = [0, 1];
      }

      item.desmembramentos.splice(indiceDesmembramento+1, 0, clone);
    },

    desfazerMedicao(item, desmembramento) {
      // se a medicao ainda nao tem clone ou seja o ultimo da lista, apenas faco a limpeza do modelo
      if (
        !desmembramento._hierarquia || 
        item.obterClonesDoDesmembramento(desmembramento).length === 1
      )
        this._limparAlteracoesDesmembramento(desmembramento);
      else {
        // caso existam diversos clones, removo o clone solicitado.
        let indiceDesmembramento = item.desmembramentos.indexOf(desmembramento);
        item.desmembramentos.splice(indiceDesmembramento, 1);
        // em seguida, rodo um alinhamento para que os identificadores dos clones continuem sequenciais e em ordem
        item
          .obterClonesDoDesmembramento(desmembramento)
          .sort(
            (d1, d2)=> {
              if(d1._hierarquia.length > d2._hierarquia.length) return 1;
              if(d1._hierarquia.length < d2._hierarquia.length) return -1;
              return 0;
          })
          .reduce(
            (hierarquia, desmembramento)=>{
              desmembramento._hierarquia = hierarquia.slice();
              hierarquia.push(hierarquia[hierarquia.length-1] + 1)
              return hierarquia;
          }, [0]);
      }
      this.emitirAlteracoes();
    },

    _limparAlteracoesDesmembramento(desmembramento){
      desmembramento.quantidadeAMedir = desmembramento.quantidadeMaxima;
      desmembramento.datasAMedir = [];
      desmembramento.funcionario = undefined;
      desmembramento.observacao = undefined;
      desmembramento._hierarquia = undefined;
    },

    quantidadeDesmembramentoInvalida(item, desmembramento){
      return desmembramento.quantidadeAMedir > desmembramento.quantidadeMaxima || 
        (
          desmembramento._hierarquia && 
          desmembramento._hierarquia.length > 1 
          && item.quantidadeDosClonesUltrapassaMaximo(desmembramento)
        )
    },

    emitirAlteracoes() {
      this.$emit("onChange", this.itensDaTabela);
    },

    obterClasseParaStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].classe) || '';
    },

    obterDescricaoDoStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].descricao) || '';
    }
  }
}
</script>

<style lang="scss" scoped>
.card-medicao {
  background-color: $white;
  padding: 0 10px 0 10px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.card-medicao:not(:last-of-type) {
  margin-bottom: 20px;
}

.altura-card-expandido {
  height: 100px;
}

.label-area-expandida {
  font-size: 12px;
  font-weight: 400;
  color: #757575;
}

p.conteudo-area-expandida {
  font-size: 13px;
  font-weight: 600;
}
</style>