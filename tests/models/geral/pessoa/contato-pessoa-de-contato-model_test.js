import ContatoPessoaDeContatoModel from '@/models/geral/pessoa/contato-pessoa-de-contato-model';

describe('contato-pessoa-de-contato-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "descricao",
      "tipo"
    ];

    const contatoPessoaDeContatoModel = new ContatoPessoaDeContatoModel();
    const contatoPessoaDeContatoModelKeys = Object.keys(contatoPessoaDeContatoModel);

    Object.keys(contatoPessoaDeContatoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(contatoPessoaDeContatoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let contatoPessoaDeContatoModel = new ContatoPessoaDeContatoModel();
    expect(contatoPessoaDeContatoModel.descricao).toBeUndefined();
    expect(contatoPessoaDeContatoModel.tipo).toBeUndefined();

    contatoPessoaDeContatoModel = new ContatoPessoaDeContatoModel({
      descricao: "texto",
      tipo: "texto",
    })

    expect(typeof contatoPessoaDeContatoModel.descricao).toBe("string");
    expect(typeof contatoPessoaDeContatoModel.tipo).toBe("string");
  });
});