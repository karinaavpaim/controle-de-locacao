import {
  STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE
} from "@/constants/estoque/controle-de-estoque/selecao-documentos-constants";

const separacaoMixin = {
  data() {
    return {
      statusItemDocumentoControleEstoque: STATUS_ITEM_DOCUMENTO_CONTROLE_ESTOQUE
    }
  },

  methods: {
    atualizarStatusItem(item) {
      let totalMovimentos = item.movimentos.reduce((total, movimento) => total += movimento.quantidade, 0);

      if (totalMovimentos === 0) {
        item.status = this.statusItemDocumentoControleEstoque.PENDENTE.valor;
        return;
      }

      item.status = (totalMovimentos == item.quantidade)
        ? this.statusItemDocumentoControleEstoque.ATENDIDO_TOTALMENTE.valor
        : this.statusItemDocumentoControleEstoque.ATENDIDO_PARCIALMENTE.valor; //this.statusItemDocumentoControleEstoque.ATENDIDO_COM_CORTE.valor
    }
  }
}

export default separacaoMixin;