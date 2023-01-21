export default class PessoaPesquisaAvancadaModel {
    constructor(obj){
        obj = obj || {};
        this.nome = obj.nome;
        this.codigo = obj.codigo;
        this.codigoNome = obj.codigoNome;
        this.codigoNomeCPFouCNPJ = obj.codigoNomeCPFouCNPJ;
        this.CPFouCNPJ = obj.CPFouCNPJ;
        this.meioDeContato = obj.meioDeContato;
        this.telefoneFixo = obj.telefoneFixo;
        this.telefoneCelular = obj.telefoneCelular;
        this.identificadoresCategoria = obj.identificadoresCategorias || [];
    }

    modeloValido(){
        return !!(this.nome ||
                  this.codigo || 
                  this.CPFouCNPJ || 
                  this.meioDeContato || 
                  this.telefoneFixo || 
                  this.telefoneCelular);
    }

    preencherOCodigoComZerosAEsquerda(){
        this.codigo =  this.codigo && this.codigo.padStart(6,0);
    }

}