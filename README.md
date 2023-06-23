# deleted /server/tsconfig.json, content as below
{
  "extends": "../.nuxt/tsconfig.server.json"
}

# add netlify locally
npm install netlify-cli --save-dev
Note that scheduled functions don’t work with payloads or POST request data. When you need to work with payloads, you should use either a synchronous or background function instead.


npm i @vueuse/core

exports.handler = schedule("30 5,10 * * 1-5", handler);   
// Standard cron UTC: “At minute 30 past hour 5 and 10 on every day-of-week from Monday through Friday.”   https://crontab.guru/
//translates to 1:30pm & 6:30pm GMT +8, Mon-Fri