'use strict';

import axiosConfig from '@/api/axios-config.js';
import EmpresaModel from '@/models/geral/empresa-model';
import SetorModel from '@/models/geral/setor-model';

function localizarEmpresa(consulta, login) {
  consulta = (consulta && consulta.replace(/"/g, "\\\"")) || "";
  login = (login && login.replace(/"/g, "\\\"")) || "";

  let query = `{
    dados:empresa(consulta:"%1",login:"%2") {
      identificador,
      nome,
      codigo,
      codigoNome,
      CNPJ,
      nomeCurto,
      endereco {
        ativo,
        bairro {
          codigo,
          identificador,
          nome,
        },
        bairroCidadeUnidadeFederativaCep,
        cep,
        cidade {
          codigo,
          codigoDDD,
          codigoIBGE,
          identificador,
          nome,
          UF {
            codigoIBGE,
            nome,
            sigla,
          }
        },
        codigo,
        codigoSuframa,
        complemento,
        inscricaoEstadual,
        inscricaoMunicipal,
        latitude,
        longitude,
        nomeLogradouro,
        numeroLogradouro,
        observacao,
        pessoasDeContato {
          contatoPrincipal,
          contatos {
            descricao,
            tipo,
          },
          identificador,
          nome,
          telefoneFixo,
          telefoneCelular,
          email
        },
        tipoNomeNumeroComplementoLogradouro,
        tiposEndereco
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace("%1", consulta).replace("%2", login);

  return axiosConfig.executarQueryGraphQL(query, "dados", EmpresaModel);
}

function localizarSetoresPorIdentificadorEmpresa(identificadorEmpresa) {
  let query = `{
    dados:setores(identificadorEmpresa:"${identificadorEmpresa}") {
      identificador,
      codigo,
      codigoNome,
      descricao,
      codigoEmpresa,
      controlaEstoque,
      controlaLote,
      observacao,
      identificadorCentroDeCusto,
      identificadorEmpresa,
      permiteSolicitarQuantidadeNegativa
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, "dados", SetorModel);
}

export default {
  localizarEmpresa,
  localizarSetoresPorIdentificadorEmpresa
};