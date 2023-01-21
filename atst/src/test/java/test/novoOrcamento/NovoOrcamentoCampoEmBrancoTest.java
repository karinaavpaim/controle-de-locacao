package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import page.OrcamentoPO;
import page.novoOrcamento.NovoOrcamentoDespesaPO;
import page.novoOrcamento.NovoOrcamentoEquipamentoPO;
import page.novoOrcamento.NovoOrcamentoMaterialPO;
import page.novoOrcamento.NovoOrcamentoPO;
import page.novoOrcamento.NovoOrcamentoRepassePO;
import page.novoOrcamento.NovoOrcamentoServicoPO;
import test.BaseTest;

/** Classe de testes para verificar os campos em branco da tela de novo orcamento. */
public class NovoOrcamentoCampoEmBrancoTest extends BaseTest {

	private static OrcamentoPO orcamentoPO;
	private static NovoOrcamentoPO novoOrcamentoPO;
	private static NovoOrcamentoEquipamentoPO equipamentoPO;
	private static NovoOrcamentoServicoPO servicoPO;
	private static NovoOrcamentoMaterialPO materialPO;
	private static NovoOrcamentoDespesaPO despesaPO;
	private static NovoOrcamentoRepassePO repassePO;
	private static String identificadorEmpresa = "1";

	/** Metodo para criar a instancia de NovoOrcamentoPO a ser utilizada em todos os testes. */
	@BeforeClass
	public static void iniciarTeste() {
		novoOrcamentoPO = new NovoOrcamentoPO(driver);	
	}

	/**
	 * Testa as mensagens de preenchimento obrigatorio na tela de Novo Orcamento.
	 * @return mensagem "Campo Obrigatorio".
	 * @return mensagem "Cliente e data de referência são campos obrigatórios".
	 * @return mensagem "O orçamento deve ter pelo menos um item do tipo equipamento ou serviço ou material".
	 * @return mensagem "Orçamento está incompleto para operação.\nConfirme se todos os campos obrigatórios foram preenchidos.".
	 */
	@Test
	public void TC001_deve_testar_mensagem_de_campos_em_branco() {
		novoOrcamentoPO.navegarParaNovoOrcamento(identificadorEmpresa);			
		
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();

		Assert.assertEquals("Cliente e data de referência são campos obrigatórios", novoOrcamentoPO.mensagemClienteEDataDeReferenciaObrigatorio.getText());
		Assert.assertEquals("Campo obrigatório", novoOrcamentoPO.mensagemClienteNovoOrcamentoObrigatorio.getText());
		Assert.assertEquals("O orçamento deve ter pelo menos um item do tipo equipamento ou serviço ou material", novoOrcamentoPO.mensagemItemObrigatorio.getText());
		Assert.assertEquals("Orçamento está incompleto para operação.\nConfirme se todos os campos obrigatórios foram preenchidos.", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
	}

	/**
	 * Testa as mensagens de preenchimento obrigatorio na tela de adicionar equipamento.
	 * @return mensagem "Campo Obrigatorio".
	 */
	@Test
	public void TC002_deve_testar_mensagem_de_campos_em_branco_equipamento() {
		equipamentoPO = new NovoOrcamentoEquipamentoPO(driver);

		equipamentoPO.navegarParaNovoOrcamentoEquipamento(identificadorEmpresa);
		
		equipamentoPO.limparCampoInput(equipamentoPO.inputQuantidadeDiariaEquipamento);
		equipamentoPO.limparCampoInput(equipamentoPO.inputQuantidadeEquipamento);
		
		equipamentoPO.botaoSalvarEquipamento.click();
		equipamentoPO.aguardarVisibilidadeDoElemento(driver, 2, equipamentoPO.mensagemEquipamentoObrigatorio);
		
		Assert.assertEquals("Campo obrigatório", equipamentoPO.mensagemEquipamentoObrigatorio.getText());
		Assert.assertEquals("Campo obrigatório", equipamentoPO.mensagemQuantidadeDiariaEquipamentoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", equipamentoPO.mensagemQuantidadeEquipamentoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", equipamentoPO.mensagemPrevisaoInicialEquipamentoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", equipamentoPO.mensagemPrevisaoFinalEquipamentoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", equipamentoPO.mensagemValorUnitarioEquipamentoObrigatorio.getText());

		equipamentoPO.botaoCancelarEquipamento.click();
	}

	/**
	 * Testa as mensagens de preenchimento obrigatorio na tela de adicionar servico.
	 * @return mensagem "Campo Obrigatorio".
	 */
	@Test
	public void TC003_deve_testar_mensagem_de_campos_em_branco_servico() {
		servicoPO = new NovoOrcamentoServicoPO(driver);

		servicoPO.navegarParaNovoOrcamentoServico(identificadorEmpresa);

		servicoPO.limparCampoInput(servicoPO.inputQuantidadeDiariaServico);
		servicoPO.limparCampoInput(servicoPO.inputQuantidadeServico);

		servicoPO.botaoSalvarServico.click();
		servicoPO.aguardarVisibilidadeDoElemento(driver, 2, servicoPO.mensagemServicoObrigatorio);

		Assert.assertEquals("Campo obrigatório", servicoPO.mensagemServicoObrigatorio.getText());
		Assert.assertEquals("Campo obrigatório", servicoPO.mensagemQuantidadeServicoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", servicoPO.mensagemQuantidadeDiariaServicoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", servicoPO.mensagemPrevisaoInicialServicoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", servicoPO.mensagemPrevisaoFinalServicoObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", servicoPO.mensagemValorUnitarioServicoObrigatorio.getText());

		servicoPO.botaoCancelarServico.click();
	}

	/**
	 * Testa as mensagens de preenchimento obrigatorio na tela de adicionar material.
	 * @return mensagem "Campo Obrigatorio".
	 */
	@Test
	public void TC004_deve_testar_mensagem_de_campos_em_branco_material() {
		materialPO = new NovoOrcamentoMaterialPO(driver);
		
		materialPO.navegarParaNovoOrcamentoMaterial(identificadorEmpresa);

		materialPO.limparCampoInput(materialPO.inputQuantidadeMaterial);
		
		materialPO.botaoSalvarMaterial.click();
		materialPO.aguardarVisibilidadeDoElemento(driver, 2, materialPO.mensagemMaterialObrigatorio);
		
		Assert.assertEquals("Campo obrigatório", materialPO.mensagemMaterialObrigatorio.getText());
		Assert.assertEquals("Campo obrigatório", materialPO.mensagemQuantidadeMaterialObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", materialPO.inputPrevisaoSaidaMaterialObrigatoria.getText());
		Assert.assertEquals("Campo obrigatório", materialPO.inputValorUnitarioMaterialObrigatorio.getText());

		materialPO.botaoCancelarMaterial.click();
	}

	/**
	 * Testa as mensagens de preenchimento obrigatorio na tela de adicionar despesa.
	 * @return mensagem "Campo Obrigatorio".
	 * @return mensagem "Selecione uma despesa - Quantidade deve ser maior que zero - Valor deve ser maior que R$ 0,00".
	 */
	@Test
	public void TC005_deve_testar_mensagem_de_campos_em_branco_despesa() {
		despesaPO = new NovoOrcamentoDespesaPO(driver);
			
		novoOrcamentoPO.inputEmpresa.sendKeys(identificadorEmpresa);
		novoOrcamentoPO.selecionarEmpresa.click();
		novoOrcamentoPO.aguardarCarregamentoDaPagina(novoOrcamentoPO.carregamentoDaPagina);
		novoOrcamentoPO.botaoNovoOrcamento.click();

		novoOrcamentoPO.navegarParaDespesa();
		despesaPO.limparCampoInput(despesaPO.inputQuantidadeDespesa);
		
		despesaPO.botaoSalvarDespesa.click();
		despesaPO.aguardarVisibilidadeDoElemento(driver, 2, despesaPO.mensagemQuantidadeObrigatoria);
				
		Assert.assertEquals("Campo obrigatório", despesaPO.mensagemQuantidadeObrigatoria.getText());
		Assert.assertEquals("Selecione uma despesa - Quantidade deve ser maior que zero - Valor deve ser maior que R$ 0,00", despesaPO.mensagemCampoObrigatorio.getText());

		despesaPO.botaoCancelarDespesa.click();
	}

	/**
	 * Testa as mensagens de preenchimento obrigatorio na tela de adicionar repasse.
	 * @return mensagem "Campo Obrigatorio".
	 * @return mensagem "Preencha os campos obrigatórios: Pessoa para repasse.".
	 */
	@Test
	public void TC006_deve_testar_mensagem_de_campos_em_branco_repasse() {
		repassePO = new NovoOrcamentoRepassePO(driver);
		
		repassePO.navegarParaNovoOrcamentoRepasse(identificadorEmpresa);
		
		repassePO.botaoSalvarRepasse.click();
		repassePO.aguardarVisibilidadeDoElemento(driver, 2, repassePO.mensagemPessoaRepasseObrigatoria);
		
		Assert.assertEquals("Campo obrigatório", repassePO.mensagemPessoaRepasseObrigatoria.getText());
		Assert.assertEquals("Preencha os campos obrigatórios: Pessoa para repasse.", repassePO.mensagemCampoObrigatorioRepasse.getText());

		repassePO.botaoCancelarRepasse.click();
	}

	/**
	 * Testa a mensagem para preenchimento obrigatorio de uma empresa para gerar um novo orcamento.
	 * @return mensagem "Informe a empresa de trabalho.\nEmpresa é um campo obrigatório.".
	 */
	@Test
	public void TC007_deve_testar_mensagem_de_campo_em_branco_identificador_empresa() {
		orcamentoPO = new OrcamentoPO(driver);
		
		orcamentoPO.navegarParaOrcamento();
		
		novoOrcamentoPO.botaoLimparInputEmpresa.click();
		novoOrcamentoPO.aguardarCarregamentoDaPagina(novoOrcamentoPO.carregamentoDaPagina);
		
		novoOrcamentoPO.botaoNovoOrcamento.click();
	
		Assert.assertEquals("Informe a empresa de trabalho.\nEmpresa é um campo obrigatório.", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
	}
}
