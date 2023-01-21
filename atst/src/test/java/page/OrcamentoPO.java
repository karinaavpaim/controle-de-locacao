package page;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import util.TabelaUtil;

/** Page Objects da pagina de orcamentos. */
public class OrcamentoPO extends BasePO {

	//#region Regiao dos atributos.

	/**Enum para definir quais as acoes a serem realizadas em uma locacao, podendo medir, requisitar ou expedir.*/
	public enum EnumOpcoes { CANCELAR, EXCLUIR, GERAR_PROPOSTA, IMPRIMIR_PROPOSTA, EDITAR_PROPOSTA, EXCLUIR_PROPOSTA; }

	private TabelaUtil tabelaUtil;

	//#region Regiao dos elementos.
	
	/** Elemento para excluir determinado orcamento. */
	@FindBy(xpath = "//*[contains(text(),'Excluir')]")
	public WebElement excluirOrcamento;

	/** Elemento para editar determinado orcamento. */
	@FindBy(xpath = "//*[contains(text(),'Cancelar')]")
	public WebElement cancelarOrcamento;
	
	/** Elemento para gerar a proposta de determinado orcamento. */
	@FindBy(xpath = "//*[contains(text(),'Gerar proposta')]")
	public WebElement gerarPropostaDoOrcamento;

	/** Elemento para imprimir a proposta de determinado orcamento. */
	@FindBy(xpath = "//*[contains(text(),'Imprimir proposta')]")
	public WebElement imprimirPropostaDoOrcamento;

	/** Elemento para editar a proposta de determinado orcamento. */
	@FindBy(xpath = "//*[contains(text(),'Editar proposta')]")
	public WebElement editarPropostaDoOrcamento;

	/** Elemento para excluir a proposta de determinado orcamento. */
	@FindBy(xpath = "//*[contains(text(),'Excluir proposta')]")
	public WebElement excluirPropostaDoOrcamento;
	//#endregion

	//#region região dos construtores
	public OrcamentoPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos metodos.

	/** Metodo para navegar ate o meu Orcamentos. */
	public void navegarParaOrcamento() {
		menuOrcamentos.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}

	/** Metodo para obter o numero do novo orcamento gerado. */
	public String obterNumeroNovoOrcamento() {
		return obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
	}

	/** Metodo para buscar um numero de orcamento na tabela e duplicar. */
	public void localizarOrcamentoParaDuplicar(String indiceColunaCodigo, String codigoOrcamento) {
		tabelaUtil = new TabelaUtil(driver);

		WebElement tabela = driver.findElement(By.tagName("table"));
		int idLinha = tabelaUtil.obterIndiceLinha(codigoOrcamento, tabela);
		tabela.findElement(By.xpath(
				"//tr[" + idLinha + "]/td/button[@id='btn-duplicar-controle-de-orcamento']")).click();
		aguardarElemento(driver, 2);
	}

	/** Metodo para buscar um numero de orcamento na tabela e editar. */
	public void localizarOrcamentoParaEditar(String indiceColunaCodigo, String codigoOrcamento) {
		tabelaUtil = new TabelaUtil(driver);

		WebElement tabela = driver.findElement(By.tagName("table"));
		int idLinha = tabelaUtil.obterIndiceLinha(codigoOrcamento, tabela);
		tabela.findElement(By.xpath(
				"//tr[" + idLinha + "]/td/button[@id='btn-editar-controle-de-orcamento']")).click();
		aguardarElemento(driver, 2);
	}

	/** Metodo para buscar um numero de orcamento na tabela e clicar no botao opcoes. */
	public void localizarOrcamentoClicarEmOpcoesERealizarAcao(String indiceColunaCodigo, String codigoOrcamento, EnumOpcoes opcoes) {
		tabelaUtil = new TabelaUtil(driver);
		
		WebElement tabela = driver.findElement(By.tagName("table"));
		int idLinha = tabelaUtil.obterIndiceLinha(codigoOrcamento, tabela);
		tabela.findElement(By.xpath(
				"//tr[" + idLinha + "]/td/button[@id='btn-opcoes-controle-de-orcamento']")).click();
		aguardarElemento(driver, 2);
					
			if(opcoes == EnumOpcoes.CANCELAR){
				cancelarOrcamento.click();
				aguardarElemento(driver, 10);
			} else if(opcoes == EnumOpcoes.EXCLUIR){
				excluirOrcamento.click();
				aguardarElemento(driver, 10);
			} else if(opcoes == EnumOpcoes.GERAR_PROPOSTA){
				gerarPropostaDoOrcamento.click();
				aguardarElemento(driver, 10);
			} else if(opcoes == EnumOpcoes.EDITAR_PROPOSTA){
				editarPropostaDoOrcamento.click();
				aguardarElemento(driver, 10);
			} else if(opcoes == EnumOpcoes.EXCLUIR_PROPOSTA){
				excluirPropostaDoOrcamento.click();
				aguardarElemento(driver, 10);
			} else if(opcoes == EnumOpcoes.IMPRIMIR_PROPOSTA){
				imprimirPropostaDoOrcamento.click();
				aguardarElemento(driver, 10);
			}
	}

	//#endregion
}
