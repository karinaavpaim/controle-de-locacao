export default class ProdutoPesquisaAvancadaModel {
    constructor(obj){
        obj = obj || {};
        this.nome = obj.nome;
        this.codigo = obj.codigo;
        this.classificacao = obj.classificacao;
        this.aplicacao = obj.aplicacao;
        this.nomeGrupo = obj.nomeGrupo;
        this.caracteristica = obj.caracteristica;
        this.codigoEmpresa = obj.codigoEmpresa;
        this.identificadoresSetores = obj.identificadoresSetores || [];
        this.ultilizarAndNoFiltro = (obj.ultilizarAndNoFiltro) ? true : false;
    }

    modeloValido(){
        return !!(this.nome ||
                  this.codigo || 
                  this.classificacao || 
                  this.aplicacao || 
                  this.nomeGrupo || 
                  this.caracteristica);
    }
}