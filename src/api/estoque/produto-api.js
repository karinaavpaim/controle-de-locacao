'use strict';

import axiosConfig from '@/api/axios-config.js';
import ProdutoModel from '@/models/estoque/produto/produto-model';
import ImagemModel from '@/models/geral/imagem-model';
import EmpresaProdutoModel from '@/models/estoque/produto/empresa-produto-model';
import QuantidadeEstoqueDisponivelProdutoModel from '@/models/estoque/produto/quantidade-estoque-disponivel-model';

/**
 * @function
 * Função que obtém produtos de forma geral, não valida empresa e/ou setores.
 * 
 * @param {String} consulta - Código ou nome do produto a ser localizado.
 * @param {Array.<String>} tipos - Array contendo os tipos de produtos suportudados pela API do Bimer.
 * @returns Lista contendo os produtos encontrados com base na pesquisa.
 */
function localizarProduto(consulta, tipos) {
  consulta = consulta || "";
  tipos = (Array.isArray(tipos) && tipos) || [];

  let query = `{
    dados: produto(consulta: "%1", tipos: [${tipos.join(",")}]) {
      identificador,
      codigo,
      codigoNome,
      nome
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace("%1", consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, 'dados', ProdutoModel);
}

function localizarProdutoPesquisaAvancada(pesquisaAvancada, tipos) {
  tipos = (Array.isArray(tipos) && tipos) || [];
  pesquisaAvancada.identificadoresSetores = (Array.isArray(pesquisaAvancada.identificadoresSetores) && 
                                            pesquisaAvancada.identificadoresSetores) || [];
  
  let query = `{
    dados: produtoPesquisaAvancada (pesquisaAvancadaProduto : {
      codigo:"%1",
      nome:"%2",
      classificacao:"%3",
      aplicacao:"%4",
      nomeGrupo:"%5",
      caracteristica:"%6",
      codigoEmpresa:"%7",
      identificadoresSetores: ["%8"]
      ultilizarAndNoFiltro: %9
    }, tipos: [%10]) {
      identificador,
      nome,
      codigo,
      bloqueiaCriacaoAtendimento,
      produtoComposto,
      codigoNome,
      descricaoAplicacao
    }
  }`.replace(/[\n]*[ ]*/gm, '')
    .replace('%1', (pesquisaAvancada.codigo) && pesquisaAvancada.codigo.replace(/"/g, "\\\"") || '')
    .replace('%2', (pesquisaAvancada.nome) && pesquisaAvancada.nome.replace(/"/g, "\\\"") || '')
    .replace('%3', (pesquisaAvancada.classificacao) && pesquisaAvancada.classificacao.replace(/"/g, "\\\"") || '')
    .replace('%4', (pesquisaAvancada.aplicacao) && pesquisaAvancada.aplicacao.replace(/"/g, "\\\"") || '')
    .replace('%5', (pesquisaAvancada.nomeGrupo) && pesquisaAvancada.nomeGrupo.replace(/"/g, "\\\"") || '')
    .replace('%6', (pesquisaAvancada.caracteristica) && pesquisaAvancada.caracteristica.replace(/"/g, "\\\"") || '')
    .replace('%7', (pesquisaAvancada.codigoEmpresa) && pesquisaAvancada.codigoEmpresa.replace(/"/g, "\\\"") || '')
    .replace('%8', pesquisaAvancada.identificadoresSetores.join('","'))
    .replace('%9', pesquisaAvancada.ultilizarAndNoFiltro)
    .replace('%10', tipos.join(','));

  return axiosConfig.executarQueryGraphQL(query, 'dados', ProdutoModel);
}

async function localizarPrecosProduto(identificador) {
  if ((!identificador) || (identificador == ''))
    return Promise.resolve([]);

  let query = `{
    dados: produto(identificador: "${identificador}") {
      empresasProduto {
        empresa {
          identificador,
          nome,
          codigo
        },
        precos {
          preco {
            identificador,
            nome,
            codigo
          },
          valor
        }
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  //TODO: alterar para trazer o produto ao inves de so precoproduto e alterar o nome do metodo produtoPorId
  // assim posso retirar esse codigo e deixar ele padrao com os outros
  return new Promise((resolve, reject) => {
    axiosConfig.executarQueryGraphQL(query, "dados")
      .then((produtos) => {
        var empresasProduto = (produtos[0] && produtos[0].empresasProduto) || [];
        resolve(
          empresasProduto.map(
            p =>  new EmpresaProdutoModel(p)
          )
        )
      })
      .catch((erro) => {
        reject(erro);
      })
  });
}

async function obterImagensProduto(identificadorProduto) {
  if ((!identificadorProduto) || (identificadorProduto == ''))
    return Promise.resolve([]);

  let query = `{
    dados:imagensProduto(identificadorProduto:"${identificadorProduto}"){
      conteudo,
      conteudoMiniatura,
      descricao,
      tipo
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, 'dados', ImagemModel);
}

function localizarQuantidadeDisponivelProdutos(
  listaIdentificadoresProduto, 
  codigoEmpresa, 
  identificadorDoSetorRequisitante, 
  identificadorDoSetorRequisitado ) {
  
  var identificadores = `["${listaIdentificadoresProduto.join('"')}"]`;
  let query = `{
    dados:obterQuantidadeDisponivel(pesquisaEstoqueDisponivel: {
      identificadoresProdutos: ${identificadores},
      codigoEmpresa: ${codigoEmpresa},
      identificadorDoSetorRequisitante:"${identificadorDoSetorRequisitante}",
      identificadorDoSetorRequisitado:"${identificadorDoSetorRequisitado}"
    }){
      identificadorProduto,
      quantidadeDisponivel
    }
  }`;

  return axiosConfig.executarQueryGraphQL(query, 'dados', QuantidadeEstoqueDisponivelProdutoModel);
}

export default {
  obterImagensProduto,
  localizarProduto,
  localizarPrecosProduto,
  localizarProdutoPesquisaAvancada,
  localizarQuantidadeDisponivelProdutos
};