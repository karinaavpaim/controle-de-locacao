import apiEndereco from '@/api/sistemas-gerais/endereco-api';
import EnderecoModel from '@/models/geral/endereco/endereco-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model';

async function obter(orcamento) {
  var enderecoEntrega = await _obterEnderecoEntrega(orcamento);
  var cliente = (orcamento && orcamento.cliente) || new PessoaModel();

  return [
    {
      nome: "Cliente",
      filhas: [
        {
          nome: "Código",
          atributo: "Codigo_Cliente",
          titulo: "Código do cliente",
          inline: true,
          conteudo: () => {
            return cliente.codigo || '';
          }
        },
        {
          nome: "Nome",
          atributo: "Nome_Cliente",
          titulo: "Nome do cliente",
          inline: true,
          conteudo: () => {
            return cliente.nome || '';
          }
        },
        {
          nome: "Nome curto",
          atributo: "Nome_Curto_Cliente",
          titulo: "Nome curto do cliente",
          inline: true,
          conteudo: () => {
            return cliente.nomeCurto || '';
          }
        },
        {
          nome: "CNPJ/CPF",
          atributo: "CNPJ_CPF_Cliente",
          titulo: "CNPJ/CPF do cliente",
          inline: true,
          conteudo: () => {
            return cliente.CPFouCNPJ || '';
          }
        },
        {
          nome: "Pessoa de contato",
          atributo: "Pessoa_De_Contato_No_Cliente",
          titulo: "Pessoa de contato no cliente",
          inline: true,
          conteudo: () => {
            return (orcamento.nomePessoaDeContatoCliente) ?
              orcamento.nomePessoaDeContatoCliente :
              '';
          }
        },
        {
          nome: "E-mail de contato",
          atributo: "Email_Pessoa_De_Contato_No_Cliente",
          titulo: "E-mail de contato no cliente",
          inline: true,
          conteudo: () => {
            return (orcamento.emailPessoaDeContatoCliente) ?
              orcamento.emailPessoaDeContatoCliente :
              '';
          }
        },
        {
          nome: "Telefone de contato",
          atributo: "Telefone_Pessoa_De_Contato_No_Cliente",
          titulo: "Telefone de contato no cliente",
          inline: true,
          conteudo: () => {
            return (orcamento.telefonePessoaDeContatoCliente) ?
              orcamento.telefonePessoaDeContatoCliente :
              '';
          }
        },
        {
          nome: "Endereço de entrega",
          atributo: "Endereco_Entrega_Cliente",
          titulo: "Endereço de entrega do cliente",
          inline: true,
          conteudo: () => {
            if (!enderecoEntrega.tipoNomeNumeroComplementoLogradouro || !enderecoEntrega.bairroCidadeUnidadeFederativaCep) {
              return '<span style="color:red">Não informado.</span>';
            }
            return `${enderecoEntrega.tipoNomeNumeroComplementoLogradouro} - ${enderecoEntrega.bairroCidadeUnidadeFederativaCep}`;
          }
        },
        {
          nome: "Inscrição Municipal",
          atributo: "Inscricao_Municipal_Cliente",
          titulo: "Inscrição Municipal do Cliente",
          inline: true,
          conteudo: () => {
            return enderecoEntrega.inscricaoMunicipal || '';
          }
        },
        {
          nome: "Inscrição Estadual",
          atributo: "Inscricao_Estadual_Cliente",
          titulo: "Inscrição Estadual do Cliente",
          inline: true,
          conteudo: () => {
            return enderecoEntrega.inscricaoEstadual || '';
          }
        },
      ]
    }
  ]
}

async function _obterEnderecoEntrega(orcamento) {
  if (!orcamento.cliente || !orcamento.cliente.identificador)
    return new EnderecoModel();

  try {
      // Consulta para obter os endereços da pessoa, pois no cliente dentro do orçamento vem apenas o endereço principal.
    var enderecos = await apiEndereco.localizarEnderecos(orcamento.cliente.identificador);
    var enderecoEntrega = enderecos.find(e => e.codigo == orcamento.codigoEnderecoEntrega);
    return new EnderecoModel(enderecoEntrega);
  } catch {
    return new EnderecoModel();
  }
}

export default { obter }