'use strict';

import ItemAnaliseResultadoModel from "./item-analise-resultado-model";

export default class MetaDadosAnaliseResultadoModel {
  constructor(obj) {
    obj = obj || {};
    this.detalhamento = obj.detalhamento || [];
    this.totalGeral = new ItemAnaliseResultadoModel(obj.totalGeral);
    this.adicionaisPersonalizados = obj.adicionaisPersonalizados || [];
  }
}