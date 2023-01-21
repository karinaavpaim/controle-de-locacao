package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.EquipamentoBuilder;
import builder.novoOrcamento.MaterialBuilder;
import builder.novoOrcamento.ServicoBuilder;
import page.OrcamentoPO;
import page.OrcamentoPO.EnumOpcoes;
import page.novoOrcamento.NovoOrcamentoEquipamentoPO;
import page.novoOrcamento.NovoOrcamentoMaterialPO;
import page.novoOrcamento.NovoOrcamentoPO;
import page.novoOrcamento.NovoOrcamentoServicoPO;
import test.BaseTest;

/** Classe de testes para verificar as datas dos materiais, equipamentos e servicos e datas da capa de novo orcamento. */
public class NovoOrcamentoDataMaterialServicoEquipamentoTest extends BaseTest {

	private static NovoOrcamentoPO novoOrcamentoPO;
	private static OrcamentoPO orcamentoPO;
	private static NovoOrcamentoEquipamentoPO equipamentoPO;
	private static NovoOrcamentoServicoPO servicoPO;
	private static NovoOrcamentoMaterialPO materialPO;
	private static EquipamentoBuilder equipamentoBuilder;
	private static MaterialBuilder materialBuilder;
	private static ServicoBuilder servicoBuilder;
	private static String identificadorEmpresa = "1";
	private static String identificadorCliente = "000015 -";
	private static String numeroOrcamentoNovo;	

	/** Metodo para navegar para novo orcamento. */
	@BeforeClass
	public static void iniciarTeste() {
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		orcamentoPO = new OrcamentoPO(driver);
	}

	/** Testa as datas de previsao de inicio e termino de um novo equipamento, anteriores as datas indicadas 
	 * na capa do novo orcamento. */
	@Test
	public void TC001_deve_testar_previsao_inicio_capa_anterior_previsao_inicio_equipamento() {
		equipamentoPO = new NovoOrcamentoEquipamentoPO(driver);
		equipamentoBuilder = new EquipamentoBuilder(equipamentoPO);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("01102000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("01112000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("01/10/2000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("01/11/2000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));

		novoOrcamentoPO.navegarParaEquipamento();
		
		equipamentoBuilder
			.comIdentificador("004509")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comValorUnitario(300.00)
			.adicionarEquipamento();
		
		equipamentoPO.botaoEditarEquipamento.click();
		equipamentoPO.aguardarVisibilidadeDoElemento(driver, 5, equipamentoPO.inputPrevisaoInicialEquipamento);

		Assert.assertEquals("04/04/2022", equipamentoPO.inputPrevisaoInicialEquipamento.getAttribute("value"));
		Assert.assertEquals("31/10/2022", equipamentoPO.inputPrevisaoFinalEquipamento.getAttribute("value"));
		
		equipamentoPO.botaoSalvarEquipamento.click();
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();
		
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 5).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/**
	 * Testa as diarias superior de equipamento ao periodo da capa do novo orcamento.
	 * @return mensagem "Diarias superior ao periodo".
	 */
	@Test
	public void TC002_deve_testar_diarias_superior_periodo_equipamento() {
		equipamentoPO = new NovoOrcamentoEquipamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("01102000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("02102000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("01/10/2000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("02/10/2000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));
		
		novoOrcamentoPO.navegarParaEquipamento();
			
		limparCampoInput(equipamentoPO.inputQuantidadeDiariaEquipamento);
		equipamentoPO.inputQuantidadeDiariaEquipamento.sendKeys("10");
	
		equipamentoPO.botaoSalvarEquipamento.click();
		
		Assert.assertEquals("Período inferior às diárias", equipamentoPO.mensagemPrevisaoFinalEquipamentoObrigatoria.getText());

		equipamentoPO.botaoCancelarEquipamento.click();
	}

	/** Testa a previsao final de equipamento posterior a data de termino da capa do novo orcamento. */
	@Test
	public void TC003_deve_testar_previsao_final_capa_inferior_previsao_final_equipamentos() {
		equipamentoPO = new NovoOrcamentoEquipamentoPO(driver);
		equipamentoBuilder = new EquipamentoBuilder(equipamentoPO);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("24082021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("25082021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("24/08/2021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("25/08/2021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));

		novoOrcamentoPO.navegarParaEquipamento();
				
		equipamentoBuilder
			.comPrevisaoIncial("24082021")
			.comPrevisaoFinal("31082021")
			.adicionarEquipamento();
		
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 5).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testa a data de previsao de incio e termino de um servico, anteriores a data de capa do novo orcamento. */
	@Test
	public void TC004_deve_testar_previsao_inicio_capa_posterior_previsao_inicio_servico() {
		servicoPO = new NovoOrcamentoServicoPO(driver);
		servicoBuilder = new ServicoBuilder(servicoPO);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("24082021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("25082021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("24/08/2021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("25/08/2021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));

		novoOrcamentoPO.navegarParaServico();
		
		servicoBuilder
			.comPrevisaoIncial("01012000")
			.comPrevisaoFinal("01012000")
			.adicionarServico();
		
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 5).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/**
	 * Testa a data superior de servico ao periodo da capa do novo orcamento.
	 * @return mensagem "Diarias superior ao periodo".
	 */
	@Test
	public void TC005_deve_testar_diarias_superior_periodo_servico() {
		servicoPO = new NovoOrcamentoServicoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("01102000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("02102000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("01/10/2000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("02/10/2000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));
		
		novoOrcamentoPO.navegarParaServico();

		servicoPO.selecionarServico("001138");	
		limparCampoInput(servicoPO.inputQuantidadeDiariaServico);
		servicoPO.inputQuantidadeDiariaServico.sendKeys("10");

		servicoPO.botaoSalvarServico.click();

		Assert.assertEquals("Período inferior às diárias", servicoPO.mensagemPrevisaoFinalServicoObrigatoria.getText());

		servicoPO.botaoCancelarServico.click();
	}

	/** Testa a data previsao final do servico posterior a data de termino da capa do novo orcamento. */
	@Test
	public void TC006_deve_testar_previsao_termino_capa_anterior_previsao_final_servico() {
		servicoPO = new NovoOrcamentoServicoPO(driver);
		servicoBuilder = new ServicoBuilder(servicoPO);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("24082021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("25082021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("24/08/2021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("25/08/2021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));
		
		novoOrcamentoPO.navegarParaServico();
		
		servicoBuilder
			.comPrevisaoIncial("24082021")
			.comPrevisaoFinal("25082024")
			.adicionarServico();
	
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 5).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testa a data de saida prevista para material anterior as datas de inicio e termino da capa do novo orcamento. */
	@Test
	public void TC007_deve_testar_previsao_saida_material_anterior_previsao_termino_capa() {
		materialPO = new NovoOrcamentoMaterialPO(driver);
		materialBuilder = new MaterialBuilder(materialPO);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("24082021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("25082021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("24/08/2021", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("25/08/2021", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));
		
		novoOrcamentoPO.navegarParaMaterial();
		
		materialBuilder
			.comSaidaPrevista("01012000")
			.adicionarMaterial();

		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 5).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/**
	 * Testa a data de saida prevista para material posterior as datas de termino da capa do novo orcamento.
	 * @return mensagem "Não foi possível salvar o orçamento.\nA quantidade de diárias é maior que o intervalo de locação informado no produto X."
	 */
	@Test
	public void TC008_deve_testar_previsao_saida_material_posterior_previsao_termino_capa() {
		materialPO = new NovoOrcamentoMaterialPO(driver);
		materialBuilder = new MaterialBuilder(materialPO);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		
		novoOrcamentoPO.selecionarDataCalendario("01012000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario("01022000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("01/01/2000", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("01/02/2000", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));
		
		novoOrcamentoPO.navegarParaMaterial();
		
		materialBuilder
			.comSaidaPrevista("01012021")
			.adicionarMaterial();

		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		Assert.assertEquals("Não foi possível salvar o orçamento.\nA quantidade de diárias é maior que o intervalo de locação informado no produto 000129.", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
	}
}
