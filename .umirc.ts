import { defineConfig } from "umi";
const MonacoPlugin = require('monaco-editor-webpack-plugin')
export default defineConfig({
  title: "业务编排",
  // history: { type: 'hash' },
  favicons: ['/logo.png'],
  esbuildMinifyIIFE: true,
  routes: [
    {
      path: "/",
      layout: 'index',
      routes: [
        {
          path: "/assets",
          routes: [
            {
              path: "/assets/api/list",
              component: "assets/api/list",
            },
            {
              path: "/assets/swagger/list",
              component: "assets/swagger/list",
            },
            {
              path: "/assets/logic/list", component: "logic/list",
            },
          ]
        },

      ]
    },
    {
      path: "/page/amis/:pageId",
      component: "render",
    },
    {
      path: "/set/page/amis/:pageId",
      layout: false,
      component: "render/editor",
    },
    {
      path: "/assets/swagger/i/:id/ui",
      layout: false,
      component: "assets/swagger/ui",
    },
    { path: "/assets/logic/i/:id/edit", layout: false, component: "logic-editor" },
    { path: "/editor/:id", layout: false, component: "logic-editor" },
    { path: "/form", component: "form-editor" },
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
    '/api/form': {
      'target': 'http://192.168.44.70:5001',
      // 'target': 'http://localhost:5001',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '/api' },
    },
    '/api/runtime': {
      'target': 'http://localhost:4052',
      // 'target': 'http://192.168.154.51:4052',
      // 'target': 'http://192.168.44.87:4052',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '/api' },
    },
  },

});
