import axiosConfig from '@/api/axios-config.js';
import LocacaoCacheModel from '@/models/faturamento/orcamento-locacao/locacao-cache-model';

const CAMPOS = `
        identificador,
        descricao,
        identificadorEntidade,
        nomeEntidade,
        identificadorUsuario,
        loginUsuario,
        valor`;

/**
 * 
 * @param {String} identificadorLocacaoCache 
 * @param {String} identificadorUsuario 
 * @param {Boolean} obterValor 
 */
function obterLocacaoCache(identificadorLocacaoCache, identificadorUsuario, obterValor) {  
    let query = `{
      dados: locacaoCache(
        identificadorLocacaoCache:"${ identificadorLocacaoCache || '' }", 
        identificadorUsuario:"${ identificadorUsuario || '' }",
        obterValor:${ obterValor || false }){
            ${CAMPOS}
      }
    }`.replace(/[\n]*[ ]*/gm, '');

    return axiosConfig.executarQueryGraphQL(query, 'dados', LocacaoCacheModel);
}


function cadastrarOuEditarLocacaoCache(locacaoCache) {
    let mutation = `
        mutation ($locacaoCache: LocacaoCacheInput) {
            dados: cadastrarOuEditarLocacaoCache(locacaoCache: $locacaoCache) {
                ${CAMPOS}
            }
        }`.replace(/[\n]*[ ]*/gm, '');
  
    let variaveis = { locacaoCache };
  
    return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

function deletarLocacaoCache(identificador) {
    let mutation = `
    mutation($identificador: TextoNumericoOuNumero){
        dados:deletarLocacaoCache(
          identificadorLocacaoCache: $identificador){
            ${CAMPOS}
        }
      }`.replace(/[\n]*[ ]*/gm, '');
  
    let variaveis = { identificador };
  
    return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'dados');
}

export default {
    obterLocacaoCache,
    cadastrarOuEditarLocacaoCache,
    deletarLocacaoCache
}