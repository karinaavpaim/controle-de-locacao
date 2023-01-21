package page.novoOrcamento;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import page.BasePO;

/**Page Objects da pagina de despesas em novo orcamento.*/
public class NovoOrcamentoDespesaPO extends BasePO {

	//#region Regiao dos elementos.

	/**Elemento para digitar a descricao de uma nova despesa.*/
	@FindBy(id = "autocomplete-pesquisa-auto-complete-natureza-lancamento-despesas-orcamento")
	public WebElement inputIdentificadorDespesa;

	/**Elemento para limpar a descricao de uma despesa.*/
	@FindBy(css = ".v-input__icon--clear > .primary--text")
	public WebElement botaoLimparDescricaoDespesa;

	/**Elemento para limpar a descricao de uma despesa quando a editamos.*/
	@FindBy(css = "#pesquisa-auto-complete-natureza-lancamento-despesas-orcamento .v-input__append-inner:nth-child(3) .v-icon")
	public WebElement botaoLimparDescricaoAoEditarDespesa;

	/**Elemento para digitar a quantidade de uma nova despesa.*/
	@FindBy(id = "textfield-quantidade-despesas-orcamento")
	public WebElement inputQuantidadeDespesa;

	/**
	 * Mensagem quando deixa o campo de quantidade em branco.
	 * @return mensagem de quantidade obrigatoria.
	 */
	@FindBy(css = ".flex > .v-input .v-messages__message")
	public WebElement mensagemQuantidadeObrigatoria;

	/**Elemento para digitar o valor unitario de uma nova despesa.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-despesas-orcamento")
	public WebElement inputValorUnitarioDespesa;

	/**Elemento para digitar o valor adicional dentro da tela para adicionar nova despesa.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-adicional-unitario-despesas-orcamento")
	public WebElement inputValorAdicionalDespesa;

	/**Elemento para verificar o valor total de despesa.*/
	@FindBy(css = ".sm4 > .total-modal")
	public WebElement valorTotalDespesa;

	/**Elemento para editar a despesa adicionada.*/
	@FindBy(css = "#btn-editar-despesas-orcamento .v-icon")
	public WebElement botaoEditarDespesa;	

	/**
	 * Mensagem de notificacao para os campos obrigatorios.
	 * @return mensagem de erro, caso algum campo fique em branco.
	 */
	@FindBy(css = ".v-dialog--active .notificacao-campo-obrigatorio")
	public WebElement mensagemCampoObrigatorio;

	/**Elemento para salvar a nova despesa*/
	@FindBy(id = "btn-salvar-despesas-orcamento")
	public WebElement botaoSalvarDespesa;

	/**Elemento para cancelar a nova despesa.*/
	@FindBy(css = "#btn-cancelar-despesas-orcamento > .v-btn__content")
	public WebElement botaoCancelarDespesa;

	/** Elemento de nome da primeira despesa adicionada. */
	@FindBy(css = ".px-0:nth-child(2)")
	public WebElement nomePrimeiraDespesaAdicionada;

	/**Elemento da quantidade da primeira despesa adicionada.*/
	@FindBy(css = "tbody .text-right:nth-child(3)")
	public WebElement quantidadePrimeiraDespesaAdicionada;

	/**Elemento para verificar o valor total de despesa adicionado.*/
	@FindBy(css = "tbody .text-right:nth-child(5)")
	public WebElement valorTotalDespesaAdicionado;
	//#endregion

	//#region região dos construtores.

	public NovoOrcamentoDespesaPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos métodos.

	/**
	 * Metodo para navegar para despesa dentro de novo orcamento.
	 * @param identificadorEmpresa Nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamentoDespesa(String identificadorEmpresa) {
		NovoOrcamentoPO novoOrcamentoPO = new NovoOrcamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.navegarParaDespesa();
	}

	/**
	 * Metodo para buscar e selecionar a despesa.
	 * @param identificadorDespesa Nome ou codigo da despesa.
	 */
	public void selecionarDespesa(String identificadorDespesa) {
		inputIdentificadorDespesa.sendKeys(identificadorDespesa);
		aguardarElemento(driver, 10);
		driver.findElement(By.xpath("//*[contains(text(),'" + identificadorDespesa + "')]")).click();
	}
	//#endregion
}
