package builder.novoOrcamento;

import page.novoOrcamento.NovoOrcamentoDespesaPO;

/** Classe builder para adicionar despesa em um novo orcamento. */
public class DespesaBuilder {
    
    //#region região dos atributos.

    private NovoOrcamentoDespesaPO novoOrcamentoDespesaPO;
    private String identificadorDespesa = "000166";
    private int quantidadeDespesa = 1;
    private double valorUnitarioDespesa = 10.0;
    //#endregion

    //#region região dos construtores.

    /**
    * Construtor da classe.
    * @param novoOrcamentoDespesaPO PageObject da tela adicionar despesa em novo orcamento.
    */
    public DespesaBuilder(NovoOrcamentoDespesaPO novoOrcamentoDespesaPO){
        this.novoOrcamentoDespesaPO = novoOrcamentoDespesaPO;
    }
    //#endregion

    //#region região dos builders.

    /**
     * Altera o identificador que será utilizado na busca.
     * @param identificadorDespesa identificador da despesa que sera pesquisada.
     * @return Retorna a própria classe.
     */
    public DespesaBuilder comIdentificador(String identificadorDespesa){
        this.identificadorDespesa = identificadorDespesa;
        return this;
    }

    /**
     * Altera a quantidade da despesa.
     * @param quantidade Quantidade a ser adicionada.
     * @return Retorna a própria classe.
     */
    public DespesaBuilder comQuantidade(Integer quantidade){
        this.quantidadeDespesa = quantidade;
        return this;
    }

    /**
     * Alterar o valor a despesa.
     * @param valor Valor da despesa.
     * @return Retorna a própria classe.
    */
    public DespesaBuilder comValorUnitario(Double valor){
        this.valorUnitarioDespesa = valor;
        return this;
    }
    //#endregion

    //#region região dos métodos.

    /**
     * Método criado para adicionar uma despesa em um novo orcamento.
     */
	public void adicionarDespesa() {
            novoOrcamentoDespesaPO.selecionarDespesa(identificadorDespesa);
    
            novoOrcamentoDespesaPO.limparCampoInput(novoOrcamentoDespesaPO.inputQuantidadeDespesa);
            novoOrcamentoDespesaPO.inputQuantidadeDespesa.sendKeys(String.valueOf(quantidadeDespesa));
            
            novoOrcamentoDespesaPO.limparCampoInput(novoOrcamentoDespesaPO.inputValorUnitarioDespesa);
            novoOrcamentoDespesaPO.inputValorUnitarioDespesa.sendKeys(String.valueOf(valorUnitarioDespesa));
    
            novoOrcamentoDespesaPO.botaoSalvarDespesa.click();
            novoOrcamentoDespesaPO.botaoCancelarDespesa.click();
    }
    //#endregion
}

