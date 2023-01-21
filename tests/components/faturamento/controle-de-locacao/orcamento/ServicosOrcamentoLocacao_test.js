import { mount } from '@vue/test-utils';
import ServicosOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/itens/servicos/ServicosOrcamentoLocacao.vue';
import { TIPOS_PRODUTO_SERVICO } from '@/constants/estoque/produto-constants.js';
import { COLUNAS_SERVICOS } from '@/constants/faturamento/controle-de-locacao/servicos-orcamento-locacao-constants.js';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';

describe('ServicosOrcamentoLocacao.vue', () => {
  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(ServicosOrcamentoLocacao, {
      store, router,
      propsData: {}
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const equipamentos = ServicosOrcamentoLocacao.data();
    expect(typeof ServicosOrcamentoLocacao.data).toBe('function');
    expect(typeof equipamentos.tiposDeProduto).toBe('object');
    expect(typeof equipamentos.colunasServicos).toBe('object');
  });

  it('Deve estar pré-definido somente os produtos com os tipos Serviço e Serviço Comercializado .', () => {
    expect(wrapper.vm.tiposDeProduto.length).toBe(TIPOS_PRODUTO_SERVICO.length);
    TIPOS_PRODUTO_SERVICO.forEach((s) => {
      expect(wrapper.vm.tiposDeProduto.includes(s)).toBe(true);
    });
  });

  it('Deve estar informado as colunas da tabela de serviço na ordem correta.', () => {
    expect(wrapper.vm.colunasServicos.length).toBe(COLUNAS_SERVICOS.length); 
    COLUNAS_SERVICOS.forEach((c) => {
        expect(wrapper.vm.colunasServicos.includes(c)).toBe(true);
    });
    expect(wrapper.vm.colunasServicos[0].text).toBe('');
    expect(wrapper.vm.colunasServicos[1].text).toBe('Descrição');
    expect(wrapper.vm.colunasServicos[2].text).toBe('Quantidade');
    expect(wrapper.vm.colunasServicos[3].text).toBe('Diárias');
    expect(wrapper.vm.colunasServicos[4].text).toBe('Período inicial');
    expect(wrapper.vm.colunasServicos[5].text).toBe('Período final');
    expect(wrapper.vm.colunasServicos[6].text).toBe('Unitário líquido');
    expect(wrapper.vm.colunasServicos[7].text).toBe('Valor total');
    expect(wrapper.vm.colunasServicos[8].text).toBe('');
  });
});