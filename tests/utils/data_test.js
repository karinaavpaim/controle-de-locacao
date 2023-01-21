import data from '../../src/utils/data';

describe('Teste para o utils data.js', () => {

  beforeEach(() => {});

  it('Deve verificar se períodos são válidos', () => {
    expect(data.dataFinalMaiorOuIgualDataInicial('02/01/2001', '01/01/2001')).toBe(false);
    expect(data.dataFinalMaiorOuIgualDataInicial('01/01/2001', '02/01/2001')).toBe(true);
  });

  it('Deve aplicar data padrão ISO', () => {
    expect(data.aplicarMascaraEmDataIso('2001-02-01T10:30:26.337')).toBe('01/02/2001');
  });

  it('Deve retornar Invalid date quando passar uma data inválida', () => {
    expect(data.aplicarMascaraEmDataIso('31/02/2021')).toBe('Invalid date');
  });

  it('Deve retornar null quando passar vazio ou null', () => {
    expect(data.aplicarMascaraEmDataIso('')).toBe(null);
    expect(data.aplicarMascaraEmDataIso(null)).toBe(null);
  });

  it('Deve aplicar data/hora padrão', () => {
    expect(data.aplicarMascaraDataHoraEmDataIso('2001-02-01T10:30:26.337')).toBe('01/02/2001 10:30:26');
  });

  it('Deve retornar Invalid date quando passar uma data inválida', () => {
    expect(data.aplicarMascaraDataHoraEmDataIso('31/02/2021')).toBe('Invalid date');
  });

  it('Deve retornar null quando passar vazio ou null', () => {
    expect(data.aplicarMascaraDataHoraEmDataIso('')).toBe(null);
    expect(data.aplicarMascaraDataHoraEmDataIso(null)).toBe(null);
  });

  it('Deve formatar a data/hora ISO', () => {
    expect(data.formatarDataEHoraIso('2021-01-01', '10:30:26')).toBe('2021-01-01T10:30:26');
  });

  it('Deve formatar a data ISO', () => {
    expect(data.formatarDataIso('01/01/2021')).toBe('2021-01-01');
  });

  it('Deve retornar Invalid date quando passar uma data inválida', () => {
    expect(data.formatarDataIso('31/02/2021')).toBe('Invalid date');
  });

  it('Deve retornar null quando passar vazio ou null', () => {
    expect(data.formatarDataIso('')).toBe(null);
    expect(data.formatarDataIso(null)).toBe(null);
  });

  it('Deve retornar um range de datas, entre a data inicial e data final informadas', () => {
    expect(data.obterDatasDoPeriodo('01/01/2021', '03/01/2021')).toEqual(expect.arrayContaining(['2021-01-01', '2021-01-02', '2021-01-03']));
  });
});