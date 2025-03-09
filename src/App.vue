<template>
  <header v-if="shouldShowNavbar">
    <nav class="navbar navbar-expand-lg bg-success navbar-dark shadow-lg fixed-top">
      <div class="container-fluid">
        <!-- LOGO -->
        <RouterLink to="/home" class="navbar-brand fw-bold d-flex align-items-center">
          <i class="bi bi-journal-check me-2"></i> Corrector de Exámenes
        </RouterLink>

        <!-- BOTÓN PARA COLAPSAR NAV EN MÓVILES -->
        <button
          class="navbar-toggler border-0"
          type="button"
          @click="toggleNavbar"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- MENÚ NAVEGACIÓN -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav" :class="{ show: isNavbarOpen }">
          <ul class="navbar-nav align-items-center">
            <li class="nav-item">
              <RouterLink to="/home" class="nav-link" @click="closeNavbar">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/exams" class="nav-link" @click="closeNavbar">Exámenes</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/test" class="nav-link" @click="closeNavbar">Realizar pruebas</RouterLink>
            </li>

            <!-- PERFIL Y CERRAR SESIÓN -->
            <li class="nav-item dropdown ms-3">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1 fs-5"></i> Mi Cuenta
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <button @click="logout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <!-- Contenido principal con margen superior -->
  <main class="container-fluid mt-5 pt-5 px-3">
    <RouterView />
  </main>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    // Estado del navbar colapsado
    const isNavbarOpen = ref(false);

    // Cierra el navbar
    const closeNavbar = () => {
      isNavbarOpen.value = false;
    };

    // Alterna el navbar
    const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value;
    };

    // Observa cambios en la ruta para cerrar el navbar
    watch(
      () => route.path,
      () => {
        closeNavbar();
      }
    );

    // Ocultar Navbar en Login y Registro
    const shouldShowNavbar = computed(() => authStore.isAuthenticated && !["/", "/register"].includes(route.path));

    // Función para cerrar sesión
    const logout = () => {
      authStore.logout();
      router.push("/"); // Redirige al login después de cerrar sesión
    };

    return { shouldShowNavbar, logout, isNavbarOpen, closeNavbar, toggleNavbar };
  },
};
</script>

<style scoped>
/* Estilos generales para el navbar */
.navbar {
  padding: 0.75rem 1rem; /* Ajuste de padding para móviles */
}

.navbar-brand {
  font-size: 1.25rem; /* Tamaño del logo */
}

.navbar-toggler {
  padding: 0.5rem; /* Ajuste del botón toggler */
}

/* Estilos para los enlaces del navbar */
.navbar-nav .nav-link {
  transition: color 0.3s ease-in-out;
  font-size: 1rem;
  padding: 0.5rem 1rem; /* Ajuste de padding para móviles */
}

.navbar-nav .nav-link:hover {
  color: #d4edda !important; /* Verde claro */
}

/* Estilos para el menú desplegable */
.dropdown-menu {
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem; /* Ajuste de margen */
}

.dropdown-item {
  transition: background 0.3s ease;
  font-size: 0.95rem;
  padding: 0.5rem 1rem; /* Ajuste de padding */
}

.dropdown-item:hover {
  background: #f8d7da; /* Rojo suave */
}

/* Ajustes para móviles */
@media (max-width: 767.98px) {
  .navbar-brand {
    font-size: 1.1rem; /* Tamaño más pequeño para móviles */
  }

  .navbar-nav .nav-link {
    font-size: 0.95rem; /* Tamaño más pequeño para móviles */
    padding: 0.5rem 0.75rem; /* Menos padding en móviles */
  }

  .dropdown-menu {
    min-width: 180px; /* Menos ancho en móviles */
  }

  .dropdown-item {
    font-size: 0.9rem; /* Tamaño más pequeño para móviles */
  }
}

/* Evita que el contenido quede oculto detrás del navbar fijo */
main {
  padding-top: 80px; /* Ajuste de margen superior */
  padding-left: 1rem; /* Padding lateral para móviles */
  padding-right: 1rem; /* Padding lateral para móviles */
}

/* Ajustes adicionales para pantallas pequeñas */
@media (max-width: 575.98px) {
  main {
    padding-top: 70px; /* Menos margen superior en móviles pequeños */
  }
}
</style>