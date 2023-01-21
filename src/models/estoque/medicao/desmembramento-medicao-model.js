import ProdutoLoteSerieModel from '@/models/estoque/produto/produto-lote-serie-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';

export default class DesmembramentoMedicaoModel {
  constructor(obj) {
    obj = obj || {};
    this.identificadorDocumentoItem = obj.identificadorDocumentoItem;
    this.identificadorDesmembramento = Number(obj.identificadorDesmembramento) || 0;
    this.identificadorDesmembramentoOrigem = obj.identificadorDesmembramentoOrigem;
    this.quantidadeMaxima = Number(obj.quantidadeMaxima) || 0;
    this.quantidadeMedida = Number(obj.quantidadeMedida) || 0;
    this.quantidadeAMedir = Number(obj.quantidadeAMedir) || this.quantidadeMaxima; // a principio essa propriedade so deve ser usada na medicao. por isso utilizo o construtor

    this.observacao = obj.observacao;
    this.funcionario = obj.funcionario && new PessoaModel(obj.funcionario);
    this.datasMedidas = obj.datasMedidas || [];
    this.datasAMedir = obj.datasAMedir || [];
    this.totalmenteMedido = obj.totalmenteMedido || false;

    this.lote = obj.lote && new ProdutoLoteSerieModel(obj.lote);
    this.serie = obj.serie && new ProdutoLoteSerieModel(obj.serie);

    // campo de hierarquia da medicao. deve ser utilizado apenas la e mantido como undefined no restante
    // Ele existe pois apos alterar os identificadores para realizar a medicao, 
    // nao seria possivel retornar ao estado anterior se fosse utilizado a reatividade do vue
    // type: Array<Int>
    this._hierarquia = obj._hierarquia;
    // comeca no [0] apenas quando houver desmembramento
  }

  modeloValido(){
    return true;
  }
  
  medicaoComoItemDespesaValida(){
    return !!((this.datasAMedir.length && this.quantidadeAMedir) && !this.totalmenteMedido)
  }

  medicaoComoServicoValida(){
    return !!((this.datasAMedir.length && this.quantidadeAMedir && this.funcionario) && !this.totalmenteMedido);
  }

  modeloAlterado(){
    return !!((this.datasAMedir.length || this.quantidadeAMedir != this.quantidadeMaxima || this.funcionario || this.observacao) && !this.totalmenteMedido)
  }

  retornarPorcentagemProgressao(item) {
    let percentual = ((this.datasMedidas.length * 100) / item.quantidadeDiarias);

    return Math.ceil(percentual);
  }
}