import axiosConfig from '@/api/axios-config.js';
import ModeloPropostaModel from '@/models/faturamento/proposta-locacao/modelo-proposta-model';
import PropostaModel from '@/models/faturamento/proposta-locacao/proposta-locacao-model';
import VariaveisModeloPropostaLocacaoModel from '@/models/faturamento/proposta-locacao/variaveis-modelo-proposta-locacao-model';

function obterModelosDePropostas(consulta) {
  consulta = consulta || '';

  let query = `{
    dados: modeloPropostaLocacao(consulta:"%1") {${CAMPOS_MODELO}}
  }`.replace(/[\n]*[ ]*/gm, '').replace('%1', consulta.replace(/"/g, '\\"'));

  return axiosConfig.executarQueryGraphQL(query, 'dados', ModeloPropostaModel);
}

function obterProposta(identificadorOrcamento) {
  let query = `{
    dados: propostaLocacao(identificadorOrcamento: ${identificadorOrcamento}) {${CAMPOS_PROPOSTA}}
  }`
  return axiosConfig.executarQueryGraphQL(query, 'dados', PropostaModel);
}
function obterModeloDePropostaPorIdentificador(identificador) {
  let query = `{
    dados: modeloPropostaLocacao(identificador:"%1") {${CAMPOS_MODELO}}
  }`.replace(/[\n]*[ ]*/gm, '').replace('%1', identificador);

  return axiosConfig.executarQueryGraphQL(query, 'dados', ModeloPropostaModel);
}

function obterModelosDePropostaSemTrazerConteudo(consulta) {
  consulta = consulta || '';
  let query = `{
    dados: modeloPropostaLocacao(consulta:"%1") {
      identificador,
      nome,
      tipoModelo,
      descricao
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace('%1', consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, 'dados', ModeloPropostaModel);
}


function obterVariaveisDoSistema(consulta) {
  consulta = consulta || '';

  let query = `{
    dados: variaveisModeloPropostaLocacao(consulta:"%1") {${CAMPOS_VARIAVEIS_DE_MODELO}}
  }`.replace(/[\n]*[ ]*/gm, '').replace('%1', consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, 'dados', VariaveisModeloPropostaLocacaoModel);
}

function cadastrarProposta(proposta) {
  let mutation = `
    mutation($proposta: PropostaLocacaoInput!) {
      dados: cadastrarPropostaLocacao(propostaLocacao: $proposta) {${CAMPOS_PROPOSTA}}
    }`;

  let variaveis = { proposta };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

function editarProposta(proposta) {
  let mutation = `
    mutation($proposta: PropostaLocacaoInput!) {
      dados: editarPropostaLocacao(propostaLocacao: $proposta) {${CAMPOS_PROPOSTA}}
    }`;

  let variaveis = { proposta };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}
function cadastrarModeloProposta(dados) {
  var mutation = `
    mutation($proposta: ModeloPropostaLocacaoInput!) {
      dados: cadastrarModeloPropostaLocacao(modeloPropostaLocacao: $proposta) {${CAMPOS_MODELO}}
    }`;
  var variaveis = { proposta: dados };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

function editarModeloProposta(dados) {
  var mutation = `
    mutation($modelo: ModeloPropostaLocacaoInputEdicao!) {
      dados: editarModeloPropostaLocacao(modeloPropostaLocacao: $modelo) {${CAMPOS_MODELO}}
    }`;
  var variaveis = { modelo: dados };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, "dados");
}

function deletarModeloProposta(dados) {
  var mutation = `
    mutation($modelo: TextoNumericoOuNumero) {
      dados: deletarModeloPropostaLocacao(identificadorModeloLocacao: $modelo) {${CAMPOS_MODELO}}
    }`;
  var variaveis = { modelo: dados };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

const CAMPOS_VARIAVEIS_DE_MODELO = `
  identificadorPai,
  nomePai,
  filhas {
    identificador,
    nome,
    inline,
    tipo,
    conteudo
  }`;

const CAMPOS_MODELO = `
  identificador,
  nome,
  tipoModelo,
  descricao,
  conteudo`;

const CAMPOS_PROPOSTA = `
  identificador,
  identificadorOrcamento,
  identificadorUsuario,
  conteudo,
  conteudoPropostaModelo,
  modelo {
    identificador,
    nome,
    tipoModelo,
    descricao,
  }`;

export default {
  obterVariaveisDoSistema,
  obterModelosDePropostas,
  cadastrarModeloProposta,
  editarModeloProposta,
  obterModelosDePropostaSemTrazerConteudo,
  obterModeloDePropostaPorIdentificador,
  cadastrarProposta,
  editarProposta,
  obterProposta,
  deletarModeloProposta
};