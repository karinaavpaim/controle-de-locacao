package page.novoOrcamento;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import page.BasePO;

/**Page Objects da pagina de materiais em novo orcamento. */
public class NovoOrcamentoMaterialPO extends BasePO {

	//#region Regiao dos elementos.

	/**Elemento input para digitar um material em novo orcamento. */
	@FindBy(id = "autocomplete-produto-pesquisar-produto-materiais-orcamento")
	public WebElement inputMaterial;

	/**Elemento para limpar a descricao do material.*/
	@FindBy(css = "#pesquisar-produto-materiais-orcamento .v-input__append-inner:nth-child(3) .v-icon")
	public WebElement botaoLimparInputMaterial;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo material em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#pesquisar-produto-materiais-orcamento .v-messages__message")
	public WebElement mensagemMaterialObrigatorio;

	/**Elemento para editar a descricao do material.*/
	@FindBy(id = "btn-editar-descricao-materiais-orcamento")
	public WebElement botaoEditarDescricaoMaterial;

	/**Elemento para digitar a descricao do material.*/
	@FindBy(id = "textfield-descricao-materiais-orcamento")
	public WebElement inputDescricaoMaterial;

	/**Elemento para digitar a quantidade disponivel de material.*/
	@FindBy(id = "textfield-quantidade-disponivel-materiais-orcamento")
	public WebElement inputQuantidadeDisponivelMaterial;

	/**Elemento para digitar a quantidade de material.*/
	@FindBy(id = "textfield-quantidade-materiais-orcamento")
	public WebElement inputQuantidadeMaterial;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo quantidade em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = ".flex > .v-input .v-messages__message")
	public WebElement mensagemQuantidadeMaterialObrigatoria;

	/**Elemento para digitar a data de previsao de saida.*/
	@FindBy(id = "textfield-data-datepicker-saida-prevista-materiais-orcamento")
	public WebElement inputPrevisaoSaidaMaterial;

	/**
	 * Mensagem de campo obrigatorio quando deixa a data de previsao de saida de
	 * material em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#datepicker-saida-prevista-materiais-orcamento .v-messages__message")
	public WebElement inputPrevisaoSaidaMaterialObrigatoria;

	/**Elemento para selecionar a tabela de precos do material.*/
	@FindBy(css = ".v-input--is-focused .v-select__selections")
	public WebElement selectTabelaPrecoMaterial;

	/**Elemento para preencher o valor unitario do material.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-unitario-materiais-orcamento")
	public WebElement inputValorUnitarioMaterial;

	/**
	 * Mensagem de campo obrigatorio quando deixa o valor unitario em branco do material.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#campo-dinheiro-valor-unitario-materiais-orcamento .v-messages__message")
	public WebElement inputValorUnitarioMaterialObrigatorio;

	/**Elemento para preencher o valor adicional do material.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-adicional-unitario-materiais-orcamento")
	public WebElement inputValorAdicionalMaterial;

	/**Elemento para preencher o valor de acrescimo do material.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-acrescimo-materiais-orcamento")
	public WebElement inputAcrescimoMaterial;

	/**Elemento para preencher o valor de desconto do material.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-desconto-materiais-orcamento")
	public WebElement inputDescontoMaterial;

	/**Elemento para informar o valor total do material.*/
	@FindBy(css = ".layout:nth-child(3) .total-modal")
	public WebElement valorTotalMaterial;

	/**Elemento para salvar a inclusao de novo material.*/
	@FindBy(css = "#btn-salvar-materiais-orcamento")
	public WebElement botaoSalvarMaterial;

	/**Elemento para cancelar a inclusao de novo material.*/
	@FindBy(css = "#btn-cancelar-materiais-orcamento > .v-btn__content")
	public WebElement botaoCancelarMaterial;

	/**Elemento para editar um material.*/
	@FindBy(css = "#btn-editar-materiais-orcamento .v-icon")
	public WebElement botaoEditarMaterial;

	/**Elemento nome do primeiro material adicionado.*/
	@FindBy(css = ".text-left > div > span:nth-child(1)")
	public WebElement nomePrimeiroMaterialAdicionado;

	/**Elemento quantidade do primeiro material adicionado.*/
	@FindBy(css = ".text-right:nth-child(3) > div > span:nth-child(1)")
	public WebElement quantidadePrimeiroMaterialAdicionado;

	/**Elemento para informar o valor total de material adicionado.*/
	@FindBy(css = ".text-right:nth-child(5) > div > span:nth-child(1)")
	public WebElement valorTotalMaterialAdicionado;
	//#endregion

	//#region região dos construtores.

	public NovoOrcamentoMaterialPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos métodos.

	/**
	 * Método para navegar até material em novo orcamento.
	 * @param identificadorEmpresa Nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamentoMaterial(String identificadorEmpresa) {
		NovoOrcamentoPO novoOrcamentoPO = new NovoOrcamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.navegarParaMaterial();
	}

	/**
	 * Metodo que realiza a digitacao e selecao do material.
	 * @param identificadorMaterial Codigo ou nome do material.
	 */
	public void selecionarMaterial(String identificadorMaterial) {
		inputMaterial.sendKeys(identificadorMaterial);
		aguardarElemento(driver, 10);

		WebElement material = driver.findElement(By.xpath("//*[contains(text(),'" + identificadorMaterial + "')]"));
		material.click();
	}

	/**
	 * Metodo para editar a descricao do material.
	 * @param descricao Descricao do material.
	 */
	public void editarDescricaoMaterial(String descricao) {
		botaoEditarDescricaoMaterial.click();
		limparCampoInput(inputDescricaoMaterial);
		inputDescricaoMaterial.sendKeys(descricao);
	}
	//#endregion
}
