import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisGerais from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-gerais';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model'
import data from '../../../../src/utils/data'
import dinheiro from '../../../../src/utils/mascara-dinheiro'
import { STATUS_ORCAMENTO_LOCACAO } from '../../../../src/constants/faturamento/controle-de-locacao/orcamento-de-locacao-constants'

describe('Variáveis gerais do orçamento', () => {
  let variaveis = variaveisGerais.obter(new OrcamentoLocacaoModel(orcamentoDetalhes))[0].filhas;

  beforeEach(() => {});

  it('Deve retornar uma string vazia quando o campo código do orçamento não estiver definido.', () => {
    let orcamentoCodigoOrcamento = new OrcamentoLocacaoModel(orcamentoDetalhes);
    orcamentoCodigoOrcamento.codigo = '';

    let variaveisCodigoOrcamento = (variaveisGerais.obter(orcamentoCodigoOrcamento))[0].filhas;
    let variavel = variaveisCodigoOrcamento.find(v => v.atributo == 'Codigo_Orcamento');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('Deve obter o código do orçamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Codigo_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.codigo);
  });
 
  it('Deve obter a data de referência do orcamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Data_De_Referencia');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(data.aplicarMascaraEmDataIso(orcamentoDetalhes.dataReferencia));
  });

  it('Deve obter a data de emissão do orcamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Data_De_Emissao');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(data.aplicarMascaraEmDataIso(orcamentoDetalhes.dataEmissao));
  });

  it('Deve obter a data de início do contrato', () => {
    var variavel = variaveis.find(v => v.atributo == 'Data_Inicio_Contrato');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(data.aplicarMascaraEmDataIso(orcamentoDetalhes.dataInicioContrato));
  });

  it('Deve obter a data de término do contrato', () => {
    var variavel = variaveis.find(v => v.atributo == 'Data_Termino_Contrato');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(data.aplicarMascaraEmDataIso(orcamentoDetalhes.dataTerminoContrato));
  });

  it('Deve obter a observação do orçamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Observacao_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.observacao);
  });

  it('Deve obter o valor total das despesas', () => {
    var variavel = variaveis.find(v => v.atributo == 'Valor_Total_Despesas_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(dinheiro.aplicarMascaraParaRealComPrefixo(orcamentoDetalhes.totalDespesas));
  });

  it('Deve obter o valor total dos itens', () => {
    let totalItens = orcamentoDetalhes.totalEquipamentos +
    orcamentoDetalhes.totalServicos +
    orcamentoDetalhes.totalMateriais;

    var variavel = variaveis.find(v => v.atributo == 'Valor_Total_Itens_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

    expect(variavel.conteudo()).toBe(dinheiro.aplicarMascaraParaRealComPrefixo(totalItens));
  });

  it('Deve obter o valor total dos equipamentos', () => {
    var variavel = variaveis.find(v => v.atributo == 'Valor_Total_Equipamentos_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(dinheiro.aplicarMascaraParaRealComPrefixo(orcamentoDetalhes.totalEquipamentos));
  });

  it('Deve obter o valor total dos servicos', () => {
    var variavel = variaveis.find(v => v.atributo == 'Valor_Total_Servicos_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(dinheiro.aplicarMascaraParaRealComPrefixo(orcamentoDetalhes.totalServicos));
  });

  it('Deve obter o valor total dos materiais', () => {
    var variavel = variaveis.find(v => v.atributo == 'Valor_Total_Materiais_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(dinheiro.aplicarMascaraParaRealComPrefixo(orcamentoDetalhes.totalMateriais));
  });

  it('Deve obter o valor total do orcamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Valor_Total_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(dinheiro.aplicarMascaraParaRealComPrefixo(orcamentoDetalhes.totalOrcamento));
  });

  it('Deve obter o status formatado do orcamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Status_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(STATUS_ORCAMENTO_LOCACAO[orcamentoDetalhes.status].descricao);
  });

  it('Deve obter o numero da revisão do orcamento', () => {
    var variavel = variaveis.find(v => v.atributo == 'Revisao_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.revisao);
  });

  it('Deve obter o objetivo do orcamento ', () => {
    var variavel = variaveis.find(v => v.atributo == 'Objetivo_Orcamento');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.descricao);
  });

});