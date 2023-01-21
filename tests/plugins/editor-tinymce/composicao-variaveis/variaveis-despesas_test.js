import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisDespesas from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-despesas';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'
describe('Variáveis de despesa', () => {

  beforeEach(() => {});
    
  it('Deve retornar a tabela de despesa preenchida corretamente quando houver depesas', () => {
    let variaveis = variaveisDespesas.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;
    var resultadoEsperado = `
    <tableid="tabela-despesas-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Quantidade</th>
    <th>Unitáriolíquido</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <tdstyle="text-align:center;">000087</td>
    <tdstyle="text-align:left;">ALUGUELDEEQUIPAMENTOSDECOMUNICAÇÃO</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">R$\xa0 1.050,00</td>
    <tdstyle="text-align:right;">R$\xa0 1.050,00</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000139</td>
    <tdstyle="text-align:left;">ALUGUELDEMAQSEEQUIPAMENTOS</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">R$\xa0 750,00</td>
    <tdstyle="text-align:right;">R$\xa0 750,00</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldasdespesas
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa0 1.800,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Despesas_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

    let gerado = variavel.conteudo().replace(/ /g,'');
    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de despesa preenchida corretamente quando não houver depesas', () => {
    orcamentoDetalhes.despesas = []
    let variaveis = variaveisDespesas.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-despesas-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Quantidade</th>
    <th>Unitáriolíquido</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody><tr><tdcolspan="5"><center>Nãohádespesas.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldasdespesas
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa0 0,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Despesas_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

});