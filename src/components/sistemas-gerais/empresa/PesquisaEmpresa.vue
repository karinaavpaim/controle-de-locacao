<template>
  <v-layout color="transparent" :id="id">
    <v-autocomplete
      :hide-no-data="desabilitarMensagemNaoHaDados"
      :id="'autocomplete-empresa-'+id"
      @blur="onBlur"
      v-model="model"
      :items="listaItens"
      :loading="carregando"
      :search-input.sync="localizar"
      :disabled="desabilitar"
      :label="label"
      :placeholder="placeholder"
      :item-text="atributoExibicao"
      :item-value="atributoValor"
      :clearable="limparCampo"
      return-object
      auto-select-first
      autocomplete="off"
      ref="inputEmpresa"
      :hint="hint"
      :persistent-hint="persistentHint"
    ></v-autocomplete>
  </v-layout>
</template>

<script>
import EmpresaModel from "@/models/geral/empresa-model";
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";

export default {
  model: {
    prop: "itemSelecionado",
    event: "onChange"
  },
  props: {
    id: { type: String, required: true, default: ()=> 'pesquisa-empresa' },
    hint: { type: String },
    persistentHint: { type: Boolean, default: false },
    label: { type: String, required: true },
    placeholder: { type: String, required: false },
    itemSelecionado: { type: EmpresaModel, required: false, default: undefined },
    atributoExibicao: { type: String, required: true },
    atributoValor: { type: String, required: true },
    desabilitar: { type: Boolean, default: false },
    focus: { type: Boolean, default: false },
    limparCampo: { type: Boolean, default: true },
    empresaDoSistema: { type: Boolean, default: false }
  },
  data() {
    return {
      desabilitarMensagemNaoHaDados: true,
      carregando: false,
      listaItens: this.itemSelecionado ? [this.itemSelecionado] : [],
      listaItensBase: [],
      localizar: "",
      model: this.itemSelecionado
    };
  },
  watch: {
    itemSelecionado(item) {
      this.model = item;
    },

    focus(valor) {
      if (valor) {
        this.$nextTick(() => {
          this.$refs.inputEmpresa.focus();
        });
        this.onFocus();
      }
    },

    model() {
      this.notificarEmpresaAlterada();
    }
  },
  created() {
    this.obterListaDeEmpresas();
  },
  methods: {
    async obterListaDeEmpresas() {
      this.carregando = true;
      try {
        let empresas = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.LISTA_EMPRESAS];
        this.listaItens = empresas || [];
        this.listaItensBase = empresas || [];
      }
      catch(erro){
        let mensagemErro = Array.isArray(erro) && erro[0] && erro[0].statusText || erro;
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter as informações de empresa.`, 
          mensagem: mensagemErro || `Por favor, tente carregar novamente esta página.`
        });
        this.carregando = false;
      }
      finally{
        this.carregando = false;
        this.desabilitarMensagemNaoHaDados = false;
      }
    },

    onFocus() {
      this.$emit("onFocus");
    },

    notificarEmpresaAlterada() {
      this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL].then((empresa) => {
        if (this.model && empresa && (empresa.identificador != this.model.identificador)) {
          this.empresaDoSistema && this.$store.dispatch(OPCOES_STORE_EMPRESA.ACTIONS.ALTERAR_EMPRESA_ATUAL, new Promise((resolve)=>resolve(this.model)));
        }
      });

      if (this.model && this.itemSelecionado && (this.model.codigo === this.itemSelecionado.codigo))
        return; // nao permitir emit com mesmo objeto
      this.$emit("onChange", this.model);
    },

    onBlur() {
      if (!this.$refs.inputEmpresa.selectedItem) {
        this.model = undefined;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep div.theme--light.v-list-item.v-list-item--highlighted::before {
  opacity: 0;
}
</style>