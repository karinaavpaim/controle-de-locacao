package page;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import page.novoOrcamento.NovoOrcamentoPO;
import util.TabelaUtil;

/**Page Object da pagina de Gestao. */
public class GestaoPO extends BasePO{

	/**Enum para definir quais as acoes a serem realizadas em uma locacao, podendo cancelar, analisar resultados ou ajustar.*/
	public enum EnumAcoes { AJUSTAR, ANALISAR_RESULTADO, CANCELAR; }

    //#region Regiao dos atributos.
	private NovoOrcamentoPO novoOrcamentoPO;
	private TabelaUtil tabelaUtil;
	//#endregion

	//#region Regiao dos elementos.

    /** Elemento de filtro. */
	@FindBy(css = "#btn-filtros-controle-de-gestao-de-locacao > .v-btn__content")
	public WebElement botaoFiltroGestao;
	
    /** Input de codigo dentro de filtro. */
	@FindBy(id = "textfield-codigo-filtros-pesquisa-orcamento-controle-de-gestao-de-locacao")
	public WebElement inputCodigoGestao;

    /** Input de cliente dentro de filtro. */
	@FindBy(id = "autocomplete-pessoa-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-controle-de-gestao-de-locacao")
	public WebElement inputClienteGestao;

    /** Elemento para filtrar conforme dados inseridos no filtro. */
	@FindBy(css = "#btn-filtrar-filtros-pesquisa-orcamento-controle-de-gestao-de-locacao > .v-btn__content")
	public WebElement botaoFiltrar;

    /** Elemento para limpar dados inseridos no filtro. */
	@FindBy(css = "#btn-filtrar-filtros-pesquisa-orcamento-controle-de-gestao-de-locacao > .v-btn__content")
	public WebElement botaoLimparFiltro;
    //#endregion

    //#region Regiao dos construtores.
    public GestaoPO(WebDriver driver) {
        super(driver);
    }
    //#endregion

    //#region Regiao dos metodos.

    /** Metodo para navegar ate o menu Gestao. */
	public void navegarParaGestao() {
		menuGestao.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}

    /**
	 * Metodo para buscar uma empresa pelo codigo dentro de filtros.
	 * @param codigo Codigo de um orcamento que busca filtrar.
	 */
	public void filtrarPorCodigo(String codigo) {
		limparCampoInput(inputCodigoGestao);
		inputCodigoGestao.sendKeys(codigo);
		botaoFiltrar.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}

	/** Metodo para localizar determinada locacao na tabela e realizar o ajuste, analisar resultado ou cancelar */
	public void localizarLocacaoERealizarDeterminadaAcao(String indiceColunaCodigo, String codigoOrcamento, EnumAcoes acoes) {
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		tabelaUtil = new TabelaUtil(driver);

		WebElement tabela = driver.findElement(By.tagName("table"));
		int idLinha = tabelaUtil.obterIndiceLinha(codigoOrcamento, tabela);
			
			if(acoes == EnumAcoes.AJUSTAR){
				tabela.findElement(By.xpath(
					"//tr[" + idLinha + "]/td/button[@id='btn-ajustar-locacao-controle-de-gestao-de-locacao']")).click();
				novoOrcamentoPO.aguardarElemento(driver, 10);
			} else if(acoes == EnumAcoes.ANALISAR_RESULTADO){
				tabela.findElement(By.xpath(
					"//tr[" + idLinha + "]/td/button[@id='btn-analisar-resultado-controle-de-gestao-de-locacao']")).click();
				novoOrcamentoPO.aguardarElemento(driver, 10);
			} else if(acoes == EnumAcoes.CANCELAR){
				tabela.findElement(By.xpath(
					"//tr[" + idLinha + "]/td/button[@id='btn-cancelar-controle-de-gestao-de-locacao']")).click();
				novoOrcamentoPO.aguardarElemento(driver, 10);
			}
	}
    //#endregion
}
