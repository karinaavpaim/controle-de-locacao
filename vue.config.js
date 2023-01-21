module.exports = {
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true
  },

  configureWebpack: {
    devtool: 'source-map'
  },

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/static/styles/main.sass"'
      },
      scss: {
        data:'@import "@/static/styles/_index.scss";'
      },
    },
  },

  publicPath: process.env.NODE_ENV === 'production' ? '/v3/' : '/',
}; //