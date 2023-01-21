import EnderecoModel from '@/models/geral/endereco/endereco-model';
import BairroModel from '@/models/geral/endereco/bairro-model';
import CidadeModel from '@/models/geral/endereco/cidade-model';
import PessoaDeContatoModel from '@/models/geral/pessoa/pessoa-de-contato-model';

describe('endereco-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "ativo",
      "bairro",
      "bairroCidadeUnidadeFederativaCep",
      "cep",
      "cidade",
      "codigoSuframa",
      "codigo",
      "complemento",
      "inscricaoEstadual",
      "inscricaoMunicipal",
      "latitude",
      "longitude",
      "nomeLogradouro",
      "numeroLogradouro",
      "observacao",
      "pessoasDeContato",
      "tipoNomeNumeroComplementoLogradouro",
      "tiposEndereco",
      "contatoPrincipal"
    ];

    const enderecoModel = new EnderecoModel();
    const enderecoModelKeys = Object.keys(enderecoModel);

    Object.keys(enderecoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(enderecoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let enderecoModel = new EnderecoModel();
    expect(enderecoModel.ativo).toBeFalsy();
    expect(enderecoModel.bairro).toBeInstanceOf(BairroModel);
    expect(enderecoModel.bairroCidadeUnidadeFederativaCep).toBeUndefined();
    expect(enderecoModel.cep).toBeUndefined();
    expect(enderecoModel.cidade).toBeInstanceOf(CidadeModel);
    expect(enderecoModel.codigoSuframa).toBeUndefined();
    expect(enderecoModel.codigo).toBeUndefined();
    expect(enderecoModel.complemento).toBeUndefined();
    expect(enderecoModel.inscricaoEstadual).toBeUndefined();
    expect(enderecoModel.inscricaoMunicipal).toBeUndefined();
    expect(enderecoModel.latitude).toBeUndefined();
    expect(enderecoModel.longitude).toBeUndefined();
    expect(enderecoModel.nomeLogradouro).toBeUndefined();
    expect(enderecoModel.numeroLogradouro).toBeUndefined();
    expect(enderecoModel.observacao).toBeUndefined();
    expect(enderecoModel.pessoasDeContato).toBeInstanceOf(Array);
    expect(enderecoModel.tipoNomeNumeroComplementoLogradouro).toBeUndefined();
    expect(enderecoModel.tiposEndereco).toBeInstanceOf(Array);
    expect(enderecoModel.contatoPrincipal).toBeUndefined();

    enderecoModel = new EnderecoModel({
      ativo: true,
      bairro: {},
      bairroCidadeUnidadeFederativaCep: "texto",
      cep: "24950-000",
      cidade: {},
      codigoSuframa: "01",
      codigo: "02",
      complemento: "complemento",
      inscricaoEstadual: "123",
      inscricaoMunicipal: "456",
      latitude: "10",
      longitude: "5",
      nomeLogradouro: "nome logradouro",
      numeroLogradouro: "100",
      observacao: "observacao",
      pessoasDeContato: [{}],
      tipoNomeNumeroComplementoLogradouro: "texto",
      tiposEndereco: "texto",
      contatoPrincipal: {}
    })

    expect(typeof enderecoModel.ativo).toBe("boolean")
    expect(typeof enderecoModel.bairro).toBe("object")
    expect(typeof enderecoModel.bairroCidadeUnidadeFederativaCep).toBe("string")
    expect(typeof enderecoModel.cep).toBe("string")
    expect(typeof enderecoModel.cidade).toBe("object")
    expect(typeof enderecoModel.codigoSuframa).toBe("string")
    expect(typeof enderecoModel.codigo).toBe("string")
    expect(typeof enderecoModel.complemento).toBe("string")
    expect(typeof enderecoModel.inscricaoEstadual).toBe("string")
    expect(typeof enderecoModel.inscricaoMunicipal).toBe("string")
    expect(typeof enderecoModel.latitude).toBe("string")
    expect(typeof enderecoModel.longitude).toBe("string")
    expect(typeof enderecoModel.nomeLogradouro).toBe("string")
    expect(typeof enderecoModel.numeroLogradouro).toBe("string")
    expect(typeof enderecoModel.observacao).toBe("string")
    expect(typeof enderecoModel.pessoasDeContato).toBe("object")
    expect(enderecoModel.pessoasDeContato.length).toBe(1)
    expect(enderecoModel.pessoasDeContato[0]).toBeInstanceOf(PessoaDeContatoModel);
    expect(typeof enderecoModel.tipoNomeNumeroComplementoLogradouro).toBe("string")
    expect(typeof enderecoModel.tiposEndereco).toBe("string")
    expect(typeof enderecoModel.contatoPrincipal).toBe("object")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois o modelo está vazio', () => {
      let enderecoModel = new EnderecoModel({
        bairro: {},
        cidade: {},
        nomeLogradouro: "texto"
      })
      expect(enderecoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo possui bairro, cidade e nomeLogradouro', () => {
      let enderecoModel = new EnderecoModel({
        bairro: {
          codigo: "01",
          identificador: "01",
          nome: "texto",
        },
        cidade: {
          codigo: "01",
          codigoDDD: "21",
          codigoIBGE: "123456",
          identificador: "01",
          nome: "01",
          UF: {
            codigoIBGE: "21",
            nome: "Rio de Janeiro",
            sigla: "RJ",
          },
        },
        nomeLogradouro: "texto"
      })
      expect(enderecoModel.modeloValido()).toBeTruthy();
    })
  });
});