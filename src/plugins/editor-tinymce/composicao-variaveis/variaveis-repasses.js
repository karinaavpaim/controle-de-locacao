'use strict';
import mascaraDinheiro from '../../../utils/mascara-dinheiro';

function obter(orcamento) {
  return [
    {
      nome: "Repasses",
      filhas: [
        {
          nome: "Tabela padrão",
          atributo: "Tabela_De_Repasses",
          titulo: "Tabela de repasses padrão",
          inline: false,
          conteudo: function () {
            let repasses = orcamento.retornarRepassesComTotais();
            
            var inicioTabela = `
            <table id="tabela-repasses-orcamento-locacao" style="width: 100%;" border="1"  >
              <thead>
                <tr style="background-color: #ddd;">
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Al. Faturamento</th>
                  <th>Al. Duplicata</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>`;

            var meioTabela = ``;

            if (repasses.length < 1) {

              meioTabela = `<tr><td colspan="5"><center>Não há repasses.</center></td></tr>`;
            } else {
              repasses.map(e => {
                meioTabela += `                        
              <tr>
                <td style="text-align: center;">${e.repasse.pessoa.codigo}</td>
                <td style="text-align: left;">${e.repasse.pessoa.nome}</td>
                <td style="text-align: right;">${e.repasse.aliquotaFaturamento}%</td>
                <td style="text-align: right;">${e.repasse.aliquotaDuplicata}%</td>
                <td style="text-align: right;">${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(e.valorTotal)}</td>
              </tr>`
              });
            }
            var fimTabela = ` 
            </tbody> 
              </table>
              <p style="text-align: right;" data-mce-style="text-align: right;">
                <span style="font-size: 10pt;" data-mce-style="font-size: 10pt;">
                  Total dos repasses
                </span>
              </p>
              <p style="text-align: right;margin-top: -10px;" data-mce-style="text-align: right;">
                <span style="font-size: 14pt;" data-mce-style="font-size: 14pt;">
                <strong>&nbsp;${mascaraDinheiro.aplicarMascaraParaRealComPrefixo(orcamento.calcularERetornarValoresRepasses().valorTotalRepasses)}</strong>
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