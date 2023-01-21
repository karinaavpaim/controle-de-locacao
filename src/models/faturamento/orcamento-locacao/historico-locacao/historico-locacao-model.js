import OrcamentoLocacaoModel from '../orcamento-locacao-model';

export default class HistoricoLocacaoModel {
    constructor(obj){
        obj = obj || {};
        this.identificador = obj.identificador;
        this.identificadorUsuario = obj.identificadorUsuario;
        this.identificadorOrcamento = obj.identificadorOrcamento;
        this.dataRegistro = obj.dataRegistro;
        this.valorHistorico = new OrcamentoLocacaoModel(obj.valorHistorico);
    }
    
}