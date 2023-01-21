<template>
  <v-layout color="transparent" mt-0 :id="id">
    <v-autocomplete
      :hide-no-data="desabilitarMensagemNaoHaDados"
      :id="id?'autocomplete-pessoa-'+id:id"
      :class="classeId?'autocomplete-pessoa-'+classeId:classeId"
      @change="emitirItem"
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      :disabled="desabilitar"
      :label="label"
      :placeholder="placeholder"
      :item-text="atributoExibicao"
      :rules="rules"
      return-object
      @keyup="onKeyUp"
      auto-select-first
      clearable
      :autofocus="focus"
      ref="inputPessoa"
      autocomplete="off"
    >
      <template v-slot:append-outer>
        <v-tooltip bottom v-if="!desabilitar">
          <template v-slot:activator="{ on }">
            <v-icon 
              :id="id?'icon-pesquisa-avancada-'+id:id" 
              :class="classeId?'icon-pesquisa-avancada-'+classeId:classeId" 
              class="bg-icon mr-1" 
              color="primary" 
              @click="exibirModalPesquisaAvancada()" v-text="'mdi-magnify'" v-on="on"
            ></v-icon>
          </template>
          <span>Pesquisa avançada</span>
        </v-tooltip>

        <v-dialog v-model="dialog" persistent scrollable max-width="50%">
          <v-card>
            <v-card-title>
              <h2 class="titulo-modal">{{ modoFiltro ? 'Localização de pessoas' : 'Seleção de pessoas' }}</h2>
            </v-card-title>

            <v-card-text class="px-4 py-0">
              <div v-if="modoFiltro">
                <v-row no-gutters>
                  <v-col cols="12" sm="2" md="2" class="py-0 pr-2">
                    <v-text-field 
                      :id="id?'textfield-codigo-'+id:id"
                      :class="classeId?'textfield-codigo-'+classeId:classeId" 
                      autofocus
                      label="Código"
                      v-model="pessoaPesquisaAvancada.codigo"
                      autocomplete="off"
                      maxlength="6"
                      counter="6"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="10" md="10" class="py-0 pl-2">
                    <v-text-field 
                      :id="id?'textfield-nome-'+id:id"
                      :class="classeId?'textfield-nome-'+classeId:classeId" 
                      label="Nome ou nome curto"
                      v-model="pessoaPesquisaAvancada.nome"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="6" md="6" class="py-0 pr-2">
                    <v-text-field 
                      :id="id?'textfield-cpf-cnpj-'+id:id"
                      :class="classeId?'textfield-cpf-cnpj-'+classeId:classeId" 
                      label="CPF ou CNPJ"
                      v-model="pessoaPesquisaAvancada.CPFouCNPJ"
                      autocomplete="off"
                      v-mask="['###.###.###-##', '##.###.###/####-##']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" class="py-0 pl-2">
                    <v-text-field 
                      :id="id?'textfield-contato-'+id:id"
                      :class="classeId?'textfield-contato-'+classeId:classeId" 
                      label="Contato"
                      v-model="pessoaPesquisaAvancada.meioDeContato"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <div v-if="!modoFiltro">
                <div v-if="pessoaNaoEncontrada" class="mensagem-pessoa-nao-encontrada">
                  <span>Nenhuma pessoa encontrada!</span>
                </div>
                <div v-if="!!listaItens && !pessoaNaoEncontrada && !dialogCarregamento">
                  <v-list dense>
                    <v-list-item-group color="primary">
                      <v-list-item v-for="item in listaItens" :key="item.identificador">
                        <v-list-item-content>
                          <v-list-item-title :class="classeId||id?'list-item-pessoa-'+classeId||id:id" @click="selecionarPessoa(item)" v-text="item.codigoNomeCPFouCNPJ"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </div>

              <div v-show="dialogCarregamento" class="icone-de-progresso-circular-pesquisa">
                <v-progress-circular :size="130" color="primary" indeterminate></v-progress-circular>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions :class="(dialogCarregamento) ? 'card-action': ''">
              <v-spacer></v-spacer>
              <v-btn
                :id="id?'btn-pesquisar-'+id:id"
                :class="classeId?'btn-pesquisar-'+classeId:classeId" 
                v-if="modoFiltro"
                class="btn-primary"
                text
                @click="pesquisarPessoa"
                :disabled="(!pessoaPesquisaAvancada.modeloValido() && modoFiltro) || dialogCarregamento"
              >
                Pesquisar
              </v-btn>
              <v-btn :id="id?'btn-voltar-'+id:id" :class="classeId?'btn-voltar-'+classeId:classeId"  v-if="!modoFiltro" class="btn-tertiary" text @click="modoFiltro = !modoFiltro">Voltar</v-btn>
              <v-btn :id="id?'btn-fechar-'+id:id" :class="classeId?'btn-fechar-'+classeId:classeId"  class="btn-tertiary" text @click="fecharModal">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-autocomplete>

    <alerta
      :tipo="tipoAlerta"
      :mensagem="mensagemAlerta"
      :exibir="exibirAlerta"
      identificador="alerta-pesquisa-pessoa"
    ></alerta>
  </v-layout>
</template>

<script>
import pessoaAPI from "@/api/sistemas-gerais/pessoa-api.js";
import Alerta from "@/components/comum/Alerta.vue";
import PessoaModel from "@/models/geral/pessoa/pessoa-model";
import { TEMPO_ESPERA_PARA_PESQUISA_AUTOCOMPLETE, INPUT_KEY_CODES } from "@/constants/comum/configuracoes-constants";
import PessoaPesquisaAvancadaModel from "@/models/geral/pessoa/pessoa-pesquisa-avancada-model";

export default {
  components: {
    Alerta
  },

  model: {
    prop: "itemSelecionado",
    event: "onChange"
  },

  props: {
    id: { type: String, required: false},
    classeId: { type: String, required: false},
    itemSelecionado: { type: PessoaModel },
    //Propriedade criada para casos onde apenas o identificador é passado para o componente pai.
    //Deve ser utilizada com .sync e apenas em extrema necessidade.
    identificadorPessoa: { type: String, default: undefined },
    label: { type: String, required: true },
    placeholder: { type: String, required: false, default: "Digite o código ou nome para pesquisar" },
    rules: { type: Array, required: false, default: () => [] },
    atributoExibicao: { type: String, required: true },
    desabilitar: { type: Boolean, default: false },
    focus: { type: Boolean, default: false },
    habilitarPesquisaAvancada: { type: Boolean, default: false },
    categoriasDePessoa: { type: Array, default: () => [] },
  },

  data() {
    return {
      desabilitarMensagemNaoHaDados: true,
      isLoading: false,
      listaItens: this.itemSelecionado ? [this.itemSelecionado] : [],
      search: null,
      model: this.itemSelecionado,
      pesquisando: false,
      mensagemAlerta: undefined,
      exibirAlerta: false,
      tipoAlerta: undefined,
      resultado: false,
      timeoutId: 0,
      emEdicao: true,
      modoFiltro: true,
      dialog: false,
      dialogCarregamento: false,
      pessoaNaoEncontrada: false,
      pessoaPesquisaAvancada: new PessoaPesquisaAvancadaModel()
    };
  },

  computed: {
    items() {
      return this.listaItens.map(item => {
        return new PessoaModel(item);
      });
    }
  },

  watch: {
    itemSelecionado() {
      this.listaItens = this.itemSelecionado ? [this.itemSelecionado] : [];
      this.model = this.itemSelecionado;
    },

    identificadorPessoa() {
      // neste momento, esta propriedade esta sendo utilizada para limpar o conteudo do componente (o valor capturado sempre sera undefined para limpar o componente)
      // no futuro, caso seja necessario entrar com um identificador, a funcionalidade devera ser adicionada
      if (!this.identificadorPessoa && !this.itemSelecionado)
        this.model = undefined;
    },

    focus(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.inputPessoa.focus();
          this.onFocus();
        });
      }
    }
  },

  methods: {
    onFocus() {
      this.$emit("onFocus");
    },

    exibirModalPesquisaAvancada() {
      this.dialog = true;
      this.emEdicao = !this.emEdicao;
    },

    fecharModal() {
      this.modoFiltro = true;
      this.dialog = false;
      this.emEdicao = true;
      this.pessoaNaoEncontrada = false;
      this.pessoaPesquisaAvancada = new PessoaPesquisaAvancadaModel();
    },

    selecionarPessoa(item) {
      this.model = item;
      this.dialog = false;
      this.emitirItem()
      this.modoFiltro = true;
    },

    pesquisarPessoa() {
      if (!this.pessoaPesquisaAvancada.modeloValido()) {
        this.isLoading = false;
        return;
      }

      this.pessoaPesquisaAvancada.preencherOCodigoComZerosAEsquerda();
      this.isLoading = true;
      this.modoFiltro = false;
      this.dialogCarregamento = true;
      this.localizarPessoaPesquisaAvancada(this.pessoaPesquisaAvancada);
    },

    onKeyUp(evt) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }

      if (!this.search) {
        this.listaItens = [];
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      if (evt.keyCode === INPUT_KEY_CODES.enter) {
        this.localizarPessoasPorTrechoEAdicionarNaListagem(this.search);
        return;
      }

      this.timeoutId = setTimeout(() => {
        this.timeoutId = 0;
        this.desabilitarMensagemNaoHaDados = true;
        this.localizarPessoasPorTrechoEAdicionarNaListagem(this.search);
      }, TEMPO_ESPERA_PARA_PESQUISA_AUTOCOMPLETE);
    },

    localizarPessoaPesquisaAvancada(pessoaPesquisaAvancada) {
      pessoaPesquisaAvancada.identificadoresCategoria = this.categoriasDePessoa;

      pessoaAPI
        .localizarPessoaPesquisaAvancada(pessoaPesquisaAvancada)
        .then(resultado => {
          this.dialogCarregamento = false;
          if (resultado.length == 0) {
            this.pessoaNaoEncontrada = true;
            return;
          }

          this.listaItens = resultado;
          this.pessoaNaoEncontrada = false;
          this.pessoaPesquisaAvancada = new PessoaPesquisaAvancadaModel();
        })
        .catch(erro => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter as pessoas.`,
            mensagem: `Motivo: ${erro[0].statusText}`
          });
          this.dialogCarregamento = false;
        })
        .finally((this.isLoading = false));
    },

    localizarPessoasPorTrechoEAdicionarNaListagem(texto) {
      this.isLoading = true;
      pessoaAPI
        .localizarPessoa(texto, this.categoriasDePessoa)
        .then(resultado => {
          this.listaItens = resultado || [];
        })
        .finally(() => {
          this.isLoading = false;
          this.desabilitarMensagemNaoHaDados = false;
        });
    },

    emitirItem() {
      this.$emit("onChange", this.model ? this.model : undefined);
      this.$emit("update:identificadorPessoa", this.model ? this.model.identificador: undefined);
    }
  }
};
</script>

<style lang="scss" scoped>
.micro-copia {
  font-size: 12px;
  color: $cor_terciaria3;
  font-weight: 300;
}

.mensagem-pessoa-nao-encontrada {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 60px;
}
</style>