<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
        <h2 class="text-center mb-4">Iniciar Sesión</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="custom-input form-control"
              placeholder="name@example.com"
              required
              @input="clearError"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="custom-input form-control"
              placeholder="••••••••"
              required
              @input="clearError"
            />
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
  
  <style scoped>
  /* Alineación centrada en toda la página */
  .d-flex {
    min-height: 100vh;
    padding: 20px; /* Añade padding para móviles */
  }
  
  /* Estilo de la tarjeta de inicio de sesión */
  .card {
    border-radius: 10px;
    width: 100%; /* Asegura que la tarjeta ocupe el ancho disponible */
  }
  
  /* Título de la página */
  h2 {
    font-weight: bold;
    color: #333;
    font-size: 1.8rem; /* Tamaño más grande para móviles */
  }
  
  /* Estilo personalizado para los inputs */
  .custom-input {
    border: 2px solid #ced4da;
    border-radius: 10px;
    background-color: #f8f9fa;
    padding: 12px;
    font-size: 1rem;
    color: #495057;
    transition: all 0.3s ease;
  }
  
  /* Efecto de foco en los inputs */
  .custom-input:focus {
    border-color: #6cbf85; /* Color verde al hacer foco */
    background-color: #ffffff;
    box-shadow: 0 0 5px rgba(108, 191, 138, 0.5);
    outline: none;
  }
  
  /* Placeholder estilizado */
  .custom-input::placeholder {
    color: #adb5bd;
  }
  
  /* Mejora del aspecto del botón */
  .btn {
    padding: 12px;
    font-size: 1.1rem;
  }
  
  /* Estilo del enlace para registrarse */
  p {
    font-size: 0.9rem;
  }
  
  /* Estilo del mensaje de error */
  .alert-danger {
    font-size: 0.9rem;
    padding: 10px;
  }
  
  /* Ajustes para pantallas pequeñas (móviles) */
  @media (max-width: 767.98px) {
    h2 {
      font-size: 1.5rem; /* Tamaño más pequeño para móviles */
    }
  
    .custom-input {
      padding: 10px; /* Menos padding en móviles */
      font-size: 0.9rem; /* Tamaño más pequeño para móviles */
    }
  
    .btn {
      padding: 10px; /* Menos padding en móviles */
      font-size: 1rem; /* Tamaño más pequeño para móviles */
    }
  
    p {
      font-size: 0.8rem; /* Tamaño más pequeño para móviles */
    }
  
    .alert-danger {
      font-size: 0.8rem; /* Tamaño más pequeño para móviles */
      padding: 8px; /* Menos padding en móviles */
    }
  }
  
  /* Ajustes adicionales para pantallas muy pequeñas */
  @media (max-width: 575.98px) {
    h2 {
      font-size: 1.3rem; /* Tamaño más pequeño para móviles pequeños */
    }
  
    .custom-input {
      padding: 8px; /* Menos padding en móviles pequeños */
      font-size: 0.8rem; /* Tamaño más pequeño para móviles pequeños */
    }
  
    .btn {
      padding: 8px; /* Menos padding en móviles pequeños */
      font-size: 0.9rem; /* Tamaño más pequeño para móviles pequeños */
    }
  
    p {
      font-size: 0.75rem; /* Tamaño más pequeño para móviles pequeños */
    }
  
    .alert-danger {
      font-size: 0.75rem; /* Tamaño más pequeño para móviles pequeños */
      padding: 6px; /* Menos padding en móviles pequeños */
    }
  }
  </style>