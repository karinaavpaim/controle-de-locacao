package page.novoOrcamento;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import page.BasePO;

/**Page Objects da pagina de servicos dentro de novo orcamento.*/
public class NovoOrcamentoServicoPO extends BasePO {

	//#region Regiao dos elementos.

	/** Elemento para digitar o servico dentro da tela para adicionar novo servico em novo orcamento. */
	@FindBy(id = "autocomplete-produto-pesquisar-produto-servicos-orcamento")
	public WebElement inputServicoNovoOrcamento;

	/**Elemento para limpar o servico selecionado.*/
	@FindBy(css = "#pesquisar-produto-servicos-orcamento .v-input__append-inner:nth-child(3) .v-icon")
	public WebElement botaoLimparInputServico;

	/**
	 * Mensagem de notificacao para os campos obrigatorios.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#pesquisar-produto-servicos-orcamento .v-messages__message")
	public WebElement mensagemServicoObrigatorio;

	/**Elemento para digitar a descricao do servico.*/
	@FindBy(id = "textfield-descricao-servicos-orcamento")
	public WebElement inputDescricaoServico;

	/**Elemento para editar a descricao dentro da tela para adicionar novo servico.*/
	@FindBy(id = "btn-editar-descricao-servicos-orcamento")
	public WebElement botaoEditarDescricaoServico;

	/**Elemento para digitar a quantidade de servicos.*/
	@FindBy(id = "textfield-quantidade-servicos-orcamento")
	public WebElement inputQuantidadeServico;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo quantidade em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = ".flex:nth-child(1) > .v-input .v-messages__message")
	public WebElement mensagemQuantidadeServicoObrigatoria;

	/**Elemento para digitar a quantidade de diarias.*/
	@FindBy(id = "textfield-quantidade-diarias-servicos-orcamento")
	public WebElement inputQuantidadeDiariaServico;

	/**
	 * Mensagem de campo obrigatorio quando deixa o campo diarias em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = ".flex:nth-child(2) > .v-input .v-messages__message")
	public WebElement mensagemQuantidadeDiariaServicoObrigatoria;

	/**Elemento para digitar a data de previsao inicial.*/
	@FindBy(id = "textfield-data-datepicker-previsao-inicial-servicos-orcamento")
	public WebElement inputPrevisaoInicialServico;

	/**
	 * Mensagem de campo obrigatorio quando deixa a data de previsao inicial em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#datepicker-previsao-inicial-servicos-orcamento .v-messages__message")
	public WebElement mensagemPrevisaoInicialServicoObrigatoria;

	/**Elemento para digitar a data de previsao final.*/
	@FindBy(id = "textfield-data-datepicker-previsao-final-servicos-orcamento")
	public WebElement inputPrevisaoFinalServico;

	/**
	 * Mensagem de campo obrigatorio quando deixa a data de previsao final em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#datepicker-previsao-final-servicos-orcamento .v-messages__message")
	public WebElement mensagemPrevisaoFinalServicoObrigatoria;

	/**Elemento para selecionar a tabela de precos.*/
	@FindBy(css = ".select-preco .v-select__selections")
	public WebElement selectTabelaPrecosServico;

	/**Elemento para preencher o valor unitario.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-unitario-servicos-orcamento")
	public WebElement inputValorUnitarioServico;

	/**
	 * Mensagem de campo obrigatorio quando deixa o valor unitario em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#campo-dinheiro-valor-unitario-servicos-orcamento .v-messages__message")
	public WebElement mensagemValorUnitarioServicoObrigatorio;

	/**Elemento para preencher o valor adicional.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-adicional-unitario-servicos-orcamento")
	public WebElement inputValorAdicionalServico;

	/**Elemento para preencher o valor de acrescimo.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-acrescimo-servicos-orcamento")
	public WebElement inputAcrescimoServico;

	/**Elemento para preencher o valor de desconto.*/
	@FindBy(id = "textfield-valor-campo-dinheiro-valor-desconto-servicos-orcamento")
	public WebElement inputDescontoServico;

	/**Elemento para informar o valor total.*/
	@FindBy(css = ".total-modal")
	public WebElement inputValorTotalServico;

	/**Elemento para salvar a inclusao de novo servico.*/
	@FindBy(css = "#btn-salvar-servicos-orcamento > .v-btn__content")
	public WebElement botaoSalvarServico;

	/**Elemento para cancelar a inclusao de novo servico.*/
	@FindBy(css = "#btn-cancelar-servicos-orcamento > .v-btn__content")
	public WebElement botaoCancelarServico;

	/**Elemento para editar o servico adicionado.*/
	@FindBy(css = "#btn-editar-servicos-orcamento .v-icon")
	public WebElement botaoEditarServico;

	/**Elemento de nome do equipamento adicionado.*/
	@FindBy(css = ".text-left > div > span:nth-child(1)")
	public WebElement nomePrimeiroServicoAdicionado;

	/**Elemento de nome do equipamento adicionado.*/
	@FindBy(css = ".text-center:nth-child(5) > div > span:nth-child(1)")
	public WebElement dataPeriodoInicialPrimeiroServicoAdicionado;

	/**Elemento de nome do equipamento adicionado.*/
	@FindBy(css = ".text-center:nth-child(6) > div > span:nth-child(1)")
	public WebElement dataPeriodoFinalPrimeiroServicoAdicionado;

	/** Elemento de nome do equipamento adicionado. */
	@FindBy(css = ".text-right:nth-child(4) > div > span:nth-child(1)")
	public WebElement diariasPrimeiroServicoAdicionado;

	/** Elemento de nome do equipamento adicionado. */
	@FindBy(css = ".text-right:nth-child(3) > div > span:nth-child(1)")
	public WebElement quantidadePrimeiroServicoAdicionado;

	/**Elemento para informar o valor total quando adicionado o equipamento*/
	@FindBy(css = ".text-right:nth-child(8) > div > span:nth-child(1)")
	public WebElement valorTotalServicoAdicionado;

	/**Elemento para excluir um equipamento.*/
	@FindBy(css = ".mdi-delete")
	public WebElement botaoExcluirServico;
	//#endregion

	//#region região dos construtores.

	public NovoOrcamentoServicoPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos metodos.

	/**
	 * Navegar para servico dentro da tela de novo orcamento.
	 * @param identificadorEmpresa Nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamentoServico(String identificadorEmpresa) {
		NovoOrcamentoPO novoOrcamentoPO = new NovoOrcamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.navegarParaServico();
	}

	/**
	 * Metodo para buscar e selecionar determinado servico.
	 * @param identificadorServico Nome ou codigo do servico.
	 */
	public void selecionarServico(String identificadorServico) {
		inputServicoNovoOrcamento.sendKeys(identificadorServico);
		aguardarElemento(driver, 10);

		WebElement servico = driver.findElement(By.xpath("//*[contains(text(),'" + identificadorServico + "')]"));
		servico.click();
	}

	/**
	 * Metodo para editar a descricao do servico selecionado.
	 * @param descricao Descricao do servico.
	 */
	public void editarDescricaoServico(String descricao) {
		botaoEditarDescricaoServico.click();
		limparCampoInput(inputDescricaoServico);
		inputDescricaoServico.sendKeys(descricao);
	}
	//#endregion
}
