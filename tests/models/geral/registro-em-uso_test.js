import RegistroEmUsoModel from '@/models/geral/registro-em-uso';

describe('registro-em-uso-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "hashSenhaUsuario",
      "nomeUsuario",
      "identificadorEntidade",
      "nomeEntidade"
    ];

    const registroEmUsoModel = new RegistroEmUsoModel();
    const registroEmUsoModelKeys = Object.keys(registroEmUsoModel);

    Object.keys(registroEmUsoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(registroEmUsoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let registroEmUsoModel = new RegistroEmUsoModel();
    expect(registroEmUsoModel.identificador).toBeUndefined();
    expect(registroEmUsoModel.hashSenhaUsuario).toBeUndefined();
    expect(registroEmUsoModel.nomeUsuario).toBeUndefined();
    expect(registroEmUsoModel.identificadorEntidade).toBeUndefined();
    expect(registroEmUsoModel.nomeEntidade).toBeUndefined();
    
    registroEmUsoModel = new RegistroEmUsoModel({
      identificador: "texto",
      hashSenhaUsuario: "texto",
      nomeUsuario: "texto",
      identificadorEntidade: "texto",
      nomeEntidade: "texto"
    })

    expect(typeof registroEmUsoModel.identificador).toBe("string");
    expect(typeof registroEmUsoModel.hashSenhaUsuario).toBe("string");
    expect(typeof registroEmUsoModel.nomeUsuario).toBe("string");
    expect(typeof registroEmUsoModel.identificadorEntidade).toBe("string");
    expect(typeof registroEmUsoModel.nomeEntidade).toBe("string");
  });

  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem identificador, identificador da entidade, nome da entidade e nome do usuario', () => {
      let registroEmUsoModel = new RegistroEmUsoModel({
        identificador: "02",
        identificadorEntidade: "02",
        nomeEntidade: "texto",
        nomeUsuario: "texto"
      })
      expect(registroEmUsoModel.modeloValido()).toBeTruthy();
      registroEmUsoModel.identificador = undefined;
      expect(registroEmUsoModel.modeloValido()).toBe(false);
    })
  })

});