import ItemMedicaoLocacaoModel from '@/models/estoque/medicao/item-medicao-locacao-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import DespesaMedicaoLocacaoModel from './despesa-medicao-locacao-model';

export default class MedicaoLocacaoModel {
  constructor(obj) {
    obj = obj || {};
    this.codigoLocacao = obj.codigoLocacao;
    this.identificadorLocacao = obj.identificadorLocacao;
    this.dataReferencia = obj.dataReferencia;
    this.dataInicioContrato = obj.dataInicioContrato;
    this.dataTerminoContrato = obj.dataTerminoContrato;
    this.descricao = obj.descricao;
    this.possuiMaterialOuEquipamento = obj.possuiMaterialOuEquipamento;
    this.codigoEnderecoEntrega = obj.codigoEnderecoEntrega;
    this.cliente = obj.cliente && new PessoaModel(obj.cliente);
    this.itens = (obj.itens && obj.itens.map(i => new ItemMedicaoLocacaoModel(i))) || [];
    this.despesas = (obj.despesas && obj.despesas.map(i => new DespesaMedicaoLocacaoModel(i))) || [];
    this.nomePessoaDeContatoCliente = obj.nomePessoaDeContatoCliente;
    this.emailPessoaDeContatoCliente = obj.emailPessoaDeContatoCliente;
    this.telefonePessoaDeContatoCliente = obj.telefonePessoaDeContatoCliente;
  }

  obterErrosDaMedicaoDeLocacao() {
    return this.
    itens.
    reduce((acumulador, item) => acumulador.concat(item.obterErrosNoItemDaMedicaoAregistrar()), [])
      .concat(
        this.despesas.reduce((acumulador, despesa) => acumulador.concat(despesa.obterErrosNaDespesaDaMedicaoAregistrar()), [])
      );
  }

  atualizarItensDespesasPorLocacaoCache(locacaoCache) {
    let medicaoSalva = new MedicaoLocacaoModel(JSON.parse(locacaoCache.valor));

    let itensMedicaoSalva = medicaoSalva.itens;
    this.itens.forEach(item => {
      item.preecherDesmembramentosViaCacheItem(
        itensMedicaoSalva.find(
          itemSalvo => itemSalvo.identificadorItemLocacao === item.identificadorItemLocacao
        )
      )
    });

    let despesasMedicaoSalva = medicaoSalva.despesas;
    this.despesas.forEach(despesa => {
      despesa.preecherDesmembramentosViaCacheItem(
        despesasMedicaoSalva.find(
          despesaSalva => despesaSalva.identificadorItemLocacao === despesa.identificadorItemLocacao
        )
      )
    });
  }
}