# [Netlify scheduled Web Scraping](https://exp-scraper-fidly.netlify.app/)

## Install Nuxt
- ```npx nuxi@latest init <project-name>```
- ```cd <project-name>```
- ```npm install```
- ```npm run dev -- -o``` (this opens new browser)

## install [Pinia](https://pinia.vuejs.org/ssr/nuxt.html)
- add ```overrides``` added to package.json
- ```npm install pinia @pinia/nuxt```
- ```export const useMainStorePinia = defineStore('appStore', {})```, dir: ```./composables/appStore.js``` 
- see ```@pinia/nuxt``` in nuxt.config.js
- see ```./composables/appStore.js```

## Adding Tailwind CSS 
- ```npm install -D @nuxtjs/tailwindcss```
- ```npx tailwindcss init -p``` (create tailwindcss.config.js & postcss.config.js inside root folder)
- see edits > nuxt.config.js

## deleted /server/tsconfig.json, content as below
- ```{"extends": "../.nuxt/tsconfig.server.json"}```

## add Airtable
- ```npm install airtable```

## add Netlify's scheduled functions cron runner ```npm install @netlify/functions``` 
- ```import { schedule } from "@netlify/functions"```
- Standard [cron](https://crontab.guru/) (UTC by default): “At minute 30 past hour 5 and 10 on every day-of-week from Monday through Friday.”
- ```exports.handler = schedule("30 5,10 * * 1-5", handler);```, translates to 1:30pm & 6:30pm GMT+8, Mon-Fri
- ```return { statusCode: 200 }``` or ```return { statusCode: 500 }``` required
- create directory at root : ```netlify/functions```
- Note that scheduled functions don’t work with payloads or POST request data. When you need to work with payloads, you should use either a synchronous or background function instead.
- Background Functions feature is not available in free Starter plans
- Observed : maximum 10seconds server compute time per execution 
- Netlify server cannot hold data permanently

## add VueUse for access to Vue3 friendly composables
- ```npm i -D @vueuse/nuxt @vueuse/core```
- use of ```useDark()``` & ```useToggle()``` to allow manual color mode switching, indirect calls of ```useLocalStorage()``` to remember user manual preferences
- use of ```useEventListener()``` in place of ```window.addEventListener()```

## 'dark' class 
- see ```darkMode: 'class'```, inside tailwind.config.js
- see ```dark:text-[var(--color-text)]``` like syntaxes
