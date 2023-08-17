import { defineConfig } from "umi";
const MonacoPlugin = require('monaco-editor-webpack-plugin')
export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/editor", component: "flow-editor" },
  ],
  npmClient: 'pnpm',
  chainWebpack: (memo, args) => {
    if (args.env == 'development') {
      memo.plugin('monaco-plugin').use(MonacoPlugin, [{
        languages: ['json', 'typescript', 'javascript']
      }])
    }
  },
});
