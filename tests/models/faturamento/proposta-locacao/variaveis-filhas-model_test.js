import VariaveisFilhasModel from '@/models/faturamento/proposta-locacao/variaveis-filhas-model';

describe('variaveis-filhas-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "nome",
      "inline",
      "conteudo",
      "tipo"
    ];

    const variaveisFilhasModel = new VariaveisFilhasModel()
    const variaveisFilhasModelKeys = Object.keys(variaveisFilhasModel);

    Object.keys(variaveisFilhasModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(variaveisFilhasModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let variaveisFilhasModel = new VariaveisFilhasModel();
    expect(variaveisFilhasModel.identificador).toBeUndefined();
    expect(variaveisFilhasModel.nome).toBeUndefined();
    expect(variaveisFilhasModel.inline).toBeUndefined();
    expect(variaveisFilhasModel.conteudo).toBeUndefined();
    expect(variaveisFilhasModel.tipo).toBeUndefined();

    const modelo = {
      identificador: 1,
      nome: 'nome',
      inline: 'inline',
      conteudo: 'conteudo',
      tipo: 'tipo'
    };
    variaveisFilhasModel = new VariaveisFilhasModel(modelo);

    expect(variaveisFilhasModel.identificador).toBe(modelo.identificador);
    expect(variaveisFilhasModel.nome).toBe(modelo.nome);
    expect(variaveisFilhasModel.inline).toBe(modelo.inline);
    expect(variaveisFilhasModel.conteudo).toBe(modelo.conteudo);
    expect(variaveisFilhasModel.tipo).toBe(modelo.tipo);
  });
});