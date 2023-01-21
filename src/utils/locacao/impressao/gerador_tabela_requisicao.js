'use strict'
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import { TIPOS_REQUISICAO } from "@/constants/faturamento/controle-de-locacao/requisicao-constants"
import { criarLinha, criarColuna, quebraDeLinha } from "@/utils/locacao/impressao/impressao-locacao-utils";
import dataUtils from "@/utils/data.js";

function gerarLinhasRequisicao(requisicao) {
  let equipamentos = requisicao.itens.filter(item => (item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO) && item.quantidadeARequisitar);
  let materiais = requisicao.itens.filter(item => (item.categoria === CATEGORIAS_ITEM.MATERIAL) && item.quantidadeARequisitar);
  return _gerarLinhasItensRequisicao(equipamentos, "EQUIPAMENTOS") + _gerarLinhasItensRequisicao(materiais, "MATERIAIS");
}

function gerarLinhasDevolucao(requisicao) {
  let equipamentos = requisicao.itens.filter(item => item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO);
  let materiais = requisicao.itens.filter(item => item.categoria === CATEGORIAS_ITEM.MATERIAL);
  return _gerarLinhasItensDevolucao(equipamentos, "EQUIPAMENTOS") + _gerarLinhasItensDevolucao(materiais, "MATERIAIS");
}

function gerarLinhasCabecalhoRequisicao(tipoRelatorio, requisicao) {
  var nomeData = (requisicao.tipo == TIPOS_REQUISICAO.REQUISICAO) ? 'requisição' : 'devolução';
  return `${criarLinha(
    criarColuna(`RELATÓRIO DE ${tipoRelatorio.toUpperCase()}`, "100%", "center", true)
  )}
  ${criarLinha(
    criarColuna(`Requisição: ${requisicao.codigoRequisicao}`, "50%"), criarColuna(`Data da ${nomeData}: ${dataUtils.aplicarMascaraDataHoraEmDataIso(requisicao.dataReferencia)}`, "50%")
  )}
  ${criarLinha(
    criarColuna(
      `Contrato: ${requisicao.codigoLocacao + quebraDeLinha()}
       Cliente: ${requisicao.cliente.nome + quebraDeLinha()}
       CNPJ: ${requisicao.cliente.CPFouCNPJ}`
      , "100%"
    )
  )}`
}

function _gerarLinhasItensRequisicao(itens, titulo) {
  if (!itens.length) return "";

  let retorno = criarLinha(criarColuna(titulo, "100%", "left", true));
  retorno += criarLinha(
    criarColuna("Código", "15%", "left"), criarColuna("Descrição", "70%", "left"), criarColuna("Quantidade", "15%", "center")
  );

  itens.forEach(item => {
    retorno += criarLinha(
      criarColuna(item.produto.codigo, "15%", "left"), criarColuna(item.descricao || item.produto.nome, "70%", "left"), criarColuna(item.quantidadeARequisitar, "15%", "center")
    );
  });
  return retorno;
}

function _gerarLinhasItensDevolucao(itens, titulo) {
  if (!itens.length) return "";

  let retorno = criarLinha(criarColuna(titulo, "100%", "left", true));
  retorno += criarLinha(
    criarColuna("Código", "10%", "left"), criarColuna("Descrição", "45%", "left"), criarColuna("Req. Origem", "18%", "center"), criarColuna("Lote / Série", "15%", "center"), criarColuna("Quantidade", "12%", "center")
  );

  itens.forEach(item => {
    retorno += criarLinha(
      criarColuna(item.produto.codigo, "10%", "left"), criarColuna(item.descricao || item.produto.nome, "45%", "left"), criarColuna(item.codigoRequisicaoOrigem, "18%", "center"), criarColuna(_dadosLoteOuSerie(item), "15%", "center"), criarColuna(item.quantidadeARequisitar, "12%", "center")
    );
  });
  return retorno;

}

function _dadosLoteOuSerie(item) {
  return ((item.serie || item.lote) || {}).codigo || " -";
}

export default {
  gerarLinhasRequisicao,
  gerarLinhasCabecalhoRequisicao,
  gerarLinhasDevolucao
}