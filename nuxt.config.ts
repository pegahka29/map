// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  components: {
    global: true,
    dirs: ['~/components']
  },
  css: ["~/assets/scss/main.scss"],

})
