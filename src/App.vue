<template>
  <header>
    <!-- Navbar moderno con color verde -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand fw-bold">Corrector de Exámenes</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/exams" class="nav-link">Exámenes</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/test" class="nav-link">Realizar pruebas</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="container mt-5 pt-4">
    <RouterView />
  </main>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
/* Estilos personalizados */
.navbar {
  padding: 1rem 0; /* Aumenta el padding para más espacio */
}

.navbar-brand {
  font-size: 1.5rem; /* Tamaño más grande para el logo */
}

.nav-link {
  font-size: 1.1rem; /* Tamaño más grande para los enlaces */
  margin: 0 10px; /* Espacio entre los enlaces */
  transition: color 0.3s ease; /* Transición suave para el hover */
}

.nav-link:hover {
  color: #d1fae5 !important; /* Color más claro al hacer hover */
}

main {
  margin-top: 80px; /* Ajusta el margen superior para que el contenido no se solape con el nav */
}
</style>