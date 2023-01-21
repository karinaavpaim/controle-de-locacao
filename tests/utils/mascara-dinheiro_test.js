import mascara from '../../src/utils/mascara-dinheiro';

describe('Teste para o utils mascara-dinheiro.js', () => {
  beforeEach(() => {});
    
  it('Nao aplicar mascara para Real pois o valor e invalido', () => {
    expect(mascara.aplicarMascaraParaReal("abcde")).toBe(0);
  });

  it('Nao deve aplicar mascara para Real pois o valor e invalido (sem R$)', () => {
    expect(mascara.aplicarMascaraParaRealComPrefixo("abcde")).toBe(0);
  });
    
  it('Deve aplicar mascara para Real sem (R$)', () => {
    expect(mascara.aplicarMascaraParaReal(1234356)).not.toBe(0);
  });

  it('Deve aplicar mascara para Real com (R$)', () => {
    expect(mascara.aplicarMascaraParaRealComPrefixo(123456)).not.toBe(0);
  });
});