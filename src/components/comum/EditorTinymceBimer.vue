<template>
  <v-app :id="id.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-app'">
    <v-container justify-space-around>
      <v-layout wrap>
        <v-flex xs12 sm12 md12>
            <editor-tinymce
              v-if="mostrar"
              v-model="textoDoEditor"
              :id="id.replace(/[^a-z0-9]/gi, '-').toLowerCase()"
              @onFocusIn="focusIn"
              @onFocusOut="focusOut"
              :init="init"
              :initial-value="inicial"
              :disabled="desabilitarEditor"
            >
            </editor-tinymce>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import "tinymce/tinymce";

// Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/bbcode";
import "tinymce/plugins/codesample";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/charmap";
import "tinymce/plugins/print";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/fullpage";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/paste";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/template";
import "tinymce/plugins/image";
import "tinymce/plugins/pagebreak";
import "@/plugins/editor-tinymce/svg-material-icons-editor.js";
import variaveisEditor from "@/plugins/editor-tinymce/inserir-variaveis-editor.js";
import { TIPOS_MODELOS } from "../../constants/faturamento/controle-de-locacao/modelo-proposta-constants";

// Variável global para controlar as variáveis fora do estado do vue.js
let modeloVariavel = TIPOS_MODELOS.PROPOSTA.VALOR;

export default {
  model: {
    prop: "entrada",
    event: "onChange",
  },
  props: {
    inicial: {
      type: String,
    },
    entrada: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: "editor-tinemce-bimer",
    },
    editorToolbar: {
      type: String,
      default: ` undo redo pagebreak print formatselect 
                 fontselect fontsizeselect bold italic underline 
                  alignleft aligncenter alignright 
                 alignjustify outdent indent numlist bullist 
                 forecolor backcolor removeformat table`,
    },
    templatesDoEditor: {
      type: Array,
      default: () => []
    },
    variaveisDoEditor: {
      type: Object,
      default: () => {}
    },
    alturaDoEditor: {
      type: Number,
      default: 550
    },
    desabilitarEditor:{
      type: Boolean,
      default: false
    },
    tipoModelo: { type: String, default: TIPOS_MODELOS.PROPOSTA.VALOR },
  },
  components: {
    //Isso forca que as variaveis sejam carregadas antes da inicializacao do componentes em si
    // Foi necessario pois as callbacks do vue nao estavam sendo o suficiente. O editor estava sendo carregado
    // antes mesmo do request terminar.
    "editor-tinymce": (resolve) => {
      variaveisEditor.init(modeloVariavel).then(() => resolve(Editor));
    },
  },

  watch: {
    entrada(novoValor) {
      this.setNovoValorNoEditor(novoValor);
    },

    textoDoEditor(valor) {
      this.change(valor);
    },

    tipoModelo() {
      modeloVariavel = this.tipoModelo;
      this.forcarComponenteRenderizar();
    },
  },

  data() {
    return {
      mostrar: true,
      textoDoEditor: "",
      init: {
        extended_valid_elements: "span[nome-variavel|style|contenteditable]",
        selector: "textarea",
        theme: "silver",
        icons: "material",
        height: this.alturaDoEditor,
        branding: false,
        relative_urls: false,
        external_plugins: {
          inserirdados: "",
          "inserirdados-auto-complete": "",
        },
        plugins: [
          "print advlist autolink lists link image charmap print preview",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code wordcount pagebreak",
        ],
        menubar: "",
        contextmenu: false,
        // contextmenu: "copy | inserttable  cell row column deletetable",
        toolbar: `${this.editorToolbar}`,
        templates: this.templatesDoEditor,
        template_replace_values: this.variaveisDoEditor,
        language: "pt_BR",
        content_style: "@media print{@page{size:auto;margin:0;}}",
      }
    };
  },

  mounted() {
    /*
     * Altero o valor da variavel aqui pois não tenho acesso no components para usar um prop ou um data.
     * Com isso controlo o estado da váriavel fora do vue.js.
     */
    modeloVariavel = this.tipoModelo;
  },
  methods: {
    //TODO: Fiz desta forma pois nao consegui de outra forma acessar o compomente via CSS.
    //O tinymce nao cria o editor dentro do textarea, ele cria um iframe fora do contexto.
    //futuramente com mais calma, encontrar uma forma de  alterar o focus de maneira mais elegante.
    focusIn() {
      document
        .querySelector("div.tox-sidebar-wrap > .tox-edit-area")
        .classList.add("focus");
      document
        .querySelector(".tox-tinymce > div.tox-statusbar")
        .classList.add("focus");
    },

    focusOut() {
      document
        .querySelector("div.tox-sidebar-wrap > .tox-edit-area")
        .classList.remove("focus");
      document
        .querySelector(".tox-tinymce > div.tox-statusbar")
        .classList.remove("focus");
    },

    setNovoValorNoEditor(novoValor) {
      this.textoDoEditor = novoValor || "";
    },

    change(novoValor) {
      this.$emit("onChange", novoValor ? novoValor : undefined);
    },

    /**
     * Metodo para forçar a atualização do componente para troca dinâmica das variáveis.
     */
    forcarComponenteRenderizar() {
      variaveisEditor.init(this.tipoModelo)
      .then(() => {
        this.mostrar = false;
        this.$nextTick(() => {
          this.mostrar = true;
        });
      });
    },
  },
};
</script>

<style lang="scss">
%borda-esquerda-direita-defaul {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

%ajustes-divs-internas-toolbar {
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(50, 50, 50, 0.1);
  padding: 5px;
}

.tox.tox-tinymce {
  border: none;
}

div.tox.tox-tinymce {
  border-left: none;
  border-right: none;
}

.tox-toolbar {
  border: none;
}

.tox-toolbar .tox-toolbar__group:first-child {
  border: none;
  @extend %ajustes-divs-internas-toolbar;
}

div .tox .tox-toolbar {
  margin: 10px 2px 10px 2px;
  border: none;
  background: none;
  background-color: #fff;
  width: 100%;
  padding-right: 4px;
}

div.tox-statusbar {
  @extend %borda-esquerda-direita-defaul;
}

div.tox .tox-toolbar__primary {
  background-image: none;
}

div.tox-sidebar-wrap > .tox-edit-area {
  box-shadow: 0 0 12px 0 rgba(50, 50, 50, 0.12);
  margin-left: 2px;
  margin-right: 2px;
}

div.tox-sidebar-wrap > .tox-edit-area.focus {
  box-shadow: 0 0 2px 0 $cor-primaria;
  margin-left: 2px;
  margin-right: 2px;
}

.tox-tinymce > div.tox-statusbar {
  box-shadow: 0 0 12px 0 rgba(50, 50, 50, 0.12);
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 4px;
  border-top: none;
}
.tox-tinymce > div.tox-statusbar.focus {
  box-shadow: 0 0 2px 0 $cor-primaria;

  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 4px;
  border-top: none;
}

div.tox:not([dir="rtl"]) .tox-toolbar__group:not(:last-of-type) {
  border-right: none;
}

.tox-menu.tox-collection.tox-collection--list {
  border-top: 2px solid $cor-primaria;
}

.tox-statusbar > .tox-statusbar__text-container > .tox-statusbar__path {
  display: none;
}

.tox .tox-autocompleter .tox-autocompleter-highlight {
  background: $blue-200;
  color: $black;
}

@media only screen and (max-width: 1263px) {
  .tox-toolbar .tox-toolbar__group:first-child {
    margin-right: 5px;
  }
}
</style>
