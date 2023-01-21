package page;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class MedicaoPO extends BasePO{

    //#region Regiao dos atributos
    
    /**Enum para definir quais as acoes a serem realizadas em uma locacao, podendo medir, requisitar ou expedir.*/
	public enum EnumItens { EQUIPAMENTOS, MATERIAIS, SERVICOS, DESPESAS; }
    //#endregion

    //#region Regiao dos elementos

    /** Botao para preenchimento automatico da medicao. */
    @FindBy(id = "btn-preenchimento-automatico-medicao-de-locacao")
    public WebElement botaoPreenchimentoAutomatico;

    /** Input para preenchimento automatico do periodo da medicao. */
    @FindBy(css = ".text-field-datadatepicker-multiplo-preenchimento-automatico-periodo-medicao-medicao-de-locacao")
    public WebElement inputPeriodoMedicaoPreenchimentoAutomatico;

    /** Elemento para selecionar o preenchimento automatico de equipamento. */
    @FindBy(id = "checkbox-categoria-equipamentos-medicao-medicao-de-locacao")
    public WebElement checkboxEquipamento;

    /** Elemento para selecionar o preenchimento automatico de material. */
    @FindBy(id = "checkbox-categoria-materiais-medicao-medicao-de-locacao")
    public WebElement checkboxMaterial;

    /** Elemento para selecionar o preenchimento automatico de servico. */
    @FindBy(id = "checkbox-categoria-servicos-medicao-medicao-de-locacao")
    public WebElement checkboxServico;

    /** Elemento para selecionar o preenchimento automatico de despesa. */
    @FindBy(id = "checkbox-categoria-despesas-medicao-medicao-de-locacao")
    public WebElement checkboxDespesa;
      
    /** Tabela dos equipamentos.*/
    @FindBy(css = "#tabela-generica-equipamentos-medicao-locacao-medicao-de-locacao")
    public WebElement tabelaEquipamentos;

    /** Titulo materiais.*/
    @FindBy(css = "#tabela-generica-materiais-medicao-locacao-medicao-de-locacao .h2-padrao")
    public WebElement tituloMateriais;

    /** Tabela dos materiais.*/
    @FindBy(css = "#tabela-generica-materiais-medicao-locacao-medicao-de-locacao")
    public WebElement tabelaMateriais;

    /** Titulo servicos.*/
    @FindBy(css = "#tabela-generica-servicos-medicao-locacao-medicao-de-locacao .h2-padrao")
    public WebElement tituloServicos;

    /** Tabela dos servicos.*/
    @FindBy(css = "#tabela-generica-servicos-medicao-locacao-medicao-de-locacao")
    public WebElement tabelaServicos;

    /** Selecionar nome do operador.*/
    @FindBy(css = ".v-list-item__content > .v-list-item__title")
    public WebElement selecionarOperador;
   
    /** Titulo despesas.*/
    @FindBy(css = "#tabela-generica-despesas-medicao .h2-padrao")
    public WebElement tituloDespesas;

    /** Tabela dos despesas.*/
    @FindBy(css = "#tabela-generica-despesas-medicao")
    public WebElement tabelaDespesas;
  
    /** Linha do card expandido para preencher os campos de quantidade e periodos da medicao. */
    @FindBy(className = "bloco-expansivel-td")
    public WebElement cardExpandido;

    /** Elemento que contem o campo input para a quantidade de equipamentos a serem medidos. */
    @FindBy(css = ".textfield-quantidade-a-medir-equipamentos-medicao-locacao-medicao-de-locacao")
    public WebElement inputQuantidadeEquipamento;

    /** Elemento que contem o campo input para a quantidade de materiais a serem medidos. */
    @FindBy(css = ".textfield-quantidade-a-medir-materiais-medicao-locacao-medicao-de-locacao")
    public WebElement inputQuantidadeMaterial;

    /** Elemento que contem o campo input para a quantidade de servicos a serem medidos. */
    @FindBy(css = ".textfield-quantidade-a-medir-servicos-medicao-locacao-medicao-de-locacao")
    public WebElement inputQuantidadeServico;

    /** Elemento que contem o campo input para a quantidade de despesas a serem medidas. */
    @FindBy(css = ".textfield-quantidade-a-medir-despesas-medicao")
    public WebElement inputQuantidadeDespesa;

    /** Elemento que contem o campo input para o periodo de medicao do equipamento. */
    @FindBy(css = ".text-field-datadatepicker-multiple-value-periodo-medicao-equipamentos-medicao-locacao-medicao-de-locacao")
    public WebElement inputPeriodoMedicaoEquipamento;

    /** Elemento que contem o campo input para o periodo de medicao do material. */
    @FindBy(css = ".textfield-data-datepicker-periodo-medicao-materiais-medicao-locacao-medicao-de-locacao")
    public WebElement inputDataMedicaoMaterial;

    /** Elemento que contem o campo input para o periodo de medicao do servico. */
    @FindBy(css = ".text-field-datadatepicker-multiple-value-periodo-medicao-servicos-medicao-locacao-medicao-de-locacao")
    public WebElement inputPeriodoMedicaoServico;
    
    /** Elemento que contem o campo input para o periodo de medicao da despesa. */
    @FindBy(css = ".text-field-datadatepicker-multiple-datas-a-medir-despesas-medicao")
    public WebElement inputPeriodoMedicaoDespesa;
    
    /** Elemento de data do dia 10 de Maio de 2022 no calendario. */
    @FindBy(xpath = "*//tr[5]/td[7]/button/div")
    public WebElement dataCalendario;

    /** Elemento de calendario. */
    @FindBy(css = "v-picker__body v-picker__body--no-title theme--light")
    public WebElement calendario;    

    /** Botao para desmembrar o equipamento. */
    @FindBy(css = ".btn-desmembrar-equipamentos-medicao-locacao-medicao-de-locacao")
    public WebElement botaoDesmembrarEquipamento;

    /** Botao para limpar os campos de medicao do equipamento. */
    @FindBy(css = ".btn-limpar-equipamentos-medicao-locacao-medicao-de-locacao")
    public WebElement botaoLimparCamposMedicaoEquipamento;
      
    /** Botao para desmembrar o material. */
    @FindBy(css = ".btn-desmembrar-materiais-medicao-locacao-medicao-de-locacao")
    public WebElement botaoDesmembrarMaterial;

    /** Botao para limpar os campos de medicao do material. */
    @FindBy(css = ".btn-limpar-materiais-medicao-locacao-medicao-de-locacao")
    public WebElement botaoLimparCamposMedicaoMaterial;

    /** Input para pesquisar o nome do operador no card de servico. */
    @FindBy(css = ".autocomplete-pessoa-pesquisa-pessoa-funcionario-servicos-medicao-locacao-medicao-de-locacao")
    public WebElement autocompletePessoaServico;

    /** Botao para desmembrar o servico. */
    @FindBy(css = ".btn-desmembrar-servicos-medicao-locacao-medicao-de-locacao")
    public WebElement botaoDesmembrarServico;

    /** Botao para limpar os campos de medicao do servico. */
    @FindBy(css = ".btn-limpar-servicos-medicao-locacao-medicao-de-locacao")
    public WebElement botaoLimparCamposMedicaoServico;

    /** Input para inserir uma observacao na despesa. */
    @FindBy(css = ".textfield-observacao-despesas-medicao")
    public WebElement inputObservacaoDespesa;
 
    /** Botao para desmembrar a despesa. */
    @FindBy(css = ".btn-desmembrar-despesas-medicao")
    public WebElement botaoDesmembrarDespesa;

    /** Botao para limpar os campos de medicao da despesa. */
    @FindBy(css = ".btn-limpar-despesas-medicao")
    public WebElement botaoLimparCamposMedicaoDespesa;
    
    /** Botao para salvar a medicao. */
    @FindBy(id = "btn-terciario-barra-de-acoes-rodape-base-opcoes-movimentacao-locacao")
    public WebElement botaoSalvarMedicao;

    /** Botao para gerar a medicao. */
    @FindBy(id = "btn-primario-barra-de-acoes-rodape-base-opcoes-movimentacao-locacao")
    public WebElement botaoGerarMedicao;

    /** Botao para cancelar a medicao. */
    @FindBy(id = "btn-secundario-barra-de-acoes-rodape-base-opcoes-movimentacao-locacao")
    public WebElement botaoCancelarMedicao;
    //#endregion
    
    //#region Regiao dos construtores
    public MedicaoPO(WebDriver driver) {
        super(driver);
    }
    //#endregion

    //#region Regiao dos metodos

    /** Metodo para localizar o card desejado e realizar a acao desejada.
     * @param indexDoCard informar o index do card do item que deseja clicar no botao limpar.
     * @param item qual item que deseja clicar no botao limpar.  */ 
   	public void localizarCardEClicarBotaoLimparDados(int indexDoCard, EnumItens item) {
		if(item == EnumItens.EQUIPAMENTOS){
            driver.findElements(By.cssSelector(".btn-limpar-equipamentos-medicao-locacao-medicao-de-locacao"))
                .get(indexDoCard)
                .click();
        } else if(item == EnumItens.MATERIAIS){
            driver.findElements(By.cssSelector(".btn-limpar-materiais-medicao-locacao-medicao-de-locacao"))
                .get(indexDoCard)
                .click();
        } else if(item == EnumItens.SERVICOS){
            driver.findElements(By.cssSelector(".btn-limpar-servicos-medicao-locacao-medicao-de-locacao"))
                .get(indexDoCard)
                .click();
        } else if(item == EnumItens.DESPESAS){
            driver.findElements(By.cssSelector(".btn-limpar-despesas-medicao"))
                .get(indexDoCard)
                .click();
        }
	}

    /** Metodo para inserir a quantidade de itens a serem medidos. */
	public void inserirQuantidadeMedicao(int quantidade, EnumItens item) {
		if(item == EnumItens.EQUIPAMENTOS){        
            WebElement inputQuantidade = inputQuantidadeEquipamento.findElement(By.tagName("input"));
            limparCampoInput(inputQuantidade);
            inputQuantidade.sendKeys(String.valueOf(quantidade));
	    } else if(item == EnumItens.MATERIAIS){
            WebElement inputQuantidade = inputQuantidadeMaterial.findElement(By.tagName("input"));
            limparCampoInput(inputQuantidade);
            inputQuantidade.sendKeys(String.valueOf(quantidade));
        } else if(item == EnumItens.SERVICOS){
            WebElement inputQuantidade = inputQuantidadeServico.findElement(By.tagName("input"));
            limparCampoInput(inputQuantidade);
            inputQuantidade.sendKeys(String.valueOf(quantidade));
        } else if(item == EnumItens.DESPESAS){
            WebElement inputQuantidade = inputQuantidadeDespesa.findElement(By.tagName("input"));
            limparCampoInput(inputQuantidade);
            inputQuantidade.sendKeys(String.valueOf(quantidade));
        }
    }
    
    /** Metodo para inserir determinado periodo de medicao para algum item. */
    public void inserirPeriodoMedicao(EnumItens item) throws InterruptedException {
        if(item == EnumItens.EQUIPAMENTOS){     
            inputPeriodoMedicaoEquipamento.click();
                   
            Thread.sleep(2000);
            dataCalendario.click();
           
            tituloMateriais.click();
        } else if(item == EnumItens.MATERIAIS){
            inputDataMedicaoMaterial.click();

            Thread.sleep(2000);
            WebElement tabela = calendario.findElement(By.tagName("table"));
            tabela.findElement(By.xpath("*//tr[4]/td[4]/button/div"));
                
            tituloMateriais.click();
        } else if(item == EnumItens.SERVICOS){
            inputPeriodoMedicaoServico.click();

            Thread.sleep(2000);
            calendario.findElement(By.xpath("*//tr[4]/td[4]/button/div"));

            tituloServicos.click();
        } else if(item == EnumItens.DESPESAS){
            inputPeriodoMedicaoDespesa.click();

            Thread.sleep(2000);
            calendario.findElement(By.xpath("*//tr[4]/td[4]/button/div"));

            tituloDespesas.click();
        }       
    }

    /** Metodo a ser utilizado para expandir o card de um item, quando não há repeticao de seu codigo dentro da tabela. */
    public void localizarItemCodigoUnicoEExpandirCard(String codigoItem, EnumItens item) {
        if(item == EnumItens.EQUIPAMENTOS){
            rolarPagina(botaoPreenchimentoAutomatico);     
            WebElement tabela = tabelaEquipamentos.findElement(By.tagName("table"));
            List <WebElement> celula = tabela.findElements(By.tagName("td"));
            for (WebElement celulaTabela : celula) {
			    if (codigoItem.equals(celulaTabela.getText()))
			    celulaTabela.click();
		    }        
        } else if(item == EnumItens.MATERIAIS){
                rolarPagina(tituloMateriais);
                WebElement tabela = tabelaMateriais.findElement(By.tagName("table"));
                List <WebElement> celula = tabela.findElements(By.tagName("td"));
                for (WebElement celulaTabela : celula) {
			        if (codigoItem.equals(celulaTabela.getText()))
			        celulaTabela.click();
                }
        } else if(item == EnumItens.SERVICOS){
                rolarPagina(tituloServicos);
                WebElement tabela = tabelaServicos.findElement(By.tagName("table"));
                List <WebElement> celula = tabela.findElements(By.tagName("td"));
                for (WebElement celulaTabela : celula) {
			        if (codigoItem.equals(celulaTabela.getText()))
			        celulaTabela.click();
                }
        } else if(item == EnumItens.DESPESAS){
            rolarPagina(tituloDespesas);
                WebElement tabela = tabelaDespesas.findElement(By.tagName("table"));
                List <WebElement> celula = tabela.findElements(By.tagName("td"));
                for (WebElement celulaTabela : celula) {
			        if (codigoItem.equals(celulaTabela.getText()))
			        celulaTabela.click();
                }
        }     
    }

    /** Metodo a ser utilizado para expandir o card de um item, quando há mais de um item com o mesmo codigo,
     * devendo ser indicado o index que deseja.*/
    public void localizarItemCodigoRepetidoEExpandirCard(String codigoItem, int indexItem, EnumItens item) {
        if(item == EnumItens.EQUIPAMENTOS){     
            List <WebElement> itens = tabelaEquipamentos.findElements(By.xpath("*//span[not(@style)][text()='" + codigoItem + "']"));
            itens.get(indexItem).click();
        
        } else if(item == EnumItens.MATERIAIS){
            rolarPagina(tituloMateriais);
            List <WebElement> itens = tabelaMateriais.findElements(By.xpath("*//span[not(@style)][text()='" + codigoItem + "']"));
            itens.get(indexItem).click();
        
        } else if(item == EnumItens.SERVICOS){
            rolarPagina(tituloServicos);
            List <WebElement> itens = tabelaServicos.findElements(By.xpath("*//span[not(@style)][text()='" + codigoItem + "']"));
            itens.get(indexItem).click();
        
        } else if(item == EnumItens.DESPESAS){
            rolarPagina(tituloDespesas);
            List <WebElement> itens = tabelaDespesas.findElements(By.xpath("*//span[not(@style)][text()='" + codigoItem + "']"));
            itens.get(indexItem).click();
        }       
    }

    /** Metodo para inserir a quantidade de itens a serem medidos. */
	public void inserirQuantidadeMedicao(int quantidade, int indexCard, EnumItens item) {
        if(item == EnumItens.EQUIPAMENTOS){     
            List <WebElement> inputsQuantidade = driver.findElements(By.cssSelector(".textfield-quantidade-a-medir-equipamentos-medicao-locacao-medicao-de-locacao input"));
            WebElement input = inputsQuantidade.get(indexCard);
            limparCampoInput(input);
            input.sendKeys(String.valueOf(quantidade));
        
        } else if(item == EnumItens.MATERIAIS){
            rolarPagina(tituloMateriais);
            List <WebElement> inputsQuantidade = driver.findElements(By.cssSelector(".textfield-quantidade-a-medir-materiais-medicao-locacao-medicao-de-locacao input"));
            WebElement input = inputsQuantidade.get(indexCard);
            limparCampoInput(input);
            input.sendKeys(String.valueOf(quantidade));

        } else if(item == EnumItens.SERVICOS){
            rolarPagina(tituloServicos);
            List <WebElement> inputsQuantidade = driver.findElements(By.cssSelector(".textfield-quantidade-a-medir-servicos-medicao-locacao-medicao-de-locacao input"));
            WebElement input = inputsQuantidade.get(indexCard);
            limparCampoInput(input);
            input.sendKeys(String.valueOf(quantidade));

        } else if(item == EnumItens.DESPESAS){
            rolarPagina(tituloDespesas);
            List <WebElement> inputsQuantidade = driver.findElements(By.cssSelector(".textfield-quantidade-a-medir-despesas-medicao input"));
            WebElement input = inputsQuantidade.get(indexCard);
            limparCampoInput(input);
            input.sendKeys(String.valueOf(quantidade));
        }
    }

        /** Metodo para inserir o nome do operador de servico. */
        public void inserirNomeOperadorServico(String nomeOperador) {
            autocompletePessoaServico.click();
            autocompletePessoaServico.sendKeys(nomeOperador);
            aguardarElemento(driver, 10);
               
            WebElement operador = cardExpandido.findElement(By.xpath("//*[contains(text(),'" + nomeOperador + "')]"));
            operador.click();
        }   
    //#endregion
}
