import PessoaDeContatoModel from '@/models/geral/pessoa/pessoa-de-contato-model';
import ContatoPessoaDeContatoModel from '@/models/geral/pessoa/contato-pessoa-de-contato-model';

describe('pessoa-de-contato-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "contatos",
      "contatoPrincipal",
      "identificador",
      "nome",
      "telefoneFixo",
      "telefoneCelular",
      "email",
      "pessoaDeContato"
    ];

    const pessoaDeContatoModel = new PessoaDeContatoModel();
    const pessoaDeContatoModelKeys = Object.keys(pessoaDeContatoModel);

    Object.keys(pessoaDeContatoModel).forEach(prop => {
      expect(props.find(p => p === prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(pessoaDeContatoModelKeys.find(p => p === prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let pessoaDeContatoModel = new PessoaDeContatoModel();
    expect(pessoaDeContatoModel.contatos).toBeInstanceOf(Array);
    expect(pessoaDeContatoModel.contatoPrincipal).toBeUndefined();
    expect(pessoaDeContatoModel.identificador).toBeUndefined();
    expect(pessoaDeContatoModel.nome).toBeUndefined();
    expect(pessoaDeContatoModel.telefoneFixo).toBeUndefined();
    expect(pessoaDeContatoModel.telefoneCelular).toBeUndefined();
    expect(pessoaDeContatoModel.email).toBeUndefined();
    expect(pessoaDeContatoModel.pessoaDeContato).toBeUndefined();


    pessoaDeContatoModel = new PessoaDeContatoModel({
      contatos: [{}],
      contatoPrincipal: "texto",
      identificador: "01",
      nome: "texto",
      telefoneFixo: "texto",
      telefoneCelular: "texto",
      email: "texto",
      pessoaDeContato: "texto"
    })

    expect(typeof pessoaDeContatoModel.contatos).toBe("object")
    expect(pessoaDeContatoModel.contatos.length).toBe(1)
    expect(pessoaDeContatoModel.contatos[0]).toBeInstanceOf(ContatoPessoaDeContatoModel);
    expect(typeof pessoaDeContatoModel.identificador).toBe("string");
    expect(typeof pessoaDeContatoModel.nome).toBe("string");
    expect(typeof pessoaDeContatoModel.telefoneFixo).toBe("string");
    expect(typeof pessoaDeContatoModel.telefoneCelular).toBe("string");
    expect(typeof pessoaDeContatoModel.email).toBe("string");
    expect(typeof pessoaDeContatoModel.pessoaDeContato).toBe("string");
  });
});