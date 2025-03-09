<template>
  <div class="container mt-5">
    <h1 class="text-success mb-4 text-center fw-bold">Exámenes Realizados</h1>

    <!-- Input de búsqueda -->
    <div class="mb-4 d-flex justify-content-center">
      <input v-model="searchQuery" type="text" class="form-control w-50" placeholder="Buscar por nombre del estudiante..." />
    </div>

    <!-- Spinner de carga -->
    <div v-if="loading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Lista de exámenes -->
    <div v-else>
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="exam in filteredExams" :key="exam.id">
          <div class="card shadow-sm border-0 rounded-3">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">{{ exam.student_name }}</h5>

              <ul class="list-group list-group-flush mt-3">
                <li v-for="(question, index) in exam.parsedQuestions" :key="index" class="list-group-item">
                  <strong class="text-success">{{ question.question }}</strong>
                  <p class="mb-1"><span class="fw-medium">Respuesta:</span> {{ question.answer }}</p>

                  <div v-if="exam.evaluations && exam.evaluations[index]" class="alert p-2 mt-2" :class="getStatusAlertClass(exam.evaluations[index].is_correct)">
                    <strong>{{ getStatusText(exam.evaluations[index].is_correct) }}</strong>
                    <span v-if="exam.evaluations[index].points !== undefined" class="badge bg-dark ms-2">
                      {{ exam.evaluations[index].points }}/10
                    </span>
                    <p class="mt-1 text-muted fst-italic">{{ exam.evaluations[index].feedback }}</p>
                  </div>
                </li>
              </ul>

              <div class="mt-3">
                <div v-if="exam.result && exam.result.score !== undefined" class="progress" style="height: 20px;">
                  <div class="progress-bar" :class="getScoreColorClass(exam.result.score)" role="progressbar" :style="{ width: `${exam.result.score}%` }">
                    {{ exam.result.score.toFixed(1) }}%
                  </div>
                </div>
                <p v-else class="text-muted mt-2">Sin resultados</p>
              </div>

              <div class="form-check mt-3">
                <input type="checkbox" v-model="selectedExams" :value="exam.id" class="form-check-input" />
                <label class="form-check-label">Seleccionar</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="d-flex justify-content-center gap-3 mt-4">
        <button @click="reviewSelected" class="btn btn-success px-4" :disabled="loadingReview">
          <span v-if="loadingReview" class="spinner-border spinner-border-sm me-2"></span>
          Revisar Seleccionados
        </button>
        <button @click="reviewAll" class="btn btn-outline-success px-4" :disabled="loadingReview">
          Revisar Todos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import { useApi } from '../composables/use-api';

const exams = ref([]);
const selectedExams = ref([]);
const loading = ref(true);
const loadingReview = ref(false);
const searchQuery = ref("");

// Filtrar exámenes por nombre del estudiante
const filteredExams = computed(() => {
  return exams.value.filter(exam =>
    exam.student_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Parsear datos de los exámenes
const parseExamData = (exam) => {
  exam.parsedQuestions = typeof exam.questions === 'string' ? JSON.parse(exam.questions) : exam.questions;
  if (exam.result?.feedback) {
    try {
      const feedbackData = typeof exam.result.feedback === 'string' ? JSON.parse(exam.result.feedback) : exam.result.feedback;
      exam.evaluations = feedbackData?.evaluations || [];
    } catch (e) {
      console.error('Error parsing feedback JSON', e);
    }
  }
  return exam;
};

// Obtener la clase de alerta para respuestas correctas/incorrectas
const getStatusAlertClass = (status) => status === true ? 'alert-success' : status === 'partial' ? 'alert-warning' : 'alert-danger';
const getStatusText = (status) => status === true ? 'Correcta' : status === 'partial' ? 'Parcialmente correcta' : 'Incorrecta';
const getScoreColorClass = (score) => score >= 80 ? 'bg-success' : score >= 60 ? 'bg-info' : score >= 40 ? 'bg-warning' : 'bg-danger';

// Cargar exámenes desde la API
const fetchExams = async () => {
  try {
    loading.value = true;
    const response = await useApi("exams", "GET"); // ✅ Usar GET
    exams.value = response.data.map(parseExamData);
  } catch (error) {
    Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los exámenes." });
  } finally {
    loading.value = false;
  }
};

// Revisar exámenes seleccionados
const reviewSelected = async () => {
  if (!selectedExams.value.length) {
    return Swal.fire({ icon: "warning", title: "Advertencia", text: "Selecciona al menos un examen." });
  }
  try {
    loadingReview.value = true;
    await useApi("review-exams", "POST", { exam_ids: selectedExams.value }); // ✅ Enviar payload correcto
    Swal.fire({ icon: "success", title: "Resultados", text: "Exámenes revisados." });
    await fetchExams(); // Recargar exámenes después de revisar
  } catch {
    Swal.fire({ icon: "error", title: "Error", text: "No se pudieron revisar los exámenes." });
  } finally {
    loadingReview.value = false;
  }
};

// Revisar todos los exámenes
const reviewAll = () => {
  selectedExams.value = exams.value.map(exam => exam.id);
  reviewSelected();
};

// Cargar exámenes al montar el componente
onMounted(fetchExams);
</script>

<style scoped>
/* Estilos generales */
.container {
  padding: 20px;
}

.card {
  transition: transform 0.3s ease-in-out;
  margin-bottom: 20px;
}
.card:hover {
  transform: scale(1.02);
}

/* Estilos para el título */
h1 {
  font-size: 2rem;
}

/* Estilos para el input de búsqueda */
.form-control {
  max-width: 100%; /* Asegura que el input no se salga del contenedor en móviles */
}

/* Estilos para la lista de preguntas */
.list-group-item {
  padding: 10px;
}

/* Estilos para los botones */
.btn {
  font-size: 1rem;
  padding: 8px 16px;
}

/* Ajustes para pantallas pequeñas (móviles) */
@media (max-width: 767.98px) {
  h1 {
    font-size: 1.8rem; /* Tamaño más pequeño para móviles */
  }

  .form-control {
    width: 100%; /* El input ocupa todo el ancho en móviles */
  }

  .card {
    margin-bottom: 15px;
  }

  .btn {
    font-size: 0.9rem; /* Tamaño más pequeño para móviles */
    padding: 6px 12px;
  }
}

/* Ajustes adicionales para pantallas muy pequeñas */
@media (max-width: 575.98px) {
  h1 {
    font-size: 1.5rem; /* Tamaño más pequeño para móviles pequeños */
  }

  .card {
    margin-bottom: 10px;
  }

  .btn {
    font-size: 0.8rem; /* Tamaño más pequeño para móviles pequeños */
    padding: 5px 10px;
  }
}
</style>