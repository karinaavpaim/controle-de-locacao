'use strict';

import mascaraDinheiro from '../../../utils/mascara-dinheiro';

function obter(orcamento) {
  return [
    {
      nome: 'Despesas',
      filhas: [
        {
          nome: 'Tabela padrão',
          atributo: 'Tabela_De_Despesas_Padrao',
          titulo: 'Tabela de despesas padrão',
          inline: false,
          conteudo: function () {
            let despesas = orcamento.despesas;

            var inicioTabela = `
            <table id="tabela-despesas-orcamento-locacao" style="width: 100%;" border="1"  >
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
            if (despesas.length < 1) {
              meioTabela = `<tr><td colspan="5"><center>Não há despesas.</center></td></tr>`;
            } else {
              despesas.map(e => {
                meioTabela += `                        
              <tr>
                <td style="text-align: center;">${e.naturezaLancamento.codigo}</td>
                <td style="text-align: left;">${e.naturezaLancamento.nome}</td>
                <td style="text-align: right;">${e.quantidade}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalUnitario())}</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.calcularValorTotalComoDespesa())}</td>
              </tr>`;
              });
            }
            var fimTabela = ` 
            </tbody> 
              </table>
              <p style="text-align: right;" data-mce-style="text-align: right;">
                <span style="font-size: 10pt;" data-mce-style="font-size: 10pt;">
                  Total das despesas
                </span>
              </p>
              <p style="text-align: right;margin-top: -10px;" data-mce-style="text-align: right;">
                <span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">
                <strong>&nbsp;${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.calcularERetornarValoresDespesas().valorTotalDespesa)}</strong>
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