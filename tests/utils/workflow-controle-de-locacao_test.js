import * as workflowControleDeLocacao from '../../src/utils/workflow-controle-de-locacao.js';
import { OPCOES_MENU } from "@/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants.js";

describe('Teste para o utils workflowControleDeLocacao.js', () => {

  beforeEach(() => { });

  const PROXIMOS_STATUS_ORCAMENTOS = {
    EM_DIGITACAO: ['EM_DIGITACAO', 'PRONTO'],
    PRONTO: ['PRONTO'],
    AGUARDANDO: ['AGUARDANDO', 'APROVADO', 'REPROVADO'],
    REPROVADO: ['REPROVADO', 'REVISAO'],
    APROVADO: ['APROVADO'],
    LIBERADO: ['LIBERADO'],
    EXECUCAO: ['EXECUCAO'],
    FINALIZADO: ['FINALIZADO'],
    CANCELADO: ['CANCELADO'],
    EXCLUIDO: ['EXCLUIDO'],
    REVISAO: ['REVISAO', 'PRONTO']
  };

  const PROXIMOS_STATUS_LOCACOES = {
    APROVADO: ['APROVADO', 'LIBERADO'],
    LIBERADO: ['LIBERADO', 'EXECUCAO'],
    EXECUCAO: ['EXECUCAO', 'FINALIZADO'],
    FINALIZADO: ['FINALIZADO'],
    CANCELADO: ['CANCELADO']
  };

  const OPCOES_ORCAMENTO = Object.assign({}, OPCOES_MENU);
  OPCOES_ORCAMENTO.EDITAR_ORCAMENTO.metodo = () => "Chama o metodo para editar";
  OPCOES_ORCAMENTO.DUPLICAR_ORCAMENTO.metodo = () => "Chama o metodo para duplicar";
  OPCOES_ORCAMENTO.CANCELAR.metodo = () => "Chama o metodo para cancelar";
  OPCOES_ORCAMENTO.EXCLUIR.metodo = () => "Chama o metodo para excluir";
  OPCOES_ORCAMENTO.GERAR_PROPOSTA.metodo = () => "Chama o metodo para gerar proposta";
  OPCOES_ORCAMENTO.EDITAR_PROPOSTA.metodo = () => "Chama o metodo para editar proposta";
  OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.metodo = () => "Chama o metodo para imprimir proposta";

  const OPCOES_LOCACAO = Object.assign({}, OPCOES_MENU);
  OPCOES_LOCACAO.AJUSTAR_LOCACAO.metodo = () => "Chama o metodo para ajustar proposta";
  OPCOES_LOCACAO.IMPRIMIR_PROPOSTA.metodo = () => "Chama o metodo para imprimir proposta";
  OPCOES_LOCACAO.CANCELAR_LOCACAO.metodo = () => "Chama o metodo para cancelar";

  describe('Deve obter lista com os próximos status para os Orcamentos.', () => {
    it('Deve obter os próximos status do Orcamento com status EM_DIGITACAO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'EM_DIGITACAO'
      });

      expect(resultado.length).toBe(2);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.EM_DIGITACAO[0]);
      expect(resultado[1].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.EM_DIGITACAO[1]);
    });

    it('Deve obter os próximos status do Orcamento com status PRONTO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'PRONTO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.PRONTO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status AGUARDANDO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'AGUARDANDO'
      });

      expect(resultado.length).toBe(3);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.AGUARDANDO[0]);
      expect(resultado[1].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.AGUARDANDO[1]);
      expect(resultado[2].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.AGUARDANDO[2]);
    });

    it('Deve obter os próximos status do Orcamento com status REPROVADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'REPROVADO'
      });

      expect(resultado.length).toBe(2);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.REPROVADO[0]);
      expect(resultado[1].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.REPROVADO[1]);
    });

    it('Deve obter os próximos status do Orcamento com status APROVADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'APROVADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.APROVADO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status LIBERADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'LIBERADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.LIBERADO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status EXECUCAO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'EXECUCAO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.EXECUCAO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status FINALIZADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'FINALIZADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.FINALIZADO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status CANCELADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'CANCELADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.CANCELADO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status EXCLUIDO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'EXCLUIDO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.EXCLUIDO[0]);
    });

    it('Deve obter os próximos status do Orcamento com status REVISAO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaControleDoOrcamento({
        status: 'REVISAO'
      });

      expect(resultado.length).toBe(2);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.REVISAO[0]);
      expect(resultado[1].valor).toBe(PROXIMOS_STATUS_ORCAMENTOS.REVISAO[1]);
    });
  });

  describe('Deve obter lista com os próximos status para os contratos.', () => {
    it('Deve obter os próximos status dos contratos com status APROVADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaGestaoDeLocacao({
        status: 'APROVADO'
      });

      expect(resultado.length).toBe(2);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.APROVADO[0]);
      expect(resultado[1].valor).toBe(PROXIMOS_STATUS_LOCACOES.APROVADO[1]);
    });

    it('Deve obter os próximos status dos contratos com status LIBERADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaGestaoDeLocacao({
        status: 'LIBERADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.LIBERADO[0]);
    });

    it('Deve obter os próximos status dos contratos com status EXECUCAO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaGestaoDeLocacao({
        status: 'EXECUCAO'
      });

      expect(resultado.length).toBe(2);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.EXECUCAO[0]);
      expect(resultado[1].valor).toBe(PROXIMOS_STATUS_LOCACOES.EXECUCAO[1]);
    });

    it('Deve obter os próximos status dos contratos com status FINALIZADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaGestaoDeLocacao({
        status: 'FINALIZADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.FINALIZADO[0]);
    });

    it('Deve obter os próximos status dos contratos com status CANCELADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaGestaoDeLocacao({
        status: 'CANCELADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.CANCELADO[0]);
    });
  });

  describe('Deve obter lista com os próximos status para as movimentações de locação.', () => {
    it('Deve obter os próximos status dos contratos com status LIBERADO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaMovimentacaoDeLocacao({
        status: 'LIBERADO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.LIBERADO[0]);
    });

    it('Deve obter os próximos status dos contratos com status EXECUCAO', () => {
      let resultado = workflowControleDeLocacao.obterListaComProximosStatusParaMovimentacaoDeLocacao({
        status: 'EXECUCAO'
      });

      expect(resultado.length).toBe(1);
      expect(resultado[0].valor).toBe(PROXIMOS_STATUS_LOCACOES.EXECUCAO[0]);
    });
  });

  describe('Deve obter lista com as opções do orçamento de acordo com o status. Controle de Orçamento', () => {
    it('Deve obter as opções do status EM_DIGITACAO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'EM_DIGITACAO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(2);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.EXCLUIR.nome);      
    });

    it('Deve obter as opções do status PRONTO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'PRONTO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(3);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.EXCLUIR.nome);      
      expect(resultado[2].nome).toBe(OPCOES_ORCAMENTO.GERAR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status AGUARDANDO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'AGUARDANDO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(4);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.EDITAR_PROPOSTA.nome);
      expect(resultado[2].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);      
      expect(resultado[3].nome).toBe(OPCOES_ORCAMENTO.EXCLUIR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status APROVADO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'APROVADO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(2);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status REPROVADO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'REPROVADO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(2);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status REVISAO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'REVISAO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(1);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
    });

    it('Deve obter as opções do status LIBERADO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'LIBERADO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(2);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status EXECUCAO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'EXECUCAO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(2);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.CANCELAR.nome);
      expect(resultado[1].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status FINALIZADO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'FINALIZADO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(1);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);
    });

    it('Deve obter as opções do status CANCELADO', () => {
      let resultado = workflowControleDeLocacao.obterListaDeOpcoesParaControleDoOrcamento({
        status: 'CANCELADO'
      }, OPCOES_ORCAMENTO);

      expect(resultado.length).toBe(1);
      expect(resultado[0].nome).toBe(OPCOES_ORCAMENTO.IMPRIMIR_PROPOSTA.nome);
    });
  });

  describe('Deve verificar se o Orçamento pode ser ajustado', () => {
    it('Deve retornar true', () => {
      let orcamento = {
        status: 'LIBERADO'
      };
      expect(workflowControleDeLocacao.orcamentoPodeSerAjustado(orcamento)).toBeTruthy();

      orcamento.status = 'EXECUCAO';
      expect(workflowControleDeLocacao.orcamentoPodeSerAjustado(orcamento)).toBeTruthy();
    });

    it('Deve retornar false', () => {
      let orcamento = {
        status: 'CANCELADO'
      };      
      expect(workflowControleDeLocacao.orcamentoPodeSerAjustado(orcamento)).toBeFalsy();
    });
  });

  describe('Deve verificar se a opção Cancelar pode ser desabilitada no Orçamento', () => {
    it('Deve obter as opções do status EM_DIGITACAO', () => {
      let resultado = workflowControleDeLocacao.opcaoCancelarPodeSerDesabilitadaNoOrcamento({
        status: 'EM_DIGITACAO'
      }, OPCOES_ORCAMENTO);
      expect(resultado).toBeFalsy();
    });
  });
});