<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-lg p-4" style="width: 400px;">
            <h2 class="text-center mb-4">Iniciar Sesión</h2>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input type="email" id="email" v-model="email" class="custom-input form-control"
                        placeholder="name@example.com" required @input="clearError" />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input type="password" id="password" v-model="password" class="custom-input form-control"
                        placeholder="••••••••" required @input="clearError" />
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

                // Manejo de errores específicos
                if (error.response && error.response.status === 401) {
                    this.errorMessage = "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
                } else if (error.response && error.response.status === 500) {
                    this.errorMessage = "Error en el servidor. Por favor, inténtalo más tarde.";
                } else if (error.message === "Network Error") {
                    this.errorMessage = "Error de conexión. Verifica tu conexión a Internet.";
                } else {
                    this.errorMessage = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
                }
            }
        },
        clearError() {
            this.errorMessage = ""; // Limpiar el mensaje de error al editar los campos
        },
    },
};
</script>