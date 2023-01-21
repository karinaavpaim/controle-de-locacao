'use strict';
import mascaraDinheiro from '../../../utils/mascara-dinheiro';
import { CATEGORIAS_ITEM } from "../../../constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";

function obter(orcamento) {
  return [
    {
      nome: "Serviços",
      filhas: [
        {
          nome: "Tabela padrão",
          atributo: "Tabela_De_Servicos_Padrao",
          titulo: "Tabela de serviços padrão ",
          inline: false,
          conteudo: function () {
            let servicos = orcamento.itens.filter(i => i.categoria == CATEGORIAS_ITEM.SERVICO);

            var inicioTabela = `
            <table id="tabela-servicos-orcamento-locacao" style="width: 100%;" border="1"  >
              <thead>
                <tr style="background-color: #ddd;">
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Quantidade</th>
                  <th>Diárias</th>
                  <th>Unitário líquido</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>`;

            var meioTabela = ``;
            if (servicos.length < 1) {
              meioTabela = `<tr><td colspan="6"><center>Não há serviços.</center></td></tr>`;
            } else {
              servicos.map(e => {
                meioTabela += `                        
              <tr>
                <td style="text-align: center;">${e.produto.codigo}</td>
                <td style="text-align: left;">${e.descricao || e.produto.nome}</td>
                <td style="text-align: right;">${e.quantidade}</td>
                <td style="text-align: right;">${e.quantidadeDiarias}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalUnitario())}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalComoServico())}</td>
              </tr>`
              });
            }

            var fimTabela = ` 
            </tbody> 
              </table>
              <p style="text-align: right;" data-mce-style="text-align: right;">
                <span style="font-size: 10pt;" data-mce-style="font-size: 10pt;">
                  Total dos serviços
                </span>
              </p>
              <p style="text-align: right;margin-top: -10px;" data-mce-style="text-align: right;">
                <span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">
                <strong>&nbsp;${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.calcularERetornarValoresItens().valorTotalServicos)}</strong>
                </span>
              </p>`;

            return inicioTabela + meioTabela + fimTabela;
          }
        },
        {
          nome: "Tabela simples",
          atributo: "Tabela_De_Servicos_Simples",
          titulo: "Tabela de serviços simples",
          inline: false,
          conteudo: function () {
            let servicos = orcamento.itens.filter(i => i.categoria == 'SERVICO');

            var inicioTabela = `
            <table id="tabela-servicos-orcamento-locacao" style="width: 100%;" border="1"  >
              <thead>
                <tr style="background-color: #ddd;">
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>`;

            var meioTabela = ``;
            if (servicos.length < 1) {
              meioTabela = `<tr><td colspan="3"><center>Não há serviços.</center></td></tr>`;
            } else {
              servicos.map(e => {
                meioTabela += `                        
              <tr>
                <td style="text-align: center;">${e.produto.codigo}</td>
                <td style="text-align: left;">${e.descricao || e.produto.nome}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalComoServico())}</td>
              </tr>`
              });
            }

            var fimTabela = ` 
            </tbody> 
              </table>
              <p style="text-align: right;" data-mce-style="text-align: right;">
                <span style="font-size: 10pt;" data-mce-style="font-size: 10pt;">
                  Total dos serviços
                </span>
              </p>
              <p style="text-align: right;margin-top: -10px;" data-mce-style="text-align: right;">
                <span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">
                <strong>&nbsp;${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.calcularERetornarValoresItens().valorTotalServicos)}</strong>
                </span>
              </p>`;

            return inicioTabela + meioTabela + fimTabela;
          }
        }
      ]
    }
  ]
}

export default { obter }