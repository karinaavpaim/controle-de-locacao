import DesmembramentoMedicaoModel from '@/models/estoque/medicao/desmembramento-medicao-model';
import ItemDespesaMedicaoLocacaoModel from '@/models/estoque/medicao/item-despesa-medicao-locacao-model';
import ProdutoModel from '@/models/estoque/produto/produto-model';
import { CATEGORIAS_ITEM } from '@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants';
import floatUtils from '@/utils/float-util';

export default class ItemMedicaoLocacaoModel extends ItemDespesaMedicaoLocacaoModel {
  constructor(obj) {
    super(obj);
    obj = obj || {};
    this.identificadorItemLocacao = obj.identificadorItemLocacao;
    this.categoria = obj.categoria;
    this.dataInicialLocacao = obj.dataInicialLocacao;
    this.dataFinalLocacao = obj.dataFinalLocacao;
    this.quantidadeExpedida = obj.quantidadeExpedida || 0;
    this.valorUnitario = obj.valorUnitario || 0;
    this.quantidadeDiarias = obj.quantidadeDiarias || 0;
    this.quantidadePedida = obj.quantidadePedida || 0;
    this.produto = obj.produto && new ProdutoModel(obj.produto);
    this.desmembramentos = (obj.desmembramentos && obj.desmembramentos.map(d => new DesmembramentoMedicaoModel(d))) || [];
    this.descricao = obj.descricao;
  }

  retornarPorcentagemProgressaoDoItem() {
    // O filter remove os clones de desmembramento
    let desmembramentosMedidos = this.desmembramentos.filter(d => !d._hierarquia || d._hierarquia.length == 1).reduce((soma, desmembramento) => {
      return soma += (desmembramento.totalmenteMedido ? desmembramento.quantidadeMedida : desmembramento.quantidadeMaxima) * desmembramento.datasMedidas.length;
    }, 0);

    let percentual = (desmembramentosMedidos * 100) / (this.quantidadeDiarias * this.quantidadePedida);

    return Math.floor(percentual);
  }

  valorTotalParaMedicao(desmembramento) {
    // typecheck de precaucao
    desmembramento.quantidadeAMedir = desmembramento.quantidadeAMedir || 0;
    desmembramento.datasAMedir = desmembramento.datasAMedir || [];

    return desmembramento.datasAMedir.length * desmembramento.quantidadeAMedir * this.valorUnitario;
  }

  obterErrosNoEquipamentoOuMaterial() {
    let erros = [];
    let prefixoErro = `O produto ${this.produto.codigo} `;

    this.desmembramentos.forEach((desmembramento) => {
      if (!desmembramento.modeloAlterado())
        return;

      erros = erros.concat(this.obterErrosGeraisNoDesmembramento(prefixoErro, desmembramento));
      if (desmembramento._hierarquia && desmembramento._hierarquia.length === 1) // caso seja a origem dos clones
        erros = erros.concat(this.obterErrosNosClonesDoDesmembramento(prefixoErro, desmembramento));
    })

    return erros;
  }

  obterErrosNoServico() {
    let erros = [];
    let prefixoErro = `O serviço ${this.produto.codigo} `;

    this.desmembramentos.forEach((desmembramento) => {

      if (!desmembramento.modeloAlterado())
        return;

      erros = erros.concat(this.obterErrosGeraisNoDesmembramento(prefixoErro, desmembramento));

      if (!desmembramento.funcionario)
        erros.push(prefixoErro + "não possui uma pessoa vinculada.");
    })
    return erros;
  }

  obterErrosNoItemDaMedicaoAregistrar() {

    switch (this.categoria) {
      case CATEGORIAS_ITEM.EQUIPAMENTO:
      case CATEGORIAS_ITEM.MATERIAL:
        return this.obterErrosNoEquipamentoOuMaterial()

      case CATEGORIAS_ITEM.SERVICO:
        return this.obterErrosNoServico();
    }
  }

  obterValorTotalMedido() {
    let quantidadeTotalMedida = this.desmembramentos.reduce(
      (total, d) => total + (d.quantidadeMedida * d.datasMedidas.length), 0);

    return quantidadeTotalMedida ?
      floatUtils.duasCasasDecimais(this.valorUnitario * quantidadeTotalMedida) :
      0;
  }
}