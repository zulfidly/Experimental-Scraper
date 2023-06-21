# deleted /server/tsconfig.json, content as below
{
  "extends": "../.nuxt/tsconfig.server.json"
}

# add netlify locally
npm install netlify-cli --save-dev
Note that scheduled functions don’t work with payloads or POST request data. When you need to work with payloads, you should use either a synchronous or background function instead.
