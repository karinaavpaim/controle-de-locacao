<template>
  <v-container fluid px-0 pt-0 :id="id">
    <v-flex lg12>
      <v-row class="align-center altura-linha-preenchimento-automatico" no-gutters>
        <v-col lg="2">
          <v-btn
            :id="'btn-preenchimento-automatico-' + id"
            class="btn-tertiary btn-preenchimento-automatico mx-0 mt-0 pr-2"
            text
            @click="exibirPreenchimentoAutomatico = !exibirPreenchimentoAutomatico"
          >
            Preenchimento automático
            <v-icon class="flex-shrink-1 ml-1">
              {{ exibirPreenchimentoAutomatico ? "keyboard_arrow_left" : "keyboard_arrow_right" }}
            </v-icon>
          </v-btn>
        </v-col>
        <v-col lg="10 pb-0">
          <transition name="slide-x-transition">
            <div v-show="exibirPreenchimentoAutomatico">
              <div class="d-flex justify-space-between align-center">
                <div class="d-inline-flex">
                  <datepicker-multiple-value
                    :classeId="'datepicker-multiplo-preenchimento-automatico-periodo-medicao-' + id"
                    v-model="periodoMedicaoPreenchimentoAutomatico"
                    label="Períodos da medição"
                    v-bind:dataMinima="medicaoDaLocacao.dataInicioContrato"
                    v-bind:dataMaxima="medicaoDaLocacao.dataTerminoContrato"
                    :desabilitar="desativarDatepickerPreenchimentoSemItensParaMedir()"
                  ></datepicker-multiple-value>
                </div>

                <div class="d-inline-flex justify-space-around align-center">
                  <v-checkbox
                    v-model="categoriasPreenchimentoSelecionadas"
                    class="mx-4"
                    :id="'checkbox-categoria-equipamentos-medicao-' + id"
                    :label="categoriasPreenchimentoAutomatico.EQUIPAMENTO.nome"
                    :value="categoriasPreenchimentoAutomatico.EQUIPAMENTO.valor"
                    :disabled="desativarCategoriaPreenchimentoSemItensParaMedir(equipamentos)"
                  ></v-checkbox>

                  <v-checkbox
                    v-model="categoriasPreenchimentoSelecionadas"
                    class="mx-4"
                    :id="'checkbox-categoria-materiais-medicao-' + id"
                    :label="categoriasPreenchimentoAutomatico.MATERIAL.nome"
                    :value="categoriasPreenchimentoAutomatico.MATERIAL.valor"
                    :disabled="desativarCategoriaPreenchimentoSemItensParaMedir(materiais)"
                  ></v-checkbox>

                  <v-checkbox
                    v-model="categoriasPreenchimentoSelecionadas"
                    class="mx-4"
                    :id="'checkbox-categoria-servicos-medicao-' + id"
                    :label="categoriasPreenchimentoAutomatico.SERVICO.nome"
                    :value="categoriasPreenchimentoAutomatico.SERVICO.valor"
                    :disabled="desativarCategoriaPreenchimentoSemItensParaMedir(servicos)"
                  ></v-checkbox>

                  <v-checkbox
                    v-model="categoriasPreenchimentoSelecionadas"
                    class="mx-4"
                    :id="'checkbox-categoria-despesas-medicao-' + id"
                    :label="categoriasPreenchimentoAutomatico.DESPESA.nome"
                    :value="categoriasPreenchimentoAutomatico.DESPESA.valor"
                    :disabled="desativarCategoriaPreenchimentoSemItensParaMedir(despesas)"
                  ></v-checkbox>
                </div>

                <div class="d-inline-flex align-center">
                  <v-btn
                    class="btn-edit-delete-icon width-icon"
                    :id="'btn-aplicar-periodo-categorias-selecionadas-' + id"
                    text
                    @click="aplicarPeriodoACategoriaSelecionada()"
                    :disabled="desativarBotaoAplicarPreenchimento()"
                  >
                    <v-icon class="flex-shrink-1 mr-1">
                      mdi-18px mdi-check-bold
                    </v-icon>
                    Aplicar
                  </v-btn>
                  <v-btn
                    class="btn-edit-delete-icon width-icon mr-0"
                    :id="'btn-limpar-periodo-categorias-selecionadas-' + id"
                    text
                    @click="limparPeriodoACategoriaSelecionada()"
                    :disabled="desativarBotaoLimparPreenchimento()"
                  >
                    <v-icon class="flex-shrink-1 mr-1">
                      mdi-18px mdi-eraser
                    </v-icon>
                    Remover
                  </v-btn>
                </div>
              </div>
            </div>
          </transition>
        </v-col>
      </v-row>
    </v-flex>

    <div>
      <equipamentos-medicao-locacao
        @onChange="() => calcularTotais()"
        @historicoRemessaRetorno="(item) => emitirEventoHistoricoRemessaRetorno(item)"
        :itensDaTabela="equipamentos"
        :id="'equipamentos-medicao-locacao-' + id"
        :identificadorProdutoPadrao="identificadorProdutoPadrao"
        v-if="equipamentos.length"
      ></equipamentos-medicao-locacao>

      <materiais-medicao-locacao
        @onChange="() => calcularTotais()"
        @historicoRemessaRetorno="(item) => emitirEventoHistoricoRemessaRetorno(item)"
        :itensDaTabela="materiais"
        :id="'materiais-medicao-locacao-' + id"
        :identificadorProdutoPadrao="identificadorProdutoPadrao"
        v-if="materiais.length"
      ></materiais-medicao-locacao>

      <servicos-medicao-locacao
        @onChange="() => calcularTotais()"
        :itensDaTabela="servicos"
        :id="'servicos-medicao-locacao-' + id"
        v-if="servicos.length"
      ></servicos-medicao-locacao>

      <despesas-medicao-locacao
        @onChange="() => calcularTotais()"
        :itensDaTabela="despesas"
        :dataInicioContrato="medicaoDaLocacao.dataInicioContrato"
        :dataTerminoContrato="medicaoDaLocacao.dataTerminoContrato"
        v-if="despesas.length"
      ></despesas-medicao-locacao>
    </div>

    <v-row no-gutters>
      <v-flex sm2 mt-2 text-right :class="{'bloco-desabilitado' : !equipamentos.length}">
        <h3 class="label-padrao">Equipamentos</h3>
        <p class="totalizadores-rodape">
          {{ totalizadores.equipamento | dinheiro }}
        </p>
      </v-flex>
      <v-flex sm2 mt-2 text-right :class="{'bloco-desabilitado' : !materiais.length}">
        <h3 class="label-padrao">Materiais</h3>
        <p class="totalizadores-rodape">
          {{ totalizadores.material | dinheiro }}
        </p>
      </v-flex>
      <v-flex sm2 mt-2 text-right :class="{'bloco-desabilitado' : !servicos.length}">
        <h3 class="label-padrao">Serviços</h3>
        <p class="totalizadores-rodape">
          {{ totalizadores.servico | dinheiro }}
        </p>
      </v-flex>
      <v-flex sm2 mt-2 text-right :class="{'bloco-desabilitado' : !despesas.length}">
        <h3 class="label-padrao">Despesas</h3>
        <p class="totalizadores-rodape">
          {{ totalizadores.despesa | dinheiro }}
        </p>
      </v-flex>
      <v-flex sm4 text-right>
        <h3 class="label-padrao">Total da medição</h3>
        <p class="total-orcamento">
          {{ totalDaMedicao | dinheiro }}
        </p>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import EquipamentosMedicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/EquipamentosMedicaoDeLocacao";
import MateriaisMedicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/MateriaisMedicaoDeLocacao";
import ServicosMedicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/ServicosMedicaoDeLocacao";
import DespesasMedicaoDeLocacao from "@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/opcoes-movimentacao-de-locacao/medicao-de-locacao/DespesasMedicaoDeLocacao";
import { CATEGORIAS_ITEM, CATEGORIAS_PREENCHIMENTO_AUTOMATICO } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import mascaraDinheiro from "@/utils/mascara-dinheiro";
import MedicaoLocacaoModel from "@/models/estoque/medicao/medicao-locacao-model";
import DatepickerMultipleValue from "@/components/comum/DatepickerMultipleValue";
import { PREENCHIMENTO_DATAS_MEDICAO } from "@/constants/faturamento/controle-de-locacao/medicao-constants";

export default {
  name: "MedicaoDeLocacao",
  components: {
    "equipamentos-medicao-locacao": EquipamentosMedicaoDeLocacao,
    "materiais-medicao-locacao": MateriaisMedicaoDeLocacao,
    "servicos-medicao-locacao": ServicosMedicaoDeLocacao,
    "despesas-medicao-locacao": DespesasMedicaoDeLocacao,
    DatepickerMultipleValue,
  },
  filters: {
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    },
  },
  props: {
    medicaoDaLocacao: {
      type: MedicaoLocacaoModel,
      required: false,
      default: new MedicaoLocacaoModel(),
    },
    identificadorProdutoPadrao: { type: String, default: undefined }
  },

  watch: {
    medicaoDaLocacao() {
      this.calcularTotais();
    },
  },

  computed: {
    equipamentos() {
      return this.medicaoDaLocacao.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO);
    },
    materiais() {
      return this.medicaoDaLocacao.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.MATERIAL);
    },
    servicos() {
      return this.medicaoDaLocacao.itens.filter((item) => item.categoria === CATEGORIAS_ITEM.SERVICO);
    },
    despesas() {
      return this.medicaoDaLocacao.despesas;
    },
    totalDaMedicao() {
      return (
        this.totalizadores.equipamento +
        this.totalizadores.material +
        this.totalizadores.servico +
        this.totalizadores.despesa
      );
    },
  },
  data() {
    return {
      id: "medicao-de-locacao",
      totalizadores: {
        material: 0,
        equipamento: 0,
        servico: 0,
        despesa: 0,
      },
      periodoMedicaoPreenchimentoAutomatico: [],
      categoriasPreenchimentoSelecionadas: [],
      categoriasPreenchimentoAutomatico: CATEGORIAS_PREENCHIMENTO_AUTOMATICO,
      exibirPreenchimentoAutomatico: false,
    };
  },
  methods: {
    emitirEventoHistoricoRemessaRetorno(item) {
      this.$emit('historicoRemessaRetorno', item);
    },

    filtroItemMedido(item) {
      return item.desmembramentos.some((d) => d.modeloAlterado());
    },

    calcularTotais() {
      this.totalizadores = this.medicaoDaLocacao.itens.reduce((totalizador, item) => {
        let valorTotalDesmembramentos = item.desmembramentos.reduce((anterior, apontamento) =>
          anterior + item.valorTotalParaMedicao(apontamento), 0);
        switch (item.categoria) {
          case CATEGORIAS_ITEM.EQUIPAMENTO:
            totalizador.equipamento += valorTotalDesmembramentos;
            break;
          case CATEGORIAS_ITEM.MATERIAL:
            totalizador.material += valorTotalDesmembramentos;
            break;
          case CATEGORIAS_ITEM.SERVICO:
            totalizador.servico += valorTotalDesmembramentos;
            break;
        }
        return totalizador;
      },
      {
        material: 0,
        equipamento: 0,
        servico: 0,
        despesa: 0,
      });
      this.totalizadores.despesa = this.medicaoDaLocacao.despesas.reduce((soma, despesa) => 
        despesa.valorTotalMedicaoDespesa() + soma, 0);
    },

    desativarDatepickerPreenchimentoSemItensParaMedir() {
      return !!(this.medicaoDaLocacao.itens.length) && this.medicaoDaLocacao.itens.every((i) => !i.desmembramentos.length) ||
        !!(this.medicaoDaLocacao.despesas.length) && this.medicaoDaLocacao.despesas.every((d) => !d.desmembramentos.length);
    },

    desativarCategoriaPreenchimentoSemItensParaMedir(categoria) {
      return !categoria.length ||
        categoria.every((i) => !i.desmembramentos.length) ||
        categoria.every((i) => i.desmembramentos.every((d) => d.totalmenteMedido));
    },

    desativarBotaoAplicarPreenchimento() {
      return !this.periodoMedicaoPreenchimentoAutomatico.length ||
        !this.categoriasPreenchimentoSelecionadas.length;
    },

    desativarBotaoLimparPreenchimento() {
      return !this.categoriasPreenchimentoSelecionadas.length;
    },

    aplicarPeriodoACategoriaSelecionada() {
      let periodo = this.periodoMedicaoPreenchimentoAutomatico;

      this.verificaPeriodoParaPreenchimento(periodo);
    },

    limparPeriodoACategoriaSelecionada() {
      let periodo = [];

      this.verificaPeriodoParaPreenchimento(periodo);
      this.periodoMedicaoPreenchimentoAutomatico = [];
      this.categoriasPreenchimentoSelecionadas = [];
    },

    verificaPeriodoParaPreenchimento(periodo) {
      let primeiraDataPeriodo = [];

      this.categoriasPreenchimentoSelecionadas.forEach(
        categoria => {
          switch (categoria) {
            case CATEGORIAS_PREENCHIMENTO_AUTOMATICO.EQUIPAMENTO.valor:
              this.preencherDatasAMedirDosItens(CATEGORIAS_PREENCHIMENTO_AUTOMATICO.EQUIPAMENTO.valor, periodo);
            break;
            case CATEGORIAS_PREENCHIMENTO_AUTOMATICO.MATERIAL.valor:
              primeiraDataPeriodo.push(periodo[0]);

              this.preencherDatasAMedirDosItens(CATEGORIAS_PREENCHIMENTO_AUTOMATICO.MATERIAL.valor, primeiraDataPeriodo);
            break;
            case CATEGORIAS_PREENCHIMENTO_AUTOMATICO.SERVICO.valor:
              this.preencherDatasAMedirDosItens(CATEGORIAS_PREENCHIMENTO_AUTOMATICO.SERVICO.valor, periodo);
            break;
            case CATEGORIAS_PREENCHIMENTO_AUTOMATICO.DESPESA.valor:
              this.preencherDatasAMedirDasDespesas(periodo);
            break;
          }
        }
      );
    },
  
    preencherDatasAMedirDosItens(categoria, periodo) {
      this.medicaoDaLocacao.itens
        .filter((i) => i.categoria === categoria)
        .forEach((item) =>
          item.desmembramentos
            .filter((d) => !d.totalmenteMedido)
            .forEach((desmembramento) =>
              desmembramento.datasAMedir = periodo
            )
        );
      
      let mensagem = (categoria && categoria.length) && (periodo && periodo.length) ?
        PREENCHIMENTO_DATAS_MEDICAO.APLICAR.MENSAGEM :
        PREENCHIMENTO_DATAS_MEDICAO.REMOVER.MENSAGEM;

      this.$mensagemFlutuante.sucesso({titulo: mensagem});

      this.calcularTotais();
    },

    preencherDatasAMedirDasDespesas(periodo) {
      this.medicaoDaLocacao.despesas.forEach((despesa) =>
        despesa.desmembramentos
          .filter((d) => !d.totalmenteMedido)
          .forEach((desmembramento) =>
            (desmembramento.datasAMedir = periodo)
          )
      );

      let mensagem = periodo && periodo.length  ?
        PREENCHIMENTO_DATAS_MEDICAO.APLICAR.MENSAGEM :
        PREENCHIMENTO_DATAS_MEDICAO.REMOVER.MENSAGEM;

      this.$mensagemFlutuante.sucesso({titulo: mensagem});

      this.calcularTotais();
    }
  },
};
</script>

<style lang="scss" scoped>
.altura-linha-preenchimento-automatico {
  min-height: 66px;
}

.v-btn.btn-tertiary.btn-preenchimento-automatico { width: 200px; }

::v-deep .text-field-datadatepicker-multiplo-preenchimento-automatico-periodo-medicao-medicao-de-locacao {
  padding-top: 0;
  margin-top: 0;
}

::v-deep .limite-altura > div { 
  padding-bottom: 0;
}
</style>