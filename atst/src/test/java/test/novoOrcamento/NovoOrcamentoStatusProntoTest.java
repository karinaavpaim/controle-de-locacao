package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import page.OrcamentoPO;
import page.OrcamentoPO.EnumOpcoes;
import page.novoOrcamento.NovoOrcamentoPO;
import test.BaseTest;
import util.TabelaUtil;

/** Classe de testes para realizar acoes dos orcamentos com status pronto. */
public class NovoOrcamentoStatusProntoTest extends BaseTest {

	private static NovoOrcamentoPO novoOrcamentoPO;
	private static OrcamentoPO orcamentoPO;
	private static TabelaUtil tabelaUtil;
	private static String identificadorEmpresa = "1";
	private static String identificadorCliente = "000015 -";
	private static String numeroOrcamentoNovo;

	/** Metodo para criar as instancias. */
	@BeforeClass
	public static void iniciarTeste() {
		orcamentoPO = new OrcamentoPO(driver);
		tabelaUtil = new TabelaUtil(driver);
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
	}

	/** Testa a alteracao do status para pronto de um novo orcamento. */
	@Test
	public void TC001_deve_alterar_status_para_pronto_do_novo_orcamento() {
	novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);

	numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
	novoOrcamentoPO.botaoFecharMensagemFlutuante.click();

	Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

	tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status", "Pronto");
	novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

	Assert.assertEquals("Status do orçamento " + numeroOrcamentoNovo + " alterado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 3));
	Assert.assertEquals("Pronto", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

	orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
	novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
}

	/** Testa o cancelamento de um orcamento com status pronto. */
	@Test
	public void TC002_deve_cancelar_orcamento_com_status_pronto() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);
		
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status", "Pronto");
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		Assert.assertEquals("Status do orçamento " + numeroOrcamentoNovo + " alterado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 3));
		Assert.assertEquals("Pronto", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.CANCELAR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cancelado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Cancelado", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));
	}

	/** Testa a duplicacao de um orcamento com status pronto. */
	@Test
	public void TC003_deve_duplicar_orcamento_com_status_pronto() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);

		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status", "Pronto");
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		Assert.assertEquals("Status do orçamento " + numeroOrcamentoNovo + " alterado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 3));
		Assert.assertEquals("Pronto", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoParaDuplicar("Código", numeroOrcamentoNovo);
		orcamentoPO.aguardarCarregamentoDaPagina(orcamentoPO.carregamentoDaPagina);
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		String numeroOrcamentoDuplicado = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
				
		Assert.assertEquals("Orçamento " + numeroOrcamentoDuplicado + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoDuplicado, "Status"));
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testa a edicao de um orcamento com status pronto. */
	@Test
	public void TC004_deve_editar_orcamento_com_status_pronto() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);
						
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");

		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status", "Pronto");
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		Assert.assertEquals("Status do orçamento " + numeroOrcamentoNovo + " alterado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 3));
		Assert.assertEquals("Pronto", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoParaEditar("Código", numeroOrcamentoNovo);
		orcamentoPO.aguardarCarregamentoDaPagina(orcamentoPO.carregamentoDaPagina);
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " alterado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testa a exclusao de um orcamento com status pronto. */
	@Test
	public void TC005_deve_excluir_orcamento_com_status_pronto() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);

		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");

		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status", "Pronto");
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		Assert.assertEquals("Status do orçamento " + numeroOrcamentoNovo + " alterado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 3));
		Assert.assertEquals("Pronto", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " excluído com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
	}
}
