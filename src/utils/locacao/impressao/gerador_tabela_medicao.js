'use strict'
import {criarLinha, criarLinhaSemBordas, criarColuna, quebraDeLinha, criarEspacamento, encapsularConteudoEmTabela} from "@/utils/locacao/impressao/impressao-locacao-utils";
import { CATEGORIAS_ITEM } from "@/constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";
import dataUtils from "@/utils/data.js";
import mascaraDinheiro from "@/utils/mascara-dinheiro";

function gerarLinhasCabecalhoMedicao(tipoRelatorio, medicao){
    return `${criarLinha(
        criarColuna(`RELATÓRIO DE ${tipoRelatorio.toUpperCase()}`, "100%", "center", true)
      )}
      ${criarLinha(
        criarColuna(`Data da medição: ${dataUtils.aplicarMascaraDataHoraEmDataIso(Date.now())}`, "100%")
      )}
      ${criarLinha(
        criarColuna(
          `Contrato: ${medicao.codigoLocacao + quebraDeLinha()}
          Cliente: ${medicao.cliente.nome + quebraDeLinha()}
          CNPJ: ${medicao.cliente.CPFouCNPJ + quebraDeLinha()}
          ${criarLinhaSemBordas(
            criarColuna(`Previsão de início: ${dataUtils.aplicarMascaraEmDataIso(medicao.dataInicioContrato)}`, "33%", undefined, undefined, true), criarColuna(`Previsão de término: ${dataUtils.aplicarMascaraEmDataIso(medicao.dataTerminoContrato)}`, "33%", undefined, undefined, true), criarColuna(`Data de referência: ${dataUtils.aplicarMascaraEmDataIso(medicao.dataReferencia)}`, "34%", undefined, undefined, true)
          )}`
          , "100%"
        )
      )}`
}

function gerarLinhasMedicao(medicao){
    let equipamentos =  _obterItensElegiveis(medicao.itens, CATEGORIAS_ITEM.EQUIPAMENTO);
    let materiais = _obterItensElegiveis(medicao.itens, CATEGORIAS_ITEM.MATERIAL);
    let servicos = _obterItensElegiveis(medicao.itens, CATEGORIAS_ITEM.SERVICO);
    let despesas = _obterItensElegiveis(medicao.despesas);
    let espacarEquipamentos = !!(materiais.length || servicos.length || despesas.length);
    let espacarMateriais = !!(servicos.length || despesas.length);
    let espacarServicos = !!(despesas.length);
    return _gerarConteudoSeHouveremItens(equipamentos, "EQUIPAMENTOS", espacarEquipamentos, _gerarLinhasMateiriasEquipamentosMedicao) +
           _gerarConteudoSeHouveremItens(materiais, "MATERIAIS", espacarMateriais, _gerarLinhasMateiriasEquipamentosMedicao) +
           _gerarConteudoSeHouveremItens(servicos, "SERVIÇOS", espacarServicos, _gerarLinhasServicosMedicao) +
           _gerarConteudoSeHouveremItens(despesas, "DESPESAS", false, _gerarLinhasDespesasMedicao);
}

function _gerarConteudoSeHouveremItens(itens, titulo, temEspacamento, metodo){
  if (itens.length)
    return encapsularConteudoEmTabela(metodo(itens, titulo)) + (temEspacamento ? criarEspacamento() : "");
  return "";
}

function _obterItensElegiveis(itens, categoria){
  switch (categoria) {
    case CATEGORIAS_ITEM.SERVICO:
      return itens.filter(item=>((item.categoria === categoria) && item.desmembramentos.some(d=>d.medicaoComoServicoValida())));
    case CATEGORIAS_ITEM.EQUIPAMENTO:
    case CATEGORIAS_ITEM.MATERIAL:
      return itens.filter(item=>((item.categoria === categoria) && item.desmembramentos.some(d=>d.medicaoComoItemDespesaValida())));
    default:
      return itens.filter(item=>(item.desmembramentos.some(d=>d.medicaoComoItemDespesaValida())));

  }
}

function _gerarLinhasMateiriasEquipamentosMedicao(itens, titulo) {
    if (!itens.length) return "";

    let retorno = criarLinha(criarColuna(titulo, "100%", "left", true));
    retorno += criarLinha(
      criarColuna("Descrição", "45%", "left"),
      criarColuna("Lote/Série", "12%", "center"),
      criarColuna("Unit. Líq.", "12%", "center"),
      criarColuna("Diárias", "8%", "center"),
      criarColuna("Quant.", "7%", "center"),
      criarColuna("Valor Medição", "16%", "center")
    );

    itens.forEach(item=>{
      item.desmembramentos.forEach(desmembramento => {
        if (desmembramento.medicaoComoItemDespesaValida())
          retorno += criarLinha(
            criarColuna(`${item.produto.codigo} - ${item.descricao || item.produto.nome}`, "45%", "left"),
            criarColuna(_dadosLoteOuSerie(desmembramento), "12%", "center"),
            criarColuna(mascaraDinheiro.aplicarMascaraParaRealComPrefixo(item.valorUnitario), "12%", "center"),
            criarColuna(desmembramento.datasAMedir.length, "8%", "center"),
            criarColuna(desmembramento.quantidadeAMedir, "7%", "center"),
            criarColuna(mascaraDinheiro.aplicarMascaraParaRealComPrefixo(item.valorTotalParaMedicao(desmembramento)), "16%", "center")
          )
      });
    });
    return retorno;
}

function _gerarLinhasServicosMedicao(itens, titulo) {
  if (!itens.length) return "";

  let retorno = criarLinha(criarColuna(titulo, "100%", "left", true));
  retorno += criarLinha(
    criarColuna("Descrição", "30%", "left"),
    criarColuna("Operador", "27%", "left"),
    criarColuna("Unit. Líq.", "12%", "center"),
    criarColuna("Diárias", "8%", "center"),
    criarColuna("Quant.", "7%", "center"),
    criarColuna("Valor Medição", "16%", "center")
  );

  itens.forEach(item=>{
    item.desmembramentos.forEach(desmembramento => {
      if (desmembramento.medicaoComoServicoValida())
        retorno += criarLinha(
          criarColuna(`${item.produto.codigo} - ${item.descricao || item.produto.nome}`, "30%", "left"),
          criarColuna(desmembramento.funcionario.nome, "27%", "left"),
          criarColuna(mascaraDinheiro.aplicarMascaraParaRealComPrefixo(item.valorUnitario), "12%", "center"),
          criarColuna(desmembramento.datasAMedir.length, "8%", "center"),
          criarColuna(desmembramento.quantidadeAMedir, "7%", "center"),
          criarColuna(mascaraDinheiro.aplicarMascaraParaRealComPrefixo(item.valorTotalParaMedicao(desmembramento)), "16%", "center")
        )
    });
  });
  return retorno;
}

function _gerarLinhasDespesasMedicao(itens, titulo) {
    if (!itens.length) return "";

    let retorno = criarLinha(criarColuna(titulo, "100%", "left", true));
    retorno += criarLinha(
      criarColuna("Código", "12%", "left"),
      criarColuna("Descrição", "53%", "left"),
      criarColuna("Unit. Líq.", "12%", "center"),
      criarColuna("Quant.", "7%", "center"),
      criarColuna("Valor Medição", "16%", "center")
    );

    itens.forEach(item=>{
      item.desmembramentos.forEach(desmembramento => {
        if (desmembramento.medicaoComoItemDespesaValida())
          retorno += criarLinha(
            criarColuna(item.naturezaLancamento.codigo, "12%", "left"),
            criarColuna(item.naturezaLancamento.nome, "53%", "left"),
            criarColuna(mascaraDinheiro.aplicarMascaraParaRealComPrefixo(item.valorItem), "12%", "center"),
            criarColuna(desmembramento.quantidadeAMedir, "7%", "center"),
            criarColuna(mascaraDinheiro.aplicarMascaraParaRealComPrefixo(item.valorTotalParaMedicao(desmembramento)), "16%", "center")
          )
      });
    });
    return retorno;
}

function _dadosLoteOuSerie(item) {
    return ((item.serie || item.lote) || {}).codigo || " -";
}

export default  { gerarLinhasMedicao, gerarLinhasCabecalhoMedicao }