# zp-service

A Vue 3 / Webpack 5 service.
## Architecture

```text
├─ public              // default template. (index.html can be set separately for each folder under src/pages)
├─ service.config.js       // service configuration.
├─ src
│  ├─ assets           // assets such as images or font files.
│  ├─ components       // reusable Vue components.        
│  └─ pages            // pages. !important
│     ├─ page1
│     │  ├─ router     // routers config in each page.
│     │  ├─ store      // Store modules.
│     │  └─ components // components    
│     ├─ page2   
│     │  ├─ router     // routers config in each page.
│     │  ├─ store      // Store modules.
│     │  └─ components // components  

```

#### TODO

* [x] merge rules


## Commands

```bash
# get package from npm
npm i zp-service
# first time
npm run init
# Start development server.
npm run dev

"scripts": {
  "init": "node_modules/.bin/zp-service init",
  "dev": "node_modules/.bin/zp-service development"
}
# Compile production bundle.

npm run build:pre
npm run build:qa
npm run build:prod
```
