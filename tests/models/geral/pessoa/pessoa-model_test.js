import PessoaModel from '@/models/geral/pessoa/pessoa-model';
import CategoriaPessoaModel from '@/models/geral/pessoa/categoria-pessoa-model';
import EnderecoModel from '@/models/geral/endereco/endereco-model';

describe('pessoa-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "nome",
      "categorias",
      "enderecos",
      "enderecoPrincipal",
      "CNAE",
      "codigo",
      "codigoNome",
      "codigoNomeCPFouCNPJ",
      "CPFouCNPJ",
      "dataCadastro",
      "descricaoCNAE",
      "informacoesRestritas",
      "nomeCurto",
      "tipoPessoa",
      "foto"
    ];

    const pessoaModel = new PessoaModel();
    const pessoaModelKeys = Object.keys(pessoaModel);

    Object.keys(pessoaModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(pessoaModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let pessoaModel = new PessoaModel();
    expect(pessoaModel.identificador).toBeUndefined();
    expect(pessoaModel.nome).toBe("");
    expect(pessoaModel.categorias).toBeInstanceOf(Array);
    expect(pessoaModel.enderecos).toBeInstanceOf(Array);
    expect(pessoaModel.enderecoPrincipal).toBeUndefined();
    expect(pessoaModel.CNAE).toBeUndefined();
    expect(pessoaModel.codigo).toBeUndefined();
    expect(pessoaModel.codigoNome).toBeUndefined();
    expect(pessoaModel.codigoNomeCPFouCNPJ).toBeUndefined();
    expect(pessoaModel.CPFouCNPJ).toBeUndefined();
    expect(pessoaModel.dataCadastro).toBeUndefined();
    expect(pessoaModel.descricaoCNAE).toBeUndefined();
    expect(pessoaModel.informacoesRestritas).toBeUndefined();
    expect(pessoaModel.nomeCurto).toBeUndefined();
    expect(pessoaModel.tipoPessoa).toBeUndefined();
    expect(pessoaModel.foto).toBeUndefined();

    pessoaModel = new PessoaModel({
      identificador: "01",
      nome: "texto",
      categorias: [{}],
      enderecos: [{}],
      enderecoPrincipal: {},
      CNAE: "texto",
      codigo: "texto",
      codigoNome: "texto",
      codigoNomeCPFouCNPJ: "texto",
      CPFouCNPJ: "texto",
      dataCadastro: "texto",
      descricaoCNAE: "texto",
      informacoesRestritas: "texto",
      nomeCurto: "texto",
      tipoPessoa: "texto",
      foto: "texto"
    })

    expect(typeof pessoaModel.identificador).toBe("string");
    expect(typeof pessoaModel.nome).toBe("string");
    expect(typeof pessoaModel.categorias).toBe("object");
    expect(pessoaModel.categorias.length).toBe(1)
    expect(pessoaModel.categorias[0]).toBeInstanceOf(CategoriaPessoaModel);
    expect(typeof pessoaModel.enderecos).toBe("object");
    expect(pessoaModel.enderecos.length).toBe(1)
    expect(pessoaModel.enderecos[0]).toBeInstanceOf(EnderecoModel);
    expect(typeof pessoaModel.enderecoPrincipal).toBe("object");
    expect(typeof pessoaModel.CNAE).toBe("string");
    expect(typeof pessoaModel.codigo).toBe("string");
    expect(typeof pessoaModel.codigoNome).toBe("string");
    expect(typeof pessoaModel.codigoNomeCPFouCNPJ).toBe("string");
    expect(typeof pessoaModel.CPFouCNPJ).toBe("string");
    expect(typeof pessoaModel.dataCadastro).toBe("string");
    expect(typeof pessoaModel.descricaoCNAE).toBe("string");
    expect(typeof pessoaModel.informacoesRestritas).toBe("string");
    expect(typeof pessoaModel.nomeCurto).toBe("string");
    expect(typeof pessoaModel.tipoPessoa).toBe("string");
    expect(typeof pessoaModel.foto).toBe("string");
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois o modelo está vazio', () => {
      let pessoaModel = new PessoaModel;
      expect(pessoaModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo possui bairro, cidade e nomeLogradouro', () => {
      let pessoaModel = new PessoaModel({
        nome: "texto"
      })
      expect(pessoaModel.modeloValido()).toBeTruthy();
    })
  });
});