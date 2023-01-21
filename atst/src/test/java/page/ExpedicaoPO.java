package page;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class ExpedicaoPO extends BasePO{

    //#region Regiao dos atributos
    
    //#endregion

    //#region Regiao dos elementos.

    /** Tabela dos equipamentos.*/
    @FindBy(css = "#tabela-generica-equipamentos-expedicao-de-locacao")
    public WebElement tabelaEquipamentos;
   
    /** Tabela dos materiais.*/
    @FindBy(css = "#tabela-generica-materiais-expedicao-de-locacao")
    public WebElement tabelaMateriais;
   
    /** Tabela do card .*/
    @FindBy(className = "bloco-expansivel-td")
    public List<WebElement> cardExpedicaoItem;

    /** Elemento para expandir o card dos itens.*/
    @FindBy(className = "container-icone-expandir")
    public WebElement iconeExpandirCard;

    /** Input dentro de quaisquer tabelas para iserir a quantidade para expedir.*/
    @FindBy(tagName = "input")
    public WebElement inputItens;

    /** Elemento para selecionar a expedicao de todos os equipamentos.*/
    @FindBy(css = "#btn-expedir-todos-equipamentos-expedicao-de-locacao")
    public WebElement botaoExpedirTodosEquipamentos;

    /** Elemento para limpar a quantidade inserida para a expedicao de todos os equipamentos.*/
    @FindBy(css = "#btn-limpar-todos-equipamentos-expedicao-de-locacao > .v-btn__content")
    public WebElement botaoLimparTodosEquipamentos;
  
    /** Elemento para selecionar a expedicao de todos os materiais.*/
    @FindBy(css = "#btn-expedir-todos-materiais-expedicao-de-locacao")
    public WebElement botaoExpedirTodosMateriais;

    /** Elemento para limpar a quantidade inserida para a expedicao de todos os materiais.*/
    @FindBy(css = "#btn-limpar-todos-materiais-expedicao-de-locacao > .v-btn__content")
    public WebElement botaoLimparTodosMateriais;

    /** Elemento para salvar a expedicao.*/
    @FindBy(css = "#btn-primario-barra-de-acoes-rodape-base-opcoes-movimentacao-locacao")
    public WebElement botaoGerarExpedicao;

    //#endregion

    public ExpedicaoPO(WebDriver driver) {
        super(driver);
    }

    /** Metodo para expedir todos os equipamentos e todos os materiais. */
    public void expedirTodosOsItens() {
        botaoExpedirTodosEquipamentos.click();
       
        rolarPagina(botaoExpedirTodosMateriais);
        botaoExpedirTodosMateriais.click();
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
        rolarPagina(botaoExpedirTodosMateriais);

        WebElement tabela = tabelaMateriais.findElement(By.tagName("table"));

        List <WebElement> celula = tabela.findElements(By.tagName("span"));
        	for (WebElement celulaTabela : celula) {
			    if (codigoItem.equals(celulaTabela.getText()))
			    celulaTabela.click();
		}
    }

    /** Metodo para localizar um equipamento determinado e inserir a quantidade a ser requisitada. */
    public void localizarItemEInserirQuantidadeParaExpedicaoEquipamento(String codigoItem, String colunaAcao, Integer quantidade) {
	    localizarItemEExpandirCardEquipamento(codigoItem);

		WebElement linhaExpedicao = tabelaEquipamentos.findElement(By.className("bloco-expansivel-td"));
        WebElement inputExpedicao = linhaExpedicao.findElement(By.tagName("input"));

        inputExpedicao.sendKeys(String.valueOf(quantidade));
        aguardarElemento(driver, 10);
    }

    /** Metodo para localizar um material determinado e inserir a quantidade a ser requisitada. */
    public void localizarItemEInserirQuantidadeParaExpedicaoMaterial(String codigoItem, String colunaAcao, Integer quantidade) {
	    localizarItemEExpandirCardMaterial(codigoItem);

		WebElement linhaExpedicao = tabelaMateriais.findElement(By.className("bloco-expansivel-td"));
        WebElement inputExpedicao = linhaExpedicao.findElement(By.tagName("input"));

        inputExpedicao.sendKeys(String.valueOf(quantidade));
        aguardarElemento(driver, 10);
    }
}
