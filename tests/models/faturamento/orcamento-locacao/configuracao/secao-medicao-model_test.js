import SecaoMedicaoModel from '@/models/faturamento/orcamento-locacao/configuracao/secao-medicao-model';

describe('secao-medicao-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [
      "gerarPedidoLiberadoNaMedicao",
      "primeiraPrioridadeSomaDasDespesasNaMedicao",
      "segundaPrioridadeSomaDasDespesasNaMedicao",
      "terceiraPrioridadeSomaDasDespesasNaMedicao"
    ];

    const secaoMedicaoModel = new SecaoMedicaoModel();
    const secaoMedicaoModelKeys = Object.keys(secaoMedicaoModel);

    Object.keys(secaoMedicaoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(secaoMedicaoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let secaoMedicaoModel = new SecaoMedicaoModel();
    expect(secaoMedicaoModel.gerarPedidoLiberadoNaMedicao).toBeFalsy();
    expect(secaoMedicaoModel.primeiraPrioridadeSomaDasDespesasNaMedicao).toBeUndefined();
    expect(secaoMedicaoModel.segundaPrioridadeSomaDasDespesasNaMedicao).toBeUndefined();
    expect(secaoMedicaoModel.terceiraPrioridadeSomaDasDespesasNaMedicao).toBeUndefined();

    secaoMedicaoModel = new SecaoMedicaoModel({
      gerarPedidoLiberadoNaExpedicao: true,
      primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
      segundaPrioridadeSomaDasDespesasNaMedicao: "Material",
      terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
    })

    expect(typeof secaoMedicaoModel.gerarPedidoLiberadoNaMedicao).toBe("boolean")
    expect(typeof secaoMedicaoModel.primeiraPrioridadeSomaDasDespesasNaMedicao).toBe("string")
    expect(typeof secaoMedicaoModel.segundaPrioridadeSomaDasDespesasNaMedicao).toBe("string")
    expect(typeof secaoMedicaoModel.terceiraPrioridadeSomaDasDespesasNaMedicao).toBe("string")
  });

  describe('modeloValido', () => {
    it('Deve retornar false pois as duas primeiras prioridades estão iguais', () => {
      let secaoMedicaoModel = new SecaoMedicaoModel({
        gerarPedidoLiberadoNaMedicao: true,
        primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        segundaPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
      });
      expect(secaoMedicaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar false pois o modelo está vazio', () => {
      let secaoMedicaoModel = new SecaoMedicaoModel();
      expect(secaoMedicaoModel.modeloValido()).toBeFalsy();
    })

    it('Deve retornar true pois o modelo está completo', () => {
      let secaoMedicaoModel = new SecaoMedicaoModel({
        gerarPedidoLiberadoNaMedicao: true,
        primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        segundaPrioridadeSomaDasDespesasNaMedicao: "Material",
        terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
      })
      expect(secaoMedicaoModel.modeloValido()).toBeTruthy();
    })
  });

  describe('obterErrosDeValidacao', () => {
    it('Deve retornar a mensagem de erro', () => {
      let resultado = new SecaoMedicaoModel().obterErrosDeValidacao();
      expect(resultado).toStrictEqual(["As prioridades da soma das despesas são obrigatórias e não podem se repetir."]);
    })

    it('Deve retornar um array vazio', () => {
      let resultado = new SecaoMedicaoModel({
        gerarPedidoLiberadoNaMedicao: true,
        primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        segundaPrioridadeSomaDasDespesasNaMedicao: "Material",
        terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
      }).obterErrosDeValidacao();
      expect(resultado).toStrictEqual([]);
    })
  });

  describe('_prioridadesNaoEstaoRepetidas', () => {
    it('Deve retornar true, pois não existem prioridades repetidas', () => {
      let resultado = new SecaoMedicaoModel({
        gerarPedidoLiberadoNaMedicao: true,
        primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        segundaPrioridadeSomaDasDespesasNaMedicao: "Material",
        terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
      })._prioridadesNaoEstaoRepetidas();
      expect(resultado).toBeTruthy();
    })
  
    it('Deve retornar false, pois existem prioridades repetidas', () => {
      let resultado = new SecaoMedicaoModel({
        gerarPedidoLiberadoNaMedicao: true,
        primeiraPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        segundaPrioridadeSomaDasDespesasNaMedicao: "Equipamento",
        terceiraPrioridadeSomaDasDespesasNaMedicao: "Serviço"
      })._prioridadesNaoEstaoRepetidas();
      expect(resultado).toBeFalsy();
    })
  });
});