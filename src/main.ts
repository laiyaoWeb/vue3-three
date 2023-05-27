import { createApp } from 'vue'
import './style.css'
import '@/assets/index.css'
import App from './App.vue'
import router from './router'
import mqttClient from './utils/mqttClient';
import { clientOptions, mqttUrl } from "@/config/mqttConfig";

mqttClient.connect(mqttUrl, clientOptions);

const app = createApp(App);

// app.use(globalComponents);
// app.use(globalDirectives);
// app.use(pinia)
// app.use(ElementPlus, { locale })
app.use(router)

app.mount('#app');
