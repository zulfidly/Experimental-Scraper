<template>
  <h1 class="p-2 animate-pulse text-3xl">coding practice project : web scraper</h1>

  <div class="max-w-[]">

  </div>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
  // console.log(await useFetch('/api/gettable'));
  // let test1 = await useFetch('/api/gettable')
  // let clock_ph = await useFetch('/api/serverClock')

  onMounted(()=> {
    // console.log('client', test1.data._rawValue);
    console.log('app.vue mounted');
    // console.log('clock&PH', clock_ph.data._rawValue);

  })

</script>