import ConfiguracaoModel from '@/models/faturamento/orcamento-locacao/configuracao/configuracao-model';
import SecaoGeralModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-geral-model';
import SecaoSetorModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-setor-model';
import SecaoOperacaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-operacao-model';
import SecaoMedicaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-medicao-model';
import SecaoExpedicaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-expedicao-model';
import SecaoFaturamentoDocumentoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-faturamento-documento-model';

describe('configuracao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificadorEmpresa",
      "secaoGeral",
      "secaoSetor",
      "secaoOperacao",
      "secaoMedicao",
      "secaoExpedicao",
      "secaoFaturamentoDocumento",
    ];

    const configuracaoModel = new ConfiguracaoModel();
    const configuracaoModelKeys = Object.keys(configuracaoModel);

    Object.keys(configuracaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(configuracaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let configuracaoModel = new ConfiguracaoModel();
    expect(configuracaoModel.identificadorEmpresa).toBeFalsy();
    expect(configuracaoModel.secaoGeral).toBeInstanceOf(SecaoGeralModel);
    expect(configuracaoModel.secaoSetor).toBeInstanceOf(SecaoSetorModel);
    expect(configuracaoModel.secaoOperacao).toBeInstanceOf(SecaoOperacaoModel);
    expect(configuracaoModel.secaoMedicao).toBeInstanceOf(SecaoMedicaoModel);
    expect(configuracaoModel.secaoExpedicao).toBeInstanceOf(SecaoExpedicaoModel);
    expect(configuracaoModel.secaoFaturamentoDocumento).toBeInstanceOf(SecaoFaturamentoDocumentoModel);

    configuracaoModel = new ConfiguracaoModel({
      identificadorEmpresa: "01",
      secaoGeral: {},
      secaoSetor: {},
      secaoOperacao: {},
      secaoMedicao: {},
      secaoExpedicao: {},
      secaoFaturamentoDocumento: {}
    })

    expect(typeof configuracaoModel.identificadorEmpresa).toBe("string")
    expect(typeof configuracaoModel.secaoGeral).toBe("object")
    expect(typeof configuracaoModel.secaoSetor).toBe("object")
    expect(typeof configuracaoModel.secaoOperacao).toBe("object")
    expect(typeof configuracaoModel.secaoMedicao).toBe("object")
    expect(typeof configuracaoModel.secaoExpedicao).toBe("object")
    expect(typeof configuracaoModel.secaoFaturamentoDocumento).toBe("object")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois o modelo está vazio', () => {
      let configuracaoModel = new ConfiguracaoModel();
      expect(configuracaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar false pois o setor principal e o de expedição estão iguais', () => {
      let configuracaoModel = new ConfiguracaoModel({
        identificadorEmpresa: "01",
        secaoGeral: {
          identificadorProdutoPadraoBimer: "01",
          utilizarAdicionaisPersonalizados: true,
          codigoEmpresaPadraoBimer: "01"
        },
        secaoSetor: {
          setorEstoquePrincipal: "Principal",
          setorEstoqueExpedicao: "Principal"
        },
        secaoOperacao: {
          operacaoExpedicaoDosEquipamentos: "texto",
          operacaoExpedicaoDosMateriais: "texto",
          operacaoFaturamentoDosEquipamentos: "texto",
          operacaoFaturamentoDosServicos: "texto",
          operacaoFaturamentoDosMateriais: "texto"
        },
        secaoMedicao: {
          gerarPedidoLiberadoNaMedicao: true,
          primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
          segundaPrioridadeSomaDasDespesasNaMedicao: "Material",
          terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
        },
        secaoExpedicao: {
          gerarPedidoLiberadoNaExpedicao: true,
          tabelaPrecoExpedicao: "texto"
        },
        secaoFaturamentoDocumento: {
          tiposDocumentoNotaFiscal: [],
          tiposDocumentoNotaFiscalServico: [],
          tiposDocumentoOrdemEntrega: []
        }
      })
      expect(configuracaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar false pois a primeira e segunda prioridade na soma das despesas estão iguais', () => {
      let configuracaoModel = new ConfiguracaoModel({
        identificadorEmpresa: "01",
        secaoGeral: {
          identificadorProdutoPadraoBimer: "01",
          utilizarAdicionaisPersonalizados: true,
          codigoEmpresaPadraoBimer: "01"
        },
        secaoSetor: {
          setorEstoquePrincipal: "Principal",
          setorEstoqueExpedicao: "Principal"
        },
        secaoOperacao: {
          operacaoExpedicaoDosEquipamentos: "texto",
          operacaoExpedicaoDosMateriais: "texto",
          operacaoFaturamentoDosEquipamentos: "texto",
          operacaoFaturamentoDosServicos: "texto",
          operacaoFaturamentoDosMateriais: "texto"
        },
        secaoMedicao: {
          gerarPedidoLiberadoNaMedicao: true,
          primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
          segundaPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
          terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
        },
        secaoExpedicao: {
          gerarPedidoLiberadoNaExpedicao: true,
          tabelaPrecoExpedicao: "texto"
        },
        secaoFaturamentoDocumento: {
          tiposDocumentoNotaFiscal: [],
          tiposDocumentoNotaFiscalServico: [],
          tiposDocumentoOrdemEntrega: []
        }
      })
      expect(configuracaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo está completo', () => {
      let configuracaoModel = new ConfiguracaoModel({
        identificadorEmpresa: "01",
        secaoGeral: {
          identificadorProdutoPadraoBimer: "01",
          utilizarAdicionaisPersonalizados: true,
          codigoEmpresaPadraoBimer: "01"
        },
        secaoSetor: {
          setorEstoquePrincipal: "Principal",
          setorEstoqueExpedicao: "Expedicao"
        },
        secaoOperacao: {
          operacaoExpedicaoDosEquipamentos: "texto",
          operacaoExpedicaoDosMateriais: "texto",
          operacaoFaturamentoDosEquipamentos: "texto",
          operacaoFaturamentoDosServicos: "texto",
          operacaoFaturamentoDosMateriais: "texto"
        },
        secaoMedicao: {
          gerarPedidoLiberadoNaMedicao: true,
          primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
          segundaPrioridadeSomaDasDespesasNaMedicao: "Material",
          terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
        },
        secaoExpedicao: {
          gerarPedidoLiberadoNaExpedicao: true,
          tabelaPrecoExpedicao: "texto"
        },
        secaoFaturamentoDocumento: {
          tiposDocumentoNotaFiscal: [],
          tiposDocumentoNotaFiscalServico: [],
          tiposDocumentoOrdemEntrega: []
        }
      })
      expect(configuracaoModel.modeloValido()).toBeTruthy();
    })
  });
});