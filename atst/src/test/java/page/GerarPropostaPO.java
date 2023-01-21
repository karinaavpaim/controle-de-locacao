package page;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

/** Page Objects da tela de gerar proposta. */
public class GerarPropostaPO extends BasePO {

	//#region Regiao dos elementos.

    /** Elemento para identificar o nome do cliente. */
	@FindBy(css = ".layout:nth-child(1) > .md5 > .resumo-orcamento")
	public WebElement nomeCliente;

	/** Elemento para identificar o CPF ou CNPJ do cliente. */
	@FindBy(css = ".layout:nth-child(1) > .md3 > .resumo-orcamento")
	public WebElement cnpjCpf;

	/** Elemento para identificar a data de referencia do orcamento. */
	@FindBy(css = ".layout:nth-child(1) > .md4 > .resumo-orcamento")
	public WebElement dataReferencia;

	/** Elemento para identificar o objetivo do orcamento. */
	@FindBy(css = ".resumo-descricao-orcamento")
	public WebElement objetivoProposta;

	/** Elemento para identificar o valor do orcamento. */
	@FindBy(css = ".py-3 > .md3 > .resumo-orcamento")
	public WebElement valorOrcamento;

	/** Elemento para identificar o codigo do orcamento. */
	@FindBy(css = ".py-3 > .md4 > .resumo-orcamento")
	public WebElement codigoOrcamento;

	/** Elemento para escolher o modelo de proposta. */
	@FindBy(id = "autocomplete-modelo-proposta-pesquisa-modelo-proposta-geracao-de-proposta")
	public WebElement inputModeloProposta;
	
	/** Elemento para editar a proposta. */
	@FindBy(css = ".v-btn__content > .v-icon--left")
	public WebElement editarProposta;

	/** Elemento para editar o modelo de proposta. */
	@FindBy(id = "btn-Editar-modelo-geracao-de-proposta")
	public WebElement botaoEditarModeloProposta;

	/** Elemento para salvar a edicao do modelo de proposta. */
	@FindBy(id = "btn-Salvar-modelo-geracao-de-proposta")
	public WebElement botaoSalvarEdicaoProposta;

	/** Elemento para cancelar a edicao do modelo de proposta. */
	@FindBy(css = "#btn-cancelar-modelo-geracao-de-proposta > .v-btn__content")
	public WebElement botaoCancelarEdicaoProposta;

	/** Elemento para apagar o modelo de proposta selecionado. */
	@FindBy(css = ".v-icon--link")
	public WebElement botaoLimparModeloDeProposta;

	/** Elemento para visualizar a proposta. */
	@FindBy(css = "#btn-visualizar-proposta-geracao-de-proposta > .v-btn__content")
	public WebElement botaoVisualizarProposta;

	/** Elemento para fechar a visualizacao da proposta. */
	@FindBy(css = ".tox-button:nth-child(1)")
	public WebElement botaoFecharVisualizaoProposta;
	
	/** Elemento para cancelar a proposta. */
	@FindBy(css = "#btn-cancelar-proposta-geracao-de-proposta > .v-btn__content")
	public WebElement botaoCancelarProposta;

	/** Elemento para salvar a proposta. */
	@FindBy(css = "#btn-salvar-proposta-geracao-de-proposta > .v-btn__content")
	public WebElement botaoSalvarProposta;

	// Mapeando elementos da barra de richText

	/** Elemento para adicionar campos a proposta. */
	@FindBy(css = "button.tox-tbtn.tox-tbtn--select.tox-tbtn--active")
	public Select opcaoAdicionarCampos;

	/** Elemento para desfazer determinada acao dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(2) > .tox-icon > svg")
	public WebElement desfazer;

	/** Elemento para refazer determinada acao dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(3) svg")
	public WebElement refazer;

	/** Elemento para adicionar quebra de pagina dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(4) path")
	public WebElement quebraPagina;

	/** Elemento para selecionar um paragrafo dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(5) > .tox-tbtn__select-label")
	public WebElement paragrafo;

	/** Elemento para selecionar uma fonte dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(6) > .tox-tbtn__select-label")
	public WebElement fontes;

	/** Elemento para selecionar um tamanho de fonte dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(7) > .tox-tbtn__select-label")
	public WebElement tamanhoFonte;

	/** Elemento para colocar a fonte em negrito dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(8) path")
	public WebElement negrito;

	/** Elemento para colocar a fonte em italico dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(9) path")
	public WebElement italico;

	/** Elemento para colocar a fonte em sublinhado dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(10) svg")
	public WebElement sublinhado;

	/** Elemento para colocar o texto alinhado a esquerda dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(11) path")
	public WebElement alinhadoEsquerda;

	/** Elemento para colocar o texto centralizado dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(12) svg")
	public WebElement alinhadoCentro;

	/** Elemento para colocar o texto alinhado a direita dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(13) svg")
	public WebElement alinhadoDireita;

	/** Elemento para colocar o texto justificado dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(14) path")
	public WebElement alinhadoJustificado;

	/** Elemento para diminuir recuo do texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(15) path")
	public WebElement diminuirRecuo;

	/** Elemento para aumentar recuo do texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(16) svg")
	public WebElement aumentarRecuo;

	/** Elemento para inserir lista ordenada no texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(17) .tox-icon > svg")
	public WebElement listaOrdenada;

	/** Elemento para selecionar um tipo de lista ordenada no texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(17) > .tox-tbtn > svg")
	public WebElement listaOrdenadaSelecionar;

	/** Elemento para inserir lista nao ordenada no texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(18) .tox-icon > svg")
	public WebElement listaNaoOrdenada;

	/** Elemento para selecionar um tipo de lista nao ordenada no texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(18) > .tox-tbtn > svg > path")
	public WebElement listaNaoOrdenadaSelecionar;

	/** Elemento para inserir a cor do texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(19) .tox-icon > svg")
	public WebElement corTexto;

	/** Elemento para selecionar a cor do texto dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(19) > .tox-tbtn > svg")
	public WebElement corTextoSelecionar;

	/** Elemento para inserir a cor do fundo dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(20) path:nth-child(2)")
	public WebElement corFundo;

	/** Elemento para selecionar a cor do fundo dentro da edicao da proposta. */
	@FindBy(css = ".tox-split-button:nth-child(20) > .tox-tbtn > svg")
	public WebElement corFundoSelecionar;

	/** Elemento para fomatacao dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(21) svg")
	public WebElement limparFormatacao;

	/** Elemento para abrir o menu tabela dentro da edicao da proposta. */
	@FindBy(css = ".tox-tbtn:nth-child(22) > .tox-icon > svg")
	public WebElement menuTabela;

	/** Elemento para digitar a proposta dentro da edicao da proposta. */
	@FindBy(css = "p:nth-child(9)")  
	public WebElement inputPropostaPersonalizada;
	//#endregion

	//#region região dos construtores.
	public GerarPropostaPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos metodos.

	/**
	 * Metodo que realiza a digitacao e selecao do Modelo de proposta.
	 * @param modeloDesejadoDeProposta determina qual modelo de proposta a ser selecionado.
	 */
	public void escolherModeloDeProposta(String modeloDesejadoDeProposta) {
		inputModeloProposta.sendKeys(modeloDesejadoDeProposta);
		inputModeloProposta.sendKeys(Keys.TAB);
	}
	//#endregion
}
