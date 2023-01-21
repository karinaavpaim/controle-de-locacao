'use strict';

import compositor from './composicao-variaveis/compositor-variaveis';

const NOME_PLUGIN = "inserirdados";
const NOME_PLUGIN_AUTO_COMPLETE = 'inserirdados-auto-complete';

let variaveisCriadasPeloSistema = [];
let variaveisAutoComplete = [];
import { TIPOS_MODELOS } from '../../constants/faturamento/controle-de-locacao/modelo-proposta-constants';

 function montarVariaveisParaAutoComplete(variaveisCriadasPeloSistema) {
  let dados = [];
  variaveisCriadasPeloSistema.map((v) => {
    v.filhas.map(item => {
      dados.push({
        text: `${v.nome} > ${item.nome}`,
        value: `${item.identificador}|${item.inline}|${item.atributo}|${item.titulo}|${item.conteudo}`
      })
    });
  });
  return dados;
}

function criarLayoutVariavel(variavel) {

  let layoutVariavelBlock = `
  background-color: rgba(48,48,48,0.05);
  padding: 25px;
  border-radius: 5px;
  color: rgba(48,48,48,0.78);
  padding-left: 3px;
  padding-right: 3px;
  border: 2px dashed #CECECE;
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  display: block;`;

  let layoutVariavelInline = `
  background-color: rgba(48,48,48,0.05); 
  border-radius: 5px;
  color: rgba(48,48,48,0.78);
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 1px;
  border: 2px dashed #CECECE;
  text-align: center;
  font-weight: 600;
  width: initial;
  display: inline-flex;
  font-size: 13px;
  `;

  return `&nbsp;<span nome-variavel="@@${variavel.atributo.toLowerCase()}@@" 
   style="${(variavel.inline) ? layoutVariavelInline : layoutVariavelBlock}" contenteditable=false>` +
    `${variavel.titulo.replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('_', ' ')} </span>&nbsp;`;
}

function criarPluginAutoComplete(variaveisAutoComplete) {
  
  // Plugin auto-complete para inserir variáveis no editor.
  // eslint-disable-next-line no-undef
  tinymce.PluginManager.add(NOME_PLUGIN_AUTO_COMPLETE, function (editor) {

    editor.ui.registry.addAutocompleter(NOME_PLUGIN_AUTO_COMPLETE, {
      ch: '$', // o caractere acionador para abrir o preenchimento automático
      minChars: 2, // quantidade de caracteres para iniciar a pesquisa após o "ch".
      columns: 1,  // deve ser 1 para resultados baseados em texto
      fetch: (filtro) => {

        //Filtra dinamicamente as variáveis na pesquisa.
        let results = variaveisAutoComplete.filter(v => v.text.toLowerCase().indexOf(filtro.toLowerCase()) > -1);
        // eslint-disable-next-line no-undef
        return new tinymce.util.Promise((resolve) => resolve(results));
      },
      onAction: function (autocompleteApi, rng, value) {
        let parts = value.split('|');
        //Montando a variável para adicionar no Editor.
        let variavel = {
          identificador: parts[0],
          inline: (parts[1] === 'true'),
          atributo: parts[2],
          titulo: parts[3],
          conteudo: parts[4]
        };

        // inserindo os dados no editor
        editor.selection.setRng(rng);
        editor.insertContent(criarLayoutVariavel(variavel));

        // escondendo a lista de variáveis.
        autocompleteApi.hide();
      }
    });
  });
}

function obterVariaveisEmArvore(editor, variaveisCriadasPeloSistema) {
  return (variaveisCriadasPeloSistema.length < 1) ?
    [{
      type: 'menuitem',
      text: "Não há informações disponiveis",
      disabled: true,
    }] :
    variaveisCriadasPeloSistema.map((g) => {
      return {
        type: 'nestedmenuitem',
        text: g.nome,
        tooltip: g.nome,
        value: g.nome,
        getSubmenuItems: function () {
          return g.filhas.map((v) => {
            return {
              type: "menuitem",
              text: v.nome,
              onAction: function () {
                editor.insertContent(criarLayoutVariavel(v));
              }
            }
          });
        }
      }
    });
}

function criarPluginVariaveisEmArvore(variaveisCriadasPeloSistema) {
  // Plugin para apresentar as variáveis em formato de arvore.
  // eslint-disable-next-line no-undef
  tinymce.PluginManager.add(NOME_PLUGIN, function (editor) {

    let variaveisDoSistema = obterVariaveisEmArvore(editor, variaveisCriadasPeloSistema);

    editor.ui.registry.addMenuButton(NOME_PLUGIN, {
      text: 'Adicionar campos',
      icon: "library_add",
      fetch: function (callback) {
        callback(variaveisDoSistema);
      }
    });
  });
}

async function init(tipoVariavel) {

  variaveisCriadasPeloSistema = (tipoVariavel == TIPOS_MODELOS.ADITIVO.VALOR) ?
    await compositor.obterVariaveisParaAditivo({},{}) :
    await compositor.obterVariaveisParaProposta({}),
    
  variaveisAutoComplete = montarVariaveisParaAutoComplete(variaveisCriadasPeloSistema);
  criarPluginVariaveisEmArvore(variaveisCriadasPeloSistema);
  criarPluginAutoComplete(variaveisAutoComplete);
}

export default { init }