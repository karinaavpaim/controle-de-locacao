<template>
  <v-app :id="id">
    <alerta-bimer :mensagem="alerta.mensagem" :exibir="alerta.disparar" :tipo="alerta.tipo"></alerta-bimer>
    <v-row class="mr-0 ml-0 row-principal-do-modal">
      <v-col v-bind:class="{'container-lateral-invisivel': !divDeIndicesSendoExibida}" class="div-a pt-0 pb-0 transition">
        <v-container>
          <v-row>
            <v-col class="col-12">
              <h2 class="titulo-modal primary--text">{{indexDoItemEditado === -1 ? 'Inserir' : 'Editar'}} índice</h2>
            </v-col>

            <v-col class="col-8">
              <v-text-field
                :id="'textfield-nome-do-indice-'+id"
                v-model="itemDeAdicional.descricao"
                ref="indice"
                label="Nome do índice"
                :maxlength="20"
                :error-messages="mensagemDeErroPorFaltaDeNome"
                @change="descricaoDeItemDeAdicionalAlterado()"
              ></v-text-field>
            </v-col>

            <v-col class="col-4">
              <campo-numero
                :id="'campo-numero-aliquota-'+id"
                class="tipo-numero"
                label="Alíquota"
                v-model="itemDeAdicional.aliquota"
                :maxlength="6"
                sufixo="%"
                :mensagemDeErro="mensagemDeErroPorFaltaDeAliquota"
              ></campo-numero>
            </v-col>

            <v-col class="label-base-calculo-indice">
              <v-label>Base de cálculo</v-label>
            </v-col>

            <v-col class="col-12 checkbox-base-de-calculo">
              <v-checkbox
                :id="'checkbox-equipamentos-'+id"
                v-model="itemDeAdicional.atualizaEquipamentos"
                label="Equipamentos"
                color="primary"
                :disabled="!checkboxEquipamentosHabilitado"
                :error-messages="mensagemErroCheckboxBase"
              ></v-checkbox>
            </v-col>

            <v-col class="col-12 checkbox-base-de-calculo">
              <v-checkbox
                :id="'checkbox-servicos-'+id"
                v-model="itemDeAdicional.atualizaServicos"
                label="Serviços"
                color="primary"
                :disabled="!checkboxServicosHabilitado"
                :error-messages="mensagemErroCheckboxBase"
              ></v-checkbox>
            </v-col>

            <v-col class="col-12 checkbox-base-de-calculo">
              <v-checkbox
                :id="'checkbox-materiais-'+id"
                v-model="itemDeAdicional.atualizaMateriais"
                label="Materiais"
                color="primary"
                :disabled="!checkboxMateriaisHabilitado"
                :error-messages="mensagemErroCheckboxBase"
              ></v-checkbox>
            </v-col>

            <v-col class="col-12 checkbox-base-de-calculo ultimo-checkbox">
              <v-checkbox
                :id="'checkbox-despesas-'+id"
                v-model="itemDeAdicional.atualizaDespesas"
                label="Despesas"
                color="primary"
                :disabled="!checkboxDespesasHabilitado"
                :error-messages="mensagemErroCheckboxBase"
              ></v-checkbox>
            </v-col>

            <v-col class="col-12 botoes-aba-indices limite-largura px-0">
              <div class="bloco-mensagem-aliquota-maxima">
                <label class="msg-informativa" v-if="mensagemDeErroPorUltrapassarAliquotaMaxima !== ''">
                  <v-icon color="primary">info</v-icon> {{mensagemDeErroPorUltrapassarAliquotaMaxima}}
                </label>
                <label class="error--text" for>{{mensagemDeErroPorFaltaDeIndices}}</label>
              </div>

              <v-divider class="mx-4_ margin-top-20"></v-divider>
              <v-btn :id="'btn-inserir-'+id" class="btn-quaternary inserir-indice width-btn-primary_" text @click="salvarItem">
                {{indexDoItemEditado === -1 ? 'Inserir' : 'Atualizar'}}
              </v-btn>
              <v-btn :id="'btn-fechar-'+id" class="btn-tertiary cancelar-indice ml-2" text @click="cancelarEdicaoDeIndices">
                Fechar
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col class="div-b pl-5 pr-5">
        <v-row>
          <v-col class="col-12">
            <h2 class="titulo-modal primary--text">{{tituloModal}}</h2>
          </v-col>
          <v-col class="col-12">
            <v-text-field
              :id="'textfield-nome-'+id"
              :maxlength="50"
              v-model="adicionalPersonalizado.descricao"
              ref="adicional"
              label="Nome"
              :error-messages="mensagemDeErroPorFaltaDeNomeDoModelo"
              @keydown="mensagemDeErroPorFaltaDeNomeDoModelo = ''"
            ></v-text-field>
          </v-col>
          <v-col v-show="!divDeIndicesSendoExibida" class="col-12 pt-0">
            <v-btn :id="'btn-novo-indice-'+id" class="btn-secondary-icon width-icon ml-0 mb-2" text @click="abrirDivDeIndices()">
              <v-icon class="mr-1">mdi-18px mdi-plus</v-icon>Novo índice
            </v-btn>
          </v-col>

          <v-col
            class="col-12 pt-0 pb-0 col-tabela-com-indices padding-vuetify-override"
            v-bind:class="{ 'aumentarTamanho': divDeIndicesSendoExibida }"
          >
            <div v-show="adicionalPersonalizado.itens.length > 0">
              <v-data-table
                :headers="headers"
                :items="adicionalPersonalizado.itens"
                class="contorno-tabela-adicionais"
                disable-pagination
                hide-default-footer
                fixed-header
                :footer-props="{'items-per-page-options': [5, 10, 15, 50, 100]}"
              >
                <template v-if="adicionalPersonalizado" v-slot:body="{ items }">
                  <tbody>
                    <tr
                      v-for="(item, item_index) in items"
                      :key="item_index"
                      class="indice"
                      v-bind:class="{ 'indice-em-edicao':  indexDoItemEditado === adicionalPersonalizado.itens.indexOf(item)}"
                    >
                      <td class="text-left coluna-indice-de-adicional coluna-descricao">{{ item.descricao }}</td>
                      <td class="text-right coluna-indice-de-adicional">{{item.aliquota | formataAliquota}}</td>
                      <td class="text-center coluna-indice-de-adicional">
                        <v-icon v-if="item.atualizaEquipamentos">check</v-icon>
                        <p v-if="!item.atualizaEquipamentos">-</p>
                      </td>
                      <td class="text-center coluna-indice-de-adicional">
                        <v-icon v-if="item.atualizaServicos">check</v-icon>
                        <p v-if="!item.atualizaServicos">-</p>
                      </td>
                      <td class="text-center coluna-indice-de-adicional">
                        <v-icon v-if="item.atualizaMateriais">check</v-icon>
                        <p v-if="!item.atualizaMateriais">-</p>
                      </td>
                      <td class="text-center coluna-indice-de-adicional">
                        <v-icon v-if="item.atualizaDespesas">check</v-icon>
                        <p v-if="!item.atualizaDespesas">-</p>
                      </td>
                      <td class="text-center coluna-indice-de-adicional">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon small class="mr-2" @click="editarItem(item)" color="primary" v-on="on">edit</v-icon>
                          </template>
                          <span>Editar</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon small @click="removerItem(item)" color="primary" v-on="on">delete</v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>                        
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </div>

            <v-flex xs12 v-show="adicionalPersonalizado.itens.length == 0" class="height-completo">
              <v-layout wrap class="card-no-data altura-card-indices height-completo">
                <v-flex>
                  <span class="subheader">Não há índices adicionados.</span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-col>

          <v-col class="col-12 pt-0">
            <v-divider class="mx-4_"></v-divider>
            <v-row class="text-right">
              <div class="col-3 total-aliquotas total-aliquotas-equipamentos">
                <h3 class="label-padrao">Alíquotas dos equipamentos</h3>
                <p>{{totalEmAliquotasDosEquipamentos | formataAliquota}}</p>
              </div>
              <div class="col-3 total-aliquotas total-aliquotas-servicos">
                <h3 class="label-padrao">Alíquotas dos serviços</h3>
                <p>{{totalEmAliquotasDosServicos | formataAliquota}}</p>
              </div>
              <div class="col-3 total-aliquotas total-aliquotas-materiais">
                <h3 class="label-padrao">Alíquotas dos materiais</h3>
                <p>{{totalEmAliquotasDosMateriais | formataAliquota}}</p>
              </div>
              <div class="col-3 total-aliquotas total-aliquotas-despesas">
                <h3 class="label-padrao">Alíquotas das despesas</h3>
                <p>{{totalEmAliquotasDasDespesas | formataAliquota}}</p>
              </div>
            </v-row>
          </v-col>

          <v-col class="col-12 pt-0 pb-0 botoes-adicional-personalizado d-flex justify-end">
            <v-btn
              :id="'btn-salvar-'+id"
              class="btn-primary width-btn-primary"
              text
              @click="salvarAdicionalPersonalizado"
              :disabled="botaoPrincipalDesabilitado || aguardandoRequisicao"
            >
              Salvar
            </v-btn>
            <v-btn :id="'btn-cancelar-'+id" class="btn-tertiary mr-0" text @click="cancelarAdicionalPersonalizado">
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Alerta from "@/components/comum/Alerta";
import adicionalPersonalizadoApi from "@/api/faturamento/controle-de-locacao/adicionais-personalizados-api";
import AdicionalPersonalizadoModel from "@/models/faturamento/orcamento-locacao/adicional-personalizado-model";
import ItemAdicionalPersonalizadoModel from "@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model";
import { COLUNAS_TABELA_INDICES_PERSONALIZADOS } from "@/constants/faturamento/controle-de-locacao/controle-de-adicionais-personalizados-constants";
import { OBJETO_ALERTA } from "@/constants/comum/configuracoes-constants";
import CampoNumero from "@/components/comum/CampoNumero";

export default {
  model: {
    prop: "adicionaisPersonalizados",
    event: "onChange"
  },

  props: {
    adicionaisPersonalizados: { type: Array, required: true },
    adicionalPersonalizado: {
      type: AdicionalPersonalizadoModel,
      required: true
    },
    modoEdicao: { type: Boolean, default: false },
    modoCopia: { type: Boolean, default: false },
    descricaoOriginal: { type: String, default: "" },
    focoPrincipal: { type: Boolean, default: false }
  },

  filters: {
    formataAliquota(valor) {
      return (valor + "%").replace(".", ",");
    },
    convertePontoEmVirgula(valor) {
      return valor;
    }
  },

  components: {
    "alerta-bimer": Alerta,
    CampoNumero
  },
  data: () => ({
    id: 'adicional-personalizado',
    mascaraNumero: "##,##",
    divDeIndicesSendoExibida: false,
    deveValidarCamposDosItens: true,
    deveValidarNomeIndiceVazio: false,
    aguardandoRequisicao: false,
    itemDeAdicional: new ItemAdicionalPersonalizadoModel(),
    headers: COLUNAS_TABELA_INDICES_PERSONALIZADOS,
    indexDoItemEditado: -1,
    alerta: OBJETO_ALERTA,
    mensagemDeErroPorFaltaDeNome: "",
    mensagemDeErroPorFaltaDeIndices: "",
    mensagemDeErroPorFaltaDeAliquota: "",
    mensagemDeErroPorFaltaDeNomeDoModelo: "",
    checkboxEquipamentosHabilitado: true,
    checkboxServicosHabilitado: true,
    checkboxMateriaisHabilitado: true,
    checkboxDespesasHabilitado: true,
    totalEmAliquotasDosEquipamentos: 0,
    totalEmAliquotasDosServicos: 0,
    totalEmAliquotasDosMateriais: 0,
    totalEmAliquotasDasDespesas: 0,
    mensagemDeErroPorFaltaDeBaseSelecionado: "",
    mensagemDeErroPorUltrapassarAliquotaMaxima: ""
  }),

  watch: {
    focoPrincipal(val) {
      val && this.$nextTick(() => {
        this.$refs.adicional.focus();
      });
    },
    adicionalPersonalizado() {
      this.atualizarTotalizadores();
    },
    "itemDeAdicional.descricao": function() {
      this.mensagemDeErroPorFaltaDeNome = "";
    },
    "itemDeAdicional.aliquota": function(valor) {
      this.mensagemDeErroPorFaltaDeIndices = "";
      this.mensagemDeErroPorFaltaDeAliquota = ""; //this.aliquotaDoItemValida(valor);
      this.validaTotalEmAliquotas(valor || null);
    },
    "itemDeAdicional.atualizaEquipamentos": function() {
      if (this.itemDeAdicional.atualizaEquipamentos) {
        this.mensagemDeErroPorFaltaDeBaseSelecionado = "";
        this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
      }
    },
    "itemDeAdicional.atualizaServicos": function() {
      if (this.itemDeAdicional.atualizaServicos) {
        this.mensagemDeErroPorFaltaDeBaseSelecionado = "";
        this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
      }
    },
    "itemDeAdicional.atualizaMateriais": function() {
      if (this.itemDeAdicional.atualizaMateriais) {
        this.mensagemDeErroPorFaltaDeBaseSelecionado = "";
        this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
      }
    },
    "itemDeAdicional.atualizaDespesas": function() {
      if (this.itemDeAdicional.atualizaDespesas) {
        this.mensagemDeErroPorFaltaDeBaseSelecionado = "";
        this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
      }
    },
    mensagemDeErroPorFaltaDeIndices(valor) {
      if (valor !== "") {
        this.divDeIndicesSendoExibida = true;
      }
    },
    checkboxEquipamentosHabilitado(valor) {
      if (!valor) {
        this.itemDeAdicional.atualizaEquipamentos = false;
      }
    },
    checkboxServicosHabilitado(valor) {
      if (!valor) {
        this.itemDeAdicional.atualizaServicos = false;
      }
    },
    checkboxMateriaisHabilitado(valor) {
      if (!valor) {
        this.itemDeAdicional.atualizaMateriais = false;
      }
    },
    checkboxDespesasHabilitado(valor) {
      if (!valor) {
        this.itemDeAdicional.atualizaDespesas = false;
      }
    },
  },

  computed: {
    formTitle() {
      return this.indexDoItemEditado === -1
        ? "Novo índice"
        : "Editar índice";
    },
    tituloModal() {
      if (this.modoEdicao) {
        return "Editar adicional personalizado";
      }
      /* Código comentado porque a idéia de utilizar "Cópia de" nas duplicações será reanalisada pelo UX */
      /* if (this.modoCopia){
        return 'Cópia de ' + this.descricaoOriginal
      } */
      return 'Novo adicional personalizado'
    },
    mensagemErroCheckboxBase(){
      if (this.mensagemDeErroPorFaltaDeBaseSelecionado === ""){
        return "";
      }
      
      if (this.mensagemDeErroPorUltrapassarAliquotaMaxima !== ""){
        return " ";
      }

      return this.mensagemDeErroPorFaltaDeBaseSelecionado;
    },
    botaoPrincipalDesabilitado(){
      if (!this.divDeIndicesSendoExibida){
        return false
      }

      let itemEmEdicao = this.indexDoItemEditado !== -1;
      let descricaoPreenchida = this.itemDeAdicional.descricao.trim() !== '';
      let aliquotaPreenchida = this.itemDeAdicional.aliquota > 0;
      let baseCalculoSelecionada = this.itemDeAdicional.atualizaEquipamentos ||
        this.itemDeAdicional.atualizaServicos ||
        this.itemDeAdicional.atualizaMateriais ||
        this.itemDeAdicional.atualizaDespesas;

      return (itemEmEdicao || descricaoPreenchida || aliquotaPreenchida || baseCalculoSelecionada);
    }
  },

  created() {
    this.atualizarTotalizadores();
  },

  methods: {
    descricaoDeItemDeAdicionalAlterado() {
      if (!this.deveValidarCamposDosItens) {
        this.deveValidarCamposDosItens = true;
      }

      this.deveValidarNomeIndiceVazio = false;
      this.mensagemDeErroPorFaltaDeIndices = "";

      this.mensagemDeErroPorFaltaDeNome = this.descricaoDeItemValida(
        this.itemDeAdicional.descricao,
        false
      );
    },

    aliquotaDeItemDeAdicionalAlterada() {
      if (!this.deveValidarCamposDosItens) {
        this.deveValidarCamposDosItens = true;
      }

      this.mensagemDeErroPorFaltaDeIndices = "";

      this.mensagemDeErroPorFaltaDeAliquota = this.aliquotaDoItemValida(
        this.itemDeAdicional.aliquota
      );
    },

    validaTotalEmAliquotas(valor) {
      if (valor && valor >= 100) {
        return;
      }

      this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
      this.checkboxEquipamentosHabilitado =
        !valor || this.totalEmAliquotasDosEquipamentos + valor < 100;
      this.checkboxServicosHabilitado =
        !valor || this.totalEmAliquotasDosServicos + valor < 100;
      this.checkboxMateriaisHabilitado =
        !valor || this.totalEmAliquotasDosMateriais + valor < 100;
      this.checkboxDespesasHabilitado =
        !valor || this.totalEmAliquotasDasDespesas + valor < 100;

      if (!this.checkboxEquipamentosHabilitado || !this.checkboxServicosHabilitado
          || !this.checkboxMateriaisHabilitado || !this.checkboxDespesasHabilitado) {
        this.mensagemDeErroPorUltrapassarAliquotaMaxima = "Base de cálculo desabilitada porque a soma das alíquotas está igual ou superior à 100%.";
      }
    },

    abrirDivDeIndices() {
      this.divDeIndicesSendoExibida = true;
      this.mensagemDeErroPorFaltaDeAliquota = "";

      var self = this;
      this.$nextTick(() => {
        self.setFocus();
      });
    },

    editarItem(item) {
      if (this.indexDoItemEditado === this.adicionalPersonalizado.itens.indexOf(item)) {
        return;
      }
      this.abrirDivDeIndices();
      this.indexDoItemEditado = this.adicionalPersonalizado.itens.indexOf(item);

      this.itemDeAdicional = new ItemAdicionalPersonalizadoModel(item);

      this.atualizarTotalizadoresParaEdicao(this.indexDoItemEditado);
    },

    atualizarTotalizadoresParaEdicao(indiceDoItem) {
      this.totalEmAliquotasDosEquipamentos = 0;
      this.totalEmAliquotasDosServicos = 0;
      this.totalEmAliquotasDosMateriais = 0;
      this.totalEmAliquotasDasDespesas = 0;

      for (let i = 0; i < this.adicionalPersonalizado.itens.length; i++) {
        let itemIgual = indiceDoItem === i;
        let item = this.adicionalPersonalizado.itens[i];

        this.totalEmAliquotasDosEquipamentos = this.obterTotal(
          item.atualizaEquipamentos,
          this.totalEmAliquotasDosEquipamentos,
          item.aliquota,
          itemIgual
        );
        this.totalEmAliquotasDosServicos = this.obterTotal(
          item.atualizaServicos,
          this.totalEmAliquotasDosServicos,
          item.aliquota,
          itemIgual
        );
        this.totalEmAliquotasDosMateriais = this.obterTotal(
          item.atualizaMateriais,
          this.totalEmAliquotasDosMateriais,
          item.aliquota,
          itemIgual
        );
        this.totalEmAliquotasDasDespesas = this.obterTotal(
          item.atualizaDespesas,
          this.totalEmAliquotasDasDespesas,
          item.aliquota,
          itemIgual
        );
      }
    },

    atualizarTotalizadores() {
      this.totalEmAliquotasDosEquipamentos = 0;
      this.totalEmAliquotasDosServicos = 0;
      this.totalEmAliquotasDosMateriais = 0;
      this.totalEmAliquotasDasDespesas = 0;

      this.adicionalPersonalizado.itens.forEach(item => {
        this.totalEmAliquotasDosEquipamentos = this.obterTotal(
          item.atualizaEquipamentos,
          this.totalEmAliquotasDosEquipamentos,
          item.aliquota
        );
        this.totalEmAliquotasDosServicos = this.obterTotal(
          item.atualizaServicos,
          this.totalEmAliquotasDosServicos,
          item.aliquota
        );
        this.totalEmAliquotasDosMateriais = this.obterTotal(
          item.atualizaMateriais,
          this.totalEmAliquotasDosMateriais,
          item.aliquota
        );
        this.totalEmAliquotasDasDespesas = this.obterTotal(
          item.atualizaDespesas,
          this.totalEmAliquotasDasDespesas,
          item.aliquota
        );
      });
    },

    obterTotal(
      deveIncindirAliquota,
      totalCalculado,
      aliquota,
      subtrair = false
    ) {
      if (!deveIncindirAliquota) {
        return totalCalculado;
      }
      let retorno = 0;
      let _aliquota = parseInt(aliquota * 100);
      let _totalCalculado = parseInt(totalCalculado * 100);
      retorno = _totalCalculado + _aliquota;
      retorno = subtrair ? retorno - _aliquota : retorno;

      return this.truncarNumeroFloat(parseFloat(parseInt(retorno) / 100), 2);
    },

    removerItem(item) {
      const index = this.adicionalPersonalizado.itens.indexOf(item);
      this.adicionalPersonalizado.itens.splice(index, 1);
      this.cancelarEdicaoDeIndices(true, false);
    },

    cancelarEdicaoDeIndices(
      deveAtualizarTotalizadores = true,
      deveFecharAbaDeIndices = true
    ) {
      if (deveAtualizarTotalizadores) {
        this.atualizarTotalizadores();
        this.$refs.adicional.focus();
      }

      this.divDeIndicesSendoExibida = !deveFecharAbaDeIndices;
      this.itemDeAdicional = new ItemAdicionalPersonalizadoModel();
      this.indexDoItemEditado = -1;
      this.mensagemDeErroPorFaltaDeNome = "";
      this.mensagemDeErroPorFaltaDeAliquota = "";
      this.mensagemDeErroPorFaltaDeBaseSelecionado = "";
      this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
    },

    salvarItem() {
      this.deveValidarCamposDosItens = true;
      this.deveValidarNomeIndiceVazio = true;

      if (!this.itensValidos()) {
        return;
      }
      this.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
      this.mensagemDeErroPorFaltaDeIndices = "";
      this.setFocus();
      return this.indexDoItemEditado > -1
        ? this.atualizarItem()
        : this.inserirNovoItem();
    },

    itensValidos() {
      this.itemDeAdicional.descricao =
        this.itemDeAdicional.descricao.trimStart().trimEnd() ||
        this.itemDeAdicional.descricao;
      this.mensagemDeErroPorFaltaDeNome = this.descricaoDeItemValida(
        this.itemDeAdicional.descricao,
        true
      );
      this.mensagemDeErroPorFaltaDeAliquota = this.aliquotaDoItemValida(
        this.itemDeAdicional.aliquota
      );

      this.mensagemDeErroPorFaltaDeBaseSelecionado = this.algumCheckBoxSelecionado()
        ? ""
        : "Selecione uma base de cálculo";

      return (
        this.mensagemDeErroPorFaltaDeNome === "" &&
        this.mensagemDeErroPorFaltaDeAliquota === "" &&
        this.mensagemDeErroPorFaltaDeBaseSelecionado === ""
      );
    },

    algumCheckBoxSelecionado() {
      return (
        this.itemDeAdicional.atualizaDespesas ||
        this.itemDeAdicional.atualizaEquipamentos ||
        this.itemDeAdicional.atualizaServicos ||
        this.itemDeAdicional.atualizaMateriais
      );
    },

    aliquotaDoItemValida(aliquota) {
      return ((this.deveValidarCamposDosItens) && (aliquota <= 0)) ? " " : "";
    },

    descricaoDeItemValida(descricao, validarDescricaoRepetida = false) {
      if (!this.deveValidarCamposDosItens) {
        return "";
      }

      if (!descricao || descricao == "") {
        return this.deveValidarNomeIndiceVazio ? "Obrigatório" : "";
      }

      let indexNomeRepetido = this.adicionalPersonalizado.itens.findIndex(
        i =>
          i.descricao.trimStart().trimEnd() === this.itemDeAdicional.descricao
      );

      let existeNomeRepetido =
        indexNomeRepetido > -1 &&
        indexNomeRepetido !== this.indexDoItemEditado &&
        validarDescricaoRepetida;

      return existeNomeRepetido ? "Nome repetido" : "";
    },

    formatarItemParaAdicionarNoModeloDeAdicional(itemSemFormatacao) {
      let itemFormatado = itemSemFormatacao;
      return itemFormatado;
    },

    inserirNovoItem() {
      let itemFormatado = this.formatarItemParaAdicionarNoModeloDeAdicional(
        this.itemDeAdicional
      );

      this.adicionalPersonalizado.adicionarItem(itemFormatado);
      this.limparModeloDeItemAdicional();
      this.atualizarTotalizadores();
      this.setFocus();
    },

    setFocus: function() {
      this.$refs.indice.focus();
    },

    atualizarItem() {
      this.adicionalPersonalizado.atualizarItem(
        this.indexDoItemEditado,
        this.itemDeAdicional
      );

      this.limparModeloDeItemAdicional();
      this.atualizarTotalizadores();
    },

    limparModeloDeItemAdicional() {
      this.deveValidarCamposDosItens = false;
      this.indexDoItemEditado = -1;
      this.itemDeAdicional = new ItemAdicionalPersonalizadoModel();
    },

    salvarAdicionalPersonalizado() {
      if (!this.modeloDeAdicionalPersonalizadoValido()) {
        return;
      }

      let adicionalParaEnviar = new AdicionalPersonalizadoModel(
        this.adicionalPersonalizado
      );

      this.aguardandoRequisicao = true;

      if (this.modoEdicao) {
        this.atualizarAdicionalPersonalizado(adicionalParaEnviar);
      } else {
        this.cadastrarAdicionalPersonalizado(adicionalParaEnviar);
      }
    },

    atualizarAdicionalPersonalizado(adicionalParaAtualizar) {
      adicionalPersonalizadoApi
        .editar(adicionalParaAtualizar)
        .then(adicionalPersonalizadoAtualizado => {
          this.$mensagemFlutuante.sucesso({titulo: "Adicional personalizado salvo com sucesso!"});

          let index = this.adicionaisPersonalizados.findIndex(
            a => a.identificador === adicionalPersonalizadoAtualizado.identificador
          );

          this.adicionaisPersonalizados.splice(
            index,
            1,
            this.adicionalPersonalizado
          );

          this.$emit("fecharModal", true);
          this.$emit("listaDeAdicionalPersonalizadoAtualizada", adicionalPersonalizadoAtualizado);
          this.divDeIndicesSendoExibida = false;
          this.limparCamposParaFecharModal();
        })
        .catch(error => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível salvar o adicional personalizado.`,
            mensagem: `Motivo: ${error}`
          });
        })
        .finally(()=>this.aguardandoRequisicao = false);
    },

    cadastrarAdicionalPersonalizado(adicionalParaCadastrar) {
      adicionalPersonalizadoApi
        .cadastrar(adicionalParaCadastrar)
        .then(adicionalPersonalizadoCadastrado => {
          this.$mensagemFlutuante.sucesso({titulo: "Adicional personalizado salvo com sucesso!"});

          this.divDeIndicesSendoExibida = false;
          this.adicionaisPersonalizados.push(new AdicionalPersonalizadoModel(adicionalPersonalizadoCadastrado));
          this.$emit("fecharModal", true);
          this.$emit("listaDeAdicionalPersonalizadoAtualizada", new AdicionalPersonalizadoModel(adicionalPersonalizadoCadastrado));
          this.limparCamposParaFecharModal();
        })
        .catch(error => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível salvar o adicional personalizado.`,
            mensagem: `Motivo: ${error.statusText}`
          });
        })
        .finally(()=>this.aguardandoRequisicao = false);
    },

    limparCamposParaFecharModal() {
      this.itemDeAdicional = new ItemAdicionalPersonalizadoModel();
      this.checkboxEquipamentosHabilitado = true;
      this.checkboxServicosHabilitado = true;
      this.checkboxMateriaisHabilitado = true;
      this.checkboxDespesasHabilitado = true;
      this.totalEmAliquotasDosEquipamentos = 0;
      this.totalEmAliquotasDosServicos = 0;
      this.totalEmAliquotasDosMateriais = 0;
      this.totalEmAliquotasDasDespesas = 0;
      this.mensagemDeErroPorFaltaDeNome = "";
      this.mensagemDeErroPorFaltaDeIndices = "";
      this.mensagemDeErroPorFaltaDeAliquota = "";
      this.mensagemDeErroPorFaltaDeNomeDoModelo = "";
      this.divDeIndicesSendoExibida = false;
      this.cancelarEdicaoDeIndices(false);
    },

    cancelarAdicionalPersonalizado() {
      this.$emit("fecharModal", true);
      this.limparCamposParaFecharModal();
    },

    modeloDeAdicionalPersonalizadoValido() {
      this.adicionalPersonalizado.removerEspacosDeDescricao();
      this.mensagemDeErroPorFaltaDeNomeDoModelo = !this.adicionalPersonalizado.descricaoValida()
        ? "O nome é obrigatório"
        : "";
      this.mensagemDeErroPorFaltaDeIndices =
        this.adicionalPersonalizado.itens.length === 0
          ? "É necessário pelo menos 1 índice."
          : "";
      if (this.mensagemDeErroPorFaltaDeNomeDoModelo === "") {
        this.adicionaisPersonalizados.forEach(a => {
          if (a.descricao === this.adicionalPersonalizado.descricao &&
              a.identificador !== this.adicionalPersonalizado.identificador){
            this.mensagemDeErroPorFaltaDeNomeDoModelo = "Já existe um adicional com este nome.";
          }
        });
      }

      return (
        this.mensagemDeErroPorFaltaDeNomeDoModelo === "" &&
        this.mensagemDeErroPorFaltaDeIndices === ""
      );
    },

    dispararMensagem(msg, tipo) {
      this.alerta.mensagem = msg;
      this.alerta.tipo = tipo;
      this.alerta.disparar = !this.alerta.disparar;
    },
    truncarNumeroFloat(numero, quantidadeDeCasasDecimais) {
      var re = new RegExp(
        "(\\d+\\.\\d{" + quantidadeDeCasasDecimais + "})(\\d)"
      ),
      m = numero.toString().match(re);
      return m ? parseFloat(m[1]) : numero.valueOf();
    }
  }
};
</script>

<style lang="scss" scoped>
.div-a.pt-0.pb-0.col {
  max-width: 268.8px;
  width: 268.8px;
}

.div-b.pl-5.pr-5.col {
  max-width: 691.2px;
  width: 691.2px;
}

.col-nome-indice {
  -webkit-box-flex: 0;
  flex: 0 0 79.5%;
  max-width: 79.5%;
}

.col-aliquota-indice {
  -webkit-box-flex: 0;
  flex: 0 0 20.5%;
  max-width: 20.5%;
}

.footer-adicionais-personalizados {
  width: 100%;
  margin-top: 10px;
}

.checkbox-base-de-calculo {
  padding-top: 0px;
  padding-bottom: 0px;
}

.checkbox-base-de-calculo .v-input--checkbox {
  margin-top: 0px;
}

::v-deep
  .checkbox-base-de-calculo
  .v-input--selection-controls:not(.v-input--hide-details)
  .v-input__slot {
  margin-bottom: 0px;
}

.label-base-calculo-indice label {
  margin-left: 3px;
  font-size: 13px;
}

.label-base-calculo-indice {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: -2px;
}

::v-deep .checkbox-base-de-calculo .v-messages {
  display: none;
}

::v-deep .checkbox-base-de-calculo.ultimo-checkbox .v-messages {
  display: block;
}

::v-deep .checkbox-base-de-calculo .theme--light.v-label {
  letter-spacing: 0;
  color: rgba(0, 0, 0, 1);
  opacity: 0.7;
  font-size: 13px;
}

::v-deep .checkbox-base-de-calculo .v-icon.v-icon {
  font-size: 19px;
  margin-left: 2px;
}

::v-deep .checkbox-base-de-calculo .v-input--selection-controls__ripple {
  height: 33px;
  width: 33px;
}

.div-a {
  max-width: 28%;
  background-color: $bg_grid;
}

.div-a .inserir-indice {
  margin-left: 0px;
  margin-right: 5px;
}

.div-a .cancelar-indice {
  margin-left: 5px;
  margin-right: 0px;
}

.botoes-aba-indices {
  transform: translateY(45%);
}

.total-aliquotas p {
  font-weight: 500;
  color: $grey-900;
  font-size: 28px;
  color: $cor_primaria;
}

.col-3.total-aliquotas-equipamentos {
  flex: 0 0 26%;
  max-width: 26%;
}

.col-3.total-aliquotas-servicos {
  flex: 0 0 24%;
  max-width: 24%;
}

.col-3.total-aliquotas-materiais,
.col-3.total-aliquotas-despesas {
  flex: 0 0 25%;
  max-width: 25%;
}

.row-principal-do-modal {
  height: 550px;
}

::v-deep .v-data-table--fixed-header .v-data-table__wrapper {
  max-height: 182px;
}

::v-deep .aumentarTamanho .v-data-table--fixed-header .v-data-table__wrapper {
  max-height: 230px;
}

.col-tabela-com-indices {
  height: 182px;
}

.col-tabela-com-indices.aumentarTamanho {
  height: 230px;
}

/*
* SOBRESCREVENDO O PADDING DO VUETIFY QUE ESTA COM !IMPORTANT
*/
.col-12.pt-0.pb-0.col-tabela-com-indices.col.padding-vuetify-override {
  padding-bottom: 15px !important;
}

.botoes-adicional-personalizado {
  margin-top: -12px;
}

h3.label-padrao,
small.label-padrao {
  white-space: nowrap;
}

.limite-largura {
  width: 245px;
}

.msg-informativa {
  font-size: 13px;
  color: $cor_primaria;
}

.margin-top-20 {
  margin-top: 20px;
}

.height-completo {
  height: 100%;
}

.altura-card-indices {
  padding-top: 75px;
  padding-bottom: 75px;
}

.indice-em-edicao .coluna-indice-de-adicional,
.indice-em-edicao .coluna-indice-de-adicional .v-icon {
  color: $cor_primaria;
}

.indice-em-edicao .coluna-indice-de-adicional.coluna-descricao {
  border-left: $cor_primaria solid;
}

.bloco-mensagem-aliquota-maxima {
  height: 70px;
}

.div-a.pt-0.pb-0.col.container-lateral-invisivel {
  max-width: 0;
  overflow: hidden;
  padding: 0;
}

.container {
  min-width: 245px;
}

.transition {
  transition: max-width .5s ease, padding .1s ease;
  will-change: max-width, padding;
  overflow: hidden;
}

::v-deep div.contorno-tabela-adicionais div.v-data-table__wrapper {
  border: 2px solid $bg-grid;
}
</style>