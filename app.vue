<template>
  <h1 class="p-2 animate-pulse text-3xl text-center">coding practice project : web scraper</h1>

  <div class="mt-8">
    <p class="text-center text-3xl">{{ clockRef.UTC }}</p>
    <p class="text-center text-3xl">{{ clockRef.Day }}</p>
    <p class="text-center text-3xl">offset: {{ clockRef.offset }}</p>
  </div>

</template>

<script setup>
  const clockRef = ref(0)
  // console.log(await useFetch('/api/gettable'));
  // let test1 = await useFetch('/api/gettable')
  let clock_ph = await useFetch('/api/serverClock')

  onMounted(()=> {
    // console.log('client', test1.data._rawValue);
    console.log('app.vue mounted');
    console.log('clock', clock_ph.data._rawValue.clock);
    console.log('PH', clock_ph.data._rawValue.publicHols);
    clockRef.value = clock_ph.data._rawValue.clock

  })

</script>