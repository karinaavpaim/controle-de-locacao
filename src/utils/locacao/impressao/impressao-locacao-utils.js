'use strict'
function criarLinha(...colunas) {
  colunas = colunas || [];
  let resultado = "<div class='linha'>";
  colunas.forEach(coluna => { resultado += coluna });
  return resultado + "</div>";
}

function criarLinhaSemBordas(...colunas) {
  colunas = colunas || [];
  let resultado = `<div class='linha' style="border:0px;">`;
  colunas.forEach(coluna => { resultado += coluna });
  return resultado + "</div>";
}

function criarColuna(dado, porcentagemTamanhoColuna, alinhamento, negrito, semBordas) {
  porcentagemTamanhoColuna = porcentagemTamanhoColuna ? `width:${porcentagemTamanhoColuna};` : "";
  alinhamento = alinhamento ? `text-align:${alinhamento};` : "";
  negrito = negrito ? `font-weight:bold;` : "";
  semBordas = semBordas ? `border:0px;padding:0px;` : "";
  let style = (porcentagemTamanhoColuna || alinhamento || semBordas) ? `style="${porcentagemTamanhoColuna+alinhamento+negrito+semBordas}"` : "";
  return `<div class="coluna" ${style}>${dado}</div>`;
}

function quebraDeLinha() {
  return "<br />";
}

function criarEspacamento() {
  return "<div class='bloco-espacamento'></div>";
}

function encapsularConteudoEmTabela(conteudo) {
  return `
          <div class="tabela">
            ${conteudo}
          </div>
        `
}

export { criarLinha, criarLinhaSemBordas,  criarColuna, quebraDeLinha, criarEspacamento, encapsularConteudoEmTabela }