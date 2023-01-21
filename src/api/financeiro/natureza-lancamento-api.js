import axiosConfig from '@/api/axios-config.js';
import NaturezaLancamentoModel from '@/models/financeiro/natureza-lancamento-model';

async function localizarNaturezasAnaliticas(consulta) {
  let naturezas = await localizarNaturezasDeLancamento(consulta);
  return naturezas.filter(n => n.ativo && (n.tipo === "ANALITICA"));
}

function localizarNaturezasDeLancamento(consulta) {
  consulta = consulta || "";
  let query = `{
    dados: naturezaLancamento(consulta:"%1") {
      ativo,
      classificacao,
      codigo,
      codigoNome,
      identificador,
      nome,
      tipo,
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace("%1", consulta.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, "dados", NaturezaLancamentoModel);
}

export default { 
  localizarNaturezasDeLancamento,
  localizarNaturezasAnaliticas
};