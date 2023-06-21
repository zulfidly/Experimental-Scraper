<script setup>
  const clockServerRef = ref(0)
  const clockCalibratedForClient = ref(0)
  const getHeight = ref('height:100px;')
  let clock_ph = await useFetch('/api/serverClock')
  let table1 = await useFetch('/api/gettable')
  const entries = table1.data._rawValue

  onMounted(()=> {
    console.log('app.vue mounted');
    console.log('clock', clock_ph.data._rawValue.clock);
    // console.log('PH', clock_ph.data._rawValue.publicHols);
    clockServerRef.value = clock_ph.data._rawValue.clock
    clockCalibratedForClient.value = clock_ph.data._rawValue.clock.calibrated
    // console.log(entries);
    window.addEventListener("resize", () => {
      getHeight.value = `height:${window.innerHeight-32}px;`
    })
    getHeight.value = `height:${window.innerHeight-32}px;`
  })
  useHead({
    title: 'Web Scraping For Fun',
    htmlAttrs:{ lang:'en' },
  })
</script>

<template>  
  <div :style="getHeight" class="relative w-full  flex flex-col justify-evenly items-center border-0 lg:border lg:rounded-xl lg:shadow-md transition-all duration-300">
    <p class="md:hidden lg:block p-3 fixed lg:absolute left-0 bottom-0 text-sm italic font-thin">* figures shown in MYR</p>
      <p class="md:hidden lg:block mb-4 text-center text-md lg:text-lg font-normal lg:font-bold tracking-wide">
        Daily statistics for
        <a class="underline decoration-dotted underline-offset-4" href="https://www.malaysiastock.biz/Corporate-Infomation.aspx?securityCode=0166" target="_blank" aria-label="visit Inari website">
          Inari Amertron Bhd
        </a>
          [0166] 
        <br> 
        <span class="text-sm font-light italic">- this is a web scraping coding practice -</span>
      </p>

      <div class="flex flex-col relative lg:px-6 w-[inherit] max-h-[70svh] md:max-h-[99svh] lg:max-h-[65svh] overflow-y-scroll border-[var(--color-border)]">  
        <table class="relative w-[inherit] h-full bg-[var(--color-background-mute)]">
          <thead class="sticky top-0 bg-[var(--table-header)]">
            <tr class="[&>*]:mx-auto [&>*]:lg:p-2 [&>*]:text-md [&>*]:font-light [&>*]:lg:font-bold [&>*]:text-center">
              <th>Date</th>
              <th class="hidden lg:table-cell">Day</th>
              <th class="hidden lg:table-cell">Time Read</th>
              <th class="text-justify">Previous<br>Close </th>
              <th>Open</th>
              <th>Day's <br>Range</th>
              <th>Last<br>Done </th>
            </tr>
          </thead>
          
          <tbody>
            <tr v-for="(x, ind) in entries" :key="'row'+ind" class="[&>*]:mx-auto [&>*]:even:bg-[var(--color-background-soft)] [&>*]:p-0.5 [&>*]:lg:p-2 [&>*]:text-center [&>*]:font-light [&>*]:lg:font-medium">
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
      </div>

      <section class="md:hidden lg:block place-self-end mt-4 lg:mr-6">
        <div class="flex gap-4 lg:gap-12">
          <a class="px-3 m-auto font-light border border-[var(--color-border)] rounded-lg bg-[var(--color-background-mute)]" href="https://portfolio-fidly.netlify.app/" target="_blank" aria-label="visit portfolio">
            coded by fidly
          </a>  
          <IconGitHub />  
          <button class=" mr-2 border border-[var(--color-border)] bg-[var(--color-background-mute)] rounded-lg">
            <a class="text-sm italic font-extralight" href="https://airtable.com/shrmTGaN1fcaE0kRA" target="_blank">
              view data on
              <IconAirtable class="m-auto p-0.5"/>
            </a>
          </button>
        </div>
      </section>
  </div>  
</template>

