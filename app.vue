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
  onMounted(()=> {
    let test1 = useFetch('/api/gettable')
    console.log('client', test1.data.value);

    console.log(useFetch('/api/getClock'));
  })

</script>