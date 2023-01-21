package builder.novoOrcamento;

import page.novoOrcamento.NovoOrcamentoServicoPO;

/**Classe builder para adicionar servico em um novo orcamento*/
public class ServicoBuilder {

    //#region região dos atributos.
    private NovoOrcamentoServicoPO novoOrcamentoServicoPO;
    private String identificadorServico = "001563";
	private Integer quantidadeServico = 1;
	private Integer quantidadeDiariaServico = 1;
	private String previsaoInicialServico = "04/04/2022";
	private String previsaoFinalServico = "31/10/2022";
	private Double acrescimoServico = 0.0;
	private Double descontoServico = 0.0;
    private Double valorUnitarioServico = 100.00;
    //#endregion

    //#region região dos construtores.

    /**
    * Construtor da classe.
    * @param servicoPO PageObject da tela adicionar servico.
    */
    public ServicoBuilder(NovoOrcamentoServicoPO servicoPO){
        this.novoOrcamentoServicoPO = servicoPO;
    }
    //#endregion

    //#region região dos builders.

    /**
     * Altera o identificador que sera utilizado na busca.
     * @param identificadorServico identificador do servico que sera pesquisado.
     * @return Retorna a propria classe.
     */
    public ServicoBuilder comIdentificador(String identificadorServico){
        this.identificadorServico = identificadorServico;
        return this;
    }

    /**
     * Altera a quantidade do servico.
     * @param quantidadeServico Quantidade do servico.
     * @return Retorna a propria classe.
     */
    public ServicoBuilder comQuantidade(int quantidadeServico){
        this.quantidadeServico = quantidadeServico;
        return this;
    }

    /**
     * Altera a quantidade de diarias do servico.
     * @param quantidadeDiariaServico Quantidade de diarias do servico.
     * @return Retorna a propria classe.
     */
    public ServicoBuilder comDiaria(int quantidadeDiariaServico){
        this.quantidadeDiariaServico = quantidadeDiariaServico;
        return this;
    }

    /**
     * Altera o valor do servico.
     * @param valorServico Valor do servico.
     * @return Retorna a propria classe.
    */
    public ServicoBuilder comValorUnitario(Double valorServico){
        this.valorUnitarioServico = valorServico;
        return this;
    }

    /**
     * Altera a data de previsao inicial do servico. 
    * @param previsaoInicialServico Data de previsao inicial do servico.
     * @return Retorna a propria classe.
    */
    public ServicoBuilder comPrevisaoIncial(String previsaoInicialServico){
        this.previsaoInicialServico = previsaoInicialServico;
        return this;
    }

    /**
     * Altera a data de previsao final do servico. 
    * @param previsaoFinalServico Data de previsao final do servico.
     * @return Retorna a propria classe.
    */
    public ServicoBuilder comPrevisaoFinal(String previsaoFinalServico){
        this.previsaoFinalServico = previsaoFinalServico;
        return this;
    }

    /**
     * Altera o valor de acrescimo do servico.
     * @param valorAcrescimoServico valor a ser aplicado no acrescimo de servico.
     * @return Retorna a propria classe.
     */
    public ServicoBuilder comAcrescimo(Double valorAcrescimoServico){
        this.acrescimoServico = valorAcrescimoServico;
        return this;
    }

    /**
     * Altera o valor do desconto a ser aplicado no servico.
     * @param valorDescontoServico valor a ser aplicado no desconto de servico.
     * @return Retorna a propria classe.
     */
    public ServicoBuilder comDesconto(Double valorDescontoServico){
        this.descontoServico = valorDescontoServico;
        return this;
    }
    //#endregion

    //#region região dos métodos.

    public void adicionarServico(){
        novoOrcamentoServicoPO.selecionarServico(identificadorServico);
		
        novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputQuantidadeServico);
		novoOrcamentoServicoPO.inputQuantidadeServico.sendKeys(String.valueOf(quantidadeServico));

		novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputQuantidadeDiariaServico);
		novoOrcamentoServicoPO.inputQuantidadeDiariaServico.sendKeys(String.valueOf(quantidadeDiariaServico));

		novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputPrevisaoInicialServico);
		novoOrcamentoServicoPO.inputPrevisaoInicialServico.sendKeys(previsaoInicialServico);

		novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputPrevisaoFinalServico);
		novoOrcamentoServicoPO.inputPrevisaoFinalServico.sendKeys(previsaoFinalServico);

		novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputValorUnitarioServico);
		novoOrcamentoServicoPO.inputValorUnitarioServico.sendKeys(String.valueOf(valorUnitarioServico));
		
		novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputAcrescimoServico);
		novoOrcamentoServicoPO.inputAcrescimoServico.sendKeys(String.valueOf(acrescimoServico));

		novoOrcamentoServicoPO.limparCampoInput(novoOrcamentoServicoPO.inputDescontoServico);
		novoOrcamentoServicoPO.inputDescontoServico.sendKeys(String.valueOf(descontoServico));

		novoOrcamentoServicoPO.botaoSalvarServico.click();
		novoOrcamentoServicoPO.botaoCancelarServico.click();
    }
    //#endregion  
    
}
