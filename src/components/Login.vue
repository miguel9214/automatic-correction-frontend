<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-lg p-4" style="width: 400px;">
            <h2 class="text-center mb-4">Iniciar Sesión</h2>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input type="email" id="email" v-model="email" class="custom-input form-control"
                        placeholder="name@example.com" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input type="password" id="password" v-model="password" class="custom-input form-control"
                        placeholder="••••••••" required />
                </div>
                <button type="submit" class="btn btn-success w-100">Iniciar Sesión</button>

                <!-- Mensaje de error -->
                <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
                    {{ errorMessage }}
                </div>
            </form>

            <p class="text-center mt-3">
                ¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { useApi } from "../composables/use-api";
import { useAuthStore } from "../stores/auth"; // 🔥 Importa el store de autenticación

export default {
    data() {
        return {
            email: "admin@gmail.com",
            password: "123456",
            errorMessage: "",
        };
    },
    methods: {
        async login() {
            this.errorMessage = "";
            try {
                const response = await useApi("auth/login", "POST", {
                    email: this.email,
                    password: this.password,
                });

                console.log("Login successful", response);

                // Guardar el token en localStorage
                localStorage.setItem("access_token", response.access_token);

                // 🔥 Actualizar el store de autenticación
                const authStore = useAuthStore();
                authStore.login(response.access_token);

                console.log("Redirigiendo a /home...");
                this.$router.push("/home");
            } catch (error) {
                console.error("Error logging in", error);
                this.errorMessage = "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
            }
        },
    },
};
</script>


<style scoped>
.d-flex {
    min-height: 100vh;
}

.card {
    border-radius: 10px;
}

h2 {
    font-weight: bold;
    color: #333;
}

p {
    font-size: 0.9rem;
}

.custom-input {
    border: 2px solid #ced4da;
    border-radius: 10px;
    background-color: #f8f9fa;
    padding: 12px;
    font-size: 1rem;
    color: #495057;
    transition: all 0.3s ease;
}


.custom-input:focus {
    border-color: #6cbf8a;
    background-color: #ffffff;
    box-shadow: 0 0 5px rgba(108, 191, 138, 0.5);
    outline: none;
}

.custom-input::placeholder {
    color: #adb5bd;
}

.btn {
    padding: 12px;
    font-size: 1.1rem;
}
</style>