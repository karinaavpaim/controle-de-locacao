import axiosConfig from '@/api/axios-config.js';
import PrazoModel from '@/models/financeiro/prazo-model';

function obterPrazos() {
  let query = `{
    dados: prazo{
      ativo,
      codigoClassificacao,
      codigo,
      codigoNome,
      identificador,
      identificadoresEmpresa,
      nome,
      tipo,
      tipoClassificacao,
      formasPagamentosEntrada{
        codigo,
        codigoNome,
        identificador,
        nome,
        itens{
          identificadorEmpresa,
          identificador,
          numeroParcelasCliente,
          numeroParcelasRecebimento,
          numeroDiasRecebimento,
          numeroDiasIntervalo
        }
      }
      formasPagamentosParcelas{
        codigo,
        codigoNome,
        identificador,
        nome,
        itens{
          identificadorEmpresa,
          identificador,
          numeroParcelasCliente,
          numeroParcelasRecebimento,
          numeroDiasRecebimento,
          numeroDiasIntervalo
        }
      }
    }
  }`.replace(/[\n]*[ ]*/gm, '');

  return axiosConfig.executarQueryGraphQL(query, "dados", PrazoModel);
}

export default { 
  obterPrazos
};