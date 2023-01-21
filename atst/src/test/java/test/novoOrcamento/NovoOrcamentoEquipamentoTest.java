package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.EquipamentoBuilder;
import page.novoOrcamento.NovoOrcamentoEquipamentoPO;
import test.BaseTest;

/** Classe de testes para adicionar um equipamento dentro de Novo Orcamento.*/
public class NovoOrcamentoEquipamentoTest extends BaseTest {

	private static NovoOrcamentoEquipamentoPO equipamentoPO;
	private static EquipamentoBuilder equipamentoBuilder;
	private static String identificadorEmpresa = "1";

	/** Metodo para criar a instancia a ser usada em todos os testes. */
	@BeforeClass
	public static void iniciarTeste() {
		equipamentoPO = new NovoOrcamentoEquipamentoPO(driver);
		equipamentoBuilder = new EquipamentoBuilder(equipamentoPO);
	}

	/** Testa a inclusao de um novo equipamento sem acrescimo e sem desconto. */
	@Test
	public void TC001_deve_adicionar_equipamento() {
		equipamentoPO.navegarParaNovoOrcamentoEquipamento(identificadorEmpresa);
		
		equipamentoBuilder
			.comIdentificador("004509")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarEquipamento();
		
		Assert.assertEquals("004509 - GESSO COLA 1KG", equipamentoPO.nomePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("04/04/2022", equipamentoPO.dataPeriodoInicialPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("31/10/2022", equipamentoPO.dataPeriodoFinalPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("1", equipamentoPO.quantidadePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("1", equipamentoPO.diariasPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("R$ 100,00", equipamentoPO.valorTotalEquipamentoAdicionado.getText());
	}

	/** Testa a edicao de um equipamento adicionado. */
	@Test
	public void TC002_deve_editar_equipamento() {
		equipamentoPO.navegarParaNovoOrcamentoEquipamento(identificadorEmpresa);
		
		equipamentoBuilder
			.comIdentificador("004509")
			.comPrevisaoIncial("01/01/2020")
			.comPrevisaoFinal("02/02/2021")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(500.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarEquipamento();

		equipamentoPO.botaoEditarEquipamento.click();
		equipamentoPO.botaoLimparEquipamento.click();
		
		equipamentoBuilder
			.comIdentificador("000109")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(10)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.adicionarEquipamento();
		
		Assert.assertEquals("000109 - CERTIFICADO TAMANHO A4 PAPEL OFFSET COLORIDO", equipamentoPO.nomePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("04/04/2022", equipamentoPO.dataPeriodoInicialPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("31/10/2022", equipamentoPO.dataPeriodoFinalPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("10", equipamentoPO.quantidadePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("1", equipamentoPO.diariasPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("R$ 1.000,00", equipamentoPO.valorTotalEquipamentoAdicionado.getText());
	}

	/** Testa a inclusao de um novo equipamento com acrescimo e sem desconto. */
	@Test
	public void TC003_deve_adicionar_equipamento_com_acrescimo() {
		equipamentoPO.navegarParaNovoOrcamentoEquipamento(identificadorEmpresa);
		
		equipamentoBuilder
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(100.0)
			.comDesconto(0.0)
			.adicionarEquipamento();

		Assert.assertEquals("1", equipamentoPO.quantidadePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("1", equipamentoPO.diariasPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("R$ 110,00", equipamentoPO.valorTotalEquipamentoAdicionado.getText());
	}

	/** Testa a inclusao de um novo equipamento com desconto e sem acrescimo. */
	@Test
	public void TC004_deve_adicionar_equipamento_com_desconto() {
		equipamentoPO.navegarParaNovoOrcamentoEquipamento(identificadorEmpresa);
		
		equipamentoBuilder
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(0.0)
			.comDesconto(100.0)
			.adicionarEquipamento();

		Assert.assertEquals("1", equipamentoPO.quantidadePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("1", equipamentoPO.diariasPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("R$ 90,00", equipamentoPO.valorTotalEquipamentoAdicionado.getText());
	}

	/** Testa a inclusao de um novo equipamento com desconto e com acrescimo. */
	@Test
	public void TC005_deve_adicionar_equipamento_com_acrescimo_com_desconto() {
		equipamentoPO.navegarParaNovoOrcamentoEquipamento(identificadorEmpresa);
		
		equipamentoBuilder
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(500.0)
			.comDesconto(100.0)
			.adicionarEquipamento();

		Assert.assertEquals("1", equipamentoPO.quantidadePrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("1", equipamentoPO.diariasPrimeiroEquipamentoAdicionado.getText());
		Assert.assertEquals("R$ 140,00", equipamentoPO.valorTotalEquipamentoAdicionado.getText());
	}
}
