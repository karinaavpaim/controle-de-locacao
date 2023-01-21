export default class UsuarioLogin {
  constructor(dados) {
    dados = dados || {};
    this.identificador = dados.Identificador || dados.identificador;
    this.identificadorFuncionario = dados.IdentificadorFuncionario || dados.identificadorFuncionario;
    this.nomeLogin = dados.NomeLogin || dados.nomeLogin;
    this.senha = dados.Senha || dados.senha;
    this.expirado = dados.expirado;
    this.id = dados.id;
    this.funcoes = dados.Funcoes || dados.funcoes;
  }
}