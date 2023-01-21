import axiosConfig from '@/api/axios-config.js';
import RegistroEmUsoModel from '@/models/geral/registro-em-uso';

const atributosRegistroEmUso = `
    identificador,
    nomeUsuario,
    identificadorEntidade,
    nomeEntidade
`;

function removerRegistroEmUso(identificadorRegistroEmUso) {
  var mutation = `
  mutation {
    dados:removerRegistroEmUso(identificadorRegistroEmUso:${identificadorRegistroEmUso}){
      ${atributosRegistroEmUso}
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarMutationGraphQL(mutation, undefined, 'dados', RegistroEmUsoModel);
}

function registrarUso(identificadorEntidade, nomeEntidade) {
  var mutation = `
  mutation($registrarUso: RegistrarUsoInput!){
    dados:registrarUso(registrarUso: $registrarUso){
      ${atributosRegistroEmUso}
    }
  }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { registrarUso: {identificadorEntidade, nomeEntidade} };
  return axiosConfig.executarMutationGraphQL(mutation, variaveis, "dados", RegistroEmUsoModel);
}

function assinarNotificacoesRegistroEmUso(metodoParaNotificacao) {
  let query = `
    subscription {
      notificacaoRegistroEmUso {
        registroEmUsoAtualizado {
          ${atributosRegistroEmUso}
        },
        registroNecessitaAtualizacao {
          ${atributosRegistroEmUso}
        }
      }
    }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.assinarNotificacoesGraphQL(query, metodoParaNotificacao);
}

export default {
  registrarUso,
  removerRegistroEmUso,
  assinarNotificacoesRegistroEmUso
};