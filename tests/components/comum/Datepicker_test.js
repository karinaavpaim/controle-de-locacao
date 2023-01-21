import { mount } from '@vue/test-utils';
import Datepicker from '@/components/comum/Datepicker.vue';
import moment from 'moment';

describe('Datepicker.vue', () => {
  var wrapper;

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      propsData: {
        label: 'Label para teste',
        dataSelecionada: undefined,
        mensagemDeErro: 'Mensagem de erro',
        hint: 'hint para teste',
        dataMinima: '1988-03-23',
        dataMaxima: '2200-12-31',
        cor: '#165091',
        apresentarTitulo: false
      }
    });
  });

  it('Deve definir os dados padrão(data()) do componente.', () => {
    const datepicker = Datepicker.data();
    expect(datepicker.dataDeHoje.milliseconds(0)).toEqual(moment().milliseconds(0));
    expect(datepicker.dataDatePicker).toEqual(moment().format('YYYY/MM/DD'));
    expect(datepicker.dataFormatada).toBeUndefined();
    expect(datepicker.openCalendar).toBeFalsy();
    expect(datepicker.dataInvalida).toBeFalsy();
  });

  it('Deve renderizar as props quando passado.', () => {
    expect(wrapper.props().entrada).toBeUndefined();
    expect(wrapper.props().label).toBe('Label para teste');
    expect(wrapper.props().dataSelecionada).toBeUndefined();
    expect(wrapper.props().mensagemDeErro).toBe('Mensagem de erro');
    expect(wrapper.props().hint).toBe('hint para teste');
    expect(wrapper.props().dataMinima).toBe('1988-03-23');
    expect(wrapper.props().dataMaxima).toBe('2200-12-31');
    expect(wrapper.props().cor).toBe('#165091');
    expect(wrapper.props().apresentarTitulo).toBeFalsy();
  });

  it('Deve verificar se todos métodos definidos no objeto watch estão criados.', () => {
    expect(typeof Datepicker.watch.dataDatePicker).toBe('function');
    expect(typeof Datepicker.watch.dataSelecionada).toBe('function');
  });

  it('Deve verificar se todos métodos definidos no objeto methods estão criados.', () => {
    expect(typeof Datepicker.methods.atualizarDataModificada).toBe('function');
    expect(typeof Datepicker.methods.formatarDataParaPadraoBrasileiro).toBe('function');
    expect(typeof Datepicker.methods.converterDataFormatadaEmDataPadraoOnClick).toBe('function');
    expect(typeof Datepicker.methods.converterDataFormatadaEmDataPadraoOnBlur).toBe('function');
    expect(typeof Datepicker.methods.converterDataFormatadaEmDataPadraoOnEnter).toBe('function');
    expect(typeof Datepicker.methods.converterDataFormatadaEmDataPadraoOnTab).toBe('function');
    expect(typeof Datepicker.methods.dataValida).toBe('function');
  });

  it('Deve emitir o date quando o método dataDatePicker é chamado. (apenas para datas diferentes da atual)', async (done) => {
    var dataRegistrada = '2019-05-15';
    var dataEsperada = '15/05/2019';

    wrapper.setData({ entrada: dataRegistrada });

    await wrapper.vm.$nextTick(async ()=>{
      try{
        expect(wrapper.vm.dataFormatada).toBe(dataEsperada);
    
        expect(wrapper.emitted().dataDatePicker).toBeUndefined();
        expect(wrapper.emitted().dataFormatada).toBeUndefined();
        wrapper.vm.dataDatePicker = "2019-05-16";
        wrapper.vm.atualizarDataModificada();
        await wrapper.vm.$nextTick(()=>{
          try {
            expect(wrapper.emitted().dataDatePicker).toBeTruthy();
            expect(wrapper.emitted().dataFormatada).toBeTruthy();
            done();
          }
          catch(err){done.fail(err)}
        })
      }
      catch(err){done.fail(err)}
    })
  });

  it('Deve emitir o date quando o método dataSelecionada é chamado.', () => {
    var dataSelecionada = '15/05/2019';
    var dataEsperada = '15/05/2019';

    wrapper.vm.dataSelecionada = dataSelecionada;
    expect(wrapper.vm.dataFormatada).toBe(dataEsperada);
  });

  it('Deve retornar null quando o método formatarDataParaPadraoBrasileiro é chamado sem parâmetro.', () => {
    expect(wrapper.vm.formatarDataParaPadraoBrasileiro()).toBeFalsy();
  });

  it('Deve converter uma data formatada no padrão brasileiro (DD/MM/AAAA) em formato de data padrão (AAAA-MM-DD).', () => {
    var dataFormatada = '15/05/2019';
    var dataConvertida = '2019-05-15';

    expect(wrapper.vm.converterDataFormatadaEmDataPadrao()).toBeFalsy();
    expect(wrapper.vm.converterDataFormatadaEmDataPadraoOnClick(dataFormatada)).toBe(dataConvertida);
    expect(wrapper.vm.converterDataFormatadaEmDataPadraoOnBlur(dataFormatada)).toBe(dataConvertida);
    expect(wrapper.vm.converterDataFormatadaEmDataPadraoOnEnter(dataFormatada)).toBe(dataConvertida);
    expect(wrapper.vm.converterDataFormatadaEmDataPadraoOnTab(dataFormatada)).toBe(dataConvertida);
  });

  it('Deve retornar a data formatada quando passar uma data em ISO na prop entrada.', () => {
    expect(wrapper.vm.dataFormatada).toBeUndefined();
    wrapper.vm.entrada = "2019-08-30";
    expect(wrapper.vm.dataFormatada).toBe('30/08/2019');
  });

  it('Deve retornar data em formato valido mesmo que o usuário informe uma data inválida', () => {  
    
    // Toda data invalida retorna Invalid date.
    expect(wrapper.vm.formatarDataParaPadraoBrasileiro(wrapper.vm.retornarDataEmFormatoValido('Invalid date')))
    .toBe(wrapper.vm.formatarDataParaPadraoBrasileiro(wrapper.vm.dataDeHoje));

    // Comparando o ano com o ano da data mínima
    expect(wrapper.vm.formatarDataParaPadraoBrasileiro(wrapper.vm.retornarDataEmFormatoValido('1987-01-01')))
    .toBe(wrapper.vm.formatarDataParaPadraoBrasileiro('1988-01-01'));
    
    // Comparando o ano com o ano da data máxima
    expect(wrapper.vm.formatarDataParaPadraoBrasileiro(wrapper.vm.retornarDataEmFormatoValido('3001-01-01')))
    .toBe(wrapper.vm.formatarDataParaPadraoBrasileiro('2200-01-01'));
  });

  it('Deve abrir o calendário ao clicar no ícone', () => {
    wrapper.vm.abrirCalendarioPeloIconeOnClick();
    expect(wrapper.vm.converterDataFormatadaEmDataPadraoOnClick()).toBeUndefined();
    expect(wrapper.vm.openCalendar).toBe(true);
  })
});