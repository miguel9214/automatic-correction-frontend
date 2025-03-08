<template>
  <div class="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
    <div class="card shadow-lg p-4" style="max-width: 500px;">
      <div class="card-body">
        <h1 class="text-success fw-bold mb-3">Bienvenido</h1>
        <p class="lead text-muted">Plataforma de corrección automática de exámenes</p>
        <hr />
        <router-link to="/exams" class="btn btn-success btn-lg">
          <i class="bi bi-clipboard-check me-2"></i> Ir a Exámenes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
.container {
  background: linear-gradient(to right, #e3f2fd, #e8f5e9);
}
.card {
  border-radius: 15px;
  border: none;
}
</style>
