export default class RegistroEmUsoModel {
    constructor(obj){
        obj = obj || {};
        this.identificador = obj.identificador;
        this.hashSenhaUsuario = obj.hashSenhaUsuario;//Utilizamos rash da senha pois o identificador não vem no contexto.
        this.nomeUsuario = obj.nomeUsuario;
        this.identificadorEntidade = obj.identificadorEntidade;
        this.nomeEntidade = obj.nomeEntidade;
    }

    modeloValido(){
        return !!(this.identificador && this.identificadorEntidade && this.nomeEntidade && this.nomeUsuario);
    }
}