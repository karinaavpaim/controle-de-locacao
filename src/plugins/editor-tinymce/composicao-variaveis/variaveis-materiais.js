'use strict';

import mascaraDinheiro from '../../../utils/mascara-dinheiro';
import { CATEGORIAS_ITEM } from "../../../constants/faturamento/controle-de-locacao/item-orcamento-locacao-constants";

function obter(orcamento) {
  return [
    {
      nome: "Materiais",
      filhas: [
        {
          nome: "Tabela padrão",
          atributo: "Tabela_De_Materiais_Padrao",
          titulo: "Tabela de materiais padrão",
          inline: false,
          conteudo: function () {
            let materiais = orcamento.itens.filter(i => i.categoria == CATEGORIAS_ITEM.MATERIAL);

            var inicioTabela = `
            <table id="tabela-materiais-orcamento-locacao" style="width: 100%;" border="1"  >
              <thead>
                <tr style="background-color: #ddd;">
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Quantidade</th>
                  <th>Unitário líquido</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>`;

            var meioTabela = ``;
            if (materiais.length < 1) {
              meioTabela = `<tr><td colspan="6"><center>Não há materiais.</center></td></tr>`;
            } else {
              materiais.map(e => {
                meioTabela += `                        
              <tr>
                <td style="text-align: center;">${e.produto.codigo}</td>
                <td style="text-align: left;">${e.descricao || e.produto.nome}</td>
                <td style="text-align: right;">${e.quantidade}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalUnitario())}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalComoMaterial())}</td>
              </tr>`
              });
            }

            var fimTabela = ` 
            </tbody> 
              </table>
              <p style="text-align: right;" data-mce-style="text-align: right;">
                <span style="font-size: 10pt;" data-mce-style="font-size: 10pt;">
                  Total dos materiais
                </span>
              </p>
              <p style="text-align: right;margin-top: -10px;" data-mce-style="text-align: right;">
                <span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">
                <strong>&nbsp;${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.calcularERetornarValoresItens().valorTotalMateriais)}</strong>
                </span>
              </p>`;

            return inicioTabela + meioTabela + fimTabela;
          }
        }
      ]
    }
  ];
}

export default { obter };