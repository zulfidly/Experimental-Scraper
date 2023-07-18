<script setup>
    const props = defineProps({
        records: Array,
        isMobileAndLandscape: Boolean,
        isDesktop: Boolean,
    })
</script>

<template>
    <div class="flex flex-col relative lg:px-6 w-[inherit] max-h-[70svh] sm:max-h-[99svh] lg:max-h-[65svh] overflow-y-scroll border-[var(--color-border)] rounded-lg">  
      <table class="relative w-[inherit] h-full bg-[var(--color-background-mute)]">
        <thead class="sticky top-0 bg-[var(--table-header)]">
          <tr class="[&>*]:mx-auto [&>*]:lg:p-2 [&>*]:text-md [&>*]:font-light [&>*]:lg:font-bold [&>*]:text-center">
            <th>Date</th>
            <th :class="[isMobileAndLandscape || isDesktop ? 'table-cell' : 'hidden']">Day</th>
            <th :class="[isMobileAndLandscape || isDesktop ? 'table-cell' : 'hidden']">Time Read <br/> (GMT+8)</th>
            <th class="text-justify">Previous<br>Close </th>
            <th>Open</th>
            <th>Day's <br>Range</th>
            <th>Last<br>Done </th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-for="(x, ind) in records" ref="listTR" :key="'row'+ind" class="[&>*]:mx-auto [&>*]:even:bg-[var(--color-background-soft)] [&>*]:p-0.5 [&>*]:lg:p-2 [&>*]:text-center [&>*]:font-light [&>*]:lg:font-medium"
            >
            <td v-if="isMobileAndLandscape || isDesktop" class="table-cell">{{ new Intl.DateTimeFormat('en-GB').format(new Date(x.fields.Date)) }}</td>
            <td v-else class="table-cell">{{ new Intl.DateTimeFormat('en-GB').format(new Date(x.fields.Date)).slice(0, 5) }}</td>
            
            <td :class="[isMobileAndLandscape || isDesktop ? 'table-cell' : 'hidden']">{{ x.fields.Day }}</td>
            <td :class="[isMobileAndLandscape || isDesktop ? 'table-cell' : 'hidden']">{{ x.fields.Time24h }}</td>
            <td>{{ x.fields.PreviousClose }}</td>
            <td>{{ x.fields.Open }}</td>
            <td>{{ x.fields.DayRange }}</td>
            <td>{{ x.fields.LastDone }}</td>
          </tr>
        </tbody>  
      </table>  
    </div>

</template>