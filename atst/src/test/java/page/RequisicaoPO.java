package page;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import util.TabelaUtil;

/** Page Object da página de requisicao */
public class RequisicaoPO extends BasePO {

    //#region Regiao dos atributos
     private TabelaUtil tabelaUtil;
    //#endregion

    //#region Regiao dos elementos
   
    /** Tabela de equipamentos. */
    @FindBy(css = "#tabela-generica-equipamentos-requisicao-de-locacao")
    public WebElement tabelaEquipamentos;

    /** Titulo materiais.*/
    @FindBy(css = "#tabela-generica-materiais-requisicao-de-locacao .h2-padrao")
    public WebElement tituloMateriais;

    /** Tabela de materiais. */
    @FindBy(css = "#tabela-generica-materiais-requisicao-de-locacao")
    public WebElement tabelaMateriais;

    /** Elemento de expensao do card de materiais. */
    @FindBy(css = "#tabela-generica-materiais-requisicao-de-locacao tbody tr td")
    public List<WebElement> cardsExpandirMateriais;

    /** Input da quantidade de equipamentos a serem devolvidos. */
    @FindBy(css = ".textfield-equipamentos-quantidade-a-devolver-requisicao-de-locacao input")
    public List<WebElement> inputsDevolucaoEquipamentos;

    /** Input da quantidade de materiais a serem devolvidos. */
    @FindBy(css = "#tabela-generica-materiais-requisicao-de-locacao .textfield-equipamentos-quantidade-a-devolver-requisicao-de-locacao input")
    public List<WebElement> inputsDevolucaoMateriais;

    /** Elemento para requisitar todos os equipamentos. */
    @FindBy(css = "#btn-requisitar-todos-equipamentos-requisicao-de-locacao > .v-btn__content")
    public WebElement botaoRequisitarTodosEquipamentos;

    /** Elemento para limpar todas as requisicoes de equipamentos. */
    @FindBy(css = "#btn-limpar-requisitar-todos-equipamentos-requisicao-de-locacao > .v-btn__content")
    public WebElement botaoLimparRequisicoesTodosEquipamentos;

    /** Elemento para requisitar todos os materiais. */
    @FindBy(css = "#btn-requisitar-todos-materiais-requisicao-de-locacao > .v-btn__content")
    public WebElement botaoRequisitarTodosMateriais;

    /** Elemento para salvar a requisicao. */
    @FindBy(id = "btn-primario-barra-de-acoes-rodape-base-opcoes-movimentacao-locacao")
    public WebElement botaoGerarRequisicao;

     /** Elemento para confirmar a geraçao de uma requisicao. */
     @FindBy(css = ".mensagem-flutuante-btn-primario")
     public WebElement botaoConfirmarGerarRequisicao;

    /** Elemento para cancelar a requisicao. */
    @FindBy(id = "btn-secundario-barra-de-acoes-rodape-base-opcoes-movimentacao-locacao")
    public WebElement botaoCancelarRequisicao;

    /** Elemento para cancelar a impressao da requisicao. */
    @FindBy(className = "cancel-button")
    public WebElement botaoCancelarImpressaoDaRequisicao;

    /** Elemento para imprimir a requisicao. */
    @FindBy(className = "action-button")
    public WebElement botaoImprimirRequisicao;
    //#endregion
    
    //#region região dos construtores
    public RequisicaoPO(WebDriver driver) {
        super(driver);
    }
    //#endregion

    //#region região dos metodos.

    /** Metodo para requisitar todos os equipamentos e todos os materiais. */
    public void requisitarTodosOsItens() {
        botaoRequisitarTodosEquipamentos.click();
       
        rolarPagina(botaoRequisitarTodosMateriais);
        botaoRequisitarTodosMateriais.click();
    }

    /** Metodo para localizar um equipamento e expandir o card.*/
    public void localizarItemEExpandirCardEquipamento(String codigoItem) {
        WebElement tabela = tabelaEquipamentos.findElement(By.tagName("table"));
        
        List <WebElement> celula = tabela.findElements(By.tagName("span"));
            for (WebElement celulaTabela : celula) {
			    if (codigoItem.equals(celulaTabela.getText()))
			    celulaTabela.click();
		}
    }
 
    /** Metodo para localizar um material e expandir o card.*/
    public void localizarItemEExpandirCardMaterial(String codigoItem) {
        rolarPagina(botaoRequisitarTodosMateriais);

        WebElement tabela = tabelaMateriais.findElement(By.tagName("table"));

        List <WebElement> celula = tabela.findElements(By.tagName("span"));
        	for (WebElement celulaTabela : celula) {
			    if (codigoItem.equals(celulaTabela.getText()))
			    celulaTabela.click();
		}
    }
    
    /** Metodo para localizar um equipamento determinado e inserir a quantidade a ser requisitada. */
    public void localizarItemEInserirQuantidadeParaRequisicaoEquipamento(String codigoItem, String colunaAcao, Integer quantidade) {
		tabelaUtil = new TabelaUtil(driver);

		int idLinha = tabelaUtil.obterIndiceLinha(codigoItem, tabelaEquipamentos);
        int idColuna = tabelaUtil.obterIndiceColuna(colunaAcao, tabelaEquipamentos);
		
        aguardarVisibilidadeDoElemento(driver, 3, tabelaEquipamentos);

        WebElement celula = tabelaEquipamentos.findElement(By.xpath("//tr[" + idLinha + "]/td[" + idColuna + "]"));
		
        celula.findElement(By.tagName("input")).sendKeys(String.valueOf(quantidade));
        aguardarElemento(driver, 2);
    }

    /** Metodo para localizar um material determinado e inserir a quantidade a ser requisitada. */
    public void localizarItemEInserirQuantidadeParaRequisicaoMaterial(String codigoItem, String colunaAcao, Integer quantidade) {
		tabelaUtil = new TabelaUtil(driver);

        rolarPagina(botaoRequisitarTodosMateriais);

    	int idLinha = tabelaUtil.obterIndiceLinha(codigoItem, tabelaMateriais);
        int idColuna = tabelaUtil.obterIndiceColuna(colunaAcao, tabelaMateriais);
		
        WebElement celula = driver.findElement(By.xpath("//div[@id='tabela-generica-materiais-requisicao-de-locacao']//table/tbody/tr[" + idLinha + "]/td[" + idColuna + "]"));

		celula.findElement(By.tagName("input")).sendKeys(String.valueOf(quantidade));
        aguardarElemento(driver, 10);
    }

    /** Metodo para abrir o card de um determinado equipamento e preenche-lo com o número a serem devolvidos. */
    public void devolverRequisicaoEquipamento(String codigoItem, Integer quantidade) {
        aguardarVisibilidadeDoElemento(driver, 10, tabelaEquipamentos);

        localizarItemEExpandirCardEquipamento(codigoItem);
		
        WebElement linhaDevolucao = tabelaEquipamentos.findElement(By.className("bloco-expansivel-td"));
        WebElement inputDevolucao = linhaDevolucao.findElement(By.tagName("input"));

        inputDevolucao.sendKeys(String.valueOf(quantidade));
        aguardarElemento(driver, 10);
    }

    /** Metodo para abrir o card de um determinado material e preenche-lo com o número a serem devolvidos. */
    public void devolverRequisicaoMaterial(String codigoItem, Integer quantidade) {
		localizarItemEExpandirCardMaterial(codigoItem);
		
        WebElement linhaDevolucao = tabelaMateriais.findElement(By.className("bloco-expansivel-td"));
        WebElement inputDevolucao = linhaDevolucao.findElement(By.tagName("input"));

        inputDevolucao.sendKeys(String.valueOf(quantidade));
        aguardarElemento(driver, 10);
    }
    //#endregion
}
