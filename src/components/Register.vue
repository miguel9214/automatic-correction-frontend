<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
      <h2 class="text-center mb-4">Regístrate</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="custom-input form-control"
            placeholder="Tu nombre"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="custom-input form-control"
            placeholder="name@example.com"
            required
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
          />
        </div>
        <button type="submit" class="btn btn-success w-100">Registrarse</button>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
          {{ errorMessage }}
        </div>
      </form>

      <p class="text-center mt-3">
        ¿Ya tienes una cuenta? <router-link to="/">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { useApi } from '../composables/use-api';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      this.errorMessage = '';
      try {
        const response = await useApi('auth/register', 'post', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        console.log('Registration successful', response);

        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Ahora puedes iniciar sesión.',
        });

        // Redirigir al usuario a la página de inicio de sesión
        this.$router.push('/');
      } catch (error) {
        console.error('Error registering', error);

        await Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: error.response?.data?.message || 'Por favor, inténtalo de nuevo.',
        });
      }
    },
  },
};
</script>

<style scoped>
/* Alineación centrada en toda la página */
.d-flex {
  min-height: 100vh; /* Usamos min-height en lugar de height */
}

/* Estilo de la tarjeta de registro */
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

/* Estilo del enlace para iniciar sesión */
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