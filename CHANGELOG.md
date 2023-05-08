## 更新日志

*2023-05-05*
### 0.1.19升级内容
- 优化webpack启用esbuild压缩

*2023-04-26*
### 0.1.19-beta.0升级内容
- 优化webpack启用esbuild压缩

*2023-04-25*
### 0.1.18升级内容
- webpack开发模式引入cache

*2023-04-24*
### 0.1.17升级内容
- esbuild-loader版本由于不可控因素较多，且官方不处理issue，故降回2.x

*2023-04-18*
### 0.1.16升级内容
- 移除定制的esbuild plugin 直到有更好的方案实现jsxFactory定制

*2023-04-17*
### 0.1.15升级内容
- 修复esbuild-loader EsbuildPlugin编译static问题

*2023-04-07*
### 0.1.13/14升级内容
- 更新依赖包
- 开发模式引入useEsbuild提速选项
- ESBuildMinifyPlugin 改名为 EsbuildPlugin

*2023-03-21*
### 0.1.12升级内容
- 部署不再lint校验
- lint版本升级

*2023-01-31*
### 0.1.11升级内容
- 引入proxy

*2022-06-27*

### 0.1.10升级内容
- 修复手误asset
### 0.1.9升级内容
- 语法调整?.
- 引入assetsSubDirectory

*2022-04-07*

### 0.1.8升级内容
- 可配置注入脚本head/body
- historyApiFallback

*2022-03-23*

#### 0.1.7升级内容
- 支持css loader，目前支持sass-loader和stylus-loader

*2022-03-08*

#### 升级内容
- 支持tsx
- 建议工程

pageage.json
```bash
"devDependencies": {
  "@babel/preset-typescript": "^7.16.7",
  "@typescript-eslint/eslint-plugin": "^5.13.0",
  "@typescript-eslint/parser": "^5.13.0",
  "@vue/babel-plugin-jsx": "^1.1.1",
  "eslint-plugin-import": "^2.25.4"
}
```
.eslintrc.js
```bash
module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript'
  ]
}
```
