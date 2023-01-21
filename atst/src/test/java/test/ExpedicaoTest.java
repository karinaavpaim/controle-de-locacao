package test;

import java.awt.AWTException;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import page.ExpedicaoPO;
import page.MovimentacaoPO;
import page.MovimentacaoPO.EnumAcoes;

/** Classe de testes para pagina de expedicao. */
public class ExpedicaoTest extends BaseTest{

    //#region região dos atributos.
    private static MovimentacaoPO movimentacaoPO;
    private static ExpedicaoPO expedicaoPO;
    private static String numeroOrcamento = "000867";
    private static String numeroOrcamentoExpedicaoTotal = "000869";
    private static EnumAcoes acao = EnumAcoes.EXPEDIR;
    private static String codigoEquipamento = "000109";
    private static String codigoMaterial = "000109";
    private static int quantidade = 1;
    //#endregion

    //#region reigao dos metodos.

    /** Metodo que inicia os pontos principais que serao utilizados por todos os testes da classe. */
    @BeforeClass
    public static void iniciarTeste() {
        movimentacaoPO = new MovimentacaoPO(driver);
        expedicaoPO = new ExpedicaoPO(driver);
    }
    //#endregion

    //#region regiao dos testes.

    @Test
    public void TC001_deve_expedir_parcialmente_equipamento() throws InterruptedException, AWTException {
        movimentacaoPO.navegarParaMovimentacao();
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, acao);
       
        expedicaoPO.localizarItemEInserirQuantidadeParaExpedicaoEquipamento(codigoEquipamento, "Expedir", quantidade);
        expedicaoPO.botaoGerarExpedicao.click(); 
        
        movimentacaoPO.fecharTelaDeImpressao(8000);
        
        Assert.assertEquals("Informações salvas com sucesso!", movimentacaoPO.obterTextoMensagemFlutuante(driver, 5));
    }

    @Test
    public void TC002_deve_expedir_parcialmente_material() throws InterruptedException, AWTException {
        movimentacaoPO.navegarParaMovimentacao();
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, acao);
       
        expedicaoPO.localizarItemEInserirQuantidadeParaExpedicaoMaterial(codigoMaterial, "Expedir", quantidade);
        expedicaoPO.botaoGerarExpedicao.click(); 
        
        movimentacaoPO.fecharTelaDeImpressao(8000);
        
        Assert.assertEquals("Informações salvas com sucesso!", movimentacaoPO.obterTextoMensagemFlutuante(driver, 5));
    }

 //   @Test
    public void TC003_expedir_todos_os_itens() throws InterruptedException, AWTException {
        movimentacaoPO.navegarParaMovimentacao();
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamentoExpedicaoTotal, acao);

        expedicaoPO.expedirTodosOsItens();
        expedicaoPO.botaoGerarExpedicao.click(); 
        
        movimentacaoPO.fecharTelaDeImpressao(8000);
        
        Assert.assertEquals("Informações salvas com sucesso!", movimentacaoPO.obterTextoMensagemFlutuante(driver, 5));
    }

    @Test
    public void TC004_deve_testar_expedicao_acima_da_quantidade_requisitada() {
        movimentacaoPO.navegarParaMovimentacao();
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, acao);

        expedicaoPO.localizarItemEInserirQuantidadeParaExpedicaoEquipamento(codigoEquipamento, "Expedir", 300);
        expedicaoPO.botaoGerarExpedicao.click(); 
        
        Assert.assertEquals("Não foi possível salvar as informações.\nO item código " 
            + codigoEquipamento + " ultrapassa a quantidade máxima para expedição.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 5));
            
        expedicaoPO.botaoFecharMensagemFlutuante.click();
        
        expedicaoPO.rolarPagina(expedicaoPO.botaoLimparTodosEquipamentos);
        expedicaoPO.botaoLimparTodosEquipamentos.click();

        expedicaoPO.localizarItemEInserirQuantidadeParaExpedicaoMaterial(codigoMaterial, "Expedir", 300);
        expedicaoPO.botaoGerarExpedicao.click();

        Assert.assertEquals("Não foi possível salvar as informações.\nO item código " 
            + codigoMaterial + " ultrapassa a quantidade máxima para expedição.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 5));
    }
    //#endregion
}
