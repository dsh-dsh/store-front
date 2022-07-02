import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import { store } from "./js/stores/Store";
import { router } from "./js/Routes";
import Tooltip from 'primevue/tooltip';

import ToastService from 'primevue/toastservice';

const app = createApp(App)


app.use(PrimeVue)
app.use(store)
app.use(router)
app.use(ToastService)
app.directive('tooltip', Tooltip);

app.mount('#app')
