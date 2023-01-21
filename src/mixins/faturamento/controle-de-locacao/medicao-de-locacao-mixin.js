import mascaraDinheiro from "@/utils/mascara-dinheiro";
import DesmembramentoMedicaoModel from "@/models/estoque/medicao/desmembramento-medicao-model";
import { STATUS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';

const medicaoDeLocacaoMixin = {
  props: {
    itensDaTabela: { type: Array, required: false, default: ()=>[] },
    itensParaExpandir: { type: Array, required: false, default: ()=>[] },
  },

  filters: {
    dinheiro(valor) {
      return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(valor);
    }
  },

  data() {
    return {
      stack:0,
      dadosDialogPeriodoMedicaoTodos: {
        exibir: false,
        parametros: {
          dataInicialLocacao: undefined,
          dataFinalLocacao: undefined,
          datasSelecionadas: []
        },
        callback: ()=>{}
      }
    }
  },
  methods: {
    emitirEventoHistoricoRemessaRetorno(item) {
      this.$emit('historicoRemessaRetorno', item);
    },

    cancelarPeriodoMedicaoTodos() {
      this.dadosDialogPeriodoMedicaoTodos.exibir = false;
    },

    exibirBlocoSemDados(item) {
      if (!item.desmembramentos || !item.desmembramentos.length)/* || (item.status === STATUS_ITEM.ATENDIDO_TOTALMENTE.nome) */
        return true;
    },

    desabilitarDesfazer(desmembramento){
      return !(desmembramento._hierarquia && desmembramento._hierarquia.length > 1) &&
      !(  
          !(desmembramento.quantidadeAMedir == desmembramento.quantidadeMaxima) || 
          desmembramento.datasAMedir.length
        ) || 
        desmembramento.totalmenteMedido
    },

    dadosLoteOuSerie(item) {
      return (item.serie || item.lote) || {}
    },

    duplicarCardMedicao(item, desmembramento){
      let indiceDesmembramento = item.desmembramentos.indexOf(desmembramento);
      let clone = new DesmembramentoMedicaoModel(desmembramento);
      this._limparAlteracoesDesmembramento(clone);
      if (desmembramento._hierarquia){
        // Se a hierarquia existe, entao esse desmembramento ja foi clonado.
        // logo, identifico o ultimo clone atraves dos identificadores dos clones e pego o ultimo valor inserido para gerar o proximo
        // recupero os dados pelo identificadorDocumentoItem para ter certeza que o desmembramento pertence ao mesmo lote/serie
        let ultimoClone = item
          .obterClonesDoDesmembramento(desmembramento)
          .reduce( (ultimoDesmembramento, desmembramento) => 
          desmembramento._hierarquia &&  desmembramento._hierarquia.length > ultimoDesmembramento._hierarquia.length ? desmembramento : ultimoDesmembramento,
            {_hierarquia: []}
          );

        clone._hierarquia = [...ultimoClone._hierarquia, ultimoClone._hierarquia[ultimoClone._hierarquia.length-1] + 1 ];
      }
      else {
        desmembramento._hierarquia = [0];
        clone._hierarquia = [0, 1];
      }

      item.desmembramentos.splice(indiceDesmembramento+1, 0, clone);
    },

    desfazerMedicao(item, desmembramento) {
      // se a medicao ainda nao tem clone ou seja o ultimo da lista, apenas faco a limpeza do modelo
      if (
        !desmembramento._hierarquia || 
        item.obterClonesDoDesmembramento(desmembramento).length === 1
      )
        this._limparAlteracoesDesmembramento(desmembramento);
      else {
        // caso existam diversos clones, removo o clone solicitado.
        let indiceDesmembramento = item.desmembramentos.indexOf(desmembramento);
        item.desmembramentos.splice(indiceDesmembramento, 1);
        // em seguida, rodo um alinhamento para que os identificadores dos clones continuem sequenciais e em ordem
        item
          .obterClonesDoDesmembramento(desmembramento)
          .sort(
            (d1, d2)=> {
              if(d1._hierarquia.length > d2._hierarquia.length) return 1;
              if(d1._hierarquia.length < d2._hierarquia.length) return -1;
              return 0;
          })
          .reduce(
            (hierarquia, desmembramento)=>{
              desmembramento._hierarquia = hierarquia.slice();
              hierarquia.push(hierarquia[hierarquia.length-1] + 1)
              return hierarquia;
          }, [0]);
      }
      this.emitirAlteracoes();
    },

    _limparAlteracoesDesmembramento(desmembramento){
      desmembramento.quantidadeAMedir = desmembramento.quantidadeMaxima;
      desmembramento.datasAMedir = [];
      desmembramento.funcionario = undefined;
      desmembramento.observacao = undefined;
      desmembramento._hierarquia = undefined;
    },

    quantidadeDesmembramentoInvalida(item, desmembramento){
      return desmembramento.quantidadeAMedir > desmembramento.quantidadeMaxima || 
        (
          desmembramento._hierarquia && 
          desmembramento._hierarquia.length > 1 
          && item.quantidadeDosClonesUltrapassaMaximo(desmembramento)
        )
    },

    emitirAlteracoes() {
      this.$emit("onChange", this.itensDaTabela);
    },

    diariasExcedidas(item, desmembramento) {
      return desmembramento.datasAMedir.length > (item.quantidadeDiarias - desmembramento.datasMedidas.length);
    },

    obterClasseParaStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].classe) || '';
    },

    obterDescricaoDoStatus(status) {
      return (STATUS_ITEM[status] && STATUS_ITEM[status].descricao) || '';
    }
  }
}

export default medicaoDeLocacaoMixin