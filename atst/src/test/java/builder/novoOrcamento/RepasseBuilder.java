package builder.novoOrcamento;

import page.novoOrcamento.NovoOrcamentoRepassePO;

/** Classe builder para adicionar repasse em um novo orcamento.*/
public class RepasseBuilder {

    //#region região dos atributos.

    private NovoOrcamentoRepassePO novoOrcamentoRepassePO;
	private String identificadorPessoaRepasse = "C.S.E.";
	private Double aliquotaFaturamento = 100.0;
	private Double aliquotaDuplicata = 20.0;
    //#endregion

    //#region região dos contrutores.

    /**
    * Construtor da classe.
    * @param novoOrcamentoRepassePO PageObject da tela adicionar repasse.
    */
    public RepasseBuilder(NovoOrcamentoRepassePO novoOrcamentoRepassePO){
        this.novoOrcamentoRepassePO = novoOrcamentoRepassePO;
    }
    //#endregion

    //#region região dos builders.

    /**
     * Altera o Identificador que será utilizado na busca.
     * @param idenetificadorPessoaRepasse Identificador da pessoa de repasse.
     * @return Retorna a propria classe.
     */
    public RepasseBuilder comPessoaRepasse(String idenetificadorPessoaRepasse){
        this.identificadorPessoaRepasse = idenetificadorPessoaRepasse;
        return this;
    }
    
    /**
     * Altera aliquota de faturamento.
     * @param aliquotaFaturamento Aliquota de faturamento.
     * @return Retorna a propria classe.
     */
    public RepasseBuilder comAliquotaFaturamento(Double aliquotaFaturamento){
        this.aliquotaFaturamento = aliquotaFaturamento;
        return this;
    }

    /**
     * Altera aliquota de duplicata.
     * @param aliquotaDuplicata Aliquota de duplicata.
     * @return Retorna a propria classe.
     */
    public RepasseBuilder comAliquotaDuplicata(Double aliquotaDuplicata){
        this.aliquotaDuplicata = aliquotaDuplicata;
        return this;
    }
    //#endregion

    //#region região dos métodos.

    public void adicionarRepasse(){
        novoOrcamentoRepassePO.selecionarPessoaRepasse(identificadorPessoaRepasse);
		
        novoOrcamentoRepassePO.limparCampoInput(novoOrcamentoRepassePO.inputAliquotaFaturamentoRepasse);
        novoOrcamentoRepassePO.limparCampoInput(novoOrcamentoRepassePO.inputAliquotaDuplicataRepasse);
		novoOrcamentoRepassePO.inputAliquotaFaturamentoRepasse.sendKeys(String.valueOf(aliquotaFaturamento));
		novoOrcamentoRepassePO.inputAliquotaDuplicataRepasse.sendKeys(String.valueOf(aliquotaDuplicata));
		
        novoOrcamentoRepassePO.botaoSalvarRepasse.click();
    }
    //#endregion
}
