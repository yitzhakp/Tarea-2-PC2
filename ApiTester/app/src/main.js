import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { createApp } from 'vue'
import App from './App.vue'
import HttpRequest from './components/HttpRequest.vue';

const app = createApp(App);
app.component('HttpRequest', HttpRequest); // Agrega esta línea si no lo has hecho
app.mount('#app');