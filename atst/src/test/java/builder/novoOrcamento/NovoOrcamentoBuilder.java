package builder.novoOrcamento;

import page.novoOrcamento.NovoOrcamentoEquipamentoPO;
import page.novoOrcamento.NovoOrcamentoMaterialPO;
import page.novoOrcamento.NovoOrcamentoServicoPO;

/** Classe builder para adicionar itens em um novo orcamento.*/
public class NovoOrcamentoBuilder {

    /**Enum para definir o tipo dos itens a serem adicionados no novo orcamento*/
	public enum Tipos { EQUIPAMENTO, SERVICO, MATERIAL; }

    //#region Regiao dos atributos.

    private NovoOrcamentoServicoPO novoOrcamentoServicoPO;
    private NovoOrcamentoEquipamentoPO novoOrcamentoEquipamentoPO;
    private NovoOrcamentoMaterialPO novoOrcamentoMaterialPO;
    private Tipos tipo; 
    //#endregion
    
    //#region Regiao dos builders.

    /**
     * Adiciona um tipo de produto ao orcamento, podendo ser EQUIPAMENTO, SERVICO ou MATERIAL.
     * @param tipo Tipo que sera adicionado.
     * @return Retorna o proprio NovoOrcamentoPO.
     */
	public NovoOrcamentoBuilder comTipo(Tipos tipo){
		this.tipo = tipo;
		return this;
	}
    //#endregion

    //#region Regiao dos metodos.

    /**Método para adicionar itens em novo orcamento.*/
	public void adicionarItem(){
		ServicoBuilder servicoBuilder = new ServicoBuilder(novoOrcamentoServicoPO);
		MaterialBuilder materialBuilder = new MaterialBuilder(novoOrcamentoMaterialPO);
		EquipamentoBuilder equipamentoBuilder = new EquipamentoBuilder(novoOrcamentoEquipamentoPO);
		
		if(tipo == Tipos.SERVICO){
            servicoBuilder.adicionarServico();
       }else if(tipo == Tipos.MATERIAL){
			materialBuilder.adicionarMaterial();
       } else {
            // Se não passar um tipo, eu adiciono por default o equipamento.
            equipamentoBuilder.adicionarEquipamento();
       }
	}
    //#endregion
}
