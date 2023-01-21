import NaturezaLancamentoModel from "@/models/financeiro/natureza-lancamento-model";
import ItemDespesaMedicaoLocacaoModel from '@/models/estoque/medicao/item-despesa-medicao-locacao-model';
import DesmembramentoMedicaoModel from "./desmembramento-medicao-model";
import floatUtils from '@/utils/float-util';

export default class DespesaMedicaoLocacaoModel extends ItemDespesaMedicaoLocacaoModel{
    constructor(obj){
      super(obj);
      obj = obj || {};
        this.identificador = obj.identificador;
        this.valorItem = obj.valorItem || 0;
        this.quantidade = obj.quantidade || 0;
        this.valorAdicionalPersonalizado = obj.valorAdicionalPersonalizado || 0;
        this.naturezaLancamento = obj.naturezaLancamento && new NaturezaLancamentoModel(obj.naturezaLancamento);
        this.desmembramentos = (obj.desmembramentos && obj.desmembramentos.map(i => new DesmembramentoMedicaoModel(i)).sort(this.ordenarDesmembramentos)) || []; 
      }

    ordenarDesmembramentos(d1, d2){
        if (d1.totalmenteMedido && !d2.totalmenteMedido)
            return 1;
        else if (!d1.totalmenteMedido && d2.totalmenteMedido)
            return -1;
        else
            return 0;
    }

    valorTotalParaMedicao(desmembramento){
        // typecheck de precaucao
        desmembramento.quantidadeAMedir = desmembramento.quantidadeAMedir || 0;

        return desmembramento.datasAMedir.length && desmembramento.quantidadeAMedir * this.valorItem;
    }

    valorTotalMedido(desmembramento){
        return desmembramento.quantidadeMedida * this.valorItem;
    }

    valorTotalMedicaoDespesa(){
        return this.desmembramentos.reduce((soma, desmembramento) => this.valorTotalParaMedicao(desmembramento) + soma, 0)
    }

    valorTotalDaDespesa(){
        return this.quantidade * this.valorItem;
    }

    obterErrosNaDespesaDaMedicaoAregistrar(){
        let erros = [];
        let prefixoErro = `A despesa ${this.naturezaLancamento.codigo} `;

        this.desmembramentos.forEach((desmembramento)=>{
            if (!desmembramento.modeloAlterado())
                return;
        
            erros = erros.concat(this.obterErrosGeraisNoDesmembramento(prefixoErro, desmembramento));
            
            if (desmembramento._hierarquia && desmembramento._hierarquia.length === 1) // caso seja a origem dos clones
                erros = erros.concat(this.obterErrosNosClonesDoDesmembramento(prefixoErro, desmembramento));
        });

        return erros;
    }

    obterValorTotalMedido() {
      let quantidadeTotalMedida = this.desmembramentos.reduce((total, d) => total + d.quantidadeMedida, 0);

      return quantidadeTotalMedida
        ? floatUtils.duasCasasDecimais(this.valorItem * quantidadeTotalMedida)
        : 0;
    }
}