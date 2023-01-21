package test;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import page.GerarPropostaPO;
import page.OrcamentoPO;
import page.OrcamentoPO.EnumOpcoes;
import page.novoOrcamento.NovoOrcamentoPO;
import util.TabelaUtil;

/** Classe de testes da tela Gerar Proposta. */
public class GerarPropostaTest extends BaseTest {

	//#region regiao dos atributos.

	private static NovoOrcamentoPO novoOrcamentoPO;
	private static OrcamentoPO orcamentoPO;
	private static GerarPropostaPO gerarPropostaPO;
	private static TabelaUtil tabelaUtil;
	private static String identificadorEmpresa = "1";
	private static String numeroOrcamento;
	private static String identificadorCliente = "000015";
	private static String nomeClienteOrcamento;
	private static String cnpjCpfOrcamento;
	private static String valorTotalOrcamento;
	//#endregion

	//#region regiao dos metodos.

	/** Metodo que inicia os pontos principais que serao utilizados por todos os testes da classe. */
	@BeforeClass
	public static void navegarParaGerarProposta() {
		orcamentoPO = new OrcamentoPO(driver);
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		tabelaUtil = new TabelaUtil(driver);
		gerarPropostaPO = new GerarPropostaPO(driver);
	}
	//#endregion

	//#region regiao dos testes.

	/** Testa a navegacao ate a geracao de proposta de um orcamento que esteja com o status "pronto". */
	@Test
	public void TC001_deve_conferir_campos_gerar_proposta() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);

		numeroOrcamento = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamento, "Status", "Pronto");
		gerarPropostaPO.botaoConfirmarMensagemFlutuante.click();

		novoOrcamentoPO.primeiroNomeEmpresaListagemOrcamento.click();

		nomeClienteOrcamento = novoOrcamentoPO.primeiroNomeEmpresaListagemOrcamento.getText();
		cnpjCpfOrcamento = novoOrcamentoPO.primeiroCnpjCpfListagemOrcamento.getText();
		valorTotalOrcamento = novoOrcamentoPO.valorTotalListaDeOrcamento.getText();

		novoOrcamentoPO.primeiroNomeEmpresaListagemOrcamento.click();
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamento, EnumOpcoes.GERAR_PROPOSTA);
		
		Assert.assertEquals(nomeClienteOrcamento, gerarPropostaPO.nomeCliente.getText());
		Assert.assertEquals("-", gerarPropostaPO.objetivoProposta.getText());
		Assert.assertEquals(cnpjCpfOrcamento, gerarPropostaPO.cnpjCpf.getText());
		Assert.assertEquals(valorTotalOrcamento, gerarPropostaPO.valorOrcamento.getText());
	}

	/** Testa a acao de salvar uma proposta.*/
	@Test
	public void TC002_deve_salvar_proposta() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);

		numeroOrcamento = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamento, "Status", "Pronto");
		gerarPropostaPO.botaoConfirmarMensagemFlutuante.click();

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamento, EnumOpcoes.GERAR_PROPOSTA);
		gerarPropostaPO.aguardarElemento(driver, 10);
		
		gerarPropostaPO.escolherModeloDeProposta("OneSubsea");
		gerarPropostaPO.aguardarElementoSerClicavel(driver, 10, gerarPropostaPO.editarProposta);
		
		gerarPropostaPO.editarProposta.click();
		gerarPropostaPO.aguardarElementoSerClicavel(driver, 10, gerarPropostaPO.alinhadoCentro);
		
		gerarPropostaPO.alinhadoCentro.click();
		gerarPropostaPO.sublinhado.click();
		gerarPropostaPO.negrito.click();

		gerarPropostaPO.botaoSalvarEdicaoProposta.click();
		
		gerarPropostaPO.botaoVisualizarProposta.click();
		gerarPropostaPO.botaoFecharVisualizaoProposta.click();
		
		gerarPropostaPO.botaoSalvarProposta.click();

		Assert.assertEquals("Proposta cadastrada com sucesso.", gerarPropostaPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Aguardando", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamento, "Status"));
	}

	/** Testa a acao de salvar uma proposta.*/
	@Test
	public void TC002_deve_editar_proposta() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);

		numeroOrcamento = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", numeroOrcamento, "Status", "Pronto");
		gerarPropostaPO.botaoConfirmarMensagemFlutuante.click();

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamento, EnumOpcoes.GERAR_PROPOSTA);
		gerarPropostaPO.aguardarElemento(driver, 10);
		
		gerarPropostaPO.escolherModeloDeProposta("OneSubsea");
		
		gerarPropostaPO.aguardarElementoSerClicavel(driver, 10, gerarPropostaPO.editarProposta);
		gerarPropostaPO.editarProposta.click();
		gerarPropostaPO.botaoSalvarEdicaoProposta.click();

		gerarPropostaPO.botaoSalvarProposta.click();
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamento, EnumOpcoes.EDITAR_PROPOSTA);

		gerarPropostaPO.aguardarElementoSerClicavel(driver, 10, gerarPropostaPO.editarProposta);
		gerarPropostaPO.editarProposta.click();

		gerarPropostaPO.aguardarElementoSerClicavel(driver, 10, gerarPropostaPO.alinhadoCentro);
		
		gerarPropostaPO.alinhadoCentro.click();
		gerarPropostaPO.sublinhado.click();
		gerarPropostaPO.negrito.click();

		gerarPropostaPO.botaoSalvarEdicaoProposta.click();

		gerarPropostaPO.botaoSalvarProposta.click();
	}
	//#endregion
}
