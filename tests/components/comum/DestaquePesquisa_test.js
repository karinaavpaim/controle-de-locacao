import { mount } from '@vue/test-utils';
import DestaquePesquisa from '@/components/comum/DestaquePesquisa.vue';

describe('DestaquePesquisa.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(DestaquePesquisa, {
      slots: {
        default: 'TEXTO A SER DESTACADO'
      },
      propsData: {
        pesquisa: ''
      }
    });
  });

  describe('Construção - ', () => {
    it('Deve renderizar as props quando passado.', () => {
      expect(wrapper.props().pesquisa).toBe('');
    });
  });

  describe('gerarTrechos - ', () => {
    it('Deve gerar um array contendo techos do texto, em sequencia, de acordo com a pesquisa (mesmo com pesquisa minuscula)', () => {
      wrapper.vm.$set(wrapper.vm, 'pesquisa', 'SER');
      expect(wrapper.vm.gerarTrechos('TEXTO A SER DESTACADO')).toEqual(["TEXTO A ", "SER", " DESTACADO"]);

      wrapper.vm.$set(wrapper.vm, 'pesquisa', 'texto');
      expect(wrapper.vm.gerarTrechos('TEXTO A SER DESTACADO')).toEqual(["TEXTO", " A SER DESTACADO"]);

      wrapper.vm.$set(wrapper.vm, 'pesquisa', 'destacado');
      expect(wrapper.vm.gerarTrechos('TEXTO A SER DESTACADO')).toEqual(["TEXTO A SER ", "DESTACADO"]);
    });
  });

  describe('destacarTrecho - ', () => {
    it('Deve retornar true quando o texto deve ser destacado, caso contrario, false', () => {
      let textoPesquisado = 'SER';
      wrapper.vm.$set(wrapper.vm, 'pesquisa', textoPesquisado);
      let trechosMock = ["TEXTO A ", "SER", " DESTACADO"];
      expect(wrapper.vm.destacarTrecho(trechosMock[0])).toBeFalsy();
      expect(wrapper.vm.destacarTrecho(trechosMock[1])).toBeTruthy();
      expect(wrapper.vm.destacarTrecho(trechosMock[2])).toBeFalsy();
    });
  });

});