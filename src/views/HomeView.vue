<template>
  <div class="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
    <div class="card shadow-lg p-4" style="max-width: 500px; width: 100%;">
      <div class="card-body">
        <h1 class="text-success fw-bold mb-3">Bienvenido</h1>
        <p class="lead text-muted">Plataforma de corrección automática de exámenes</p>
        <hr />
        <router-link to="/exams" class="btn btn-success btn-lg w-100">
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
/* Estilos generales */
.container {
  background: linear-gradient(to right, #e3f2fd, #e8f5e9);
  padding: 20px; /* Añade padding para móviles */
}

.card {
  border-radius: 15px;
  border: none;
  width: 100%; /* Asegura que la tarjeta ocupe el ancho disponible */
}

/* Estilos para el título */
h1 {
  font-size: 2rem; /* Tamaño más grande para móviles */
}

/* Estilos para el párrafo */
.lead {
  font-size: 1.1rem; /* Tamaño más grande para móviles */
}

/* Estilos para el botón */
.btn-lg {
  font-size: 1.1rem; /* Tamaño más grande para móviles */
  padding: 10px 20px; /* Ajuste de padding para móviles */
}

/* Ajustes para pantallas pequeñas (móviles) */
@media (max-width: 767.98px) {
  .container {
    padding: 10px; /* Menos padding en móviles */
  }

  h1 {
    font-size: 1.8rem; /* Tamaño más pequeño para móviles */
  }

  .lead {
    font-size: 1rem; /* Tamaño más pequeño para móviles */
  }

  .btn-lg {
    font-size: 1rem; /* Tamaño más pequeño para móviles */
    padding: 8px 16px; /* Menos padding en móviles */
  }

  .card {
    padding: 20px; /* Menos padding en móviles */
  }
}

/* Ajustes adicionales para pantallas muy pequeñas */
@media (max-width: 575.98px) {
  h1 {
    font-size: 1.5rem; /* Tamaño más pequeño para móviles pequeños */
  }

  .lead {
    font-size: 0.9rem; /* Tamaño más pequeño para móviles pequeños */
  }

  .btn-lg {
    font-size: 0.9rem; /* Tamaño más pequeño para móviles pequeños */
    padding: 6px 12px; /* Menos padding en móviles pequeños */
  }

  .card {
    padding: 15px; /* Menos padding en móviles pequeños */
  }
}
</style>