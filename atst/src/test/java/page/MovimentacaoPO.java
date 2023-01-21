package page;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import builder.novoOrcamento.EquipamentoBuilder;
import builder.novoOrcamento.MaterialBuilder;
import builder.novoOrcamento.ServicoBuilder;
import page.OrcamentoPO.EnumOpcoes;
import page.novoOrcamento.NovoOrcamentoEquipamentoPO;
import page.novoOrcamento.NovoOrcamentoMaterialPO;
import page.novoOrcamento.NovoOrcamentoPO;
import page.novoOrcamento.NovoOrcamentoServicoPO;
import util.TabelaUtil;

/**Page Object da página de movimentacao */
public class MovimentacaoPO extends BasePO {

	//#region Regiao dos atributos.
	
	/**Enum para definir quais as acoes a serem realizadas em uma locacao, podendo medir, requisitar ou expedir.*/
	public enum EnumAcoes { REQUISITAR, EXPEDIR, MEDIR; }
		
    private NovoOrcamentoPO novoOrcamentoPO;
	private OrcamentoPO orcamentoPO;
	private NovoOrcamentoEquipamentoPO novoOrcamentoEquipamentoPO;
	private NovoOrcamentoServicoPO novoOrcamentoServicoPO;
	private NovoOrcamentoMaterialPO novoOrcamentoMaterialPO;
	private EquipamentoBuilder equipamentoBuilder;
	private MaterialBuilder materialBuilder;
	private ServicoBuilder servicoBuilder;
	private TabelaUtil tabelaUtil;
	private GerarPropostaPO gerarPropostaPO;
	private GestaoPO gestaoPO;
	//#endregion

	//#region Regiao dos elementos.
    
	/** Tabela de movimentacoes.*/
    @FindBy(tagName = "table")
    public WebElement tabela;

	/** Elemento input para pesquisar movimentacao.*/
    @FindBy(id = "textfield-pesquisar-tabela-generica-movimentacao")
    public WebElement inputMovimentacao;

    /** Elemento de tabela de movimentacao.*/
    @FindBy(css = ".tabela-orcamentos table")
    public WebElement tabelaMovimentacao;

	/** Elemento de filtro. */
	@FindBy(css = "#btn-filtros-movimentacao > .v-btn__content")
	public WebElement botaoFiltroMovimentacao;
	
    /** Input de codigo dentro de filtro. */
	@FindBy(id = "textfield-codigo-filtros-pesquisa-orcamento-movimentacao")
	public WebElement inputCodigoMovimentacao;

    /** Input de cliente dentro de filtro. */
	@FindBy(id = "autocomplete-pessoa-pesquisa-pessoa-cliente-filtros-pesquisa-orcamento-movimentacao")
	public WebElement inputClienteMovimentacao;

    /** Elemento para filtrar conforme dados inseridos no filtro. */
	@FindBy(css = "#btn-filtrar-filtros-pesquisa-orcamento-movimentacao > .v-btn__content")
	public WebElement botaoFiltrar;

    /** Elemento para limpar dados inseridos no filtro. */
	@FindBy(css = "#btn-limpar-filtros-pesquisa-orcamento-movimentacao > .v-btn__content")
	public WebElement botaoLimparFiltro;

	/**Elemento para mapear botao de expandir card na tela de requisicao*/
	@FindBy(className = "v-input input-acao-requisitar v-input--hide-details v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted textfield-equipamentos-quantidade-a-requisitar-requisicao-de-locacao")
	public WebElement botaoExpandirCardRequisicao;
	//#endregion

	//#region Regiao dos construtores.
    public MovimentacaoPO(WebDriver driver) {
        super(driver);
    }
	//#endregion

	//#region Regiao dos metodos.

    /** Metodo para navegar ate o menu Movimentacao. */
	public void navegarParaMovimentacao() {
		menuMovimentacao.click();
		aguardarCarregamentoDaPagina(carregamentoDaPagina);
	}

    /** Metodo para localizar determinada locacao na tabela e realizar a medicao, expedicao ou requisicao */
	public void localizarLocacaoERealizarDeterminadaOperacao(String indiceColunaCodigo, String codigoOrcamento, EnumAcoes acoes) {
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		tabelaUtil = new TabelaUtil(driver);

		limparCampoInput(inputMovimentacao);
		inputMovimentacao.sendKeys(codigoOrcamento);

		int idLinha = tabelaUtil.obterIndiceLinha(codigoOrcamento, tabela);
			
			if(acoes == EnumAcoes.REQUISITAR){
				tabela.findElement(By.xpath(
					"//tr[" + idLinha + "]/td/button[@id='btn-requisitar-movimentacao']")).click();
				novoOrcamentoPO.aguardarElemento(driver, 10);
			} else if(acoes == EnumAcoes.EXPEDIR){
				tabela.findElement(By.xpath(
					"//tr[" + idLinha + "]/td/button[@id='btn-expedir-movimentacao']")).click();
				novoOrcamentoPO.aguardarElemento(driver, 10);
			} else if(acoes == EnumAcoes.MEDIR){
				tabela.findElement(By.xpath(
					"//tr[" + idLinha + "]/td/button[@id='btn-medir-movimentacao']")).click();
				novoOrcamentoPO.aguardarElemento(driver, 10);
			}
		}
	
    /**
	 * Metodo que adiciona um novo orcamento para realizar testes na tela de Movimentacao.
 	 * @param identificadorEmpresa nome ou codigo da empresa.
	 * @param identificadorCliente nome ou codigo do cliente.
	 * @param endereco endereco de entrega a ser selecionado.
	 * @param quantidadeItens Quantidade de itens que serão adicionados no novo orçamento.
	 * @return Retorna um boolean d acordo com o status de sucesso ou falha na criação do orcamento.
	 */
	public Boolean adicionarNovoOrcamentoParaExpedicaoRequisicaoEMedicao(String identificadorEmpresa, 
					String identificadorCliente, String endereco, int quantidadeItens) {
		
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		orcamentoPO = new OrcamentoPO(driver);
		novoOrcamentoEquipamentoPO = new NovoOrcamentoEquipamentoPO(driver);
		equipamentoBuilder = new EquipamentoBuilder(novoOrcamentoEquipamentoPO);
		novoOrcamentoServicoPO = new NovoOrcamentoServicoPO(driver);
		servicoBuilder = new ServicoBuilder(novoOrcamentoServicoPO);
		novoOrcamentoMaterialPO = new NovoOrcamentoMaterialPO(driver);
		materialBuilder = new MaterialBuilder(novoOrcamentoMaterialPO);
		tabelaUtil = new TabelaUtil(driver);
		gerarPropostaPO = new GerarPropostaPO(driver);
		gestaoPO = new GestaoPO(driver);

		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		novoOrcamentoPO.navegarParaEquipamento();
		
		equipamentoBuilder
			.comQuantidade(quantidadeItens)			
			.adicionarEquipamento();
			
		novoOrcamentoPO.navegarParaServico();

		servicoBuilder
			.comQuantidade(quantidadeItens)			
			.adicionarServico();
		
		novoOrcamentoPO.navegarParaMaterial();

		materialBuilder
			.comQuantidade(quantidadeItens)			
			.adicionarMaterial();
		
		novoOrcamentoPO.selecionarEnderecoDeEntrega(endereco);

		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		String codigoNovoOrcamentoCriado = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 3).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		aguardarElemento(driver, 10);

		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", codigoNovoOrcamentoCriado, "Status", "Pronto");
		gerarPropostaPO.botaoConfirmarMensagemFlutuante.click();

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", codigoNovoOrcamentoCriado, EnumOpcoes.GERAR_PROPOSTA);
		
		aguardarVisibilidadeDoElemento(driver, 4, gerarPropostaPO.inputModeloProposta);

		gerarPropostaPO.escolherModeloDeProposta("OneSubsea");
		
		gerarPropostaPO.aguardarElementoSerClicavel(driver, 10, gerarPropostaPO.editarProposta);

		gerarPropostaPO.editarProposta.click();
		gerarPropostaPO.botaoSalvarEdicaoProposta.click();
		gerarPropostaPO.botaoSalvarProposta.click();
		
		aguardarElemento(driver, 10);

		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", codigoNovoOrcamentoCriado, "Status", "Aprovado");
		gerarPropostaPO.botaoConfirmarMensagemFlutuante.click();
		
		gestaoPO.navegarParaGestao();

		aguardarElemento(driver, 10);

		tabelaUtil.clicarParaAlterarStatusDoOrcamento("Código", codigoNovoOrcamentoCriado, "Status", "Liberado");
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
		
		navegarParaMovimentacao();

		aguardarElemento(driver, 10);

		boolean confirmaOrcamentoCriadoComSucesso;

		if(codigoNovoOrcamentoCriado != null){
			confirmaOrcamentoCriadoComSucesso = true;
		}else {
			confirmaOrcamentoCriadoComSucesso = false;
		}
		
		return confirmaOrcamentoCriadoComSucesso;
	}

	/** Metodo para fechar a tela de impressao da requisicao. 
	 * @throws AWTException 
	 * @throws InterruptedException */
	public void fecharTelaDeImpressao(int tempoDeEspera) throws AWTException, InterruptedException {
		Robot r = new Robot();

		Thread.sleep(tempoDeEspera);
	
		r.keyPress(KeyEvent.VK_ESCAPE);
	}
	//#endregion
}
