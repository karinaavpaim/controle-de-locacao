import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisRepasse from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-repasses';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'
describe('Variáveis de repasses', () => {

  beforeEach(() => {});
    
  it('Deve retornar a tabela de repasse preenchida corretamente quando houver repasses', () => {
    let variaveis = variaveisRepasse.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-repasses-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Nome</th>
    <th>Al.Faturamento</th>
    <th>Al.Duplicata</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <tdstyle="text-align:center;">000014</td>
    <tdstyle="text-align:left;">CAMILLADOSSANTOSPINTOVARELLA</td>
    <tdstyle="text-align:right;">11%</td>
    <tdstyle="text-align:right;">2%</td>
    <tdstyle="text-align:right;">R$\xa0 8.035,69</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000219</td>
    <tdstyle="text-align:left;">ALEXANDREFINTELMAN</td>
    <tdstyle="text-align:right;">3%</td>
    <tdstyle="text-align:right;">0%</td>
    <tdstyle="text-align:right;">R$\xa0 1.854,39</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000364</td>
    <tdstyle="text-align:left;">CARLOSALBERTODEALMEIDARANGEL</td>
    <tdstyle="text-align:right;">15%</td>
    <tdstyle="text-align:right;">5%</td>
    <tdstyle="text-align:right;">R$\xa0 12.362,60</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000220</td>
    <tdstyle="text-align:left;">ALEXANDREDEARAGAOMONTEIRO</td>
    <tdstyle="text-align:right;">0%</td>
    <tdstyle="text-align:right;">3%</td>
    <tdstyle="text-align:right;">R$\xa0 1.854,39</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000135</td>
    <tdstyle="text-align:left;">ALBERTOCARLOSALVESCARVALHO</td>
    <tdstyle="text-align:right;">5%</td>
    <tdstyle="text-align:right;">5%</td>
    <tdstyle="text-align:right;">R$\xa0 6.181,30</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosrepasses
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa0 30.288,36</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Repasses');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

      let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de repasse preenchida corretamente quando não houver repasses', () => {
    orcamentoDetalhes.itens[0].repasses = [];
    let variaveis = variaveisRepasse.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-repasses-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Nome</th>
    <th>Al.Faturamento</th>
    <th>Al.Duplicata</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody>
    <tr><td colspan="5"><center>Não há repasses.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosrepasses
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$ 0.00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Repasses');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado.length).toBe(resultadoEsperado.length);
  });

});