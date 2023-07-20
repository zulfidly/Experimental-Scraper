<script setup>
const appStore = useMainStorePinia()
const getHeight = ref('height:200px;')
const isDarkUser = useDark()
const toggleDark = useToggle(isDarkUser)      // pending use
const records = ref([])
const { data: destructuredData } = await useFetch('/api/gettable')

onMounted(() => {
  records.value = destructuredData.value.reverse()
  console.log('app.vue mounted');
  getHeight.value = `height:${window.innerHeight - 32}px;`
  updateUserScreenPropertiesOnMounted()
  useEventListener(window, 'resize', (event) => {
    getHeight.value = `height:${window.innerHeight - 32}px;`
    updateUserScreenPropertiesOnMounted()
  })
  useEventListener(window.matchMedia("(prefers-color-scheme:dark)"), 'change', () => {
    updateUserScreenPropertiesOnMounted()
  })
})
useHead({
  title: 'Web Scraping For Fun',
  script: `if(localStorage.getItem('vueuse-color-scheme')==='dark') document.querySelector('html').classList.add('dark')`,
  htmlAttrs: { lang: 'en' },
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
  <div :style="getHeight"
    class="relative w-full place-self-center flex flex-col justify-evenly items-center overflow-clip lg:border lg:rounded-xl lg:shadow-md transition-all duration-700">

    <!-- <TileHeader v-if="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop"  -->
    <TileHeader 
      :class="['transition-all duration-700', !appStore.userScr.isMobileAndLandscape || appStore.isDesktop ? 'static top-0' : 'absolute -top-full' ]"
    />

    <ColorModeSwitch
      :is-dark-user="isDarkUser"
      @click="toggleDark()" 
      :class="['transition-all duration-700', !appStore.userScr.isMobileAndLandscape || appStore.isDesktop ? 'static top-0' : 'absolute -top-full' ]"
    />
    <!-- <ColorModeSwitch v-if="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop" :is-dark-user="isDarkUser"
      @click="toggleDark()" /> -->

    <DataTable :records="records" :isMobileAndLandscape="appStore.userScr.isMobileAndLandscape"
      :isDesktop="appStore.isDesktop" />
    <TileFooter v-if="!appStore.userScr.isMobileAndLandscape || appStore.isDesktop" />
  </div>
</template>

