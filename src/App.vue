<template>
  <header v-if="shouldShowNavbar">
    <nav class="navbar navbar-expand-lg bg-success navbar-dark shadow-lg fixed-top">
      <div class="container">
        <!-- LOGO -->
        <RouterLink to="/home" class="navbar-brand fw-bold d-flex align-items-center">
          <i class="bi bi-journal-check me-2"></i> Corrector de Exámenes
        </RouterLink>

        <!-- BOTÓN PARA COLAPSAR NAV EN MÓVILES -->
        <button
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- MENÚ NAVEGACIÓN -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav align-items-center">
            <li class="nav-item">
              <RouterLink to="/home" class="nav-link">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/exams" class="nav-link">Exámenes</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/test" class="nav-link">Realizar pruebas</RouterLink>
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

  <!-- ✅ Agregamos margen arriba para que el contenido no quede oculto -->
  <main class="container mt-5 pt-5">
    <RouterView />
  </main>
</template>

<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    // Ocultar Navbar en Login y Registro
    const shouldShowNavbar = computed(() => authStore.isAuthenticated && !["/", "/register"].includes(route.path));

    // Función para cerrar sesión
    const logout = () => {
      authStore.logout();
      router.push("/"); // Redirige al login después de cerrar sesión
    };

    return { shouldShowNavbar, logout };
  },
};
</script>

<style>
/* ✅ Estilos para modernizar */
.navbar-nav .nav-link {
  transition: color 0.3s ease-in-out;
  font-size: 1rem;
}
.navbar-nav .nav-link:hover {
  color: #d4edda !important; /* Verde claro */
}
.dropdown-menu {
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.dropdown-item {
  transition: background 0.3s ease;
  font-size: 0.95rem;
}
.dropdown-item:hover {
  background: #f8d7da; /* Rojo suave */
}

/* ✅ Evita que el contenido quede oculto detrás del navbar fijo */
main {
  padding-top: 80px;
}
</style>
