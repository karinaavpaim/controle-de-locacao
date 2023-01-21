package builder.novoOrcamento;

import page.novoOrcamento.NovoOrcamentoMaterialPO;

/**Classe builder para adicionar material em um novo orcamento.*/
public class MaterialBuilder {

    //#region região dos atributos.

    private  NovoOrcamentoMaterialPO novoOrcamentoMaterialPO;
	private String identificadorMaterial = "000129";
	private Integer quantidadeMaterial = 1;
	private Double valorUnitarioMaterial = 1000.0;
	private String dataSaidaPrevistaMaterial = "04/04/2022";
    private Double acrescimoMaterial = 0.0;
	private Double descontoMaterial = 0.0;
    //#endregion

    //#region região dos contrutores.
    /**
    * Construtor da classe.
    * @param novoOrcamentoMaterialPO PageObject da tela adicionar material em novo orcamento.
    */
    public MaterialBuilder(NovoOrcamentoMaterialPO novoOrcamentoMaterialPO){
        this.novoOrcamentoMaterialPO = novoOrcamentoMaterialPO;
    }
    //#endregion

    //#region região dos builders.

    /**
     * Altera o identificador que será utilizado na busca.
     * @param identificadorMaterial identificador do material que sera pesquisado.
     * @return Retorna a propria classe.
     */
    public MaterialBuilder comIdentificador(String identificadorMaterial){
        this.identificadorMaterial = identificadorMaterial;
        return this;
    }

    /**
     * Altera a quantidade do material.
     * @param quantidadeMaterial Quantidade do material.
     * @return Retorna a propria classe.
     */
    public MaterialBuilder comQuantidade(Integer quantidadeMaterial){
        this.quantidadeMaterial = quantidadeMaterial;
        return this;
    }

    /**
     * Altera o valor unitario do material.
     * @param valorUnitarioMaterial Valor unitario do material.
     * @return Retorna a propria classe.
     */
    public MaterialBuilder comValorUnitario(Double valorUnitarioMaterial){
        this.valorUnitarioMaterial = valorUnitarioMaterial;
        return this;
    }

    /**
     * Altera a data de saida prevista do material.
     * @param dataSaidaPrevistaMaterial Data de saida prevista do material.
     * @return Retorna a propria classe.
     */
    public MaterialBuilder comSaidaPrevista(String dataSaidaPrevistaMaterial){
        this.dataSaidaPrevistaMaterial = dataSaidaPrevistaMaterial;
        return this;
    }

    /**
     * Altera o acrescimo aplicado no valor do material.
     * @param acrescimoMaterial Valor de acrescimo aplicado no material.
     * @return Retorna a propria classe.
     */
    public MaterialBuilder comAcrescimo(Double acrescimoMaterial){
        this.acrescimoMaterial = acrescimoMaterial;
        return this;
    }

    /**
     * Altera o desconto aplicado no valor do material.
     * @param descontoMaterial Valor de desconto aplicado no material.
     * @return Retorna a propria classe.
     */
    public MaterialBuilder comDesconto(Double descontoMaterial){
        this.descontoMaterial = descontoMaterial;
        return this;
    }
    //#endregion

    //#region região dos métodos.

    public void adicionarMaterial(){
        novoOrcamentoMaterialPO.selecionarMaterial(identificadorMaterial);

		novoOrcamentoMaterialPO.limparCampoInput(novoOrcamentoMaterialPO.inputQuantidadeMaterial);
		novoOrcamentoMaterialPO.inputQuantidadeMaterial.sendKeys(String.valueOf(quantidadeMaterial));

		novoOrcamentoMaterialPO.limparCampoInput(novoOrcamentoMaterialPO.inputPrevisaoSaidaMaterial);
		novoOrcamentoMaterialPO.inputPrevisaoSaidaMaterial.sendKeys(dataSaidaPrevistaMaterial);

		novoOrcamentoMaterialPO.limparCampoInput(novoOrcamentoMaterialPO.inputValorUnitarioMaterial);
		novoOrcamentoMaterialPO.inputValorUnitarioMaterial.sendKeys(String.valueOf(valorUnitarioMaterial));
		
		novoOrcamentoMaterialPO.limparCampoInput(novoOrcamentoMaterialPO.inputAcrescimoMaterial);
		novoOrcamentoMaterialPO.inputAcrescimoMaterial.sendKeys(String.valueOf(acrescimoMaterial));
		
		novoOrcamentoMaterialPO.limparCampoInput(novoOrcamentoMaterialPO.inputDescontoMaterial);
		novoOrcamentoMaterialPO.inputDescontoMaterial.sendKeys(String.valueOf(descontoMaterial));

		novoOrcamentoMaterialPO.botaoSalvarMaterial.click();
		novoOrcamentoMaterialPO.botaoCancelarMaterial.click();
    }
    //#endregion
}
