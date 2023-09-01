import { defineConfig } from "umi";
const MonacoPlugin = require('monaco-editor-webpack-plugin')
export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/logics", component: "logic/list" },
    { path: "/logic/:id", component: "logic-editor" },
    { path: "/editor/:id", component: "logic-editor" },
    { path: "/form", component: "form-editor" },
  ],
  npmClient: 'pnpm',
  chainWebpack: (memo, args) => {
    if (args.env == 'development') {
      memo.plugin('monaco-plugin').use(MonacoPlugin, [{
        languages: ['json', 'typescript', 'javascript']
      }])
    }
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
    '/api/form': {
      'target': 'http://192.168.44.70:5001',
      // 'target': 'http://localhost:5001',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '/api' },
    },
    '/api/runtime': {
      'target': 'http://192.168.44.70:3001',
      // 'target': 'http://localhost:3000',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api': '/api' },
    },
    // '/setting/biz/query': {
    //   'target': 'http://192.168.44.70:5000/api/form/query/logic',
    //   'changeOrigin': true,
    //   // 'pathRewrite': { '^/api': '' },
    // },
    // '/setting/biz/add': {
    //   'target': 'http://192.168.44.70:5000/api/form/add/logic',
    //   'changeOrigin': true,
    //   // 'pathRewrite': { '^/api': '' },
    // }
  }
});
