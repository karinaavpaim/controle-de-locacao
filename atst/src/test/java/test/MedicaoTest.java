package test;

import org.junit.BeforeClass;
import org.junit.Test;

import page.MedicaoPO;
import page.MedicaoPO.EnumItens;
import page.MovimentacaoPO;
import page.MovimentacaoPO.EnumAcoes;

/** Classe de testes para pagina de medicao. */
public class MedicaoTest extends BaseTest{

    //#region região dos atributos.
    private static MovimentacaoPO movimentacaoPO;
    
    private static MedicaoPO medicaoPO;
    private static String numeroOrcamento = "000273";
    private static EnumAcoes acao = EnumAcoes.MEDIR;
    private static String codigoEquipamento = "000109";
    private static String codigoMaterial = "000129";
    private static String codigoServico = "002027";
    private static String codigoDespesa = "000143";
    //#endregion

    //#region reigao dos metodos.

    /** Metodo que inicia os pontos principais que serao utilizados por todos os testes da classe. */
    @BeforeClass
    public static void iniciarTeste() {
        movimentacaoPO = new MovimentacaoPO(driver);
        medicaoPO = new MedicaoPO(driver);
    }
    //#endregion

    //#region regiao dos testes.
    @Test
    public void TC001_deve_desmembrar_item_e_fechar_desmembramento(){
        movimentacaoPO.navegarParaMovimentacao();
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, acao);
        
        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoEquipamento, EnumItens.EQUIPAMENTOS);
        medicaoPO.botaoDesmembrarEquipamento.click();
        medicaoPO.localizarCardEClicarBotaoLimparDados(1, EnumItens.EQUIPAMENTOS);

        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoMaterial, EnumItens.MATERIAIS);
        medicaoPO.botaoDesmembrarMaterial.click();
        medicaoPO.localizarCardEClicarBotaoLimparDados(1, EnumItens.MATERIAIS);

        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoServico, EnumItens.SERVICOS);
        medicaoPO.botaoDesmembrarServico.click();
        medicaoPO.localizarCardEClicarBotaoLimparDados(1, EnumItens.SERVICOS);

        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoDespesa, EnumItens.DESPESAS);
        medicaoPO.botaoDesmembrarDespesa.click();
        medicaoPO.localizarCardEClicarBotaoLimparDados(1, EnumItens.DESPESAS);
    }

    @Test
    public void TC002_deve_desmembrar_e_preencher_os_dois_cards_todos_os_itens(){
        movimentacaoPO.navegarParaMovimentacao();
        movimentacaoPO.localizarLocacaoERealizarDeterminadaOperacao("Código", numeroOrcamento, acao);
        
        medicaoPO.rolarPagina(medicaoPO.botaoPreenchimentoAutomatico);
        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoEquipamento, EnumItens.EQUIPAMENTOS);
        medicaoPO.botaoDesmembrarEquipamento.click();

        medicaoPO.inserirQuantidadeMedicao(2, 0, EnumItens.EQUIPAMENTOS);
        medicaoPO.inserirQuantidadeMedicao(4, 1, EnumItens.EQUIPAMENTOS);

        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoMaterial, EnumItens.MATERIAIS);
        medicaoPO.botaoDesmembrarMaterial.click();

        medicaoPO.inserirQuantidadeMedicao(2, 0, EnumItens.MATERIAIS);
        medicaoPO.inserirQuantidadeMedicao(3, 1, EnumItens.MATERIAIS);

        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoServico, EnumItens.SERVICOS);
        medicaoPO.botaoDesmembrarServico.click();

        medicaoPO.inserirQuantidadeMedicao(2, 0, EnumItens.SERVICOS);
        medicaoPO.inserirQuantidadeMedicao(3, 1, EnumItens.SERVICOS);

        medicaoPO.localizarItemCodigoUnicoEExpandirCard(codigoDespesa, EnumItens.DESPESAS);
        medicaoPO.botaoDesmembrarDespesa.click();

        medicaoPO.inserirQuantidadeMedicao(2, 0, EnumItens.DESPESAS);
        medicaoPO.inserirQuantidadeMedicao(3, 1, EnumItens.DESPESAS);
    }
}
