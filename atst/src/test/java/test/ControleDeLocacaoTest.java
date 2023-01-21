package test;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import page.DashboardPO;
import page.OrcamentoPO;

/** Classe de testes da pagina controle de locacao. */
public class ControleDeLocacaoTest extends BaseTest {

	//#region reigão dos atributos.

	private static DashboardPO dashboardPO;
	private static OrcamentoPO orcamentoPO;
	//#endregion

	//#region regiao dos metodos.

	/** Metodo que inicia os pontos principais que serao utilizados por todos os testes da classe. */
	@BeforeClass
	public static void iniciarTeste(){
		dashboardPO = new DashboardPO(driver);
		orcamentoPO = new OrcamentoPO(driver);
	}
	//#endregion
	
	//#region região dos testes.

	/** Teste para acessar todos os menus dentro da pagina controle de locacao e verificar os titulos das paginas. */
	@Test
	public void TC001_deve_acessar_menus() {
		orcamentoPO.aguardarElemento(driver, 10);
		orcamentoPO.menuOrcamentos.click();
		Assert.assertEquals("Orçamentos", orcamentoPO.obterTituloPagina());

		dashboardPO.aguardarElemento(driver, 10);
		dashboardPO.menuDashboard.click();
		Assert.assertEquals("Dashboard dos últimos 180 dias", dashboardPO.obterTituloPagina());
	}
	//#endregion
}
