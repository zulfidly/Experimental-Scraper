<template>  
  <div class=" w-full h-[100svh] flex flex-col justify-center items-center gap-4">
    <div class="flex flex-col px-2 py-6 lg:p-4 w-auto max-h-[90svh] border rounded-xl overflow-scroll bg-[var(--color-background-soft)] border-[var(--color-border)]">
      
      <table class="min-w-[80vw] max-w-[90vw]  bg-[var(--color-background-mute)]">
        <caption class="mb-2 text-center text-md lg:text-lg font-normal lg:font-bold ">
          Daily statistics for <a class="underline decoration-dotted" href="https://www.malaysiastock.biz/Corporate-Infomation.aspx?securityCode=0166" target="_blank" aria-label="visit Inari website">Inari Amertron Bhd</a> [0166] 
          <br> <span class="text-sm font-light italic">- this is a web scraping coding practice -</span>
        </caption>
        <tbody>
          <tr class="[&>th]:p-1 [&>th]:lg:p-2 [&>th]:text-md [&>th]:font-light [&>th]:lg:font-bold [&>th]:text-center [&>th]:border [&>th]:border-[var(--color-border)]">
            <th>Date</th>
            <th class="hidden lg:table-cell">Day</th>
            <th class="hidden lg:table-cell">Time Read</th>
            <th>Previous Close</th>
            <th>Open</th>
            <th>Day's Range</th>
            <th>Last Done</th>
          </tr>

          <tr v-for="(x, ind) in entries" :key="'row'+ind" class="[&>td]:even:bg-[var(--color-background-soft)] [&>td]:p-0.5 [&>td]:lg:p-2 [&>td]:text-center [&>td]:font-light [&>td]:lg:font-medium [&>td]:border [&>td]:border-[var(--color-border)]">
            <td class="lg:hidden">{{ new Intl.DateTimeFormat('en-GB').format(new Date(x.fields.Date)).slice(0, 5) }}</td>
            <td class="hidden lg:table-cell">{{ new Intl.DateTimeFormat('en-GB').format(new Date(x.fields.Date)) }}</td>
            <td class="hidden lg:table-cell">{{ x.fields.Day }}</td>
            <td class="hidden lg:table-cell">{{ x.fields.Time24h }}</td>
            <td>{{ x.fields.PreviousClose }}</td>
            <td>{{ x.fields.Open }}</td>
            <td>{{ x.fields.DayRange }}</td>
            <td>{{ x.fields.LastDone }}</td>
          </tr>
        </tbody>  
      </table>

      <section class="place-self-end flex mt-12 gap-6">
        <a class="px-3 m-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-background-mute)]" href="https://portfolio-fidly.netlify.app/" target="_blank" aria-label="visit portfolio">
          coded by fidly
        </a>

        <IconGitHub />

        <button class=" mr-2 border border-[var(--color-border)] bg-[var(--color-background-mute)] rounded-lg">
          <a class="text-sm italic font-extralight" href="https://airtable.com/shrmTGaN1fcaE0kRA" target="_blank">
            view raw data
            <IconAirtable class="m-auto p-0.5"/>
          </a>
        </button>
      </section>

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