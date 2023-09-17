export const useMainStorePinia = defineStore('appStore', {
    state: ()=> ({      // ref
        userScr: {
            innerW: 0,
            innerH: 0,
            isDarkDevice: false,
            ratioWH: undefined,
            orientation: undefined,
            formFactor: undefined,
            isMobileAndLandscape: undefined,        
        },
    }),
    getters: {      // computed
        isDesktop : (state)=> state.userScr.formFactor === 'Desktop|Laptop' ? true : false, 
        // does not mutate original state
    },
    actions: {      // function(); will mutate original state
        m_userScrW() { this.userScr.innerW = window.innerWidth },
        m_userScrH() { this.userScr.innerH = window.innerHeight },
        m_userScrFormFactor() { this.userScr.formFactor = getUserDeviceFormFactor() },
        m_userScrIsMobileAndLandscape() { this.userScr.isMobileAndLandscape = getIsMobileAndLandscapeStatus() },
        m_userScrOrientation() { this.userScr.orientation = window.screen.orientation.type },
        m_userScrRatioWH() { this.userScr.ratioWH = (window.screen.width / window.screen.height).toFixed(2) * 1 },
        m_userScrIsDarkDevice() { this.userScr.isDarkDevice = getIsDarkDeviceStatus() }
    }
})

function getUserDeviceFormFactor() {
    // CSS pixel breakpoint is set to 1024
    let orientation = window.screen.orientation.type
    if(
        orientation === 'portrait-primary' || 
        orientation === 'portrait-secondary'
    ) {
        let ratio = window.screen.width / window.screen.height
        if(window.screen.height < 1024) {     // entering hand-held devices
            if      (ratio < 0.5) return 'Smartphone'
            else if (0.5 <= ratio && ratio < 1) return 'Tablet'
            else return 'unknown form factor 1'
        }
        else {    // if height > 1024px in portrait i.e: vertical LED screen
            return 'Desktop|Laptop'
        }
    }
    else if(
        orientation==='landscape-primary' || 
        orientation==='landscape-secondary'
    ) {
        if(window.screen.width < 1024) {
            let ratio = window.screen.height / window.screen.width
            if      (ratio < 0.5) return 'Smartphone'
            else if (0.5 <= ratio && ratio < 1) return 'Tablet'
            else return 'unknown form factor 2'
        }
        else {    // if width > 1024px in landscape i.e: laptops or normal horizontal desktop screens 
            return 'Desktop|Laptop'
        }
    }
    else return 'unknown form factor 3'
}
function getIsMobileAndLandscapeStatus() {
    let orientation = window.screen.orientation.type
    let formFactor = getUserDeviceFormFactor()
    if(
        (formFactor === 'Smartphone' || formFactor === 'Tablet') && 
        (orientation === 'landscape-primary'|| orientation === 'landscape-secondary')
    ) return true
    else return false
}
function getIsDarkDeviceStatus() {
    let isDark = window.matchMedia("(prefers-color-scheme:dark)").matches
    if(isDark) return true
    else return false        
}

// // parent side codes
// const appStore = useMainStorePinia()
// function updateUserScreenPropertiesOnMounted() {   
//     appStore.m_userScrW()
//     appStore.m_userScrH()
//     appStore.m_userScrFormFactor()
//     appStore.m_userScrIsMobileAndLandscape()
//     appStore.m_userScrOrientation()
//     appStore.m_userScrRatioWH()
//     appStore.m_userScrIsDarkDevice()
//   }

//      use event listener at parent side 
//      useEventListener('resize', ()=> { updateUserScreenPropertiesOnMounted() })
//      useEventListener(window.matchMedia("(prefers-color-scheme:dark)"), 'change', ()=>{ updateUserScreenPropertiesOnMounted() })

// export default defineNuxtConfig({
//     devtools: { enabled: false },
//     modules: [
//       '@nuxtjs/tailwindcss',
//       '@vueuse/nuxt',
//       '@pinia/nuxt',  
//     ],
//     css: [
//       '/assets/style.css',
//     ],
//     pinia: {
//       autoImports: [
//         // automatically imports `defineStore`
//         'defineStore', // don't have to include import { defineStore } from 'pinia' anymore
//         ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
//       ],
//     },  
// })
  