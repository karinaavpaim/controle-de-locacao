import orcamentoDetalhes from '../../../../tests/fakes/faturamento/controle-de-locacao/orcamento-locacao-detalhes.json';
import variaveisDaEmpresa from '../../../../src/plugins/editor-tinymce/composicao-variaveis/variaveis-empresa';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model.js';
import apiEmpresa from '@/api/sistemas-gerais/empresa-api';
import EmpresaModel from '@/models/geral/empresa-model';

describe('Das variáveis da empresa - ', () => {
  var mockApiEmpresa = jest.spyOn(apiEmpresa, 'localizarEmpresa')
    .mockImplementation(() => Promise.resolve([orcamentoDetalhes.empresa]));

  let variaveisEmpresa = [];
  let variaveisNaoInformada = [];
  let empresa = new EmpresaModel(orcamentoDetalhes.empresa);

  beforeEach(async () => {
    var listaVariaveis = await variaveisDaEmpresa.obter(new OrcamentoLocacaoModel(orcamentoDetalhes));
    variaveisEmpresa = (Array.isArray(listaVariaveis) && listaVariaveis[0] && listaVariaveis[0].filhas) || [];
    listaVariaveis = await variaveisDaEmpresa.obter(new OrcamentoLocacaoModel());
    variaveisNaoInformada = (Array.isArray(listaVariaveis) && listaVariaveis[0] && listaVariaveis[0].filhas) || [];
  });

  it('0: Codigo_Empresa - deve obter o código da empresa ', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Codigo_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.codigo);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Codigo_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('1: Nome_Empresa - Deve obter o nome da empresa ', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Nome_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.nome);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Nome_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('2: Nome_Curto_Empresa - Deve obter o nome curto da empresa ', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Nome_Curto_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.nomeCurto);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Nome_Curto_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('3: CNPJ_Empresa - Deve obter o CNPJ da empresa ', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'CNPJ_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.CNPJ);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'CNPJ_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('4: Iscricao_Estadual_Empresa - Deve obter a inscrição estadual da empresa ou string vazia', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Iscricao_Estadual_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.endereco.inscricaoEstadual);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Iscricao_Estadual_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('5: Iscricao_Municipal_Empresa - Deve obter a inscrição municipal da empresa ou string vazia', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Iscricao_Municipal_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.endereco.inscricaoMunicipal);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Iscricao_Municipal_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('6: CEP_Empresa - Deve obter CEP da empresa ou string vazia', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'CEP_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.endereco.cep);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'CEP_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('7: Telefone_Fixo_Empresa - Deve obter o telerone da empresa ou string vazia', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Telefone_Fixo_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.endereco.pessoasDeContato[0].telefoneFixo);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Telefone_Fixo_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('8: Telefone_Celular_Empresa - Deve obter o telefone celular da empresa ou string vazia', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Telefone_Celular_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.endereco.pessoasDeContato[0].telefoneCelular);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Telefone_Celular_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('9: Email_Contato_Principal_Empresa - Deve obter o email da empresa ou string vazia', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Email_Contato_Principal_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe(empresa.endereco.pessoasDeContato[0].email);

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Email_Contato_Principal_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toBe('');
  });

  it('10: Endereco_Empresa - Deve obter o endereco da empresa ', () => {
    var variavel = variaveisEmpresa.find(v => v.atributo == 'Endereco_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);

    var conteudo = variavel.conteudo().toUpperCase();
    expect(conteudo).toContain(empresa.endereco.nomeLogradouro.toUpperCase());
    expect(conteudo).toContain(empresa.endereco.numeroLogradouro.toUpperCase());
    expect(conteudo).toContain(empresa.endereco.complemento.toUpperCase());
    expect(conteudo).toContain(empresa.endereco.bairro.nome.toUpperCase());
    expect(conteudo).toContain(empresa.endereco.cidade.nome.toUpperCase());
    expect(conteudo).toContain(empresa.endereco.cidade.UF.sigla.toUpperCase());

    variavel = variaveisNaoInformada.find(v => v.atributo == 'Endereco_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toContain('Não informado');
  });

  it('11: Deve retornar variáveis vazias se não conseguir consultar a empresa.', async () => {
    mockApiEmpresa.mockClear();
    jest.spyOn(apiEmpresa, 'localizarEmpresa').mockImplementation(() => Promise.reject());

    var listaVariaveis = await variaveisDaEmpresa.obter(new OrcamentoLocacaoModel(orcamentoDetalhes));
    var variaveisVazias = (Array.isArray(listaVariaveis) && listaVariaveis[0] && listaVariaveis[0].filhas) || [];

    var variavel = variaveisVazias.find(v => v.atributo == 'Endereco_Empresa');
    expect(variavel).not.toBeUndefined();
    expect(variavel.conteudo).toBeInstanceOf(Function);
    expect(variavel.conteudo()).toContain('Não informado');
  });
});