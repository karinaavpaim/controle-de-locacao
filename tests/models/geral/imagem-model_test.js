import ImagemModel from '@/models/geral/imagem-model';

describe('imagem-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "conteudo",
      "conteudoMiniatura",
      "descricao",
      "tipo"
    ];

    const imagemModel = new ImagemModel();
    const imagemModelKeys = Object.keys(imagemModel);

    Object.keys(imagemModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(imagemModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let imagemModel = new ImagemModel();
    expect(imagemModel.conteudo).toBeUndefined();
    expect(imagemModel.conteudoMiniatura).toBeUndefined();
    expect(imagemModel.descricao).toBeUndefined();
    expect(imagemModel.tipo).toBeUndefined();

    imagemModel = new ImagemModel({
      conteudo: "texto",
      conteudoMiniatura: "texto",
      descricao: "texto",
      tipo: "texto"
    })

    expect(typeof imagemModel.conteudo).toBe("string");
    expect(typeof imagemModel.conteudoMiniatura).toBe("string");
    expect(typeof imagemModel.descricao).toBe("string");
    expect(typeof imagemModel.tipo).toBe("string");
  });
});