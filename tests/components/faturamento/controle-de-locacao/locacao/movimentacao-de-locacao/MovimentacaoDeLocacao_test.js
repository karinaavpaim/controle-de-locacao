'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import MovimentacaoDeLocacao from '@/components/faturamento/controle-de-locacao/locacao/movimentacao-de-locacao/MovimentacaoDeLocacao.vue';
import { COLUNAS_TABELA_MOVIMENTACAO_LOCACAO } from '@/constants/faturamento/controle-de-locacao/movimentacao-de-locacao-constants.js';
import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";
import orcamentoDetalhes from '../../../../../fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants.js';
import FiltrosPesquisaOrcamentoModel from '@/models/faturamento/orcamento-locacao/filtros-pesquisa-orcamento-model';
import apiOrcamentoLocacao from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import { OPCOES_STORE_CONFIGURACOES } from "@/store/modules/configuracoes";

describe('MovimentacaoDeLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  let orcamento = {
    codigo: 'codigo-do-orcamento',
    dataEmissao: '2019-10-07',
    dataInicioContrato: '2019-10-07',
    dataTerminoContrato: '2019-10-10',
    dataReferencia: '2019-10-07',
    dataInicialReferencia: '2019-10-07',
    dataFinalReferencia: '2019-10-10',
    identificadorEmpresa: 1,
    identificador: 333,
    cliente: { identificador: '00A0000001'},
    status: 'APROVADO'
  };

  beforeEach(() => {
    wrapper = mount(MovimentacaoDeLocacao, {
      store,
      router,
      propsData: {},
    });
  });

  describe('Construção do componente.', () => {
    it('Deve definir os dados padrão(data()) do componente.', () => {
      expect(typeof MovimentacaoDeLocacao.data).toBe('function');
      expect(wrapper.vm.breadCrumbs.length).toBe(1);
      expect(wrapper.vm.exibirFiltrosAvancados).toBe(false);
      expect(wrapper.vm.exibirFiltros).toBe(false);
      expect(wrapper.vm.paginacao.sortBy).toBe('codigo');
      expect(wrapper.vm.paginacao.descending).toBe(true);
      expect(typeof wrapper.vm.filtrosPesquisaMovimentacao).toBe('object');
      expect(wrapper.vm.filtrosPesquisaMovimentacao.constructor.name).toBe('FiltrosPesquisaOrcamentoModel');
      expect(wrapper.vm.pesquisa).toEqual('');
      expect(wrapper.vm.orcamentosDeLocacao).toEqual([]);
      expect(wrapper.vm.colunasMovimentacaoDeLocacao).toEqual(COLUNAS_TABELA_MOVIMENTACAO_LOCACAO);
    });
  });

  describe('Ações do componente.', () => {
    it('Deve montar status do orçamento.', () => {
      var orcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
      orcamento.status = 'LIBERADO'
      orcamento.valorStatus= orcamento.status;
      expect(wrapper.vm.montarStatusOrcamento(orcamento).length).toEqual(1);
    });

    it('Deve alterar o status do orçamento manualmente', () => {
      jest.spyOn(wrapper.vm, "alterarStatusDoOrcamento").mockImplementation(() => Promise.resolve());

      let obj = {orcamento: { status: 'EXECUCAO' }}

      wrapper.vm.alterarStatusOrcamentoManualmente(obj);
      expect(obj.orcamento.status).toBe('EXECUCAO');

      obj.statusAnterior = 'LIBERADO';

      wrapper.vm.alterarStatusOrcamentoManualmente(obj);
      expect(obj.orcamento.status).toBe('LIBERADO');
      expect(wrapper.vm.alterarStatusDoOrcamento).toHaveBeenCalled();
    });

    //TODO: Implementar assim que o recurso estiver pronto
    it('Deve gerar Requisição (Em Desenvolvimento)', () => {
      wrapper.vm.gerarRequisicao({ identificador: "1" });
      wrapper.vm.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name,
        params: { idModelo: '1' }
      });
    });

    describe('gerarExpedicao', () => {
      it('Deve carregar as configurações da empresa, mas não tem tabela preço', async (done) => {

        jest.spyOn(wrapper.vm.$mensagemFlutuante, "aviso").mockImplementation(() => true);
        wrapper.vm.gerarExpedicao({ identificador: "1" });
        wrapper.vm.$nextTick(() => {
          wrapper.vm.$nextTick(() => {
            try {
              expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
              done();
            }
            catch(e) { done.fail(e) }
          });
        });
      });

      it('Deve apresentar ao usuário um aviso de que não há equipamento ou material para requisitar.', async (done) => {
        jest.spyOn(wrapper.vm.$mensagemFlutuante, 'aviso').mockImplementation(() => true);

        await wrapper.vm.gerarRequisicao({ possuiMaterialOuEquipamento: false });
        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
            done();
          }
          catch(e) { done.fail(e) }
        });

        await wrapper.vm.gerarRequisicao({ possuiMaterialOuEquipamento: true });
        wrapper.vm.$router.push({
          name: ROTAS_FATURAMENTO_METADATA.requisicaoDeLocacao.name,
          params: { idModelo: '1' }
        });
      });

      it('Deve apresentar ao usuário um aviso de que não há endereço de entrega informado.', async (done) => {
        jest.spyOn(wrapper.vm.$mensagemFlutuante, 'aviso').mockImplementation(() => true);

        await wrapper.vm.gerarExpedicao({ codigoEnderecoEntrega: undefined });
        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
            done();
          }
          catch(e) { done.fail(e) }
        });

        await wrapper.vm.gerarExpedicao({ codigoEnderecoEntrega: "01" });
        wrapper.vm.$router.push({
          name: ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name,
          params: { idModelo: '1' }
        });
      });

      it('Deve apresentar ao usuário um aviso de que não há equipamento ou material para expedir.', async (done) => {
        jest.spyOn(wrapper.vm.$mensagemFlutuante, 'aviso').mockImplementation(() => true);

        await wrapper.vm.gerarExpedicao({ possuiMaterialOuEquipamento: false });
        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
            done();
          }
          catch(e) { done.fail(e) }
        });

        await wrapper.vm.gerarExpedicao({ possuiMaterialOuEquipamento: true });
        wrapper.vm.$router.push({
          name: ROTAS_FATURAMENTO_METADATA.expedicaoDeLocacao.name,
          params: { idModelo: '1' }
        });
      });

      it('Deve apresentar ao usuário um aviso de que não há endereço de entrega.', async (done) => {
        jest.spyOn(wrapper.vm.$mensagemFlutuante, 'aviso').mockImplementation(() => true);

        await wrapper.vm.gerarMedicao({ codigoEnderecoEntrega: undefined });
        wrapper.vm.$nextTick(() => {
          try {
            expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
            done();
          }
          catch(e) { done.fail(e) }
        });

        await wrapper.vm.gerarMedicao({ codigoEnderecoEntrega: "01" });
        wrapper.vm.$router.push({
          name: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name,
          params: { idModelo: '1' }
        });
      });

      it('Deve carregar as configurações da empresa', async (done) => {
        wrapper.vm.$store.dispatch(OPCOES_STORE_CONFIGURACOES.ACTIONS.ALTERAR_CONFIGURACOES_EMPRESA_ATUAL, new Promise((resolv, reject)=>{
          reject('Provocando erro');
        }));

        jest.spyOn(wrapper.vm.$mensagemFlutuante, "aviso").mockImplementation(() => true);
        wrapper.vm.gerarExpedicao({ identificador: "1" });
        wrapper.vm.$nextTick(() => {
          wrapper.vm.$nextTick(() => {
            wrapper.vm.$nextTick(() => {
              wrapper.vm.$nextTick(() => {
                try {
                  expect(wrapper.vm.$mensagemFlutuante.aviso).toHaveBeenCalled();
                  done();
                }
                catch(e) { done.fail(e) }
              });
            });
          });
        });
      });
    });

    it('Deve gerar Medição (Em Desenvolvimento)', () => {
      wrapper.vm.gerarMedicao({ identificador: "1" });
      wrapper.vm.$router.push({
        name: ROTAS_FATURAMENTO_METADATA.medicaoDeLocacao.name,
        params: { idModelo: '1' }
      });
    });

    it('Deve filtrar os orçamentos', async () => {
      wrapper.vm.empresa = {
        identificador: "000100",
      };

      wrapper.vm.filtrosPesquisaMovimentacao = new FiltrosPesquisaOrcamentoModel({
        buscarLocacoesMovimentadas: true
      });

      wrapper.vm.carregando = false;

      jest.spyOn(apiOrcamentoLocacao, 'obterOrcamentos')
          .mockImplementation(() => Promise.resolve([ orcamento ]));

      wrapper.vm.filtrarOrcamentosSalvandoFiltro();
      expect(wrapper.vm.filtrosPesquisaMovimentacao.idEmpresa).toBe("000100");
      expect(wrapper.vm.filtrosPesquisaMovimentacao.buscarLocacoesMovimentadas).toBe(true);
      expect(apiOrcamentoLocacao.obterOrcamentos).toHaveBeenCalledWith(wrapper.vm.filtrosPesquisaMovimentacao);
    });

    it('Deve validar o método salvarFiltroEFiltrar', () => {
      wrapper.vm.salvarFiltroEFiltrar();
      expect(wrapper.vm.filtrosPesquisaMovimentacao.gravadoPeloUsuario).toBeTruthy();
    });

    it('Deve validar o método limparFiltroEFiltrar', () => {
      wrapper.vm.limparFiltroEFiltrar();
      expect(wrapper.vm.filtrosPesquisaMovimentacao.constructor.name).toBe('FiltrosPesquisaOrcamentoModel');
      expect(wrapper.vm.filtrosPesquisaMovimentacao.gravadoPeloUsuario).toBeFalsy();
    });
  });
});