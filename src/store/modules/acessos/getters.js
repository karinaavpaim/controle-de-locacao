import SistemaAcessoModel from '@/models/geral/usuario/sistema-acesso-model';

export default {
  acessosUsuarioAutenticado (state) {
    return new Promise((resolve, reject)=>state
      .acessos
      .then(acessos=>resolve(acessos.map(a=>new SistemaAcessoModel(a))))
      .catch(reject)
    )
  }
}
