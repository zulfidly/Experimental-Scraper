<template>  
  <div class="w-full h-full flex flex-col justify-center items-center gap-4">
    <header class="animate-pulse text-xl text-center">coding practice : experimental web scraper
      
    </header>

    <div class="relative p-4 w-auto max-h-[90svh] border-2 rounded-xl overflow-scroll">
      <button class="absolute mt-1 mr-1 top-0 right-0 bg-[var(--color-border)] py-0.5 px-3 rounded-lg">
        <a href="https://airtable.com/shrmTGaN1fcaE0kRA" target="_blank">view server side Airtable</a>
      </button>
      <table class="relative min-w-[80vw]">
        <caption class="mt-3 text-left text-lg font-bold">Daily statistics for MBB 1155</caption>
        <tbody>
          <tr class="[&>th]:text-md [&>th]:font-bold [&>th]:text-center [&>th]:border">
            <th>Date</th>
            <th>Day</th>
            <th>Time</th>
            <th>Previous Close</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Last Done</th>
          </tr>

          <tr v-for="(x, ind) in entries" class="[&>td]:p-1 [&>td]:text-center [&>td]:border">
            <td>{{ x.fields.Date }}</td>
            <td>{{ x.fields.Day }}</td>
            <td>{{ x.fields.Time24h }}</td>
            <td>{{ x.fields.PreviousClose }}</td>
            <td>{{ x.fields.Open }}</td>
            <td>{{ x.fields.High }}</td>
            <td>{{ x.fields.Low }}</td>
            <td>{{ x.fields.LastDone }}</td>
          </tr>
        </tbody>  
      </table>

    </div>
  </div>

</template>

<script setup>
  const clockServerRef = ref(0)
  const clockCalibratedForClient = ref(0)
  let clock_ph = await useFetch('/api/serverClock')
  let table1 = await useFetch('/api/gettable')
  const entries = table1.data._rawValue

  onMounted(()=> {
    console.log('app.vue mounted');
    console.log('clock', clock_ph.data._rawValue.clock);
    console.log('PH', clock_ph.data._rawValue.publicHols);
    clockServerRef.value = clock_ph.data._rawValue.clock
    clockCalibratedForClient.value = clock_ph.data._rawValue.clock.calibrated
    console.log(entries);
  })

</script>