import apiLocacaoCache from "@/api/faturamento/controle-de-locacao/locacao-cache-api";
import { CATEGORIAS } from '@/constants/faturamento/controle-de-locacao/locacao-cache-constants';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants';
import MedicaoLocacaoModel from "@/models/estoque/medicao/medicao-locacao-model";

const notificacoesControleDeEstoqueMixin = {
  data() {
    return {
      listaLocacaoCache: [],
    }
  },

  methods: {
    obterNotificacoesLocacaoCache(notificacoes, identificadorUsuario) {
      apiLocacaoCache.obterLocacaoCache(undefined, identificadorUsuario, false)
      .then(response => {
        response.map(locacaoCache => {
          switch (locacaoCache.nomeEntidade) {
            case CATEGORIAS.MEDICAO.NOME_ENTIDADE : this.incluirNotificacoesMedicao(notificacoes, locacaoCache)
            break;
          }
        });
      })
      .catch(() => { /*Não é necessário alertar caso não consiga obter as pendências */ });
    
    },

    incluirNotificacoesMedicao(notificacoes, locacaoCache){
      notificacoes.exibirIcone = true;
      
      apiLocacaoCache.obterLocacaoCache(locacaoCache.identificador, undefined, true)
      .then(response => {
        let medicao = undefined;

          try{
             medicao = new MedicaoLocacaoModel(JSON.parse(response[0].valor));
          }catch{
            //Tratar alguma mensagem para o usuario aqui no futuro.
            return;
          }
          
          let mensagem = `Rascunho de medição pendente: ${medicao.codigoLocacao} (${medicao.cliente.nomeCurto})`
          let jaExiste = notificacoes.lista.filter(n => n.descricao == mensagem).length;
         
          if(!jaExiste){
            notificacoes.lista.push({
              descricao: mensagem,
              rota: {
                name: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name,
                path: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.path,
                params: { idLocacao: medicao.identificadorLocacao, veioDeNotificacao: true }
              }
            });
          }
      })
      .catch(() => { /*Não é necessário alertar caso não consiga obter as pendências */ });  
    }

  }
}

export default notificacoesControleDeEstoqueMixin;