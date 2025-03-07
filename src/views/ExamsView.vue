<template>
  <div class="container mt-5">
    <h1 class="text-success mb-4">Exámenes Realizados</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <table class="table table-striped table-hover">
        <thead class="table-success">
          <tr>
            <th scope="col">Seleccionar</th>
            <th scope="col">Nombre del Estudiante</th>
            <th scope="col">Preguntas</th>
            <th scope="col">Resultados</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id">
            <td>
              <input
                type="checkbox"
                v-model="selectedExams"
                :value="exam.id"
                class="form-check-input"
              />
            </td>
            <td>{{ exam.student_name }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(question, index) in exam.parsedQuestions" :key="index" class="mb-3">
                  <strong class="text-success">{{ question.question }}</strong>
                  <div>
                    <span class="fw-medium">Respuesta:</span> {{ question.answer }}
                  </div>
                  
                  <div v-if="exam.result && exam.evaluations && exam.evaluations[index]" class="mt-2 border-start ps-3 border-success">
                    <div class="d-flex align-items-center gap-2">
                      <span class="fw-medium">Estado:</span>
                      <span :class="getStatusClass(exam.evaluations[index].is_correct)">
                        {{ getStatusText(exam.evaluations[index].is_correct) }}
                      </span>
                      <span v-if="exam.evaluations[index].points !== undefined" class="badge bg-secondary ms-2">
                        {{ exam.evaluations[index].points }}/10
                      </span>
                    </div>
                    <div class="mt-1 text-muted fst-italic">
                      {{ exam.evaluations[index].feedback }}
                    </div>
                  </div>
                </li>
              </ul>
            </td>
            <td>
              <div v-if="exam.result && exam.result.score !== undefined">
                <div class="mb-3">
                  <div class="progress" style="height: 25px;">
                    <div 
                      class="progress-bar" 
                      :class="getScoreColorClass(exam.result.score)"
                      role="progressbar" 
                      :style="`width: ${exam.result.score}%`" 
                      :aria-valuenow="exam.result.score" 
                      aria-valuemin="0" 
                      aria-valuemax="100">
                      {{ exam.result.score.toFixed(1) }}%
                    </div>
                  </div>
                </div>
                <div v-if="exam.evaluations && exam.evaluations.length > 0">
                  <p><strong class="text-success">Resumen:</strong></p>
                  <ul>
                    <li>Correctas: {{ getCorrectCount(exam.evaluations) }}</li>
                    <li>Parciales: {{ getPartialCount(exam.evaluations) }}</li>
                    <li>Incorrectas: {{ getIncorrectCount(exam.evaluations) }}</li>
                  </ul>
                </div>
              </div>
              <div v-else class="text-muted">Sin resultados</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-2">
        <button @click="reviewSelected" class="btn btn-success" :disabled="loading">
          <span v-if="loadingReview" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Revisar Seleccionados
        </button>
        <button @click="reviewAll" class="btn btn-outline-success" :disabled="loading || loadingReview">
          Revisar Todos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const exams = ref([]);
const selectedExams = ref([]);
const loading = ref(true);
const loadingReview = ref(false);

// Función para parsear las preguntas y agregar evaluaciones
const parseExamData = (exam) => {
  // Parseamos las preguntas si no están en formato objeto
  if (typeof exam.questions === 'string') {
    exam.parsedQuestions = JSON.parse(exam.questions);
  } else {
    exam.parsedQuestions = exam.questions;
  }
  
  // Si hay resultados, procesamos las evaluaciones
  if (exam.result && exam.result.feedback) {
    let feedbackData;
    
    // Parseamos el feedback si es string
    if (typeof exam.result.feedback === 'string') {
      try {
        feedbackData = JSON.parse(exam.result.feedback);
      } catch (e) {
        console.error('Error parsing feedback JSON', e);
        feedbackData = { evaluations: [] };
      }
    } else {
      feedbackData = exam.result.feedback;
    }
    
    // Extraemos las evaluaciones
    if (feedbackData && feedbackData.evaluations) {
      exam.evaluations = feedbackData.evaluations;
    }
  }
  
  return exam;
};

// Función para obtener la clase CSS según el estado de la respuesta
const getStatusClass = (status) => {
  if (status === true) return 'text-success fw-bold';
  if (status === 'partial') return 'text-warning fw-bold';
  return 'text-danger fw-bold';
};

// Función para obtener el texto según el estado de la respuesta
const getStatusText = (status) => {
  if (status === true) return 'Correcta';
  if (status === 'partial') return 'Parcialmente correcta';
  return 'Incorrecta';
};

// Función para obtener la clase de color de la barra de progreso según la puntuación
const getScoreColorClass = (score) => {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-info';
  if (score >= 40) return 'bg-warning';
  return 'bg-danger';
};

// Función para contar respuestas correctas
const getCorrectCount = (evaluations) => {
  return evaluations.filter(e => e.is_correct === true).length;
};

// Función para contar respuestas parcialmente correctas
const getPartialCount = (evaluations) => {
  return evaluations.filter(e => e.is_correct === 'partial').length;
};

// Función para contar respuestas incorrectas
const getIncorrectCount = (evaluations) => {
  return evaluations.filter(e => e.is_correct === false).length;
};

const fetchExams = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://automatic-correction-backend.test/api/exams');
    exams.value = response.data.data.map(parseExamData);
    console.log('Exams', exams.value);
  } catch (error) {
    console.error('Error fetching exams', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los exámenes.',
    });
  } finally {
    loading.value = false;
  }
};

const reviewSelected = async () => {
  if (selectedExams.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Selecciona al menos un examen.',
    });
    return;
  }

  try {
    loadingReview.value = true;
    const response = await axios.post('http://automatic-correction-backend.test/api/review-exams', {
      exam_ids: selectedExams.value,
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Resultados',
      text: 'Los exámenes seleccionados han sido revisados.',
    });
    
    await fetchExams(); // Recargar los exámenes después de la revisión
  } catch (error) {
    console.error('Error reviewing exams', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron revisar los exámenes.',
    });
  } finally {
    loadingReview.value = false;
  }
};

const reviewAll = () => {
  selectedExams.value = exams.value.map((exam) => exam.id);
  reviewSelected();
};

onMounted(() => {
  fetchExams();
});
</script>

<style scoped>
/* Estilos personalizados */
.table-success {
  background-color: #d1fae5; /* Fondo verde claro para la cabecera de la tabla */
}

.btn-success {
  background-color: #28a745; /* Verde más oscuro para el botón principal */
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838; /* Verde más oscuro al hacer hover */
  border-color: #218838;
}

.btn-outline-success {
  color: #28a745; /* Verde para el botón secundario */
  border-color: #28a745;
}

.btn-outline-success:hover {
  background-color: #28a745; /* Fondo verde al hacer hover */
  color: white;
}

.text-success {
  color: #28a745 !important; /* Verde para los textos destacados */
}

.text-danger {
  color: #dc3545 !important; /* Rojo para los textos de error */
}

.text-warning {
  color: #ffc107 !important; /* Amarillo para los textos de advertencia */
}
</style>