import MedicaoLocacaoModel from '@/models/estoque/medicao/medicao-locacao-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';

describe('medicao-locacao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "codigoLocacao",
      "identificadorLocacao",
      "dataReferencia",
      "dataInicioContrato",
      "dataTerminoContrato",
      "descricao",
      "possuiMaterialOuEquipamento",
      "codigoEnderecoEntrega",
      "cliente",
      "itens",
      "despesas",
      "nomePessoaDeContatoCliente",
      "emailPessoaDeContatoCliente",
      "telefonePessoaDeContatoCliente"
    ];

    const medicaoLocacaoModel = new MedicaoLocacaoModel();
    const medicaoLocacaoModelKeys = Object.keys(medicaoLocacaoModel);

    Object.keys(medicaoLocacaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(medicaoLocacaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let medicaoLocacaoModel = new MedicaoLocacaoModel();
    expect(medicaoLocacaoModel.codigoLocacao).toBeUndefined();
    expect(medicaoLocacaoModel.identificadorLocacao).toBeUndefined();
    expect(medicaoLocacaoModel.dataReferencia).toBeUndefined();
    expect(medicaoLocacaoModel.dataInicioContrato).toBeUndefined();
    expect(medicaoLocacaoModel.dataTerminoContrato).toBeUndefined();
    expect(medicaoLocacaoModel.descricao).toBeUndefined();
    expect(medicaoLocacaoModel.cliente).toBeUndefined();
    expect(medicaoLocacaoModel.itens).toBeInstanceOf(Array);
    expect(medicaoLocacaoModel.despesas).toBeInstanceOf(Array);

    medicaoLocacaoModel = new MedicaoLocacaoModel({
      codigoLocacao: "01",
      identificadorLocacao: "02",
      dataReferencia: "2012-01-07",
      dataInicioContrato: "2012-01-07",
      dataTerminoContrato: "2012-01-14",
      descricao: "Teste unitario",
      cliente: {nome: "teste unitario"},
      itens: [{identificadorItemLocacao: "1"}],
      despesas: [{identificador: 1}]
    })

    expect(typeof medicaoLocacaoModel.codigoLocacao).toBe("string");
    expect(typeof medicaoLocacaoModel.identificadorLocacao).toBe("string");
    expect(typeof medicaoLocacaoModel.dataReferencia).toBe("string");
    expect(typeof medicaoLocacaoModel.dataInicioContrato).toBe("string");
    expect(typeof medicaoLocacaoModel.dataTerminoContrato).toBe("string");
    expect(typeof medicaoLocacaoModel.descricao).toBe("string");
    expect(medicaoLocacaoModel.cliente).toBeInstanceOf(PessoaModel)
    expect(medicaoLocacaoModel.itens).toBeInstanceOf(Array);
    expect(medicaoLocacaoModel.despesas).toBeInstanceOf(Array);

  });

  describe("obterErrosDaMedicaoDeLocacao", ()=>{
    it('deve identificar que NÃO ha erros no modelo e submodelos', () => {
      const medicaoLocacaoModel = new MedicaoLocacaoModel();
      const erros = medicaoLocacaoModel.obterErrosDaMedicaoDeLocacao();
      expect(erros).toBeInstanceOf(Array);
      expect(erros.length).toBe(0);
    });

    it('deve identificar que ha erros nos submodelos de itens e despesas', () => {
      const medicaoLocacaoModel = new MedicaoLocacaoModel({
        codigoLocacao: "01",
        identificadorLocacao: "02",
        dataReferencia: "2012-01-07",
        dataInicioContrato: "2012-01-07",
        dataTerminoContrato: "2012-01-14",
        descricao: "Teste unitario",
        cliente: {nome: "teste unitario"},
        itens: [{identificadorItemLocacao: "1", categoria: "EQUIPAMENTO", produto:{codigo: 1}, desmembramentos:[{quantidadeMaxima: 1, quantidadeAMedir: 2}]}],
        despesas: [{identificador: 1, naturezaLancamento:{codigo:1}}]
      })
      const erros = medicaoLocacaoModel.obterErrosDaMedicaoDeLocacao();
      expect(erros).toBeInstanceOf(Array);
      expect(erros.length).toBe(2);
    });
  });
});