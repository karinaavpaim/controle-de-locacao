<template>
  <v-layout wrap :id="id">
    <v-flex xs12 sm12 pb-0>
      <v-autocomplete
        :id="'autocomplete-endereco-entrega-'+id"
        :hide-no-data="desabilitarMensagemNaoHaDados"
        @change="alterarEnderecoDeEntrega"
        v-model="enderecoEntrega"
        :items="enderecos"
        label="Endereço de entrega"
        no-data-text="Nenhum endereço de entrega cadastrado para este cliente."
        item-text="descricao"
        return-object
        autocomplete="off"
        ref="enderecoEntrega"
        :clearable="true">
      </v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
  import apiEndereco from "@/api/sistemas-gerais/endereco-api.js";
  import OrcamentoLocacaoModel from "@/models/faturamento/orcamento-locacao/orcamento-locacao-model";

  export default {
    props: {
      id: { type: String, required: false, default: ()=> 'enderecos-orcamento' },
      orcamentoLocacao: { type: OrcamentoLocacaoModel, required: true}
    },
    model: {
      prop: 'orcamentoLocacao',
      event: 'onChange'
    },

    data: () => ( {
      desabilitarMensagemNaoHaDados: true,
      identificadorClienteAnterior: undefined,
      enderecoEntrega: {
        codigo: "",
        descricao: ""
      },
      enderecos: []
    }),
    watch: {
      'orcamentoLocacao.cliente': function(cliente) {
        this.desabilitarMensagemNaoHaDados = true;
        this.consultarEnderecosDoCliente(cliente);
      }
    },

    methods: {
      alterarEnderecoDeEntrega(endereco) {
        this.orcamentoLocacao.codigoEnderecoEntrega = endereco && endereco.codigo;
      },

      listarEnderecosComBaseNaResposta(resposta) {
        return resposta.map(endereco => {
          return {
            codigo: endereco.codigo,
            descricao: `${endereco.codigo}: ${endereco.tipoNomeNumeroComplementoLogradouro} - ${endereco.bairroCidadeUnidadeFederativaCep}`,
            principal: (endereco.tiposEndereco.some(tipo => tipo === "PRINCIPAL")),
            cobranca: (endereco.tiposEndereco.some(tipo => tipo === "COBRANCA")),
            entrega: (endereco.tiposEndereco.some(tipo => tipo === "ENTREGA"))
          };
        });
      },

      limparEnderecos() {
        this.enderecoEntrega = { codigo: "", descricao: "" };
        this.enderecos = [];

        if ((this.identificadorClienteAnterior != undefined)
          && ((this.orcamentoLocacao.cliente && this.orcamentoLocacao.cliente.identificador) != this.identificadorClienteAnterior)) {
          this.orcamentoLocacao.codigoEnderecoDestinatario = undefined;
          this.orcamentoLocacao.codigoEnderecoCobranca = undefined;
          this.orcamentoLocacao.codigoEnderecoEntrega = undefined;
        }
      },

      consultarEnderecosDoCliente(cliente) {
        this.limparEnderecos();
        this.identificadorClienteAnterior = cliente && cliente.identificador;

        if (!cliente || (typeof cliente.identificador === "undefined") || (cliente.identificador === ""))
          return;

        apiEndereco.localizarEnderecos(cliente.identificador)
          .then(resposta => {
            this.orcamentoLocacao.cliente.enderecos = resposta;
            let lista = this.listarEnderecosComBaseNaResposta(resposta);
            this.preencherEnderecosNoOrcamento(lista);
          })
          .finally(() => {
            if (this.enderecos.length == 0) {
              this.desabilitarMensagemNaoHaDados = false;
            }
          });
      },

      preencherEnderecosNoOrcamento(lista) {
        this.enderecos = lista.filter(endereco => endereco.entrega);
        let principal = lista.find(endereco => endereco.principal
          && endereco.codigo == this.orcamentoLocacao.codigoEnderecoDestinatario);
        let cobranca = lista.find(endereco => endereco.cobranca
          && endereco.codigo == this.orcamentoLocacao.codigoEnderecoCobranca);
        let entrega = lista.find(endereco => endereco.entrega
          && endereco.codigo == this.orcamentoLocacao.codigoEnderecoEntrega);

        if (!principal)
          principal = lista.find(endereco => endereco.principal);

        if (!cobranca)
          cobranca = lista.find(endereco => endereco.cobranca);

        this.orcamentoLocacao.codigoEnderecoDestinatario = principal.codigo;
        this.orcamentoLocacao.codigoEnderecoCobranca = cobranca.codigo;
        this.orcamentoLocacao.codigoEnderecoEntrega = entrega && entrega.codigo;
        this.enderecoEntrega = entrega;
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>