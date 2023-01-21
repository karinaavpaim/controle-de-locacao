import Vue from 'vue'
import Vuex from 'vuex'
import usuario from '@/store/modules/usuario'
import controleDeLocacao from '@/store/modules/controle-locacao'
import empresa from '@/store/modules/empresa'
import configuracoes from '@/store/modules/configuracoes'
import acessos from "@/store/modules/acessos";

/*
*                       -!-!-!-! ATENCAO !-!-!-!-
* O ideal no vuex eh trabalhar com getters, actions e mutations.
* Devido ao issue https://github.com/vuejs/vuex/pull/1364, iremos trabalhar com constantes e namespaces
*
*/

Vue.use(Vuex);

// Importar os módulos aqui

export default new Vuex.Store({ 
  modules: {
    empresa,
    acessos,
    configuracoes,
    usuario,
    controleDeLocacao
  }
});