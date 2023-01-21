import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import apiEndereco  from '@/api/sistemas-gerais/endereco-api.js';
import EnderecosOrcamentoLocacao from '@/components/faturamento/controle-de-locacao/orcamento/enderecos/EnderecosOrcamentoLocacao';
import enderecos from '../../../../fakes/sistemas-gerais/endereco/enderecos.json';
import OrcamentoLocacaoModel from '@/models/faturamento/orcamento-locacao/orcamento-locacao-model';
import PessoaModel from '@/models/geral/pessoa/pessoa-model.js';

describe('EnderecosOrcamentoLocacao.vue', () => {
  jest.spyOn(apiEndereco, 'localizarEnderecos')
      .mockImplementation(() => Promise.resolve(enderecos));

  let cliente = {
    identificador:"0013210",
    nome: "TESTE",
    codigo:"0000"
  };

  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(EnderecosOrcamentoLocacao, {
      store,
      router,
      propsData: {
        orcamentoLocacao : new OrcamentoLocacaoModel()
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const enderecos = EnderecosOrcamentoLocacao.data();
    expect(typeof EnderecosOrcamentoLocacao.data).toBe('function');
    expect(typeof enderecos.enderecoEntrega).toBe('object');
    expect(enderecos.enderecoEntrega.codigo).toBe('');
    expect(enderecos.enderecoEntrega.descricao).toBe('');
    expect(enderecos.desabilitarMensagemNaoHaDados).toBe(true);
  });

  it('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().orcamentoLocacao).toEqual(new OrcamentoLocacaoModel());
  });
  
  it('Deve listar apenas os enderecos de entrega quando o metodo "consultarEnderecosDoCliente" for chamado.', async () => {
    expect(wrapper.vm.enderecos.length).toBe(0);
    await wrapper.vm.consultarEnderecosDoCliente(cliente);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.desabilitarMensagemNaoHaDados).toBe(true);
      expect(wrapper.vm.enderecos.length).toBe(3);
    });
  });

  it('Deve limpar a lista de enderecos quando não passar um cliente com identificador para o metodo "consultarEnderecosDoCliente"', async () => {
    expect(wrapper.vm.enderecos.length).toBe(0);
    cliente.identificador = "";

    await wrapper.vm.consultarEnderecosDoCliente(cliente);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.enderecos.length).toBe(0);
    });
  });

  it('Deve permitir alterar o cliente do orcamento dentro do componente', () => {
    let orcamentoLocacao = new OrcamentoLocacaoModel({cliente: new PessoaModel({identificador:'123456789'})}) ;
    orcamentoLocacao.cliente.identificador = '123456789';

    wrapper.setProps({ orcamentoLocacao: orcamentoLocacao })
    expect(wrapper.vm.orcamentoLocacao.cliente.identificador).toBe('123456789');
  });

  it('Deve permitir alterar o cliente do orcamento dentro do componente', () => {
    let orcamentoLocacao = new OrcamentoLocacaoModel({cliente: new PessoaModel({identificador:'123456789'})}) ;
    orcamentoLocacao.cliente.identificador = '123456789';

    wrapper.setProps({ orcamentoLocacao: orcamentoLocacao })
    expect(wrapper.vm.orcamentoLocacao.cliente.identificador).toBe('123456789');
  });
});