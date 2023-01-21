import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisEquipamentos from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-equipamentos';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'
describe('Variáveis de equipamentos', () => {

  beforeEach(() => {});
    
  it('Deve retornar a tabela de equipamentos padrão preenchida corretamente quando houver equipamentos', () => {
    let variaveis = variaveisEquipamentos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-equipamentos-orcamento-locacao"style="width:100%;"border="1">
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
    <tdstyle="text-align:center;">000920</td>
    <tdstyle="text-align:left;">ALICATECRAV.TERM.ELET.;Ø35MM-Ø400MM;</td>
    <tdstyle="text-align:right;">3</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">R$\xa09.244,48</td>
    <tdstyle="text-align:right;">R$\xa027.733,44</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000917</td>
    <tdstyle="text-align:left;">ALICATECRAV.TERM.ELET.;Ø10MM-Ø185MM;</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">2</td>
    <tdstyle="text-align:right;">R$\xa04.731,50</td>
    <tdstyle="text-align:right;">R$\xa09.463,00</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000010</td>
    <tdstyle="text-align:left;">LINKTORQUE;TWH120N;SEXT.100MM</td>
    <tdstyle="text-align:right;">1</td>
    <tdstyle="text-align:right;">5</td>
    <tdstyle="text-align:right;">R$\xa097,72</td>
    <tdstyle="text-align:right;">R$\xa0488,60</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosequipamentos
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa037.685,04</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Equipamentos_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

    let gerado = variavel.conteudo().replace(/ /g,'');
      
    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de equipamentos simples preenchida corretamente quando houver equipamentos', () => {
    let variaveis = variaveisEquipamentos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-equipamentos-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <tdstyle="text-align:center;">000920</td>
    <tdstyle="text-align:left;">ALICATECRAV.TERM.ELET.;Ø35MM-Ø400MM;</td>
    <tdstyle="text-align:right;">R$\xa027.733,44</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000917</td>
    <tdstyle="text-align:left;">ALICATECRAV.TERM.ELET.;Ø10MM-Ø185MM;</td>
    <tdstyle="text-align:right;">R$\xa09.463,00</td>
    </tr>
    <tr>
    <tdstyle="text-align:center;">000010</td>
    <tdstyle="text-align:left;">LINKTORQUE;TWH120N;SEXT.100MM</td>
    <tdstyle="text-align:right;">R$\xa0488,60</td>
    </tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosequipamentos
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa037.685,04</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Equipamentos_Simples');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de equipamentos padrão preenchida corretamente quando não houver equipamentos', () => {
    orcamentoDetalhes.itens = orcamentoDetalhes.itens.filter(i => i.categoria != 'EQUIPAMENTO')
    let variaveis = variaveisEquipamentos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-equipamentos-orcamento-locacao"style="width:100%;"border="1">
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
    <tbody><tr><tdcolspan="6"><center>Nãoháequipamentos.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosequipamentos
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa00,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Equipamentos_Padrao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

  it('Deve retornar a tabela de equipamentos simples preenchida corretamente quando não houver equipamentos', () => {
    orcamentoDetalhes.itens = orcamentoDetalhes.itens.filter(i => i.categoria != 'EQUIPAMENTO')
    let variaveis = variaveisEquipamentos.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

    var resultadoEsperado = `
    <tableid="tabela-equipamentos-orcamento-locacao"style="width:100%;"border="1">
    <thead>
    <trstyle="background-color:#ddd;">
    <th>Código</th>
    <th>Descrição</th>
    <th>Valortotal</th>
    </tr>
    </thead>
    <tbody><tr><tdcolspan="3"><center>Nãoháequipamentos.</center></td></tr>
    </tbody>
    </table>
    <pstyle="text-align:right;"data-mce-style="text-align:right;">
    <spanstyle="font-size:10pt;"data-mce-style="font-size:10pt;">
    Totaldosequipamentos
    </span>
    </p>
    <pstyle="text-align:right;margin-top:-10px;"data-mce-style="text-align:right;">
    <spanstyle="font-size:14pt;"data-mce-style="font-size:14pt;">
    <strong>&nbsp;R$\xa00,00</strong>
    </span>
    </p>`.replace(/ /g,'');

    var variavel = variaveis.find(v => v.atributo == 'Tabela_De_Equipamentos_Simples');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    let gerado = variavel.conteudo().replace(/ /g,'');

    expect(gerado).toBe(resultadoEsperado);
  });

});