<template>
  <v-app :id="id">
    <v-container fluid px-5 pt-0 justify-space-around>
      <v-layout wrap>
        <v-flex xm12 justify-start>
          <v-breadcrumbs large class="breadcrumb-alinhamento" :items="breadCrumbs">
            <template v-slot:divider>
              <v-icon>mdi-18px mdi-chevron-right</v-icon>
            </template>
            <v-breadcrumbs-item
              slot="item"
              slot-scope="{ item }"
              :class="[item.disabled && 'breadcrumb-atual']"
              exact
              :to="{name: item.to}">
              <span :style="`color: ${item.color}`">
                {{ item.text }}
              </span>
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex lg12>
          <v-card tile class="contorno-card">
            <v-flex pa-5>
              <v-flex>
                <v-flex float-right ml-5>
                  <v-row no-gutters>
                    <v-flex>
                      <p class="label-codigo-orcamento">Versão 4.00.46.7</p>
                    </v-flex>
                  </v-row>
                </v-flex>

                <h1 class="h1-config">Geral</h1>

                <v-row class="pl-3 pt-2">
                  <v-col cols="6">
                    <pesquisa-empresa
                      :id="'pesquisa-empresa-'+id"
                      v-model="empresaAtual"
                      label="Empresa"
                      placeholder="Pesquise pelo código ou nome da empresa"
                      atributoExibicao="codigoNome"
                      atributoValor="identificador"
                      :limparCampo="false"
                      @onChange="alterarTodasAsConfiguracoesConformeEmpresaSelecionada"
                      empresa-do-sistema
                      persistentHint
                    ></pesquisa-empresa>
                  </v-col>
                  <v-col cols="4" pl-5>
                    <v-checkbox
                      :id="'checkbox-utilizar-adicionais-personalizados-'+id"
                      v-model="configuracaoControleLocacao.secaoGeral.utilizarAdicionaisPersonalizados"
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                      color="primary"
                      class="d-inline-block pt-0"
                      label="Utilizar adicionais personalizados no orçamento"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-flex>

              <v-flex>
                <h1 class="h1-config">Setores</h1>

                <v-row class="pl-3 pt-2">
                  <v-col cols="6">
                    <p class="p-label-config-setores">Estoque principal:</p>
                    <p class="p-descricao-config">
                      Este é o setor onde estão armazenados os produtos para o processo de requisição do contrato.
                    </p>
                    <v-autocomplete
                      :id="'autocomplete-setor-estoque-principal-'+id"
                      :items="setores"
                      placeholder="Selecione o setor"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoSetor.setorEstoquePrincipal"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <p class="p-label-config-setores">
                      Estoque para expedição:
                    </p>
                    <p class="p-descricao-config">
                      Este é o setor para onde serão enviados os produtos contratados que irão para os clientes.
                    </p>
                    <v-autocomplete
                      :id="'autocomplete-setor-estoque-expedicao-'+id"
                      :items="setores"
                      placeholder="Selecione o setor"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoSetor.setorEstoqueExpedicao"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-flex>

              <v-flex>
                <h1 class="h1-config">Operações</h1>
                <p class="p-label-config-operacoes mb-5">
                  Abaixo deverão ser configuradas as operações que serão utilizadas para geração de documentos no Bimer.
                </p>

                <v-row no-gutters align="center">
                  <v-col cols="3">
                    <p class="p-label-config">
                      Expedição dos equipamentos:
                    </p>
                  </v-col>
                  <v-col cols="9">
                    <v-autocomplete
                      :id="'autocomplete-operacao-expedicao-equipamentos-'+id"
                      :items="operacoesExpedicaoOrdemEntrega"
                      placeholder="Selecione a operação"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoOperacao.operacaoExpedicaoDosEquipamentos"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="3">
                    <p class="p-label-config">
                      Expedição dos materiais:
                    </p>
                  </v-col>
                  <v-col cols="9">
                    <v-autocomplete
                      :id="'autocomplete-operacao-expedicao-materiais-'+id"
                      :items="operacoesExpedicaoNotaFiscal"
                      placeholder="Selecione a operação"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoOperacao.operacaoExpedicaoDosMateriais"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="3">
                    <p class="p-label-config">
                      Medição dos equipamentos:
                    </p>
                  </v-col>
                  <v-col cols="9">
                    <v-autocomplete
                      :id="'autocomplete-operacao-faturamento-equipamentos-'+id"
                      :items="operacoesFaturamentoNotaFiscal"
                      placeholder="Selecione a operação"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosEquipamentos"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="3">
                    <p class="p-label-config">
                      Medição dos serviços:
                    </p>
                  </v-col>
                  <v-col cols="9">
                    <v-autocomplete
                      :id="'autocomplete-operacao-faturamento-servicos-'+id"
                      :items="operacoesFaturamentoNotaFiscalServico"
                      placeholder="Selecione a operação"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosServicos"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="3">
                    <p class="p-label-config">
                      Medição dos materiais:
                    </p>
                  </v-col>
                  <v-col cols="9">
                    <v-autocomplete
                      :id="'autocomplete-operacao-faturamento-materiais-'+id"
                      :items="operacoesFaturamentoNotaFiscal"
                      placeholder="Selecione a operação"
                      item-text="codigoNome"
                      item-value="identificador"
                      v-model="configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosMateriais"
                      clearable
                      dense
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-flex>

              <v-flex>
                <h1 class="h1-config">Expedição</h1>

                <v-row class="pl-3 pt-2">
                  <v-col cols="8" class="pr-0">
                    <p class="p-label-config-setores">
                      Tabela de preço utilizada na expedição:
                    </p>
                    <v-autocomplete
                      :id="'autocomplete-tabela-preco-expedicao-'+id"
                      :items="tabelasPreco"
                      placeholder="Selecione a tabela de preço"
                      v-model="configuracaoControleLocacao.secaoExpedicao.tabelaPrecoExpedicao"
                      clearable
                      item-text="codigoNome"
                      item-value="identificador"
                      dense
                      persistent-hint
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4" class="pl-7">
                    <p class="p-label-config-setores">
                      Na expedição o sistema poderá criar pedidos com o status:
                    </p>
                    <v-radio-group row
                      v-model="configuracaoControleLocacao.secaoExpedicao.gerarPedidoLiberadoNaExpedicao"
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                      class="mt-1"
                    >
                      <v-radio :id="'radio-gerar-pedido-aberto-expedicao-'+id" color="primary" label="Pedido aberto" :value="false"></v-radio>
                      <v-radio :id="'radio-gerar-pedido-liberado-expedicao-'+id" color="primary" label="Pedido liberado" :value="true"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-flex>

              <v-flex>
                <h1 class="h1-config">Medição</h1>

                <v-row class="pl-3 pt-2">
                  <v-col cols="8">
                    <p class="p-label-config-setores">
                      Prioridade da soma das despesas da medição:
                    </p>
                    <v-row class="pl-3">
                      <v-flex mr-7>
                        <v-autocomplete
                          :id="'autocomplete-primeira-prioridade-soma-despesa-'+id"
                          :items="prioridadesNaDespesa"
                          placeholder="Selecione a primeira"
                          v-model="configuracaoControleLocacao.secaoMedicao.primeiraPrioridadeSomaDasDespesasNaMedicao"
                          clearable
                          item-text="descricao"
                          item-value="valor"
                          dense
                          persistent-hint
                          hint="Primeira prioridade"
                          :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex>
                        <v-autocomplete
                          :id="'autocomplete-segunda-prioridade-soma-despesa-'+id"
                          :items="prioridadesNaDespesa"
                          placeholder="Selecione a segunda"                          
                          v-model="configuracaoControleLocacao.secaoMedicao.segundaPrioridadeSomaDasDespesasNaMedicao"
                          clearable
                          item-text="descricao"
                          item-value="valor"
                          label
                          dense
                          hint="Segunda prioridade"
                          persistent-hint
                          :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex ml-7>
                        <v-autocomplete
                          :id="'autocomplete-terceira-prioridade-soma-despesa-'+id"
                          :items="prioridadesNaDespesa"
                          placeholder="Selecione a terceira"
                          v-model="configuracaoControleLocacao.secaoMedicao.terceiraPrioridadeSomaDasDespesasNaMedicao"
                          clearable
                          item-text="descricao"
                          item-value="valor"
                          label
                          dense
                          hint="Terceira prioridade"
                          persistent-hint
                          :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                        ></v-autocomplete>
                      </v-flex>
                    </v-row>
                  </v-col>
                  <v-col cols="4" class="pl-7">
                    <p class="p-label-config-setores">
                      Na medição o sistema poderá criar pedidos com o status:
                    </p>
                    <v-radio-group row
                      v-model="configuracaoControleLocacao.secaoMedicao.gerarPedidoLiberadoNaMedicao"
                      :disabled="!configuracaoControleLocacao.identificadorEmpresa"
                      class="mt-1"
                    >
                      <v-radio :id="'radio-gerar-pedido-aberto-medicao-'+id" color="primary" label="Pedido aberto" :value="false"></v-radio>
                      <v-radio :id="'radio-gerar-pedido-liberado-medicao-'+id" color="primary" label="Pedido liberado" :value="true"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-flex>
            </v-flex>
          </v-card>

          <div class="footer-bar-sticky footer-bar-box alinhamento-botoes-rodape">
            <v-btn
              :id="'btn-salvar-'+id"
              class="btn-primary width-btn-primary"
              text
              @click="salvarConfiguracao"
              :disabled="!configuracaoControleLocacao.identificadorEmpresa"
            >
              Salvar
            </v-btn>

            <v-btn
              :id="'btn-cancelar-'+id"
              class="btn-tertiary"
              text
              @click="cancelarConfiguracao"
            >
              Cancelar
            </v-btn>
          </div>
        </v-flex>
      </v-layout>

      <v-overlay :value="carregando">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
  </v-app>
</template>

<script>
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import apiOperacao from "@/api/sistemas-gerais/operacao-api";
import apiPreco from "@/api/estoque/preco-api";
import apiConfiguracaoLocacao from "@/api/faturamento/controle-de-locacao/configuracao-locacao-api";
import ConfiguracaoLocacaoModel from "@/models/faturamento/orcamento-locacao/configuracao/configuracao-model";
import PesquisaEmpresa from "@/components/sistemas-gerais/empresa/PesquisaEmpresa.vue";
import EmpresaModel from "../../../models/geral/empresa-model";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import { CATEGORIAS_ITENS_ORCAMENTO_LOCACAO } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants";
import { HTTP_STATUS_CODES } from '@/constants/comum/http-status-codes-constants.js';
import apiEmpresa from "@/api/sistemas-gerais/empresa-api";
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";

export default {
  components: {
    PesquisaEmpresa
  },

  async created(){
    try{
      await this.obterTodasAsOperacoes();
      await this.obterTodasAsTabelasDePreco();
      this.empresaAtual = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL];
      this.alterarTodasAsConfiguracoesConformeEmpresaSelecionada(this.empresaAtual);
    }
    catch(e){
      this.$mensagemFlutuante.erro({
        titulo: "Não foi possível obter alguns dados das configurações.",
        mensagem: e
      });
    }
  },

  watch: {
    configuracaoControleLocacao() {
      this.configuracaoControleLocacao.identificadorEmpresa = this.empresaAtual.identificador;

      this.filtrarOperacoes();
      this.limparConfiguracoesAnterioresInconsistentes();
    }
  },

  data() {
    return {
      id: 'configuracao',
      tabelasPreco: [],
      tooltip: {
        expedicaoEquipamentos: false,
        expedicaoMateriais: false,
        medicaoEquipamentos: false,
        medicaoServicos: false,
        medicaoMateriais: false
      },
      carregando: false,
      empresaAtual: undefined,
      setores: [],
      prioridadesNaDespesa: [
        CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.EQUIPAMENTO,
        CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.SERVICO,
        CATEGORIAS_ITENS_ORCAMENTO_LOCACAO.MATERIAL
      ],
      configuracaoControleLocacao: new ConfiguracaoLocacaoModel(),
      operacoes: [],
      operacoesExpedicaoNotaFiscal: [],
      operacoesExpedicaoOrdemEntrega: [],
      operacoesFaturamentoNotaFiscal: [],
      operacoesFaturamentoNotaFiscalServico: [],
      breadCrumbs: [{
        text: "Configurações",
        disabled: true,
        to: ROTAS_FATURAMENTO_METADATA.configuracaoControleLocacao.name,
        color: '#757575'
      }]
    };
  },

  methods: {
    obterTodasAsTabelasDePreco(){
      return apiPreco.obterTodasAsTabelasDePreco()
      .then(resposta => {
        this.tabelasPreco = resposta;
      })
      .catch(erro => {
        this.notificarProblema(erro, `Não foi possível obter as tabelas de preços.`);
      });
    },

    filtrarOperacoes() {
      let operacoesPorEmpresa = this.filtrarOperacoesPorEmpresa(this.operacoes, this.empresaAtual.identificador);
      this.operacoesExpedicaoNotaFiscal = this.obterOperacoesExpedicao(operacoesPorEmpresa);
      this.operacoesExpedicaoOrdemEntrega = this.obterOperacoesExpedicao(operacoesPorEmpresa);
      this.operacoesFaturamentoNotaFiscal = this.obterOperacoesCobranca(operacoesPorEmpresa);
      this.operacoesFaturamentoNotaFiscalServico = this.obterOperacoesCobrancaServico(operacoesPorEmpresa);
    },

    filtrarOperacoesPorEmpresa(operacoes, identificadorEmpresa) {
      return operacoes.filter(
        o => o.identificadoresDasEmpresasVinculadasAoTipoDocumento.includes(identificadorEmpresa));
    },

    obterOperacoesExpedicao(operacoes) {
      return operacoes.filter(
        o => (o.tipo == "Saida" || o.tipo == "Venda")
        && (o.atualizaEstoque == true && o.atualizaFinanceiro == false));
    },

    obterOperacoesCobranca(operacoes) {
      return operacoes.filter(
        o => (o.tipo == "Saida" || o.tipo == "Venda")
        && (o.atualizaEstoque == false && o.atualizaFinanceiro == true));
    },

    obterOperacoesCobrancaServico(operacoes) {
      return operacoes.filter(
        o => (o.tipo == "Venda")
        && (o.atualizaEstoque == false && o.atualizaFinanceiro == true));
    },

    validarConfiguracoesObrigatorias() {
      var erros = [];
      erros.push(...(this.configuracaoControleLocacao.secaoSetor.obterErrosDeValidacao()));
      erros.push(...(this.configuracaoControleLocacao.secaoOperacao.obterErrosDeValidacao()));
      erros.push(...(this.configuracaoControleLocacao.secaoMedicao.obterErrosDeValidacao()));
      erros.push(...(this.configuracaoControleLocacao.secaoExpedicao.obterErrosDeValidacao()));

      if (erros.length) {
        this.$mensagemFlutuante.aviso({
          titulo: `Não foi possível cadastrar as configurações.`,
          mensagem: `-${erros.join('\n-')}`
        });
        return false;
      }

      return true;
    },

    enviarConfiguracaoParaRetaguarda() {
      this.carregando = true;
      apiConfiguracaoLocacao
        .cadastrarOuEditarConfiguracaoLocacao(this.configuracaoControleLocacao)
        .then(() => {
          this.$mensagemFlutuante.sucesso({
            titulo: `Configurações gravadas com sucesso!`
          });
          /* Este dispatch é para forçar a atualização da empresa na STORE e consequentemente as configurações */
          this.$store.dispatch(OPCOES_STORE_EMPRESA.ACTIONS.ALTERAR_EMPRESA_ATUAL, this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL]);
        })
        .catch(erro => {
          this.notificarProblema(erro, `Não foi possível cadastrar as configurações.`);
        })
        .finally(() => (this.carregando = false));
    },

    salvarConfiguracao() {
      if (!this.validarConfiguracoesObrigatorias()) return;

      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Você está alterando a configuração`;
      cfgMsg.mensagem = `Confirma as alterações nas configurações?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.enviarConfiguracaoParaRetaguarda;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    cancelarConfiguracao() {
      this.$router.go(-1);
    },

    alterarTodasAsConfiguracoesConformeEmpresaSelecionada(empresa) {
      let empresaSelecionada = empresa || new EmpresaModel();
      let idEmpresa = empresaSelecionada.identificador;

      if (idEmpresa) {
        this.obterOsSetoresPorIdentificadorEmpresa(idEmpresa);
        this.obterConfiguracoesLocacaoPorIdentificadorEmpresa(idEmpresa);
      }
    },

    limparConfiguracoesAnterioresInconsistentes() {
      if (!this.operacoesExpedicaoOrdemEntrega.some(
        o => o.identificador == this.configuracaoControleLocacao.secaoOperacao.operacaoExpedicaoDosEquipamentos))
        this.configuracaoControleLocacao.secaoOperacao.operacaoExpedicaoDosEquipamentos = undefined;

      if (!this.operacoesExpedicaoNotaFiscal.some(
        o => o.identificador == this.configuracaoControleLocacao.secaoOperacao.operacaoExpedicaoDosMateriais))
        this.configuracaoControleLocacao.secaoOperacao.operacaoExpedicaoDosMateriais = undefined;

      if (!this.operacoesFaturamentoNotaFiscal.some(
        o => o.identificador == this.configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosEquipamentos))
        this.configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosEquipamentos = undefined;

      if (!this.operacoesFaturamentoNotaFiscalServico.some(
        o => o.identificador == this.configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosServicos))
        this.configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosServicos = undefined;

      if (!this.operacoesFaturamentoNotaFiscal.some(
        o => o.identificador == this.configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosMateriais))
        this.configuracaoControleLocacao.secaoOperacao.operacaoFaturamentoDosMateriais = undefined;
    },

    obterTodasAsOperacoes() {
      return apiOperacao
        .localizarOperacoes()
        .then(operacoes => {
          this.operacoes = operacoes;
        })
        .catch(erro => {
          this.notificarProblema(erro, `Não foi possível obter as operações.`);
        });
    },

    notificarProblema(erro, titulo, onClose) {
      let metodoMensagem = Array.isArray(erro) && erro[0] && (erro[0].status == HTTP_STATUS_CODES.BAD_REQUEST.status)
        ? this.$mensagemFlutuante.aviso
        : this.$mensagemFlutuante.erro;

      metodoMensagem({
        titulo: titulo,
        mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || `${erro}`,
        onClose: onClose
      });
    },

    obterOsSetoresPorIdentificadorEmpresa(identificadorEmpresa) {
      apiEmpresa
        .localizarSetoresPorIdentificadorEmpresa(identificadorEmpresa)
        .then(setores => {
          this.setores = setores;
        })
        .catch(err => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter os setores vinculados a empresa selecionada.`,
            mensagem: `Motivo: ${err.statusText}`
          });
        });
    },

    obterConfiguracoesLocacaoPorIdentificadorEmpresa(identificadorEmpresa) {
      apiConfiguracaoLocacao
        .obterConfiguracaoLocacaoPeloIdentificadorEmpresa(identificadorEmpresa)
        .then(configuracoes => {
          this.configuracaoControleLocacao =
            configuracoes[0] || new ConfiguracaoLocacaoModel();
        })
        .catch(err => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter as configurações da empresa selecionada.`,
            mensagem: `Motivo: ${err[0].statusText}`
          });
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.p-label-config {
  color: $cor_primaria;
  font-weight: 500;
  text-align: right;
  margin-right: 15px;
}

p.p-label-config > div {
  display: contents;
}

.p-label-config-setores {
  color: $cor_primaria;
  font-weight: 500;
}

.p-label-config-operacoes {
  color: #37474f;
  font-size: 13px;
}

.p-descricao-config {
  color: #37474f;
  font-size: 11px;
}

.h1-config {
  overflow: hidden;
  font-size: 22px;
  font-weight: 400;
  font-family: 'Roboto Condensed', sans-serif;
  color: $cor_primaria;
}

.h1-config:after {
  content: "";
  display: inline-block;
  height: 0.3em;
  vertical-align: center;
  width: 100%;
  margin-right: -100%;
  margin-left: 10px;
  border-top: 2px solid $bg_grid;
}

#configuracao {
  background-color: $bg_grid;
}

.contorno-card {
  border-radius: 4px;
}

.alinhamento-botoes-rodape {
  padding-right: 11px;
}
</style>