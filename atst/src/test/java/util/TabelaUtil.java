package util;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**Classe para manipulacao da tabela de orcamentos do sistema. */
public class TabelaUtil {

	//#region regiao dos atributos.

	/**Driver que será utilizado na tabela */
	public WebDriver driver;
	//#endregion

	//#region regiao dos construtores.
	public TabelaUtil(WebDriver driver) {
		this.driver = driver;
	}
	//#endregion

	//#region regiao dos metodos.

	/** Metodo para obter a linha do orcamento a ser localizado a partir da coluna de codigos. */
	public int obterIndiceLinha(String valor, WebElement tabela) {
		List<WebElement> linhas = tabela.findElements(By.tagName("tr"));
		int idLinha = 0;
		for (int i = 0; i < linhas.size(); i++) {
			List<WebElement> colunas = linhas.get(i).findElements(By.xpath("td"));
			for (int j = 0; j < colunas.size(); j++) {
				System.out.println(colunas.get(1).getText());
				if (colunas.get(j).getText().equals(valor)) {
					idLinha = i;
					break;
				}
			}
		}
		return idLinha;
	}

	/** Metodo para localizar a coluna onde estao localizados os codigos dos orcamentos. */
	public int obterIndiceColuna(String coluna, WebElement tabela) {
		List<WebElement> colunas = tabela.findElements(By.tagName("th"));
		int idColuna = 0;
		for (int i = 0; i < colunas.size(); i++) {
			if (colunas.get(i).getText().equals(coluna)) {
				idColuna = i + 1;
				break;
			}
		}
		return idColuna;
	}

	/** Metodo para obter o status de um orcamento dentro da tabela.*/
	public String obterStatusDoOrcamento(String colunaCodigo, String codigo, String colunaStatus) {
		WebElement tabela = driver.findElement(By.tagName("table"));
		int idLinha = obterIndiceLinha(codigo, tabela);
		int idColunaStatus = obterIndiceColuna(colunaStatus, tabela);
		String status = tabela.findElement(By.xpath("//tr[" + idLinha + "]/td[" + idColunaStatus + "]/span/span[1]"))
				.getText().replace("\narrow_drop_down", "");
		return status;
	}

	/** Metodo para buscar um orcamento dentro da tabela e alterar seu status.*/
	public void clicarParaAlterarStatusDoOrcamento(String colunaCodigo, String codigoDoOrcamento, String colunaStatus,
			String nomeStatus) {
		WebElement tabela = driver.findElement(By.tagName("table"));
		int idLinha = obterIndiceLinha(codigoDoOrcamento, tabela);
		int idColunaStatus = obterIndiceColuna(colunaStatus, tabela);
		tabela.findElement(By.xpath("//tr[" + idLinha + "]/td[" + idColunaStatus + "]/span/span[1]")).click();
		driver.findElement(By.xpath("*//div/div[contains(text(), '" + nomeStatus + "')]")).click();
	}
	//#endregion
}
