import SistemaAcesso from '@/models/geral/usuario/sistema-acesso-model';

describe('sistema-acesso-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "identificador",
      "tipo"
    ];

    const sistemaAcesso = new SistemaAcesso();
    const sistemaAcessoKeys = Object.keys(sistemaAcesso);

    Object.keys(sistemaAcesso).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(sistemaAcessoKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let sistemaAcesso = new SistemaAcesso();
    expect(sistemaAcesso.identificador).toBeUndefined();
    expect(sistemaAcesso.tipo).toBeUndefined();

    sistemaAcesso = new SistemaAcesso({
      identificador: "texto",
      tipo: "texto"
    })

    expect(typeof sistemaAcesso.identificador).toBe("string")    
    expect(typeof sistemaAcesso.tipo).toBe("string")
  });
});