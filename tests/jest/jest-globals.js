import Vue from 'vue'
import InstaladorMensagemFlutuante from '@Bimer/vue-mensagem-flutuante'
import axios from 'axios';

const api = require("@/api/faturamento/controle-de-locacao/proposta-locacao-api").default;
jest.spyOn(api, "obterVariaveisDoSistema").mockImplementation(() => Promise.resolve([{}]));
jest.mock("axios");
axios.get.mockResolvedValue({data:{data:{dados:[]}}});
window.matchMedia = jest.fn().mockImplementation(query => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  });

Vue.use(new InstaladorMensagemFlutuante);