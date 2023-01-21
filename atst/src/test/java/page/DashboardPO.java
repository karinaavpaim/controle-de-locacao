package page;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.WebElement;

/** Page Objects da tela do Dashboard. */
public class DashboardPO extends BasePO {

	//#region Regiao dos elementos.

	/** Elemento para selecionar o radio buttom equipamentos, e mostrar os 10 equipamentos mais locados. */
	@FindBy(css = "#input-141")
	public WebElement radioButtomEquipamentos;

	/** Elemento para selecionar o radio buttom materiais, e mostrar os 10 materiais mais locados. */
	@FindBy(css = "#input-143")
	public WebElement radioButtomMateriais;

	/** Elemento para selecionar o radio buttom servicos, e mostrar os 10 servicos mais locados. */
	@FindBy(css = "#input-145")
	public WebElement radioButtomServicos;

	/** Elemento de input para buscar uma empresa pelo codigo ou pelo nome dentro da dela do DashBoard. */
	@FindBy(id = "autocomplete-empresa-pesquisa-empresa-codigo-nome-dashboard-locacao")
	public WebElement inputBuscarEmpresas;

	/** Elemento para limpar os valores digitados dentro do input de busca de uma empresa pelo codigo ou
	 * pelo nome dentro da dela do DashBoard.
	 */
	@FindBy(css = "#pesquisa-empresa-codigo-nome-dashboard-locacao > div > div > div.v-input__slot > div.v-select__slot > div:nth-child(3) > div > button")
	public WebElement botaoLimparValoresAutoCompletar;

	/** Elemento de retorno do input apos uma busca por uma empresa pelo codigo ou pelo nome dentro da dela do DashBoard. */
	@FindBy(id = "list-90")
	public Select retornoAutoCompletarDashboard;

	/** Elemento titulo do top10 no gráfico do dashboard */
	@FindBy(css = ".highcharts-title:nth-child(13) > tspan")
	public WebElement tituloTop10GraficoDashboard;
	
	/** Elemento botao para filtrar o que é apresentado no grafico da tela Dashboard de acordo com a escolha
	 * entre  Equipamento, Material e Servico.
	 */
	@FindBy(css = ".v-radio:nth-child(1) .v-input--selection-controls__ripple")
	public WebElement botaoFiltroGraficoEquipamentoDashboard;

	/** Elemento botao para filtrar o que é apresentado no grafico da tela Dashboard de acordo com a escolha
	 * entre  Equipamento, Material e Servico.
	 */
	@FindBy(css = ".v-radio:nth-child(2) .v-input--selection-controls__ripple")
	public WebElement botaoFiltroGraficoMaterialDashboard;

	/** Elemento botao para filtrar o que é apresentado no grafico da tela Dashboard de acordo com a escolha
	 * entre  Equipamento, Material e Servico.
	 */
	@FindBy(css = ".v-radio:nth-child(3) .v-input--selection-controls__ripple")
	public WebElement botaoFiltroGraficoServicoDashboard;
	
	/** Elemento card Em Digitação na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(1) .v-list-item__content")
	public WebElement cardEmDigitacaoDashboard;
	
	/** Elemento card Pronto na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(2) .v-list-item__content")
	public WebElement cardProntoDashboard;

	/** Elemento card Aguardando na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(3) .v-list-item__content")
	public WebElement cardAguardandoDashboard;

	/** Elemento card Aprovado na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(4) .v-list-item__content")
	public WebElement cardAprovadoDashboard;

	/** Elemento card Reprovado na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(5) .v-list-item__content")
	public WebElement cardReprovadoDashboard;

	/** Elemento card Em Revisão na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(6) .v-list-item__content")
	public WebElement cardEmRevisaoDashboard;

	/** Elemento card Liberado na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(7) .v-list-item__content")
	public WebElement cardLiberadoDashboard;

	/** Elemento card Execução na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(8) .v-list-item__content")
	public WebElement cardExecucaoDashboard;

	/** Elemento card Finalizado na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(9) .v-list-item__content")
	public WebElement cardFinalizadoDashboard;

	/** Elemento card Cancelado na tela Dashboard*/
	@FindBy(css = ".v-card:nth-child(10) .v-list-item__content")
	public WebElement cardCanceladoDashboard;

	/**Elemento mensagem "Não existem dados a serem exibios." no gráfico da tela Dashboard */
	@FindBy(css = ".col:nth-child(2) .subheader")
	public WebElement mensagemNaoExistemDadosGraficoDashboard;

	/**Botao Execução do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-0 > span")
	public WebElement botaoExecucaoGraficoDashboard;
	
	/**Botao Liberado do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-1 > span")
	public WebElement botaoLiberadoGraficoDashboard;
	
	/**Botao Aguardando do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-2 > span")
	public WebElement botaoAguardandoGraficoDashboard;
	
	/**Botao Cancelado do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-3 > span")
	public WebElement botaoCanceladoGraficoDashboard;
	
	/**Botao Pronto do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-4 > span")
	public WebElement botaoProntoGraficoDashboard;
	
	/**Botao Finalizado do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-5 > span")
	public WebElement botaoFinalizadoGraficoDashboard;
	
	/**Botao Em Revisão do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-6 > span")
	public WebElement botaoEmRevisaoGraficoDashboard;
	
	/**Botao Aprovado do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-7 > span")
	public WebElement botaoAprovadoGraficoDashboard;
	
	/**Botao Em Digitação do tipo Span no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-8 > span")
	public WebElement botaoEmDigitacaoGraficoDashboard;
	
	/**Imagem de Execução no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-pie-series > .highcharts-data-label-color-0 tspan:nth-child(2)")
	public WebElement imagemExecucaoGraficoDashboard;
	
	/**Imagem de Execução no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-data-label-color-1 tspan:nth-child(2)")
	public WebElement imagemLiberadoGraficoDashboard;
	
	/**Imagem de Aguardando no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-data-label-color-2 tspan:nth-child(2)")
	public WebElement imagemAguardandoGraficoDashboard;
	
	/**Imagem de Cancelado no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-data-label-color-3 tspan:nth-child(2)")
	public WebElement imagemCanceladoGraficoDashboard;
	
	/**Imagem de Pronto no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-data-label-color-4 tspan:nth-child(2)")
	public WebElement imagemProntoGraficoDashboard;
	
	/**Imagem de Finalizado no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-data-label-color-5 tspan:nth-child(2)")
	public WebElement imagemFinalizadoGraficoDashboard;
	
	/**Imagem de Em Revisão no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-8:nth-child(10)")
	public WebElement imagemEmRevisaoGraficoDashboard;
	
	/**Imagem de Aprovado no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-6:nth-child(8)")
	public WebElement imagemAprovadoGraficoDashboard;
	
	/**Imagem de Em Digitação no gráfico da  Dashboard */
	@FindBy(css = ".highcharts-color-5:nth-child(7)")
	public WebElement imagemEmDigitacaoGraficoDashboard;

	//#endregion

	//#region região dos construtores.

	public DashboardPO(WebDriver driver) {
		super(driver);
	}
	//#region

	//#region Região dos métodos.

	/**Método criado para limpar o campo busca de empresas na Dashboard*/
	public void limparInputBuscaEmpresa() {

		inputBuscarEmpresas.click();
		inputBuscarEmpresas.sendKeys(Keys.END);
		inputBuscarEmpresas.sendKeys(Keys.SHIFT, Keys.HOME);
		inputBuscarEmpresas.sendKeys(Keys.BACK_SPACE);
	}

	/**
	 * Método criado para buscar uma empresa por identificador no componente de pesquisar empresas.
	 * @param descricaoEmpresa Identificador da empresa para busca.
	 * @return retorna a descrição da empresa encontrada, em caso de não encontrar uma empresa
	 * retorna a mensagem "Não há dados disponíveis".
	 */
	public String buscarEmpresaPorDescricao(String descricaoEmpresa) {
		
		limparInputBuscaEmpresa();
		inputBuscarEmpresas.sendKeys(descricaoEmpresa);
		aguardarElemento(driver, 10);

		String valorBuscaEmpresa = selecionarEmpresa.getText();

		inputBuscarEmpresas.sendKeys(Keys.ENTER);

		return valorBuscaEmpresa;
	}

	/**Método criado para selecionar uma empresa no campo de input empresa */
	public void selecionarEmpresaPorDescricao(String descricaoEmpresa) {
		limparInputBuscaEmpresa();
		inputBuscarEmpresas.sendKeys(descricaoEmpresa, Keys.ENTER);
	}
	//#endregions
}
