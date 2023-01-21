import CategoriaPessoaModel from '@/models/geral/pessoa/categoria-pessoa-model';

describe('categoria-pessoa-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "nome"
    ];

    const categoriaPessoaModel = new CategoriaPessoaModel();
    const categoriaPessoaModelKeys = Object.keys(categoriaPessoaModel);

    Object.keys(categoriaPessoaModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(categoriaPessoaModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let categoriaPessoaModel = new CategoriaPessoaModel();
    expect(categoriaPessoaModel.identificador).toBeUndefined();
    expect(categoriaPessoaModel.nome).toBeUndefined();

    categoriaPessoaModel = new CategoriaPessoaModel({
      identificador: "01",
      nome: "texto",
    })

    expect(typeof categoriaPessoaModel.identificador).toBe("string");
    expect(typeof categoriaPessoaModel.nome).toBe("string");
  });

  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem identificador e nome', () => {
      let categoriaPessoaModel = new CategoriaPessoaModel({
        nome:"texto",
        identificador:"01",
      })
      expect(categoriaPessoaModel.modeloValido()).toBeTruthy();
      categoriaPessoaModel.nome = undefined;
      expect(categoriaPessoaModel.modeloValido()).toBe(false);
    })
  })

});