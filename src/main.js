import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el router
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap
import 'bootstrap'; // Importa el JS de Bootstrap (opcional)
import axios from 'axios'; // Importa Axios
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Configura Axios (opcional)
// axios.defaults.baseURL = 'http://automatic-correction-backend.test/api'; // Establece la URL base para las solicitudes
// axios.defaults.headers.common['Accept'] = 'application/json'; // Establece los headers por defecto

// Crea la aplicación Vue
const app = createApp(App);

// Usa el router
app.use(router);

// Configura SweetAlert2 como global (opcional)
app.config.globalProperties.$swal = Swal;

// Monta la aplicación en el elemento con id 'app'
app.mount('#app');