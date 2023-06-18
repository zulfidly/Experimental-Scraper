<template>
  
  <div class="mt-8 flex flex-col gap-4">
    <h1 class="p-2 animate-pulse text-3xl text-center">coding practice project : web scraper</h1>
    <p class="text-center text-3xl">actual server clock: {{ clockServerRef.UTC }}</p>
    <p class="text-center text-3xl">re-calibrated clock at server: {{ clockCalibratedForClient }}</p>
  </div>

</template>

<script setup>
  const clockServerRef = ref(0)
  const clockCalibratedForClient = ref(0)
  let clock_ph = await useFetch('/api/serverClock')

  onMounted(()=> {
    console.log('app.vue mounted');
    console.log('clock', clock_ph.data._rawValue.clock);
    console.log('PH', clock_ph.data._rawValue.publicHols);
    clockServerRef.value = clock_ph.data._rawValue.clock
    clockCalibratedForClient.value = clock_ph.data._rawValue.clock.clientCl
  })

</script>