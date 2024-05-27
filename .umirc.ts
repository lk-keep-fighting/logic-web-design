import { defineConfig } from "umi";
const MonacoPlugin = require('monaco-editor-webpack-plugin')
export default defineConfig({
  title: "业务编排",
  history: { type: 'hash' },
  favicons: ['/logo.png'],
  esbuildMinifyIIFE: true,
  routes: [
    // {
    //   path: "/",
    //   layout: 'index',
    //   routes: [
    //     {
    //       path: "/assets",
    //       routes: [
    //         {
    //           path: "/assets/api/list",
    //           component: "assets/api/list",
    //         },
    //         {
    //           path: "/assets/swagger/list",
    //           component: "assets/swagger/list",
    //         },
    //         {
    //           path: "/assets/logic/list", component: "logic/list",
    //         },
    //       ]
    //     },

    //   ]
    // },
    {
      path: "/",
      layout: false,
      component: 'main'
    },
    {
      path: "/app/:appId",
      layout: 'index',
    },
    {
      path: "/app/:appId/:pageId",
      component: "render",
    },
    {
      path: "/page/amis/:pageId",
      component: "render",
    },
    // {
    //   path: "/page/form",
    //   component: "render/form",
    // },
    {
      path: "/set/design/:render/:id",
      layout: false,
      component: "render/editor",
    },
    {
      path: "/assets/swagger/i/:id/ui",
      layout: false,
      component: "assets/swagger/ui",
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
          component: "logic-viewer"
        },
        {
          path: "/assets/logic/biz/i/:id/edit",
          component: "logic-flow/biz/logic-editor",
        },
        {
          path: "/assets/logic/process/i/:id/edit",
          component: "logic-flow/process/logic-editor",
        }],
    },
    { path: "/debug/logic/instance/:id", layout: false, component: "logic-debug" },
    { path: "/debug/logic-log/i/:id", layout: false, component: "logic-log-debug" },
    { path: "/debug/form/i/:id", layout: false, component: "render/form/debug" },
    // { path: "/editor/:id", layout: false, component: "logic-editor" },
    { path: "/form", component: "form-editor" },
    {
      path: "/ext/mes/process/edit",
      layout: false,
      component: "logic-flow/process/logic-editor",
    },
    {
      path: "/ext/mes/process/view",
      layout: false,
      component: "logic-flow/process/logic-viewer",
    }
  ],
  npmClient: 'pnpm',
  chainWebpack: (memo, args) => {
    // if (args.env == 'development') {
    memo.plugin('monaco-plugin').use(MonacoPlugin, [{
      languages: ['json', 'typescript', 'javascript']
    }])
    // }
  },
  headScripts: [{
    src: '/js/umd/react.development.js',
  },
  {
    src: '/js/umd/react-dom.development.js',
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
    '/api/runtime': {
      // 'target': 'http://localhost:4052',
      // 'target': 'http://192.168.153.107:9999',
      'target': 'http://192.168.153.18:31001',
      // 'target': 'http://192.168.51.18:31001',
      // 'target': 'http://localhost:8080',
      // 'target': 'http://192.168.52.100:9001',
      // 'target': 'http://localhost:9001',
      // 'target': 'http://192.168.44.87:4052',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '/api' },
    },
    '/api/ide': {
      // 'target': 'http://localhost:4052',
      // 'target': 'http://192.168.153.107:9999',
      'target': 'http://192.168.153.18:31001',
      // 'target': 'http://192.168.51.18:31001',
      // 'target': 'http://localhost:9001',
      // 'target': 'http://192.168.52.100:9001',
      // 'target': 'http://192.168.44.87:4052',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api/ide': '/ide/api' },
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
    '/api/mes': {
      'target': 'http://192.168.54.89:9996',
      'pathRewrite': { '^/api/mes': '' },
      'changeOrigin': true,
    },
  },

});
