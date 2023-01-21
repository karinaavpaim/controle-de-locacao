import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisMateriais from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-materiais';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'
describe('Variáveis de materiais', () => {

  beforeEach(() => {});
    
  it('Deve retornar a tabela de materiais padrão preenchida corretamente quando houver materiais', () => {
    let variaveis = variaveisMateriais.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;
    var resultadoEsperado = `
    <tableid="tabela-materiais-orcamento-locacao"style="width:100%;"border="1">
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
    <tdstyle="text-align:center;">000619</td>
    <tdstyle="text-align:left;">BOMBAPORT.MANUAL2VIAS;CILINDROSENT.ÚNICO;1L</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">R$\xa0 1.389,02</td>
    <tdstyle="text-align:right;">R$\xa0 1.389,02</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000623</td>
    <tdstyle="text-align:left;">BOMBAPORT.MANUAL2VIAS;CILINDROSENT.ÚNICO;2,3L</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">R$\xa0 2.723,93</td>
    <tdstyle="text-align:right;">R$\xa0 2.723,93</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosmateriais
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa0 4.112,95</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Materiais_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de materiais padrão preenchida corretamente quando não houver materiais', () => {
    orcamentoDetalhes.itens = orcamentoDetalhes.itens.filter(i => i.categoria != 'MATERIAL')
    let variaveis = variaveisMateriais.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-materiais-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Quantidade</th>
    <th>Unitáriolíquido</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody><tr><tdcolspan="6"><center>Nãohámateriais.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosmateriais
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa0 0,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Materiais_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });
});