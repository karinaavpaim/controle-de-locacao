'use strict';

import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import axiosConfig from '@/api/axios-config.js';

function localizarPessoa(consulta, categorias, identificador) {
  categorias = categorias || [];
  consulta = consulta || "";
  identificador = identificador || "";
  let query = `{
    dados: pessoa(consulta: "%1", categorias: [${categorias.join(",")}], identificador: "${identificador}") {
      identificador,
      codigo,
      codigoNome,
      codigoNomeCPFouCNPJ,
      nome,
      nomeCurto,
      CPFouCNPJ,
      categorias {nome, identificador},
      enderecoPrincipal {
        contatoPrincipal {
          pessoaDeContato,
          email,
          telefoneFixo,
          telefoneCelular
        }
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace("%1", consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, "dados", PessoaModel);
}

function localizarPessoaPesquisaAvancada(pesquisaAvancada) {
  let query = `{
    dados: pessoaPesquisaAvancada(pesquisaAvancadaPessoa: {
      codigo:"%1",
      nome:"%2",
      CPFouCNPJ:"%3",
      meioDeContato:"%4",
      telefoneFixo:"%5",
      telefoneCelular:"%6",
      identificadoresCategoria:["%7"]
    }) {
      identificador,
      codigo,
      codigoNome,
      codigoNomeCPFouCNPJ,
      nome,
      nomeCurto,
      CPFouCNPJ,
      categorias {nome, identificador}
    }
  }`.replace(/[\n]*[ ]*/gm, '')
  .replace('%1', (pesquisaAvancada.codigo && pesquisaAvancada.codigo.replace(/"/g, "\\\"")) || '')
  .replace('%2', (pesquisaAvancada.nome && pesquisaAvancada.nome.replace(/"/g, "\\\"")) || '')
  .replace('%3', (pesquisaAvancada.CPFouCNPJ && pesquisaAvancada.CPFouCNPJ.replace(/"/g, "\\\"")) || '')
  .replace('%4', (pesquisaAvancada.meioDeContato && pesquisaAvancada.meioDeContato.replace(/"/g, "\\\"")) || '')
  .replace('%5', (pesquisaAvancada.telefoneFixo && pesquisaAvancada.telefoneFixo.replace(/"/g, "\\\"")) || '')
  .replace('%6', (pesquisaAvancada.telefoneCelular && pesquisaAvancada.telefoneCelular.replace(/"/g, "\\\"")) || '')
  .replace('%7', (Array.isArray(pesquisaAvancada.identificadoresCategoria) && pesquisaAvancada.identificadoresCategoria.join('","')));


  return axiosConfig.executarQueryGraphQL(query, 'dados', PessoaModel);
}

function localizarPessoaComFoto(identificador) {
  identificador = identificador || "";
  let query = `{
    dados: pessoa(identificador: "${identificador}") {
      identificador,
      codigo,
      codigoNome,
      codigoNomeCPFouCNPJ,
      nome,
      nomeCurto,
      CPFouCNPJ,
      categorias {nome, identificador},
      foto
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, "dados", PessoaModel);
}

export default {
  localizarPessoa,
  localizarPessoaComFoto,
  localizarPessoaPesquisaAvancada
};