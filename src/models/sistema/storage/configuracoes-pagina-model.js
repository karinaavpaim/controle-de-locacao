"use strict"
import { PERIODO_VISUALIZACAO, PERIODO_VISUALIZACAO_LISTA } from "@/constants/faturamento/controle-de-locacao/dashboard-constants";
import { OPCOES_LINHAS_TABELA_POR_PAGINA, VALOR_PADRAO_ITENS_POR_PAGINA } from "@/constants/sistema/storage/configuracoes-pagina-constants"

export default class ConfiguracoesPaginaModel{
  constructor(obj){
    obj = obj || {};

    // > Dashboard
    this.periodoDashboard = (
      obj.periodoDashboard && 
      PERIODO_VISUALIZACAO_LISTA.find(p => p.valorEmDias === obj.periodoDashboard.valorEmDias)
    ) || PERIODO_VISUALIZACAO.ULTIMOS_7_DIAS;

    // > Paginacao geral
    // Hoje as linhas por pagina de todas as listagens principais sao iguais. 
    // Caso venha a mudar, adicionar uma chave especifica. Ex.:
    // this.linhasTabelaOrcamentos = OPCOES_LINHAS_TABELA_POR_PAGINA.find((l)=>l === obj.linhasTabelaOrcamentos) || VALOR_PADRAO_ITENS_POR_PAGINA;
    this.linhasTabelaPadrao = (obj.linhasTabelaPadrao && OPCOES_LINHAS_TABELA_POR_PAGINA.find((l)=>l === obj.linhasTabelaPadrao)) || VALOR_PADRAO_ITENS_POR_PAGINA;
    
  }
}