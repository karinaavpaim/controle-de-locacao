import AnaliseResultadoModel from "@/models//faturamento/orcamento-locacao/analise-de-resultados/analise-resultado-model"
import MedicaoLocacaoModel from "@/models/estoque/medicao/medicao-locacao-model";
import ItemAnaliseResultadoModel from "@/models/faturamento/orcamento-locacao/analise-de-resultados/item-analise-resultado-model";
import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";
import fakeAnaliseResultadoJson from "../../../../fakes/faturamento/controle-de-locacao/analise-resultados.json"

describe('analise-resultado-model.js', () => {
  it('Deve ter exatamente as propriedades usadas pelo sistema', () => {
    const props = [  
      "orcado",
      "locacao",
      "medicao"
    ];

    const analiseResultadoModel = new AnaliseResultadoModel()
    const analiseResultadoModelKeys = Object.keys(analiseResultadoModel);

    Object.keys(analiseResultadoModel).forEach(prop => {
      expect(props.find(p=>p===prop)).toBe(prop);
    });

    props.forEach(prop => {
      expect(analiseResultadoModelKeys.find(p=>p===prop)).toBe(prop);
    });
  });

  it('Deve ter suas propriedades inicializadas com os tipos corretos.', () => {
    let analiseResultadoModel = new AnaliseResultadoModel();
    expect(analiseResultadoModel.orcado.constructor.name).toBe("OrcamentoLocacaoModel");
    expect(analiseResultadoModel.medicao.constructor.name).toBe("MedicaoLocacaoModel");
    expect(analiseResultadoModel.locacao.constructor.name).toBe("OrcamentoLocacaoModel");

    analiseResultadoModel = new AnaliseResultadoModel({
      orcado:{},
      locacao:{},
      medicao:{}
    })

    expect(typeof analiseResultadoModel.orcado).toBe("object");
    expect(typeof analiseResultadoModel.locacao).toBe("object");
    expect(typeof analiseResultadoModel.medicao).toBe("object");
  });

  describe('obterMetaDados', () => {
    it('deve fazer os calculos gerais e retornar um modelo de metadados preenchido', () => {
      
      let resultado = new AnaliseResultadoModel({
        orcado: new OrcamentoLocacaoModel, 
        locacao: new OrcamentoLocacaoModel, 
        medicao: new MedicaoLocacaoModel
      }).obterMetaDados();
      expect(resultado.adicionaisPersonalizados).toBeInstanceOf(Array);
      expect(resultado.detalhamento).toBeInstanceOf(Array);
      expect(resultado.totalGeral).toBeInstanceOf(ItemAnaliseResultadoModel);
    })
  })

  describe('obterMetaDados', () => {
    it('deve fazer os calculos gerais e retornar os valores corretos', () => {
      
      let resultado = new AnaliseResultadoModel(fakeAnaliseResultadoJson).obterMetaDados();
      expect(resultado.adicionaisPersonalizados).toBeInstanceOf(Array);
      expect(resultado.detalhamento).toBeInstanceOf(Array);
      expect(resultado.totalGeral).toBeInstanceOf(ItemAnaliseResultadoModel);
    })
  })
});