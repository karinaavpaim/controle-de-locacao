'use strict';

import data from '../../../utils/data';
import { STATUS_ORCAMENTO_LOCACAO } from '../../../constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants';
import mascaraDinheiro from '../../../utils/mascara-dinheiro';

function obter(orcamento) {
  return [
    {
      nome: "Gerais",
      filhas: [
        {
          nome: "Código do orçamento",
          atributo: "Codigo_Orcamento",
          titulo: "Código do orçamento",
          inline: true,
          conteudo: () => {
            return (orcamento.codigo)
              ? orcamento.codigo
              : ''
          }
        },
        {
          nome: "Data de referência do orçamento",
          atributo: "Data_De_Referencia",
          titulo: "Data de referência do orçamento",
          inline: true,
          conteudo: () => {
            return data.aplicarMascaraEmDataIso(orcamento.dataReferencia);
          }
        },
        {
          nome: "Data de emissão do orçamento",
          atributo: "Data_De_Emissao",
          titulo: "Data de emissão do orçamento",
          inline: true,
          conteudo: () => {
            return data.aplicarMascaraEmDataIso(orcamento.dataEmissao);
          }
        },
        {
          nome: "Data de início contrato",
          atributo: "Data_Inicio_Contrato",
          titulo: "Data de início do contrato",
          inline: true,
          conteudo: () => {
            return data.aplicarMascaraEmDataIso(orcamento.dataInicioContrato);
          }
        },
        {
          nome: "Data de término contrato",
          atributo: "Data_Termino_Contrato",
          titulo: "Data de término do contrato",
          inline: true,
          conteudo: () => {
            return data.aplicarMascaraEmDataIso(orcamento.dataTerminoContrato);
          }
        },
        {
          nome: "Observação do orçamento",
          atributo: "Observacao_Orcamento",
          titulo: "Observação do orçamento",
          inline: true,
          conteudo: () => {
            return (orcamento.observacao)
              ? orcamento.observacao
              : '';
          }
        },
        {
          nome: "Valor total despesas",
          atributo: "Valor_Total_Despesas_Orcamento",
          titulo: "Valor total das despesas",
          inline: true,
          conteudo: () => {
            return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.totalDespesas);
          }
        },
        {
          nome: "Valor total itens",
          atributo: "Valor_Total_Itens_Orcamento",
          titulo: "Valor total dos itens",
          inline: true,
          conteudo: () => {
            return mascaraDinheiro.aplicarMascaraParaRealComPrefixo((
              orcamento.totalEquipamentos
              + orcamento.totalServicos
              + orcamento.totalMateriais));
          }
        },
        {
          nome: "Valor total equipamentos",
          atributo: "Valor_Total_Equipamentos_Orcamento",
          titulo: "Valor total dos equipamentos",
          inline: true,
          conteudo: () => {
            return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.totalEquipamentos);
          }
        },
        {
          nome: "Valor total serviços",
          atributo: "Valor_Total_Servicos_Orcamento",
          titulo: "Valor total dos serviços",
          inline: true,
          conteudo: () => {
            return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.totalServicos);
          }
        },
        {
          nome: "Valor total materiais",
          atributo: "Valor_Total_Materiais_Orcamento",
          titulo: "Valor total dos materiais",
          inline: true,
          conteudo: () => {
            return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.totalMateriais);
          }
        },
        {
          nome: "Valor total orçamento",
          atributo: "Valor_Total_Orcamento",
          titulo: "Valor total do orçamento",
          inline: true,
          conteudo: () => {
            return mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.totalOrcamento);
          }
        },
        {
          nome: "Status orçamento",
          atributo: "Status_Orcamento",
          titulo: "Status do orçamento",
          inline: true,
          conteudo: () => {
            return STATUS_ORCAMENTO_LOCACAO[orcamento.status].descricao;
          }
        },
        {
          nome: "Revisão orçamento",
          atributo: "Revisao_Orcamento",
          titulo: "Revisão do orçamento",
          inline: true,
          conteudo: () => {
            return orcamento.revisao || '';
          }
        },
        {
          nome: "Objetivo orçamento",
          atributo: "Objetivo_Orcamento",
          titulo: "Objetivo do orçamento",
          inline: true,
          conteudo: () => {
            return orcamento.descricao ||'';
          }
        },
      ]
    }
  ];
}

export default { obter };