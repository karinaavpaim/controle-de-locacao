'use strict';

export default class LocacaoPorStatusDashboardModel {
  constructor(obj) {
    obj = obj || {};
    this.quantidade = obj.quantidade || 0;
    this.status = obj.status;
  }
}