package page;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**Classe base para todas os POs do sistema. Todas os POs do sistema devem herdar dessa classe.*/
public abstract class BasePO {

	//#region Regiao dos elementos.

	/** Driver a ser utilizado por todas os POs no sistema.*/
	protected WebDriver driver;

	/** Menu Orcamentos. */
	@FindBy(css = ".v-tab:nth-child(3)")
	public WebElement menuOrcamentos;

	/** Menu Gestao. */
	@FindBy(css = ".v-tab:nth-child(4)")
	public WebElement menuGestao;

	/** Menu Movimentacao. */
	@FindBy(css = ".v-tab:nth-child(5)")
	public WebElement menuMovimentacao;

	/** Menu Modelos de proposta. */
	@FindBy(css = ".v-tab:nth-child(6)")
	public WebElement menuModeloDeProposta;

	/** Menu Adicionais personalizados. */
	@FindBy(css = ".v-tab:nth-child(7)")
	public WebElement menuAdicionaisPersonalizados;

	/** Menu Configuracoes. */
	@FindBy(css = ".v-tab:nth-child(8)")
	public WebElement menuConfiguracoes;

	/** Menu Dashboard. */
	@FindBy(css = ".v-tab:nth-child(2)")
	public WebElement menuDashboard;

	/** Elemento para aguardar o carregamento da pagina. */
	@FindBy(css = ".v-overlay__scrim")
	public WebElement carregamentoDaPagina;

	/** Menu da aba "Faturamento". */
	@FindBy(css = ".dropdown:nth-child(5) > .dropdown-toggle > .ng-binding")
	public WebElement menuFaturamento;
	
	/** Menu da aba "Faturamento". */
	@FindBy(css = ".botao-menu-bimerup:nth-child(10) > .v-btn__content > span:nth-child(1)")
	public WebElement menuFaturamentoAberto;
	
	/** Menu "Controle de Locacao", dentro da aba "Faturamento".  */
	@FindBy(xpath = "//span[contains(.,'Controle')]")
	public WebElement menuControleDeLocacao;
	
	/** Menu "Controle de Locacao", dentro da aba "Faturamento".  */
	@FindBy(css = ".menu-badge-beta")
	public WebElement menuControleDeLocacaoAberto;

	/** Menu do usuario logado. */
	@FindBy(css = ".usuario-logado-header_")
	public WebElement menuUsuario;

	/** Elemento para fazer logoff dentro do menu do usuario. */
	@FindBy(css = ".v-list-item__title > span")
	public WebElement menuUsuarioLogoff;

	/** Titulo dos Menus. */
	@FindBy(css = ".breadcrumb-atual")
	public WebElement tituloDaPagina;

	/** Elemento de input para buscar uma empresa podendo ser pelo codigo ou pelo nome. */
	@FindBy(id = "autocomplete-empresa-pesquisa-empresa-codigo-nome-controle-de-orcamento")
	public WebElement inputEmpresa;

	/** Elemento de seta para listar os nomes de empresas no campo de busca de acordo
	 * com o que foi buscado no input buscarEmpresa. 
	 */
	@FindBy(css = ".v-input__icon--append > .primary--text")
	public WebElement setaListarEmpresasInput;

	/** Elemento para selecionar a primeira empresa da lista. */
	@FindBy(css = ".v-list-item__content > .v-list-item__title:nth-child(1)")
	public WebElement selecionarEmpresa;
	
	/** Elemento para limpar o nome que aparece como padrao ao abrir a pagina. */
	@FindBy(className = "v-input__append-inner")
	public WebElement botaoLimparInputEmpresa;

	/** Conteudo de uma mensagem flutuante.*/
	@FindBy(css = ".conteudo")
	public WebElement conteudoMensagemFlutuante;

	/** Elemento para fechar mensagem flutuante. */
	@FindBy(css = ".icone-fechar")
	public WebElement botaoFecharMensagemFlutuante;

	/** Elemento de filtro para busca de um orcamento. */
	@FindBy(css = "#btn-filtros-controle-de-orcamento > .v-btn__content")
	public WebElement botaoFiltro;

	/** Elemento de filtro por codigo para busca de um orcamento. */
	@FindBy(id = "textfield-codigo-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputFiltroCodigo;

	/** Elemento de filtro por status para busca de um orcamento. */
	@FindBy(css = ".select-status .v-select__selections")
	public WebElement inputFiltroStatus;

	/** Elemento para limpar todos os filtros de status. */
	@FindBy(css = ".flex:nth-child(2) > .v-input .v-input__append-inner:nth-child(3) .v-icon")
	public WebElement botaoLimparFiltroStatus;

	/** Elemento de filtro por nome do cliente para busca de um orcamento. */
	@FindBy(id = "autocomplete-pessoa-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputFiltroCliente;

	/** Elemento para limpar o nome do cliente digitado no filtro. */
	@FindBy(css = "#pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento .v-input__append-inner:nth-child(3) .v-icon")
	public WebElement botaoLimparFiltroCliente;

	/** Elemento para selecionar a empresa encontrada de acordo com o cliente digitado no filtro. */
	@FindBy(css = ".v-list-item__mask")
	public WebElement selecionarFiltroCliente;

	/** Elemento de campo obrigatorio no filtro para preenchimento do nome para busca de um orcamento. */
	@FindBy(css = ".v-messages__message")
	public WebElement mensagemNomeObrigatorioFiltro;

	/** Elemento de busca avancada de clientes dentro do filtro. */
	@FindBy(id = "icon-pesquisa-avancada-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement botaoPesquisaAvancadaCliente;

	/** Elemento dentro de busca avancada de clientes para encontrar pelo codigo. */
	@FindBy(id = "textfield-codigo-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputCodigoFiltroPesquisaAvancada;

	/** Elemento dentro de busca avancada de clientes para encontrar pelo nome. */
	@FindBy(id = "textfield-nome-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputClienteFiltroPesquisaAvancada;

	/** Elemento dentro de busca avancada de clientes para encontrar pelo CPF ou CNPJ. */
	@FindBy(id = "textfield-cpf-cnpj-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputCpfCnpjFiltroPesquisaAvancada;

	/** Elemento dentro de busca avancada de clientes para encontrar pela pessoa de contato. */
	@FindBy(id = "textfield-contato-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputPessoaContatoFiltroPesquisaAvancada;

	/** Elemento de botao pesquisar dentro de busca avancada de clientes. */
	@FindBy(css = "#btn-pesquisar-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento > .v-btn__content")
	public WebElement botaoFiltrarPesquisaAvancada;

	/** Elemento de botao para fechar a busca avancada de clientes. */
	@FindBy(css = "#btn-fechar-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-orcamento > .v-btn__content")
	public WebElement botaoFecharPesquisaAvancada;

	/** Elemento de resultado da pesquisa avancada de clientes. */
	@FindBy(xpath = "//*[@id=\"app\"]/div[3]/div/div/div[2]/div[1]/div/div/div/div")
	public WebElement resultadoClientePesquisaAvancada;

	/** Elemento de resultado da pesquisa avancada de clientes quando nenhum cliente for encontrado. */
	@FindBy(xpath = "//*[@id=\"app\"]/div[3]/div/div/div[2]/div[1]/div/h1")
	public WebElement mensagemNenhumResultadoPesquisaAvancadaCliente;

	/** Elemento de resultado da pesquisa avancada de clientes quando nenhuma pessoa for encontrada. */
	@FindBy(css = "div.mensagem-pessoa-nao-encontrada > h1")
	public WebElement mensagemPessoaNaoEncontrada;

	/** Elemento para selecionar um periodo de emissao. */
	@FindBy(xpath = "//div[@id='filtros-pesquisa-orcamento-controle-de-orcamento']/div[2]/div[4]/div/div/div/div/div/div")
	public WebElement selectPeriodoEmissaoFiltro;

	/** Elemento para limpar o periodo de emissao. */
	@FindBy(xpath = "//div[@id='filtros-pesquisa-orcamento-controle-de-orcamento']/div[2]/div[4]/div/div/div/div/div[2]/div/button")
	public WebElement botaoLimparPeriodoEmissaoFiltro;

	/** Elemento de input para buscar por uma data inicial dentro do periodo de emissao. */
	@FindBy(id = "textfield-data-datepicker-data-emissao-inicial-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement InputPeriodoEmissaoDataInicial;

	/** Elemento de input para buscar por uma data final dentro do periodo de emissao. */
	@FindBy(id = "textfield-data-datepicker-data-emissao-final-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputPeriodoEmissaoDataFinal;

	/** Elemento de botao avancado dentro de filtros. */
	@FindBy(css = ".xs4 > .primary--text")
	public WebElement botaoFiltroAvancado;

	/** Elemento de input de data inicial dentro de Filtro Avancado. */
	@FindBy(id = "textfield-data-datepicker-referencia-inicial-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputDataReferenciaInicialFiltro;

	/** Elemento de input de data final dentro de Filtro Avancado. */
	@FindBy(id = "textfield-data-datepicker-referencia-final-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputDataReferenciaFinalFiltro;

	/** Elemento de input de data de previsao de inicio dentro de Filtro Avancado. */
	@FindBy(id = "textfield-data-datepicker-previsao-inicio-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputDataPrevisaoInicioFiltro;

	/** Elemento de input de data de previsao de termino dentro de Filtro Avancado. */
	@FindBy(id = "textfield-data-datepicker-previsao-termino-filtros-pesquisa-orcamento-controle-de-orcamento")
	public WebElement inputDataPrevisaoTerminoFiltro;

	/** Elemento de botao para filtrar a busca. */
	@FindBy(css = "#btn-filtrar-filtros-pesquisa-orcamento-controle-de-orcamento > .v-btn__content")
	public WebElement botaoFiltrar;

	/** Elemento de botao para limpar filtros de busca. */
	@FindBy(css = "#btn-limpar-filtros-pesquisa-orcamento-controle-de-orcamento > .v-btn__content")
	public WebElement botaoLimparFiltro;

	/** Elemento para organizar a pesquisa de orcamentos por codigo. */
	@FindBy(css = ".selo-tabela-generica > span")
	public WebElement setaOrganizarPorCodigo;

	/** Elemento para organizar a pesquisa de orcamentos por nome do cliente. */
	@FindBy(css = ".text-left:nth-child(3) > span")
	public WebElement setaOrganizarPorCliente;

	/** Elemento para organizar a pesquisa de orcamentos por status. */
	@FindBy(css = ".sortable:nth-child(4) > span")
	public WebElement setaOrganizarPorStatus;

	/** Elemento para organizar a pesquisa de orcamentos por data de emissao. */
	@FindBy(css = ".sortable:nth-child(5) > span")
	public WebElement organizarPorEmissao;

	/** Elemento para organizar a pesquisa de orcamentos por data de referencia. */
	@FindBy(css = ".sortable:nth-child(6) > span")
	public WebElement setaOrganizarPorReferencia;

	/** Elemento para organizar a pesquisa de orcamentos por valor total. */
	@FindBy(css = ".text-right > span")
	public WebElement setaOrganizarPorValorTotal;

	/** Elemento para expandir os detalhes da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".unselectable:nth-child(1) .v-badge > div > span:nth-child(1)")
	public WebElement expandirDetalheEmpresaListagemOrcamento;

	/**  Elemento para identificar o status da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".unselectable:nth-child(1) > .text-center .v-chip__content")
	public WebElement statusPrimeiroOrcamentoListado;

	/** Elemento para identificar o status da primeira empresa listada na tabela de orcamentos como reprovado. */
	@FindBy(css = ".unselectable:nth-child(1) .chip-body")
	public WebElement statusReprovadoPrimeiroOrcamentoListado;

	/** Elemento para identificar o nome da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".text-left > div > span:nth-child(1)")
	public WebElement primeiroNomeEmpresaListagemOrcamento;

	/** Elemento para identificar o CPF ou CNPJ da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".flex:nth-child(2) > strong")
	public WebElement primeiroCnpjCpfListagemOrcamento;
	
	/** Elemento para identificar o codigo de orcamento da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".v-badge > div > span:nth-child(1)")
	public WebElement primeiroCodigoListagemOrcamento;
	
	/** Elemento para identificar o valor total do orcamento da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".text-right > div > span:nth-child(1)")
	public WebElement valorTotalListaDeOrcamento;
	
	/** Elemento de botao opcoes da primeira empresa listada na tabela de orcamentos. */
	@FindBy(css = ".unselectable:nth-child(1) .alinhamento-icone-btn-opcoes")
	public WebElement botaoOpcoesEmpresaListada;
	
	/** Elemento para selecionar a quantidade de linhas por pagina. */
	@FindBy(css = ".v-input__icon > .primary--text")
	public WebElement selectLinhasPorPagina;
	
	/** Elemento para selecionar a quantidade de cinco linhas por pagina. */
	@FindBy(css = "#list-item-1127-0 .v-list-item__title")
	public WebElement selectCincoLinhasPorPagina;
	
	/** Elemento para selecionar a quantidade de dez linhas por pagina. */
	@FindBy(css = "#list-item-1127-1 .v-list-item__title")
	public WebElement selectDezLinhasPorPagina;
	
	/** Elemento para selecionar a quantidade de quinze linhas por pagina. */
	@FindBy(css = "#list-item-1127-2 .v-list-item__title")
	public WebElement selectQuinzeLinhasPorPagina;
	
	/** Elemento para navegar para a direita na listagem de orcamentos por pagina. */
	@FindBy(css = ".mdi-chevron-right")
	public WebElement botaoNavegarParaPaginaAFrente;
	
	/** Elemento para navegar para a esquerda na listagem de orcamentos por pagina. */
	@FindBy(css = ".mdi-chevron-left")
	public WebElement botaoNavegarParaPaginaAtras;
	
	/** Elemento de botao para adicionar um novo orcamento. */
	@FindBy(css = "#btn-novo-orcamento-controle-de-orcamento > .v-btn__content")
	public WebElement botaoNovoOrcamento;
	
	/** Elemento de botao para voltar o calendario para a esquerda. */
	@FindBy(css = ".mdi-chevron-left")
	public WebElement botaoVoltarCalendario;
	
	/** Elemento de botao para avancar o calendario para a direita. */
	@FindBy(css = ".mdi-chevron-right")
	public WebElement botaoAvancarCalendario;
	
	/** Elemento de barra de rolagem para selecionar o ano do calendario. */
	@FindBy(css = ".v-date-picker-years")
	public WebElement barraDeRolagemAnosCalendario;
	
	/** Elemento de botao para confirmar a acao de mensagem flutuante. */
	@FindBy(css = ".mensagem-flutuante-btn-primario")
	public WebElement botaoConfirmarMensagemFlutuante;
	
	/** Elemento de botao para cancelar a acao de mensagem flutuante. */
	@FindBy(css = ".mensagem-flutuante-btn-secundario")
	public WebElement botaoCancelarMensagemFlutuante;
	
	/**Elemento de mensagem flutuante para confirmar ou cancelar alguma operacao. */
	@FindBy(css = ".bloco-mensagem > span")
	public WebElement mensagemFlutuanteConfirmarOuCancelarOperacao;
	//#endregion
	
	//#region região dos construtores.

	protected BasePO(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
	//#endregion

	//#region Regiao dos metodos.

	/** 
	 * Metodo para aguardar o carregamento da pagina.
	 * @param elementoParaAguardar determina qual elemento o metodo devera aguardar para carregar a pagina. 
	 */
	public void aguardarCarregamentoDaPagina(WebElement elementoParaAguardar) {
		WebDriverWait aguardar = new WebDriverWait(driver, 5000);
		aguardar.until(ExpectedConditions.invisibilityOf(elementoParaAguardar));
	}
	
	/**
	 * Metodo para rolar a pagina ate que algum elemento esteja visivel.
	 * @param elemento determina qual elemento devera estar visivel ao rolar a pagina.
	 */
	public void rolarPagina(WebElement elemento) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].scrollIntoView();", elemento);
	}
	
	/**
	 * Metodo para aguardar ate determinado limite de tempo ate que o elemento
	 * apareca e consiga realizar a proxima acao desejada.
	 * @param driver              driver do sistema.
	 * @param tempoMaximoDeEspera tempo maximo que o sistema vai aguardar um elemento.
	 */
	public void aguardarElemento(WebDriver driver, int tempoMaximoDeEspera) {
		driver.manage().timeouts().implicitlyWait(tempoMaximoDeEspera, TimeUnit.SECONDS);
	}
	
	/**
	 * Metodo para limpar um campo input.
	 * @param elementoInput elemento de input.
	 */
	public void limparCampoInput(WebElement elementoInput) {
		elementoInput.sendKeys(Keys.CONTROL + "A");
		elementoInput.sendKeys(Keys.DELETE);
	}
	
	/** Metodo para obter o titulo das paginas acessadas. */
	public String obterTituloPagina() {
		return tituloDaPagina.getText();
	}
	
	/**
	 * Metodo para aguardar ate determinado limite de tempo ate que a mensagem flutuante apareca.
	 * @param driver              driver do sistema.
	 * @param tempoMaximoDeEspera tempo maximo que o sistema vai aguardar.
	 */
	public String obterTextoMensagemFlutuante(WebDriver driver, int tempoMaximoDeEspera) {
		WebDriverWait aguardar = new WebDriverWait(driver, tempoMaximoDeEspera);
		aguardar.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".conteudo")));
		return conteudoMensagemFlutuante.getText();
	}

	/**
	 * Metodo para aguardar ate determinado limite de tempo ate que o elemento esteja
	 * habilitado.
	 * @param driver              driver do sistema.
	 * @param tempoMaximoDeEspera tempo maximo que o sistema vai aguardar um elemento.
	 */
	public void aguardarElementoSerClicavel(WebDriver driver, int tempoMaximoDeEspera, WebElement elemento) {
		WebDriverWait aguardar = new WebDriverWait(driver, tempoMaximoDeEspera);
		aguardar.until(ExpectedConditions.elementToBeClickable(elemento));
	}
	
	/**
	 * Metodo para aguardar ate determinado limite de tempo ate que algum elemento apareca.
	 * @param driver              driver do sistema.
	 * @param tempoMaximoDeEspera tempo maximo que o sistema vai aguardar.
	 * @param elemento elemento a ser aguardado ate que seja visivel.
	 */
	public String aguardarVisibilidadeDoElemento(WebDriver driver, int tempoMaximoDeEspera, WebElement elemento) {
		WebDriverWait aguardar = new WebDriverWait(driver, tempoMaximoDeEspera);
		aguardar.until(ExpectedConditions.visibilityOf(elemento));
		return conteudoMensagemFlutuante.getText();
	}

	/**
	 * Metodo para aguardar ate determinado limite de tempo ate os elementos de uma lista aparecam.
	 * @param driver              driver do sistema.
	 * @param tempoMaximoDeEspera tempo maximo que o sistema vai aguardar.
	 */
	public void aguardarVisibilidadeDaListaDeElementos(WebDriver driver, int tempoMaximoDeEspera) {
		WebDriverWait aguardar = new WebDriverWait(driver, tempoMaximoDeEspera);
		aguardar.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.className("v-list-item__title")));
	}
	/**
	 * Metodo para buscar uma determinada empresa pelo nome na tela de orcamentos.
	 * @param identificadorEmpresa Nome ou o codigo de uma empresa que busca selecionar.
	 */
	public void selecionarEmpresaPorIdentificador(String identificadorEmpresa) {
		botaoLimparInputEmpresa.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
		inputEmpresa.sendKeys(identificadorEmpresa);
		selecionarEmpresa.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}
	
	/** Metodo para navegar para a busca de um orcamento utilizando o filtro. 
	 * @param identificadorEmpresa Nome ou o codigo de uma empresa.
	*/
	public void navegarParaFiltro(String identificadorEmpresa) {
		menuOrcamentos.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
		selecionarEmpresaPorIdentificador(identificadorEmpresa);
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
		botaoFiltro.click();
	}

	/** Metodo para navegar ate a busca com filtro avancado. */
	public void navegarParaFiltroAvancado() {
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
		botaoFiltro.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
		rolarPagina(botaoFiltroAvancado);
		botaoFiltroAvancado.click();
		aguardarElemento(driver, 10);
	}
	
	/**
	 * Metodo para buscar uma empresa pelo codigo dentro de filtros.
	 * @param codigo Codigo de um orcamento que busca filtrar.
	 */
	public void filtrarPorCodigo(String codigo) {
		limparCampoInput(inputFiltroCodigo);
		inputFiltroCodigo.sendKeys(codigo);
		botaoFiltrar.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}
	
	/**
	 * Metodo para buscar uma empresa pelo nome dentro de filtros.
	 * @param nomeCliente Nome de um cliente que busca filtrar.
	 */
	public void filtrarPorNome(String nomeCliente) {
		limparCampoInput(inputFiltroCliente);
		inputFiltroCliente.sendKeys(nomeCliente);
		aguardarElemento(driver, 10);
		selecionarFiltroCliente.click();
		botaoFiltrar.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}
	
	/**
	 * Metodo para buscar uma orcamento com status aguardando.
	 * @param status determina qual status busca filtrar.
	 */
	public void filtrarPorStatus(String status) {
		inputFiltroStatus.click();
		aguardarVisibilidadeDaListaDeElementos(driver, 2);
		List<WebElement> listaStatus = driver.findElements(By.className("v-list-item__title"));
		for (WebElement filtro : listaStatus) {
			if (status.equals(filtro.getText()))
			filtro.click();
		}
		botaoFiltrar.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}
	
	/**
	 * Metodo para buscar um orcamento por determinado periodo de emissao.
	 * @param periodoEmissao determina um periodo de emissao que busca filtrar.
	 */
	public void filtrarPorPeriodoDeEmissao(String periodoEmissao) {
		selectPeriodoEmissaoFiltro.click();
		aguardarVisibilidadeDaListaDeElementos(driver, 2);
		List<WebElement> listaPeriodoEmissao = driver.findElements(By.className("v-list-item__title"));
		for (WebElement periodo : listaPeriodoEmissao) {
			if (periodoEmissao.equals(periodo.getText()))
			periodo.click();
		}
		botaoFiltrar.click();
	}
	
	/**
	 * Metodo para selecionar uma data especifica dentro de um input de calendario.
	 * @param data            determina a data que busca inserir um elemento de input.
	 * @param inputCalendario determina o input de calendario que deseja incluir a data.
	 */
	public void selecionarDataCalendario(String data, WebElement inputCalendario) {
		inputCalendario.sendKeys(data);
	}
	
	/** Metodo para navegar ate o filtro de previsao de inicio. */
	public void navegarParaFiltroPrevisaoInicio() {
		rolarPagina(inputDataPrevisaoInicioFiltro);
		inputDataPrevisaoInicioFiltro.click();
	}
	
	/** Metodo para navegar ate o filtro de previsao de termino. */
	public void navegarParaFiltroPrevisaoTermino() {
		rolarPagina(inputDataPrevisaoTerminoFiltro);
		inputDataPrevisaoTerminoFiltro.click();
	}

	/**Método criado para mover a página (valores em Px)*/
	public void moverPagina(int eixoX, int eixoY) {
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		jse.executeScript("scroll(" + eixoX + ", " + eixoY + ");");
	}

	/**Método criado para descobrir se um elemento está visível na tela
	 * @param elemento Elemento que deseja verificar a visibilidade.
	*/
	public Boolean verificarVisibilidadeElemento(WebElement elemento) {
		try {
			elemento.isDisplayed();
			return true;
		}
		catch(NoSuchElementException e) {
			return false;
		}
	}
	//#endregion
}
