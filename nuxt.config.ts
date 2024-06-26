// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      title: "Chat App",
    },
  },
  runtimeConfig: {
    public: {
      errorMessage: "An unknown error has occurred",
      successMessage: "Action has been performed successfully",
      noResultsMessage: "No results found",
      apiUrl: "",
      wsUrl: "",
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  components: [
    "~/components",
    "~/components/ui",
    "~/components/user",
    "~/components/alerts",
  ],
});
