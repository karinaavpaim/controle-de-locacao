import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisServicos from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-servicos';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'
describe('Variáveis de servicos', () => {

  beforeEach(() => {});
    
  it('Deve retornar a tabela de servicos padrão preenchida corretamente quando houver servicos', () => {
    let variaveis = variaveisServicos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-servicos-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Quantidade</th>
    <th>Diárias</th>
    <th>Unitáriolíquido</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <tdstyle="text-align:center;">001138</td>
    <tdstyle="text-align:left;">SERVIÇOSDEMANUTENÇÃOEMINFORMÁTICA</td>
    <tdstyle="text-align:right;">12</td>
    <tdstyle="text-align:right;">6</td>
    <tdstyle="text-align:right;">R$\xa0246,53</td>
    <tdstyle="text-align:right;">R$\xa017.750,00</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">001136</td>
    <tdstyle="text-align:left;">PRESTAÇÃODESERVIÇO</td>
    <tdstyle="text-align:right;">2</td>
    <tdstyle="text-align:right;">2</td>
    <tdstyle="text-align:right;">R$\xa0103,75</td>
    <tdstyle="text-align:right;">R$\xa0415,00</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosserviços
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa018.165,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Servicos_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

      let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de servicos simples preenchida corretamente quando houver servicos', () => {
    let variaveis = variaveisServicos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = ` 
    <tableid="tabela-servicos-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <tdstyle="text-align:center;">001138</td>
    <tdstyle="text-align:left;">SERVIÇOSDEMANUTENÇÃOEMINFORMÁTICA</td>
    <tdstyle="text-align:right;">R$\xa017.750,00</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">001136</td>
    <tdstyle="text-align:left;">PRESTAÇÃODESERVIÇO</td>
    <tdstyle="text-align:right;">R$\xa0415,00</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosserviços
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa018.165,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Servicos_Simples');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

      let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de servicos padrão preenchida corretamente quando não houver servicos', () => {
    orcamentoDetalhes.itens = orcamentoDetalhes.itens.filter(i => i.categoria != 'SERVICO')
    let variaveis = variaveisServicos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-servicos-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Quantidade</th>
    <th>Diárias</th>
    <th>Unitáriolíquido</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody><tr><tdcolspan="6"><center>Nãoháserviços.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosserviços
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa00,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Servicos_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

      let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de servicos simples preenchida corretamente quando não houver servicos', () => {
    orcamentoDetalhes.itens = orcamentoDetalhes.itens.filter(i => i.categoria != 'SERVICO')
    let variaveis = variaveisServicos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-servicos-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody><tr><tdcolspan="3"><center>Nãoháserviços.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosserviços
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa00,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Servicos_Simples');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

      let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

});