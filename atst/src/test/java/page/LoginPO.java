package page;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/** Page Object da pagina de login. */
public class LoginPO extends BasePO {

	//#region Regiao dos elementos.

	/** Elemento para digitar o login do usuario. */
	@FindBy(id = "login")
	public WebElement inputLogin;

	/** Elemento para digitar a senha do usuario. */
	@FindBy(id = "senha")
	public WebElement inputSenha;

	/** Elemento botao "Entrar" com usuario e senha. */
	@FindBy(css = "div > .btn-login > .icon-circle-arrow-right")
	public WebElement botaoEntrar;
	//#endregion

	//#region região dos construtores.
	public LoginPO(WebDriver driver) {
		super(driver);
	}
	//#endregion
}
