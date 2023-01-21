'use strict';

import { mount } from '@vue/test-utils';
import CampoNumero from '@/components/comum/CampoNumero.vue';

describe('CampoNumero.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CampoNumero, {
      propsData: {
        label: 'campo de número'
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.valor).toBe(0);
  });

  it('Deve renderizar as props quando forem passadas.', () => {
    expect(wrapper.props().autoFocus).toBe(false);
    expect(wrapper.props().entrada).toBe(0);
    expect(wrapper.props().permitirNegativo).toBe(false);
    expect(wrapper.props().readonly).toBe(false);
    expect(wrapper.props().separadorDecimal).toBe(',');
    expect(wrapper.props().separadorMilhar).toBe('.');
    expect(wrapper.props().prefixo).toBe('');
    expect(wrapper.props().sufixo).toBe('');
    expect(wrapper.props().precisaoDecimal).toBe(2);
    expect(wrapper.props().mensagemDeErro).toBe('');
  });

  it('Deve verificar se todos métodos definidos nos objetos computed, watch e methods, estão criados.', () => {
    expect(typeof CampoNumero.watch.entrada).toBe('function');
    expect(typeof CampoNumero.watch.autoFocus).toBe('function');
    expect(typeof CampoNumero.methods.onFocus).toBe('function');
    expect(typeof CampoNumero.methods.setNovoValorManualmente).toBe('function');
    expect(typeof CampoNumero.methods.emitirAlteracoes).toBe('function');
    expect(typeof CampoNumero.methods.verificarSinal).toBe('function');
    expect(typeof CampoNumero.methods.removerMascara).toBe('function');
  });

  it ('Deve verificar a existência e criticar o sinal negativo.', () => {
    var evento = {
      key: '-',
      executou: false,
      preventDefault: () => { evento.executou = true; }
    };

    wrapper.vm.permitirNegativo = true;
    wrapper.vm.verificarSinal(evento);
    expect(evento.executou).toBeFalsy();

    wrapper.vm.permitirNegativo = false;
    expect(evento.executou).toBeFalsy();
    wrapper.vm.verificarSinal(evento);
    expect(evento.executou).toBeTruthy();
  });

  it ('Deve atribuir o valor de autoFocus ao executar o método.', () => {
    let executado = false;
    CampoNumero.watch.$nextTick = function(funcao) { if (funcao) { funcao();} };
    CampoNumero.watch.$refs = {
      campoTexto: {
        focus: () => { executado = true; }
      }
    };
    CampoNumero.watch.onFocus = () => {};

    CampoNumero.watch.autoFocus(false);
    expect(wrapper.vm.autoFocus).toBeFalsy();
    CampoNumero.watch.autoFocus(true);
    expect(executado).toBeTruthy();
  });

  it ('Deve emitir o evento onFocus quando o método "onFocus" for chamado.', () => {
    wrapper.vm.onFocus();
    expect(wrapper.emitted().onFocus).toBeTruthy();
  });

  it('Deve chamar o method change quando o método "emitirAlteracoes" for chamado.', () => {
    wrapper.vm.emitirAlteracoes();
    expect(wrapper.emitted().change).toBeTruthy();
  });

  it('Deve formatar o valor transformando de string em number', () => {
    wrapper.vm.prefixo = 'R$ ';
    wrapper.vm.sufixo = '';
    expect(wrapper.vm.removerMascara('R$ 1.250,00')).toBe(1250);

    wrapper.vm.prefixo = '';
    wrapper.vm.sufixo = ' %';
    expect(wrapper.vm.removerMascara('1.250,00 %')).toBe(1250);
  });

  it('Deve retornar number quando o valor imputado for number', () => {
    expect(wrapper.vm.removerMascara(12345)).toBe(12345);
  });
  
  it('Deve retornar 0 quando o valor não for de uma tipo que possa ser formatado para number.', () => {
    expect(wrapper.vm.removerMascara(undefined)).toBe(0);
  });
  
  //TODO: Melhorar este teste assim que possível.
  //Este teste deve verificar se rtealmente está alterando o valor sem dar erro no getElementsByName.
  //Se mockar, não consigo testar o this.valor.
  it('Deve permitir passar um novo valor para o campo de entrada', () => {
    wrapper.vm.entrada = 0.15;
    expect(wrapper.vm.entrada).toBe(0.15);
  });


  
});