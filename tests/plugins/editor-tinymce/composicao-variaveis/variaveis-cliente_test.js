import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json'
import variaveisDoCliente from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-cliente';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import apiEndereco from '@/api/sistemas-gerais/endereco-api';

describe('Variáveis do cliente', () => {
  var mockApiEndereco = jest.spyOn(apiEndereco, 'localizarEnderecos')
    .mockImplementation(() => Promise.resolve(orcamentoDetalhes.cliente.enderecos));

  let variaveisCliente = [];
  let variaveisNaoInformada = [];
  let enderecoEntrega = {};

  beforeEach(async () => {
    let listaVariaveis = await variaveisDoCliente.obter(new OrcamentoLocacaoModel(orcamentoDetalhes));
    variaveisCliente = (Array.isArray(listaVariaveis) && listaVariaveis[0] && listaVariaveis[0].filhas) || [];

    enderecoEntrega = orcamentoDetalhes.cliente.enderecos.filter(e => e.codigo == orcamentoDetalhes.codigoEnderecoEntrega);
    enderecoEntrega = (enderecoEntrega.length < 1) ? '' : enderecoEntrega[0];

    listaVariaveis = await variaveisDoCliente.obter(new OrcamentoLocacaoModel());
    variaveisNaoInformada = (Array.isArray(listaVariaveis) && listaVariaveis[0] && listaVariaveis[0].filhas) || [];
  });

  it('0: Codigo_Cliente - Deve obter o código do cliente ', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'Codigo_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.cliente.codigo);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Codigo_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('1: Nome_Cliente - Deve obter o nome do cliente ', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'Nome_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.cliente.nome);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Nome_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('2: Nome_Curto_Cliente - Deve obter o nome curto do cliente ', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'Nome_Curto_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.cliente.nomeCurto);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Nome_Curto_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('3: CNPJ_CPF_Cliente - Deve obter o CNPJ/CPF do cliente ', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'CNPJ_CPF_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.cliente.CPFouCNPJ);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'CNPJ_CPF_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('4: Pessoa_De_Contato_No_Cliente - Deve obter a pessoa de contato no cliente', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'Pessoa_De_Contato_No_Cliente');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.nomePessoaDeContatoCliente);
  });

  it('5: Pessoa_De_Contato_No_Cliente - Deve retornar uma string vazia quando a pessoa de contato no cliente não estiver definida.', () => {
    var variavel = variaveisNaoInformada.find(v => v.atributo == 'Pessoa_De_Contato_No_Cliente');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('6: Email_Pessoa_De_Contato_No_Cliente - Deve retornar uma string vazia quando o email da pessoa de contato não estiver definido.', () => {
    var variavel = variaveisNaoInformada.find(v => v.atributo == 'Email_Pessoa_De_Contato_No_Cliente');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('7: Email_Pessoa_De_Contato_No_Cliente - Deve obter o e-mail da pessoa de contato no cliente.', async () => {
    let orcamentoEmailPessoa = new OrcamentoLocacaoModel(orcamentoDetalhes);
    orcamentoEmailPessoa.emailPessoaDeContatoCliente = 'email@teste.com';

    let variaveisEmailPessoa = (await variaveisDoCliente.obter(orcamentoEmailPessoa))[0].filhas;
    let variavel = variaveisEmailPessoa.find(v => v.atributo == 'Email_Pessoa_De_Contato_No_Cliente');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoEmailPessoa.emailPessoaDeContatoCliente);
  });

  it('8: Telefone_Pessoa_De_Contato_No_Cliente - Deve retornar uma string vazia quando o telefone da pessoa de contato não estiver definido.', () => {
    var variavel = variaveisNaoInformada.find(v => v.atributo == 'Telefone_Pessoa_De_Contato_No_Cliente');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('9: Telefone_Pessoa_De_Contato_No_Cliente - Deve obter o telefone da pessoa de contato do endereço do cliente ', async () => {
    let orcamentoTelefonePessoa = new OrcamentoLocacaoModel(orcamentoDetalhes);
    orcamentoTelefonePessoa.telefonePessoaDeContatoCliente = '(21) 2233-4455';

    let variaveisTelefonePessoa = (await variaveisDoCliente.obter(orcamentoTelefonePessoa))[0].filhas;
    let variavel = variaveisTelefonePessoa.find(v => v.atributo == 'Telefone_Pessoa_De_Contato_No_Cliente');

    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoTelefonePessoa.telefonePessoaDeContatoCliente);
  });

  it('10: Inscricao_Municipal_Cliente - Deve obter a inscrição municipal do cliente ', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'Inscricao_Municipal_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.cliente.enderecos[0].inscricaoMunicipal);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Inscricao_Municipal_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('11: Inscricao_Estadual_Cliente - Deve obter a inscrição estadual do cliente ', () => {
    var variavel = variaveisCliente.find(v => v.atributo == 'Inscricao_Estadual_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(orcamentoDetalhes.cliente.enderecos[0].inscricaoEstadual);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Inscricao_Estadual_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('12: Endereco_Entrega_Cliente - Deve obter o endereço de entrega do cliente ', () => {
    var textoEndereco = `${enderecoEntrega.tipoNomeNumeroComplementoLogradouro} - ${enderecoEntrega.bairroCidadeUnidadeFederativaCep}`.toUpperCase();
    var variavel = variaveisCliente.find(v => v.atributo == 'Endereco_Entrega_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(textoEndereco);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Endereco_Entrega_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toContain('Não informado');
  });


  it('13: Deve retornar variáveis vazias se não conseguir consultar o endereço.', async () => {
    mockApiEndereco.mockClear();
    jest.spyOn(apiEndereco, 'localizarEnderecos').mockImplementation(() => Promise.reject());

    var listaVariaveis = await variaveisDoCliente.obter(new OrcamentoLocacaoModel(orcamentoDetalhes));
    var variaveisVazias = (Array.isArray(listaVariaveis) && listaVariaveis[0] && listaVariaveis[0].filhas) || [];

    var variavel = variaveisVazias.find(v => v.atributo == 'Endereco_Entrega_Cliente');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toContain('Não informado');
  });
});