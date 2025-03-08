<template>
  <header>
    <!-- Navbar moderno con diseño elegante -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div class="container">
        <RouterLink to="/" class="navbar-brand fw-bold d-flex align-items-center">
          <i class="bi bi-journal-check me-2"></i> Corrector de Exámenes
        </RouterLink>
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
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
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
/* Estilos personalizados para un diseño moderno */
.navbar {
  padding: 1rem;
  background: linear-gradient(135deg, #28a745, #218838);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.6rem;
  display: flex;
  align-items: center;
}

.nav-link {
  font-size: 1.1rem;
  margin: 0 12px;
  transition: all 0.3s ease-in-out;
  position: relative;
}

.nav-link::after {
  content: "";
  display: block;
  width: 0;
  height: 2px;
  background: #fff;
  transition: width 0.3s ease-in-out;
  position: absolute;
  bottom: -3px;
  left: 0;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: #d4edda !important;
}

.navbar-toggler {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 4px;
}

.navbar-toggler:focus {
  box-shadow: none;
}

main {
  margin-top: 80px;
}
</style>
