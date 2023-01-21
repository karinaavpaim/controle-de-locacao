import BairroModel from '@/models/geral/endereco/bairro-model';

describe('bairro-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "codigo",
      "identificador",
      "nome"
    ];

    const bairroModel = new BairroModel();
    const bairroModelKeys = Object.keys(bairroModel);

    Object.keys(bairroModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(bairroModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let bairroModel = new BairroModel();
    expect(bairroModel.codigo).toBeUndefined();
    expect(bairroModel.identificador).toBeUndefined();
    expect(bairroModel.nome).toBeUndefined();

    bairroModel = new BairroModel({
      codigo: "texto",
      identificador: "texto",
      nome: "texto"
    })

    expect(typeof bairroModel.codigo).toBe("string")
    expect(typeof bairroModel.identificador).toBe("string")    
    expect(typeof bairroModel.nome).toBe("string")
  });
  
  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem nome e identificador', () => {
      let bairroModel = new BairroModel({
        nome:"texto",
        identificador:"texto"
      })
      expect(bairroModel.modeloValido()).toBeTruthy();
    });
  });
});