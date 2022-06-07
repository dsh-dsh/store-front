import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import { Store } from "./js/Store";
import { router } from "./js/Routes";

import ToastService from 'primevue/toastservice';

const app = createApp(App)

app.use(PrimeVue)
app.use(Store)
app.use(router)
app.use(ToastService)

app.mount('#app')
