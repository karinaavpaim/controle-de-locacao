package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.RepasseBuilder;
import page.novoOrcamento.NovoOrcamentoRepassePO;
import test.BaseTest;

/** Classe de testes para adicionar um repasse dentro de Novo Orcamento.*/
public class NovoOrcamentoRepasseTest extends BaseTest {

	private static NovoOrcamentoRepassePO repassePO;
	private static RepasseBuilder repasseBuilder;
	private static String identificadorEmpresa = "1";

	/** Metodo para navegar ate um novo repasse. */
	@BeforeClass
	public static void iniciarTeste() {
		repassePO = new NovoOrcamentoRepassePO(driver);
		repasseBuilder = new RepasseBuilder(repassePO);
	}

	/** Testa a inclusao de um novo repasse. */
	@Test
	public void TC001_deve_adicionar_repasse() {
		repassePO.navegarParaNovoOrcamentoRepasse(identificadorEmpresa);
		
		repasseBuilder
		.comPessoaRepasse("C.S.E.")
		.comAliquotaDuplicata(20.0)
		.comAliquotaFaturamento(100.0)
		.adicionarRepasse();
			
		Assert.assertEquals("C.S.E. - MECANICA E INSTRUMENTACAO S.A.", repassePO.pessoaRepasseAdicionado.getText());
		Assert.assertEquals("10%", repassePO.aliquotaFaturamentoRepasseAdicionado.getText());
		Assert.assertEquals("2%", repassePO.aliquotaDuplicataRepasseAdicionado.getText());
	}

	/** Testa a inclusao de um novo repasse. */
	@Test
	public void TC002_deve_editar_repasse() {
		repassePO.navegarParaNovoOrcamentoRepasse(identificadorEmpresa);
		
		repasseBuilder
		.comPessoaRepasse("C.S.E.")
		.comAliquotaDuplicata(20.0)
		.comAliquotaFaturamento(100.0)
		.adicionarRepasse();
			
		Assert.assertEquals("C.S.E. - MECANICA E INSTRUMENTACAO S.A.", repassePO.pessoaRepasseAdicionado.getText());
		Assert.assertEquals("10%", repassePO.aliquotaFaturamentoRepasseAdicionado.getText());
		Assert.assertEquals("2%", repassePO.aliquotaDuplicataRepasseAdicionado.getText());

		repassePO.botaoEditarRepasse.click();

		repasseBuilder
		.comPessoaRepasse("SUZANNE")
		.comAliquotaDuplicata(500.0)
		.comAliquotaFaturamento(200.0)
		.adicionarRepasse();
			
		Assert.assertEquals("SUZANNE CHRISTINE BERDUEGA COSTA 13509473779", repassePO.pessoaRepasseAdicionado.getText());
		Assert.assertEquals("20%", repassePO.aliquotaFaturamentoRepasseAdicionado.getText());
		Assert.assertEquals("50%", repassePO.aliquotaDuplicataRepasseAdicionado.getText());
	}
}