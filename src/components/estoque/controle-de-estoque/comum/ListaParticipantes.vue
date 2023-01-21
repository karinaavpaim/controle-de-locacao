<template>
  <v-container class="no-gutters">
    <v-chip outlined>
      <v-slide-x-transition group leave-absolute>
        <template v-if="!exibindoParticipantes" left>
          <span key="texto-participantes">Participantes</span>
        </template>
        <v-avatar key="botao-exibir-ocultar" size="36" color="#165091" :right="!exibindoParticipantes" :left="exibindoParticipantes">
          <v-icon
            color="white"
            @click="($event)=>{ exibirParticipantes(); $event.stopPropagation();}"
          >{{ exibindoParticipantes ? 'mdi-chevron-right' : 'mdi-account-supervisor' }}</v-icon>
        </v-avatar>
        <template v-if="exibindoParticipantes" right>
          <v-avatar
            v-for="(participante, indice) in participantes"
            :key="`participante${indice}`"
            size="36"
            color="blue"
          >
            <v-img
              v-if="participante.funcionario.foto"
              :src="participante.funcionario.foto"
              max-height="36px"
              max-width="36px"
              class="borda-avatar"
            ></v-img>
            <span
              v-else
              class="white--text"
            >{{ (participante.funcionario.nome && participante.funcionario.nome.substring(0, 2).toUpperCase()) || 'SN' }}</span>
          </v-avatar>
          <v-avatar
            key="botao-incluir-participante"
            size="36"
            color="#165091"
            right
          >
            <v-icon
              color="white"
              @click="($event)=>{ exibirJanela = true; $event.stopPropagation(); }"
            >mdi-plus</v-icon>
          </v-avatar>
        </template>
      </v-slide-x-transition>
    </v-chip>

    <v-dialog
      persistent
      v-model="exibirJanela"
    >
      <v-card>
        <v-row class="no-gutters">
          <v-col>
            <v-card-title>
              <h3>Incluir participantes</h3>
            </v-card-title>

            <v-card-text class="mt-2">
              <v-row>
                <v-col>
                  <pesquisa-pessoa
                    id="pesquisa-funcionario"
                    label="Funcionário"
                    atributoExibicao="codigoNome"
                    :categoriasDePessoa="['FUNCIONARIO']"
                    v-model="funcionario"
                    :focus="exibirJanela"
                  ></pesquisa-pessoa>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn
                class="btn-primary"
                text
                :disabled="!funcionario"
                @click="incluirParticipante"
              >Gravar</v-btn>
              <v-btn
                class="btn-tertiary"
                text
                @click="exibirJanela = false"
              >Cancelar</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import apiPessoa from "@/api/sistemas-gerais/pessoa-api";
import PesquisaPessoa from "@/components/sistemas-gerais/pessoa/PesquisaPessoa";
import PessoaParticipanteControleDeEstoqueModel from "@/models/estoque/controle-de-estoque/pessoa-participante-controle-de-estoque-model.js";

export default {
  components: {
    PesquisaPessoa
  },

  model: {
    prop: "participantes",
    event: "onUpdate"
  },

  props: {
    participantes: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      funcionario: undefined,
      exibirJanela: false,
      exibindoParticipantes: false,
      imagensCarregadas: false
    };
  },

  methods: {
    exibirParticipantes() {
      this.exibindoParticipantes = !this.exibindoParticipantes;

      if (this.imagensCarregadas) return;

      this.imagensCarregadas = true;
      this.participantes.forEach(this.carregarImagemDoParticipante);
    },

    carregarImagemDoParticipante(participante) {
      apiPessoa.localizarPessoaComFoto(participante.funcionario.identificador).then(resposta => {
        let pessoa = (resposta && resposta[0]) || {};
        participante.funcionario.foto = pessoa.foto;
        participante.funcionario.nome = pessoa.nome || pessoa.nomeCurto;
      }).catch(() => {}); // não é necessário notificar ao usuário que a imagem não foi carregada.
    },

    incluirParticipante(){
      if (this.participantes.some(p => p.funcionario.identificador == this.funcionario.identificador)) {
        this.$mensagemFlutuante.erro({ titulo: "Este funcionário já foi incluído." });
        return;
      }

      var participante = new PessoaParticipanteControleDeEstoqueModel({ funcionario: this.funcionario });
      this.carregarImagemDoParticipante(participante);
      this.participantes.push(participante);
      this.$emit("onUpdate", this.participantes);
      this.exibirJanela = false;
      this.funcionario = undefined;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .borda-avatar {
  border:1px solid blue;
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