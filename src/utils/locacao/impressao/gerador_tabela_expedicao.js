'use strict'
import {criarLinha, criarColuna, quebraDeLinha} from "@/utils/locacao/impressao/impressao-locacao-utils";
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import dataUtils from "@/utils/data.js";

function gerarLinhasCabecalhoExpedicao(tipoRelatorio, expedicao){
    return `${criarLinha(
        criarColuna(`RELATÓRIO DE ${tipoRelatorio.toUpperCase()}`, "100%", "center", true)
      )}
      ${criarLinha(
        criarColuna(`Data de expedição: ${dataUtils.aplicarMascaraDataHoraEmDataIso(Date.now())}`, "100%")
      )}
      ${criarLinha(
        criarColuna(
          `Contrato: ${expedicao.codigoLocacao+quebraDeLinha()}
           Cliente: ${expedicao.cliente.nome+quebraDeLinha()}
           CNPJ: ${expedicao.cliente.CPFouCNPJ}`
          , "100%"
        )
      )}`
}

function gerarLinhasExpedicao(expedicao){
    expedicao.itens.forEach(item => {
      item.liberacoes = item.liberacoes.filter(liberacao => liberacao.quantidadeAExpedir > 0);
    });

    let equipamentos = expedicao.itens.filter(item=>((item.categoria === CATEGORIAS_ITEM.EQUIPAMENTO) && item.liberacoes.length));
    let materiais = expedicao.itens.filter(item=>((item.categoria === CATEGORIAS_ITEM.MATERIAL) && item.liberacoes.length));
    return _gerarLinhasItensExpedicao(equipamentos, "Equipamento", "EQUIPAMENTOS") + _gerarLinhasItensExpedicao(materiais, "Material", "MATERIAIS");
}

function _gerarLinhasItensExpedicao(itens, tipo, titulo) {
    if (!itens.length) return "";

    let retorno = criarLinha(criarColuna(titulo, "100%", "left", true));
    retorno += criarLinha(
      criarColuna("Código", "15%", "left"), criarColuna("Descrição", "55%", "left"), criarColuna("Lote / Série", "15%", "center"), criarColuna("Quantidade", "15%", "center")
    );
  
    itens.forEach(item=>{
      item.liberacoes.forEach(liberacao => retorno += criarLinha(
        criarColuna(item.produto.codigo, "15%", "left"), criarColuna(item.descricao || item.produto.nome, "55%", "left"),  criarColuna(_dadosLoteOuSerie(liberacao), "15%", "center"), criarColuna(liberacao.quantidadeAExpedir, "15%", "center")
      ));
    });

    return retorno;
}

function _dadosLoteOuSerie(item) {
    return ((item.serie || item.lote) || {}).codigo || " -";
}

export default  { gerarLinhasExpedicao, gerarLinhasCabecalhoExpedicao }