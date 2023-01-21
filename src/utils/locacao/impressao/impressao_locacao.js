'use strict'
import GeradorRequisicao from "@/utils/locacao/impressao/gerador_tabela_requisicao";
import GeradorExpedicao from "@/utils/locacao/impressao/gerador_tabela_expedicao";
import GeradorMedicao from "@/utils/locacao/impressao/gerador_tabela_medicao";
import { encapsularConteudoEmTabela, criarEspacamento } from "@/utils/locacao/impressao/impressao-locacao-utils";
import { TIPOS_REQUISICAO } from "@/constants/faturamento/controle-de-locacao/requisicao-constants"

const ORIENTACAO_PAGINA_IMPRESSAO = {
  PAISAGEM: "landscape",
  RETRATO: "portrait"
}

const configs = {
  target: '_blank',
  opcoes: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
  url: window.location.origin,
  replace: true
};

function imprimirRequisicao(requisicoes) {
  let tabela = requisicoes.reduce((resultado, requisicao) =>
    resultado + `${encapsularConteudoEmTabela(`
        ${GeradorRequisicao.gerarLinhasCabecalhoRequisicao(requisicao.tipo == TIPOS_REQUISICAO.REQUISICAO ? "REQUISIÇÃO" : "DEVOLUÇÃO", requisicao)}
        ${
          requisicao.tipo == TIPOS_REQUISICAO.REQUISICAO ? 
            GeradorRequisicao.gerarLinhasRequisicao(requisicao) :
            GeradorRequisicao.gerarLinhasDevolucao(requisicao)
        }
      `)}
      ${_gerarAssinaturasRodape("Setor requisitado", "Setor requisitante")}
      <div class='quebra-de-pagina'></div>
    `, "");
  return _gerarJanela(tabela);
}

function imprimirExpedicao(expedicao) {
  let tabela = encapsularConteudoEmTabela(`
      ${GeradorExpedicao.gerarLinhasCabecalhoExpedicao("EXPEDIÇÃO", expedicao)}
      ${GeradorExpedicao.gerarLinhasExpedicao(expedicao)}
    `)
  return _gerarJanela(tabela);
}

function imprimirMedicao(medicao) {
  let tabelas = encapsularConteudoEmTabela(`
    ${GeradorMedicao.gerarLinhasCabecalhoMedicao("MEDIÇÃO", medicao)}
  `);
  tabelas += criarEspacamento();
  tabelas += GeradorMedicao.gerarLinhasMedicao(medicao);

  return _gerarJanela(tabelas, ORIENTACAO_PAGINA_IMPRESSAO.PAISAGEM);
}

function _gerarAssinaturasRodape(texto1, texto2) {
  return `<div class="assinaturas">
    <div class="assinatura1">${texto1}</div>
    <div class="espacamento-assinaturas"></div>
    <div class="assinatura2">${texto2}</div>
  </div>`
}

function _gerarJanela(conteudo, orientacao) {
  let html = `
    <html>
      <head>
        <title></title>
        <style>
          @page{
            ${orientacao?`size:${orientacao};`:''}
          }
          body {
            font-family: monospace;
            font-size: 14px;
          }
          .tabela {
            width:100%; 
          }
          .linha {
            display: flex;
            border-bottom: 1px solid black;
            break-inside: avoid;
            break-before: avoid;
            break-after: avoid;
          }
          .linha:first-of-type {
            border-top: 1px solid black;
          }
          .coluna {
            flex-grow: 1;
            padding: 5px;
            word-break: break-word;
            border-left: 1px solid black;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow:hidden;
          }
          .coluna:last-of-type {
            border-right: 1px solid black
          }
          .assinaturas {
            display: flex;
            width: 100%;
            margin-top: 100px;
            font-size: 16px;
          }
          .assinaturas div {
            flex-grow: 1;
            text-align: center;
            border-top: 2px solid black;
          }
          .assinatura1 {
            float: left;
          }
          .assinatura2 {
            float: right;
          }
          div.espacamento-assinaturas {
            border: none;
          }
          .quebra-de-pagina {
            break-after: page;
          }
          .bloco-espacamento {
            height: 30px;
          }
        </style>
      </head>
      <body>
      ${conteudo}
      </body>
      <script>
        (function() {
          window.print();
          window.close();
        })();
      </script>
    </html>`;
  let win = window.open(configs.url, configs.target, configs.opcoes, configs.replace);

  return new Promise((resolve, reject) => {
    try {
      win.document.write(html);
      return resolve();
    } catch (e) {
      return reject("O bloqueador de Pop-ups está habilitado \nAdicione este site à sua lista de exceções para que seja possível imprimir relatórios.");
    }
  })
}

export default {
  imprimirRequisicao,
  imprimirExpedicao,
  imprimirMedicao
}