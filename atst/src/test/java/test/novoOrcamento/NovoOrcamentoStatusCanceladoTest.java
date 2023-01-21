package test.novoOrcamento;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import page.OrcamentoPO;
import page.OrcamentoPO.EnumOpcoes;
import page.novoOrcamento.NovoOrcamentoPO;
import test.BaseTest;
import util.TabelaUtil;

/**Classe de testes para realizar acoes dos orcamentos cancelados. */
public class NovoOrcamentoStatusCanceladoTest extends BaseTest {

	private static NovoOrcamentoPO novoOrcamentoPO;
	private static OrcamentoPO orcamentoPO;
	private static TabelaUtil tabelaUtil;
	private static String identificadorEmpresa = "1";
	private static String identificadorCliente = "000015 -";
	private static String numeroOrcamentoNovo;
	
	/** Metodo para navegar para novo orcamento. */
	@BeforeClass
	public static void iniciarTeste() {
		tabelaUtil = new TabelaUtil(driver);
		novoOrcamentoPO = new NovoOrcamentoPO(driver);
		orcamentoPO = new OrcamentoPO(driver);
	}

	/** Testa o cancelamento de um novo orcamento.*/
	@Test
	public void TC001_deve_cancelar_novo_orcamento() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);
						
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.CANCELAR);
		
		Assert.assertEquals("Confirma o cancelamento do orçamento: "+ numeroOrcamentoNovo +"?", novoOrcamentoPO.mensagemFlutuanteConfirmarOuCancelarOperacao.getText());

		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
				
		Assert.assertEquals("Orçamento " + numeroOrcamentoNovo + " cancelado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Cancelado", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoNovo, "Status"));
	}

	/** Testa a duplicacao de um orcamento cancelado. */
	@Test
	public void TCC002_deve_duplicar_orcamento_cancelado() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);
				
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.CANCELAR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();

		orcamentoPO.localizarOrcamentoParaDuplicar("Código", numeroOrcamentoNovo);
		novoOrcamentoPO.aguardarCarregamentoDaPagina(novoOrcamentoPO.carregamentoDaPagina);
	
		novoOrcamentoPO.botaoSalvarNovoOrcamento.click();
		
		String numeroOrcamentoDuplicado = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");

		Assert.assertEquals("Orçamento " + numeroOrcamentoDuplicado + " cadastrado com sucesso!", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
		Assert.assertEquals("Em digitação", tabelaUtil.obterStatusDoOrcamento("Código", numeroOrcamentoDuplicado, "Status"));

		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoDuplicado, EnumOpcoes.EXCLUIR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
	}

	/**
	 * Testa a acao imprimir proposta de um orcamento cancelado sem proposta.
	 * @return mensagem "Atenção! Não foi possível imprimir.\nMotivo: Não foi gerada uma proposta para este orçamento."
	 */
	@Test
	public void TC003_deve_testar_mensagem_ao_tentar_imprimir_proposta_orcamento_cancelado_que_nao_tenha_proposta() {
		novoOrcamentoPO.adicionarNovoOrcamento(identificadorEmpresa, identificadorCliente);
		
		numeroOrcamentoNovo = novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2).replace("Orçamento ", "").replace(" cadastrado com sucesso!", "");
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.CANCELAR);
		novoOrcamentoPO.botaoConfirmarMensagemFlutuante.click();
		
		novoOrcamentoPO.aguardarVisibilidadeDoElemento(driver, 2, novoOrcamentoPO.conteudoMensagemFlutuante);
		novoOrcamentoPO.botaoFecharMensagemFlutuante.click();
		
		orcamentoPO.localizarOrcamentoClicarEmOpcoesERealizarAcao("Código", numeroOrcamentoNovo, EnumOpcoes.IMPRIMIR_PROPOSTA);
		
		Assert.assertEquals("Atenção! Não foi possível imprimir.\nMotivo: Não foi gerada uma proposta para este orçamento.", novoOrcamentoPO.obterTextoMensagemFlutuante(driver, 2));
	}
}
