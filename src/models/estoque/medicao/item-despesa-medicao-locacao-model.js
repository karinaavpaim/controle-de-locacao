import DesmembramentoMedicaoModel from '@/models/estoque/medicao/desmembramento-medicao-model';

export default class ItemDespesaMedicaoLocacaoModel {
  constructor(obj) {
    obj = obj || {};
    this.valorTotal = obj.valorTotal || 0;
    this.identificadorEntidadeOrigem = obj.identificadorEntidadeOrigem;
    this.medirPeloOrcado = obj.medirPeloOrcado;
    this.incluidoNaGestao = obj.incluidoNaGestao;
    this.status = obj.status;
  }

  preecherDesmembramentosViaCacheItem(itemSalvo){
    if(!itemSalvo) return;

    let listagemDesmembramentosFinal = [];
    this.desmembramentos.forEach(desmembramentoLocal=>{
      if(desmembramentoLocal.totalmenteMedido){
        listagemDesmembramentosFinal.push(desmembramentoLocal)
        return;
      }

      let desmembramentosSalvos = itemSalvo.desmembramentos.filter(
        desmembramento=>desmembramento.identificadorDesmembramento === desmembramentoLocal.identificadorDesmembramento
      );
      //com hierarquia   desmembramentosSalvos > 1 e _hierarquia preenchida
      if(desmembramentosSalvos.length > 1) {

        desmembramentosSalvos.sort(
          (d1, d2)=> {
            if(d1._hierarquia.length > d2._hierarquia.length) return 1;
            if(d1._hierarquia.length < d2._hierarquia.length) return -1;
            return 0;
        });

        this.preencherDesmembramentoOriginalPeloSalvo(desmembramentoLocal, desmembramentosSalvos.shift());
        listagemDesmembramentosFinal.push(desmembramentoLocal);
        listagemDesmembramentosFinal.push(...desmembramentosSalvos.map(ds => {
          let desmembramentoFinal = new DesmembramentoMedicaoModel(desmembramentoLocal);
          desmembramentoFinal.quantidadeAMedir = ds.quantidadeAMedir;
          desmembramentoFinal.datasAMedir = ds.datasAMedir;
          desmembramentoFinal.observacao = ds.observacao;
          desmembramentoFinal.funcionario = ds.funcionario;
          desmembramentoFinal._hierarquia = ds._hierarquia;
          return desmembramentoFinal;
        }));

      }
      //sem hierarquia
      else{
        this.preencherDesmembramentoOriginalPeloSalvo(desmembramentoLocal, desmembramentosSalvos[0])
        listagemDesmembramentosFinal.push(desmembramentoLocal);
      }

    })
    this.desmembramentos = listagemDesmembramentosFinal.sort(d1 => d1.totalmenteMedido ? -1 : 0);
  }

  preencherDesmembramentoOriginalPeloSalvo(original, salvo){
    if (!salvo) return; // Nao tem item salvo, apenas o original
    original.quantidadeAMedir = salvo.quantidadeAMedir;
    original.datasAMedir = salvo.datasAMedir;
    original.observacao = salvo.observacao;
    original.funcionario = salvo.funcionario;
    original._hierarquia = salvo._hierarquia;
  }

  atualizarIdentificadorDosDesmembramentosPreenchidos(){
    let maiorIdentificador = this.desmembramentos.reduce((maiorId, d)=> maiorId > d.identificadorDesmembramento ? maiorId : d.identificadorDesmembramento, 0);
    // filtro para remocao dos desmembramentos que nao foram preenchidos (evitar problemas com os identificadores)
    this.desmembramentos = this.desmembramentos.filter((desmembramento)=>(!desmembramento._hierarquia || desmembramento._hierarquia.length == 1) || desmembramento.modeloAlterado());
    this.desmembramentos.forEach(
      desmembramento=>{
        if (desmembramento.modeloAlterado() && desmembramento.quantidadeAMedir != desmembramento.quantidadeMaxima)
        {

          if (!desmembramento._hierarquia) {
            maiorIdentificador = this._alterarIdentificadoresDoDesmembramentoRetornandoUltimoId(maiorIdentificador, desmembramento);
          }
          //caso seja um desmembramento origem de clones, utilizo outro metodo
          else if (desmembramento._hierarquia.length === 1)
            maiorIdentificador = this._atualizarIdentificadorDosDesmembramentosClonados(maiorIdentificador, desmembramento);
        }
    });

    // removo o campo adicional apos todas operacoes
    this.desmembramentos.forEach((d)=>d._hierarquia = undefined);
  }

  _atualizarIdentificadorDosDesmembramentosClonados(maiorIdentificador, desmembramento){
    // esse metodo separa todos os clones do desmembramento atual e os ordena
    // logo em seguida, atualiza os identificadores de cada um, na ordem em que foram gerados
    // o identificadorOrigem de cada clone deve ser o identificador do clone anterior
    this
      .obterClonesDoDesmembramento(desmembramento)
      .sort(
        (d1, d2)=> {
          if(d1._hierarquia.length > d2._hierarquia.length) return 1;
          if(d1._hierarquia.length < d2._hierarquia.length) return -1;
          return 0;
      })
      .forEach((d, indice, clones)=>{

        if (!indice) {
          maiorIdentificador = this._alterarIdentificadoresDoDesmembramentoRetornandoUltimoId(maiorIdentificador, d);
          return;
        }

        if (indice >= (clones.length - 1)) {
          d.identificadorDesmembramento = clones[indice-1].identificadorDesmembramentoOrigem;
        }
        else {
          maiorIdentificador++;
          d.identificadorDesmembramento = maiorIdentificador;
        }

        maiorIdentificador = this._alterarIdentificadoresDoDesmembramentoRetornandoUltimoId(maiorIdentificador, d);

      })
    return maiorIdentificador;
  }

  _alterarIdentificadoresDoDesmembramentoRetornandoUltimoId(maiorIdentificador, desmembramento){
    desmembramento.identificadorDesmembramentoOrigem = desmembramento.identificadorDesmembramento;
    return desmembramento.identificadorDesmembramento = maiorIdentificador += 1;
  }

  obterClonesDoDesmembramento(desmembramento){
    return this.desmembramentos 
      .filter((d)=>
        d._hierarquia && 
        (d.identificadorDesmembramento === desmembramento.identificadorDesmembramento)
      )
  }

  quantidadeDosClonesUltrapassaMaximo(desmembramento){
    // Se a soma das quantidades a medir dos clones ultrapassar a quantidade maxima, gero erro.
    let quantidadeMaxima = desmembramento.quantidadeMaxima;
    return this.obterClonesDoDesmembramento(desmembramento)
      // uso o .some pois se em algum momento ultrapassar o valor maximo, posso parar o loop.
      .some((desmembramento, indice)=>{
        quantidadeMaxima = quantidadeMaxima - desmembramento.quantidadeAMedir;
        //a quantidade maxima para o desmembramento principal ja esta sendo verificada em outro ponto
        if(!indice) return false;

        return (quantidadeMaxima < 0)
      })
  }

  obterErrosNosClonesDoDesmembramento(prefixoErro, desmembramento){
    let erros = [];
    if (this.quantidadeDosClonesUltrapassaMaximo(desmembramento))
      erros.push(prefixoErro+"contém medições que ultrapassam a quantidade máxima possível.");
    return erros;
  }

  obterErrosGeraisNoDesmembramento(prefixoErro, desmembramento){
    let erros = [];

    if (desmembramento.quantidadeAMedir > desmembramento.quantidadeMaxima)
      erros.push(prefixoErro+"contém uma medição maior do que o disponível.");

    if (desmembramento.quantidadeAMedir < 1)
      erros.push(prefixoErro+"contém uma medição com quantidade inválida");
    
    if (!desmembramento.datasAMedir.length)
      erros.push(prefixoErro+"deve ter data(s) a medir.");

    if (desmembramento.datasAMedir.length > (this.quantidadeDiarias - desmembramento.datasMedidas.length))
      erros.push(prefixoErro+"ultrapassa o total de dias disponíveis para medição.");

    return erros;
  }
}