package test;

import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import page.LoginPO;

/** Classe base para todas os testes do sistema. Todas os testes do sistema devem herdar dessa classe. */
public abstract class BaseTest {

	//#region região dos elementos.

	/** Driver que sera utilizado em todos os testes do sistema. */
	public static WebDriver driver;
	private static LoginPO loginPO;
	private static final String URLBASE = "http://win-dse-hmlcrt2:9095";
	private static final String CAMINHO_DRIVER = "src/test/resources/chromedriver95.exe";
	private static final String LOGIN = "SUPERVISOR";
	private static final String SENHA = "senhas";
	//#endregion

	//#region regiao dos metodos.

	/** Metodo que realiza as seguintes acoes antes de cada classe de teste ser executada: 
	 * Abrir o navegador, navegar ate a pagina de login do controle de locacao, inserir o login e senha
	 * e navegar ate a pagina Controle de Locacao.
	 */
	@BeforeClass
	public static void abrirControleDeLocacao() {
		System.setProperty("webdriver.chrome.driver", CAMINHO_DRIVER);
		driver = new ChromeDriver();
		driver.manage().window().maximize();
		driver.get(URLBASE);

		loginPO = new LoginPO(driver);

		aguardarElemento(driver, 2);
		loginPO.inputLogin.sendKeys(LOGIN);
		loginPO.inputSenha.sendKeys(SENHA);
		loginPO.botaoEntrar.click();

		aguardarElemento(driver, 10);
		loginPO.menuFaturamento.click();

		aguardarElemento(driver, 10);
		loginPO.menuControleDeLocacao.click();
		aguardarElemento(driver, 10);
	}

	/**
	 * Metodo para aguardar ate determinado limite de tempo ate que o elemento apareca e
	 * consiga realizar a proxima acao desejada.
	 * @param driver              driver do sistema.
	 * @param tempoMaximoDeEspera tempo maximo que o sistema vai aguardar um elemento.
	 */
	public static void aguardarElemento(WebDriver driver, int tempoMaximoDeEspera) {
		driver.manage().timeouts().implicitlyWait(tempoMaximoDeEspera, TimeUnit.SECONDS);
	}

	/**
	 * Metodo para limpar um campo input.
	 * @param elementoInput elemento de input.
	 */
	public void limparCampoInput(WebElement elementoInput) {
		elementoInput.sendKeys(Keys.CONTROL + "A");
		elementoInput.sendKeys(Keys.DELETE);
	}

	/** Metodo para fazer o logoff e fechar o navegador sempre ao final de uma classe de teste. */
	@AfterClass
	public static void realizarLogoutUsuario() {
		loginPO.menuUsuario.click();
		aguardarElemento(driver, 10);
		loginPO.menuUsuarioLogoff.click();
		driver.quit();
	}
	//#endregion
}
