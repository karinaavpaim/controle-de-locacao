import UFModel from '@/models/geral/endereco/uf-model';

describe('uf-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "codigoIBGE",
      "nome",
      "sigla"
    ];

    const ufModel = new UFModel();
    const ufModelKeys = Object.keys(ufModel);

    Object.keys(ufModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(ufModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let ufModel = new UFModel();
    expect(ufModel.codigoIBGE).toBeUndefined();
    expect(ufModel.nome).toBeUndefined();
    expect(ufModel.sigla).toBeUndefined();

    ufModel = new UFModel({
      codigoIBGE: 12345,
      nome: "Rio de Janeiro",
      sigla: "UF"
    })

    expect(typeof ufModel.codigoIBGE).toBe("number")
    expect(typeof ufModel.nome).toBe("string")    
    expect(typeof ufModel.sigla).toBe("string")
  });
  
  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem nome e sigla', () => {
      let ufModel = new UFModel({
        nome:"Rio de Janeiro",
        sigla:"RJ"
      })
      expect(ufModel.modeloValido()).toBeTruthy();
    });
  });
});