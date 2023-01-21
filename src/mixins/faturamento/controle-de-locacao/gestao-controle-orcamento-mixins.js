import apiOrcamento from "@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js";
import mascaraDinheiro from "@/utils/mascara-dinheiro.js";
import PesquisaEmpresa from "@/components/sistemas-gerais/empresa/PesquisaEmpresa.vue";
import dataUtils from "@/utils/data.js";
import FiltrosPesquisaOrcamento from "@/components/faturamento/controle-de-locacao/orcamento/filtros/FiltrosPesquisaOrcamento.vue";
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";
import { STATUS_ORCAMENTO_LOCACAO_LISTA, STATUS_ORCAMENTO_LOCACAO } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";
import { STATUS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import { ROTAS_FATURAMENTO_METADATA } from "@/constants/router/faturamento-router-constants.js";
import { CfgMensagemFlutuante } from '@Bimer/vue-mensagem-flutuante';
import ChipSelect from "@/components/comum/ChipSelect";
import FiltrosPesquisaOrcamentoModel from "@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model";
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";
import { OPCOES_STORE_CONTROLE_LOCACAO } from "@/store/modules/controle-locacao";

const ControleEGestaoOrcamentoMixin = {
  filters: {
    data_br(dataIso) {
      return (dataIso && dataUtils.aplicarMascaraEmDataIso(dataIso)) || '-';
    },
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  },

  components: {
    PesquisaEmpresa,
    DestaquePesquisa,
    FiltrosPesquisaOrcamento,
    "chip-select": ChipSelect
  },

  async beforeMount() {
    this.carregando = true;

    let filtrosAtivosOrcamento = await this.$store.getters[OPCOES_STORE_CONTROLE_LOCACAO.GETTERS.FILTRO_PADRAO_PESQUISA_ORCAMENTO];
    let filtrosAtivosGestao = await this.$store.getters[OPCOES_STORE_CONTROLE_LOCACAO.GETTERS.FILTRO_PADRAO_PESQUISA_GESTAO];
    let filtrosAtivosMovimentacao = await this.$store.getters[OPCOES_STORE_CONTROLE_LOCACAO.GETTERS.FILTRO_PADRAO_PESQUISA_MOVIMENTACAO];
    let empresaAtual = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL];
    let empresaPadrao = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_PADRAO];
    let listaEmpresas = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.LISTA_EMPRESAS];

    this.filtrosPesquisaOrcamento = new FiltrosPesquisaOrcamentoModel(filtrosAtivosOrcamento);
    this.filtrosPesquisaGestao = new FiltrosPesquisaOrcamentoModel(filtrosAtivosGestao);
    this.filtrosPesquisaMovimentacao = new FiltrosPesquisaOrcamentoModel(filtrosAtivosMovimentacao);

    this.empresa = (empresaAtual || empresaPadrao || listaEmpresas[0]);
    this.carregando = false;
  },

  watch: {
    empresa() {
       this.filtrarOrcamentosSalvandoFiltro();
    }
  },

  data() {
    return {
      paginaAtualTabela:1,
      modalDadosCliente: false,
      filtrosPesquisaOrcamento: new FiltrosPesquisaOrcamentoModel(),
      filtrosPesquisaGestao: new FiltrosPesquisaOrcamentoModel(),
      filtrosPesquisaMovimentacao: new FiltrosPesquisaOrcamentoModel(),
      carregando: false,
      exibirFiltros: false,
      exibirFiltrosAvancados: false,
      paginacao: {
        sortBy: "codigo",
        descending: true
      },
      empresa: undefined,
      filtrosAtivos: [],
      pesquisa: "",
      orcamentosDeLocacao: [],
      statusParaFiltro: STATUS_ORCAMENTO_LOCACAO_LISTA,
      opcoesItem: [],
      evolucaoDaLocacao: 50,
      dadosDoCliente: undefined,
      rotaDeOrigemDashboard: false
    };
  },

  created() {
    this.rotaDeOrigemDashboard = !!this.$route.params.dashboard && !(this.$route.name == ROTAS_FATURAMENTO_METADATA.dashboardLocacao.name);
  },

  methods: {
    removerFiltrosPorGrupo(filtroPesquisa, grupo) {
      filtroPesquisa.removerFiltrosPorGrupo(grupo)
      this.filtrarOrcamentosSalvandoFiltro();
    },

    retornarOrcamentoParaTabela(orcamento){
      var status = this.retornarStatus(orcamento.status);
      //TODO: Mudar assim que possível esse cara para retornar um OrcamentoModel
      return {
        identificador: orcamento.identificador,
        codigo: orcamento.codigo,
        descricao: orcamento.descricao,
        identificadorCliente: (orcamento.cliente && orcamento.cliente.identificador) || "",
        nomeCliente: (orcamento.cliente && orcamento.cliente.nome) || "",
        nomeCurto: (orcamento.cliente && orcamento.cliente.nomeCurto) || "",
        CPFouCNPJ: (orcamento.cliente && orcamento.cliente.CPFouCNPJ) || "",
        nomePessoaDeContatoCliente: orcamento.nomePessoaDeContatoCliente,
        emailPessoaDeContatoCliente: orcamento.emailPessoaDeContatoCliente,
        telefonePessoaDeContatoCliente: orcamento.telefonePessoaDeContatoCliente,
        codigoEnderecoEntrega: orcamento.codigoEnderecoEntrega,
        descricaoStatus: status.descricao,
        classeStatus: status.classeExibicao,
        valorStatus: status.valor,
        dataEmissaoIso: orcamento.dataEmissao.substring(0, 10),
        dataEmissaoFormatada: dataUtils.aplicarMascaraEmDataIso(
          orcamento.dataEmissao
        ),
        dataReferenciaIso: orcamento.dataReferencia.substring(0, 10),
        dataReferenciaFormatada: dataUtils.aplicarMascaraEmDataIso(
          orcamento.dataReferencia
        ),
        dataInicioContratoIso: orcamento.dataInicioContrato && orcamento.dataInicioContrato.substring(0, 10),
        dataInicioContratoFormatada: orcamento.dataInicioContrato && dataUtils.aplicarMascaraEmDataIso(
          orcamento.dataInicioContrato
        ),
        dataTerminoContratoIso: orcamento.dataTerminoContrato && orcamento.dataTerminoContrato.substring(0, 10),
        dataTerminoContratoFormatada: orcamento.dataTerminoContrato && dataUtils.aplicarMascaraEmDataIso(
          orcamento.dataTerminoContrato
        ),
        possuiItemComProdutoPadrao: orcamento.possuiItemComProdutoPadrao,
        possuiMaterialOuEquipamento: orcamento.possuiMaterialOuEquipamento,
        possuiItemMovimentado: orcamento.possuiItemMovimentado,
        totalValor: orcamento.totalOrcamento,
        totalFormatado: mascaraDinheiro.aplicarMascaraParaRealComPrefixo(
          orcamento.totalOrcamento
        )
      };
    },

    filtrarOrcamentosPorTipo(filtroPesquisa) {
      if (this.carregando) {
        return;
      }

      this.carregando = true;
      this.orcamentosDeLocacao = [];

      apiOrcamento
        .obterOrcamentos(filtroPesquisa)
        .then(response => {
          this.orcamentosDeLocacao = response.map(o => {
            return this.retornarOrcamentoParaTabela(o);
          });
        })
        .catch(() => {
          this.orcamentosDeLocacao = [];
          this.carregando = false;
        })
        .finally(() => {
          this.carregando = false;
          this.filtrosAtivos = filtroPesquisa.gruposDeFiltrosAtivos();
        });
    },

    alterarStatus(statusSelecionado, orcamento, statusAnterior) {
      var statusAtual = STATUS_ORCAMENTO_LOCACAO[statusAnterior].descricao;
      var novoStatus = STATUS_ORCAMENTO_LOCACAO[statusSelecionado].descricao;

      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Você está alterando o status.`;
      cfgMsg.mensagem = `Confirma a alteração do status de ${statusAtual} para ${novoStatus}?`;

      if (statusSelecionado == STATUS_ORCAMENTO_LOCACAO.FINALIZADO.valor) {
        cfgMsg.mensagem += `\nItens e despesas terão seu status atualizado para:`;
        cfgMsg.mensagem += `\n- '${STATUS_ITEM.ATENDIDO_COM_CORTE.descricao}' se não foram totalmente medidos.`;
        cfgMsg.mensagem += `\n- '${STATUS_ITEM.CANCELADO.descricao}' se não foram medidos.`;
      }

      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.alterarStatusOrcamentoManualmente;
      cfgMsg.botaoPrimario.params = { orcamento, statusSelecionado, statusAnterior, acao: 'alterar o status' };

      cfgMsg.botaoSecundario.texto = "Não";
      cfgMsg.botaoSecundario.callback = this.cancelarAlteracaoDeStatus;
      cfgMsg.botaoSecundario.params = { orcamento, statusSelecionado, statusAnterior, acao: 'alterar o status' };
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    configurarCancelamentoOrcamento(orcamento) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.mensagem = `Confirma o cancelamento do orçamento: ${orcamento.codigo}?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.cancelarOrcamento
      cfgMsg.botaoPrimario.params = orcamento;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    configurarExclusaoOrcamento(orcamento) {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.mensagem = `Confirma a exclusão do orçamento: ${orcamento.codigo}?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.excluirOrcamento
      cfgMsg.botaoPrimario.params = orcamento;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    cancelarAlteracaoDeStatus(obj) {
      obj.orcamento.valorStatus = obj.statusAnterior || obj.orcamento.status;
      this.atualizarStatusDoOrcamentoNaListaDeOrcamento(obj.orcamento);
      this.$mensagemFlutuante.esconder();
    },

    atualizarStatusDoOrcamentoNaListaDeOrcamento(orcamento) {
      //Fiz assim até transformar esse objeto em um modelo.
      //A entidade que o grid espera não é um OrcamentoModel.
      let index = this.orcamentosDeLocacao
        .map(o => o.identificador)
        .indexOf(orcamento.identificador);
      this.orcamentosDeLocacao.splice(index, 1, orcamento);
    },

    alterarStatusDoOrcamento(orcamento, status, acao) {
      this.carregando = true;
      return apiOrcamento.alterarStatusDoOrcamento(orcamento.identificador, status).then(dados => {
        let status = this.retornarStatus(dados.status);

        let indiceDoOrcamento = this.orcamentosDeLocacao.findIndex(o => o.codigo === dados.codigo);

        this.orcamentosDeLocacao[indiceDoOrcamento].descricaoStatus = status.descricao;
        this.orcamentosDeLocacao[indiceDoOrcamento].classeStatus = status.classeExibicao;
        this.orcamentosDeLocacao[indiceDoOrcamento].valorStatus = status.valor;

        return dados;
      })
      .catch(erro => {
        this.atualizarStatusDoOrcamentoNaListaDeOrcamento(orcamento);
        this.$mensagemFlutuante.aviso({
          titulo: `Não foi possível ${acao} o orçamento ${orcamento.codigo}.`,
          mensagem: (Array.isArray(erro) && erro[0] && erro[0].statusText) || erro
        });

        return erro;
      })
      .finally(() => this.carregando = false)
    },

    cancelarOrcamento(orcamento) {
      this.alterarStatusDoOrcamento(
        orcamento,
        STATUS_ORCAMENTO_LOCACAO.CANCELADO.valor,
        'cancelar')
      .then(() => this.$mensagemFlutuante.sucesso({
        titulo: `Orçamento ${orcamento.codigo} cancelado com sucesso!`
      }));
    },

    excluirOrcamento(orcamento) {      
      this.alterarStatusDoOrcamento(
        orcamento,
        STATUS_ORCAMENTO_LOCACAO.EXCLUIDO.valor,
        'excluir')
      .then((dados) => {
        let indiceDoOrcamentoExcluido = this.orcamentosDeLocacao.findIndex(o => o.codigo === dados.codigo);
        this.orcamentosDeLocacao.splice(indiceDoOrcamentoExcluido, 1);        
        this.$mensagemFlutuante.sucesso({ titulo: `Orçamento ${orcamento.codigo} excluído com sucesso!` });
      });
    },

    alterarStatusOrcamentoManualmente(obj) {
      obj.orcamento.status = obj.statusAnterior || obj.orcamento.status;

      this.alterarStatusDoOrcamento(
        obj.orcamento,
        obj.statusSelecionado,
        obj.acao
      )
      .then((orcamento) => {
        // Preciso alterar o orçamento na listagem.
        // Se o status for alterado para Liberado, o identificador muda.
        let index = this.orcamentosDeLocacao
        .map(o => o.identificador)
        .indexOf(obj.orcamento.identificador);

        obj.orcamento.identificador  = orcamento.identificador;
        obj.orcamento.idEntidadeOrigem  = orcamento.idEntidadeOrigem;
        
        this.orcamentosDeLocacao.splice(index, 1, this.retornarOrcamentoParaTabela(orcamento));
        this.$mensagemFlutuante.sucesso({ titulo: `Status do orçamento ${obj.orcamento.codigo} alterado com sucesso!` });
      });
    },

    duplicarOrcamento(orcamento) {
      this.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.duplicarOrcamentoLocacao.name,
        params: { idOrcamento: orcamento.identificador }
      });
    },

    retornarStatus(status) {
      return (
        STATUS_ORCAMENTO_LOCACAO_LISTA.find(s => s.valor === status) ||
        STATUS_ORCAMENTO_LOCACAO.AGUARDANDO
      );
    },

    exibirModalDadosDoCliente(cliente) {
      this.dadosDoCliente = cliente;
      this.modalDadosCliente = true;
    },

    fecharModal() {
      this.modalDadosCliente = false;
      this.dadosDoCliente = undefined;
    }
  }
}

export default ControleEGestaoOrcamentoMixin