package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import builder.novoOrcamento.DespesaBuilder;
import builder.novoOrcamento.EquipamentoBuilder;
import builder.novoOrcamento.MaterialBuilder;
import builder.novoOrcamento.ServicoBuilder;
import page.OrcamentoPO;
import page.OrcamentoPO.EnumOpcoes;
import page.novoOrcamento.NovoOrcamentoDespesaPO;
import page.novoOrcamento.NovoOrcamentoEquipamentoPO;
import page.novoOrcamento.NovoOrcamentoMaterialPO;
import page.novoOrcamento.NovoOrcamentoPO;
import page.novoOrcamento.NovoOrcamentoServicoPO;
import test.BaseTest;
import util.TabelaUtil;

/** Classe para testar a adicao de um novo orcamento. */
public class NovoOrcamentoAdicionarOrcamentoTest extends BaseTest {

	private static NovoOrcamentoPO novoOrcamentoPO;
	private static OrcamentoPO orcamentoPO;
	private static NovoOrcamentoEquipamentoPO equipamentoPO;
	private static NovoOrcamentoServicoPO servicoPO;
	private static NovoOrcamentoMaterialPO materialPO;
	private static NovoOrcamentoDespesaPO despesaPO;
	private static DespesaBuilder despesaBuilder;
	private static EquipamentoBuilder equipamentoBuilder;
	private static MaterialBuilder materialBuilder;
	private static ServicoBuilder servicoBuilder;
	private static TabelaUtil tabelaUtil;
	private static String identificadorEmpresa = "1";
	private static String identificadorCliente = "000015 -";
	private static String identificadorPessoaDeContato = "KARINA";
	private static String dataDeReferencia = "03/03/2022";
	private static String previsaoDeInicio = "04/04/2022";
	private static String previsaoDeTermino = "31/10/2022";
	private static String objetivo = "Teste";
	private static String observacao = "Teste";
	private static Double valorUnitario = 1000.0;
	private static String numeroOrcamentoNovo;

	/** Metodo para criar as instancias a serem utilizadas em todos os testes da classe. */
	@BeforeClass
	public static void iniciarTeste() {
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		orcamentoPO = new OrcamentoPO(driver);
		tabelaUtil = new TabelaUtil(driver);
		equipamentoPO = new NovoOrcamentoEquipamentoPO(driver);
		materialPO = new NovoOrcamentoMaterialPO(driver);
		servicoPO = new NovoOrcamentoServicoPO(driver);
		despesaPO = new NovoOrcamentoDespesaPO(driver);
		despesaBuilder = new DespesaBuilder(despesaPO);
		equipamentoBuilder = new EquipamentoBuilder(equipamentoPO);
		servicoBuilder = new ServicoBuilder(servicoPO);
		materialBuilder = new MaterialBuilder(materialPO);
	}

	/** Testa a adicao de um orcamento com equipamento. */
	@Test
	public void TC001_deve_adicionar_orcamento_com_equipamento() {
		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		novoOrcamentoPO.pessoaContato(identificadorPessoaDeContato);
		
		novoOrcamentoPO.botaoLimparDataReferenciaNovoOrcamento.click();
		
		novoOrcamentoPO.selecionarDataCalendario(dataDeReferencia, novoOrcamentoPO.inputDataReferenciaNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeInicio, novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeTermino, novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);
	
		Assert.assertEquals("03/03/2022", novoOrcamentoPO.inputDataReferenciaNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("04/04/2022", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("31/10/2022", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));

		novoOrcamentoPO.selecionarAdicionalPersonalizado("OUTROS");

		novoOrcamentoPO.objetivoNovoOrcamento(objetivo);
		novoOrcamentoPO.observacaoNovoOrcamento(observacao);

		novoOrcamentoPO.navegarParaEquipamento();
		
		equipamentoBuilder
			.comIdentificador("004509")
			.comValorUnitario(valorUnitario)
			.adicionarEquipamento();
				
		Assert.assertEquals("R$ 100,00", equipamentoPO.valorTotalEquipamentoAdicionado.getText());
		Assert.assertEquals("R$ 100,00", novoOrcamentoPO.resumoValorTotalNovoOrcamento.getText());

		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();
		
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento "+ numeroOrcamentoNovo +" cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testa a adicao de um orcamento com servico. */
	@Test
	public void TC002_deve_adicionar_orcamento_com_servico() {
		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		novoOrcamentoPO.pessoaContato(identificadorPessoaDeContato);
		
		novoOrcamentoPO.botaoLimparDataReferenciaNovoOrcamento.click();
		
		novoOrcamentoPO.selecionarDataCalendario(dataDeReferencia, novoOrcamentoPO.inputDataReferenciaNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeInicio, novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeTermino, novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("03/03/2022", novoOrcamentoPO.inputDataReferenciaNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("04/04/2022", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("31/10/2022", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));

		novoOrcamentoPO.selecionarAdicionalPersonalizado("OUTROS");

		novoOrcamentoPO.objetivoNovoOrcamento(objetivo);
		novoOrcamentoPO.observacaoNovoOrcamento(observacao);

		novoOrcamentoPO.navegarParaServico();
		servicoBuilder
			.comIdentificador("001563")
			.comValorUnitario(valorUnitario)
			.adicionarServico();
		
		Assert.assertEquals("R$ 100,00", servicoPO.valorTotalServicoAdicionado.getText());
		Assert.assertEquals("R$ 100,00", novoOrcamentoPO.resumoValorTotalNovoOrcamento.getText());
		
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();
		
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento "+ numeroOrcamentoNovo +" cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testar a adicao de um orcamento com material. */
	@Test
	public void TC003_deve_adicionar_orcamento_com_material() {
		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		novoOrcamentoPO.pessoaContato(identificadorPessoaDeContato);
		
		novoOrcamentoPO.botaoLimparDataReferenciaNovoOrcamento.click();
		
		novoOrcamentoPO.selecionarDataCalendario(dataDeReferencia, novoOrcamentoPO.inputDataReferenciaNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeInicio, novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeTermino, novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);

		Assert.assertEquals("03/03/2022", novoOrcamentoPO.inputDataReferenciaNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("04/04/2022", novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento.getAttribute("value"));
		Assert.assertEquals("31/10/2022", novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento.getAttribute("value"));

		novoOrcamentoPO.selecionarAdicionalPersonalizado("OUTROS");

		novoOrcamentoPO.objetivoNovoOrcamento(objetivo);
		novoOrcamentoPO.observacaoNovoOrcamento(observacao);

		novoOrcamentoPO.navegarParaMaterial();
	
		materialBuilder
			.comIdentificador("003832")
			.comValorUnitario(valorUnitario)
			.adicionarMaterial();
			
		Assert.assertEquals("R$ 100,00", materialPO.valorTotalMaterialAdicionado.getText());
		Assert.assertEquals("R$ 100,00", novoOrcamentoPO.resumoValorTotalNovoOrcamento.getText());

		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();
		
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Orçamento "+ numeroOrcamentoNovo +" cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/** Testa a verificacao dos valores dos itens adicionados com os valores do resumo. */
	@Test
	public void TC004_deve_conferir_resumo_do_orcamento() {
		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);
		
		novoOrcamentoPO.selecionarClienteNovoOrcamento(identificadorCliente);
		novoOrcamentoPO.inputPessoaContatoNovoOrcamento.sendKeys("ANA");
		
		novoOrcamentoPO.botaoLimparDataReferenciaNovoOrcamento.click();
		novoOrcamentoPO.selecionarDataCalendario(dataDeReferencia, novoOrcamentoPO.inputDataReferenciaNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeInicio, novoOrcamentoPO.inputPrevisaoInicioNovoOrcamento);
		novoOrcamentoPO.selecionarDataCalendario(previsaoDeTermino, novoOrcamentoPO.inputPrevisaoTerminoNovoOrcamento);
		
		novoOrcamentoPO.selecionarAdicionalPersonalizado("OUTROS");
		novoOrcamentoPO.objetivoNovoOrcamento(objetivo);
		novoOrcamentoPO.observacaoNovoOrcamento(observacao);

		novoOrcamentoPO.navegarParaEquipamento();

		equipamentoBuilder
			.comIdentificador("004509")
			.comValorUnitario(valorUnitario)
			.comDesconto(200.00)
			.comAcrescimo(500.00)
			.adicionarEquipamento();
		
		novoOrcamentoPO.navegarParaMaterial();

		materialBuilder
			.comIdentificador("003832")
			.comValorUnitario(valorUnitario)
			.comDesconto(500.00)
			.comAcrescimo(50.00)
			.adicionarMaterial();

		novoOrcamentoPO.navegarParaServico();
		
		servicoBuilder
			.comIdentificador("001563")
			.comValorUnitario(valorUnitario)
			.comDesconto(200.00)
			.comAcrescimo(100.00)
			.adicionarServico();
	
		novoOrcamentoPO.navegarParaDespesa();
		
		despesaBuilder
			.comIdentificador("000209")
			.comQuantidade(2)
			.comValorUnitario(valorUnitario)
			.adicionarDespesa();
		
		Assert.assertEquals("R$ 130,00", novoOrcamentoPO.resumoValorEquipamentoNovoOrcamento.getText());
		Assert.assertEquals("R$ 55,00", novoOrcamentoPO.resumoValorMaterialNovoOrcamento.getText());
		Assert.assertEquals("R$ 90,00", novoOrcamentoPO.resumoValorServicoNovoOrcamento.getText());
		Assert.assertEquals("R$ 200,00", novoOrcamentoPO.resumoValorDespesaNovoOrcamento.getText());
		Assert.assertEquals("R$ 65,00", novoOrcamentoPO.resumoValorAcrescimoNovoOrcamento.getText());
		Assert.assertEquals("R$ 90,00", novoOrcamentoPO.resumoValorDescontoNovoOrcamento.getText());
		Assert.assertEquals("R$ 475,00", novoOrcamentoPO.resumoValorTotalNovoOrcamento.getText());
	}
}
