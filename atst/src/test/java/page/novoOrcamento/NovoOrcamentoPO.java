package page.novoOrcamento;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import builder.novoOrcamento.EquipamentoBuilder;
import page.BasePO;
import page.OrcamentoPO;

/**Page Objects da pagina de novo orcamento. */
public class NovoOrcamentoPO extends BasePO {

	//#region Regiao dos elementos.

	private OrcamentoPO orcamentoPO;
	private NovoOrcamentoEquipamentoPO novoOrcamentoEquipamentoPO;
	private EquipamentoBuilder equipamentoBuilder;

	/**Elemento para inserir o nome do cliente em novo orcamento.*/
	@FindBy(id = "autocomplete-pessoa-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento")
	public WebElement inputClienteNovoOrcamento;

	/**
	 * Mensagem de campo obrigatorio, ao deixar o nome do cliente em branco.
	 * @return retorna a mensagem "Campo Obrigatorio".
	 */
	@FindBy(css = ".v-messages__message")
	public WebElement mensagemClienteNovoOrcamentoObrigatorio;

	/**
	 * Mensagem de campos obrigatorios, ao deixar o nome do cliente e data de referencia em branco.
	 * @return retorna a mensagem "Cliente e data de referencia sao campos obrigatorios".
	 */
	@FindBy(css = ".v-alert:nth-child(5) .v-alert__content")
	public WebElement mensagemClienteEDataDeReferenciaObrigatorio;

	/**Elemento para listar os clientes conforme valores digitados no campo de busca.*/
	@FindBy(css = ".v-input__icon--append > .primary--text")
	public WebElement listaClienteCampoBuscaNovoOrcamento;

	/**Elemento para realizar uma busca avancada de clientes em novo orcamento.*/
	@FindBy(id = "icon-pesquisa-avancada-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento")
	public WebElement iconeBuscaAvancadaClienteNovoOrcamento;

	/**Elemento para realizar uma busca avancada pelo codigo em novo orcamento.*/
	@FindBy(id = "textfield-codigo-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento")
	public WebElement buscaAvancadaCodigoNovoOrcamento;

	/**Elemento para realizar uma busca avancada pelo nome em novo orcamento.*/
	@FindBy(id = "textfield-nome-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento")
	public WebElement buscaAvancadaNomeNovoOrcamento;

	/**Elemento para realizar uma busca avancada pelo CPF ou CNPJ em novo orcamento.*/
	@FindBy(id = "textfield-cpf-cnpj-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento")
	public WebElement buscaAvancadaCPFCNPJNovoOrcamento;

	/** Elemento para realizar uma busca avancada pela pessoa de contato do cliente. */
	@FindBy(id = "textfield-contato-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento")
	public WebElement buscaAvancadaPessoaContatoNovoOrcamento;

	/**Botao para realizar uma busca avancada conforme dados digitados. */
	@FindBy(css = "#btn-pesquisar-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento > .v-btn__content")
	public WebElement botaoBuscaAvancadaClienteNovoOrcamento;

	/**Botao para fechar a busca avancada de cliente em novo orcamento.*/
	@FindBy(css = "btn-fechar-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento > .v-btn__content")
	public WebElement botaoFecharBuscaAvancadaClienteNovoOrcamento;

	/**Botao para voltar quando iniciada a busca avancada de cliente.*/
	@FindBy(css = "btn-voltar-pesquisa-pessoa-cliente-informacoes-iniciais-orcamento > .v-btn__content")
	public WebElement botaoVoltarBuscaAvancadaClienteNovoOrcamento;

	/**Elemento input para inserir uma pessoa de contato do cliente em novo orcamento.*/
	@FindBy(id = "textfield-pessoa-contato-cliente-informacoes-iniciais-orcamento")
	public WebElement inputPessoaContatoNovoOrcamento;

	/**Elemento input para inserir uma data de referencia em novo orcamento.*/
	@FindBy(id = "textfield-data-datepicker-referencia-informacoes-iniciais-orcamento")
	public WebElement inputDataReferenciaNovoOrcamento;

	/**Elemento input para limpar a data de referencia em novo orcamento.*/
	@FindBy(css = "#datepicker-referencia-informacoes-iniciais-orcamento .v-input__append-inner .v-icon")
	public WebElement botaoLimparDataReferenciaNovoOrcamento;

	/**
	 * Mensagem de data de referencia obrigatoria ao deixar o campo em branco.
	 * @return retorna a mensagem "Campo obrigatorio".
	 */
	@FindBy(css = "#datepicker-referencia-informacoes-iniciais-orcamento .v-messages__message")
	public WebElement mensagemDataDeReferenciaObrigatoria;

	/**Elemento input para inserir uma previsao de inicio em novo orcamento. */
	@FindBy(id = "textfield-data-datepicker-inicio-contrato-informacoes-iniciais-orcamento")
	public WebElement inputPrevisaoInicioNovoOrcamento;

	/**Elemento input para inserir uma previsao de termino em novo orcamento.*/
	@FindBy(id = "textfield-data-datepicker-termino-contrato-informacoes-iniciais-orcamento")
	public WebElement inputPrevisaoTerminoNovoOrcamento;

	/**Elemento input para inserir adicionais personalizados em novo orcamento.*/
	@FindBy(id = "autocomplete-adicionais-personalizados-informacoes-iniciais-orcamento")
	public WebElement inputAdcionaisPersonalizadosNovoOrcamento;

	/**Elemento input para inserir o objetivo do orcamento em novo orcamento.*/
	@FindBy(id = "textfield-objetivo-proposta-informacoes-iniciais-orcamento")
	public WebElement inputObjetivoOrcamentoNovoOrcamento;

	/**Elemento input para inserir uma observacao em novo orcamento.*/
	@FindBy(id = "textarea-observacao-outras-informacoes")
	public WebElement inputObservacaoNovoOrcamento;

	/**
	 * Mensagem apresentada no titulo Itens, quando nao adicionamos qualquer equipamento, material ou servico.
	 * @return retorna a mensagem:
	 * "O orcamento deve ter pelo menos um item do tipo equipamento ou servico ou material".    
	 */
	@FindBy(css = ".v-alert:nth-child(8) .v-alert__content")
	public WebElement mensagemItemObrigatorio;

	/**Elemento aba de equipamentos. */
	@FindBy(css = ".primary--text .v-tab:nth-child(2) > div")
	public WebElement abaEquipamento;

	/**Elemento para adicionar novos equipamentos.*/
	@FindBy(css = "#btn-adicionar-equipamentos-orcamento > .v-btn__content")
	public WebElement botaoAdicionarEquipamentoNovoOrcamento;

	/**Elemento aba de materiais. */
	@FindBy(css = ".primary--text .v-tab:nth-child(3) > div")
	public WebElement abaMaterial;

	/**Elemento para adicionar novos materiais.*/
	@FindBy(css = "#btn-adicionar-materiais-orcamento > .v-btn__content")
	public WebElement botaoAdicionarMaterialNovoORcamento;

	/**Elemento aba de servicos. */
	@FindBy(css = ".v-tab:nth-child(4) > div")
	public WebElement abaServico;

	/**Elemento para adicionar novos servicos.*/
	@FindBy(css = "#btn-adicionar-servicos-orcamento > .v-btn__content")
	public WebElement botaoAdicionarServico;

	/**Elemento aba de despesas. */
	@FindBy(css = "#tabs-despesas-repasses-orcamento .v-tab:nth-child(2)")
	public WebElement abaDespesa;

	/**Elemento para adicionar nova despesa.*/
	@FindBy(css = ".v-window-item:nth-child(1) #btn-adicionar-despesas-orcamento > .v-btn__content")
	public WebElement botaoAdicionarDespesa;

	/**Elemento aba de repasses. */
	@FindBy(css = "#tabs-despesas-repasses-orcamento .v-tab:nth-child(3) > div")
	public WebElement abaRepasse;

	/**Elemento para adicionar novo repasse.*/
	@FindBy(css = ".v-window-item:nth-child(2) #btn-adicionar-repasses-orcamento > .v-btn__content")
	public WebElement botaoAdicionarRepasse;

	/**Elemento para selecionar uma negociacao.*/
	@FindBy(css = "#btn-selecionar-prazo-orcamento > .v-btn__content")
	public WebElement botaoSelecionarNegociacao;

	/**Elemento para excluir uma negociacao.*/
	@FindBy(css = ".mdi-delete")
	public WebElement botaoExcluirNegociacao;

	/**Elemento input para inserir um endereco de entrega em novo orcamento.*/
	@FindBy(id = "autocomplete-endereco-entrega-enderecos-orcamento")
	public WebElement inputEnderecoDeEntregaNovoOrcamento;

	/**Elemento para salvar o novo orcamento.*/
	@FindBy(css = "#btn-salvar-orcamento > .v-btn__content")
	public WebElement botaoSalvarNovoOrcamento;

	/**Elemento para cancelar o novo orcamento.*/
	@FindBy(css = "#btn-cancelar-orcamento > .v-btn__content")
	public WebElement botaoCancelarNovoOrcamento;

	/**Elemento para desistir do cancelamento do novo orcamento*/
	@FindBy(css = ".mensagem-flutuante-btn-secundario")
	public WebElement botaoDesistirCancelamentoNovoOrcamento;

	/**Elemento para confirmar o cancelamento do novo orcamento.*/
	@FindBy(css = ".mensagem-flutuante-btn-primario")
	public WebElement botaoConfirmarCancelamentoNovoOrcamento;

	/**Elemento para identificar os valores de equipamentos dentro do Resumo.*/
	@FindBy(css = ".flex:nth-child(2) > .totalizadores-resumo")
	public WebElement resumoValorEquipamentoNovoOrcamento;

	/**Elemento para identificar os valores de materiais dentro do Resumo.*/
	@FindBy(css = ".flex:nth-child(3) > .totalizadores-resumo")
	public WebElement resumoValorMaterialNovoOrcamento;

	/**Elemento para identificar os valores de servicos dentro do Resumo.*/
	@FindBy(css = ".flex:nth-child(4) > .totalizadores-resumo")
	public WebElement resumoValorServicoNovoOrcamento;

	/**Elemento para identificar os valores de despesas dentro do Resumo*/
	@FindBy(css = ".flex:nth-child(5) > .totalizadores-resumo")
	public WebElement resumoValorDespesaNovoOrcamento;

	/**Elemento para identificar os valores de acrescimos dentro do Resumo.*/
	@FindBy(css = ".flex:nth-child(7) > .totalizadores-resumo")
	public WebElement resumoValorAcrescimoNovoOrcamento;

	/**Elemento para identificar os valores de desconto dentro do Resumo.*/
	@FindBy(css = ".flex:nth-child(8) > .totalizadores-resumo")
	public WebElement resumoValorDescontoNovoOrcamento;

	/**Elemento para identificar os valores totais dentro do Resumo.*/
	@FindBy(css = ".total-orcamento-resumo")
	public WebElement resumoValorTotalNovoOrcamento;
	//#endregion

	//#region região dos construtores.

	public NovoOrcamentoPO(WebDriver driver) {
		super(driver);
	}
	//#endregion

	//#region Regiao dos metodos.

	/**
	 * Metodo para navegar para novo orcamento.
	 * @param identificadorEmpresa nome ou codigo da empresa.
	 */
	public void navegarParaNovoOrcamento(String identificadorEmpresa) {
		try {
			orcamentoPO = new OrcamentoPO(driver);
			orcamentoPO.navegarParaOrcamento();
			orcamentoPO.selecionarEmpresaPorIdentificador(identificadorEmpresa);
			orcamentoPO.botaoNovoOrcamento.click();
		} catch (Exception ex) {
		}
		aguardarElemento(driver, 10);
	}

	/**
	 * Metodo para selecionar um cliente na tela de novo orcamento.
	 * @param identificadorCliente nome ou codigo do cliente.
	 */
	public void selecionarClienteNovoOrcamento(String identificadorCliente) {
		aguardarElemento(driver, 10);
		inputClienteNovoOrcamento.sendKeys(identificadorCliente);
		aguardarElemento(driver, 10);
		selecionarEmpresa.click();
		aguardarElemento(driver, 10);
	}

	/**
	 * Metodo para digitar pessoa de contato na tela de novo orcamento.
	 * @param pessoaContato pessoa de contato do novo orcamento.
	 */
	public void pessoaContato(String pessoaContato) {
		inputPessoaContatoNovoOrcamento.sendKeys(pessoaContato);
	}

	/**
	 * Metodo para digitar um objetivo em novo orcamento.
	 * @param objetivo descricao do objetivo.
	 */
	public void objetivoNovoOrcamento(String objetivo) {
		inputObjetivoOrcamentoNovoOrcamento.sendKeys(objetivo);
	}

	/**
	 * Metodo para digitar uma abservacao em novo orcamento.
	 * @param observacao descricao da observacao.
	 */
	public void observacaoNovoOrcamento(String observacao) {
		inputObservacaoNovoOrcamento.sendKeys(observacao);
	}

	/** Metodo para navegar ate novo equipamento dentro de novo orcamento. */
	public void navegarParaEquipamento() {
		rolarPagina(inputObjetivoOrcamentoNovoOrcamento);
		abaEquipamento.click();
		botaoAdicionarEquipamentoNovoOrcamento.click();
	}

	/** Metodo para navegar ate novo servico dentro de novo orcamento. */
	public void navegarParaServico() {
		rolarPagina(inputObjetivoOrcamentoNovoOrcamento);
		abaServico.click();
		botaoAdicionarServico.click();
	}

	/** Metodo para navegar ate novo material dentro de novo orcamento. */
	public void navegarParaMaterial() {
		rolarPagina(inputObjetivoOrcamentoNovoOrcamento);
		abaMaterial.click();
		botaoAdicionarMaterialNovoORcamento.click();
	}

	/** Metodo para navegar ate nova despesa dentro de novo orcamento. */
	public void navegarParaDespesa() {
		rolarPagina(botaoSelecionarNegociacao);
		abaDespesa.click();
		botaoAdicionarDespesa.click();
	}

	/** Metodo para navegar ate novo repasse dentro de novo orcamento. */
	public void navegarParaRepasse() {
		rolarPagina(botaoSelecionarNegociacao);
		abaRepasse.click();
		botaoAdicionarRepasse.click();
	}

	/** Metodo para navegar ate novo repasse dentro de novo orcamento. */
	public void navegarParaNegociacao() {
		rolarPagina(botaoSelecionarNegociacao);
		botaoSelecionarNegociacao.click();
	}

	/**
	 * Metodo que realiza a digitacao e selecao do AdicionalPersonalizado
	 * @param nomeAdicionalPersonalizado nome do adicionar personalizado.
	 */
	public void selecionarAdicionalPersonalizado(String nomeAdicionalPersonalizado) {
		inputAdcionaisPersonalizadosNovoOrcamento.sendKeys(nomeAdicionalPersonalizado);
		inputAdcionaisPersonalizadosNovoOrcamento.sendKeys(Keys.TAB);
	}

	/** Metodo para selecionar um endereco de entrega. */
	public void selecionarEnderecoDeEntrega(String endereco) {
		rolarPagina(inputEnderecoDeEntregaNovoOrcamento);
		inputEnderecoDeEntregaNovoOrcamento.sendKeys(endereco);
		WebElement elemento = driver.findElement(By.className("v-list-item__mask"));
		elemento.click();	
	}

	/**
	 * Metodo que adiciona um novo orcamento ja com dados predefinidos.
 	 * @param identificadorEmpresa nome ou codigo da empresa.
	 * @param identificadorCliente nome ou codigo do cliente.
	 */
	public void adicionarNovoOrcamento(String identificadorEmpresa, String identificadorCliente) {
		novoOrcamentoEquipamentoPO = new NovoOrcamentoEquipamentoPO(driver);
		equipamentoBuilder = new EquipamentoBuilder(novoOrcamentoEquipamentoPO);

		navegarParaNovoOrcamento(identificadorEmpresa);

		selecionarClienteNovoOrcamento(identificadorCliente);
	
		navegarParaEquipamento();
		
		equipamentoBuilder
			.adicionarEquipamento();

		botaoSalvarNovoOrcamento.click();
	}
	//#endregion
}
