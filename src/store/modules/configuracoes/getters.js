import ConfiguracaoLocacaoModel from "@/models/faturamento/orcamento-locacao/configuracao/configuracao-model";
import ConfiguracoesPaginaModel from "@/models/sistema/storage/configuracoes-pagina-model";

export default {
  configuracoesGerais (state) {
    return new Promise((resolve, reject)=>state
      .configuracoesGerais
      .then(config=>resolve(new ConfiguracaoLocacaoModel(config[0])))
      .catch(reject)
    )
  },

  configuracoesPagina (state) {
    return new Promise((resolve, reject)=>state
      .configuracoesPagina
      .then(configp=>resolve(new ConfiguracoesPaginaModel(configp)))
      .catch(reject)
    )
  },

  configuracoesEmpresaAtual (state) {
    return new Promise((resolve, reject)=>state
      .configuracoesEmpresaAtual
      .then(config=>resolve(new ConfiguracaoLocacaoModel(config)))
      .catch(reject)
    )
  }
}
