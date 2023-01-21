import CidadeModel from '@/models/geral/endereco/cidade-model';
/* import UFModel from '@/models/geral/endereco/uf-model'; */

describe('cidade-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "codigo",
      "codigoDDD",
      "codigoIBGE",
      "identificador",
      "nome",
      "UF"
    ];

    const cidadeModel = new CidadeModel();
    const cidadeModelKeys = Object.keys(cidadeModel);

    Object.keys(cidadeModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(cidadeModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let cidadeModel = new CidadeModel();
    expect(cidadeModel.codigo).toBeUndefined();
    expect(cidadeModel.codigoDDD).toBeUndefined();
    expect(cidadeModel.codigoIBGE).toBeUndefined();
    expect(cidadeModel.identificador).toBeUndefined();
    expect(cidadeModel.nome).toBeUndefined();
    /* expect(cidadeModel.UF).toBeUndefined(); */

    const modelo = {
      codigo: 1,
      codigoDDD: 21,
      codigoIBGE: 12345,
      identificador: 1,
      nome: "nome",
      /* UF: new UFModel({
        codigoIBGE: 1234,
        nome: 'nome',
        sigla: 'sigla'
      }) */
    };
    cidadeModel = new CidadeModel(modelo);

    expect(cidadeModel.codigo).toBe(modelo.codigo);
    expect(cidadeModel.codigoDDD).toBe(modelo.codigoDDD);
    expect(cidadeModel.codigoIBGE).toBe(modelo.codigoIBGE);
    expect(cidadeModel.identificador).toBe(modelo.identificador);
    expect(cidadeModel.nome).toBe(modelo.nome);
    /* expect(cidadeModel.UF).toBe(modelo.UF); */
  });
  
  describe('modeloValido', () => {
    it('Deve verificar se o modelo tem identificador e nome', () => {
      let cidadeModel = new CidadeModel({
        identificador:1,
        nome:"nome"
      })
      expect(cidadeModel.modeloValido()).toBeTruthy();
    });
  });
});