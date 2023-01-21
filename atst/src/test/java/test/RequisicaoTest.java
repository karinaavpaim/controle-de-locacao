package test;

import java.awt.AWTException;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import page.MovimentacaoPO;
import page.MovimentacaoPO.EnumAcoes;
import util.GerenciadorJanelas;
import page.RequisicaoPO;

/** Classe de testes para pagina de requisicao. */
public class RequisicaoTest extends BaseTest {

    //#region regiao dos atributos.
    private static MovimentacaoPO movimentacaoPO;
    private static RequisicaoPO requisicaoPO;
    private static GerenciadorJanelas gerenciadorJanelas;
    private static String identificadorEmpresa = "1";
    private static String identificadorCliente = "000001";
    private static String enderecoEntrega = "ROD AMARAL PEIXOTO";
    private static String numeroOrcamento;
    private static String numeroRequisicao;
    private static String codigoEquipamento = "000109";
    private static String codigoMaterial = "000129";
    private static String codigoOrcamento;
    private static int quantidade = 5;
    private static String colunaAcao = "Requisitar";  
    private static EnumAcoes REQUISITAR = EnumAcoes.REQUISITAR;
    private static String numeroOrcamentoDevolucao = "000296";
    //#endregion

    //#region regiao dos metodos.

    /** Metodo que inicia os pontos principais que serao utilizados por todos os testes da classe.*/
    @BeforeClass
    public static void iniciarTeste() {
        movimentacaoPO = new MovimentacaoPO(driver);
        requisicaoPO = new RequisicaoPO(driver);
        gerenciadorJanelas = new GerenciadorJanelas();
    }
    //#endregion

    //#region regiao dos testes.

    @Test
    public void TC001_deve_requisitar_parcialmente_equipamento() throws AWTException, InterruptedException {
        movimentacaoPO.adicionarNovoOrcamentoParaExpedicaoRequisicaoEMedicao(
                identificadorEmpresa, identificadorCliente, enderecoEntrega, 10);
        
        numeroOrcamento = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Status do orçamento ", "").replace(" alterado com sucesso!", "");
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, REQUISITAR);

        requisicaoPO.localizarItemEInserirQuantidadeParaRequisicaoEquipamento(codigoEquipamento, colunaAcao, quantidade);

        requisicaoPO.botaoGerarRequisicao.click();
        movimentacaoPO.fecharTelaDeImpressao(5000);
        
        numeroRequisicao = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Sucesso!\nRequisição ", "").replace(" criada com sucesso.", "");
        
        Assert.assertEquals("Sucesso!\nRequisição " + numeroRequisicao + " criada com sucesso.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 2));
    }

    @Test
    public void TC002_deve_requisitar_parcialmente_material() throws InterruptedException, AWTException {
        movimentacaoPO.adicionarNovoOrcamentoParaExpedicaoRequisicaoEMedicao(identificadorEmpresa, identificadorCliente, 
                enderecoEntrega, 10);
        
        numeroOrcamento = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Status do orçamento ", "").replace(" alterado com sucesso!", "");
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, REQUISITAR);

        requisicaoPO.localizarItemEInserirQuantidadeParaRequisicaoMaterial(codigoMaterial, colunaAcao, quantidade);

        requisicaoPO.botaoGerarRequisicao.click();
        movimentacaoPO.fecharTelaDeImpressao(5000);
        
        numeroRequisicao = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Sucesso!\nRequisição ", "").replace(" criada com sucesso.", "");
        
        Assert.assertEquals("Sucesso!\nRequisição " + numeroRequisicao + " criada com sucesso.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 2));
    }

    @Test
    public void TC003_deve_requisitar_todos_os_itens() throws InterruptedException {

        boolean NovoOrcamentoCriadoComSucesso = movimentacaoPO.adicionarNovoOrcamentoParaExpedicaoRequisicaoEMedicao
                                                                (identificadorEmpresa, identificadorCliente, enderecoEntrega, 5); 
        Assert.assertTrue(NovoOrcamentoCriadoComSucesso);
        
        codigoOrcamento = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Status do orçamento ", "").replace(" alterado com sucesso!", "");
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", codigoOrcamento, REQUISITAR);
        Assert.assertEquals(requisicaoPO.tituloMateriais.getText(), "Materiais");
        
        requisicaoPO.moverPagina(0, +1000);
        requisicaoPO.aguardarElemento(driver, 2);
        Assert.assertFalse(requisicaoPO.botaoGerarRequisicao.isEnabled());
        requisicaoPO.requisitarTodosOsItens();
        Assert.assertTrue(requisicaoPO.botaoGerarRequisicao.isEnabled());

        requisicaoPO.botaoGerarRequisicao.click();
        requisicaoPO.aguardarElemento(driver, 5);

        requisicaoPO.botaoConfirmarGerarRequisicao.click();
        requisicaoPO.aguardarElemento(driver, 5);

        gerenciadorJanelas.fecharJanelaImpressao(driver);

        numeroRequisicao = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Sucesso!\nRequisição ", "").replace(" criada com sucesso.", "");
        
        Assert.assertEquals("Sucesso!\nRequisição " + numeroRequisicao + " criada com sucesso.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 2));
    }

    @Test
    public void TC004_deve_testar_requisicao_acima_da_quantidade_pedida() {
        movimentacaoPO.adicionarNovoOrcamentoParaExpedicaoRequisicaoEMedicao(identificadorEmpresa, identificadorCliente, 
                enderecoEntrega, 1); 
        
        numeroOrcamento = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Status do orçamento ", "").replace(" alterado com sucesso!", "");

        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, REQUISITAR);

        requisicaoPO.localizarItemEInserirQuantidadeParaRequisicaoEquipamento(codigoEquipamento, colunaAcao, 100);
        requisicaoPO.botaoGerarRequisicao.click();
        
        Assert.assertEquals("Não foi possível salvar as informações.\nO item código " 
            + codigoEquipamento + " ultrapassa a quantidade máxima para requisição.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 2));
    
        requisicaoPO.botaoFecharMensagemFlutuante.click();
        
        requisicaoPO.botaoLimparRequisicoesTodosEquipamentos.click();

        requisicaoPO.localizarItemEInserirQuantidadeParaRequisicaoMaterial(codigoMaterial, colunaAcao, quantidade);
        requisicaoPO.botaoGerarRequisicao.click();

        Assert.assertEquals("Não foi possível salvar as informações.\nO item código " 
            + codigoMaterial + " ultrapassa a quantidade máxima para requisição.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 2));
    }
   
    @Test
    public void TC005_devolver_requisicao() throws AWTException, InterruptedException {
        movimentacaoPO.navegarParaMovimentacao();
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamentoDevolucao, REQUISITAR);

        requisicaoPO.devolverRequisicaoEquipamento(codigoEquipamento, 1);
        
        requisicaoPO.botaoGerarRequisicao.click();
        movimentacaoPO.fecharTelaDeImpressao(5000);
        
        numeroRequisicao = movimentacaoPO.obterTextoMensagemFlutuante(driver, 10).replace("Sucesso!\nRequisição de devolução ", "").replace(" criada com sucesso.", "");
        Assert.assertEquals("Sucesso!\nRequisição de devolução " + numeroRequisicao + " criada com sucesso.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 2));
    }

    @Test
    public void TC006_testar_devolver_quantidade_maior_da_requisitada() throws AWTException {
        movimentacaoPO.navegarParaMovimentacao();
        
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamentoDevolucao, REQUISITAR);

        requisicaoPO.devolverRequisicaoEquipamento(codigoEquipamento, 100);
        requisicaoPO.botaoGerarRequisicao.click();
       
        Assert.assertEquals("Não foi possível salvar as informações.\nO item código " 
        + codigoEquipamento + " ultrapassa a quantidade máxima para devolução.", movimentacaoPO.obterTextoMensagemFlutuante(driver, 10));    }
    //#endregion
}
