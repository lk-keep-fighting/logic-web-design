import { defineConfig } from "umi";
const MonacoPlugin = require('monaco-editor-webpack-plugin')
export default defineConfig({
  title: "业务编排",
  history: { type: 'hash' },
  favicons: ['/logic/logo.png'],
  publicPath: '/logic/',
  esbuildMinifyIIFE: true,
  analyze: {
    analyzerMode: 'static',
    openAnalyzer: true,
    reportFilename: './report.html',
    generateStatsFile: false,
    statsFilename: './stats.json',
    statsOptions: null,
    logLevel: 'info',
  },
  routes: [
    {
      path: "/",
      layout: false,
      component: 'main'
    },
    {
      path: "/app/:appId",
    },
    {
      path: "/app/:appId/:pageId",
      component: "render",
    },
    {
      path: "/page/amis/:pageId",
      component: "render",
    },
    {
      path: "/set/design/:render/:id",
      layout: false,
      component: "render/editor",
    },
    {
      path: "/assets/logic",
      layout: false,
      routes: [
        {
          path: "/assets/logic/i/:id/edit",
          component: "logic-flow/biz/logic-editor",
        },
        {
          path: "/assets/logic/i/:id/view/:version",
          component: "logic-flow/biz/logic-viewer"
        },
        {
          path: "/assets/logic/biz/i/:id/edit",
          component: "logic-flow/biz/logic-editor",
        }],
    },
    { path: "/debug/logic/instance/:id", layout: false, component: "logic-flow/biz/logic-debug" },
    { path: "/debug/logic/instance/:logicId/:bizId", layout: false, component: "logic-flow/biz/logic-debug" },
    { path: "/debug/logic-log/i/:id", layout: false, component: "logic-flow/biz/logic-log-debug" },
    { path: "/debug/form/i/:id", layout: false, component: "render/form/debug" },
  ],
  npmClient: 'pnpm',
  chainWebpack: (memo, args) => {
    memo.plugin('monaco-plugin').use(MonacoPlugin, [{
      languages: ['json', 'typescript', 'javascript']
    }])

  },
  headScripts: [{
    src: '/logic/js/umd/react.development.js',
  },
  {
    src: '/logic/js/umd/react-dom.development.js',
  }],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  proxy: {
    '/file': {
      'target': 'http://192.168.44.70:5001',
      // 'target': 'http://localhost:5001',
      'changeOrigin': true,
      'pathRewrite': { '^/file': '/' },
    },
    // '/api/form': {
    //   'target': 'http://192.168.44.70:5001',
    //   // 'target': 'http://localhost:5000',
    //   'changeOrigin': true,
    //   // 'pathRewrite': { '^/api': '/api' },
    // },
    '/api/ide/papi': {
      // 'target': 'http://localhost:4052',
      // 'target': 'http://localhost:8888',
      // 'target': 'http://localhost:8080',
      // 'target': 'http://localhost:18080',
      'target': 'http://192.168.58.55:18080',
      // 'target': 'http://192.168.51.18:31001',
      // 'target': 'http://192.168.53.205:8080',
      // 'target': 'http://192.168.57.23:8080',
      // 'target': 'http://192.168.52.100:9001',
      // 'target': 'http://localhost:9001',
      // 'target': 'http://192.168.44.87:4052',
      'changeOrigin': true,
      headers: {
        Connection: 'keep-alive'
      }
      // 'pathRewrite': { '^/api': '/api' },
    },
    '/api': {
      // 'target': 'http://localhost:4052',
      'target': 'http://localhost:8888',
      // 'target': 'http://v010.logic-test.dev.aimstek.cn',
      // 'target': 'http://localhost:18080',
      // 'target': 'http://192.168.58.55:18080',
      // 'target': 'http://192.168.58.91:18080',
      // 'target': 'http://192.168.57.23:8080',
      // 'target': 'http://192.168.52.100:9001',
      // 'target': 'http://localhost:9001',
      // 'target': 'http://192.168.154.154:9988',
      // ws: false,
      // buffer: false,
      // proxyTimeout: 60000,
      // onProxyRes: function (proxyRes, req, res) {
      //   // 关键：关闭缓冲，强制实时转发
      //   if (proxyRes.flushHeaders) {
      //     proxyRes.flushHeaders();
      //   }
      // },
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '/api' },
    },
    // '/logic/api': {
    //   // 'target': 'http://localhost:4052',
    //   // 'target': 'http://192.168.153.107:9999',
    //   // 'target': 'http://192.168.153.18:31001',
    // 'target': 'http://localhost:9001',
    //   'target': 'http://192.168.152.200:9001',
    //   // 'target': 'http://192.168.44.87:4052',
    //   'changeOrigin': true,
    //   // 'pathRewrite': { '^/api/ide': '/ide/api' },
    // },
  },

});
