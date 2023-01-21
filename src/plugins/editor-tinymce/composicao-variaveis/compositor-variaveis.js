'use strict';

import cliente from './variaveis-cliente';
import empresa from './variaveis-empresa';
import equipamentos from './variaveis-equipamentos';
import servicos from './variaveis-servicos';
import materiais from './variaveis-materiais';
import despesas from './variaveis-despesas';
import repasses from './variaveis-repasses';
import gerais from './variaveis-gerais';

import equipamentosAditivo from './variaveis-equipamentos-aditivo';
import servicosAditivo from './variaveis-servicos-aditivo';
import materiaisAditivo from './variaveis-materiais-aditivo';
import despesasAditivo from './variaveis-despesas-aditivo';
async function obterVariaveisParaProposta(orcamento){
  orcamento = orcamento || {};

  return [].concat(
    await cliente.obter(orcamento), 
    await empresa.obter(orcamento),
    equipamentos.obter(orcamento),
    servicos.obter(orcamento),
    materiais.obter(orcamento),
    despesas.obter(orcamento),
    repasses.obter(orcamento),
    gerais.obter(orcamento)
  );
}

async function obterVariaveisParaAditivo(orcamento, aditivo){
  orcamento = orcamento || {};
  aditivo = aditivo || {};
  
  return [].concat(
    await cliente.obter(orcamento), 
    await empresa.obter(orcamento),
    equipamentosAditivo.obter(aditivo),
    servicosAditivo.obter(aditivo),
    materiaisAditivo.obter(aditivo),
    despesasAditivo.obter(aditivo),    
    repasses.obter(orcamento),
    gerais.obter(orcamento)
  );
}

export default { 
  obterVariaveisParaProposta,
  obterVariaveisParaAditivo,
};