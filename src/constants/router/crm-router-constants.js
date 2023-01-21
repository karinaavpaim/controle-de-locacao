'use strict';
import * as config from '../../../vue.enviroment.config';

const caminhoBase = config.V3UrlBase + 'crm/';
const caminhoContatoDeVenda = caminhoBase + 'contato-de-venda/';
const caminhoAtendimento = caminhoBase + 'atendimento/';

const ROTAS_CRM_METADATA = 
{
  dashboardContatoDeVenda: {
    path: caminhoContatoDeVenda + 'cadastro-de-contatos-de-venda',
    name: 'CadastroDeContatoDeVenda',
    title: 'Cadastro',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Contato de venda',
    familia: 'CRM',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'vendasfollowup/cadastro');
    }
  },
  consultaDeContatosDeVenda: {
    path: caminhoContatoDeVenda + 'consulta-de-contatos-de-venda',
    name: 'ConsultaDeContatosDeVenda',
    title: 'Consulta',
    icon: 'mdi-account',
    help: config.help,
    grupo: 'Contato de venda',
    familia: 'CRM',
    naoExibir: false,
    redirect: () => {
      config.redirecionar(config.V1UrlBase, 'vendasfollowup/cadastro');
    }
  },
  consultaDeAtendimentos: {
    path: caminhoAtendimento + 'consulta',
    name: 'ConsultaDeAtendimentos',
    title: 'CRM atendimentos web',
    icon: 'playlist_add_check',
    help: config.help,
    //grupo: 'Atendimento',
    familia: 'CRM',
    naoExibir: false,
    redirect: () => {
      config.redirecionarComAutenticacao(config.CRMUrlBase, '');
    }
  }
};


export { 
  ROTAS_CRM_METADATA
};