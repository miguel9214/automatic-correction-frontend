import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth'; // ✅ Importa el store
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Swal from 'sweetalert2';

// ✅ Crea Pinia y la app
const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// ✅ Inicializa la autenticación antes de montar la app
const authStore = useAuthStore();
authStore.initializeAuth(); // 🔥 Recupera el token al iniciar

// ✅ Configura SweetAlert2 globalmente
app.config.globalProperties.$swal = Swal;

app.mount('#app');

