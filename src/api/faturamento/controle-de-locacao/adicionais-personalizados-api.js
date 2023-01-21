'use strict';

import axiosConfig from '@/api/axios-config.js';
import AdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/adicional-personalizado-model';

function cadastrar(dados) {
  var mutation = `
    mutation($adicionalPersonalizado: AdicionalPersonalizadoInput) {
      cadastrarAdicionalPersonalizado(adicionalPersonalizado: $adicionalPersonalizado){
        ${camposAdicionaisPersonalizados}
      }
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { adicionalPersonalizado: dados };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'cadastrarAdicionalPersonalizado');
}

function editar(dados) {
  var mutation = `
    mutation($adicionalPersonalizado: AdicionalPersonalizadoInput) {
      editarAdicionalPersonalizado(adicionalPersonalizado: $adicionalPersonalizado){
        ${camposAdicionaisPersonalizados}
      }
    }`.replace(/[\n]*[ ]*/gm, '');
  var variaveis = { adicionalPersonalizado: dados };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'editarAdicionalPersonalizado');
}

function excluir(identificador) {
  var mutation = `

  mutation($identificador: TextoNumericoOuNumero) {
    dados: excluirAdicionalPersonalizado(identificador: $identificador) {
      ${camposAdicionaisPersonalizados}
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  var variaveis = { identificador };

  return axiosConfig.executarMutationGraphQL(mutation, variaveis, 'editarAdicionalPersonalizado');
}
function obter(consulta) {
  consulta = consulta || '';
  let query = `{
    dados: adicionalPersonalizado(consulta:"%1") {
      ${camposAdicionaisPersonalizados}
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace('%1', consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, 'dados', AdicionalPersonalizadoModel);
}

function obterPorIdentificador(identificador) {
  identificador = identificador || '';
  let query = `{
    dados: adicionalPersonalizado(identificador: ${identificador}) {
      ${camposAdicionaisPersonalizados}
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', AdicionalPersonalizadoModel);
}

function obterItensDoAdicionalPersonalizado(identificador) {
  identificador = identificador || '';
  let query = `{
    dados: adicionalPersonalizado(identificador: ${identificador}) {
      identificador,
      itens{
        aliquota,
        atualizaDespesas,
        atualizaEquipamentos,
        atualizaMateriais,
        atualizaServicos,
        descricao,
        identificador,
        revisao
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', AdicionalPersonalizadoModel);
}

function obterAdicionaisPersonalizadosSimplificado(consulta) {
  consulta = consulta || '';
  let query = `{
    dados: adicionalPersonalizado(consulta:"%1") {
      codigo,
      descricao,
      identificador
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace('%1', consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, 'dados', AdicionalPersonalizadoModel);
}

const camposAdicionaisPersonalizados = `
  codigo,
  descricao,
  identificador,
  itens{
    aliquota,
    atualizaDespesas,
    atualizaEquipamentos,
    atualizaMateriais,
    atualizaServicos,
    descricao,
    identificador,
    revisao
  }`;

export default {
  obter,
  cadastrar,
  editar,
  excluir,
  obterPorIdentificador,
  obterItensDoAdicionalPersonalizado,
  obterAdicionaisPersonalizadosSimplificado
};