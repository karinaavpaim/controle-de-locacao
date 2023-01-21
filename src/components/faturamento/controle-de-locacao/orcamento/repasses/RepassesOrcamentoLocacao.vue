<template>
  <div :id="id">
    <v-layout wrap>
      <v-flex sm12 text-left>
        <v-row class="ma-0 pa-0">
          <v-col cols="8" class="ma-0 pa-0">
            <v-btn class="btn-secondary-icon width-icon margem-zero" text @click="exibirModalAdicionarRepasse()" :id="'btn-adicionar-'+id">
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
              :disabled="repasses.length === 0"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-flex>

      <v-flex sm12 lg12>
        <v-flex sm12 v-show="(repasses.length > 0)">
          <v-data-table
            :headers="colunasRepasse"
            :items="itensFiltrados"
            class="contorno-tabela"
            :items-per-page="5"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.identificador">
                  <td class="text-left"><destaque-pesquisa :pesquisa="pesquisa">{{ item.pessoa.codigo }}</destaque-pesquisa></td>
                  <td class="text-left"><destaque-pesquisa :pesquisa="pesquisa">{{ item.pessoa.nome }}</destaque-pesquisa></td>
                  <td class="text-left"><destaque-pesquisa :pesquisa="pesquisa">{{ item.pessoa.categorias.map(p=>p.nome).join(", ") }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.aliquotaFaturamento | formataAliquota }}</destaque-pesquisa></td>
                  <td class="text-right"><destaque-pesquisa :pesquisa="pesquisa">{{ item.aliquotaDuplicata | formataAliquota }}</destaque-pesquisa></td>
                  <td class="text-right nowrap px-0">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mx-1" x-small icon color="primary" @click="editarRepasse(item)" :id="'btn-editar-'+id" v-on="on">
                          <v-icon>edit</v-icon>
                        </v-btn>                        
                      </template>
                      <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="mr-4" x-small icon color="primary" @click="verificarExclusaoDoItemDaTabela(item)" :id="'btn-excluir-'+id" v-on="on">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex mt-2 xs12 v-show="(repasses.length == 0)">
          <v-layout wrap class="card-no-data py-12">
            <v-flex xs12>
              <span class="subheader">Não há repasses adicionados neste orçamento.</span>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout wrap>
      <v-dialog @keydown.esc="dialogRepasses = false" v-model="dialogRepasses" persistent max-width="60%">
        <v-card>
          <v-col cols="12" class="pa-0">
            <v-row no-gutters>
              <v-col cols="6">
                <v-card-title class="display-block">
                  <h2 class="titulo-modal">{{ (editarRepasseSelecionado) ? 'Editar' : 'Adicionar' }} repasse</h2>
                </v-card-title>
              </v-col>

              <v-col cols="6">
                <v-alert text dense color="red" border="left" class="notificacao-alerta mt-3 mb-0 mr-4" v-if="!!camposObrigatorios">
                  <span>{{ camposObrigatorios }}</span>
                </v-alert>
              </v-col>
            </v-row>
          </v-col>

          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 sm12 mx-2>
                  <v-row>
                    <v-flex xs12 sm8 px-2>
                      <pesquisa-pessoa
                        :id="'pesquisa-pessoa-pessoa-repasse-'+id"
                        v-model="repasse.pessoa"
                        @onFocus="campoPessoaFocada"
                        :focus="focusCampoPessoa"
                        items="[]"
                        label="Pessoa para repasse"
                        atributoExibicao="codigoNome"
                        placeholder="Pesquise pelo código ou por um trecho do nome"
                        :categoriasDePessoa="['REPRESENTANTE','FUNCIONARIO']">
                      </pesquisa-pessoa>
                    </v-flex>

                    <v-flex xs12 sm2 px-2>
                      <campo-numero 
                        :id="'campo-numero-aliquota-faturamento-'+id"
                        label="Alíquota faturamento"
                        class="tipo-numero"
                        v-model="repasse.aliquotaFaturamento"
                        :maxlength="6"
                        sufixo="%"
                      ></campo-numero>
                    </v-flex>

                    <v-flex xs12 sm2 px-2>
                      <campo-numero 
                        :id="'campo-numero-aliquota-duplicata-'+id"
                        label="Alíquota duplicata"
                        class="tipo-numero"
                        v-model="repasse.aliquotaDuplicata"
                        :maxlength="6"
                        sufixo="%"
                      ></campo-numero>
                    </v-flex>
                  </v-row>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="btn-primary" text @click="salvarRepasseTabela()" :id="'btn-salvar-'+id">
              Salvar
            </v-btn>
            <v-btn class="btn-tertiary" text @click="cancelarAdicaoRepasse()" :id="'btn-cancelar-'+id">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import PesquisaPessoa from '@/components/sistemas-gerais/pessoa/PesquisaPessoa.vue';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import RepasseModel from '@/models/faturamento/orcamento-locacao/repasse-model';
import { COLUNAS_REPASSES } from '@/constants/faturamento/controle-de-locacao/repasses-orcamento-locacao-constants.js';
import CampoNumero from "@/components/comum/CampoNumero";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";

export default {
  components: {
    PesquisaPessoa,
    CampoNumero,
    DestaquePesquisa
  },

  model: {
    prop: 'itensDoOrcamento',
    event: 'onChange'
  },

  props: {
    id: { type: String, required: false, default: ()=> 'repasses-orcamento' },
    itensDoOrcamento: { type: Array, required: true },
    modoEdicao: {type: Boolean , default: false}
  },

  filters: {
    formataAliquota(valor) {
      return (valor + "%").replace(".", ",");
    },
  },

  computed: {
    itensFiltrados() {
      // verifica se tem um termo para comparar e se o valor do comparado nao for 
      // nulo ou booleano, busca pelo minusculo das strings
      let comparador = (valor, busca) => !busca || (valor != null && typeof valor !== 'boolean' && valor.toString().toLocaleLowerCase().indexOf(busca.toLocaleLowerCase()) !== -1)
      return this.repasses.filter(r => {
        return this.valoresDoItemParaFiltro(r).some(v => comparador(v, this.pesquisa))
      });
    }
  },

  data: () => ({
    dialogRepasses: false,
    focusCampoPessoa: false,
    editarRepasseSelecionado: false,
    colunasRepasse: COLUNAS_REPASSES,
    repasses: [],
    repasse: new RepasseModel(),
    camposObrigatorios: "",
    editando: false,
    cont: 1,
    index: -1,
    pesquisa: ""
  }),

  watch: {
    itensDoOrcamento() {
      this.obterRepassesVindoDosItens();
      /*TODO: Faço essa validação, pois o mounted deste compomente acontece antes 
      mesmo do orcamento ser obtido para edição, com isso, quando obtenho os itens pela primeira vez o Watch 
      está sendo disparado colocando o total de repasses igual 0. Na primeira vez ele não pode chamar o metodo adicionarRepassesNosItensDoOrcamento.
      Se der tempo na sprint, melhorar essa lógica.
       */
      if (this.modoEdicao && this.cont == 1) {
        this.editando = true;
        this.cont = 0;
        return;
      }

      this.cont = 0;
      this.adicionarRepassesNosItensDoOrcamento()
    }
  },
  
  mounted() {
    this.obterRepassesVindoDosItens();
  },

  methods: {
    valoresDoItemParaFiltro(item){
      return [ 
        item.pessoa.codigo,
        item.pessoa.nome,
        item.pessoa.categorias.map(p=>p.nome).join(", "),
        this.$options.filters.formataAliquota(item.aliquotaFaturamento),
        this.$options.filters.formataAliquota(item.aliquotaDuplicata)
      ]
    },

    obterRepassesVindoDosItens() {
      if (this.itensDoOrcamento.length > 0 && this.itensDoOrcamento.some(item => item.repasses.length > 0)) {
        /* AVISO:
         Estamos utilizando o primeiro item com repasses e removendo os identificadores dos repasses para forçar que o backend recadastre todos.
         Isso é necessário, pois os repasses são por itens e no controle de locação, trabalhamos como se fosse geral.
         Com isso, fica impossível saber se estamos editando um repasse ou vários semelhantes.
         O ideal é alterar o layout para trabalhar com repasse por item.
        */
        this.repasses = this.itensDoOrcamento.find(item => item.repasses.length > 0).repasses.map(r => new RepasseModel(r));
        this.repasses.forEach(repasse => repasse.identificador = undefined);
      }
    },

    exibirModalAdicionarRepasse(repasse) {
      this.editarRepasseSelecionado = false;
      this.dialogRepasses = true;
      this.limparModal();
      
      this.$nextTick(() => {
        this.focusCampoPessoa = true;
      });

      if (!repasse) return;

      this.preencherModal(repasse);
    },

    campoPessoaFocada() {
      this.focusCampoPessoa = false;
    },

    preencherModal(repasse) {
      this.repasse.aliquotaFaturamento = repasse.aliquotaFaturamento;
      this.repasse.aliquotaDuplicata = repasse.aliquotaDuplicata;
      this.repasse.pessoaPrincipal = repasse.pessoaPrincipal;
      this.repasse.pessoa = new PessoaModel(repasse.pessoa);
    },

    adicionarRepassesNosItensDoOrcamento() {
      if (this.itensDoOrcamento.length > 0) {
        this.itensDoOrcamento.map((e) => {
          this.preencherRepasses(e.repasses, this.repasses);
        });
      }
    },

    preencherRepasses(repassesItem, repassesTabela) {
      let identificadoresJaExistentes = repassesItem.map(r => r.pessoa.identificador);

      repassesTabela.filter(r => 
        identificadoresJaExistentes.includes(r.pessoa.identificador)
      ).forEach(repasseTabela => {
        // EDITAR
        let repasseItem = repassesItem.find(ri => ri.pessoa.identificador == repasseTabela.pessoa.identificador);
        repasseItem.aliquotaFaturamento = repasseTabela.aliquotaFaturamento;
        repasseItem.aliquotaDuplicata = repasseTabela.aliquotaDuplicata;
      });

      repassesTabela.filter(r => 
        !identificadoresJaExistentes.includes(r.pessoa.identificador)
      ).forEach(repasseTabela => {
        // INCLUIR
        repassesItem.push(repasseTabela);
      });

      let identificadoresNovos = repassesTabela.map(r => r.pessoa.identificador);

      identificadoresJaExistentes.filter(identificador => 
        !(identificadoresNovos.includes(identificador))
      ).forEach(identificador => {
        // EXCLUIR
        let indice = repassesItem.findIndex(ri => ri.pessoa.identificador == identificador);

        repassesItem.splice(indice, 1);
      });
    },

    cancelarAdicaoRepasse() {
      this.limparModal();
      this.dialogRepasses = false;
    },

    limparModal() {
      this.repasse = new RepasseModel();
      this.camposObrigatorios = "";
    },

    removerRepasseAdicionadoNaLista(repasse) {
      const index = this.obterPosicaoDoRepasseNaListaDeRepassesAdicionadas(
        repasse
      );
      this.repasses.splice(index, 1);
    },

    obterPosicaoDoRepasseNaListaDeRepassesAdicionadas(repasse) {
      return this.repasses
        .map(r => {
          return r.pessoa.identificador;
        })
        .indexOf(repasse.pessoa.identificador);
    },

    confirmarSeORepasseFoiAdicionadoNaTabela(repasse) {
      return (this.obterPosicaoDoRepasseNaListaDeRepassesAdicionadas(repasse) >= 0);
    },

    salvarRepasseTabela() {
      if (!this.validarRepasse()) {
        this.camposObrigatorios = "Pessoa para repasse é um campo obrigatório.";
        return;
      }

      if (this.editarRepasseSelecionado) {
        this.removerRepasseAdicionadoNaLista(this.repasse);
      }

      if (this.confirmarSeORepasseFoiAdicionadoNaTabela(this.repasse)) {
        this.camposObrigatorios = `Não é possível adicionar a mesma pessoa de repasse.`;
        return;
      }

      this.repasses.push(this.repasse);
      this.adicionarRepassesNosItensDoOrcamento();
      this.dialogRepasses = false;
      this.editarRepasseSelecionado = false;
      this.limparModal();
    },

    questionarUsuarioSobreDeletarItemDaTabela() {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Exclusão do repasse`;
      cfgMsg.mensagem = `Confirma a exclusão deste repasse?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.deletarItemDaTabela;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    deletarItemDaTabela() {
      this.repasses.splice(this.index, 1);
      this.adicionarRepassesNosItensDoOrcamento();
    },

    verificarExclusaoDoItemDaTabela(item) {
      this.index = this.repasses.indexOf(item);
      this.questionarUsuarioSobreDeletarItemDaTabela();
    },

    editarRepasse(repasse) {
      this.editarRepasseSelecionado = true;
      this.$nextTick(() => {
        this.repasse = new RepasseModel(repasse);
      });
      this.dialogRepasses = true;
    },

    validarRepasse() {
      //valido apenas pessoa pois é o unico sem valor padrao
      return (!!this.repasse.pessoa && this.repasse.pessoa.modeloValido());
    }
  }
};
</script>

<style lang="scss" scoped>
</style>