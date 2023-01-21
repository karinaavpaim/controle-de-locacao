'use strict';
import apiEmpresa from '@/api/sistemas-gerais/empresa-api';
import EmpresaModel from '@/models/geral/empresa-model'

async function _obterEmpresa(orcamento) {
  if (!orcamento.empresa || !orcamento.empresa.identificador)
    return new EmpresaModel();

  try {
    var empresas = await apiEmpresa.localizarEmpresa(orcamento.empresa.identificador);
    return new EmpresaModel(empresas[0]);
  } catch {
    return new EmpresaModel();
  }
}

async function obter(orcamento) {
  var empresa = await _obterEmpresa(orcamento);

  return [
    {
      nome: "Empresa",
      filhas: [
        {
          nome: "Código",
          atributo: "Codigo_Empresa",
          titulo: "Código da empresa",
          inline: true,
          conteudo: () => {
           return empresa.codigo || '';
          }
        },
        {
          nome: "Nome",
          atributo: "Nome_Empresa",
          titulo: "Nome da empresa",
          inline: true,
          conteudo: () => {
            return empresa.nome || '';
          }
        },
        {
          nome: "Nome curto",
          atributo: "Nome_Curto_Empresa",
          titulo: "Nome curto da empresa",
          inline: true,
          conteudo: () => {
            return empresa.nomeCurto || '';
          }
        },
        {
          nome: "CNPJ",
          atributo: "CNPJ_Empresa",
          titulo: "CNPJ da Empresa",
          inline: true,
          conteudo: () => {
            return empresa.CNPJ || '';
          }
        },
        {
          nome: "Inscrição Estadual",
          atributo: "Iscricao_Estadual_Empresa",
          titulo: "Inscrição Estadual da Empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco && empresa.endereco.inscricaoEstadual) || '';
          }
        },
        {
          nome: "Inscrição Municipal",
          atributo: "Iscricao_Municipal_Empresa",
          titulo: "Inscrição Municipal da Empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco && empresa.endereco.inscricaoMunicipal) || '';
          }
        },
        {
          nome: "CEP",
          atributo: "CEP_Empresa",
          titulo: "CEP da Empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco && empresa.endereco.cep) || '';
          }
        },
        {
          nome: "Telefone Fixo",
          atributo: "Telefone_Fixo_Empresa",
          titulo: "Telefone fixo da empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco
              && Array.isArray(empresa.endereco.pessoasDeContato)
              && empresa.endereco.pessoasDeContato[0]
              && empresa.endereco.pessoasDeContato[0].telefoneFixo) || '';
          }
        },
        {
          nome: "Telefone Celular",
          atributo: "Telefone_Celular_Empresa",
          titulo: "Telefone celular da empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco
              && Array.isArray(empresa.endereco.pessoasDeContato)
              && empresa.endereco.pessoasDeContato[0]
              && empresa.endereco.pessoasDeContato[0].telefoneCelular) || '';
          }
        },
        {
          nome: "E-mail do contato principal",
          atributo: "Email_Contato_Principal_Empresa",
          titulo: "Email do contato principal da empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco
              && Array.isArray(empresa.endereco.pessoasDeContato)
              && empresa.endereco.pessoasDeContato[0]
              && empresa.endereco.pessoasDeContato[0].email) || '';
          }
        },
        {
          nome: "Endereço",
          atributo: "Endereco_Empresa",
          titulo: "Endereço da Empresa",
          inline: true,
          conteudo: () => {
            return (empresa.endereco)
              ? `${empresa.endereco.tipoNomeNumeroComplementoLogradouro} - ${empresa.endereco.bairroCidadeUnidadeFederativaCep}`
              : '<span style="color:red">Não informado.</span>';
          }
        },
      ]
    }
  ];
}

export default { obter };