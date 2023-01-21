package page.novoOrcamento;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import page.BasePO;

/**Page Objects da pagina de equipamentos em novo orcamento. */
public class NovoOrcamentoEquipamentoPO extends BasePO {

	//#region Regiao dos elementos.

	/**Elemento de input para o nome ou codigo do equipamento.*/
	@FindBy(id = "autocomplete-produto-pesquisar-produto-equipamentos-orcamento")
	public WebElement inputIdentificadorEquipamento;

	/** Elemento de selecionar o retorno do autocomplete. */
	@FindBy(css = ".v-list-item__content > .v-list-item__title")
	public WebElement retornoInputEquipamento;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo equipamento em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#pesquisar-produto-equipamentos-orcamento .v-messages__message")
	public WebElement mensagemEquipamentoObrigatorio;

	/**Limpar campo do codigo do equipamento.*/
	@FindBy(css = "#pesquisar-produto-equipamentos-orcamento .v-input__append-inner:nth-child(3) .v-icon")
	public WebElement botaoLimparEquipamento;

	/**Elemento para editar a descricao do equipamento.*/
	@FindBy(id = "btn-editar-descricao-equipamentos-orcamento")
	public WebElement botaoEditarDescricaoEquipamento;

	/**Elemento para digitar a descricao do equipamento.*/
	@FindBy(id = "textfield-descricao-equipamentos-orcamento")
	public WebElement inputDescricaoEquipamento;

	/**Elemento para digitar a quantidade disponivel de quipamentos.*/
	@FindBy(id = "textfield-quantidade-disponivel-equipamentos-orcamento")
	public WebElement inputQuantidadeDisponivelEquipamento;

	/**Elemento para digitar a quantidade de equipamentos.*/
	@FindBy(id = "textfield-quantidade-equipamentos-orcamento")
	public WebElement inputQuantidadeEquipamento;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo quantidade em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = ".flex:nth-child(2) > .v-input .v-messages__message")
	public WebElement mensagemQuantidadeEquipamentoObrigatoria;

	/**Elemento para digitar a quantidade de diarias.*/
	@FindBy(id = "textfield-quantidade-diarias-equipamentos-orcamento")
	public WebElement inputQuantidadeDiariaEquipamento;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo diarias em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = ".flex:nth-child(3) > .v-input .v-messages__message")
	public WebElement mensagemQuantidadeDiariaEquipamentoObrigatoria;

	/**Elemento para digitar a data de previsao inicial. */
	@FindBy(id = "textfield-data-datepicker-periodo-inicial-equipamentos-orcamento")
	public WebElement inputPrevisaoInicialEquipamento;

	/**
	 * Mensagem de campo obrigatorio quando deixa a data de previsao inicial em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#datepicker-periodo-inicial-equipamentos-orcamento .v-messages__message")
	public WebElement mensagemPrevisaoInicialEquipamentoObrigatoria;

	/**Elemento para digitar a data de previsao final.*/
	@FindBy(id = "textfield-data-datepicker-periodo-final-equipamentos-orcamento")
	public WebElement inputPrevisaoFinalEquipamento;

	/**
	 * Mensagem de campo obrigatorio quando deixa a data de previsao final em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#datepicker-periodo-final-equipamentos-orcamento .v-messages__message")
	public WebElement mensagemPrevisaoFinalEquipamentoObrigatoria;

	/**Elemento para selecionar a tabela de precos de equipamentos.*/
	@FindBy(css = ".select-preco .v-select__selections")
	public WebElement selectTabelaPrecosEquipamento;

	/**Elemento para preencher o valor unitario.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-unitario-equipamentos-orcamento")
	public WebElement inputValorUnitarioEquipamento;

	/**
	 * Mensagem de campo obrigatorio quando deixa o valor unitario em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#campo-dinheiro-valor-unitario-equipamentos-orcamento .v-messages__message")
	public WebElement mensagemValorUnitarioEquipamentoObrigatorio;

	/**Elemento para preencher o valor adicional do equipamento.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-adicional-unitario-equipamentos-orcamento")
	public WebElement inputValorAdicionalEquipamento;

	/**Elemento para preencher o valor de acrescimo do equipamento.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-acrescimo-equipamentos-orcamento")
	public WebElement inputAcrescimoEquipamento;

	/**Elemento para preencher o valor de desconto do equipamento.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-desconto-equipamentos-orcamento")
	public WebElement inputDescontoEquipamento;

	/**Elemento para informar o valor total do equipamento.*/
	@FindBy(css = ".total-modal")
	public WebElement valorTotalEquipamento;

	/**Elemento para salvar a inclusao de novo equipamento.*/
	@FindBy(css = "#btn-salvar-equipamentos-orcamento > .v-btn__content")
	public WebElement botaoSalvarEquipamento;

	/**Elemento para cancelar a inclusao de novo equipamento.*/
	@FindBy(css = "#btn-cancelar-equipamentos-orcamento > .v-btn__content")
	public WebElement botaoCancelarEquipamento;

	/**Elemento para editar um equipamento.*/
	@FindBy(css = "#btn-editar-equipamentos-orcamento .v-icon")
	public WebElement botaoEditarEquipamento;

	/**Elemento de nome do equipamento adicionado.*/
	@FindBy(css = ".text-left > div > span:nth-child(1)")
	public WebElement nomePrimeiroEquipamentoAdicionado;

	/**Elemento de nome do equipamento adicionado.*/
	@FindBy(css = ".text-right:nth-child(5) > div > span:nth-child(1)")
	public WebElement dataPeriodoInicialPrimeiroEquipamentoAdicionado;

	/**Elemento de nome do equipamento adicionado.*/
	@FindBy(css = ".text-right:nth-child(6) > div > span:nth-child(1)")
	public WebElement dataPeriodoFinalPrimeiroEquipamentoAdicionado;

	/** Elemento de nome do equipamento adicionado. */
	@FindBy(css = ".text-right:nth-child(4) > div > span:nth-child(1)")
	public WebElement diariasPrimeiroEquipamentoAdicionado;

	/** Elemento de nome do equipamento adicionado. */
	@FindBy(css = ".text-right:nth-child(3) > div > span:nth-child(1)")
	public WebElement quantidadePrimeiroEquipamentoAdicionado;

	/**Elemento para informar o valor total quando adicionado o equipamento*/
	@FindBy(css = ".text-right:nth-child(8) > div > span:nth-child(1)")
	public WebElement valorTotalEquipamentoAdicionado;

	/**Elemento para excluir um equipamento.*/
	@FindBy(css = ".mdi-delete")
	public WebElement botaoExcluirEquipamento;
	//#endregion

	//#region região dos construtores.
	public NovoOrcamentoEquipamentoPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos métodos.

	/**
	 * Metodo para navegar até equipamento dentro de novo orcamento.
	 * @param identificadorEmpresa Nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamentoEquipamento(String identificadorEmpresa) {
		NovoOrcamentoPO novoOrcamentoPO = new NovoOrcamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.navegarParaEquipamento();
	}

	/**
	 * Metodo buscar e selecionar o equipamento.
	 * @param identificadorEquipamento Codigo ou nome do equipamento.
	 */
	public void selecionarEquipamento(String identificadorEquipamento) {
		inputIdentificadorEquipamento.sendKeys(identificadorEquipamento);
		aguardarElemento(driver, 10);

		WebElement equipamento = driver
				.findElement(By.xpath("//*[contains(text(),'" + identificadorEquipamento + "')]"));
		equipamento.click();
	}

	/**
	 * Metodo para editar a descricao do equipamento.
	 * @param descricao descrição do equipamento.
	 */
	public void editarDescricaoEquipamento(String descricao) {
		botaoEditarDescricaoEquipamento.click();
		limparCampoInput(inputDescricaoEquipamento);
		inputDescricaoEquipamento.sendKeys(descricao);
	}
	//#endregion
}
