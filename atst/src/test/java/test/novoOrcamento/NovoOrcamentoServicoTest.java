package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.ServicoBuilder;
import page.novoOrcamento.NovoOrcamentoServicoPO;
import test.BaseTest;

/** Classe de testes para adicionar um servico dentro de Novo Orcamento. */
public class NovoOrcamentoServicoTest extends BaseTest {

	private static NovoOrcamentoServicoPO servicoPO;
	private static ServicoBuilder servicoBuilder;
	private static String identificadorEmpresa = "1";
	
	/** Metodo para criar instancia a ser utilizada em todos os testes. */
	@BeforeClass
	public static void iniciarTeste() {
		servicoPO = new NovoOrcamentoServicoPO(driver);
		servicoBuilder = new ServicoBuilder(servicoPO);
	}

	/** Testa a inclusao de um novo servico sem acrescimo e sem desconto. */
	@Test
	public void TC001_deve_adicionar_servico() {
		servicoPO.navegarParaNovoOrcamentoServico(identificadorEmpresa);
		
		servicoBuilder
			.comIdentificador("001563")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarServico();
		
		Assert.assertEquals("001563 - SERVIÇO DE TRANSPORTE", servicoPO.nomePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("04/04/2022", servicoPO.dataPeriodoInicialPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("31/10/2022", servicoPO.dataPeriodoFinalPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.quantidadePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.diariasPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("R$ 100,00", servicoPO.valorTotalServicoAdicionado.getText());
	}
	
	/** Testa a edicao de um servico. */
	@Test
	public void TC002_deve_editar_servico() {
		servicoPO.navegarParaNovoOrcamentoServico(identificadorEmpresa);
		
		servicoBuilder
			.comIdentificador("001563")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarServico();
		
		servicoPO.botaoEditarServico.click();
		
		aguardarElemento(driver, 10);
		servicoPO.botaoLimparInputServico.click();		
		
		servicoBuilder
			.comIdentificador("001138")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(10)
			.comDiaria(3)
			.comValorUnitario(500.0)
			.comAcrescimo(0.0)
			.comDesconto(0.0)
			.adicionarServico();
		
		Assert.assertEquals("001138 - SERVIÇOS DE MANUTENÇÃO EM INFORMÁTICA", servicoPO.nomePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("04/04/2022", servicoPO.dataPeriodoInicialPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("31/10/2022", servicoPO.dataPeriodoFinalPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("10", servicoPO.quantidadePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("3", servicoPO.diariasPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("R$ 1.500,00", servicoPO.valorTotalServicoAdicionado.getText());
	}
	
	/** Testa a inclusao de um novo servico com acrescimo e sem desconto. */
	@Test
	public void TC003_deve_adicionar_servico_com_acrescimo() {
		servicoPO.navegarParaNovoOrcamentoServico(identificadorEmpresa);
		
		servicoBuilder
			.comIdentificador("001138")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(300.0)
			.comDesconto(0.0)
			.adicionarServico();

		Assert.assertEquals("001138 - SERVIÇOS DE MANUTENÇÃO EM INFORMÁTICA", servicoPO.nomePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.quantidadePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.diariasPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("R$ 130,00", servicoPO.valorTotalServicoAdicionado.getText());
	}

	/** Testa a inclusao de um novo servico sem acrescimo e com desconto. */
	@Test
	public void TC004_deve_adicionar_servico_com_desconto() {
		servicoPO.navegarParaNovoOrcamentoServico(identificadorEmpresa);
		
		servicoBuilder
			.comIdentificador("001138")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comDesconto(300.0)
			.comAcrescimo(0.0)
			.adicionarServico();

		Assert.assertEquals("001138 - SERVIÇOS DE MANUTENÇÃO EM INFORMÁTICA", servicoPO.nomePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.quantidadePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.diariasPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("R$ 70,00", servicoPO.valorTotalServicoAdicionado.getText());
	}

	/** Testa a inclusao de um novo servico com acrescimo e com desconto. */
	@Test
	public void TC005_deve_adicionar_servico_com_acrescimo_com_desconto() {
		servicoPO.navegarParaNovoOrcamentoServico(identificadorEmpresa);
		
		servicoBuilder
			.comIdentificador("001138")
			.comPrevisaoIncial("04/04/2022")
			.comPrevisaoFinal("31/10/2022")
			.comQuantidade(1)
			.comDiaria(1)
			.comValorUnitario(1000.0)
			.comAcrescimo(500.0)
			.comDesconto(100.0)
			.adicionarServico();

		Assert.assertEquals("001138 - SERVIÇOS DE MANUTENÇÃO EM INFORMÁTICA", servicoPO.nomePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.quantidadePrimeiroServicoAdicionado.getText());
		Assert.assertEquals("1", servicoPO.diariasPrimeiroServicoAdicionado.getText());
		Assert.assertEquals("R$ 140,00", servicoPO.valorTotalServicoAdicionado.getText());
	}
}
