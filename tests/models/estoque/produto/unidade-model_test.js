import UnidadeModel from '@/models/estoque/produto/unidade-model';

describe('unidade-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "descricao",
      "sigla"
    ];

    const unidadeModel = new UnidadeModel()
    const unidadeModelKeys = Object.keys(unidadeModel);

    Object.keys(unidadeModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(unidadeModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let unidadeModel = new UnidadeModel();
    expect(unidadeModel.identificador).toBeUndefined();
    expect(unidadeModel.descricao).toBeUndefined();
    expect(unidadeModel.sigla).toBeUndefined();

    const modelo = {
      identificador: 1,
      descricao: 'Quilograma',
      sigla: 'KG'
    };
    unidadeModel = new UnidadeModel(modelo);

    expect(unidadeModel.identificador).toBe(modelo.identificador);
    expect(unidadeModel.descricao).toBe(modelo.descricao);
    expect(unidadeModel.sigla).toBe(modelo.sigla);
  });
});