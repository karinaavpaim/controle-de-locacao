import RotasDaFamiliaCRM from './crm-routes';
import RotasDaFamiliaFaturamento  from './faturamento-routes';
import RotasDaFamiliaEstoque from './estoque-routes';
import RotasDaFamiliaFinanceiro from './financeiro-routes';
import RotasDaFamiliaGeral from './geral-routes';
import RotasDaFamiliaSistema from "./sistema-routes";

let routes = [].concat(
  RotasDaFamiliaCRM,
  RotasDaFamiliaEstoque,
  RotasDaFamiliaFinanceiro,
  RotasDaFamiliaGeral,
  RotasDaFamiliaFaturamento,
  RotasDaFamiliaSistema
  );

export default { paths: routes };