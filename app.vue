<script setup>
  const appStore = useMainStorePinia()
  const getHeight = ref('height:200px;')
  let table1 = await useFetch('/api/gettable')
  const isDarkUser = useDark()
  const toggleDark = useToggle(isDarkUser)      // pending use
  const records = ref([])

  onMounted(()=> {
    records.value = table1.data.value.reverse()
    console.log('app.vue mounted');
    getHeight.value = `height:${window.innerHeight-32}px;`
    useEventListener(window, 'resize', (event) => {
      getHeight.value = `height:${window.innerHeight-32}px;`
      updateUserScreenPropertiesOnMounted()      
    })
    useEventListener(window.matchMedia("(prefers-color-scheme:dark)"), 'change', ()=>{
      updateUserScreenPropertiesOnMounted()
    })
    updateUserScreenPropertiesOnMounted()
  })
  useHead({
    title: 'Web Scraping For Fun',
    script: `if(localStorage.getItem('vueuse-color-scheme')==='dark') document.querySelector('html').classList.add('dark')`,
    htmlAttrs:{ lang:'en' },
  })

  function updateUserScreenPropertiesOnMounted() {   
    appStore.m_userScrW()
    appStore.m_userScrH()
    appStore.m_userScrFormFactor()
    appStore.m_userScrIsMobileAndLandscape()
    appStore.m_userScrOrientation()
    appStore.m_userScrRatioWH()
    appStore.m_userScrIsDarkDevice()
  }
</script>

<template>  
  <div :style="getHeight" class="relative w-full place-self-center flex flex-col justify-evenly items-center overflow-clip lg:border lg:rounded-xl lg:shadow-md transition-all duration-700">
    <p
      v-if="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop"
      class="p-3 fixed lg:absolute left-0 bottom-0 text-sm italic font-thin"
      >* figures shown in MYR
    </p>
    
    <TileHeader 
      v-show="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop"
    />

    <ColorModeSwitch
      v-show="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop"
      :is-dark-user="isDarkUser"
      @click="toggleDark()"
      class="mr-4 lg:mr-8 place-self-end"
    />

    <DataTable 
      :records="records"
      :isMobileAndLandscape="appStore.userScr.isMobileAndLandscape"
      :isDesktop="appStore.isDesktop"
    />
    <TileFooter 
      v-show="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop"
    />
  </div>  
</template>

