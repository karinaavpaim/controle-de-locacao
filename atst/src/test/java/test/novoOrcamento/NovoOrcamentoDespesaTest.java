package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.DespesaBuilder;
import page.novoOrcamento.NovoOrcamentoDespesaPO;
import test.BaseTest;

/** Classe de testes para adicionar uma despesa dentro de Novo Orcamento. */ 
public class NovoOrcamentoDespesaTest extends BaseTest {

	private static NovoOrcamentoDespesaPO despesaPO;
	private static DespesaBuilder despesaBuilder;
	private static String identificadorEmpresa = "1";

	/** Metodo para criar instancia a ser usada por todos os testes. */
	@BeforeClass
	public static void iniciarTeste() {
		despesaPO = new NovoOrcamentoDespesaPO(driver);
		despesaBuilder = new DespesaBuilder(despesaPO);
	}

	/** Testa a inclusao de uma nova despesa. */
	@Test
	public void TC001_deve_adicionar_despesa() {
		despesaPO.navegarParaNovoOrcamentoDespesa(identificadorEmpresa);
		
		despesaBuilder
			.comIdentificador("PROPAGANDA E PUBLICIDADE")
			.comQuantidade(3)
			.comValorUnitario(500.0)
			.adicionarDespesa();
				
		Assert.assertEquals("000143 - PROPAGANDA E PUBLICIDADE", despesaPO.nomePrimeiraDespesaAdicionada.getText());
		Assert.assertEquals("3", despesaPO.quantidadePrimeiraDespesaAdicionada.getText());
		Assert.assertEquals("R$ 150,00", despesaPO.valorTotalDespesaAdicionado.getText());

		
	}

	/** Testa a edicao de uma despesa. */
	@Test
	public void TC002_deve_editar_despesa() {
		despesaPO.navegarParaNovoOrcamentoDespesa(identificadorEmpresa);

		despesaBuilder
			.comIdentificador("PROPAGANDA E PUBLICIDADE")
			.comQuantidade(3)
			.comValorUnitario(500.0)
			.adicionarDespesa();
				
		Assert.assertEquals("000143 - PROPAGANDA E PUBLICIDADE", despesaPO.nomePrimeiraDespesaAdicionada.getText());
		Assert.assertEquals("3", despesaPO.quantidadePrimeiraDespesaAdicionada.getText());
		Assert.assertEquals("R$ 150,00", despesaPO.valorTotalDespesaAdicionado.getText());
		
		despesaPO.botaoEditarDespesa.click();
		despesaPO.aguardarVisibilidadeDoElemento(driver, 2, despesaPO.botaoLimparDescricaoAoEditarDespesa);
		despesaPO.botaoLimparDescricaoAoEditarDespesa.click();
		
		despesaBuilder
			.comIdentificador("000166")
			.comQuantidade(10)
			.comValorUnitario(300.0)
			.adicionarDespesa();
		
		Assert.assertEquals("000166 - INTERNET", despesaPO.nomePrimeiraDespesaAdicionada.getText());
		Assert.assertEquals("10", despesaPO.quantidadePrimeiraDespesaAdicionada.getText());
		Assert.assertEquals("R$ 300,00", despesaPO.valorTotalDespesaAdicionado.getText());
	}
}
