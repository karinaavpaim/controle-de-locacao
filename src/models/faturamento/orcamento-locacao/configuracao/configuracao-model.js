'use strict';

import SecaoGeralModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-geral-model';
import SecaoSetorModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-setor-model';
import SecaoOperacaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-operacao-model';
import SecaoMedicaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-medicao-model';
import SecaoExpedicaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-expedicao-model';
import SecaoFaturamentoDocumentoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-faturamento-documento-model';

export default class ConfiguracaoLocacaoModel {
  constructor(dados) {
    dados = dados || {};
    this.identificadorEmpresa = dados.identificadorEmpresa;
    this.secaoGeral = new SecaoGeralModel(dados.secaoGeral);
    this.secaoSetor = new SecaoSetorModel(dados.secaoSetor);
    this.secaoOperacao = new SecaoOperacaoModel(dados.secaoOperacao);
    this.secaoMedicao = new SecaoMedicaoModel(dados.secaoMedicao);
    this.secaoExpedicao = new SecaoExpedicaoModel(dados.secaoExpedicao);
    this.secaoFaturamentoDocumento = new SecaoFaturamentoDocumentoModel(dados.secaoFaturamentoDocumento);
  }

  modeloValido() {
    return (!!this.identificadorEmpresa &&
            this.secaoGeral.modeloValido() &&
            this.secaoSetor.modeloValido() &&
            this.secaoOperacao.modeloValido() &&
            this.secaoMedicao.modeloValido() &&
            this.secaoExpedicao.modeloValido() &&
            this.secaoFaturamentoDocumento.modeloValido());
  }
}