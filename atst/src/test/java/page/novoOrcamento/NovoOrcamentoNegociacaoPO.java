package page.novoOrcamento;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import page.BasePO;

/**Page Objects da pagina de negociacao em novo orcamento.*/
public class NovoOrcamentoNegociacaoPO extends BasePO {

	//#region Regiao dos elementos.

	/**Elemento para selecionar uma negociacao no item "Negociacao e Entrega".*/
	@FindBy(css = "#btn-selecionar-prazo-orcamento > .v-btn__content")
	WebElement botaoSelectNegociacao;

	/**Elemento para listar os prazos "A RECEBER" dentro de negociacoes.*/
	@FindBy(css = ".v-treeview-node:nth-child(1) .v-treeview-node__label")
	WebElement menuPrazosAReceber;

	/**Elemento para selecionar recebimento A VISTA.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(1) .v-treeview-node__label")
	WebElement receberVistaNegociacao;

	/**Elemento para selecionar recebimento de 0 a 30 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(2) .v-treeview-node__label")
	WebElement receberZeroTrintaNegociacao;

	/**Elemento para selecionar recebimento de 30 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(3) .v-treeview-node__label")
	WebElement receberTrintaNegociacao;

	/**Elemento para selecionar recebimento de 45 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(4) .v-treeview-node__label")
	WebElement receberQuarentaCincoNegociacao;

	/**Elemento para selecionar recebimento de 60 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(5) .v-treeview-node__label")
	WebElement receberSessentaNegociacao;

	/**Elemento para selecionar recebimento de 90 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(6) .v-treeview-node__label")
	WebElement receberNoventaNegociacao;

	/**Elemento para selecionar recebimento de 90 a 120 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(7) .v-treeview-node__label")
	WebElement receberNoventaCentoVinteNegociacao;

	/**Elemento para selecionar recebimento de 30 a 60 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(8) .v-treeview-node__label")
	WebElement receberTrintaSessentaNegociacao;

	/**Elemento para selecionar recebimento de 28 dias.*/
	@FindBy(css = ".v-treeview-node--leaf:nth-child(9) .v-treeview-node__label")
	WebElement receberVinteOitoNegociacao;

	/**Elemento para listar os prazos "A PAGAR" dentro de negociacoes.*/
	@FindBy(css = ".v-treeview-node:nth-child(2) .v-treeview-node__content:nth-child(2) > .v-treeview-node__label")
	WebElement menuPrazoAPagarNegociacao;

	/**Elemento para selecionar a forma de pagamento por transferencia dentro de negociacoes.*/
	@FindBy(css = "tbody > tr:nth-child(1) > .text-left:nth-child(2)")
	WebElement pagamentoTransferenciaNegociacao;

	/**Elemento para selecionar a forma de pagamento por boleto dentro de negociacoes.*/
	@FindBy(css = "tr:nth-child(2) > .text-left:nth-child(2)")
	WebElement pagamentoBoletoNegociacao;

	/**Elemento para selecionar a forma de pagamento por DOC dentro de negociacoes.*/
	@FindBy(css = "tr:nth-child(3) > .text-left:nth-child(2)")
	WebElement pagamentoDocNegociacao;

	/**Elemento para selecionar a forma de pagamento por TED dentro de negociacoes.*/
	@FindBy(css = "tr:nth-child(4) > .text-left:nth-child(2)")
	WebElement pagamentoTedNegociacao;

	/**Elemento para voltar dentro de nova negociacao.*/
	@FindBy(css = "#btn-voltar-prazo-orcamento > .v-btn__content")
	WebElement botaoVoltarNegociacao;

	/**Elemento para salvar a negociacao.*/
	@FindBy(css = "#btn-salvar-prazo-orcamento > .v-btn__content")
	WebElement botaoSalvarNegociacao;

	/**Elemento para cancelar a inclusao de negociacao.*/
	@FindBy(css = "#btn-cancelar-prazo-orcamento > .v-btn__content")
	WebElement botaoCancelarNegociacao;
	//#endregion

	//#region região dos construtores.

	public NovoOrcamentoNegociacaoPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos metodos.

	/**
	 * Metodo para navegar até negociacao em novo orcamento.
	 * @param identificadorEmpresa nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamentoNegociacao(String identificadorEmpresa) {
		NovoOrcamentoPO novoOrcamentoPO = new NovoOrcamentoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.navegarParaNegociacao();
	}
	//#endregion
}
