<template>
  <div :id="id">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs11 sm6 md4 class="loginMobile">
              <v-card class="elevation-2 box-white">
                <v-card-text class="padding-zero">
                  <div v-show="carregando" class="icone-de-progresso-circular alinhamento-loading">
                    <v-progress-circular :size="130" color="primary" indeterminate></v-progress-circular>
                  </div>
                  <div v-show="!carregando">
                    <v-form>
                      <img src="../../assets/bimer_up_cor.svg" alt="Logo do Bimer UP" title="Bimer UP" class="logo-bimerup">

                      <v-text-field
                        :id="'textfield-usuario-'+id"
                        name="login"
                        label="Usuário"
                        :disabled="carregando"
                        v-model="credenciais.login"
                      ></v-text-field>

                      <v-text-field
                        :id="'textfield-senha-'+id"
                        name="password"
                        label="Senha"
                        :disabled="carregando"
                        v-model="credenciais.senha"
                        :append-icon="value ? 'visibility_off' : 'visibility'"
                        @click:append="() => (value = !value)"
                        :type="value ? 'password' : 'text'"
                      ></v-text-field>

                      <v-card-actions class="padding-zero">
                        <v-layout align-center justify-center>
                          <v-btn 
                            :id="'btn-entrar-'+id"
                            :disabled="carregando"
                            color="primary"
                            class="btn-primary btn-entrar float-right"
                            @click="btnLoginClick()">
                            {{ carregando ? "Aguarde" : "Entrar" }}
                          </v-btn>
                        </v-layout>
                      </v-card-actions>
                    </v-form>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs8 sm6 md6 class="loginDesktop">
              <v-card class="elevation-2 box-white">
                <v-row class="full-height" no-gutters>
                  <v-col cols="12" sm="5">
                    <v-layout align-center justify-center>
                      <div class="login-container">
                        <div v-show="carregando">
                          <img src="../../assets/bimer_up_cor.svg" alt="Logo do Bimer UP" title="Bimer UP" class="logo-bimerup">
                        </div>
                        <div v-show="!carregando">
                          <p class="welcome-bimerup">Bem-vindo ao Bimer Up!</p>
                          <p class="frase-bimerup">Aqui você gerencia sua empresa totalmente online.</p>
                        </div>
                      </div>
                    </v-layout>
                  </v-col>

                  <v-col sm="1" class="separador-vertical"></v-col>

                  <v-col cols="12" sm="6" class="login-inputs">
                    <v-card-text class="padding-zero">
                      <div v-show="carregando" class="icone-de-progresso-circular alinhamento-loading">
                        <v-progress-circular :size="130" color="primary" indeterminate></v-progress-circular>
                      </div>
                      <div v-show="!carregando">
                        <v-form>
                          <img src="../../assets/bimer_up_cor.svg" alt="Logo do Bimer UP" title="Bimer UP" class="logo-bimerup">

                          <v-text-field
                            :id="'textfield-login-'+id"
                            name="login"
                            label="Usuário"
                            :disabled="carregando"
                            v-model="credenciais.login">
                          </v-text-field>

                          <v-text-field
                            :id="'textfield-password-'+id"
                            name="password"
                            label="Senha"
                            :disabled="carregando"
                            v-model="credenciais.senha"
                            :append-icon="value ? 'visibility_off' : 'visibility'"
                            @click:append="() => (value = !value)"
                            :type="value ? 'password' : 'text'">
                          </v-text-field>

                          <v-card-actions class="padding-zero">
                            <v-layout align-center justify-center>
                              <v-btn 
                                :disabled="carregando"
                                color="primary"
                                class="btn-primary btn-entrar float-right"
                                @click="btnLoginClick()"
                              >
                                {{ carregando ? "Aguarde" : "Entrar" }}
                              </v-btn>
                            </v-layout>
                          </v-card-actions>
                        </v-form>
                      </div>
                    </v-card-text>
                  </v-col>

                  <div v-show="!carregando">
                    <img src="../../assets/bimer_up_nuvem.svg" alt="Imagem de nuvem do Bimer UP" class="logo-nuvem">
                  </div>
                </v-row>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import CredenciaisModel from '@/models/sistema/credenciais-model';
import AutenticacaoApi from '@/api/sistema/autenticacao-api';
import { ROTAS_FATURAMENTO_METADATA } from '@/constants/router/faturamento-router-constants';

export default {
  data() {
    return {
      id: 'login',
      credenciais: new CredenciaisModel(),
      carregando: false,
      value: String
    };
  },

  methods: {
    btnLoginClick() {
      if (this.credenciais.modeloValido()) {
        this.carregando = true;
        AutenticacaoApi.excluirTokenDeAutenticacaoDaStorage();
        AutenticacaoApi
          .autenticar(this.credenciais)
          .then((credenciais) => {
            AutenticacaoApi.gravarTokenAutenticacaoNaStorage(credenciais[0]);
            if (this.$route.query.redirect)
              this.$router.push(this.$route.query.redirect);
            else
              this.$router.push(ROTAS_FATURAMENTO_METADATA.controleDeOrcamentoDeLocacao);
          })
          .catch((e) => {
            alert((e[0] && e[0].message) || "Houve um erro ao efetuar o login.");
          })
          .finally(() => {
            this.carregando = false;
          });
      } else {
        alert("As credenciais não foram preenchidas");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
}

.box-white {
  border-top: 4px solid $cor_primaria;
  padding: 40px 20px 40px 20px;
  height: 380px;
  overflow: hidden;
}

button.btn-primary.btn-entrar {
  border-radius: 0px;
  width: 100%;
}

.logo-nuvem {
  opacity: 0.05;
  position: absolute;
  left: -150px;
  bottom: -20px;
  width: 600px;
}

.logo-bimerup {
  width: 250px;
  margin: 0 auto;
  display: block;
}

.padding-zero {
  padding: 0;
}

.welcome-bimerup {
  font-size: 24px;
  font-weight: 500;
  color: $cor_primaria;
  margin-top: 0px;
  line-height: 28px;
  width: 150px;
}

.frase-bimerup {
  font-size: 13px;
  line-height: 1.4;
  color: $grey-700;
  margin-top: 10px;
  width: 250px;
}

.login-container {
  margin: 70px 0 0 0;
  padding: 20px;
}

.separador-vertical {
  border-right: 1px solid #f1f1f1;
}

.login-inputs {
  padding: 0 20px 0px 30px;
}

.alinhamento-loading {
  margin-left: -50px;
  margin-top: 80px;
}

@media (min-width: 1025px) {
  .loginMobile {
    display: none;
  }
}

@media (max-width: 1024px) {
  .loginDesktop {
    display: none;
  }
}
</style>