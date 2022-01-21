/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    // '/api/contract-system/': {
    //   //target: 'http://10.18.2.118:8092',
    //   target: 'http://10.18.2.127:8201',
    //   changeOrigin: true,
    //   pathRewrite: {'^/api/contract-system': ''},
    // },
    '/api/': {
      target: 'http://10.18.2.118:8092',
      changeOrigin: true,
      pathRewrite: {'^/api': ''},
    },
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
