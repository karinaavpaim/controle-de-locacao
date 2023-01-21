package test.componente;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import page.DashboardPO;
import test.BaseTest;

/**Classe de teste do componente responsavel por buscar empresas*/
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class DashboardTest extends BaseTest{
	
	//#region região dos atributos.

	private static DashboardPO dashboardPO;
	public String buscaInvalida = "Não há dados disponíveis";
	//#endregion

	//#region dos metodos

	/**Método criado para navegar até a página Dashboard*/
	public void navegarParaDashboard() {

		dashboardPO.aguardarElemento(driver, 10);
		dashboardPO.menuFaturamentoAberto.click();

		dashboardPO.aguardarElemento(driver, 10);
		dashboardPO.menuControleDeLocacaoAberto.click();
		dashboardPO.aguardarElemento(driver, 10);
	}
	/**Método criado para iniciarlizar todos os pontos necessários antes da execução dos testes.*/
	@BeforeClass
	public static void iniciarTest(){
		dashboardPO = new DashboardPO(driver);
	}
	//#endregion

	//#region regiao dos testes.

	/**Deve ser capaz de buscar uma emrpesa por qualquer parte de sua descrição.
	 * Não fazendo distinção entre letras maiúsculas e minúsculas nem caracteres especiais, 
	 * desde que os mesmos estejam na descrição da emrpesa esperada.
	 */
	@Test
	public void TC001_deve_ser_capaz_de_buscar_uma_empresa_por_descricao() {

		navegarParaDashboard();

		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao(""), "1 - LKL OLEO E GAS COMERCIO, SERVICOS E REPR");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("2"), "2 - RO SERVICOS E CONSULTORIA EMPRESARIAL");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("LKL"), "1 - LKL OLEO E GAS COMERCIO, SERVICOS E REPR");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("CONTAS"), "5 - PRESTAÇÃO DE CONTAS");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("2"), "2 - RO SERVICOS E CONSULTORIA EMPRESARIAL");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("is"), "3 - LKL LOGISTICA E TRANSPORTE EIRELI");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("eS"), "2 - RO SERVICOS E CONSULTORIA EMPRESARIAL");
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("oNTaS"), "5 - PRESTAÇÃO DE CONTAS");
	}

	/**NÃO deve ser capaz de buscar uma empresa por uma descrição inválida*/
	@Test
	public void TC002_nao_deve_ser_capaz_de_buscar_uma_empresa_por_descricao() throws InterruptedException{

		navegarParaDashboard();
		
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("!#$#@"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("LKLL"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("CNTS"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("01"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("--"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("1 - RO Servicos i"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("PRESTAÇÂO CONTAS"), buscaInvalida);
		Assert.assertEquals(dashboardPO.buscarEmpresaPorDescricao("PRESTACÂO"), buscaInvalida);
	}

	/**Deve ser capaz de limpar o campo de buscar uma empresa utilizando o botao de limpar do componente*/
	@Test
	public void TC003_deve_limpar_o_campo_de_busca_de_empresa_utilizando_o_botao_limpar() {

		navegarParaDashboard();

		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");
		dashboardPO.inputBuscarEmpresas.sendKeys("Texto teste para apagar");
		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");
		dashboardPO.inputBuscarEmpresas.sendKeys("1234567890");
		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");
		dashboardPO.inputBuscarEmpresas.sendKeys("LKL");
		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");
		dashboardPO.inputBuscarEmpresas.sendKeys("!@#$%¨&*()_-+=");
		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");
		dashboardPO.inputBuscarEmpresas.sendKeys("          ");
		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");
		dashboardPO.inputBuscarEmpresas.sendKeys("L   K     L");
		dashboardPO.botaoLimparInputEmpresa.click();
		Assert.assertEquals(dashboardPO.inputBuscarEmpresas.getText(), "");

	}

	/**Deve ser capaz de listar empresas utiliizando o botao listar do componente*/
	@Test
	public void TC004_deve_expandir_a_lista_de_empresas_utilizando_o_botao_de_expandir() {

		navegarParaDashboard();

		dashboardPO.botaoLimparInputEmpresa.click();
		dashboardPO.inputBuscarEmpresas.sendKeys("2");
		aguardarElemento(driver, 2);
		Assert.assertEquals(dashboardPO.selecionarEmpresa.getText(), "2 - RO SERVICOS E CONSULTORIA EMPRESARIAL");
		dashboardPO.setaListarEmpresasInput.click();
		aguardarElemento(driver, 2);
		Assert.assertEquals(dashboardPO.selecionarEmpresa.getText(), "");
		dashboardPO.setaListarEmpresasInput.click();
		aguardarElemento(driver, 2);
		Assert.assertEquals(dashboardPO.selecionarEmpresa.getText(), "2 - RO SERVICOS E CONSULTORIA EMPRESARIAL");
		dashboardPO.botaoLimparInputEmpresa.click();
		dashboardPO.inputBuscarEmpresas.sendKeys("LKL");
		aguardarElemento(driver, 2);
		Assert.assertEquals(dashboardPO.selecionarEmpresa.getText(), "1 - LKL OLEO E GAS COMERCIO, SERVICOS E REPR");
		dashboardPO.setaListarEmpresasInput.click();
		aguardarElemento(driver, 2);
		Assert.assertEquals(dashboardPO.selecionarEmpresa.getText(), "");
		dashboardPO.setaListarEmpresasInput.click();
		aguardarElemento(driver, 2);
		Assert.assertEquals(dashboardPO.selecionarEmpresa.getText(), "1 - LKL OLEO E GAS COMERCIO, SERVICOS E REPR");

	}

	/**Deve ser capaz de alterar o que é apresesntado no gráfico da tela de Dashboard 
	 * clicando nos botões de filtro Equipamento, Material ou Serviço.
	 */
	@Test
	public void TC005_deve_alterar_oque_o_grafico_apresenta_de_acordo_com_os_botoes_de_filtro() {
		
		navegarParaDashboard();

		aguardarElemento(driver, 4);
		dashboardPO.selecionarEmpresaPorDescricao("1");
		aguardarElemento(driver, 2);
		dashboardPO.moverPagina(0, +1000);

		dashboardPO.botaoFiltroGraficoMaterialDashboard.click();
		Assert.assertEquals(dashboardPO.tituloTop10GraficoDashboard.getText(), "TOP 10 MATERIAIS MAIS LOCADOS");
		
		dashboardPO.botaoFiltroGraficoServicoDashboard.click();
		Assert.assertEquals(dashboardPO.tituloTop10GraficoDashboard.getText(), "TOP 10 SERVIÇOS MAIS LOCADOS");
		
		dashboardPO.botaoFiltroGraficoEquipamentoDashboard.click();
		Assert.assertEquals(dashboardPO.tituloTop10GraficoDashboard.getText(), "TOP 10 EQUIPAMENTOS MAIS LOCADOS");
	}
	
	/** Não deve ser capaz de verificar o título no gráfico Top10 da página Dashboard 
	 *  quando passado um filtro diferente do título experado.
	 */
	@Test
	public void TC006_deve_apresentar_falso_quando_verificado_um_filtro_diferente_do_esperado() {
		
		navegarParaDashboard();
		
		aguardarElemento(driver, 5);
		dashboardPO.moverPagina(0, +1000);
		
		aguardarElemento(driver, 5);
		dashboardPO.botaoFiltroGraficoMaterialDashboard.click();
		Assert.assertNotEquals(dashboardPO.tituloTop10GraficoDashboard.getText(), "TEXTO DIFERENTE DO TITULO ESPERADO");
		
		dashboardPO.botaoFiltroGraficoEquipamentoDashboard.click();
		Assert.assertNotEquals(dashboardPO.tituloTop10GraficoDashboard.getText(), "TEXTO DIFERENTE DO TITULO ESPERADO");
		
		dashboardPO.botaoFiltroGraficoServicoDashboard.click();
		Assert.assertNotEquals(dashboardPO.tituloTop10GraficoDashboard.getText(), "TEXTO DIFERENTE DO TITULO ESPERADO");
	}
	
	/**Deve ser capaz de verificar se os cards da tela Dashboard estão sendo apresentados, 
	 * passando um texto igual ao que é mostrado no card.
	 */
	@Test
	public void TC007_deve_verificar_os_cards_da_tela_dashboard() {
		
		navegarParaDashboard();

		aguardarElemento(driver, 2);
		dashboardPO.moverPagina(0, -1000);
		dashboardPO.selecionarEmpresaPorDescricao("1");
		aguardarElemento(driver, 2);

		Assert.assertTrue(dashboardPO.cardEmDigitacaoDashboard.getText().contains("Em digitação"));
		Assert.assertTrue(dashboardPO.cardProntoDashboard.getText().contains("Pronto"));
		Assert.assertTrue(dashboardPO.cardAguardandoDashboard.getText().contains("Aguardando"));
		Assert.assertTrue(dashboardPO.cardAprovadoDashboard.getText().contains("Aprovado"));
		Assert.assertTrue(dashboardPO.cardReprovadoDashboard.getText().contains("Reprovado"));
		Assert.assertTrue(dashboardPO.cardEmRevisaoDashboard.getText().contains("Em revisão"));
		Assert.assertTrue(dashboardPO.cardLiberadoDashboard.getText().contains("Liberado"));
		Assert.assertTrue(dashboardPO.cardExecucaoDashboard.getText().contains("Execução"));
		Assert.assertTrue(dashboardPO.cardFinalizadoDashboard.getText().contains("Finalizado"));
		Assert.assertTrue(dashboardPO.cardCanceladoDashboard.getText().contains("Cancelado"));
	}
	
	/**Não deve ser capaz de verificar se os cards da tela Dashboard estão sendo apresentados,
	 * passando um texto diferente do que é mostrado no card.
	 */
	@Test
	public void TC008_nao_deve_verificar_os_cards_da_tela_dashboard() {
		
		navegarParaDashboard();

		dashboardPO.selecionarEmpresaPorDescricao("1");

		Assert.assertFalse(dashboardPO.cardEmDigitacaoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardProntoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardAguardandoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardAprovadoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardReprovadoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardEmRevisaoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardLiberadoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardExecucaoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardFinalizadoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
		Assert.assertFalse(dashboardPO.cardCanceladoDashboard.getText().contains("TEXTO DIFERENTE DO CARD"));
	}

	/**Deve esconder as imagens do grafico da Dashboard clicando nos botões de filtro do gráfico individualmente.*/
	@Test
	public void TC009_deve_esconder_as_imagens_do_grafico() throws InterruptedException {

		navegarParaDashboard();

		aguardarElemento(driver, 2);
		dashboardPO.selecionarEmpresaPorDescricao("1");
		aguardarElemento(driver, 2);
		dashboardPO.moverPagina(0, +1000);
		
		dashboardPO.botaoExecucaoGraficoDashboard.click();
		aguardarElemento(driver, 3);
		Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemExecucaoGraficoDashboard));
		
		dashboardPO.botaoLiberadoGraficoDashboard.click();
		aguardarElemento(driver, 3);
		Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemLiberadoGraficoDashboard));
		
		dashboardPO.botaoAguardandoGraficoDashboard.click();
		aguardarElemento(driver, 3);
		Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemAguardandoGraficoDashboard));
		
		dashboardPO.botaoCanceladoGraficoDashboard.click();
		aguardarElemento(driver, 3);
		Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemCanceladoGraficoDashboard));
		
		dashboardPO.botaoProntoGraficoDashboard.click();
		aguardarElemento(driver, 3);
		Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemProntoGraficoDashboard));
		
		dashboardPO.moverPagina(0, +1000);
		
		dashboardPO.botaoFinalizadoGraficoDashboard.click();
		aguardarElemento(driver, 3);
		Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemFinalizadoGraficoDashboard));
		
		// dashboardPO.botaoEmRevisaoGraficoDashboard.click();
		// aguardarElemento(driver, 3);
		// Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemEmRevisaoGraficoDashboard));
		
		// dashboardPO.botaoAprovadoGraficoDashboard.click();
		// aguardarElemento(driver, 3);
		// Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemAprovadoGraficoDashboard));
		
		// dashboardPO.botaoEmDigitacaoGraficoDashboard.click();
		// aguardarElemento(driver, 3);
		// Assert.assertFalse(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemEmDigitacaoGraficoDashboard));
		
	}
	
	/**Deve mostrara novamente as imagens do gráfico da Dashboard clicando nos botões de filtro do gráfico individualmente.*/
	@Test 
	public void TC010_deve_mostrar_as_imagens_do_grafico_novamente() {
		
		navegarParaDashboard();

		aguardarElemento(driver, 10);
		dashboardPO.moverPagina(0, +1000);

		aguardarElemento(driver, 10);
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemExecucaoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemLiberadoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemAguardandoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemCanceladoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemProntoGraficoDashboard));
		
		dashboardPO.moverPagina(0, +1000);
		
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemFinalizadoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemEmRevisaoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemAprovadoGraficoDashboard));
		// Assert.assertTrue(dashboardPO.verificarVisibilidadeElemento(dashboardPO.imagemEmDigitacaoGraficoDashboard));
	}

	/**Deve verificar a navegação entre os menus do sistema utilizando a barra de menus*/
	@Test
	public void TC011_deve_navegar_entre_os_menus_do_sistema() {

		navegarParaDashboard();
		
		dashboardPO.menuOrcamentos.click();
		Assert.assertEquals(dashboardPO.tituloDaPagina.getText(), "Orçamentos");
		dashboardPO.menuGestao.click();
		Assert.assertEquals(dashboardPO.tituloDaPagina.getText(), "Gestão");
		dashboardPO.menuMovimentacao.click();
		Assert.assertEquals(dashboardPO.tituloDaPagina.getText(), "Movimentação");
		dashboardPO.menuModeloDeProposta.click();
		Assert.assertEquals(dashboardPO.tituloDaPagina.getText(), "Modelos de proposta");
		dashboardPO.menuAdicionaisPersonalizados.click();
		Assert.assertEquals(dashboardPO.tituloDaPagina.getText(), "Adicionais personalizados");
		dashboardPO.menuConfiguracoes.click();
		Assert.assertEquals(dashboardPO.tituloDaPagina.getText(), "Configurações");
	}
	//#endregion
}

