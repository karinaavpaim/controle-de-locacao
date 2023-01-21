package test;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import page.OrcamentoPO;

/**Classe de testes para buscar orcamentos. */
public class OrcamentoBuscarTest extends BaseTest {

	//#region regiao dos atributos.

	private static OrcamentoPO orcamentoPO;
	//#endregion

	//#region reigao dos metodos.

	/** Metodo que inicia os pontos principais que serao utilizados por todos os testes da classe.*/
	@BeforeClass
	public static void navegarParaOrcamento() {
		orcamentoPO = new OrcamentoPO(driver);
		
		orcamentoPO.navegarParaFiltro("1");
	}
	//#endregion

	//#region regiao dos testes.
	/** Testa a busca de um orcamento pelo nome e pelo codigo */
	@Test
	public void T001_deve_buscar_empresa_por_nome_e_codigo() {
		orcamentoPO.selecionarEmpresaPorIdentificador("4");
		orcamentoPO.aguardarElemento(driver, 10);
		orcamentoPO.selecionarEmpresaPorIdentificador("1");
	}

	/** Testa a busca de um orcamento pelo filtro avancado. */
	@Test
	public void T002_deve_testar_busca_no_filtro_avancado() {
		orcamentoPO.botaoFiltro.click();
		orcamentoPO.navegarParaFiltroAvancado();

		orcamentoPO.selecionarDataCalendario("15/10/2008", orcamentoPO.inputDataReferenciaInicialFiltro);
		Assert.assertEquals("15/10/2008", orcamentoPO.inputDataReferenciaInicialFiltro.getAttribute("value"));

		orcamentoPO.selecionarDataCalendario("25/02/2022", orcamentoPO.inputDataReferenciaFinalFiltro);
		Assert.assertEquals("25/02/2022", orcamentoPO.inputDataReferenciaFinalFiltro.getAttribute("value"));

		orcamentoPO.selecionarDataCalendario("19/02/2022", orcamentoPO.inputDataPrevisaoInicioFiltro);
		Assert.assertEquals("19/02/2022", orcamentoPO.inputDataPrevisaoInicioFiltro.getAttribute("value"));

		orcamentoPO.selecionarDataCalendario("05/10/2025", orcamentoPO.inputDataPrevisaoTerminoFiltro);
		Assert.assertEquals("05/10/2025", orcamentoPO.inputDataPrevisaoTerminoFiltro.getAttribute("value"));

		orcamentoPO.botaoFiltrar.click();
		orcamentoPO.botaoLimparFiltro.click();
	}

	/** Testa o filtro de busca por codigo do orcamento. */
	@Test
	public void T003_deve_testar_filtro_por_codigo() {
		orcamentoPO.filtrarPorCodigo("000136");
		Assert.assertEquals("000136", orcamentoPO.primeiroCodigoListagemOrcamento.getText());

		orcamentoPO.filtrarPorCodigo("000121");
		Assert.assertEquals("000121", orcamentoPO.primeiroCodigoListagemOrcamento.getText());
		orcamentoPO.botaoLimparFiltro.click();
	}

	/** Testa o filtro de busca por nome do cliente. */
	@Test
	public void T004_deve_testar_filtro_por_cliente() {
		orcamentoPO.filtrarPorNome("OIL STATES");
		Assert.assertEquals("OIL STATES IND. DO BRASIL INST. MARITIMAS LTDA", orcamentoPO.primeiroNomeEmpresaListagemOrcamento.getText());

		orcamentoPO.filtrarPorNome("AFG");
		Assert.assertEquals("AFG INSPECAO E REPARO EM RISERS LTDA", orcamentoPO.primeiroNomeEmpresaListagemOrcamento.getText());
		orcamentoPO.botaoLimparFiltro.click();
	}

	/** Testa o filtro de busca de orcamento por cada status. */
	@Test
	public void T005_deve_testar_filtro_por_status() {
		orcamentoPO.filtrarPorStatus("Cancelado");
		Assert.assertEquals("Cancelado", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down",""));
		
		orcamentoPO.botaoLimparFiltroStatus.click();

		orcamentoPO.filtrarPorStatus("Aguardando");
		Assert.assertEquals("Aguardando", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down", ""));
		
		orcamentoPO.botaoLimparFiltroStatus.click();

		orcamentoPO.filtrarPorStatus("Revisão");
		Assert.assertEquals("Revisão", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down",""));

		orcamentoPO.botaoLimparFiltroStatus.click();

		orcamentoPO.filtrarPorStatus("Em digitação");
		Assert.assertEquals("Em digitação", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down",""));

		orcamentoPO.botaoLimparFiltroStatus.click();

		orcamentoPO.filtrarPorStatus("Pronto");
		Assert.assertEquals("Pronto", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down",""));

		orcamentoPO.botaoLimparFiltroStatus.click();

		orcamentoPO.filtrarPorStatus("Liberado");
		Assert.assertEquals("Liberado", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down",""));

		orcamentoPO.botaoLimparFiltroStatus.click();

		orcamentoPO.filtrarPorStatus("Execução");
		Assert.assertEquals("Execução", orcamentoPO.statusPrimeiroOrcamentoListado.getText().replace("\narrow_drop_down",""));

		orcamentoPO.botaoLimparFiltroStatus.click();
	}

	/** Testa o filtro de busca de orcamento por todos os status. */
	@Test
	public void T006_deve_testar_filtro_marcando_todos_os_status() throws InterruptedException {
		orcamentoPO.filtrarPorStatus("Aguardando");
		orcamentoPO.filtrarPorStatus("Em digitação");
		orcamentoPO.filtrarPorStatus("Aprovado");
		orcamentoPO.filtrarPorStatus("Reprovado");
		orcamentoPO.filtrarPorStatus("Revisão");
		orcamentoPO.filtrarPorStatus("Cancelado");
		orcamentoPO.filtrarPorStatus("Pronto");
		orcamentoPO.filtrarPorStatus("Excluído");
		orcamentoPO.filtrarPorStatus("Liberado");
		orcamentoPO.filtrarPorStatus("Execução");
		orcamentoPO.filtrarPorStatus("Finalizado");

		orcamentoPO.botaoLimparFiltroStatus.click();
	}

	/** Testa o filtro de busca de orcamento por periodo de emissao. */
	@Test
	public void T007_deve_testar_filtro_por_periodo_de_emissao() {
		orcamentoPO.filtrarPorPeriodoDeEmissao("Últimos 3 dias");
		orcamentoPO.botaoLimparPeriodoEmissaoFiltro.click();

		orcamentoPO.filtrarPorPeriodoDeEmissao("Essa semana");
		orcamentoPO.botaoLimparPeriodoEmissaoFiltro.click();

		orcamentoPO.filtrarPorPeriodoDeEmissao("Semana passada");
		orcamentoPO.botaoLimparPeriodoEmissaoFiltro.click();

		orcamentoPO.filtrarPorPeriodoDeEmissao("Esse mês");
		orcamentoPO.botaoLimparPeriodoEmissaoFiltro.click();
	}

	/** Testa o filtro de periodo de emissao por uma data especifica. */
	@Test
	public void T008_deve_testar_filtro_por_data_especifica_de_emissao() {
		orcamentoPO.filtrarPorPeriodoDeEmissao("Selecionar data");

		orcamentoPO.selecionarDataCalendario("15/10/2008", orcamentoPO.InputPeriodoEmissaoDataInicial);
		Assert.assertEquals("15/10/2008", orcamentoPO.InputPeriodoEmissaoDataInicial.getAttribute("value"));

		orcamentoPO.selecionarDataCalendario("25/02/2022", orcamentoPO.inputPeriodoEmissaoDataFinal);
		Assert.assertEquals("25/02/2022", orcamentoPO.inputPeriodoEmissaoDataFinal.getAttribute("value"));

		orcamentoPO.botaoLimparPeriodoEmissaoFiltro.click();
	}

	/**
	 * Testa as mensagens de campos obrigatorios em filtro.
	 * @return mensagem de "Campo obrigatorio".
	 */
	@Test
	public void T009_deve_testar_mensagem_campos_em_branco_filtro() {
		orcamentoPO.botaoLimparFiltro.click();

		orcamentoPO.inputFiltroCliente.click();
		orcamentoPO.inputFiltroCodigo.click();
		orcamentoPO.aguardarVisibilidadeDoElemento(driver, 2, orcamentoPO.mensagemNomeObrigatorioFiltro);
		
		Assert.assertEquals("Campo obrigatório", orcamentoPO.mensagemNomeObrigatorioFiltro.getText());
	}
	//#endregion
}
