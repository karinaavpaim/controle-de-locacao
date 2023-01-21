import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pt from 'vuetify/src/locale/pt.ts';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#165091',
        secondary: '#247daa',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#ff8f00'
      },
      dark: {
        primary: '#165091',
        secondary: '#247daa',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#ff8f00'
      }
    }
  }
});
