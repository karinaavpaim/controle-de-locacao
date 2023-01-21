'use strict';

import DespesaModel from '@/models/faturamento/orcamento-locacao/despesa-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import EmpresaModel from '@/models/geral/empresa-model';
import ItemOrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/item-orcamento-locacao-model';
import PrazoModel from '@/models/financeiro/prazo-model';
import AdicionalPersonalizadoModel from './adicional-personalizado-model';
import ItemAdicionalPersonalizadoOrcamentoModel from './item-adicional-personalizado-orcamento-model';
import FormaPagamentoModel from '@/models/financeiro/forma-pagamento-model';
import moment from 'moment';

export default class OrcamentoLocacaoModel {
  constructor(obj) {
    obj = obj || {};

    this.codigo = obj.codigo;
    this.codigoEnderecoCobranca = obj.codigoEnderecoCobranca;
    this.codigoEnderecoDestinatario = obj.codigoEnderecoDestinatario;
    this.codigoEnderecoEntrega = obj.codigoEnderecoEntrega;
    this.dataReferencia = obj.dataReferencia;
    this.dataEmissao = obj.dataEmissao;
    this.dataInicioContrato = obj.dataInicioContrato;
    this.dataTerminoContrato = obj.dataTerminoContrato;
    this.descricao = obj.descricao;
    this.despesas = (obj.despesas && obj.despesas.map(d => new DespesaModel(d))) || [];
    this.identificador = obj.identificador;
    this.idEntidadeOrigem = obj.idEntidadeOrigem;
    this.cliente = obj.cliente && new PessoaModel(obj.cliente);
    this.empresa = obj.empresa && new EmpresaModel(obj.empresa);
    this.itens = (obj.itens && obj.itens.map(i => new ItemOrcamentoLocacaoModel(i))) || [];
    this.prazo = obj.prazo && new PrazoModel(obj.prazo);
    this.formaPagamentoEntrada = obj.formaPagamentoEntrada && new FormaPagamentoModel(obj.formaPagamentoEntrada);
    this.formaPagamentoParcelas = obj.formaPagamentoParcelas && new FormaPagamentoModel(obj.formaPagamentoParcelas);
    this.nomePessoaDeContatoCliente = obj.nomePessoaDeContatoCliente;
    this.emailPessoaDeContatoCliente = obj.emailPessoaDeContatoCliente;
    this.telefonePessoaDeContatoCliente = obj.telefonePessoaDeContatoCliente;
    this.observacao = obj.observacao;
    this.possuiItemComProdutoPadrao = obj.possuiItemComProdutoPadrao;
    this.possuiMaterialOuEquipamento = obj.possuiMaterialOuEquipamento;
    this.possuiItemMovimentado = obj.possuiItemMovimentado;
    /*
    * @TODO Remover esta propriedade futuramente. Ela eh um facilitador e nao deve fazer parte do orcamento.
    * Remover de TODO frontend e tambem do GRAPHQL
    */
    // this.quantidadeDiariasPadrao = obj.quantidadeDiariasPadrao || 1;
    this.revisao = obj.revisao;
    this.status = obj.status;
    this.totalEquipamentos = obj.totalEquipamentos || 0;
    this.totalServicos = obj.totalServicos || 0;
    this.totalMateriais = obj.totalMateriais || 0;
    this.totalDespesas = obj.totalDespesas || 0;
    this.totalOrcamento = obj.totalOrcamento || 0;
    this.adicionalPersonalizadoItens = (obj.adicionalPersonalizadoItens && obj.adicionalPersonalizadoItens.map(
      i => new ItemAdicionalPersonalizadoOrcamentoModel(i))) || [];
    this.adicionalPersonalizado = obj.adicionalPersonalizado && new AdicionalPersonalizadoModel(obj.adicionalPersonalizado);
  }

  modeloValidoParaGravacao() {
    return !!(this.empresa && 
              this._validarItens() && 
              this._validarInformacoesIniciais() &&
              this._validarLancamentos())
  }

  _validarInformacoesIniciais(){
    let valido = !!(this.cliente && this.dataReferencia);
    if (this.dataInicioContrato && this.dataTerminoContrato)
      valido = valido && moment(this.dataInicioContrato).isSameOrBefore(this.dataTerminoContrato);
    return valido;
  }

  _validarItens(){
    return !!(this.itens.length > 0);
  }

  _validarLancamentos(){
    // Lançamentos não são obrigatorios
    return true;
  }

  calcularERetornarValoresItens() {
    return this.itens.reduce((acumulador, item) => {
      acumulador.valorTotalEquipamentos += item.categoria == 'EQUIPAMENTO' ? item.calcularValorTotalComoEquipamento() : 0;
      acumulador.valorTotalServicos += item.categoria == 'SERVICO' ? item.calcularValorTotalComoServico() : 0;
      acumulador.valorTotalMateriais += item.categoria == 'MATERIAL' ? item.calcularValorTotalComoMaterial() : 0;
      acumulador.valorTotalItens += item.valorTotalItem;
      return acumulador;
    }, {
      valorTotalEquipamentos: 0,
      valorTotalServicos: 0,
      valorTotalMateriais: 0,
      valorTotalItens: 0
    });
  }

  calcularERetornarValoresDespesas() {
    return this.despesas.reduce((acumulador, despesa) => {
      acumulador.valorTotalDespesa += despesa.calcularValorTotalComoDespesa();
      return acumulador;
    }, {
      valorTotalDespesa: 0
    });
  }

  calcularERetornarValoresRepasses() {
    let repasses = this.retornarRepassesComTotais();
    return repasses.reduce((acumulador, repasse) => {
      acumulador.valorTotalRepasses += repasse.valorTotal;
      return acumulador;
    }, {
      valorTotalRepasses: 0
    })
  }

  retornarRepassesComTotais() {
    let self = this;

    let result = (this.itens.length > 0)
      ? this.itens[0]
      : [];

    return (result.length < 1)
      ? []
      : this.itens[0].repasses.map((r) => {
        return {
          repasse: r,
          valorTotal: ((self.totalOrcamento / 100) * r.aliquotaDuplicata +
            (self.totalOrcamento / 100) * r.aliquotaFaturamento)
        }
      })
  }

  obterEnderecoEntregaSelecionadoPeloUsuario() {
    if (this.cliente && this.cliente.enderecos) {
      let endereco = this.cliente.enderecos.filter(e => e.codigo === this.codigoEnderecoEntrega)[0];
      return (endereco) ? `${endereco.tipoNomeNumeroComplementoLogradouro} - ${endereco.bairroCidadeUnidadeFederativaCep}` : '';
    }
  }

  calcularAdicionaisPersonalizados() {
    let aliquotas = this.adicionalPersonalizado && this.adicionalPersonalizado.obterTotaisDeAliquotasPorCategoria();

    if (this.itens.length) {
      this.itens.map(item => item.calcularValorAdicionalPersonalizado(aliquotas));
    }

    if (this.despesas.length) {
      this.despesas.map(despesa => despesa.calcularValorAdicionalPersonalizado(aliquotas))
    }
  }
}