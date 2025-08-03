import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);

const queryClient = new QueryClient();

app.use(VueQueryPlugin, {
  queryClient,
});

app.use(createPinia());

app.mount("#app");
