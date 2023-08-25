import { defineConfig } from "umi";
const MonacoPlugin = require('monaco-editor-webpack-plugin')
export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/editor", component: "flow-editor" },
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
    src: 'https://unpkg.com/react@18/umd/react.development.js',
    crossorigin: true
  },
  {
    src: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    crossorigin: true
  }],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  }
});
