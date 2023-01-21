package page.novoOrcamento;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import page.BasePO;

/**Page Objects da pagina de repasses dentro de novo orcamento.*/
public class NovoOrcamentoRepassePO extends BasePO {

	//#region Regiao dos elementos.

	/**Elemento input para buscar a pessoa para repasse.*/
	@FindBy(id = "autocomplete-pessoa-pesquisa-pessoa-pessoa-repasse-repasses-orcamento")
	public WebElement inputPessoaRepasse;

	/**
	 * Mensagem de campo obrigatorio caso a pessoa para repasse nao seja preenchida.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#pesquisa-pessoa-pessoa-repasse-repasses-orcamento .v-messages__message")
	public WebElement mensagemPessoaRepasseObrigatoria;

	/**
	 * Mensagem quando deixamos os campos de repasse em branco.
	 * @return retorna a mensagem "Preencha os campos obrigatorios: Pessoa para repasse."
	 */
	@FindBy(css = ".notificacao-campo-obrigatorio")
	public WebElement mensagemCampoObrigatorioRepasse;

	/**Elemento para limpar o input da pessoa para repasse.*/
	@FindBy(css = ".v-input__icon--clear > .primary--text")
	public WebElement botaoLimparPessoaRepasse;

	/**Elemento para digitar a aliquota de faturamento.*/
	@FindBy(id = "textfield-valor-campo-numero-aliquota-faturamento-repasses-orcamento")
	public WebElement inputAliquotaFaturamentoRepasse;

	/**Elemento para digitar a aliquota duplicata.*/
	@FindBy(id = "textfield-valor-campo-numero-aliquota-duplicata-repasses-orcamento")
	public WebElement inputAliquotaDuplicataRepasse;

	/**Elemento para realizar uma busca avancada dentro de repasse.*/
	@FindBy(id = "icon-pesquisa-avancada-pesquisa-pessoa-pessoa-repasse-repasses-orcamento")
	public WebElement botaoPesquisaAvancadaPessoaRepasse;

	/**Elemento para buscar por codigo dentro de busca avancada.*/
	@FindBy(id = "textfield-codigo-pesquisa-pessoa-pessoa-repasse-repasses-orcamento")
	public WebElement inputBuscaAvancadaCodigoRepasse;

	/**Elemento para buscar por nome dentro de busca avancada.*/
	@FindBy(id = "textfield-nome-pesquisa-pessoa-pessoa-repasse-repasses-orcamento")
	public WebElement inputBuscaAvancadaNomeRepasse;

	/**Elemento para buscar por CPF ou CNPJ dentro de busca avancada.*/
	@FindBy(id = "textfield-cpf-cnpj-pesquisa-pessoa-pessoa-repasse-repasses-orcamento")
	public WebElement inputBuscaAvancadaCPFCNPJRepasse;

	/**Elemento para buscar por contato dentro de busca avancada.*/
	@FindBy(id = "textfield-contato-pesquisa-pessoa-pessoa-repasse-repasses-orcamento")
	public WebElement inputBuscaAvancadaContatoRepasse;

	/**Elemento para busca avancada.*/
	@FindBy(css = "#btn-pesquisar-pesquisa-pessoa-pessoa-repasse-repasses-orcamento > .v-btn__content")
	public WebElement botaoBuscaAvancada;

	/**Elemento para voltar para a tela de busca avancada apos realizar a pesquisa.*/
	@FindBy(css = "#btn-voltar-pesquisa-pessoa-pessoa-repasse-repasses-orcamento > .v-btn__content")
	public WebElement botaoVoltarBuscaAvancada;

	/**Elemento para fechar a busca avancada.*/
	@FindBy(css = "#btn-fechar-pesquisa-pessoa-pessoa-repasse-repasses-orcamento > .v-btn__content")
	public WebElement botaoFecharBuscaAvancada;

	/**Elemento para cancelar o repasse.*/
	@FindBy(css = "#btn-cancelar-repasses-orcamento > .v-btn__content")
	public WebElement botaoCancelarRepasse;

	/**Elemento para salvar o repasse.*/
	@FindBy(css = "#btn-salvar-repasses-orcamento > .v-btn__content")
	public WebElement botaoSalvarRepasse;

	/**Elemento para conferir o nome da pessoa do repasse adicionado.*/
	@FindBy(css = "#repasses-orcamento tbody .text-left:nth-child(2)")
	public WebElement pessoaRepasseAdicionado;

	/**Elemento para conferir a aliquota de faturamento do repasse adicionado.*/
	@FindBy(css = "#repasses-orcamento .text-right:nth-child(4)")
	public WebElement aliquotaFaturamentoRepasseAdicionado;

	/**Elemento para conferir a aliquota duplicata do repasse adicionado.*/
	@FindBy(css = "#repasses-orcamento .text-right:nth-child(5)")
	public WebElement aliquotaDuplicataRepasseAdicionado;

	/**Elemento para editar o repasse adicionado.*/
	@FindBy(css = "#btn-editar-repasses-orcamento .v-icon")
	public WebElement botaoEditarRepasse;
	//#endregion

	//#region região dos construtores.

	public NovoOrcamentoRepassePO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos elementos.

	/**
	 * Navegar para a tela de novo repasse dentro da tela de Novo Orcamento.
	 * @param identificadorEmpresa Nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamentoRepasse(String identificadorEmpresa) {
		NovoOrcamentoPO novoOrcamentoPO = new NovoOrcamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.navegarParaRepasse();
	}

	/**
	 * Metodo para selecionar pessoa de repasse.
	 * @param pessoaRepasse Nome ou codigo da pessoa de repasse.
	 */
	public void selecionarPessoaRepasse(String pessoaRepasse) {
		limparCampoInput(inputPessoaRepasse);
		inputPessoaRepasse.sendKeys(pessoaRepasse);
		aguardarElemento(driver, 10);
		
		WebElement repasse = driver.findElement(By.xpath("//*[contains(text(),'" + pessoaRepasse + "')]"));
		repasse.click();
	}
	//#endregion
}
