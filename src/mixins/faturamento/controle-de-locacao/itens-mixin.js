import Mascara from '@/utils/mascara-dinheiro.js';
import moment from 'moment';
import apiProdutos from '@/api/estoque/produto-api.js';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import { OPCOES_STORE_EMPRESA } from "@/store/modules/empresa";
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";
import { CfgMensagemFlutuante } from "@Bimer/vue-mensagem-flutuante";
import ConfiguracaoLocacaoModel from "@/models/faturamento/orcamento-locacao/configuracao/configuracao-model";
import DestaquePesquisa from "@/components/comum/DestaquePesquisa.vue";

const itemMixin = {
  model: {
    prop: 'itens',
    event: 'onChange'
  },
  props: {
    itens: { type: Array, default: () => [] },
    identificadorProdutoPadrao: { type: String, default: undefined },
    //TODO: alterar para pros required assim que resolver a divida tecnica sobre itensMixin.
    // Essa divida técnica indica que o itens de mixin deve ser utilizado somente nos componentes de itens do orcamento locação.
    adicionalPersonalizado: { type: Object, default: undefined },
    dataInicialPadrao: { type: String, default: undefined },
    dataFinalPadrao: { type: String, default: undefined },
    ajustandoItem: { type: Boolean , default: false } 
  },

  components: {
    DestaquePesquisa
  },

  filters: {
    dinheiro(valor) {
      return Mascara.aplicarMascaraParaRealComPrefixo(valor);
    },

    data(valor) {
      return moment(valor).format("DD/MM/YYYY");
    }
  },

  data() {
    return {
      rules: {
        min: v => v >= 1 || 'Obrigatório'
      },
      focoHabilitado: false,
      camposObrigatorios: "",
      dialogItem: false,
      item: new ItemOrcamentoLocacaoModel(),
      valorUnitarioAnterior: 0,
      precosProduto: [],
      precos: [],
      identificadorEmpresa: undefined,
      indiceItemEdicao: -1,
      modoEdicao: false,
      carregandoEdicao: false,
      carregandoPrecos: false,
      descricao: "",
      quantidadeDisponivel:0,
      index: -1,
      copiaItens: [],
      itemOriginal: new ItemOrcamentoLocacaoModel(),
      mensagemDeErro: "",
      mensagemDeErroDataInicial: "",
      mensagemDeErroDataFinal: "",
      mensagemDeErroValorUnitario: "",
      mensagemDeErroProduto: "",
      mensagemDeErroValorTotalDoItem: "",
      exibirMensagemDeErroDiariasMinima: false,
      configuracaoControleLocacao: new ConfiguracaoLocacaoModel(),
      setores: [],
      habilitaEditarDescricaoDoItem: true,
      statusJaMedidos: [
        STATUS_ITEM.ATENDIDO_COM_CORTE.nome,
        STATUS_ITEM.ATENDIDO_PARCIALMENTE.nome,
        STATUS_ITEM.ATENDIDO_TOTALMENTE.nome
      ],
      pesquisa: ""
    }
  },

  watch: {
    "item.valorUnitario": function() {
      let aliquotas = this.adicionalPersonalizado && this.adicionalPersonalizado.obterTotaisDeAliquotasPorCategoria();

      if (this.itens.length) {
        this.itens.forEach(i => i.calcularValorAdicionalPersonalizado(aliquotas));
      }

      this.item.calcularValorAdicionalPersonalizado(aliquotas);
    }
  },

  computed: {
    valorTotalItem() {
      return this.item.calcularValorTotal();
    },
    codigoNomeSetorEstoquePrincipal(){
      var identificadorNaConfiguracao = this.configuracaoControleLocacao.secaoSetor.setorEstoquePrincipal;
      var setor = this.setores.filter(s => s.identificador == identificadorNaConfiguracao);
      return (setor.length > 0) ? `${setor[0].codigo} - ${setor[0].descricao}` : "";
    },

    itensDoComponente(){
      return this.itens.filter(i => i.categoria === this.categoriaComponente)
    },

    /*
    * [BCDL-2101] Variavel computada criada para fazer o filtro de pesquisa na tabela
    * Foi necessaria pois o filter de tabelas do vuetify nao funciona
    * https://github.com/vuetifyjs/vuetify/issues/11600#issuecomment-642273351
    */
    itensFiltrados() {
      // verifica se tem um termo para comparar e se o valor do comparado nao for 
      // nulo ou booleano, busca pelo minusculo das strings
      let comparador = (valor, busca) => !busca || (valor != null && typeof valor !== 'boolean' && valor.toString().toLocaleLowerCase().indexOf(busca.toLocaleLowerCase()) !== -1)
      return this.itensDoComponente.filter(i => {
        return (i.categoria === this.categoriaComponente) && this.valoresDoItemParaFiltro(i).some(v => comparador(v, this.pesquisa))
      });
    }
  },

  methods: {
    async visualizarItem(item) {
      await this.carregarConfiguracoesDaEmpresa();
  
      this.carregandoEdicao = true;
      this.dialogItem = !this.dialogItem;

      this.localizarPrecosProduto(item)
          .then(() => {
            this.item = item;
            this.itemOriginal = new ItemOrcamentoLocacaoModel(item);
            this.descricao = item.descricao || (item.produto && item.produto.nome);
            this.obterQuantidadeDisponivelDoProduto(item.produto);
          })
          .finally(() => this.carregandoEdicao = false)
    },

    _onDescricaoChange(descricao) {
      if (descricao && this.item.produto && (this.item.produto.nome != descricao))
        this.item.descricao = descricao;
      else
      {
        this.item.descricao = undefined;
        this.descricao = this.item.produto && this.item.produto.nome;
        this.habilitaEditarDescricaoDoItem = true;
      }
    },

    _onProdutoChange(produto) {
      if (produto) {
        this.listarPrecosProduto(produto);
        this.obterQuantidadeDisponivelDoProduto(produto);
        this.mensagemDeErroProduto = "";
      } else {
        this.item.descricao = undefined;
        this.mensagemDeErroProduto = "Obrigatório";
      }

      this.descricao = this.item.descricao || (produto && produto.nome);
    },

    obterQuantidadeDisponivelDoProduto(produto) {
      var identificadorDoSetorRequisitante = this.configuracaoControleLocacao.secaoSetor.setorEstoqueExpedicao;
      var identificadorDoSetorRequisitado= this.configuracaoControleLocacao.secaoSetor.setorEstoquePrincipal;
      
      if(!identificadorDoSetorRequisitante || !identificadorDoSetorRequisitado){
        this.$mensagemFlutuante.erro({
          titulo: `Não foi possível obter a quantidade disponível do produto.`,
          mensagem: `Favor configurar o setor para estoque principal e o setor para expedição.`
        });

        return;
      }

      apiProdutos.localizarQuantidadeDisponivelProdutos(
        [produto.identificador], 
        this.configuracaoControleLocacao.identificadorEmpresa,
        identificadorDoSetorRequisitante,
        identificadorDoSetorRequisitado)
        .then(resposta => {
          this.quantidadeDisponivel = resposta[0].quantidadeDisponivel || 0;
        })
        .catch(error => {
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter a quantidade disponível do produto.`,
            mensagem: `Motivo: ${error[0].statusText}`
          });
        })
    },

    produtoPadraoSelecionado(){
      return this.identificadorProdutoPadrao && 
        this.item.produto &&
        (this.item.produto.identificador == this.identificadorProdutoPadrao)
    },

    periodoInvalido() {
      if (this.item.dataInicialLocacao && this.item.dataFinalLocacao)
        return moment(this.item.dataInicialLocacao).isAfter(this.item.dataFinalLocacao);
      return false;
    },

    diariasMinimas() {
      this.exibirMensagemDeErroDiariasMinima = (this.item.quantidadeDiarias < this.item.diariasJaMedidas);
    },

    validarCamposObrigatoriosDeData() {
      this.validarPeriodo();

      if (!this.item.dataInicialLocacao)
        this.mensagemDeErroDataInicial = "Obrigatório";

      if (!this.item.dataFinalLocacao)
        this.mensagemDeErroDataFinal = "Obrigatório";

      if (this.periodoInvalido()) {
        this.mensagemDeErroDataInicial = "Período inválido";
        this.mensagemDeErroDataFinal = "Período inválido";
      }
    },

    camposObrigatoriosEstaoPreenchidos() {
      this.validarCamposObrigatoriosDeData();
      this.diariasMinimas();

      this.mensagemDeErroValorTotalDoItem = (this.item.calcularValorTotal() < 0) ? "O valor total do item não pode ser negativo." : "";

      if (!this.item.valorUnitario)
        this.mensagemDeErroValorUnitario = "Obrigatório";

      if (this.item.valorUnitario < 0)
        this.mensagemDeErroValorUnitario = "Valor inválido";

      let retornar = this.item.itemValidoParaCadastro();
      return retornar;
    },

    carregarConfiguracoesDaEmpresa() {
      return new Promise(async (resolve, reject)=>{
        try {
          let empresa = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.EMPRESA_ATUAL];
          this.setores = await this.$store.getters[OPCOES_STORE_EMPRESA.GETTERS.SETORES_EMPRESA_ATUAL];
          this.configuracaoControleLocacao = await this.$store.getters[OPCOES_STORE_CONFIGURACOES.GETTERS.CONFIGURACOES_EMPRESA_ATUAL];
    
          this.identificadorEmpresa = empresa && empresa.identificador;
          resolve();
        }
        catch(e){
          this.$mensagemFlutuante.erro({
            titulo: `Não foi possível obter as configurações da empresa.`,
            mensagem: `Tente atualizar a página.`
          });
          reject(e)
        }
      })
    },

    async abrirModalParaAdicionarNovoItem() {
      await this.carregarConfiguracoesDaEmpresa();
      this.modoEdicao = false;
      this.dialogItem = !this.dialogItem;

      this.$nextTick(() => { // this.item esta aqui senao o componente de data nao atualiza...  wtf????
        this.item = new ItemOrcamentoLocacaoModel({
          identificador: new Date().getTime(), 
          categoria: this.categoriaComponente,
          dataInicialLocacao: this.dataInicialPadrao,
          quantidadeDiarias: this.quantidadeDiarias,
          dataFinalLocacao: this.dataFinalPadrao,
          incluidoNaGestao: !!(!this.modoEdicao && this.ajustandoItem)
        });
        this.focoHabilitado = true;
      })
    },

    async abrirModalParaEditarItem(item) {
      await this.carregarConfiguracoesDaEmpresa();
      this.modoEdicao = true;
      this.indiceItemEdicao = this.itens.indexOf(item);
      this.carregandoEdicao = true;
      this.dialogItem = !this.dialogItem;
      this.exibirMensagemDeErroDiariasMinima = false;

      if(this.modoEdicao && !this.ajustandoItem){
        this.item.incluidoNaGestao = false;
      }

      this.localizarPrecosProduto(item)
          .then(() => {
            this.item = new ItemOrcamentoLocacaoModel(item);
            this.itemOriginal = new ItemOrcamentoLocacaoModel(item);
            this.descricao = item.descricao || (item.produto && item.produto.nome);
            this.obterQuantidadeDisponivelDoProduto(item.produto);

          })
          .finally(() => this.carregandoEdicao = false)
    },

    emitirInformacoes(info) {
      this.$emit("onChange", info);
    },

    alterarFocus() {
      this.focoHabilitado = false;
    },

    listarPrecosProduto() {
      this.limparPreco();

      if (!this.item.produto || !this.item.produto.identificador || !this.identificadorEmpresa) {
        return;
      }

      this.localizarPrecosProduto(this.item);
    },

    localizarPrecosProduto(item) {
      this.carregandoPrecos = true;
      return apiProdutos.localizarPrecosProduto(item.produto.identificador).then((resposta) => {
        var produtoEmpresas = resposta || [];
        var produtoEmpresa = produtoEmpresas.find(pe => pe.empresa.identificador == this.identificadorEmpresa);
        this.precosProduto = (produtoEmpresa && produtoEmpresa.precos) || [];
        this.precos = this.precosProduto.map((pp)=>pp.preco);
        item.preco = (item.preco && this.precos.find(p => p.identificador == item.preco.identificador)) || item.preco;
        this.carregandoPrecos = false;
      });
    },

    limparPreco() {
      this.item.preco = undefined;
      this.precosProduto = [];
      this.precos = [];
      this.alterarPrecoDoProduto();
    },

    validarPeriodo() {
      if (this.item.dataInicialLocacao)
        this.mensagemDeErroDataInicial = "";

      if (this.item.dataFinalLocacao){
        this.mensagemDeErroDataFinal = "";

        let periodoEmDias = (moment(this.item.dataFinalLocacao).diff(moment(this.item.dataInicialLocacao), 'days') + 1);
        
        if (periodoEmDias <= 0) {
          this.mensagemDeErroDataInicial = "Período inválido";
          return;
        }

        if (this.item.dataInicialLocacao && periodoEmDias < this.item.quantidadeDiarias){
          this.mensagemDeErroDataFinal = "Período inferior às diárias";
        }
      }
    },

    alterarValorUnitario() {
      this.mensagemDeErroValorUnitario = "";
      let valorUnitarioPrecoProduto = this.item.preco && this.precosProduto.find(pp=>this.item.preco.identificador === pp.preco.identificador);
      this.item.preco = this.item.preco && valorUnitarioPrecoProduto.valor == this.item.valorUnitario ? this.item.preco : undefined;
    },

    alterarPrecoDoProduto() {
      this.mensagemDeErroValorUnitario = "";
      let valorUnitarioPrecoProduto = this.item.preco && this.precosProduto.find(pp=>this.item.preco.identificador === pp.preco.identificador);
      this.item.valorUnitario = (valorUnitarioPrecoProduto && valorUnitarioPrecoProduto.valor) || 0;
    },

    adicionarItemNaTabela() {
      if (!this.camposObrigatoriosEstaoPreenchidos()) {
        return;
      }

      let novoItem = new ItemOrcamentoLocacaoModel(this.item);

      if (this.indiceItemEdicao >= 0) {
        this.itens.splice(this.indiceItemEdicao, 1, novoItem);
        this.emitirInformacoes(this.itens);
      } else {
        this.emitirInformacoes(this.itens.concat([novoItem]));
      }

      if (!this.modoEdicao) {
        this.limparCamposModal();
        this.abrirModalParaAdicionarNovoItem();
      } else {
        this.limparCamposModal();
      }

      this.habilitaEditarDescricaoDoItem = true;
    },

    questionarUsuarioSobreDeletarItemDaTabela() {
      let cfgMsg = new CfgMensagemFlutuante();
      cfgMsg.titulo = `Exclusão do item`;
      cfgMsg.mensagem = `Confirma a exclusão deste item?`;
      cfgMsg.botaoPrimario.texto = "Sim";
      cfgMsg.botaoPrimario.callback = this.deletarItemDaTabela;
      cfgMsg.botaoSecundario.texto = "Não";
      this.$mensagemFlutuante.confirmacao(cfgMsg);
    },

    deletarItemDaTabela() {
      this.copiaItens.splice(this.index, 1);
      this.limparCamposModal();
      this.emitirInformacoes(this.copiaItens);
    },

    verificarExclusaoDoItemDaTabela(item) {
      this.copiaItens = this.itens.slice();

      this.index = this.copiaItens.indexOf(item)
      this.item = new ItemOrcamentoLocacaoModel(item);
      this.questionarUsuarioSobreDeletarItemDaTabela();
    },

    obterPosicaoItemNaLista(itemOriginal) {
      return this.itens
        .map(i => i.identificador)
        .indexOf(itemOriginal.identificador);
    },

    cancelarAdicaoDeItem() {
      this.limparCamposModal();
      this.emitirInformacoes(this.itens);
      this.habilitaEditarDescricaoDoItem = true;
    },

    limparCamposModal() {
      this.item = new ItemOrcamentoLocacaoModel();
      this.dialogItem = false;
      this.precosProduto = [];
      this.precos = [];
      this.indiceItemEdicao = -1;
      this.descricao = undefined;
      this.quantidadeDisponivel = 0;
      this.mensagemDeErroDataInicial = "";
      this.mensagemDeErroDataFinal = "";
      this.mensagemDeErroValorUnitario = "";
      this.mensagemDeErroProduto = "";
      this.mensagemDeErroValorTotalDoItem = "";
      this.exibirMensagemDeErroDiariasMinima = false;
    },

    obterClasseParaStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].classe) || '';
    },

    obterDescricaoDoStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].descricao) || '';
    },

    editarDescricaoDoItem() {
      this.habilitaEditarDescricaoDoItem = false;
    }
  },
}

export default itemMixin