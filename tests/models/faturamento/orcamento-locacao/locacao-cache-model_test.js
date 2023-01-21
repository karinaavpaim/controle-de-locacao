import LocacaoCacheModel from '@/models/faturamento/orcamento-locacao/locacao-cache-model';

describe('locacao-cache-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "identificador",
      "identificadorUsuario",
      "loginUsuario",
      "descricao",
      "identificadorEntidade",
      "nomeEntidade",
      "valor"
    ];

    const locacaoCacheModel = new LocacaoCacheModel();
    const locacaoCacheModelKeys = Object.keys(locacaoCacheModel);

    Object.keys(locacaoCacheModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(locacaoCacheModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let locacaoCacheModel = new LocacaoCacheModel();
    expect(locacaoCacheModel.identificador).toBeUndefined();
    expect(locacaoCacheModel.identificadorUsuario).toBeUndefined();
    expect(locacaoCacheModel.loginUsuario).toBeUndefined();
    expect(locacaoCacheModel.descricao).toBeUndefined();
    expect(locacaoCacheModel.identificadorEntidade).toBeUndefined();
    expect(locacaoCacheModel.nomeEntidade).toBeUndefined();
    expect(locacaoCacheModel.valor).toBeUndefined();

    locacaoCacheModel = new LocacaoCacheModel({
      identificador:"01",
      identificadorUsuario:"01",
      loginUsuario:"thaina.dsn.erp",
      descricao:"descricao",
      identificadorEntidade:"01",
      nomeEntidade:"nomeEntidade",
      valor:"100"
    })

    expect(typeof locacaoCacheModel.identificador).toBe("string");
    expect(typeof locacaoCacheModel.identificadorUsuario).toBe("string");
    expect(typeof locacaoCacheModel.loginUsuario).toBe("string");
    expect(typeof locacaoCacheModel.descricao).toBe("string");
    expect(typeof locacaoCacheModel.identificadorEntidade).toBe("string");
    expect(typeof locacaoCacheModel.nomeEntidade).toBe("string");
    expect(typeof locacaoCacheModel.valor).toBe("string");
  });

  describe('modeloValido', () => {
    it('Deve retornar false, pois não possui: valor, identificadorEntidade, nomeEntidade e identificadorUsuario', () => {
      let locacaoCacheModel = new LocacaoCacheModel;
      expect(locacaoCacheModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true, pois possui: valor, identificadorEntidade, nomeEntidade e identificadorUsuario', () => {
      let locacaoCacheModel = new LocacaoCacheModel({
        valor:"texto",
        identificadorEntidade:"texto",
        nomeEntidade:"texto",
        identificadorUsuario:"texto"
      });
      expect(locacaoCacheModel.modeloValido()).toBeTruthy();
    })
  })
});