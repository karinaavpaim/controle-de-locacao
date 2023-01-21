package builder.novoOrcamento;

import page.novoOrcamento.NovoOrcamentoEquipamentoPO;

/** Classe builder para adicionar equipamento em um novo orcamento.*/
public class EquipamentoBuilder {

    //#region região dos atributos.

    private NovoOrcamentoEquipamentoPO novoOrcamentoEquipamentoPO;
    private String identificadorEquipamento = "000109";
	private Integer quantidadeEquipamento = 1;
	private Integer quantidadeDiaria = 1;
	private String previsaoInicialEquipamento = "04/04/2022";
	private String previsaoFinalEquipamento = "31/10/2022";
	private Double acrescimoEquipamento = 0.0;
	private Double descontoEquipamento = 0.0;
    private Double valorUnitarioEquipamento = 100.00;
    //#endregion

    //#region região dos construtores.

    /**
    * Construtor da classe.
    * @param novoOrcamentoEquipamentoPO PageObject da tela adicionar equipamento em novo orcamento.
    */
    public EquipamentoBuilder(NovoOrcamentoEquipamentoPO novoOrcamentoEquipamentoPO){
        this.novoOrcamentoEquipamentoPO = novoOrcamentoEquipamentoPO;
    }
    //#endregion

    //#region região dos builders.

    /**
     * Altera o identificador que será utilizado na busca.
     * @param identificadorEquipamento identificador do equipamento que sera pesquisado.
     * @return Retorna a própria classe.
     */
    public EquipamentoBuilder comIdentificador(String identificadorEquipamento){
        this.identificadorEquipamento = identificadorEquipamento;
        return this;
    }

    /**
     * Altera Quantidade do equipamento.
     * @param quantidadeEquipamento Quantidade do equipamento.
     * @return Retorna a própria classe.
     */
    public EquipamentoBuilder comQuantidade(int quantidadeEquipamento){
        this.quantidadeEquipamento = quantidadeEquipamento;
        return this;
    }

    /**
     * Altera Quantidade de diarias do equipamento.
     * @param diariaEquipamento Quantidade de diarias do equipamento.
     * @return Retorna a própria classe.
     */
    public EquipamentoBuilder comDiaria(int diariaEquipamento){
        this.quantidadeDiaria = diariaEquipamento;
        return this;
    }

    /**
     * Altera o valor do equipamento.
     * @param valorEquipamento Valor do equipamento.
     * @return Retorna a própria classe.
    */
    public EquipamentoBuilder comValorUnitario(Double valorEquipamento){
        this.valorUnitarioEquipamento = valorEquipamento;
        return this;
    }

    /**
     * Altera a data de previsao incial do equipamento. 
     * @param previsaoInicialEquipamento Data de previsao inicial do equipamento.
     * @return Retorna a própria classe.
    */
    public EquipamentoBuilder comPrevisaoIncial(String previsaoInicialEquipamento){
        this.previsaoInicialEquipamento = previsaoInicialEquipamento;
        return this;
    }

    /**
     * Altera a data de previsao final do equipamento. 
     * @param previsaoFinalEquipamento Data de previsao final do equipamento.
     * @return Retorna a própria classe.
    */
    public EquipamentoBuilder comPrevisaoFinal(String previsaoFinalEquipamento){
        this.previsaoFinalEquipamento = previsaoFinalEquipamento;
        return this;
    }

    /**
     * Altera o valor do acrescimo do equipamento.
     * @param valorAcrescimoEquipamento valor a ser acrescido no equipamento.
     * @return Retorna a própria classe.
     */
    public EquipamentoBuilder comAcrescimo(Double valorAcrescimoEquipamento){
        this.acrescimoEquipamento = valorAcrescimoEquipamento;
        return this;
    }

    /**
     * Altera o valor de desconto a ser aplicado no equipamento.
     * @param valorDescontoEquipamento valor de desconto a ser aplicado no equipamento.
     * @return Retorna a própria classe.
     */
    public EquipamentoBuilder comDesconto(Double valorDescontoEquipamento){
        this.descontoEquipamento = valorDescontoEquipamento;
        return this;
    }
    //#endregion

    //#region região dos métodos.

    public void adicionarEquipamento(){
        novoOrcamentoEquipamentoPO.selecionarEquipamento(identificadorEquipamento);
		
        novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputQuantidadeEquipamento);
		novoOrcamentoEquipamentoPO.inputQuantidadeEquipamento.sendKeys(String.valueOf(quantidadeEquipamento));

		novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputQuantidadeDiariaEquipamento);
		novoOrcamentoEquipamentoPO.inputQuantidadeDiariaEquipamento.sendKeys(String.valueOf(quantidadeDiaria));

		novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputPrevisaoInicialEquipamento);
		novoOrcamentoEquipamentoPO.inputPrevisaoInicialEquipamento.sendKeys(previsaoInicialEquipamento);

		novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputPrevisaoFinalEquipamento);
		novoOrcamentoEquipamentoPO.inputPrevisaoFinalEquipamento.sendKeys(previsaoFinalEquipamento);

		novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputValorUnitarioEquipamento);
		novoOrcamentoEquipamentoPO.inputValorUnitarioEquipamento.sendKeys(String.valueOf(valorUnitarioEquipamento));

		novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputAcrescimoEquipamento);
		novoOrcamentoEquipamentoPO.inputAcrescimoEquipamento.sendKeys(String.valueOf(acrescimoEquipamento));

		novoOrcamentoEquipamentoPO.limparCampoInput(novoOrcamentoEquipamentoPO.inputDescontoEquipamento);
		novoOrcamentoEquipamentoPO.inputDescontoEquipamento.sendKeys(String.valueOf(descontoEquipamento));

		novoOrcamentoEquipamentoPO.botaoSalvarEquipamento.click();
		novoOrcamentoEquipamentoPO.botaoCancelarEquipamento.click();
    }
    //#endregion  
}
