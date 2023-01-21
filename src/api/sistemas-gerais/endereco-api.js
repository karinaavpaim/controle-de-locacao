import axiosConfig from '@/api/axios-config.js';
import EnderecoModel from '@/models/geral/endereco/endereco-model';

function localizarEnderecos(identificadorDaPessoa) {
  identificadorDaPessoa = identificadorDaPessoa || "";
  let query = `{
    dados: endereco(identificadorDaPessoa: "%1") {
      ativo,
      codigo,
      nomeLogradouro,
      numeroLogradouro,
      inscricaoEstadual,
      inscricaoMunicipal,
      complemento,
      bairro {
        nome
      },
      cidade {
        nome,
        UF {
          nome
        }
      },
      tipoNomeNumeroComplementoLogradouro,
      bairroCidadeUnidadeFederativaCep,
      pessoasDeContato {
        nome,
        email,
        telefoneFixo,
        telefoneCelular,
        contatoPrincipal,
        pessoaDeContato
      }
      tiposEndereco
    }
  }`.replace(/[\n]*[ ]*/gm, '').replace("%1", identificadorDaPessoa.replace(/"/g, "\\\""));

  return axiosConfig.executarQueryGraphQL(query, "dados", EnderecoModel);
}

export default { 
  localizarEnderecos
};