import { mount } from '@vue/test-utils';
import DatepickerMultipleValue from '@/components/comum/DatepickerMultipleValue';

describe('DatepickerMultipleValue.vue', () => {
  let wrapper;
  let datasEntrada = ['2020-02-02', "2020-02-03"];
  let rangeDatas = ['2020-02-02','2020-02-03','2020-02-05','2020-02-08','2020-02-09'];

  beforeEach(() => {
    wrapper = mount(DatepickerMultipleValue, {
      propsData: {
        entrada: datasEntrada,
        label: 'Label para teste',
        dataMinima: '2000-05-08',
        dataMaxima: '2300-12-31',
        semDados: "Não há data"
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    expect(wrapper.vm.datas).toEqual(datasEntrada);
    expect(wrapper.vm.dataApresentacao).toBe("2 datas selecionadas");
  
    wrapper.vm.datas = ["2020-02-03"];
    expect(wrapper.vm.dataApresentacao).toBe("1 data selecionada");
    expect(wrapper.vm.menu).toBeFalsy();
  });

  it('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().entrada).toEqual(datasEntrada);
    expect(wrapper.props().label).toBe('Label para teste');
    expect(wrapper.props().valorApresentacao).toBe(" datas selecionadas");
    expect(wrapper.props().apresentarTooltip).toBeFalsy();
    expect(wrapper.props().semDados).toBe("Não há data");
    expect(wrapper.props().dataMinima).toBe('2000-05-08');
    expect(wrapper.props().dataMaxima).toBe('2300-12-31');
  });

  it('Deve verificar se todos métodos definidos no objeto watch estão criados.', () => {
    expect(typeof DatepickerMultipleValue.watch.datas).toBe('function');
    expect(typeof DatepickerMultipleValue.watch.entrada).toBe('function');
  });

  it('Deve verificar se todos métodos definidos no objeto methods estão criados.', () => {
    expect(typeof DatepickerMultipleValue.methods.montarArrayComRangeDeDatas).toBe('function');
    expect(typeof DatepickerMultipleValue.methods.adicionarNovaDataNoArray).toBe('function');
    expect(typeof DatepickerMultipleValue.methods.ordenarArray).toBe('function');
    expect(typeof DatepickerMultipleValue.methods.montarRangeDatas).toBe('function');
    expect(typeof DatepickerMultipleValue.methods.montarDataDeApresentacao).toBe('function');
    expect(typeof DatepickerMultipleValue.methods.retornarNoFormatoParaApresentacao).toBe('function');
  });

  it('Deve emitir o array de dadas quando o método montarDataDeApresentacao é chamado.', () => {
    wrapper.vm.montarDataDeApresentacao(datasEntrada);
    expect(wrapper.emitted().onChange).toBeTruthy();
  });

  it('Deve emitir o array de datas quando o método montarRangeDatas é chamado.', () => {
    wrapper.vm.montarRangeDatas(datasEntrada);
    expect(wrapper.emitted().onChangeRange).toBeTruthy();
  });

  it('Deve montar um array com os range de datas', () => {
    let arrayDatas = wrapper.vm.montarArrayComRangeDeDatas(rangeDatas);
    expect(arrayDatas.length).toBe(3);
    expect(arrayDatas[0]).toEqual({"dataMaior": "2020-02-03", "dataMenor": "2020-02-02"});
    expect(arrayDatas[1]).toEqual({"dataMaior": "2020-02-05", "dataMenor": "2020-02-05"});
    expect(arrayDatas[2]).toEqual({"dataMaior": "2020-02-09", "dataMenor": "2020-02-08"});
  });

  it('Deve retonar as datas do tooltip corretamente', () => {
    let componente = mount(DatepickerMultipleValue, {
      propsData: {}
    });
    expect(componente.vm.datasTooltip).toEqual(["Não há data selecionada"]);
    componente.vm.datas= ['2020-02-05', '2020-02-18','2020-02-16','2020-02-17','2020-02-10'];
    expect(componente.vm.datasTooltip).toEqual(["De 05/02/2020 até 05/02/2020", "De 10/02/2020 até 10/02/2020", "De 16/02/2020 até 18/02/2020"]);
  });

  it('Deve abrir o calendário clicando no ícone', () => {
    wrapper.vm.abrirCalendarioPeloIconeOnClick()
    expect(wrapper.vm.datas).toEqual([]);
    expect(wrapper.vm.menu).toBeTruthy();
  });  
});