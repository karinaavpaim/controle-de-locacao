'use strict';

import { mount } from '@vue/test-utils';
import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import apiOrcamento from '@/api/faturamento/controle-de-locacao/orcamento-locacao-api.js';
import AdicionalPersonalizado from '@/components/faturamento/controle-de-locacao/orcamento/AdicionalPersonalizado';
import AdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/adicional-personalizado-model';
import ItemAdicionalPersonalizadoModel from '@/models/faturamento/orcamento-locacao/item-adicional-personalizado-model';
import adicionalPersonalizadoApi from '@/api/faturamento/controle-de-locacao/adicionais-personalizados-api.js';

const COLUNAS_TABELA_INDICES_PERSONALIZADOS = [
  { text: 'Nome', align: 'left', value: 'descricao' },
  { text: 'Alíquota', value: 'aliquota', width: '80px' , sortable: false},
  {
    text: 'Equipamentos',
    align: 'center',
    value: 'atualizaEquipamentos',
    width: '109px',
    sortable: false
  },
  { text: 'Serviços', align: 'center', value: 'atualizaServicos', width: '79px' , sortable: false},
  {
    text: 'Materiais',
    align: 'center',
    value: 'atualizaMateriais',
    width: '83px', 
    sortable: false
  },
  { text: 'Despesas', align: 'center', value: 'atualizaDespesas', width: '85px' , sortable: false},
  {
    text: '',
    align: 'center',
    value: 'action',
    sortable: false,
    width: '72px'
  }
];

const OBJETO_ALERTA = {
  disparar: false,
  mensagem: '',
  tipo: 'error',
};

describe('AdicionalPersonalizado.vue', () => {
  jest.spyOn(apiOrcamento, 'obterAdicionaisPersonalizados')
      .mockImplementation(() => Promise.resolve({}));

  let wrapper;
  sync(store, router);

  beforeEach(() => {
    wrapper = mount(AdicionalPersonalizado, {
      store,
      router,
      propsData: {
        adicionaisPersonalizados: [],
        adicionalPersonalizado: new AdicionalPersonalizadoModel(),
      }
    });   
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(typeof AdicionalPersonalizado.data).toBe('function');
    expect(wrapper.vm.mascaraNumero).toBe('##,##');
    expect(wrapper.vm.divDeIndicesSendoExibida).toBe(false);
    expect(wrapper.vm.deveValidarCamposDosItens).toBe(true);
    expect(wrapper.vm.itemDeAdicional).toEqual(new ItemAdicionalPersonalizadoModel());
    expect(wrapper.vm.headers).toEqual(COLUNAS_TABELA_INDICES_PERSONALIZADOS);
    expect(wrapper.vm.indexDoItemEditado).toBe(-1);
    expect(wrapper.vm.alerta).toEqual(OBJETO_ALERTA);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNome).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeAliquota).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNomeDoModelo).toBe('');
    expect(wrapper.vm.checkboxEquipamentosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxServicosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxMateriaisHabilitado).toBe(true);
    expect(wrapper.vm.checkboxDespesasHabilitado).toBe(true);
    expect(wrapper.vm.totalEmAliquotasDosEquipamentos).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosServicos).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosMateriais).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDasDespesas).toBe(0);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado).toBe('');
  });

  it('Valida os métodos do watch.', () => {    
    wrapper.vm.adicionalPersonalizado = new AdicionalPersonalizadoModel();

    wrapper.vm.itemDeAdicional = new ItemAdicionalPersonalizadoModel();
    wrapper.vm.itemDeAdicional.descricao = 'descrição';
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNome).toBe('');
    wrapper.vm.itemDeAdicional.aliquota = 236;
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeAliquota).toBe('');
    
    wrapper.vm.itemDeAdicional.atualizaEquipamentos = true;
    expect(wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado).toBe('');
    wrapper.vm.itemDeAdicional.atualizaEquipamentos = false;
    
    wrapper.vm.itemDeAdicional.atualizaServicos = true;
    expect(wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado).toBe('');
    wrapper.vm.itemDeAdicional.atualizaServicos = false;

    wrapper.vm.itemDeAdicional.atualizaMateriais = true;
    expect(wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado).toBe('');
    wrapper.vm.itemDeAdicional.atualizaMateriais = false;

    wrapper.vm.itemDeAdicional.atualizaDespesas = true;
    expect(wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado).toBe('');
    wrapper.vm.itemDeAdicional.atualizaDespesas = false;

    wrapper.vm.mensagemDeErroPorFaltaDeIndices = 'mensagemDeErroPorFaltaDeIndices';
    expect(wrapper.vm.divDeIndicesSendoExibida).toBe(true);
    wrapper.vm.divDeIndicesSendoExibida = false;
    wrapper.vm.mensagemDeErroPorFaltaDeIndices = '';
    expect(wrapper.vm.divDeIndicesSendoExibida).toBe(false);
    
    wrapper.vm.checkboxEquipamentosHabilitado = false;
    expect(wrapper.vm.itemDeAdicional.atualizaEquipamentos).toBe(false);

    wrapper.vm.checkboxServicosHabilitado = false;
    expect(wrapper.vm.itemDeAdicional.atualizaServicos).toBe(false);

    wrapper.vm.checkboxMateriaisHabilitado = false;
    expect(wrapper.vm.itemDeAdicional.atualizaMateriais).toBe(false);

    wrapper.vm.checkboxDespesasHabilitado = false;
    expect(wrapper.vm.itemDeAdicional.atualizaDespesas).toBe(false);

    wrapper.vm.checkboxEquipamentosHabilitado = true;
    wrapper.vm.checkboxServicosHabilitado = true;
    wrapper.vm.checkboxMateriaisHabilitado = true;
    wrapper.vm.checkboxDespesasHabilitado = true;
  });

  it('Valida o valor computed mensagemErroCheckboxBase.', () => {
    wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado = "";
    expect(wrapper.vm.mensagemErroCheckboxBase).toBe('');

    wrapper.vm.mensagemDeErroPorFaltaDeBaseSelecionado = "mensagem";
    expect(wrapper.vm.mensagemErroCheckboxBase).toBe("mensagem");

    wrapper.vm.mensagemDeErroPorUltrapassarAliquotaMaxima = "";
    expect(wrapper.vm.mensagemErroCheckboxBase).toBe("mensagem");

    wrapper.vm.mensagemDeErroPorUltrapassarAliquotaMaxima = "teste";
    expect(wrapper.vm.mensagemErroCheckboxBase).toBe(" ");
  });

  it('Valida o valor computed botaoPrincipalDesabilitado.', () => {
    wrapper.vm.divDeIndicesSendoExibida = false;
    wrapper.vm.indexDoItemEditado = -1;

    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(false);

    wrapper.vm.divDeIndicesSendoExibida = true;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(false);

    wrapper.vm.itemDeAdicional.descricao = 'teste';
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);

    wrapper.vm.itemDeAdicional.descricao = '';
    wrapper.vm.itemDeAdicional.aliquota =  1;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);

    wrapper.vm.itemDeAdicional.aliquota =  0;
    wrapper.vm.itemDeAdicional.atualizaEquipamentos = true;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);

    wrapper.vm.itemDeAdicional.atualizaEquipamentos = false;
    wrapper.vm.itemDeAdicional.atualizaServicos = true;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);

    wrapper.vm.itemDeAdicional.atualizaServicos = false;
    wrapper.vm.itemDeAdicional.atualizaMateriais = true;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);

    wrapper.vm.itemDeAdicional.atualizaMateriais = false;
    wrapper.vm.itemDeAdicional.atualizaDespesas = true;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);

    wrapper.vm.itemDeAdicional.atualizaDespesas = false;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(false);

    wrapper.vm.indexDoItemEditado = 1;
    expect(wrapper.vm.botaoPrincipalDesabilitado).toBe(true);
  });

  it('Valida o método descricaoDeItemDeAdicionalAlterado.', () => {
    wrapper.vm.descricaoDeItemDeAdicionalAlterado();

    wrapper.vm.mensagemDeErroPorFaltaDeIndices = 'teste';
    wrapper.vm.deveValidarCamposDosItens = false;
    wrapper.vm.mensagemDeErroPorFaltaDeNome = '';

    wrapper.vm.descricaoDeItemDeAdicionalAlterado();

    expect(wrapper.vm.deveValidarCamposDosItens).toBe(true);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNome).toBe('');
  });

  it('Valida o método aliquotaDeItemDeAdicionalAlterada.', () => {
    wrapper.vm.aliquotaDeItemDeAdicionalAlterada();

    wrapper.vm.mensagemDeErroPorFaltaDeIndices = 'teste';
    wrapper.vm.deveValidarCamposDosItens = false;
    wrapper.vm.mensagemDeErroPorFaltaDeAliquota = '';

    wrapper.vm.aliquotaDeItemDeAdicionalAlterada();

    expect(wrapper.vm.deveValidarCamposDosItens).toBe(true);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeAliquota).toBe(' ');
  });

  it('Valida o método aliquotaDeItemDeAdicionalAlterada.', () => {
    wrapper.vm.checkboxEquipamentosHabilitado = false;
    wrapper.vm.checkboxServicosHabilitado = false;
    wrapper.vm.checkboxMateriaisHabilitado = false;
    wrapper.vm.checkboxDespesasHabilitado = false;

    wrapper.vm.validaTotalEmAliquotas(101);
    expect(wrapper.vm.checkboxEquipamentosHabilitado).toBe(false);
    expect(wrapper.vm.checkboxServicosHabilitado).toBe(false);
    expect(wrapper.vm.checkboxMateriaisHabilitado).toBe(false);
    expect(wrapper.vm.checkboxDespesasHabilitado).toBe(false);

    wrapper.vm.validaTotalEmAliquotas(undefined);
    expect(wrapper.vm.checkboxEquipamentosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxServicosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxMateriaisHabilitado).toBe(true);
    expect(wrapper.vm.checkboxDespesasHabilitado).toBe(true);

    wrapper.vm.totalEmAliquotasDosEquipamentos = 50;
    wrapper.vm.totalEmAliquotasDosServicos = 50;
    wrapper.vm.totalEmAliquotasDosMateriais = 50;
    wrapper.vm.totalEmAliquotasDasDespesas = 50;

    wrapper.vm.validaTotalEmAliquotas(20);
    expect(wrapper.vm.checkboxEquipamentosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxServicosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxMateriaisHabilitado).toBe(true);
    expect(wrapper.vm.checkboxDespesasHabilitado).toBe(true);

    wrapper.vm.validaTotalEmAliquotas(60);
    expect(wrapper.vm.checkboxEquipamentosHabilitado).toBe(false);
    expect(wrapper.vm.checkboxServicosHabilitado).toBe(false);
    expect(wrapper.vm.checkboxMateriaisHabilitado).toBe(false);
    expect(wrapper.vm.checkboxDespesasHabilitado).toBe(false);
  });

  it('Valida o método abrirDivDeIndices.', () => {
    wrapper.vm.divDeIndicesSendoExibida = false;
    wrapper.vm.mensagemDeErroPorFaltaDeAliquota = 'teste';

    wrapper.vm.abrirDivDeIndices();

    expect(wrapper.vm.divDeIndicesSendoExibida).toBe(true);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeAliquota).toBe('');
  });

  it('Valida o método editarItem.', () => {
    let item = new ItemAdicionalPersonalizadoModel();
    item.aliquota = 12,5;
    item.atualizaDespesas = true;
    item.atualizaEquipamentos = true;
    item.atualizaMateriais = true;
    item.atualizaServicos = true;
    item.descricao = 'descricao teste';

    wrapper.vm.adicionalPersonalizado.itens = [item];
    wrapper.vm.indexDoItemEditado = 0;

    wrapper.vm.editarItem(wrapper.vm.adicionalPersonalizado.itens[0]);

    wrapper.vm.indexDoItemEditado = -1;
    wrapper.vm.editarItem(wrapper.vm.adicionalPersonalizado.itens[0]);
    expect(wrapper.vm.indexDoItemEditado).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosEquipamentos).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosServicos).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosMateriais).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDasDespesas).toBe(0);
  });

  it('Valida o método atualizarTotalizadores.', () => {
    let item = new ItemAdicionalPersonalizadoModel();
    item.aliquota = 12.5;
    item.atualizaDespesas = true;
    item.atualizaEquipamentos = true;
    item.atualizaMateriais = true;
    item.atualizaServicos = true;
    item.descricao = 'descricao teste';

    wrapper.vm.adicionalPersonalizado.itens = [item, item];
    wrapper.vm.atualizarTotalizadores();

    expect(wrapper.vm.totalEmAliquotasDosEquipamentos).toBe(25);
    expect(wrapper.vm.totalEmAliquotasDosServicos).toBe(25);
    expect(wrapper.vm.totalEmAliquotasDosMateriais).toBe(25);
    expect(wrapper.vm.totalEmAliquotasDasDespesas).toBe(25);
  });

  it('Valida o método obterTotal.', () => {
    let deveIncindirAliquota = false;
    let totalCalculado = 5;
    let aliquota = 10.5;
    let subtrair = false;
    let totalEsperado = 5;

    let total = wrapper.vm.obterTotal(deveIncindirAliquota, totalCalculado, aliquota, subtrair);

    expect(total).toBe(totalEsperado);

    deveIncindirAliquota = true;
    total = wrapper.vm.obterTotal(deveIncindirAliquota, totalCalculado, aliquota, subtrair);
    totalEsperado = 15.5;
    expect(total).toBe(totalEsperado);

    subtrair = true;
    deveIncindirAliquota = true;
    total = wrapper.vm.obterTotal(deveIncindirAliquota, totalCalculado, aliquota, subtrair);
    totalEsperado = 5;
    expect(total).toBe(totalEsperado);
  });

  it('Valida o método removerItem.', () => {
    let item = new ItemAdicionalPersonalizadoModel();
    item.aliquota = '12,5';
    item.atualizaDespesas = true;
    item.atualizaEquipamentos = true;
    item.atualizaMateriais = true;
    item.atualizaServicos = true;
    item.descricao = 'descricao teste';

    wrapper.vm.adicionalPersonalizado.itens = [item];

    wrapper.vm.removerItem(item);

    expect(wrapper.vm.adicionalPersonalizado.itens.length).toBe(0);
  });

  it('Valida o método salvarItem.', () => {
    wrapper.vm.salvarItem();
    wrapper.vm.itensValidos = false;
    expect(wrapper.vm.deveValidarCamposDosItens).toBe(true);
    expect(wrapper.vm.deveValidarNomeIndiceVazio).toBe(true);
  });

  it('Valida o método inserirNovoItem.', () => {
    let item = new ItemAdicionalPersonalizadoModel();
    item.aliquota = '12,5';
    item.atualizaDespesas = true;
    item.atualizaEquipamentos = true;
    item.atualizaMateriais = true;
    item.atualizaServicos = true;
    item.descricao = 'descricao teste';

    wrapper.vm.inserirNovoItem();
    expect(wrapper.vm.formatarItemParaAdicionarNoModeloDeAdicional(item)).toBe(item);
  });

  it('Valida o método limparModeloDeItemAdicional.', () => {
    wrapper.vm.limparModeloDeItemAdicional();
    expect(wrapper.vm.deveValidarCamposDosItens).toBe(false);

    wrapper.vm.indexDoItemEditado = -1;
    // eslint-disable-next-line no-unused-vars
    let itemDeAdicional = new ItemAdicionalPersonalizadoModel();
  });

  it('Valida o método cancelarAdicionalPersonalizado.', () => {
    wrapper.vm.cancelarAdicionalPersonalizado();
    expect(wrapper.emitted().fecharModal).toBeTruthy();
  });

  it('Valida o método itensValidos.', () => {
    wrapper.vm.itemDeAdicional.atualizaEquipamentos = false;
    wrapper.vm.itemDeAdicional.atualizaServicos = true;
    wrapper.vm.itemDeAdicional.atualizaMateriais = false;
    wrapper.vm.itemDeAdicional.atualizaDespesas = true;
    let resultado = wrapper.vm.algumCheckBoxSelecionado();
    expect(resultado).toBe(true);

    wrapper.vm.itemDeAdicional.atualizaEquipamentos = false;
    wrapper.vm.itemDeAdicional.atualizaServicos = false;
    wrapper.vm.itemDeAdicional.atualizaMateriais = false;
    wrapper.vm.itemDeAdicional.atualizaDespesas = false;
    resultado = wrapper.vm.algumCheckBoxSelecionado();
    expect(resultado).toBe(false);
  });

  it('Valida o método aliquotaDoItemValida.', () => {
    wrapper.vm.deveValidarCamposDosItens = false;
    let aliquota = '';
    let resultado = wrapper.vm.aliquotaDoItemValida(aliquota);
    expect(resultado).toBe('');

    wrapper.vm.deveValidarCamposDosItens = true;

    aliquota = '0';
    resultado = wrapper.vm.aliquotaDoItemValida(aliquota);
    expect(resultado).toBe(' ');

    aliquota = '1';
    resultado = wrapper.vm.aliquotaDoItemValida(aliquota);
    expect(resultado).toBe('');
  });

  it('Valida o método aliquotaDoItemValida.', () => {
    let descricao = '';
    let validarDescricaoRepetida = false;
    wrapper.vm.deveValidarCamposDosItens = false;
    let resultado = wrapper.vm.descricaoDeItemValida(descricao, validarDescricaoRepetida);
    expect(resultado).toBe('');

    wrapper.vm.deveValidarCamposDosItens = true;
    wrapper.vm.deveValidarNomeIndiceVazio = false;
    resultado = wrapper.vm.descricaoDeItemValida(descricao, validarDescricaoRepetida);
    expect(resultado).toBe('');

    wrapper.vm.deveValidarCamposDosItens = true;
    wrapper.vm.deveValidarNomeIndiceVazio = true;
    resultado = wrapper.vm.descricaoDeItemValida(descricao, validarDescricaoRepetida);
    expect(resultado).toBe('Obrigatório');

    wrapper.vm.deveValidarCamposDosItens = true;
    descricao = 'descricao';
    resultado = wrapper.vm.descricaoDeItemValida(descricao, validarDescricaoRepetida);
    expect(resultado).toBe('');
  });

  it('Deve formatar aliquota quando o filter for chamado.', () => {
    expect(typeof wrapper.vm.$options.filters.formataAliquota('50,55')).toBe('string');
    expect(wrapper.vm.$options.filters.formataAliquota('50,55')).toBe('50,55%');
  });

  it('Deve formatar aliquota quando o filter for chamado.', () => {
    expect(typeof wrapper.vm.$options.filters.convertePontoEmVirgula('50.55')).toBe('string');
    expect(wrapper.vm.$options.filters.convertePontoEmVirgula('50.55')).toBe('50.55');
  });

  it('Deve retornar o nome do formulario de acordo com o indice passado.', () => {
    wrapper.vm.indexDoItemEditado = -1;
    expect(wrapper.vm.formTitle).toBe('Novo índice');

    wrapper.vm.indexDoItemEditado = 0;
    expect(wrapper.vm.formTitle).toBe('Editar índice');
  });

  it('Deve retornar o título do modal.', () => {
    wrapper.vm.modoEdicao = true;
    expect(wrapper.vm.tituloModal).toBe('Editar adicional personalizado');

    wrapper.vm.modoEdicao = false;
    expect(wrapper.vm.tituloModal).toBe('Novo adicional personalizado');
  });

  it('Deve limpar os campos para fechar o modal.', () => {
    wrapper.vm.limparCamposParaFecharModal();
    expect(wrapper.vm.itemDeAdicional).toEqual(new ItemAdicionalPersonalizadoModel());
    expect(wrapper.vm.checkboxEquipamentosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxServicosHabilitado).toBe(true);
    expect(wrapper.vm.checkboxMateriaisHabilitado).toBe(true);
    expect(wrapper.vm.checkboxDespesasHabilitado).toBe(true);
    expect(wrapper.vm.totalEmAliquotasDosEquipamentos).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosServicos).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDosMateriais).toBe(0);
    expect(wrapper.vm.totalEmAliquotasDasDespesas).toBe(0);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNome).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeAliquota).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNomeDoModelo).toBe('');
    expect(wrapper.vm.divDeIndicesSendoExibida).toBe(false);
  });

  it('Deve atribuir as informações para exibir mensagem.', () => {
    wrapper.vm.alerta.disparar = false;
    wrapper.vm.dispararMensagem('mensagem', 'tipo');

    expect(wrapper.vm.alerta.mensagem).toBe('mensagem');
    expect(wrapper.vm.alerta.tipo).toBe('tipo');
    expect(wrapper.vm.alerta.disparar).toBe(true);
  });

  it('Deve verificar se o modelo de adicional personalizado é valido', () => {
    let adicionalPersonalizado = new AdicionalPersonalizadoModel();
    adicionalPersonalizado.descricao = '';
    wrapper.vm.adicionalPersonalizado = adicionalPersonalizado;

    let modeloValido = wrapper.vm.modeloDeAdicionalPersonalizadoValido();

    expect(modeloValido).toBe(false);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNomeDoModelo).toBe('O nome é obrigatório');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('É necessário pelo menos 1 índice.');

    wrapper.vm.adicionalPersonalizado.identificador = 1;
    wrapper.vm.adicionalPersonalizado.codigo = '00001';
    wrapper.vm.adicionalPersonalizado.descricao = false;
    wrapper.vm.adicionalPersonalizado.itens = [new ItemAdicionalPersonalizadoModel({
      aliquota: 10,
      atualizaDespesas: true,
      atualizaEquipamentos: false,
      atualizaMateriais: true,
      atualizaServicos: true,
      descricao: 'descricao item'}
    )];

    modeloValido = wrapper.vm.modeloDeAdicionalPersonalizadoValido();

    expect(modeloValido).toBe(true);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNomeDoModelo).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');

    wrapper.vm.adicionaisPersonalizados = [wrapper.vm.adicionalPersonalizado];
    modeloValido = wrapper.vm.modeloDeAdicionalPersonalizadoValido();

    expect(modeloValido).toBe(true);
    expect(wrapper.vm.mensagemDeErroPorFaltaDeNomeDoModelo).toBe('');
    expect(wrapper.vm.mensagemDeErroPorFaltaDeIndices).toBe('');
  });

  it('Validar o método salvarAdicionalPersonalizado.', () => {
    wrapper.vm.salvarAdicionalPersonalizado();

    let adicionalParaEnviar = new AdicionalPersonalizadoModel;
    wrapper.vm.modoEdicao = true;
    wrapper.vm.atualizarAdicionalPersonalizado(adicionalParaEnviar);

    wrapper.vm.modoEdicao = false;
    wrapper.vm.cadastrarAdicionalPersonalizado(adicionalParaEnviar);
  });

  it('Validar o método atualizarAdicionalPersonalizado.', async () => {
    let modelo = { identificador: 333 };

    jest.spyOn(adicionalPersonalizadoApi, 'editar')
        .mockImplementation(() => Promise.resolve({}));

    await wrapper.vm.atualizarAdicionalPersonalizado(modelo.identificador);
    wrapper.vm.dispararMensagem("Mensagem Teste", "success");
    expect(wrapper.vm.alerta.mensagem).toBe("Mensagem Teste");
    expect(wrapper.vm.alerta.tipo).toBe("success");

    jest.spyOn(adicionalPersonalizadoApi, 'editar')
        .mockImplementation(() => Promise.reject("Houve um erro na API"));

    await wrapper.vm.atualizarAdicionalPersonalizado(modelo.identificador);
  });

  it('Validar o método cadastrarAdicionalPersonalizado.', async () => {
    let modelo = { identificador: 333 };

    jest.spyOn(adicionalPersonalizadoApi, 'cadastrar')
        .mockImplementation(() => Promise.resolve({}));

    await wrapper.vm.cadastrarAdicionalPersonalizado(modelo.identificador);
    wrapper.vm.dispararMensagem("Mensagem Teste", "success");
    expect(wrapper.vm.alerta.mensagem).toBe("Mensagem Teste");
    expect(wrapper.vm.alerta.tipo).toBe("success");

    jest.spyOn(adicionalPersonalizadoApi, 'cadastrar')
        .mockImplementation(() => Promise.reject("Houve um erro na API"));

    await wrapper.vm.cadastrarAdicionalPersonalizado(modelo.identificador);
  });
});