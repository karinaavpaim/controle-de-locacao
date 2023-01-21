import axiosConfig from '@/api/axios-config.js';
import OperacaoModel from '@/models/geral/operacao-model';

const atributosOperacao = `
  identificador,
  codigo,
  codigoNome,
  descricao,
  tipo,
  atualizaEstoque,
  atualizaFinanceiro,
  identificadorTipoDocumento,
  identificadoresDasEmpresasVinculadasAoTipoDocumento
`;

function localizarOperacoes() {
  let query = `{
    dados:operacao {
      ${atributosOperacao}
    }
  }`.replace(/[\n]*[ ]*/gm, '');
  return axiosConfig.executarQueryGraphQL(query, "dados", OperacaoModel);
}

function localizarOperacoesPorIdentificador(identificador) {
  let query = `{
    dados:operacao(identificador:"${identificador}") {
      ${atributosOperacao}
    }
  }`.replace(/[\n]*[ ]*/gm, '');
  return axiosConfig.executarQueryGraphQL(query, "dados", OperacaoModel);
}

export default { 
  localizarOperacoes,
  localizarOperacoesPorIdentificador
};