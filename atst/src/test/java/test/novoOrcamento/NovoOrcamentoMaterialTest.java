package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.MaterialBuilder;
import page.novoOrcamento.NovoOrcamentoMaterialPO;
import test.BaseTest;

/** Classe de testes para adicionar um material dentro de Novo Orcamento.*/
public class NovoOrcamentoMaterialTest extends BaseTest {

	private static NovoOrcamentoMaterialPO materialPO;
	private static MaterialBuilder materialBuilder;
	private static String identificadorEmpresa = "1";

	/** Metodo para criar instancia a ser usada em todos os testes. */
	@BeforeClass
	public static void iniciarTeste() {
		materialPO = new NovoOrcamentoMaterialPO(driver);
		materialBuilder = new MaterialBuilder(materialPO);
	}

	/** Testa a inclusao de um novo material sem acrescimo e sem desconto.*/
	@Test
	public void TC001_deve_adicionar_material() {
		materialPO.navegarParaNovoOrcamentoMaterial(identificadorEmpresa);
		
		materialBuilder
			.comIdentificador("003832")
			.comSaidaPrevista("04/04/2022")
			.comQuantidade(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarMaterial();
		
		Assert.assertEquals("003832 - OCULOS AMPLA VISAO", materialPO.nomePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("1", materialPO.quantidadePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("R$ 100,00", materialPO.valorTotalMaterialAdicionado.getText());
	}

	/** Testa a edicao de um material. */
	@Test
	public void TC002_deve_editar_material() {
		materialPO.navegarParaNovoOrcamentoMaterial(identificadorEmpresa);
		
		materialBuilder
			.comIdentificador("000109")
			.comSaidaPrevista("04/04/2022")
			.comQuantidade(1)
			.comValorUnitario(1000.0)
			.adicionarMaterial();
		
		materialPO.aguardarVisibilidadeDoElemento(driver, 10, materialPO.botaoEditarMaterial);
		materialPO.botaoEditarMaterial.click();
		materialPO.botaoLimparInputMaterial.click();
		
		materialBuilder
			.comIdentificador("003832")
			.comSaidaPrevista("04/04/2022")
			.comQuantidade(2)
			.comValorUnitario(1000.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarMaterial();
		
		Assert.assertEquals("003832 - OCULOS AMPLA VISAO", materialPO.nomePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("2", materialPO.quantidadePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("R$ 200,00", materialPO.valorTotalMaterialAdicionado.getText());
	}

	/** Testa a inclusao de um novo material com acrescimo e sem desconto.*/
	@Test
	public void TC003_deve_adicionar_material_com_acrescimo() {
		materialPO.navegarParaNovoOrcamentoMaterial(identificadorEmpresa);
		
		materialBuilder
			.comIdentificador("003832")
			.comSaidaPrevista("04/04/2022")
			.comQuantidade(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(500.0)
			.comDesconto(0.0)
			.adicionarMaterial();

		Assert.assertEquals("003832 - OCULOS AMPLA VISAO", materialPO.nomePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("1", materialPO.quantidadePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("R$ 150,00", materialPO.valorTotalMaterialAdicionado.getText());
	}

	/** Testa a inclusao de um novo material sem acrescimo e com desconto.*/
	@Test
	public void TC004_deve_adicionar_material_com_desconto() {
		materialPO.navegarParaNovoOrcamentoMaterial(identificadorEmpresa);
		
		materialBuilder
			.comIdentificador("003832")
			.comSaidaPrevista("04/04/2022")
			.comQuantidade(1)
			.comValorUnitario(1000.0)
			.comDesconto(500.0)
			.comAcrescimo(0.0)
			.adicionarMaterial();

		Assert.assertEquals("003832 - OCULOS AMPLA VISAO", materialPO.nomePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("1", materialPO.quantidadePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("R$ 50,00", materialPO.valorTotalMaterialAdicionado.getText());
	}

	/** Testa a inclusao de um novo material com acrescimo e com desconto.*/
	@Test
	public void TC005_deve_adicionar_material_com_acrescimo_com_desconto() {
		materialPO.navegarParaNovoOrcamentoMaterial(identificadorEmpresa);
		
		materialBuilder
			.comIdentificador("003832")
			.comSaidaPrevista("04/04/2022")
			.comQuantidade(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(1000.0)
			.comDesconto(500.0)
			.adicionarMaterial();

		Assert.assertEquals("003832 - OCULOS AMPLA VISAO", materialPO.nomePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("1", materialPO.quantidadePrimeiroMaterialAdicionado.getText());
		Assert.assertEquals("R$ 150,00", materialPO.valorTotalMaterialAdicionado.getText());
	}
}
